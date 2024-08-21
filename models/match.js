import {client} from "../config/db.js";
import {fetchUnusedRandomWord} from "./words.js";

// Function to seed the matches table
export const seedMatches = async () => {
    try {
        await client.query(
            `
                CREATE TABLE IF NOT EXISTS match_results
                (
                    id
                    SERIAL,
                    player1_username
                    VARCHAR
                (
                    255
                ) NOT NULL REFERENCES users
                (
                    username
                ) ON DELETE CASCADE,
                    player2_username VARCHAR
                (
                    255
                ) NOT NULL REFERENCES users
                (
                    username
                )
                  ON DELETE CASCADE,
                    score JSON NOT NULL DEFAULT '[
                            {"username1": "username1", "wins": "0"},
                            {"username2": "username2", "wins": "0"}
                        ]'::json,
                    guesses JSON NOT NULL DEFAULT '{
                            "username1": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0},
                            "username2": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}
                        }'::json,
                    used_words TEXT[] NOT NULL,
                    PRIMARY KEY
                (
                    id,
                    player1_username,
                    player2_username
                )
                    );
            `
        );
        console.log("Matches table seeded successfully!");
    } catch (error) {
        console.error("Failed to seed matches table!", error);
    }
};

// Initialize matches for friends
export const startFighting = async (user1Username, user2username) => {
    try {
        await client.query(
            `
                INSERT INTO match_results (player1_username, player2_username)
                VALUES ($1, $2);
            `,
            [user1Username, user2username]
        );
        console.log("Friendship Destroyer was created");
    } catch (error) {
        console.error("Failed to destroy friendships");
    }
};

// Function to start the PvP game with two usernames
export const startPvPGame = async (player1Username, player2Username) => {
    try {
        // Fetch a random word that hasn't been used by these players
        const randomWord = await fetchUnusedRandomWord(player1Username, player2Username);

        console.log("PvP Game started successfully with word:");
        return { message: "PvP Game started successfully", word: randomWord };
    } catch (error) {
        console.error("Failed to start PvP game:", error);
        throw error;
    }
};


// Function to end the PvP game and update scores, guesses, and used words
export const endPvPGame = async (
    player1Username,
    player1Guesses,
    player2Username,
    player2Guesses,
    winner,
    word
) => {
    try {
        const { rows: matchRows } = await client.query(
            `
                SELECT score, guesses, used_words FROM match_results
                WHERE (player1_username = $1 AND player2_username = $2)
                   OR (player1_username = $2 AND player2_username = $1)
            `,
            [player1Username, player2Username]
        );

        if (matchRows.length === 0) {
            throw new Error("Match not found!");
        }

        let matchData = matchRows[0];

        // Update guesses for both players
        matchData.guesses[player1Username][`${player1Guesses}`] += 1;
        matchData.guesses[player2Username][`${player2Guesses}`] += 1;

        // Update score for the winner
        if (winner) {
            if (winner === player1Username) {
                matchData.score[player1Username].wins += 1;
            } else if (winner === player2Username) {
                matchData.score[player2Username].wins += 1;
            }
        } else {
            // Handle ties if needed
            matchData.ties = (matchData.ties || 0) + 1;
        }

        // Ensure the word is valid before adding to used_words
        const usedWordsSet = new Set(matchData.used_words || []);
        if (word && word.trim()) {
            usedWordsSet.add(word);
        }

        const updatedUsedWords = Array.from(usedWordsSet);

        // Update the database
        const { rows } = await client.query(
            `
            UPDATE match_results
            SET score = $1::json,
                guesses = $2::json,
                used_words = $3::text[]
            WHERE player1_username = $4 AND player2_username = $5
               OR player1_username = $5 AND player2_username = $4
            RETURNING *;
            `,
            [
                JSON.stringify(matchData.score),
                JSON.stringify(matchData.guesses),
                updatedUsedWords,
                player1Username,
                player2Username,
            ]
        );

        console.log("PvP Game ended successfully!");
        return { message: "PvP Game ended successfully", matchData: rows[0] };
    } catch (error) {
        console.error("Failed to end PvP game:", error);
        throw error;
    }
};
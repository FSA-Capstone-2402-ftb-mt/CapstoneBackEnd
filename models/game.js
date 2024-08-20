import {client} from "../config/db.js";
import {calculateTimedScore} from "../services/gameService.js";

// Function to update regular game score
export const updateRegularGameScore = async (
    username,
    correctGuess,
    attempts,
    word
) => {
    try {
        console.log("stuff", word);
        const { rows: userRows } = await client.query(
            `
                SELECT current_streak, max_streak, number_of_games, guesses, used_words
                FROM users
                WHERE username = $1
            `,
            [username]
        );

        const user = userRows[0];
        let currentStreak = user.current_streak;
        let maxStreak = user.max_streak;

        if (correctGuess) {
            currentStreak += 1;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }

        const updatedNumberOfGames = {
            ...user.number_of_games,
            overall_games: parseInt(user.number_of_games.overall_games) + 1,
            regular_games: parseInt(user.number_of_games.regular_games) + 1,
        };

        const updatedGuesses = {
            ...user.guesses,
            [`guess_${attempts}`]: parseInt(user.guesses[`guess_${attempts}`]) + 1,
        };

        // Ensure the word is valid before adding to used_words
        const usedWordsSet = new Set(user.used_words || []);
        if (word && word.trim()) {
            console.log(word);
            usedWordsSet.add(word);
        }

        const updatedUsedWords = Array.from(usedWordsSet);
        console.log(updatedUsedWords);

        const { rows } = await client.query(
            `
                UPDATE users
                SET
                    number_of_games = $1::json,
                guesses = $2::json,
                    current_streak = $3,
                    max_streak = $4,
                    used_words = $5::text[]
                WHERE username = $6
                    RETURNING *;
            `,
            [
                JSON.stringify(updatedNumberOfGames),
                JSON.stringify(updatedGuesses),
                currentStreak,
                maxStreak,
                updatedUsedWords,
                username,
            ]
        );

        return rows[0];
    } catch (error) {
        console.error("Failed to update regular game score!", error);
        throw error;
    }
};


// Function to update timed game score
export const updateTimedGameScore = async (
    username,
    correctGuess,
    attempts,
    timeTaken,
    word
) => {
    try {
        const { rows: userRows } = await client.query(
            `
                SELECT current_streak, max_streak, number_of_games, guesses, used_words
                FROM users
                WHERE username = $1
            `,
            [username]
        );

        const user = userRows[0];
        let currentStreak = user.current_streak;
        let maxStreak = user.max_streak;

        if (correctGuess) {
            currentStreak += 1;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }

        const score = calculateTimedScore(correctGuess, attempts, timeTaken, currentStreak);

        const updatedNumberOfGames = {
            ...user.number_of_games,
            overall_games: parseInt(user.number_of_games.overall_games) + 1,
            timed_games: parseInt(user.number_of_games.timed_games) + 1,
        };

        const updatedGuesses = {
            ...user.guesses,
            [`guess_${attempts}`]: parseInt(user.guesses[`guess_${attempts}`]) + 1,
        };

        // Ensure the word is valid before adding to used_words
        const usedWordsSet = new Set(user.used_words || []);
        if (word && word.trim()) {
            usedWordsSet.add(word);
        }

        const updatedUsedWords = Array.from(usedWordsSet);

        const { rows } = await client.query(
            `
                UPDATE users
                SET
                    timed_score = timed_score + $1,
                    number_of_games = $2::json,
                guesses = $3::json,
                    current_streak = $4,
                    max_streak = $5,
                    used_words = $6::text[]
                WHERE username = $7
                    RETURNING *;
            `,
            [
                score,
                JSON.stringify(updatedNumberOfGames),
                JSON.stringify(updatedGuesses),
                currentStreak,
                maxStreak,
                updatedUsedWords,
                username,
            ]
        );

        return rows[0];
    } catch (error) {
        console.error("Failed to update timed game score!", error);
        throw error;
    }
};
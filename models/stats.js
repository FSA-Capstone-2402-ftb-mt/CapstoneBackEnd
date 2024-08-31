import {client} from "../config/db.js";

// Function to get the user stats
export const getUserStats = async (username) => {
    try {
        const { rows } = await client.query(`
            SELECT username,
                   timed_score,
                   current_streak,
                   max_streak,
                   join_date,
                   COALESCE(array_length(used_words, 1), 0) AS word_count
            FROM users
            WHERE username = $1
        `, [username]);

        if (rows.length === 0) {
            throw new Error('User not found');
        }

        return {
            username: rows[0].username,
            timed_score: rows[0].timed_score,
            current_streak: rows[0].current_streak,
            max_streak: rows[0].max_streak,
            join_date: rows[0].join_date,
            word_count: rows[0].word_count
        };

    } catch (error) {
        console.error('Failed to get user stats', error);
        throw error;
    }
};

// Function to get user's guesses
export const getUserGuesses = async (username) => {
    try {
        const { rows } = await client.query(`
            SELECT guesses AS guess
            FROM users
            WHERE username = $1
        `, [username]);

        if (rows.length === 0) {
            throw new Error('User not found');
        }

        return rows[0].guess || [];

    } catch (error) {
        console.error('Failed to get user guesses', error);
        throw error;
    }
};

// Function to get user's number of games
export const getUserGames = async (username) => {
    try {
        const { rows } = await client.query(`
            SELECT number_of_games AS games
            FROM users
            WHERE username = $1
        `, [username]);

        return rows[0].games || [];

    } catch (error) {
        console.error('Failed to get user games', error);
        throw error;
    }
};



// Function to get leaderboard stats
export const getLeaderboardStats = async () => {
    try {
        const {rows} = await client.query(`
            SELECT username, timed_score
            FROM users
            ORDER BY overall_score DESC LIMIT 10
        `);
        return rows;
    } catch (error) {
        console.error('Failed to get Leaderboard Stats', error);
        throw error;
    }
};
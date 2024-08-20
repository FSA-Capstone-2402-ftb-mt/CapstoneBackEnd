import {client} from "../config/db.js";

// Function to get user Stats
export const getUserStats = async (username) => {
    try {
        const {rows} = await client.query(`
            SELECT username,
                   timed_score,
                   current_streak,
                   max_streak,
                   guesses,
                   number_of_games,
                   join_date,
                   COALESCE(array_length(used_words, 1), 0) AS word_count
            FROM users
            WHERE username = $1
        `, [username]);
        return rows[0];
    } catch (error) {
        console.error('Failed to get user stats', error);
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
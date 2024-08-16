import { client } from "../config/db.js";

// Function to get user Stats
export const getUserStats = async (username) => {
    try {
        const { rows } = await client.query(`
            SELECT username, regular_score, timed_score, overall_score, guess_1, guess_2, guess_3, guess_4, guess_5, guess_6, overall_games, regular_games, timed_games, join_date
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
        const { rows } = await client.query(`
            SELECT username, regular_score, timed_score, overall_score
            FROM users
            ORDER BY overall_score DESC
            LIMIT 10
        `);
        return rows;
    } catch (error) {
        console.error('Failed to get Leaderboard Stats', error);
        throw error;
    }
};
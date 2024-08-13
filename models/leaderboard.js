import { client } from "../config/db.js";

// Function to get leaderboard stats
export const getLeaderboardStats = async () => {
  try {
    const { rows } = await client.query(`
            SELECT id, username, overall_score, regular_score, timed_score
            FROM users
            ORDER BY overall_score DESC
            LIMIT 10
        `);
    return rows;
  } catch (error) {
    console.error("Failed to get leaderboard stats!", error);
    throw error;
  }
};

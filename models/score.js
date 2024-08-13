import { client } from "../config/db.js";

// Function to add score for a specific user
export const addScore = async (username, score, isTimed = false) => {
  try {
    const scoreColumn = isTimed ? "timed_score" : "regular_score";
    const result = await client.query(
      `
            UPDATE users
            SET ${scoreColumn} = ${scoreColumn} + $2,
                overall_score = overall_score + $2
            WHERE username = $1
            RETURNING *;
        `,
      [username, score]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to add score!", error);
    throw error;
  }
};

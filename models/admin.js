// Function to get all users
export const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`SELECT * FROM users`);
    return rows;
  } catch (error) {
    console.error("Failed to get all users!", error);
    throw error;
  }
};

// Function to ban/unban user
export const banUser = async (userId, isBanned) => {
  try {
    const { rows } = await client.query(
      `
            UPDATE users
            SET is_banned = $1
            WHERE id = $2
            RETURNING *;
        `,
      [isBanned, userId]
    );
    return rows[0];
  } catch (error) {
    console.error("Failed to update user status!", error);
    throw error;
  }
};

export const resetUserData = async (userId) => {
  try {
    const result = await client.query(
      `
            UPDATE users
            SET regular_score = 0,
                timed_score = 0,
                overall_score = 0,
                guess_1 = 0,
                guess_2 = 0,
                guess_3 = 0,
                guess_4 = 0,
                guess_5 = 0,
                guess_6 = 0,
                overall_games = 0,
                regular_games = 0,
                timed_games = 0,
                current_streak = 0,
                max_streak = 0,
                used_words = '{}'
            WHERE id = $1
            RETURNING *;
        `,
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Failed to reset user data!", error);
    throw error;
  }
};

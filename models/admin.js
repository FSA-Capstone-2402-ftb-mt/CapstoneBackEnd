import {client} from "../config/db.js"

// Function to get all users
export const getAllUsers = async () => {
    try {
        const {rows} = await client.query(
            `
                SELECT *
                FROM public.users
                ORDER BY id ASC;
            `
        );
        return rows;
    } catch (error) {
        console.error("Failed to get all users!", error);
        throw error;
    }
};

// Function to ban/unban user
export const banUser = async (userId, isBanned) => {
    try {
        const {rows} = await client.query(
            `
                UPDATE users
                SET is_banned = $1
                WHERE id = $2 RETURNING *;
            `
            , [isBanned, userId]
        );
        return rows[0];
    } catch (error) {
        console.error("Failed to update user status!", error);
        throw error;
    }
};

export const resetUserData = async (username) => {
    try {
        const result = await client.query(
            `
                UPDATE users
                SET timed_score     = 0,
                    current_streak  = 0,
                    max_streak      = 0,
                    guesses         = DEFAULT,
                    number_of_games = DEFAULT,
                    used_words      = DEFAULT
                WHERE id = $1 RETURNING *;
            `,
            [username]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Failed to reset user data!", error);
        throw error;
    }
};
import { client } from "../config/db.js";
import bcrypt from "bcrypt";
const salt_count = 10;

// Seed Users Function
export const seedUsers = async () => {
  try {
    const secretPassword1 = await bcrypt.hash("SoCal", salt_count);
    const secretPassword2 = await bcrypt.hash("CaliLA", salt_count);
    const secretPassword3 = await bcrypt.hash("Michigan", salt_count);
    const secretPassword4 = await bcrypt.hash("NewYorkCity", salt_count);

    await client.query(`
            DROP TABLE IF EXISTS users;
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                join_date TIMESTAMP DEFAULT NOW(),
                is_admin BOOLEAN DEFAULT false,
                is_banned BOOLEAN DEFAULT false,
                overall_score INTEGER DEFAULT 0,
                regular_score INTEGER DEFAULT 0,
                timed_score INTEGER DEFAULT 0,
                guess_1 INTEGER DEFAULT 0,
                guess_2 INTEGER DEFAULT 0,
                guess_3 INTEGER DEFAULT 0,
                guess_4 INTEGER DEFAULT 0,
                guess_5 INTEGER DEFAULT 0,
                guess_6 INTEGER DEFAULT 0,
                overall_games INTEGER DEFAULT 0,
                regular_games INTEGER DEFAULT 0,
                timed_games INTEGER DEFAULT 0,
                current_streak INTEGER DEFAULT 0,
                max_streak INTEGER DEFAULT 0,
                used_words TEXT[] DEFAULT '{}'
            );

            INSERT INTO users (username, password, is_admin)
            VALUES
            ('EdwinV', '${secretPassword1}', true),
            ('AlbertoM', '${secretPassword2}', true),
            ('TylerS', '${secretPassword3}', true),
            ('SlavikT', '${secretPassword4}', true)
        `);

    console.log("Admin Table seeded successfully!");
  } catch (e) {
    console.error("Failed to seed Users Table!");
    console.error(e);
  }
};

// Function to get all users
export const getAllUsers = async () => {
  try {
      const { rows } = await client.query('SELECT * FROM users');
      return rows;
  } catch (error) {
      console.error('Failed to get all users!', error);
      throw error;
  }
};

// Function to ban/unban user
export const banUser = async (userId, isBanned) => {
  try {
      const { rows } = await client.query(`
          UPDATE users
          SET is_banned = $1
          WHERE id = $2
          RETURNING *;
      `, [isBanned, userId]);
      return rows[0];
  } catch (error) {
      console.error('Failed to update user status!', error);
      throw error;
  }
};

export const resetUserData = async (userId) => {
  try {
      const result = await client.query(`
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
      `, [userId]);
      return result.rows[0];
  } catch (error) {
      console.error("Failed to reset user data!", error);
      throw error;
  }
};

// Function to get user by id
export const getUserById = async (id) => {
  try {
    const { rows } = await client.query(
      `
            SELECT * FROM users WHERE id = $1
        `,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Failed to get user by ID!", error);
    throw error;
  }
};

export const registerUser = async ({ username, password }) => {
  try {
      const encryptedPassword = await bcrypt.hash(password, salt_count);
      const join_date = new Date();
      const result = await client.query(`
          INSERT INTO users (username, password, join_date, is_admin, is_banned, used_words)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
      `, [
          username,
          encryptedPassword,
          join_date,
          false,
          false,
          '{}'
      ]);
      return result.rows[0];
  } catch (e) {
      console.error("Failed to register user!");
      console.error(e);
  }
};

// Function to find user by username
export const fetchUserByUsername = async (username) => {
  try {
    const { rows } = await client.query(
      `
            SELECT * FROM users WHERE username = $1
        `,
      [username]
    );
    return rows[0];
  } catch (error) {
    console.error("Failed to find username in DB");
    throw error;
  }
};
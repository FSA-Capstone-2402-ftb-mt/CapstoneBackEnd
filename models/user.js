import {client} from "../config/db.js";
import bcrypt from "bcrypt";

const salt_count = 10;
// Seed Users Function
export const seedUsers = async () => {
    try {
        const secretPassword1 = await bcrypt.hash("SouthCali", salt_count);
        const secretPassword2 = await bcrypt.hash("NorthCali", salt_count);
        const secretPassword3 = await bcrypt.hash("MichiganState", salt_count);
        const secretPassword4 = await bcrypt.hash("NewYorkCity", salt_count);

        await client.query(
            `
                DROP TABLE IF EXISTS users;
                CREATE TABLE IF NOT EXISTS users
                (
                    id SERIAL UNIQUE,
                    username VARCHAR(20) NOT NULL UNIQUE CHECK (LENGTH(username) >= 5), -- Minimum char 5
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(128) NOT NULL CHECK (LENGTH(password) >= 8), -- Minimum char 8
                    is_admin BOOLEAN DEFAULT false,
                    is_banned BOOLEAN DEFAULT false,
                    timed_score INTEGER DEFAULT 0,
                    current_streak INTEGER DEFAULT 0,
                    max_streak INTEGER DEFAULT 0,
                    guesses JSON NOT NULL DEFAULT '{"guess_1": 0, "guess_2":0, "guess_3": 0, "guess_4": 0, "guess_5": 0, "guess_6": 0}',
                    number_of_games JSON NOT NULL DEFAULT '{"overall_games": 0, "regular_games": 0, "timed_games": 0}',
                    join_date TIMESTAMP DEFAULT NOW(),
                    used_words TEXT[] DEFAULT '{}',
                    PRIMARY KEY (username,id)
                );

                INSERT INTO users (username, email, password, is_admin)
                VALUES ('EdwinV', 'edwin-V@email.com', '${secretPassword1}', true),
                   ('AlbertoM', 'avmrbeto98@gmail.com', '${secretPassword2}', true),
                   ('TylerS', 'tyler-S@email.com', '${secretPassword3}', true),
                   ('SlavikT', 'slavik-T@email.com', '${secretPassword4}', true);
            `
        );

        console.log("Users Table seeded successfully!");
    } catch (e) {
        console.error("Failed to seed Users Table!");
        console.error(e);
    }
};

// Function to register a new user
export const registerUser = async ({username, email, password}) => {
    try {
        const encryptedPassword = await bcrypt.hash(password, salt_count);
        const join_date = new Date();
        const {rows} = await client.query(
            `
                INSERT INTO users (username, password, email, join_date, is_admin, is_banned)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
            `
            , [username, email, encryptedPassword, join_date, false, false]
        );
        return rows[0];
    } catch (e) {
        console.error("Failed to register user!");
        console.error(e);
    }
};

// Function to find user by username
export const fetchUserByUsername = async (username) => {
    try {
        const {rows} = await client.query(
            `
                SELECT *
                FROM users
                WHERE username = $1
            `
            , [username]
        );
        return rows[0];
    } catch (error) {
        console.error("Failed to find username in DB");
        throw error;
    }
};

//Function to change username
export const updateUsername = async (currentUsername, newUsername) => {
    try {
        const {rows} = await client.query(
            `
                UPDATE users
                SET username = $1
                WHERE username = $2
            `
            , [currentUsername, newUsername]
        );
        return rows[0];
    } catch (error) {
        console.error("Failed to update username in DB");
        throw error;
    }
};

export const updatePassword = async (username, newPassword) => {
    try {
        const encryptedPassword = await bcrypt.hash(newPassword, salt_count);
        const {rows} = await client.query(
            `
                UPDATE users
                SET password = $2
                WHERE username = $1 RETURNING *;
            `
            , [username, encryptedPassword]
        );
        return rows[0];
    } catch (error) {
        console.error("Failed to update password!", error);
        throw error;
    }
};
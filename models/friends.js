import {client} from "../config/db.js";
import {startFighting} from "./match.js";

// seed database with friendships table
export const seedFriendshipsTable = async () => {
    try {
        await client.query(
            `
                CREATE TABLE IF NOT EXISTS friendships
                (
                    user_username
                    VARCHAR
                (
                    255
                ) REFERENCES users
                (
                    username
                ) ON DELETE CASCADE,
                    friend_username VARCHAR
                (
                    255
                ) REFERENCES users
                (
                    username
                )
                  ON DELETE CASCADE,
                    status VARCHAR
                (
                    20
                ) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY
                (
                    user_username,
                    friend_username
                )
                    );
            `
        );

        console.log("Friendships table created or already exists.");
    } catch (error) {
        console.error("Failed to seed friendships table:", error);
        throw error;
    }
};

// Function to send a friend request
export const sendFriendRequest = async (user_username, friend_username) => {
    try {
        // Check if a friendship already exists
        const {rows: existingFriendship} = await client.query(
            `
                SELECT *
                FROM friendships
                WHERE (user_username = $1 AND friend_username = $2)
                   OR (user_username = $2 AND friend_username = $1)
            `,
            [user_username, friend_username]
        );

        if (existingFriendship.length > 0) {
            return `You are friends already`;
        }

        // Insert a new friend request
        const {rows} = await client.query(
            `
                INSERT INTO friendships (user_username, friend_username, status)
                VALUES ($1, $2, 'pending') RETURNING *
            `,
            [user_username, friend_username]
        );

        return rows[0];
    } catch (error) {
        console.error("Failed to send friend request:", error);
        throw error;
    }
};

// Function to accept a friend request
export const acceptFriendRequest = async (user_username, friend_username) => {
    try {

        // Update the friendship status to accepted
        const {rows} = await client.query(
            `
                UPDATE friendships
                SET status = 'accepted'
                WHERE (user_username = $1 AND friend_username = $2)
                   OR (user_username = $2 AND friend_username = $1) RETURNING *
            `,
            [friend_username, user_username]
        );

        // Will insert the default for 1v1s
        await startFighting(user_username, friend_username);

        if (rows.length === 0) {
            console.error("No friend request found to accept");
        }

        return rows[0];
    } catch (error) {
        console.error("Failed to accept friend request:", error);
        throw error;
    }
};

// Function to reject a friend request
export const rejectFriendRequest = async (user_username, friend_username) => {
    try {
        // Update the friendship status to rejected
        const {rows} = await client.query(
            `
                UPDATE friendships
                SET status = 'rejected'
                WHERE (user_username = $1 AND friend_username = $2)
                   OR (user_username = $2 AND friend_username = $1) RETURNING *
            `,
            [friend_username, user_username]
        );

        if (rows.length === 0) {
            console.error("No friend request found to reject");
            return `No friend request found`; // Return null to indicate no friend request was found
        }

        return rows[0];
    } catch (error) {
        console.error("Failed to reject friend request:", error);
        throw error;
    }
};

// Function to get a user's friends
export const getFriends = async (username) => {
    try {
        const {rows} = await client.query(
            `
                SELECT u.username AS friend, f.created_at AS since
                FROM friendships f
                         JOIN users u
                              ON (f.friend_username = u.username AND f.user_username = $1)
                                  OR (f.user_username = u.username AND f.friend_username = $1)
                WHERE f.status = 'accepted'
            `,
            [username]
        );

        return rows;
    } catch (error) {
        console.error("Failed to get friends list:", error);
        throw error;
    }
};

// Function to delete a friend
export const deleteFriend = async (user_username, friend_username) => {
    console.log(user_username, friend_username);
    try {
        const {rows} = await client.query(
            `
                DELETE
                FROM friendships
                WHERE (user_username = $1 AND friend_username = $2)
                   OR (user_username = $2 AND friend_username = $1) RETURNING *
            `,
            [user_username, friend_username]
        );

        if (rows.length === 0) {
            return `No friendship found`;
        }

        return rows[0];
    } catch (error) {
        console.error("Failed to delete friend!", error);
        throw error;
    }
};

// Function to check if players are friends
export const areFriends = async (username1, username2) => {
    try {
        const {rows} = await client.query(
            `
                SELECT 1
                FROM friendships
                WHERE (user_username = $1 AND friend_username = $2 AND status = 'accepted')
                   OR (user_username = $2 AND friend_username = $1 AND status = 'accepted')
            `,
            [username1, username2]
        );

        return rows.length > 0;
    } catch (error) {
        console.error("Failed to check friendship status", error);
    }
};

// Function to get all current Friend requests by username (received and sent)
export const fetchRequests = async (username) => {
    try {
        const {rows} = await client.query(
            `
                SELECT CASE
                           WHEN user_username = $1 THEN 'sent'
                           WHEN friend_username = $1 THEN 'received'
                           END AS request_type,
                       user_username,
                       friend_username,
                       status,
                       created_at
                FROM friendships
                WHERE user_username = $1
                   OR friend_username = $1;
            `,
            [username]
        );
        return rows;
    } catch (error) {
        console.error("Failed to fetch requests", error);
    }
}
//  Function to delete a rejected friend request
export const deleteRejectedRequest = async (user_username, friend_username) => {
    try {
        const {rows} = await client.query(
            `
                DELETE
                FROM friendships
                WHERE (user_username = $1 AND friend_username = $2)
                   OR (user_username = $2 AND friend_username = $1) RETURNING *
            `,
            [user_username, friend_username]
        );

        if (rows.length === 0) {
            console.error("No rejected request found to delete");
            return null; // Return null if no rejected request was found
        }

        return rows[0]; // Return the deleted request details
    } catch (error) {
        console.error("Failed to delete rejected request!", error);
        throw error;
    }
};
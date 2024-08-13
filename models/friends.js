import { client } from "../config/db.js";

//
export const seedFriendshipsTable = async () => {
  try {
    await client.query(`
            CREATE TABLE IF NOT EXISTS friendships (
                user_username VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
                friend_username VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
                status VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_username, friend_username)
            );
        `);

    console.log("Friendships table created or already exists.");
  } catch (error) {
    console.error("Failed to seed friendships table:", error);
    throw error;
  }
};

// Function to send a friend request
export const sendFriendRequest = async (user_username, friend_username) => {
  console.log("User Username:", user_username);
  console.log("Friend Username:", friend_username);
  try {
    // Check if a friendship already exists
    const { rows: existingFriendship } = await client.query(
      `
            SELECT * FROM friendships WHERE (user_username = $1 AND friend_username = $2) OR (user_username = $2 AND friend_username = $1)
        `,
      [user_username, friend_username]
    );

    if (existingFriendship.length > 0) {
      throw new Error("Friendship already exists or a request is pending");
    }

    // Insert a new friend request
    const { rows } = await client.query(
      `
            INSERT INTO friendships (user_username, friend_username, status) VALUES ($1, $2, 'pending') RETURNING *
        `,
      [user_username, friend_username]
    );

    console.log("User Username:", user_username);
    console.log("Friend Username:", friend_username);

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
    const { rows } = await client.query(
      `
            UPDATE friendships SET status = 'accepted' WHERE user_username = $1 AND friend_username = $2 RETURNING *
        `,
      [friend_username, user_username]
    );

    if (rows.length === 0) {
      throw new Error("No friend request found to accept");
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
    const { rows } = await client.query(
      `
            UPDATE friendships SET status = 'rejected' WHERE user_username = $1 AND friend_username = $2 RETURNING *
        `,
      [friend_username, user_username]
    );

    if (rows.length === 0) {
      throw new Error("No friend request found to reject");
    }

    return rows[0];
  } catch (error) {
    console.error("Failed to reject friend request:", error);
    throw error;
  }
};

// Function to get a user's friends
export const getFriends = async (user_username) => {
  try {
    const { rows } = await client.query(
      `
            SELECT users.* FROM friendships
            JOIN users ON (friendships.friend_username = users.id OR friendships.user_username = users.username)
            WHERE (friendships.user_username = $1 OR friendships.friend_username = $1)
            AND friendships.status = 'accepted' AND users.username != $1
        `,
      [user_username]
    );

    return rows;
  } catch (error) {
    console.error("Failed to get friends list:", error);
    throw error;
  }
};

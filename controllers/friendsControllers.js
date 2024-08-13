import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
} from "../models/friends.js";

// Controller to send a friend request
export const sendFriendRequestController = async (req, res) => {
  try {
    const { user_username, friend_username } = req.body;
    const friendRequest = await sendFriendRequest(
      user_username,
      friend_username
    );
    res
      .status(201)
      .json({ message: "Friend request sent successfully", friendRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to accept a friend request
export const acceptFriendRequestController = async (req, res) => {
  try {
    const { user_username, friend_username } = req.body;
    const friendship = await acceptFriendRequest(
      user_username,
      friend_username
    );
    res
      .status(200)
      .json({ message: "Friend request accepted successfully", friendship });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to reject a friend request
export const rejectFriendRequestController = async (req, res) => {
  try {
    const { user_username, friend_username } = req.body;
    const friendship = await rejectFriendRequest(
      user_username,
      friend_username
    );
    res
      .status(200)
      .json({ message: "Friend request rejected successfully", friendship });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a user's friends list
export const getFriendsController = async (req, res) => {
  try {
    const { user_username } = req.params;
    const friends = await getFriends(user_username);
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

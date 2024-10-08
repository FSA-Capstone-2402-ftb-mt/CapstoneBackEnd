import {
    acceptFriendRequest,
    deleteFriend,
    deleteRejectedRequest,
    fetchRequests,
    getFriends,
    rejectFriendRequest,
    sendFriendRequest,
} from "../models/friends.js";

// Controller to send a friend request
export const sendFriendRequestController = async (req, res) => {
        const {user_username} = req.params;
        const {friend_username} = req.body;
        try {
            const friendRequest = await sendFriendRequest(
                user_username,
                friend_username)
            res
                .status(200)
                .json(friendRequest);

        } catch
            (error) {
            res.status(500).json({error: error.message});
        }
    }
;

// Controller to accept a friend request
export const acceptFriendRequestController = async (req, res) => {
    try {
        const {user_username} = req.params;
        const {friend_username} = req.body;
        const friendship = await acceptFriendRequest(
            user_username,
            friend_username
        );
        res
            .status(200)
            .json({message: "Friend request accepted successfully", friendship});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Controller to reject a friend request
export const rejectFriendRequestController = async (req, res) => {
    try {
        const {user_username} = req.params;
        const {friend_username} = req.body;
        const friendship = await rejectFriendRequest(
            user_username,
            friend_username
        );
        res
            .status(200)
            .json({message: "Friend request rejected successfully", friendship});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Controller to get a user's friends list
export const getFriendsController = async (req, res) => {
    try {
        const {username} = req.params;
        const friendsList = await getFriends(username);
        res.status(200).json({friends: friendsList});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Controller to delete a friend
export const deleteFriendController = async (req, res) => {
    try {
        const {user_username} = req.params;
        const {friend_username} = req.body;
        const deletedFriendship = await deleteFriend(user_username, friend_username);

        if (deletedFriendship) {
            res.status(200).json({deletedFriendship});
        } else {
            res.status(404).json({message: "Friendship not found"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Controller to get all current Friend requests (received, sent and rejected)
export const getRequests = async (req, res) => {
    try {
        const {username} = req.params;
        const friendRequests = await fetchRequests(username);
        res.status(200).json({requests: friendRequests});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Controller to delete rejected friend request
export const deleteRequestController = async (req, res) => {
    try {
        const {user_username} = req.params;
        const {friend_username} = req.body;
        const deletedRequest = await deleteRejectedRequest(user_username, friend_username);

        if (deletedRequest) {
            res.status(200).json({message: "Rejected request deleted successfully", deletedRequest});
        } else {
            res.status(404).json({message: "Rejected request not found"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
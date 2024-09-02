import express from "express";
import {
    acceptFriendRequestController,
    deleteFriendController,
    deleteRequestController,
    getFriendsController,
    getRequests,
    rejectFriendRequestController,
    sendFriendRequestController,
} from "../controllers/friendsControllers.js";
import {verifyToken} from "../utils/auth.js";
import {getAllUsernames} from "../controllers/userController.js";

const router = express.Router();

// Route to send a friend request
router.post("/:user_username/send-request", verifyToken, sendFriendRequestController);

// Route to accept a friend request
router.post("/:user_username/accept-request", verifyToken, acceptFriendRequestController);

// Route to reject a friend request
router.post("/:user_username/reject-request", verifyToken, rejectFriendRequestController);

// Route to get a user's friends list
router.get("/:username/friends-list", getFriendsController);

// Route to delete a friend
router.delete('/:user_username/delete-friend', verifyToken, deleteFriendController);

// Route to fetch all requests sent and received
router.get("/:username/requests", getRequests);

// Delete a rejected friend request
router.delete('/:user_username/delete-request', verifyToken, deleteRequestController);

// Route to get all usernames in users
router.get('/all-usernames', verifyToken, getAllUsernames);

export default router;
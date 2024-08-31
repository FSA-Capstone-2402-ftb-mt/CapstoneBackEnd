import express from "express";
import {
  acceptFriendRequestController,
  deleteFriendController, deleteRejectedRequestController,
  getFriendsController, getRequests,
  rejectFriendRequestController,
  sendFriendRequestController,
} from "../controllers/friendsControllers.js";
import {verifyToken} from "../utils/auth.js";

const router = express.Router();

// Route to send a friend request
router.post("/send-request", verifyToken,sendFriendRequestController);

// Route to accept a friend request
router.post("/accept-request", verifyToken, acceptFriendRequestController);

// Route to reject a friend request
router.post("/reject-request", verifyToken, rejectFriendRequestController);

// Route to get a user's friends list
router.get("/:username/friends-list", getFriendsController);

// Route to delete a friend
router.delete('/delete-friend', verifyToken, deleteFriendController);

// Route to fetch all requests sent and received
router.get("/:username/requests", getRequests);

// Delete a rejected friend request
router.delete('/delete-rejected-request', verifyToken, deleteRejectedRequestController);

export default router;
import express from "express";
import {
  acceptFriendRequestController,
  getFriendsController,
  rejectFriendRequestController,
  sendFriendRequestController,
} from "../controllers/friendsControllers.js";

const router = express.Router();

// Route to send a friend request
router.post("/request/send-request", sendFriendRequestController);

// Route to accept a friend request
router.post("/request/accept-request", acceptFriendRequestController);

// Route to reject a friend request
router.post("/request/reject-request", rejectFriendRequestController);

// Route to get a user's friends list
router.get("/:userId/friends", getFriendsController);

export default router;

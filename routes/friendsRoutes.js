import express from "express";
import {
  acceptFriendRequestController,
  deleteFriendController,
  getFriendsController,
  rejectFriendRequestController,
  sendFriendRequestController,
} from "../controllers/friendsControllers.js";

const router = express.Router();

// Route to send a friend request
router.post("/send-request", sendFriendRequestController);

// Route to accept a friend request
router.post("/accept-request", acceptFriendRequestController);

// Route to reject a friend request
router.post("/reject-request", rejectFriendRequestController);

// Route to get a user's friends list
router.get("/:username/friends-list", getFriendsController);

// Route to delete a friend
router.delete('/delete-friend', deleteFriendController);

export default router;

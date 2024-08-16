import express from "express";
import {
  fetchUserStats,
  fetchLeaderboard,
} from "../controllers/statsController.js";
import { verifyToken } from "../utils/auth.js";

const router = express.Router();

// Route to get user stats
router.get("/user/:username", verifyToken, fetchUserStats);

// Route to get leaderboard
router.get("/leaderboard", verifyToken, fetchLeaderboard);

export default router;

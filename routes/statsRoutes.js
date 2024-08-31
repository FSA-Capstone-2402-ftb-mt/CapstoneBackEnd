import express from "express";
import {fetchLeaderboard, fetchUserGames, fetchUserGuesses, fetchUserStats} from "../controllers/statsController.js";
import {verifyToken} from "../utils/auth.js";
const router = express.Router();

// Route to get user stats
router.get("/:username/stats", verifyToken, fetchUserStats);

// Route to get user guesses
router.get("/:username/guesses", verifyToken, fetchUserGuesses);

// Route to get user games
router.get("/:username/games", verifyToken, fetchUserGames);

// Route to get leaderboard
router.get("/leaderboard", verifyToken, fetchLeaderboard);

export default router;
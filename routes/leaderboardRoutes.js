import express from "express";
import {combinedLeaderboard} from "../controllers/leaderboardController.js";

const router = express.Router();

// Route to get leaderboard for timed scored
router.get("/board", combinedLeaderboard);
// Route for current streak


export default router;
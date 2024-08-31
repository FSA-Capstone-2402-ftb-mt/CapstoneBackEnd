import express from "express";
import {endRegularGame, endTimedGame, getGameData, updateGameDataController} from "../controllers/gameController.js";
import { verifyToken } from "../utils/auth.js";

const router = express.Router();

// Route to end a regular game
router.post("/regular", verifyToken, endRegularGame);

// Route to end a timed game
router.post("/timed", verifyToken, endTimedGame);

// route to get last played
router.get("/data/:username", verifyToken, getGameData);

// Route to update last played
router.post("/data/:username/update", verifyToken, updateGameDataController);

export default router;
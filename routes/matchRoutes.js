import express from "express";
import {endGame, startGame} from "../controllers/matchController.js";
import {verifyToken} from "../utils/auth.js";

const router = express.Router();

// Route to start a game
router.post("/pvp/start", verifyToken, startGame);

// Route to end a game
router.post("/pvp/end", verifyToken, endGame);

export default router;
import express from "express";
import {endGame, startGame} from "../controllers/matchController.js";

const router = express.Router();

// Route to start a game
router.post("/pvp/start", startGame);

// Route to end a game
router.post("/pvp/end", endGame);

export default router;
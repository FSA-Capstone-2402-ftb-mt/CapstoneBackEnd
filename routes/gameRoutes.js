import express from 'express';
import { endRegularGame, endTimedGame } from '../controllers/gameController.js';
import { verifyToken } from '../utils/auth.js';

const router = express.Router();

// Route to end regular game
router.post('/regular', verifyToken, endRegularGame);

// Route to end timed game
router.post('/timed', verifyToken, endTimedGame);

export default router;
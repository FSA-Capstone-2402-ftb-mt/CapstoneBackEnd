import { updateRegularGameScore, updateTimedGameScore } from '../models/game.js';

// Controller to handle the end of a regular game
export const endRegularGame = async (req, res) => {
    const { username, correctGuess, attempts, streak } = req.body;

    try {
        const updatedUser = await updateRegularGameScore(username, correctGuess, attempts, streak);

        res.status(200).json({
            message: 'Regular game ended successfully',
            updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to end regular game' });
    }
};

// Controller to handle the end of a timed game
export const endTimedGame = async (req, res) => {
    const { username, correctGuess, attempts, timeTaken, streak } = req.body;

    try {
        const updatedUser = await updateTimedGameScore(username, correctGuess, attempts, timeTaken, streak);

        res.status(200).json({
            message: 'Timed game ended successfully',
            updatedUser
        });
    } catch (error) {
        res.status (500).json({ message: 'Failed to end timed game' });
    }
};
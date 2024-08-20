import {updateRegularGameScore, updateTimedGameScore} from "../models/game.js";

// Controller to handle the end of a regular game
export const endRegularGame = async (req, res) => {
    const {username, correctGuess, attempts, word} = req.body;

    try {
        const updatedUser = await updateRegularGameScore(
            username,
            correctGuess,
            attempts,
            word
        );

        res.status(200).json({
            username: updatedUser.username,
            current_streak: updatedUser.current_streak,
            guesses: updatedUser.guesses,
            number_of_games: updatedUser.number_of_games
        });
   } catch (error) {
        res.status(500).json({message: "Failed to end regular game"});
    }
};

// Controller to handle the end of a timed game
export const endTimedGame = async (req, res) => {
    const {username, correctGuess, attempts, timeTaken, word} = req.body;

    try {
        const updatedUser = await updateTimedGameScore(
            username,
            correctGuess,
            attempts,
            timeTaken,
            word
        );

        res.status(200).json({
            username: updatedUser.username,
            current_streak: updatedUser.current_streak,
            guesses: updatedUser.guesses,
            number_of_games: updatedUser.number_of_games,
            time_taken: updatedUser.time_taken,
            timed_score: updatedUser.timed_score
        });
    } catch (error) {
        res.status(500).json({message: "Failed to end timed game"});
    }
};
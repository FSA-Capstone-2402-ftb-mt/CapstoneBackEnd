import {fetchDataGame, updateDataGame, updateRegularGameScore, updateTimedGameScore} from "../models/game.js";

// Controller to handle the end of a regular game
export const endRegularGame = async (req, res) => {
    const {username} = req.params;
    const {correctGuess, attempts, word} = req.body;
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

// Controller to fetch Save Data
export const getGameData = async (req, res) => {
    const {username} = req.params;
    try {
        const gameData = await fetchDataGame(username);
        res.status(200).json(gameData);
    } catch (error) {
        res.status(500).json({message: "Failed to get game data"});
    }
};

// Controller to update Save Data
export const updateGameDataController = async (req, res) => {
    const {username} = req.params;
    const {last_played} = req.body;
    try {
        const gameData = await updateDataGame(username, last_played);
        res.status(200).json(gameData);
    } catch (error) {
        res.status(500).json({message: error});
    }
};
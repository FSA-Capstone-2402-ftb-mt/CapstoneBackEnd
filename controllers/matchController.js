import {endPvPGame, startPvPGame} from "../models/match.js"

export const startGame =  async (req, res) => {
    try {
        const {player1Username, player2Username} = req.body;

        const result = await startPvPGame(player1Username, player2Username);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const endGame = async (req, res) => {
    try {
        const {
            player1Username,
            player1Guesses,
            player2Username,
            player2Guesses,
            winner,
            word
        } = req.body;

        const result = await endPvPGame(
            player1Username,
            player1Guesses,
            player2Username,
            player2Guesses,
            winner,
            word
        );

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
}
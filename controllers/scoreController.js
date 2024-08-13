import { addScore } from "../models/score.js";

// controller to add score to user
export const updateScore = async (req, res) => {
  const { username, score } = req.body;
  try {
    const updatedUser = await addScore(username, score);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update score",
    });
  }
};

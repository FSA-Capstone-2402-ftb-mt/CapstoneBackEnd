import { getLeaderboardStats } from "../models/leaderboard.js";

// Controller to get the leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardStats();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({
      message: "Failed to featch leaderboard",
    });
  }
};

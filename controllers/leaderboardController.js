import { getCombinedLeaderboardData } from "../models/leaderboard.js";

// Controller to get the combined leaderboard
export const combinedLeaderboard = async (req, res) => {
    try {
        const rows = await getCombinedLeaderboardData();

        // Process the data
        const timedScores = rows.filter(row => row.category === 'timed_scores')
            .map(row => ({
                username: row.username,
                timed_score: row.value
            }));

        const maxStreakUser = rows.find(row => row.category === 'max_streak_user');

        const currentStreaks = rows.filter(row => row.category === 'current_streaks')
            .map(row => ({
                username: row.username,
                current_streak: row.value
            }));

        res.status(200).json({
            timed_scores: timedScores,
            max_streak_user: maxStreakUser ? {
                username: maxStreakUser.username,
                max_streak: maxStreakUser.value
            } : null,
            current_streaks: currentStreaks
        });
    } catch (error) {
        console.error("Failed to fetch combined leaderboard", error);
        res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
};

import {getLeaderboardStats, getUserStats} from '../models/stats.js';

// Controller to get user stats
export const fetchUserStats = async (req, res) => {
    const {username} = req.params;
    try {
        const userStats = await getUserStats(username);
        if (userStats) {
            res.status(200).json({status: 'success', stats: userStats});
        } else {
            res.status(404).json({
                status: 'error', message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({status: 'error', message: 'Failed to fetch user stats'});
    }
};

// Controller to get leaderboard
export const fetchLeaderboard = async (req, res) => {
    try {
        const leaderboard = await getLeaderboardStats();
        res.status(200).json({status: 'success', leaderboard});
    } catch (error) {
        res.status(500).json({status: 'error', message: 'Failed to fetch leaderboard'});
    }
};
import { banUser, resetUserData, getAllUsers } from '../models/admin.js';

// Controller to ban/unban user
export const changeUserStatus = async (req, res) => {
    const { userId, isBanned } = req.body;
    try {
        const updatedUser = await banUser(userId, isBanned);
        res.status(200).json({
            status: 'success',
            message: 'User status updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update user status',
            error
        });
    }
};

// Controller to reset user data
export const resetUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const updatedUser = await resetUserData(userId);
        res.status(200).json({
            status: 'success',
            message: 'User data reset successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to reset user data',
            error
        });
    }
};

// Controller to get all users
export const fetchAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({
            status: 'success',
            users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch users',
            error
        });
    }
};
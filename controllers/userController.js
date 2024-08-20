import bcrypt from "bcrypt";
import {fetchUserByUsername, registerUser, updatePassword, updateUsername,} from "../models/user.js";
import {generateToken} from "../utils/auth.js";

// Controller for registration
export const createUser = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const user = await registerUser({username, email, password});
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: "Failed to create user!"});
    }
};

// Controller for fetching single user
export const getSingleUser = async (req, res) => {
    const {username} = req.params;
    try {
        const user = await fetchUserByUsername(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: "User not found!"});
        }
    } catch (error) {
        res.status(500).json({message: "Failed to get single user!"});
    }
};

// Controller for LogIn
export const loginUser = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await fetchUserByUsername(username);
        if (!user) {
            return res.status(400).json({message: "Invalid username or password"});
        }
        // Check if credentials match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid username or password"});
        }

        const token = generateToken(user);
        res.status(200).json({message: "Login successful", token});
    } catch (error) {
        res.status(500).json({message: "Failed to Log In"});
    }
};

// Controller for changing username
export const changeUsername = async (req, res) => {
    const {currentUsername, newUsername} = req.body;
    try {
        const existingUser = await fetchUserByUsername(newUsername);
        if (existingUser) {
            return res.status(400).json({message: "Username already exist!"});
        }

        const newUser = await updateUsername(currentUsername, newUsername);
        res.status(200).json({message: "Username updated successfully!", newUser: newUser});
    } catch (error) {
        res.status(500).json({message: "Failed to update username!"})
    }
};

// Controller for changing password
export const changePassword = async (req, res) => {
    const {username, currentPassword, newPassword} = req.body;
    try {
        const user = await fetchUserByUsername(username);
        if (!user) {
            res.status(404).json({"message": "Username not found!"});
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Current Password is incorrect!"});
        }

        const updatedUser = await updatePassword(currentPassword, newPassword);
        res.status(200).json({message: "Password updated successfully!", updatedUser});
    } catch (error) {
        res.status(500).json({message: "Failed to update password!"});
    }
};
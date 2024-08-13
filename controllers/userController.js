import bcrypt from "bcrypt";
import {
  registerUser,
  getUserById,
  getAllUsers,
  fetchUserByUsername,
} from "../models/user.js";
import { generateToken } from "../utils/auth.js";

// Controller for registration
export const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await registerUser({ username, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user!",
    });
  }
};

// Controller for fetching all users
export const fetAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users!!!",
    });
  }
};

// Controller for fetching single user
export const getSingleUser = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid integer
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to get single user!" });
  }
};

// Controller for LogIn
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await fetchUserByUsername(username);
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    // Check if credentials match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Log In",
    });
  }
};

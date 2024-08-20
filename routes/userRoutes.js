import express from "express";
import {changePassword, changeUsername, createUser, getSingleUser, loginUser,} from "../controllers/userController.js";
import {verifyToken} from "../utils/auth.js";
import {resetUser} from "../controllers/adminController.js";

const router = express.Router();

// User routes

// Register user
router.post("/register", createUser);
// Login
router.post("/login", loginUser);
// Get user Information per id
router.get("/:username", verifyToken, getSingleUser);
// Update username
router.put('/update-username', verifyToken, changeUsername);
// Update password
router.put("/update-password", verifyToken, changePassword);
// Reset user stats (per user request)
router.post("/reset", verifyToken, resetUser);

export default router;
import express from "express";
import {
    changePassword,
    changeUsername,
    createUser,
    fetAllUsers,
    getSingleUser,
    loginUser,
} from "../controllers/userController.js";
import {verifyToken} from "../utils/auth.js";

const router = express.Router();

// User routes

// Fetch all users
router.get("/", verifyToken, fetAllUsers);
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

export default router;
import express from "express";
import {changeUserStatus, fetchAllUsers, resetUser,} from "../controllers/adminController.js";
import {checkAdmin, verifyToken} from "../utils/auth.js";

const router = express.Router();

// Route to change user status (ban/unban)
router.post("/status", verifyToken, checkAdmin, changeUserStatus);

// Route to reset user data
router.post("/reset", verifyToken, checkAdmin, resetUser);

// Route to fetch all users
router.get("/all-users", verifyToken, fetchAllUsers);

export default router;
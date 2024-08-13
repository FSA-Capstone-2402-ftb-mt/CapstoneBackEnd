import express from "express";
import {
  changeUserStatus,
  resetUser,
  fetchAllUsers,
} from "../controllers/adminController.js";
import { verifyToken, checkAdmin } from "../utils/auth.js";

const router = express.Router();

// Route to change user status (ban/unban)
router.post("/status", verifyToken, checkAdmin, changeUserStatus);

// Route to reset user data
router.post("/reset", verifyToken, checkAdmin, resetUser);

// Route to fetch all users
router.get("/users", verifyToken, checkAdmin, fetchAllUsers);

export default router;

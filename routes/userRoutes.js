import express from "express";
import {
  createUser,
  fetAllUsers,
  getSingleUser,
  loginUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/auth.js";
const router = express.Router();

// User routes
router.get("/", verifyToken, fetAllUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/:id", verifyToken, getSingleUser);

export default router;

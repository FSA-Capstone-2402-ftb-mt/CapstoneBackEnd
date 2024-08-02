import express from "express";
import userRoutes from "./routes/userRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wordsRoutes from "./routes/wordsRoutes.js";

const router = express.Router();

// Routes 
router.use("/users", userRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/score", scoreRoutes);
router.use("/game", gameRoutes);
router.use("/stats", statsRoutes);
router.use("/admin", adminRoutes);
router.use("/words", wordsRoutes);

export default router;
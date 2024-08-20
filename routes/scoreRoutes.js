import express from "express";
import {updateScore} from "../controllers/scoreController.js";

const router = express.Router();

// route to update score
router.post("/update", updateScore);

export default router;

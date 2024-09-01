import express from "express";
import {
    addWord,
    deleteWord,
    getAllWords,
    getRandomWord,
    getSingleWord,
    getWordOfTheDay,
    getWordsForMonth,
    modifyWordOfTheDay,
} from "../controllers/wordsController.js";
import {checkAdmin, verifyToken} from "../utils/auth.js";

const router = express.Router();

router.get("/admin/all-words", verifyToken, getAllWords);
router.get("/:id", getSingleWord);
router.get("/random-word/:username", getRandomWord);
router.put("/wordOf/change", verifyToken, modifyWordOfTheDay);
router.get("/month/:month", verifyToken, getWordsForMonth);
router.post("/add", verifyToken, addWord);
router.delete(
    "/delete/:id",
    (req, res, next) => {
        console.log("Delete route hit");
        next();
    },
    verifyToken,
    deleteWord
);
router.get("/wordOf/todaysWord", getWordOfTheDay);

export default router;
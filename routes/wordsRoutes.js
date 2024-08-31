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
import {checkAdmin} from "../utils/auth.js";

const router = express.Router();

router.get("/admin/all-words", getAllWords);
router.get("/:id", getSingleWord);
router.get("/random-word/:username", getRandomWord);
router.put("/wordOf/change", modifyWordOfTheDay);
router.get("/month/:month", getWordsForMonth);
router.post("/add", addWord);
router.delete(
    "/delete/:id",
    (req, res, next) => {
        console.log("Delete route hit");
        next();
    },
    deleteWord
);
router.get("/wordOf/todaysWord", getWordOfTheDay);

export default router;
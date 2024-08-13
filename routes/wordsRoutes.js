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
  populateWordsPerMonth,
} from "../controllers/wordsController.js";

const router = express.Router();

router.get("/all", getAllWords);
router.get("/:id", getSingleWord);
router.get("/random/:userId", getRandomWord);
router.post("/initialize", populateWordsPerMonth);
router.put("/wordOf/change", modifyWordOfTheDay);
router.get("/month/:month", getWordsForMonth);
// router.get('/month/current-month', getCurrentMonthWords);
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

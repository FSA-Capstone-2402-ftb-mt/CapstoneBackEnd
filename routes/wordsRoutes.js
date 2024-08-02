import express from 'express';
import { addWord, deleteWord, getAllWords, getCurrentMonthWords, getRandomWord, getSingleWord, getWordOfTheDay, modifyWordOfTheDay, populateWordsPerMonth } from '../controllers/wordsController.js';

const router = express.Router();

router.get('/all', getAllWords);
router.get('/:id', getSingleWord);
router.get('/random/:userId', getRandomWord);
router.post('/initialize', populateWordsPerMonth);
router.put('/change', modifyWordOfTheDay);
router.get('/month/current-month', getCurrentMonthWords);
router.post('/add', addWord);
router.delete('delete/:id', deleteWord);
router.get('/todaysWord', getWordOfTheDay);

export default router;
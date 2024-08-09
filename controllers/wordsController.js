import { client } from '../config/db.js';
import { addWordToBank, changeWordOfTheDay, createMonthWordsTable, deleteWordFromBank, fetchAllWords, fetchRandomWord, fetchSingleWord, fetchWordOfTheDay, fetchWordsForMonth, populateMonthWithWords } from '../models/words.js';

// Function to export all the words
export const getAllWords = async (req, res) => {
    try {
        const words = await fetchAllWords();
        res.status(200).json(words);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get all words'
        });
    }
};

// Function to get single word by id
export const getSingleWord = async (req, res) => {
    const { id } = req.params;
    try {
        const word = await fetchSingleWord(id);
        if (!word) {
            return res.status(404).send('Word not found');
        }
        res.status(200).json(word);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get word'
        });
    }
};

// Function to fetch a random word
export const getRandomWord = async (req, res) => {
    const { userId } = req.params;
    try {
        const word = await fetchRandomWord(userId);
        if (!word) {
            return res.status(404).send('No words available');
        }
        res.status(200).json(word);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch random word'
        });
    }
};

// Function to inilialize words for a new month (might need to be run in the front end? periodically?)
export const populateWordsPerMonth = async (req, res) => {
    const { monthName } = req.params;
    try {
        await createMonthWordsTable(monthName);
        await populateMonthWithWords(monthName);
        res.status(200).send('Words for ${monthName} initialized successful');
    } catch (error) {
        res.status(500).json({
            message: 'Failed to initialize month words'
        });
    }
};

// Controller to get the current month's words
// export const getCurrentMonthWords = async (req, res) => {
//     try {
//         const words = await fetchCurrentMonthWords();
//         res.status(200).json(words);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Failed to fetch words for the current month'
//         });
//     }
// };

// Function to change the word of the day 
export const modifyWordOfTheDay = async (req, res) => {
    const { monthName, day, newWord } = req.body;
    try {
        await changeWordOfTheDay(monthName, day, newWord);
        res.status(200).send('Word of the day was updated succesfully');
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update word of the day'
        });
    }
};

// Function to add a new word to the word bank
export const addWord = async (req, res) => {
    const { word } = req.body;
    console.log('Received word:', word);
    try {
        await addWordToBank(word);
        res.status(201).send('Word added successfully');
    } catch (error) {
        res.status(500).send('Failed to add word');
    }
};

// Function to delete a word from the word bank
export const deleteWord = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteWordFromBank(id);
        res.status(200).send('Word deleted successfully');
    } catch (error) {
        res.status(500).send('Failed to delete word');
    }
};

// Function to get the word of the day
export const getWordOfTheDay = async (req, res) => {
    try {
        const word = await fetchWordOfTheDay();
        console.log('Fetched word:', word);
        res.status(200).json({word});
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch word of the day'
        });
    }
};

export const getWordsForMonth = async (req, res) => {
    const month = req.params.month;
    try {
        const wordsData = await fetchWordsForMonth(month);

        if (!wordsData) {
            return res.status(404).send('No words for the specified month');
        }

        res.json(wordsData);
    } catch (error) {
        console.error('Failed to fetch words for the month', error);
        res.status(500).send('Failed to fetch words for the month');
    }
};
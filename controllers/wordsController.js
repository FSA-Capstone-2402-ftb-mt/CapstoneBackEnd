import {
    addWordToBank,
    changeWordOfTheDay,
    deleteWordFromBank,
    fetchAllWords,
    fetchRandomWord,
    fetchSingleWord,
    fetchWordOfTheDay,
    fetchWordsForMonth,
} from "../models/words.js";

// Controller to export all the words
export const getAllWords = async (req, res) => {
    try {
        const words = await fetchAllWords();
        res.status(200).json(words);
    } catch (error) {
        res.status(500).json({message: "Failed to get all words"});
    }
};

// Controller to get single word by id
export const getSingleWord = async (req, res) => {
    const {id} = req.params;
    try {
        const word = await fetchSingleWord(id);
        if (!word) {
            return res.status(404).send("Word not found");
        }
        res.status(200).json(word);
    } catch (error) {
        res.status(500).json({message: "Failed to get word"});
    }
};

// Controller to fetch a random word
export const getRandomWord = async (req, res) => {
    const {username} = req.params;
    try {
        const word = await fetchRandomWord(username);

        if (!word) {
            return res.status(404).json({message: "No words available"});
        }

        res.status(200).json({word});
    } catch (error) {
        console.error("Error fetching random word:", error);
        res.status(500).json({message: "Failed to fetch random word"}, error);
    }
};

// Controller to change the word of the day
export const modifyWordOfTheDay = async (req, res) => {

    const {monthName, day, newWord} = req.body;

    if (!monthName || !day || !newWord) {
        return res.status(400).json({message: "Missing required fields: monthName, day, and newWord are required."});
    }

    try {
        await changeWordOfTheDay(monthName, day, newWord);
        res.status(200).send("Word of the day was updated succesfully");
    } catch (error) {
        res.status(500).json({message: "Failed to update word of the day"});
    }
};

// Controller to add a new word to the word bank
export const addWord = async (req, res) => {
    const {word} = req.body;
    console.log("Received word:", word);
    try {
        await addWordToBank(word);
        res.status(201).send("Word added successfully");
    } catch (error) {
        res.status(500).send("Failed to add word");
    }
};

// Controller to delete a word from the word bank
export const deleteWord = async (req, res) => {
    const {id} = req.params;
    try {
        await deleteWordFromBank(id);
        res.status(200).send("Word deleted successfully");
    } catch (error) {
        res.status(500).send("Failed to delete word");
    }
};

// Controller to get the word of the day
export const getWordOfTheDay = async (req, res) => {
    try {
        const data = await fetchWordOfTheDay();
        console.log("Fetched word:", data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: "Failed to fetch word of the day"});}
};

// Controller to get words for the month
export const getWordsForMonth = async (req, res) => {
    const month = req.params.month;
    try {
        const wordsData = await fetchWordsForMonth(month);

        if (!wordsData) {
            return res.status(404).send("No words for the specified month");
        }

        res.json(wordsData);
    } catch (error) {
        console.error("Failed to fetch words for the month", error);
        res.status(500).send("Failed to fetch words for the month");
    }
};

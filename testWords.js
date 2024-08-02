import { seedWords, fetchAllWords, fetchSingleWord, fetchRandomWord, createMonthWordsTable, initializeMonthWords, changeWordOfTheDay } from './models/words.js';
import { connectDataBase } from './config/db.js';

// Initialize the database connection
const initDB = async () => {
    await connectDataBase();
};

// Test seeding the words table
const testSeedWords = async () => {
    await seedWords();
};

// Test fetching all words
const testFetchAllWords = async () => {
    const words = await fetchAllWords();
    console.log('All Words:', words);
};

// Test fetching a single word by ID
const testFetchSingleWord = async (id) => {
    const word = await fetchSingleWord(id);
    console.log('Single Word:', word);
};

// Test fetching a random word for a user
const testFetchRandomWord = async (userId) => {
    const word = await fetchRandomWord(userId);
    console.log('Random Word for User:', word);
};

// Test creating the month words table
const testCreateMonthWordsTable = async () => {
    await createMonthWordsTable();
};

// Test initializing month words
const testInitializeMonthWords = async () => {
    await initializeMonthWords();
};

// Test getting current month words
const testGetCurrentMonthWords = async () => {
    const words = await getCurrentMonthWords();
    console.log('Current Month Words:', words);
};

// Test changing the word of the day
const testChangeWordOfTheDay = async (monthName, day, newWord) => {
    await changeWordOfTheDay(monthName, day, newWord);
};

// Run tests
const runTests = async () => {
    await initDB();
    // await testSeedWords();
    // await testFetchAllWords();
    // await testFetchSingleWord(5); // Replace with a valid ID from your word_bank
    // await testFetchRandomWord(3); // Replace with a valid user ID
    // await testCreateMonthWordsTable();
    await testInitializeMonthWords();
    // await testGetCurrentMonthWords();
    // await testChangeWordOfTheDay('July', 5, 'dread'); // Replace 'newword' with a valid word from word_bank
};

runTests();
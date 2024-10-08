// import {
//     changeWordOfTheDay,
//     createMonthWordsTable,
//     fetchAllWords,
//     fetchRandomWord,
//     fetchSingleWord,
//     initializeMonthWords,
//     seedWords
// } from './models/words.js';
import {seedFriendshipsTable} from './models/friends.js';
import {connectDataBase} from './config/db.js';
//
// // Initialize the database connection
// const initDB = async () => {
//     await connectDataBase();
// };
//
// // Test seeding the words table
// const testSeedWords = async () => {
//     await seedWords();
// };
//
// // Test fetching all words
// const testFetchAllWords = async () => {
//     const words = await fetchAllWords();
//     console.log('All Words:', words);
// };
//
// // Test fetching a single word by ID
// const testFetchSingleWord = async (id) => {
//     const word = await fetchSingleWord(id);
//     console.log('Single Word:', word);
// };
//
// // Test fetching a random word for a user
// const testFetchRandomWord = async (userId) => {
//     const word = await fetchRandomWord(userId);
//     console.log('Random Word for User:', word);
// };
//
// // Test creating the month words table
// const testCreateMonthWordsTable = async () => {
//     await createMonthWordsTable();
// };
//
// // Test initializing month words
// const testInitializeMonthWords = async () => {
//     await initializeMonthWords();
// };
//
// // Test getting current month words
// const testGetCurrentMonthWords = async () => {
//     const words = await getCurrentMonthWords();
//     console.log('Current Month Words:', words);
// };
//
// // Test changing the word of the day
// const testChangeWordOfTheDay = async (monthName, day, newWord) => {
//     await changeWordOfTheDay(monthName, day, newWord);
// };

// Run tests
// const runTests = async () => {
//     await initDB();
//     // await testSeedWords();
//     // await testFetchAllWords();
//     // await testFetchSingleWord(5); // Replace with a valid ID from your word_bank
//     // await testFetchRandomWord(3); // Replace with a valid user ID
//     // await testCreateMonthWordsTable();
//     // await testInitializeMonthWords();
//     // await testGetCurrentMonthWords();
//     // await testChangeWordOfTheDay('July', 5, 'dread'); // Replace 'new word' with a valid word from word_bank
// };

// runTests();

// Seed all months into DB

// const months = [
//     { name: 'January', days: 31 },
//     { name: 'February', days: 28 }, // Adjust for leap years if necessary
//     { name: 'March', days: 31 },
//     { name: 'April', days: 30 },
//     { name: 'May', days: 31 },
//     { name: 'June', days: 30 },
//     { name: 'July', days: 31 },
//     { name: 'August', days: 31 },
//     { name: 'September', days: 30 },
//     { name: 'October', days: 31 },
//     { name: 'November', days: 30 },
//     { name: 'December', days: 31 }
// ];

// const seedAllMonths = async () => {
//     try {
//         await connectDataBase();
//         console.log('Connected to the database.');

//         const allWords = await fetchAllWords();
//         console.log('Fetched Words:', allWords);

//         if (allWords.length === 0) {
//             throw new Error('No words available to populate the months.');
//         }

//         // Shuffle the words to ensure random distribution
//         allWords.sort(() => 0.5 - Math.random());

//         let wordIndex = 0;

//         for (const { name, days } of months) {
//             const wordsForMonth = {};

//             if (wordIndex + days > allWords.length) {
//                 // If not enough words, reshuffle and start from the beginning
//                 allWords.sort(() => 0.5 - Math.random());
//                 wordIndex = 0; // Reset wordIndex after reshuffle
//             }

//             for (let i = 0; i < days; i++) {
//                 wordsForMonth[i + 1] = allWords[wordIndex].word; // Assign word to the corresponding day
//                 wordIndex++;
//             }

//             console.log(`Seeding ${name}:`, wordsForMonth);

//             await seedWordsPerMonth(name, wordsForMonth);
//         }

//         console.log('Database seeding for all months completed.');
//     } catch (error) {
//         console.error('Failed to seed the database:', error);
//     } finally {
//         console.log('Disconnected from the database.');
//     }
// };


// Run the seeding function
// seedAllMonths();


const seedDatabase = async () => {
    try {
        await connectDataBase();
        await seedFriendshipsTable();

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Failed to seed the database:', error);
    }
};
//
// // Run the seeding process
seedDatabase();
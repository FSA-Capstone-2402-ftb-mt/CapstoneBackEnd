import { client } from '../config/db.js';

// Seed Words table in database
export const seedWords = async () => {
    try {
        await client.query(`
            DROP TABLE IF EXISTS word_bank;
            CREATE TABLE IF NOT EXISTS word_bank (
                id SERIAL PRIMARY KEY,
                word VARCHAR(5) NOT NULL
            );
            
            INSERT INTO word_bank (word)
            VALUES 
            ('cameo'),
            ('adapt'),
            ('drake');
        `);
        console.log('Word Bank seeded Successfully!');
    } catch (error) {
        console.error('Failed to seed words table!');
        console.error(error);
    }
};

// Function to get all words
export const fetchAllWords = async () => {
    try {
        const { rows: word_bank } = await client.query(`
            SELECT * FROM public.word_bank
        `);
        return word_bank;
    } catch (error) {
        console.error('Failed to get all Words!');
        console.error(error);
    }
};

// Function to get single word by Id
export const fetchSingleWord = async (id) => {
    try {
        const { rows } = await client.query(`
            SELECT * FROM public.word_bank
            WHERE id = $1
        `, [id]);
        return rows[0];
    } catch (error) {
        console.error('Failed to get Word by Id!');
        console.error(error);
    }
};

// Function to get a random word for a user without repetition
export const fetchRandomWord = async (userId) => {
    try {
        // Get the list of used words for the user
        const { rows: usedWordsResult } = await client.query(`
            SELECT used_words FROM users WHERE id = $1
        `, [userId]);

        const usedWords = usedWordsResult[0]?.used_words || [];

        // Get a random word from the word_bank that is not in the used words list
        const { rows: randomWordResult } = await client.query(`
            SELECT word FROM word_bank
            WHERE word NOT IN (SELECT unnest($1::text[]))
            ORDER BY RANDOM()
            LIMIT 1
        `, [usedWords]);

        if (randomWordResult.length === 0) {
            throw new Error('No more words available');
        }

        const randomWord = randomWordResult[0].word;

        // Update the used words list for the user
        await client.query(`
            UPDATE users
            SET used_words = array_append(used_words, $1)
            WHERE id = $2
        `, [randomWord, userId]);

        return randomWord;
    } catch (error) {
        console.error('Failed to fetch random word!');
        console.error(error);
    }
};

// Function to create month_words table if it doesn't exist
export const createMonthWordsTable = async () => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS month_words (
                month_name VARCHAR(50) PRIMARY KEY,
                words TEXT[]
            );
        `);
        console.log('Month words table created successfully!');
    } catch (error) {
        console.error('Failed to create month words table!');
        console.error(error);
    }
};

// Function to fetch random words from word_bank
const fetchRandomWords = async (numWords) => {
    const { rows } = await client.query(`
        SELECT word FROM word_bank
        ORDER BY RANDOM()
        LIMIT $1
    `, [numWords]);
    return rows.map(row => row.word);
};

// Function to populate words for the month
export const populateMonthWithWords = async (monthName) => {
    try {
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const randomWords = await fetchRandomWords(daysInMonth);

        // Create an array of objects with "day" as key and "word" as value
        const wordsForMonth = randomWords.map((word, index) => ({
            day: (index + 1).toString(), // "1", "2", etc.
            word: word
        }));

        await client.query(`
            INSERT INTO month_words (month_name, words)
            VALUES ($1, $2::json)
            ON CONFLICT (month_name)
            DO UPDATE SET words = $2::json;
        `, [monthName, JSON.stringify(wordsForMonth)]);
        console.log(`Words for ${monthName} populated successfully!`);
    } catch (error) {
        console.error('Failed to populate words for the month!');
        console.error(error);
    }
};

// Function to populate words for the month ensuring no duplicates across months
export const seedMonthWithWords = async (monthName, wordsForMonth) => {
    try {
        // Create an array of objects with "day" as key and "word" as value
        const wordsArray = wordsForMonth.map((word, index) => ({
            [index + 1]: word // {"1": "word1"}, {"2": "word2"}
        }));

        await client.query(`
            INSERT INTO month_words (month_name, words)
            VALUES ($1, $2::json)
            ON CONFLICT (month_name)
            DO UPDATE SET words = $2::json;
        `, [monthName, JSON.stringify(wordsArray)]);
        console.log(`Words for ${monthName} populated successfully!`);
    } catch (error) {
        console.error('Failed to populate words for the month!');
        console.error(error);
    }
};

// Function to initialize the current month words
export const initializeMonthWords = async () => {
    await createMonthWordsTable();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    await populateMonthWithWords(currentMonth);
};

// Schedule job to populate words for the next month
export const scheduleNextMonthWords = async () => {
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString('default', { month: 'long' });
    await populateMonthWithWords(nextMonth);
};

// Function to fetch all current words of the month
// export const fetchCurrentMonthWords = async () => {
//     try {
//         const monthNames = [
//             "January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"
//         ];
//         const currentMonth = monthNames[new Date().getMonth()];
//         console.log('Generated Month Name:', currentMonth);

//         const result = await client.query(`
//             SELECT words FROM month_words WHERE month_name = $1
//         `, [currentMonth]);

//         console.log('Query Result:', result.rows);

//         if (result.rows.length === 0) {
//             throw new Error('No words found for the current month');
//         }

//         return result.rows[0].words;
//     } catch (error) {
//         console.error('Failed to get current month words!', error);
//         throw error;
//     }
// };

// Function to change the word of the day
export const changeWordOfTheDay = async (monthName, day, newWord) => {
    try {
        // Ensure the new word exists in the word bank
        const { rows: wordCheck } = await client.query(`
            SELECT * FROM word_bank WHERE word = $1
        `, [newWord]);

        if (wordCheck.length === 0) {
            throw new Error('Word does not exist in the word bank');
        }

        // Fetch the current month's words
        const { rows: monthWords } = await client.query(`
            SELECT words FROM month_words WHERE month_name = $1
        `, [monthName]);

        if (monthWords.length === 0) {
            throw new Error('Month not found');
        }

        // Parse the current words JSON
        const words = monthWords[0].words;

        // Update the specific day's word
        words[`day${day}`] = newWord;

        // Update the words in the database
        await client.query(`
            UPDATE month_words
            SET words = $1
            WHERE month_name = $2
        `, [words, monthName]);

        console.log('Word of the day updated successfully!');
    } catch (error) {
        console.error('Failed to update word of the day!');
        console.error(error);
    }
};

// Function to add a new word to the word bank
export const addWordToBank = async (word) => {
    try {
        await client.query(`
            INSERT INTO word_bank (word)
            VALUES ($1)
        `, [word]);
    } catch (error) {
        console.error('Failed to add word');
        console.error(error);
        throw error;
    }
};

// Function to delete a word from the word bank
export const deleteWordFromBank = async (id) => {
    try {
        await client.query(`
            DELETE FROM word_bank
            WHERE id = $1
        `, [id]);
    } catch (error) {
        console.error('Failed to delete word');
        console.error(error);
    }
};

export const fetchWordOfTheDay = async () => {
    try {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        const currentDate = new Date().getDate();

        const { rows } = await client.query(`
            SELECT words->>$1 AS word_of_the_day
            FROM month_words
            WHERE month_name = $2
        `, [`day${currentDate}`, currentMonth]);
        return rows[0].word_of_the_day;
    } catch (error) {
        console.error('Failed to fetch word of the day');
        console.error(error);
    }
};

// Function to fetch words for a specific month
export const fetchWordsForMonth = async (month) => {
    try {
        const result = await client.query(`
            SELECT words FROM month_words WHERE month_name = $1
        `, [month]);

        if (result.rows.length === 0) {
            throw new Error('No words found for the specified month');
        }

        return {
            month,
            words: result.rows[0].words
        };
    } catch (error) {
        console.error('Failed to fetch words for the month!');
        throw error;
    }
};

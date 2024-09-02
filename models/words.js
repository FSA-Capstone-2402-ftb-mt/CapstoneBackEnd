import {client} from "../config/db.js";

// Seed Words table in database
export const seedWords = async () => {
    try {
        await client.query(`
            DROP TABLE IF EXISTS word_bank;
            CREATE TABLE IF NOT EXISTS word_bank
            (
                id
                SERIAL
                PRIMARY
                KEY,
                word
                VARCHAR
            (
                5
            ) NOT NULL);
            INSERT INTO word_bank (word)
            VALUES ('cameo'),
                   ('adapt'),
                   ('drake');
        `);
        console.log("Word Bank seeded Successfully!");
    } catch (error) {
        console.error("Failed to seed words table!");
        console.error(error);
    }
};

// Function to get all words
export const fetchAllWords = async () => {
    try {
        const {rows: word_bank} = await client.query(`
            SELECT *
            FROM public.word_bank
        `);
        return word_bank;
    } catch (error) {
        console.error("Failed to get all Words!");
        console.error(error);
    }
};

// Function to get single word by Id
export const fetchSingleWord = async (id) => {
    try {
        const {rows} = await client.query(`
            SELECT *
            FROM public.word_bank
            WHERE id = $1
        `, [id]);
        return rows[0];
    } catch (error) {
        console.error("Failed to get Word by Id!");
        console.error(error);
    }
};

// Function to get a random word for a user without repetition
export const fetchRandomWord = async (username) => {
    try {
        // Get the list of used words for the user
        const {rows: usedWordsResult} = await client.query(`
            SELECT used_words
            FROM users
            WHERE username = $1
        `, [username]);

        // Ensure we have an array to work with, even if no used words are found
        const usedWords = usedWordsResult[0]?.used_words || [];

        // Get a random word from the word_bank that is not in the used words list
        const {rows: randomWordResult} = await client.query(`
            SELECT word
            FROM word_bank
            WHERE word NOT IN (SELECT unnest($1::text[]))
            ORDER BY RANDOM() LIMIT 1
        `, [usedWords]);

        // Check if any word was found
        if (randomWordResult.length === 0) {
            throw new Error("No more words available");
        }

        const randomWord = randomWordResult[0].word;

        // Update the used words list for the user
        await client.query(`
            UPDATE users
            SET used_words = array_append(used_words, $1)
            WHERE username = $2
        `, [randomWord, username]);

        return randomWord;
    } catch (error) {
        console.error("Failed to fetch random word!");
        console.error(error);
    }
};

// Function to populate words for the month ensuring no duplicates across months
export const seedMonthWithWords = async (monthName, wordsForMonth) => {
    try {
        // Create an array of objects with "day" as key and "word" as value
        const wordsArray = wordsForMonth.map((word, index) => ({
            [index + 1]: word,
        }));

        await client.query(`
            INSERT INTO month_words (month_name, words)
            VALUES ($1, $2::json) ON CONFLICT (month_name)
            DO
            UPDATE SET words = $2::json;
        `, [monthName, JSON.stringify(wordsArray)]);
        console.log(`Words for ${monthName} populated successfully!`);
    } catch (error) {
        console.error("Failed to populate words for the month!");
        console.error(error);
    }
};

// Function to change the word of the day
export const changeWordOfTheDay = async (monthName, day, newWord) => {
    try {
        // Ensure the new word exists in the word bank
        const {rows: wordCheck} = await client.query(`
            SELECT *
            FROM word_bank
            WHERE word = $1
        `, [newWord]);

        if (wordCheck.length === 0) {
            throw new Error("Word does not exist in the word bank");
        }

        // Fetch the current month's words
        const {rows: monthWords} = await client.query(`
            SELECT words
            FROM month_words
            WHERE month_name = $1
        `, [monthName]);

        if (monthWords.length === 0) {
            throw new Error("Month not found");
        }

        // Parse the current words JSON
        let words = monthWords[0].words;

        // Update the specific day's word
        if (!words.hasOwnProperty(day)) {
            throw new Error(`Day ${day} does not exist in the words data for ${monthName}`);
        }

        words[day] = newWord; // Directly update the word for the specified day

        // Update the words in the database
        await client.query(`
            UPDATE month_words
            SET words = $1
            WHERE month_name = $2
        `, [JSON.stringify(words), monthName]);

        console.log("Word of the day updated successfully!");
    } catch (error) {
        console.error("Failed to update word of the day!", error);
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
        console.error("Failed to add word");
        console.error(error);
        throw error;
    }
};

// Function to delete a word from the word bank
export const deleteWordFromBank = async (id) => {
    try {
        await client.query(`
            DELETE
            FROM word_bank
            WHERE id = $1
        `, [id]);
    } catch (error) {
        console.error("Failed to delete word");
        console.error(error);
    }
};

// Function to fetch word of the day
export const fetchWordOfTheDay = async () => {
    try {
        const currentMonth = new Date().toLocaleString("default", { month: "long" });
        let currentDate = new Date().getDate().toString();

        const { rows } = await client.query(`
            SELECT words ->> $1 AS todaysWord
            FROM month_words
            WHERE month_name = $2
        `, [currentDate, currentMonth]);

        // Format the current date as MM/DD/YYYY
        const formattedDate = new Date().toLocaleDateString('en-US');

        return {
            date: formattedDate,
            wotd: rows[0]?.todaysword || "No word found"
        };
    } catch (error) {
        console.error("Failed to fetch word of the day");
        console.error(error);
        return {
            date: null,
            wotd: "Error fetching word of the day"
        };
    }
};

// Function to fetch words for a specific month
export const fetchWordsForMonth = async (month) => {
    try {
        const result = await client.query(`
            SELECT words
            FROM month_words
            WHERE month_name = $1
        `, [month]);

        if (result.rows.length === 0) {
            throw new Error("No words found for the specified month");
        }

        return {
            month, words: result.rows[0].words,
        };
    } catch (error) {
        console.error("Failed to fetch words for the month!");
        throw error;
    }
};

// Function to fetch a random word that hasn't been used yet for PvP
export const fetchUnusedRandomWord = async (player1Username, player2Username) => {
    try {
        const { rows } = await client.query(
            `
                SELECT word FROM word_bank
                WHERE word NOT IN (
                    SELECT unnest(COALESCE(array_agg(used_words), '{}'))
                    FROM matchmaking
                    WHERE (player1_username = $1 AND player2_username = $2)
                       OR (player1_username = $2 AND player2_username = $1)
                )
                ORDER BY RANDOM()
                    LIMIT 1
            `,
            [player1Username, player2Username]
        );

        if (rows.length === 0) {
            throw new Error("No unused words available for these players");
        }

        return rows[0].word;
    } catch (error) {
        console.error("Failed to fetch an unused random word:", error);
        throw error;
    }
};

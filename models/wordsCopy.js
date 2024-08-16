import { client } from "../config/db.js";
import { fetchAllWords } from "./words.js";

export const seedWordsPerMonth = async (monthName, wordsForMonth) => {
  try {
    // Convert wordsForMonth object to an array of entries
    const wordsArray = Object.entries(wordsForMonth); // This should create an array like [["1", "word1"], ["2", "word2"], ...]

    // Reduce the array back to an object to ensure proper structure
    const wordsIndexObject = wordsArray.reduce((obj, [index, word]) => {
      obj[index] = word;
      return obj;
    }, {});

    // Insert into the database
    await client.query(
      `INSERT INTO month_words (month_name, words)
       VALUES ($1, $2::json)
       ON CONFLICT (month_name)
       DO UPDATE SET words = $2::json;`,
      [monthName, JSON.stringify(wordsIndexObject)]
    );
  } catch (error) {
    console.error("Error seeding words per month:", error);
  }
};

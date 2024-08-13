import { client } from "../config/db.js";
import { fetchAllWords } from "./words.js";

export const seedWordsPerMonth = async (monthName) => {
  try {
    const wordsArray = await fetchAllWords();
    const wordsIndexArray = wordsArray.map(
      (word,
      (index) => {
        [index + 1, word];
      })
    );

    await client.query(
      `INSERT INTO month_words (month_name, words)
        VALUES ($1, $2::json)
        ON CONFLICT (month_name)
        DO UPDATE SET words = $2::json;
        `,
      [monthName, JSON.stringify(wordsIndexArray)]
    );
  } catch (error) {}
};

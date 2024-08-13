import { client } from "../config/db.js";
import {
  calculateScore,
  calculateTimedScore,
} from "../services/gameService.js";

// Function to update regular game score
export const updateRegularGameScore = async (
  username,
  correctGuess,
  attempts,
  streak
) => {
  try {
    // Fetch the current streak from the database
    const { rows: userRows } = await client.query(
      `
            SELECT current_streak, max_streak
            FROM users
            WHERE username = $1
        `,
      [username]
    );

    const user = userRows[0];
    let currentStreak = user.current_streak;
    let maxStreak = user.max_streak;

    // Update the streak based on whether the guess was correct
    if (correctGuess) {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    // Calculate the score
    const score = calculateScore(correctGuess, attempts, streak);

    // Update the user's scores and streaks in the database
    const { rows } = await client.query(
      `
            UPDATE users
            SET regular_score = regular_score + $1,
                overall_score = overall_score + $1,
                overall_games = overall_games + 1,
                regular_games = regular_games + 1,
                guess_${attempts} = guess_${attempts} + 1,
                current_streak = $2,
                max_streak = $3
            WHERE username = $4
            RETURNING *;
        `,
      [score, currentStreak, maxStreak, username]
    );

    return rows[0];
  } catch (error) {
    console.error("Failed to update regular game score!", error);
    throw error;
  }
};

// Function to update timed game score
export const updateTimedGameScore = async (
  username,
  correctGuess,
  attempts,
  timeTaken,
  streak
) => {
  try {
    // Fetch the current streak from the database
    const { rows: userRows } = await client.query(
      `
            SELECT current_streak, max_streak
            FROM users
            WHERE username = $1
        `,
      [username]
    );

    const user = userRows[0];
    let currentStreak = user.current_streak;
    let maxStreak = user.max_streak;

    // Update the streak based on whether the guess was correct
    if (correctGuess) {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    // Calculate the score
    const score = calculateTimedScore(
      correctGuess,
      attempts,
      timeTaken,
      streak
    );

    // Update the user's scores and streaks in the database
    const { rows } = await client.query(
      `
            UPDATE users
            SET timed_score = timed_score + $1,
                overall_score = overall_score + $1,
                overall_games = overall_games + 1,
                timed_games = timed_games + 1,
                guess_${attempts} = guess_${attempts} + 1,
                current_streak = $2,
                max_streak = $3
            WHERE username = $4
            RETURNING *;
        `,
      [score, currentStreak, maxStreak, username]
    );

    return rows[0];
  } catch (error) {
    console.error("Failed to update timed game score!", error);
    throw error;
  }
};

// Function to end regular game
export const endRegularGame = async (req, res) => {
  const { username, correctGuess, attempts, streak } = req.body;
  console.log("End regular game request body:", req.body);

  try {
    const updatedUser = await updateRegularGameScore(
      username,
      correctGuess,
      attempts,
      streak
    );
    res.status(200).json({
      message: "Regular game ended successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error ending regular game:", error);
    res.status(500).json({ message: "Failed to end regular game" });
  }
};

// Function to end timed game
export const endTimedGame = async (req, res) => {
  const { username, correctGuess, attempts, timeTaken, streak } = req.body;

  try {
    const updatedUser = await updateTimedGameScore(
      username,
      correctGuess,
      attempts,
      timeTaken,
      streak
    );
    res.status(200).json({
      message: "Timed game ended successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error ending timed game:", error);
    res.status(500).json({ message: "Failed to end timed game" });
  }
};

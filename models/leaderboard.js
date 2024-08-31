import {client} from "../config/db.js";

// Function to get leaderboard data
export const getCombinedLeaderboardData = async () => {
    const {rows} = await client.query(
        `
            WITH timed_scores AS (SELECT username, timed_score
                                  FROM users
                                  WHERE timed_score > 0
                                  ORDER BY timed_score DESC
                LIMIT 10)
               , max_streak_user AS (
            SELECT username, max_streak
            FROM users
            ORDER BY max_streak DESC
                LIMIT 1
                ),
                current_streaks AS (
            SELECT username, current_streak
            FROM users
            WHERE current_streak > 0
            ORDER BY current_streak DESC
                LIMIT 10
                )
            SELECT 'timed_scores' AS category, username, timed_score AS value
            FROM timed_scores
            UNION ALL
            SELECT 'max_streak_user', username, max_streak AS value
            FROM max_streak_user
            UNION ALL
            SELECT 'current_streaks', username, current_streak AS value
            FROM current_streaks;
        `
    );
    return rows;
};
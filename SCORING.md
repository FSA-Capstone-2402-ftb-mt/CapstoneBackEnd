# Wordle Scoring System Documentation

## Introduction

This document provides an overview of the scoring system implemented for the Wordle game in the CapstoneBackEnd project.
The scoring system is designed to reward players based on their performance in the game, including factors such as the
number of attempts, time taken, and consecutive daily streaks.

## Scoring Criteria

### Overall Score

- The overall score is the sum of the regular game score and the timed game score.

### Regular Game Score

- **Removed score system**

### Timed Game Score

- **Base Points:**
    - Correctly guessing the word: 50 points
    - Incorrect guess: 0 points
- **Bonus Points for Efficiency:**
    - Guessing the word on the first try: 50 bonus points
    - Guessing the word on the second try: 40 bonus points
    - Guessing the word on the third try: 30 bonus points
    - Guessing the word on the fourth try: 20 bonus points
    - Guessing the word on the fifth try: 10 bonus points
    - Guessing the word on the sixth try: 5 bonus points
- **Time-Based Bonus:**
    - Guessing within 1 minute: 50 points
    - Guessing within 3 minutes: 40 points
    - Guessing within 5 minute: 30 points
    - Guessing within 7 minutes: 20 points
    - Guessing within 9 minute: 10 points
    - Guessing within >10 minutes: 0 points
- **Daily Streak Bonus:**
    - 2-day streak: 10 points
    - 3-day streak: 20 points
    - 4-day streak: 30 points
    - 5-day streak: 40 points
    - 6-day streak and beyond: 50 points

## Example Point Calculation

### Regular Game Example

- Correct Word on Third Try with a 3-Day Streak:
    - **Base Points:** 50 points
    - **Bonus for Third Try:** 30 points
    - **Streak Bonus:** 20 points
    - **Total:** 50 + 30 + 20 = 100 points

### Timed Game Example

- Correct Word on Third Try within 2 Minutes with a 3-Day Streak:
    - **Base Points:** 50 points
    - **Bonus for Third Try:** 30 points
    - **Time-Based Bonus:** 10 points
    - **Streak Bonus:** 20 points
    - **Total:** 50 + 30 + 10 + 20 = 110 points

## Implementation Details

### Scoring Logic

The scoring logic is implemented in the `calculateScore` and `calculateTimedScore` functions within the
`services/gameService.js` file.
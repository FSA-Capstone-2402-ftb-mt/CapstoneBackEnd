// Logic for Regular Game
export const calculateScore = (correctGuess, attempts, streak) => {
  let score = 0;

  if (correctGuess) {
    score += 50; // points for guessing correctly

    // Bonus based on attempts
    const attemptBonus = [50, 40, 30, 20, 10, 5]; // Six maximum guesses
    score += attemptBonus[attempts - 1] || 0;

    // Streak bonus
    if (streak >= 5) {
      score += 50;
    } else if (streak > 1) {
      score += streak * 10;
    }
  }
  return score;
};

// Logic for Timed Game
export const calculateTimedScore = (
  correctGuess,
  attempts,
  timeTaken,
  streak
) => {
  let score = 0;

  if (correctGuess) {
    score += 50; // points for guessing correctly

    // Bonus based on attempts
    const attemptBonus = [50, 40, 30, 20, 10, 5]; // Six maximum guesses
    score += attemptBonus[attempts - 1] || 0;

    // Time based bonus
    if (timeTaken <= 60) {
      // within 1 minute
      score += 50;
    } else if (timeTaken <= 180) {
      // within 3 minutes
      score += 40;
    } else if (timeTaken <= 300) {
      // within 5 minutes
      score += 30;
    } else if (timeTaken <= 420) {
      // within 7 minutes
      score += 20;
    } else if (timeTaken <= 540) {
      // within 9 minutes
      score += 10;
    } else {
      // more than 10 minutes
      score += 0;
    }

    // Streak bonus
    if (streak >= 4) {
      score += 50;
    } else if (streak > 1) {
      score += streak * 10;
    }
  }
  return score;
};

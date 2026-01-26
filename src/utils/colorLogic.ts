/**
 * Wordle color evaluation logic
 *
 * Handles the evaluation of guesses against target words,
 * including proper handling of duplicate letters.
 */

import type { EvaluatedTile, TileState } from '../types';

/**
 * Evaluate a guess against a target word
 *
 * Rules:
 * 1. Exact matches (correct position) are marked green first
 * 2. Present but wrong position letters are marked yellow,
 *    respecting the remaining count of each letter
 * 3. All other letters are marked absent (gray)
 *
 * @param guess - The guessed word
 * @param target - The target word to guess
 * @returns Array of evaluated tiles
 */
export function evaluateGuess(guess: string, target: string): EvaluatedTile[] {
  // Null safety checks
  if (!guess || typeof guess !== 'string') {
    console.error('evaluateGuess: invalid guess', guess);
    throw new Error('Invalid guess word');
  }
  if (!target || typeof target !== 'string') {
    console.error('evaluateGuess: invalid target', target);
    throw new Error('Invalid target word');
  }

  const guessArr = guess.toLowerCase().split('');
  const targetArr = target.toLowerCase().split('');

  // Initialize all tiles as absent
  const result: EvaluatedTile[] = guessArr.map((letter) => ({
    letter,
    state: 'absent' as TileState,
  }));

  // Track remaining letters in target (for yellow evaluation)
  const remainingLetters: Record<string, number> = {};
  for (const letter of targetArr) {
    remainingLetters[letter] = (remainingLetters[letter] || 0) + 1;
  }

  // First pass: Find exact matches (green)
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i].state = 'correct';
      remainingLetters[guessArr[i]]--;
    }
  }

  // Second pass: Find present but wrong position (yellow)
  for (let i = 0; i < guessArr.length; i++) {
    if (result[i].state === 'correct') continue;

    const letter = guessArr[i];
    if (remainingLetters[letter] && remainingLetters[letter] > 0) {
      result[i].state = 'present';
      remainingLetters[letter]--;
    }
  }

  // Debug logging
  console.log(`evaluateGuess: "${guess}" vs "${target}"`);
  console.log('  Result:', result.map(t => `${t.letter}:${t.state}`).join(', '));

  return result;
}

/**
 * Check if a guess is completely correct
 */
export function isCorrectGuess(evaluation: EvaluatedTile[]): boolean {
  return evaluation.every((tile) => tile.state === 'correct');
}

/**
 * Get unique letters from evaluation that have a specific state
 */
export function getLettersByState(
  evaluation: EvaluatedTile[],
  state: TileState
): string[] {
  return [...new Set(
    evaluation
      .filter((tile) => tile.state === state)
      .map((tile) => tile.letter)
  )];
}

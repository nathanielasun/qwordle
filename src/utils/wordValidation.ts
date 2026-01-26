/**
 * Word validation utilities
 *
 * Wordle game design:
 * - Valid guesses: ALL words in the comprehensive dictionary (10,000+ words including plurals)
 * - Target words: Curated list of common words (no plurals, no obscure words)
 */

import { WORD_LENGTH } from '../constants/config';
import type { ValidationResult } from '../types';

// Word list structure from JSON
interface WordListData {
  validWords: string[];   // Comprehensive list for validation (includes plurals)
  targetWords: string[];  // Curated list for answers (no plurals)
}

// All valid words (for validating guesses)
let validWords: Set<string> | null = null;
let validWordsArray: string[] | null = null;

// Target words only (curated, for selecting answers)
let targetWordsArray: string[] | null = null;

/**
 * Load the word list from the JSON file
 */
export async function loadWordList(): Promise<Set<string>> {
  if (validWords && targetWordsArray) {
    console.log('Word list already loaded');
    return validWords;
  }

  try {
    console.log('Loading word list...');
    const response = await fetch('/words.json');
    if (!response.ok) {
      throw new Error(`Failed to load word list: ${response.status}`);
    }

    const data: WordListData = await response.json();

    // Validate the structure
    if (!data.validWords || !Array.isArray(data.validWords) || data.validWords.length === 0) {
      throw new Error('Invalid word list: validWords is missing or empty');
    }
    if (!data.targetWords || !Array.isArray(data.targetWords) || data.targetWords.length === 0) {
      throw new Error('Invalid word list: targetWords is missing or empty');
    }

    // Store valid words (comprehensive list for guess validation)
    validWordsArray = data.validWords.map((w) => w.toLowerCase());
    validWords = new Set(validWordsArray);

    // Store target words (curated list for answer selection)
    targetWordsArray = data.targetWords.map((w) => w.toLowerCase());

    console.log(`Loaded word list: ${validWordsArray.length} valid words, ${targetWordsArray.length} target words`);

    // Validate a few target words exist
    console.log('Sample target words:', targetWordsArray.slice(0, 5));

    return validWords;
  } catch (error) {
    console.error('Error loading word list:', error);
    throw error;
  }
}

/**
 * Check if the word list has been loaded
 */
export function isWordListLoaded(): boolean {
  return validWords !== null && targetWordsArray !== null;
}

/**
 * Check if a word is valid (for guesses - comprehensive list)
 */
export function isValidWord(word: string): boolean {
  if (!validWords) {
    console.error('Word list not loaded when checking isValidWord');
    return false;
  }
  return validWords.has(word.toLowerCase());
}

/**
 * Get a random target word
 */
export function getRandomWord(): string {
  if (!targetWordsArray || targetWordsArray.length === 0) {
    throw new Error('Word list not loaded. Call loadWordList() first.');
  }
  const index = Math.floor(Math.random() * targetWordsArray.length);
  const word = targetWordsArray[index];
  if (!word) {
    throw new Error(`Failed to get random word at index ${index}`);
  }
  return word;
}

/**
 * Get multiple unique random target words
 */
export function getRandomWords(count: number): string[] {
  if (!targetWordsArray || targetWordsArray.length === 0) {
    throw new Error('Word list not loaded. Call loadWordList() first.');
  }

  if (count > targetWordsArray.length) {
    throw new Error(`Cannot get ${count} unique words from a list of ${targetWordsArray.length}`);
  }

  // Fisher-Yates shuffle for better randomization
  const shuffled = [...targetWordsArray];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  const result = shuffled.slice(0, count);

  // Validate all words are non-null strings
  for (let i = 0; i < result.length; i++) {
    const word = result[i];
    if (!word || typeof word !== 'string') {
      console.error(`Invalid word at index ${i}:`, word);
      throw new Error(`Invalid word in selection at index ${i}: ${word}`);
    }
  }

  console.log(`Selected ${count} random words:`, result);
  return result;
}

/**
 * Validate user input
 */
export function validateInput(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Please enter a word' };
  }

  const normalized = input.toLowerCase().trim();

  if (normalized.length === 0) {
    return { valid: false, error: 'Please enter a word' };
  }

  if (normalized.length !== WORD_LENGTH) {
    return { valid: false, error: `Word must be ${WORD_LENGTH} letters` };
  }

  if (!/^[a-z]+$/.test(normalized)) {
    return { valid: false, error: 'Only letters allowed' };
  }

  if (!isValidWord(normalized)) {
    return { valid: false, error: 'Not in word list' };
  }

  return { valid: true, word: normalized };
}

/**
 * Get the total number of valid words (for guesses)
 */
export function getWordCount(): number {
  return validWordsArray?.length ?? 0;
}

/**
 * Get the total number of target words
 */
export function getTargetWordCount(): number {
  return targetWordsArray?.length ?? 0;
}

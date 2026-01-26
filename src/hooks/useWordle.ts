/**
 * useWordle - Hook for managing single Wordle game state
 *
 * This hook manages a single game for Phase 1 testing.
 * For multi-game support (Phase 2+), use the gameStore instead.
 */

import { useState, useCallback, useEffect } from 'react';
import { Guess, GameStatus, KeyState } from '../types';
import { evaluateGuess, isCorrectGuess } from '../utils/colorLogic';
import { validateInput, loadWordList, getRandomWord, isWordListLoaded } from '../utils/wordValidation';
import { WORD_LENGTH, calculateGuesses } from '../constants/config';

interface UseWordleOptions {
  maxGuesses?: number;
  targetWord?: string;
}

interface UseWordleReturn {
  // State
  guesses: Guess[];
  currentGuess: string;
  status: GameStatus;
  targetWord: string;
  error: string | null;
  keyStates: Record<string, KeyState>;
  isLoading: boolean;
  revealingRow: number | null;
  isShaking: boolean;

  // Actions
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  resetGame: () => void;
}

export function useWordle(options: UseWordleOptions = {}): UseWordleReturn {
  const { maxGuesses = calculateGuesses(2), targetWord: initialTarget } = options;

  // Loading state
  const [isLoading, setIsLoading] = useState(!isWordListLoaded());

  // Game state
  const [targetWord, setTargetWord] = useState(initialTarget || '');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [error, setError] = useState<string | null>(null);
  const [keyStates, setKeyStates] = useState<Record<string, KeyState>>({});
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Load word list on mount
  useEffect(() => {
    if (!isWordListLoaded()) {
      loadWordList()
        .then(() => {
          if (!initialTarget) {
            setTargetWord(getRandomWord());
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setError(`Failed to load words: ${err.message}`);
          setIsLoading(false);
        });
    } else if (!initialTarget) {
      setTargetWord(getRandomWord());
    }
  }, [initialTarget]);

  // Update key states based on guesses
  const updateKeyStates = useCallback((allGuesses: Guess[]) => {
    const states: Record<string, KeyState> = {};

    for (const guess of allGuesses) {
      for (const tile of guess.evaluation) {
        const letter = tile.letter.toLowerCase();
        const currentState = states[letter] || 'unused';

        // Priority: correct > present > absent > unused
        if (tile.state === 'correct') {
          states[letter] = 'correct';
        } else if (tile.state === 'present' && currentState !== 'correct') {
          states[letter] = 'present';
        } else if (tile.state === 'absent' && currentState === 'unused') {
          states[letter] = 'absent';
        }
      }
    }

    setKeyStates(states);
  }, []);

  // Add a letter to current guess
  const addLetter = useCallback((letter: string) => {
    if (status !== 'playing') return;
    if (currentGuess.length >= WORD_LENGTH) return;

    setCurrentGuess((prev) => prev + letter.toLowerCase());
    setError(null);
  }, [status, currentGuess.length]);

  // Remove last letter from current guess
  const removeLetter = useCallback(() => {
    if (status !== 'playing') return;

    setCurrentGuess((prev) => prev.slice(0, -1));
    setError(null);
  }, [status]);

  // Submit current guess
  const submitGuess = useCallback(() => {
    if (status !== 'playing') return;
    if (isLoading) return;

    // Validate input
    const validation = validateInput(currentGuess);
    if (!validation.valid) {
      setError(validation.error || 'Invalid word');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const word = validation.word!;
    const evaluation = evaluateGuess(word, targetWord);
    const newGuess: Guess = {
      word,
      evaluation,
      timestamp: Date.now(),
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setError(null);

    // Trigger reveal animation
    setRevealingRow(guesses.length);
    setTimeout(() => setRevealingRow(null), 500 * WORD_LENGTH);

    // Update key states
    updateKeyStates(newGuesses);

    // Check win/loss
    const isWin = isCorrectGuess(evaluation);
    if (isWin) {
      setStatus('won');
    } else if (newGuesses.length >= maxGuesses) {
      setStatus('lost');
    }
  }, [status, isLoading, currentGuess, targetWord, guesses, maxGuesses, updateKeyStates]);

  // Reset game
  const resetGame = useCallback(() => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess('');
    setStatus('playing');
    setError(null);
    setKeyStates({});
    setRevealingRow(null);
    setIsShaking(false);
  }, []);

  return {
    guesses,
    currentGuess,
    status,
    targetWord,
    error,
    keyStates,
    isLoading,
    revealingRow,
    isShaking,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
  };
}

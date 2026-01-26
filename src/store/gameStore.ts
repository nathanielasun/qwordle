/**
 * Game state store using Zustand
 */

import { create } from 'zustand';
import type {
  GamePhase,
  SingleGame,
  Guess,
  GameStats,
  KeyState,
  LifetimeStats,
} from '../types';
import { evaluateGuess, isCorrectGuess } from '../utils/colorLogic';
import { aggregateKeyStates } from '../utils/keyboardState';
import { getRandomWords, validateInput } from '../utils/wordValidation';
import { loadLifetimeStats, updateLifetimeStats } from '../utils/localStorage';
import { calculateGuesses, CORRECT_LETTERS_PER_QUANTUM_USAGE } from '../constants/config';

interface GameState {
  // Game configuration
  n: number;
  phase: GamePhase;

  // Games
  games: SingleGame[];

  // Current input
  currentGuess: string;

  // Error message for invalid input
  errorMessage: string | null;

  // Statistics
  stats: GameStats;

  // Recent bonus game (for highlighting)
  recentBonusGame: number | null;

  // Computed values
  keyStates: Record<string, KeyState>;

  // Quantum usage system
  totalCorrectLetters: number;       // Total correct (green) letters earned across all games
  quantumUsagesAvailable: number;    // Number of quantum circuit usages available
  quantumUsagesUsed: number;         // Number of quantum circuit usages consumed

  // Lifetime statistics
  lifetimeStats: LifetimeStats;

  // Actions
  initializeGames: (n: number) => void;
  setCurrentGuess: (guess: string) => void;
  submitGuess: () => void;
  addBonusToGame: (gameIndex: number) => void;
  useQuantumCharge: () => boolean;   // Use a quantum charge, returns true if successful
  resetGame: () => void;
  clearError: () => void;
  refreshLifetimeStats: () => void;  // Reload stats from localStorage
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  n: 2,
  phase: 'setup',
  games: [],
  currentGuess: '',
  errorMessage: null,
  stats: {
    totalGames: 0,
    gamesWon: 0,
    gamesLost: 0,
    totalGuesses: 0,
    bonusGuessesUsed: 0,
    quantumMeasurements: 0,
  },
  recentBonusGame: null,
  keyStates: {},
  totalCorrectLetters: 0,
  quantumUsagesAvailable: 0,
  quantumUsagesUsed: 0,
  lifetimeStats: loadLifetimeStats(),

  // Initialize games with random words
  initializeGames: (n: number) => {
    const numGames = Math.pow(2, n);
    const baseGuesses = calculateGuesses(n);

    let words: string[];
    try {
      words = getRandomWords(numGames);
      console.log(`Initialized ${numGames} games with words:`, words);
    } catch (error) {
      console.error('Failed to get random words:', error);
      throw error;
    }

    // Validate all words before creating games
    for (let i = 0; i < words.length; i++) {
      if (!words[i] || typeof words[i] !== 'string') {
        console.error(`Invalid word at index ${i}:`, words[i]);
        throw new Error(`Invalid word at index ${i}: ${words[i]}`);
      }
    }

    const games: SingleGame[] = words.map((word, i) => ({
      id: i,
      binaryLabel: i.toString(2).padStart(n, '0'),
      targetWord: word,
      guesses: [],
      maxGuesses: baseGuesses,
      bonusGuesses: 0,
      status: 'playing',
    }));

    set({
      n,
      phase: 'playing',
      games,
      currentGuess: '',
      errorMessage: null,
      recentBonusGame: null,
      keyStates: {},
      totalCorrectLetters: 0,
      quantumUsagesAvailable: 0,
      quantumUsagesUsed: 0,
      stats: {
        totalGames: numGames,
        gamesWon: 0,
        gamesLost: 0,
        totalGuesses: 0,
        bonusGuessesUsed: 0,
        quantumMeasurements: 0,
      },
    });
  },

  // Set current guess input
  setCurrentGuess: (guess: string) => {
    set({
      currentGuess: guess.toLowerCase().slice(0, 5),
      errorMessage: null,
    });
  },

  // Submit guess to all active games
  submitGuess: () => {
    const { currentGuess, games, stats, totalCorrectLetters, quantumUsagesAvailable } = get();

    // Validate input
    const validation = validateInput(currentGuess);
    if (!validation.valid) {
      set({ errorMessage: validation.error });
      return;
    }

    const word = validation.word!;
    const timestamp = Date.now();

    // Track new correct letters from this guess
    let newCorrectLetters = 0;

    // Apply guess to all active games
    const updatedGames = games.map((game) => {
      if (game.status !== 'playing') return game;

      const totalAllowed = game.maxGuesses + game.bonusGuesses;
      if (game.guesses.length >= totalAllowed) return game;

      const evaluation = evaluateGuess(word, game.targetWord);
      const newGuess: Guess = { word, evaluation, timestamp };

      // Count correct letters (green tiles) from this guess for this game
      const correctInThisGuess = evaluation.filter(e => e.state === 'correct').length;
      newCorrectLetters += correctInThisGuess;

      const isWin = isCorrectGuess(evaluation);
      const guessCount = game.guesses.length + 1;
      const isLoss = !isWin && guessCount >= totalAllowed;

      return {
        ...game,
        guesses: [...game.guesses, newGuess],
        status: isWin ? 'won' : isLoss ? 'lost' : game.status,
      } as SingleGame;
    });

    // Count wins and losses
    const gamesWon = updatedGames.filter((g) => g.status === 'won').length;
    const gamesLost = updatedGames.filter((g) => g.status === 'lost').length;
    const allFinished = updatedGames.every((g) => g.status !== 'playing');

    // Update keyboard states
    const keyStates = aggregateKeyStates(updatedGames);

    // Calculate new quantum usages earned
    const newTotalCorrect = totalCorrectLetters + newCorrectLetters;
    const previousUsagesEarned = Math.floor(totalCorrectLetters / CORRECT_LETTERS_PER_QUANTUM_USAGE);
    const newUsagesEarned = Math.floor(newTotalCorrect / CORRECT_LETTERS_PER_QUANTUM_USAGE);
    const usagesGained = newUsagesEarned - previousUsagesEarned;

    const updatedStats = {
      ...stats,
      totalGuesses: stats.totalGuesses + 1,
      gamesWon,
      gamesLost,
    };

    // Update lifetime stats if game just finished
    let newLifetimeStats = get().lifetimeStats;
    if (allFinished) {
      newLifetimeStats = updateLifetimeStats(
        updatedStats,
        get().n,
        gamesWon,
        updatedGames.length
      );
    }

    set({
      games: updatedGames,
      currentGuess: '',
      errorMessage: null,
      phase: allFinished ? 'finished' : 'playing',
      keyStates,
      totalCorrectLetters: newTotalCorrect,
      quantumUsagesAvailable: quantumUsagesAvailable + usagesGained,
      stats: updatedStats,
      lifetimeStats: newLifetimeStats,
    });
  },

  // Use a quantum charge (returns true if successful)
  useQuantumCharge: () => {
    const { quantumUsagesAvailable, quantumUsagesUsed } = get();

    if (quantumUsagesAvailable <= 0) {
      return false;
    }

    set({
      quantumUsagesAvailable: quantumUsagesAvailable - 1,
      quantumUsagesUsed: quantumUsagesUsed + 1,
    });

    return true;
  },

  // Add bonus guess to a specific game
  addBonusToGame: (gameIndex: number) => {
    const { games, stats } = get();

    if (gameIndex < 0 || gameIndex >= games.length) return;

    const game = games[gameIndex];
    if (game.status !== 'playing') return;

    const updatedGames = [...games];
    updatedGames[gameIndex] = {
      ...game,
      bonusGuesses: game.bonusGuesses + 1,
    };

    set({
      games: updatedGames,
      recentBonusGame: gameIndex,
      stats: {
        ...stats,
        bonusGuessesUsed: stats.bonusGuessesUsed + 1,
        quantumMeasurements: stats.quantumMeasurements + 1,
      },
    });

    // Clear recent bonus highlight after animation
    setTimeout(() => {
      set({ recentBonusGame: null });
    }, 2000);
  },

  // Reset to setup screen
  resetGame: () => {
    set({
      phase: 'setup',
      games: [],
      currentGuess: '',
      errorMessage: null,
      recentBonusGame: null,
      keyStates: {},
      totalCorrectLetters: 0,
      quantumUsagesAvailable: 0,
      quantumUsagesUsed: 0,
      lifetimeStats: loadLifetimeStats(), // Refresh from localStorage
    });
  },

  // Clear error message
  clearError: () => {
    set({ errorMessage: null });
  },

  // Refresh lifetime stats from localStorage
  refreshLifetimeStats: () => {
    set({ lifetimeStats: loadLifetimeStats() });
  },
}));

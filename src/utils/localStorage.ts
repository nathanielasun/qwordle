/**
 * LocalStorage utilities for persisting game statistics
 */

import type { LifetimeStats, GameStats } from '../types';

const STORAGE_KEY = 'qwordle-stats';

const DEFAULT_STATS: LifetimeStats = {
  sessionsPlayed: 0,
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  totalGuesses: 0,
  totalBonusGuessesUsed: 0,
  totalQuantumMeasurements: 0,
  perfectGames: 0,
  bestWinStreak: 0,
  currentWinStreak: 0,
  lastPlayed: 0,
  statsByN: {},
};

/**
 * Load lifetime stats from LocalStorage
 */
export function loadLifetimeStats(): LifetimeStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_STATS };
    }
    const parsed = JSON.parse(stored);
    // Merge with defaults to handle schema changes
    return { ...DEFAULT_STATS, ...parsed };
  } catch (error) {
    console.error('Failed to load stats from localStorage:', error);
    return { ...DEFAULT_STATS };
  }
}

/**
 * Save lifetime stats to LocalStorage
 */
export function saveLifetimeStats(stats: LifetimeStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats to localStorage:', error);
  }
}

/**
 * Update lifetime stats after a game session ends
 */
export function updateLifetimeStats(
  sessionStats: GameStats,
  n: number,
  gamesWon: number,
  totalGames: number
): LifetimeStats {
  const current = loadLifetimeStats();
  const isPerfect = gamesWon === totalGames;

  // Update overall stats
  const updated: LifetimeStats = {
    ...current,
    sessionsPlayed: current.sessionsPlayed + 1,
    totalGamesPlayed: current.totalGamesPlayed + totalGames,
    totalGamesWon: current.totalGamesWon + gamesWon,
    totalGuesses: current.totalGuesses + sessionStats.totalGuesses,
    totalBonusGuessesUsed: current.totalBonusGuessesUsed + sessionStats.bonusGuessesUsed,
    totalQuantumMeasurements: current.totalQuantumMeasurements + sessionStats.quantumMeasurements,
    perfectGames: current.perfectGames + (isPerfect ? 1 : 0),
    currentWinStreak: isPerfect ? current.currentWinStreak + 1 : 0,
    bestWinStreak: isPerfect
      ? Math.max(current.bestWinStreak, current.currentWinStreak + 1)
      : current.bestWinStreak,
    lastPlayed: Date.now(),
    statsByN: {
      ...current.statsByN,
      [n]: {
        sessionsPlayed: (current.statsByN[n]?.sessionsPlayed || 0) + 1,
        gamesWon: (current.statsByN[n]?.gamesWon || 0) + gamesWon,
        gamesPlayed: (current.statsByN[n]?.gamesPlayed || 0) + totalGames,
      },
    },
  };

  saveLifetimeStats(updated);
  return updated;
}

/**
 * Reset all lifetime stats
 */
export function resetLifetimeStats(): void {
  saveLifetimeStats({ ...DEFAULT_STATS });
}

/**
 * GameOverModal - End game summary modal with statistics
 */

import { Modal } from './Modal';
import { GameStats, SingleGame, LifetimeStats } from '../../types';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  games: SingleGame[];
  stats: GameStats;
  lifetimeStats: LifetimeStats;
  n: number;
}

export function GameOverModal({
  isOpen,
  onClose,
  onPlayAgain,
  onChangeSettings,
  games,
  stats,
  lifetimeStats,
  n,
}: GameOverModalProps) {
  const wonGames = games.filter(g => g.status === 'won').length;
  const lostGames = games.filter(g => g.status === 'lost').length;
  const totalGames = games.length;
  const winPercentage = Math.round((wonGames / totalGames) * 100);

  // Determine the overall result
  const isPerfect = wonGames === totalGames;
  const isAllLost = lostGames === totalGames;

  // Calculate average guesses for won games
  const wonGamesList = games.filter(g => g.status === 'won');
  const avgGuessesForWins = wonGamesList.length > 0
    ? (wonGamesList.reduce((sum, g) => sum + g.guesses.length, 0) / wonGamesList.length).toFixed(1)
    : '-';

  // Get the best and worst performing games
  const sortedByGuesses = [...wonGamesList].sort((a, b) => a.guesses.length - b.guesses.length);
  const bestGame = sortedByGuesses[0];
  const worstWonGame = sortedByGuesses[sortedByGuesses.length - 1];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isPerfect ? "Perfect!" : isAllLost ? "Game Over" : "Game Complete!"}>
      <div className="space-y-6">
        {/* Result Summary */}
        <div className={`text-center p-4 rounded-lg ${
          isPerfect ? 'bg-wordle-correct bg-opacity-20' :
          isAllLost ? 'bg-red-600 bg-opacity-20' :
          'bg-quantum-primary bg-opacity-20'
        }`}>
          <p className="text-4xl font-bold mb-2">
            {isPerfect ? '🎉' : isAllLost ? '😢' : '✨'}
          </p>
          <p className="text-2xl font-bold">
            {wonGames}/{totalGames} Games Won
          </p>
          <p className="text-text-muted">
            {winPercentage}% win rate
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-2xl font-bold text-quantum-primary">{stats.totalGuesses}</p>
            <p className="text-xs text-text-muted">Total Guesses</p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-2xl font-bold text-quantum-accent">{stats.bonusGuessesUsed}</p>
            <p className="text-xs text-text-muted">Bonus Guesses Used</p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-2xl font-bold text-quantum-secondary">{stats.quantumMeasurements}</p>
            <p className="text-xs text-text-muted">Quantum Measurements</p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-2xl font-bold text-status-won">{avgGuessesForWins}</p>
            <p className="text-xs text-text-muted">Avg Guesses (Wins)</p>
          </div>
        </div>

        {/* Game Configuration */}
        <div className="bg-bg-secondary rounded-lg p-3 text-center">
          <p className="text-sm text-text-muted">
            <span className="font-bold">n = {n}</span> • {totalGames} games • 2<sup>{n}</sup> quantum states
          </p>
        </div>

        {/* Best/Worst Games */}
        {wonGamesList.length > 0 && (
          <div className="text-sm space-y-2">
            {bestGame && (
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Quickest Win:</span>
                <span className="font-mono">
                  |{bestGame.binaryLabel}⟩ in {bestGame.guesses.length} guesses
                </span>
              </div>
            )}
            {worstWonGame && worstWonGame.id !== bestGame?.id && (
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Hardest Win:</span>
                <span className="font-mono">
                  |{worstWonGame.binaryLabel}⟩ in {worstWonGame.guesses.length} guesses
                </span>
              </div>
            )}
          </div>
        )}

        {/* Lost Games - Show Answers */}
        {lostGames > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-text-muted">Missed Words:</p>
            <div className="flex flex-wrap gap-2">
              {games
                .filter(g => g.status === 'lost')
                .map(game => (
                  <span
                    key={game.id}
                    className="bg-bg-secondary px-2 py-1 rounded text-xs font-mono"
                  >
                    |{game.binaryLabel}⟩ <span className="uppercase font-bold text-status-lost">{game.targetWord}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Lifetime Stats */}
        {lifetimeStats.sessionsPlayed > 0 && (
          <div className="border-t border-wordle-border pt-4 mt-4">
            <h3 className="text-sm font-bold text-quantum-primary mb-3">Lifetime Stats</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-bg-secondary rounded p-2">
                <p className="font-bold text-lg">{lifetimeStats.sessionsPlayed}</p>
                <p className="text-text-muted">Sessions</p>
              </div>
              <div className="bg-bg-secondary rounded p-2">
                <p className="font-bold text-lg">
                  {Math.round((lifetimeStats.totalGamesWon / Math.max(1, lifetimeStats.totalGamesPlayed)) * 100)}%
                </p>
                <p className="text-text-muted">Win Rate</p>
              </div>
              <div className="bg-bg-secondary rounded p-2">
                <p className="font-bold text-lg">{lifetimeStats.perfectGames}</p>
                <p className="text-text-muted">Perfect</p>
              </div>
            </div>
            {lifetimeStats.bestWinStreak > 0 && (
              <p className="text-xs text-text-muted text-center mt-2">
                Best Perfect Streak: {lifetimeStats.bestWinStreak}
                {lifetimeStats.currentWinStreak > 0 && (
                  <span className="text-quantum-accent"> (Current: {lifetimeStats.currentWinStreak})</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button onClick={onPlayAgain} className="btn btn--primary flex-1">
            Play Again
          </button>
          <button onClick={onChangeSettings} className="btn btn--secondary flex-1">
            Change Settings
          </button>
        </div>
      </div>
    </Modal>
  );
}

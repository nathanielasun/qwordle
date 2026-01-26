/**
 * useQWordleQuantum - Hook for quantum circuit integration in QWordle
 *
 * This hook wraps the web_qc_builder circuit state and quantum simulator
 * to provide a simplified interface for the QWordle game's bonus system.
 */

import { useState, useCallback } from 'react';
import { useCircuitState, useQuantumSimulator } from '@qc-builder/hooks';
import type { ExecutionResults } from '@qc-builder/types/circuit';
import { MEASUREMENT_SHOTS } from '../constants/config';

export interface QWordleExecutionResult {
  counts: Record<string, number>;
  probabilities: number[];
  mostProbableState: string;
  gameIndex: number;
  shots: number;
}

export interface UseQWordleQuantumReturn {
  // Circuit state (from web_qc_builder)
  circuit: ReturnType<typeof useCircuitState>['circuit'];
  numColumns: number;
  addGate: ReturnType<typeof useCircuitState>['addGate'];
  removeGate: ReturnType<typeof useCircuitState>['removeGate'];
  moveGate: ReturnType<typeof useCircuitState>['moveGate'];
  clearCircuit: ReturnType<typeof useCircuitState>['clearCircuit'];
  undo: ReturnType<typeof useCircuitState>['undo'];
  redo: ReturnType<typeof useCircuitState>['redo'];
  canUndo: boolean;
  canRedo: boolean;

  // Execution state
  isExecuting: boolean;
  isReady: boolean;
  results: ExecutionResults | null;
  error: string | null;

  // QWordle-specific
  lastBonusGameIndex: number | null;
  lastExecutionResult: QWordleExecutionResult | null;

  // Actions
  executeCircuit: () => Promise<QWordleExecutionResult | null>;
  resetCircuit: () => void;
  resetResults: () => void;
}

export function useQWordleQuantum(
  numQubits: number,
  onBonusGranted?: (gameIndex: number) => void
): UseQWordleQuantumReturn {
  // Use the web_qc_builder hooks
  const circuitState = useCircuitState(numQubits);
  const simulator = useQuantumSimulator();

  // QWordle-specific state
  const [lastBonusGameIndex, setLastBonusGameIndex] = useState<number | null>(null);
  const [lastExecutionResult, setLastExecutionResult] = useState<QWordleExecutionResult | null>(null);

  // Execute the circuit and determine bonus recipient
  const executeCircuit = useCallback(async (): Promise<QWordleExecutionResult | null> => {
    if (!simulator.isReady) {
      console.error('Quantum simulator not ready');
      return null;
    }

    if (circuitState.circuit.gates.length === 0) {
      console.warn('Cannot execute empty circuit');
      return null;
    }

    try {
      // Execute circuit with configured number of shots
      const results = await simulator.executeCircuit(circuitState.circuit, MEASUREMENT_SHOTS);

      if (!results) {
        console.error('Circuit execution returned no results');
        return null;
      }

      // Find the most probable measurement outcome
      let maxCount = 0;
      let mostProbableState = '0'.repeat(numQubits);

      for (const [state, count] of Object.entries(results.counts)) {
        if (count > maxCount) {
          maxCount = count;
          mostProbableState = state;
        }
      }

      // Convert binary state to game index
      // qcjs outputs states in standard binary format (MSB first)
      const gameIndex = parseInt(mostProbableState, 2);

      const executionResult: QWordleExecutionResult = {
        counts: results.counts,
        probabilities: results.probabilities,
        mostProbableState,
        gameIndex,
        shots: results.shots,
      };

      setLastExecutionResult(executionResult);
      setLastBonusGameIndex(gameIndex);

      // Grant bonus to the winning game
      if (onBonusGranted) {
        onBonusGranted(gameIndex);
      }

      console.log(`Quantum measurement: Most probable state |${mostProbableState}⟩ (game ${gameIndex})`);

      return executionResult;
    } catch (err) {
      console.error('Circuit execution failed:', err);
      return null;
    }
  }, [circuitState.circuit, numQubits, onBonusGranted, simulator]);

  // Reset circuit to empty state
  const resetCircuit = useCallback(() => {
    circuitState.clearCircuit();
    simulator.reset();
    setLastExecutionResult(null);
    setLastBonusGameIndex(null);
  }, [circuitState, simulator]);

  // Reset just the results (keep circuit)
  const resetResults = useCallback(() => {
    simulator.reset();
    setLastExecutionResult(null);
    setLastBonusGameIndex(null);
  }, [simulator]);

  return {
    // Circuit state
    circuit: circuitState.circuit,
    numColumns: circuitState.numColumns,
    addGate: circuitState.addGate,
    removeGate: circuitState.removeGate,
    moveGate: circuitState.moveGate,
    clearCircuit: circuitState.clearCircuit,
    undo: circuitState.undo,
    redo: circuitState.redo,
    canUndo: circuitState.canUndo,
    canRedo: circuitState.canRedo,

    // Execution state
    isExecuting: simulator.isExecuting,
    isReady: simulator.isReady,
    results: simulator.results,
    error: simulator.error,

    // QWordle-specific
    lastBonusGameIndex,
    lastExecutionResult,

    // Actions
    executeCircuit,
    resetCircuit,
    resetResults,
  };
}

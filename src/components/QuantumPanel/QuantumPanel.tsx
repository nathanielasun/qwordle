/**
 * QuantumPanel - Quantum circuit builder interface for QWordle
 *
 * Allows players to build quantum circuits and measure them to earn
 * bonus guesses for specific games.
 */

import { useState } from 'react';
import { CircuitCanvas, GatePalette, ResultsPanel } from '@qc-builder/components';
import { useQWordleQuantum } from '../../quantum/useQWordleQuantum';

interface QuantumPanelProps {
  numQubits: number;
  onBonusGranted: (gameIndex: number) => void;
  gameLabels: string[]; // Binary labels for each game (e.g., ['00', '01', '10', '11'])
  disabled?: boolean;
}

export function QuantumPanel({
  numQubits,
  onBonusGranted,
  gameLabels,
  disabled = false,
}: QuantumPanelProps) {
  const quantum = useQWordleQuantum(numQubits, onBonusGranted);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [selectedInstances, setSelectedInstances] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(true);

  const handleGateAdd = (
    gateId: string,
    target: number,
    column: number,
    control?: number,
    _controls?: number[]
  ) => {
    quantum.addGate(gateId, target, column, control);
    setSelectedGate(null);
  };

  const handleGateSelect = (instanceId: string | null, addToSelection?: boolean) => {
    if (instanceId === null) {
      setSelectedInstances(new Set());
    } else if (addToSelection) {
      setSelectedInstances(prev => new Set([...prev, instanceId]));
    } else {
      setSelectedInstances(new Set([instanceId]));
    }
  };

  const handleExecute = async () => {
    if (disabled) return;
    await quantum.executeCircuit();
  };

  const handleGateEdit = (instanceId: string) => {
    // For now, just select the gate - angle editing could be added later
    setSelectedInstances(new Set([instanceId]));
  };

  // Delete selected gates
  const handleDeleteSelected = () => {
    selectedInstances.forEach(id => {
      quantum.removeGate(id);
    });
    setSelectedInstances(new Set());
  };

  return (
    <div className={`quantum-panel ${disabled ? 'quantum-panel--disabled' : ''}`}>
      {/* Header */}
      <div
        className="quantum-panel__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="quantum-panel__title">
          <span className="quantum-panel__icon">{isExpanded ? '▼' : '▶'}</span>
          Quantum Circuit Builder
        </h3>
        <p className="quantum-panel__subtitle">
          Build a circuit to earn bonus guesses
        </p>
      </div>

      {isExpanded && (
        <div className="quantum-panel__content">
          {/* Description */}
          <div className="quantum-panel__description">
            <p>
              Measure the circuit to collapse the quantum state. The most probable
              outcome determines which game receives a <strong>+1 bonus guess</strong>.
            </p>
          </div>

          {/* Gate Palette */}
          <div className="quantum-panel__gates">
            <GatePalette
              onGateSelect={setSelectedGate}
              selectedGate={selectedGate}
            />
          </div>

          {/* Circuit Canvas */}
          <div className="quantum-panel__circuit">
            <CircuitCanvas
              circuit={quantum.circuit}
              numColumns={quantum.numColumns}
              selectedGate={selectedGate}
              selectedPattern={null}
              selectedInstances={selectedInstances}
              onGateAdd={handleGateAdd}
              onGateMove={quantum.moveGate}
              onGateSelect={handleGateSelect}
              onMultiSelect={(ids) => setSelectedInstances(new Set(ids))}
              onGateRemove={quantum.removeGate}
              onGateEdit={handleGateEdit}
            />
          </div>

          {/* Controls */}
          <div className="quantum-panel__controls">
            <button
              className="btn btn--primary quantum-panel__execute-btn"
              onClick={handleExecute}
              disabled={disabled || quantum.isExecuting || quantum.circuit.gates.length === 0}
            >
              {quantum.isExecuting ? (
                <>
                  <span className="quantum-panel__spinner" />
                  Measuring...
                </>
              ) : (
                'Measure Circuit'
              )}
            </button>

            <div className="quantum-panel__control-group">
              <button
                className="btn btn--secondary"
                onClick={quantum.resetCircuit}
                disabled={disabled || quantum.circuit.gates.length === 0}
              >
                Clear
              </button>
              <button
                className="btn btn--secondary"
                onClick={quantum.undo}
                disabled={disabled || !quantum.canUndo}
              >
                Undo
              </button>
              <button
                className="btn btn--secondary"
                onClick={quantum.redo}
                disabled={disabled || !quantum.canRedo}
              >
                Redo
              </button>
              {selectedInstances.size > 0 && (
                <button
                  className="btn btn--danger"
                  onClick={handleDeleteSelected}
                  disabled={disabled}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {quantum.error && (
            <div className="quantum-panel__error">
              Error: {quantum.error}
            </div>
          )}

          {/* Results */}
          <div className="quantum-panel__results">
            <ResultsPanel
              results={quantum.results}
              numQubits={numQubits}
              isExecuting={quantum.isExecuting}
            />

            {/* Bonus indicator */}
            {quantum.lastBonusGameIndex !== null && quantum.lastExecutionResult && (
              <div className="quantum-panel__bonus">
                <div className="quantum-panel__bonus-badge">+1</div>
                <div className="quantum-panel__bonus-text">
                  <strong>Bonus granted!</strong>
                  <span>
                    Game {quantum.lastBonusGameIndex} (|{gameLabels[quantum.lastBonusGameIndex]}⟩)
                    received +1 guess
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick tips */}
          <div className="quantum-panel__tips">
            <h4>Quick Tips:</h4>
            <ul>
              <li><strong>H gate</strong> on all qubits = equal chance for all games</li>
              <li><strong>X gate</strong> = flip qubit to target specific games</li>
              <li><strong>CNOT</strong> = entangle qubits for correlated outcomes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

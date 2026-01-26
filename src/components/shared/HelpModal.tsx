/**
 * HelpModal - Game instructions modal
 */

import { Modal } from './Modal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="space-y-4 text-sm">
        {/* Basic Rules */}
        <section>
          <h3 className="font-bold text-quantum-primary mb-2">Basic Rules</h3>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            <li>Play multiple Wordle games simultaneously (2, 4, 8, 16, or 32)</li>
            <li>Each guess you make applies to ALL active games</li>
            <li>Guess the 5-letter words within the allowed number of guesses</li>
          </ul>
        </section>

        {/* Tile Colors */}
        <section>
          <h3 className="font-bold text-quantum-primary mb-2">Tile Colors</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: '#6aaa64' }}
              >
                A
              </div>
              <span className="text-text-muted">
                Correct - letter is in the word and in the right spot
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: '#c9b458' }}
              >
                B
              </div>
              <span className="text-text-muted">
                Present - letter is in the word but in the wrong spot
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: '#787c7e' }}
              >
                C
              </div>
              <span className="text-text-muted">
                Absent - letter is not in the word
              </span>
            </div>
          </div>
        </section>

        {/* Quantum Charges */}
        <section>
          <h3 className="font-bold text-quantum-primary mb-2">Quantum Charges</h3>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            <li>
              Earn charges by getting correct letters (green tiles)
            </li>
            <li>
              <span className="text-quantum-accent font-bold">4 correct letters = 1 quantum charge</span>
            </li>
            <li>Correct letters count across ALL games</li>
          </ul>
        </section>

        {/* Using Quantum Bonuses */}
        <section>
          <h3 className="font-bold text-quantum-primary mb-2">Using Quantum Bonuses</h3>
          <ol className="list-decimal list-inside space-y-1 text-text-muted">
            <li>Build a quantum circuit using the circuit builder</li>
            <li>Click "Measure" to spend 1 charge and run the circuit</li>
            <li>The circuit is measured with 1024 shots</li>
            <li>The most probable outcome determines which game gets +1 bonus guess</li>
          </ol>
        </section>

        {/* Quantum Gates */}
        <section>
          <h3 className="font-bold text-quantum-primary mb-2">Quantum Gates</h3>
          <div className="grid grid-cols-2 gap-2 text-text-muted text-xs">
            <div>
              <span className="font-mono bg-bg-secondary px-1">H</span> - Hadamard (superposition)
            </div>
            <div>
              <span className="font-mono bg-bg-secondary px-1">X</span> - Bit flip (NOT)
            </div>
            <div>
              <span className="font-mono bg-bg-secondary px-1">Y</span> - Y rotation
            </div>
            <div>
              <span className="font-mono bg-bg-secondary px-1">Z</span> - Phase flip
            </div>
            <div>
              <span className="font-mono bg-bg-secondary px-1">CNOT</span> - Controlled NOT (entangle)
            </div>
            <div>
              <span className="font-mono bg-bg-secondary px-1">SWAP</span> - Swap qubits
            </div>
          </div>
        </section>

        {/* Strategy Tips */}
        <section>
          <h3 className="font-bold text-quantum-primary mb-2">Strategy Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            <li>Use Hadamard gates on all qubits for equal distribution</li>
            <li>Use X gates to deterministically target a specific game</li>
            <li>Create Bell states to limit outcomes to specific game pairs</li>
            <li>Save charges for games running low on guesses</li>
          </ul>
        </section>
      </div>

      <div className="mt-6 text-center">
        <button onClick={onClose} className="btn btn--primary">
          Got it!
        </button>
      </div>
    </Modal>
  );
}

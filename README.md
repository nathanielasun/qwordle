# QWordle

A quantum-enhanced Wordle game where players simultaneously play 2^n Wordle games (n = 1-5) and use quantum circuit construction to earn bonus guesses through quantum measurement.

## Game Concept

### Core Mechanics
- **Multiple Simultaneous Games**: Play 2, 4, 8, 16, or 32 Wordle games at once
- **Shared Guesses**: Each guess you make applies to ALL active games
- **Dynamic Guess Limits**: Each game has 5 + ⌈n/2⌉ base guesses (e.g., n=2 gives 6 guesses per game)
- **Quantum Bonus System**: Build quantum circuits and measure them to earn bonus guesses

### Quantum Integration
The quantum aspect comes from how bonus guesses are distributed:

1. **Build a Circuit**: Construct a quantum circuit with n qubits
2. **Measure**: Run the circuit with 1024 shots
3. **Collapse**: The most probable measurement outcome determines which game receives +1 bonus guess
4. **Entanglement Metaphor**: Games correspond to quantum states (|00⟩, |01⟩, |10⟩, |11⟩ for n=2)

This creates a strategic element where players can use quantum concepts (superposition, entanglement) to influence which games get extra chances.

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Quantum Simulation**: [qcjs](../qcjs) (local package)
- **Circuit UI**: [web_qc_builder](../web_qc_builder) (local package)

## Project Structure

```
qwordle/
├── public/
│   └── words.json              # Valid 5-letter word dictionary
├── src/
│   ├── components/
│   │   ├── App.tsx             # Root application component
│   │   ├── GameSetup.tsx       # Game configuration screen
│   │   ├── WordleGrid/         # Wordle display components
│   │   │   ├── WordleGrid.tsx
│   │   │   ├── WordleRow.tsx
│   │   │   └── WordleTile.tsx
│   │   ├── MultiGameView/      # Multi-game display
│   │   │   ├── MultiGameView.tsx
│   │   │   └── GameCard.tsx
│   │   ├── QuantumPanel/       # Quantum circuit interface
│   │   │   └── QuantumPanel.tsx
│   │   ├── Keyboard/           # Virtual keyboard
│   │   │   └── Keyboard.tsx
│   │   └── shared/             # Reusable UI components
│   │       ├── Modal.tsx
│   │       ├── Button.tsx
│   │       └── HelpModal.tsx
│   ├── hooks/
│   │   ├── useWordle.ts        # Single game logic
│   │   ├── useMultiWordle.ts   # Multi-game orchestration
│   │   └── useKeyboard.ts      # Keyboard event handling
│   ├── store/
│   │   └── gameStore.ts        # Zustand game state store
│   ├── quantum/
│   │   └── useQWordleQuantum.ts  # qcjs + web_qc_builder integration
│   ├── utils/
│   │   ├── wordValidation.ts   # Word dictionary operations
│   │   ├── colorLogic.ts       # Tile evaluation algorithm
│   │   └── keyboardState.ts    # Keyboard coloring logic
│   ├── types/
│   │   ├── game.ts             # Game type definitions
│   │   └── index.ts            # Type exports
│   ├── constants/
│   │   └── config.ts           # Game configuration
│   ├── styles/
│   │   ├── index.css           # Global styles
│   │   └── quantum-panel.css   # Quantum UI overrides
│   └── main.tsx                # Application entry point
├── plans/                      # Implementation plans
│   ├── 01-architecture-overview.md
│   ├── 02-wordle-core-mechanics.md
│   ├── 03-quantum-circuit-system.md
│   ├── 04-ui-ux-components.md
│   └── 05-implementation-phases.md
├── words.csv                   # Source word list
├── generate_words.py           # Word list generator
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Dependencies

### External Packages
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tensorflow/tfjs": "^4.17.0",
    "lucide-react": "^0.263.1",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Local Package Dependencies
- **qcjs** (`../qcjs`): Quantum circuit simulation engine with GPU acceleration
- **web_qc_builder** (`../web_qc_builder`): React components for visual circuit building

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd shenglong-qc/qwordle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

> Note: The word list (`public/words.json`) is already included with 2311 five-letter words.

## How to Play

### Setup
1. Choose the number of qubits (n = 1-5)
2. This determines:
   - **Number of games**: 2^n (2 to 32 games)
   - **Guesses per game**: 5 + ⌈n/2⌉ (6 to 8 base guesses)
3. Click "Start Game"

### Playing
1. Type a 5-letter word
2. Press Enter to submit
3. The guess is evaluated for ALL active games:
   - 🟩 **Green**: Letter is in the correct position
   - 🟨 **Yellow**: Letter is in the word but wrong position
   - ⬛ **Gray**: Letter is not in the word
4. Continue guessing until you win or run out of guesses for each game

### Quantum Bonuses
1. Open the Quantum Panel
2. Build a circuit using available gates:
   - **H** (Hadamard): Creates superposition
   - **X** (Pauli-X): Bit flip
   - **CNOT**: Entangles qubits
   - And more...
3. Click "Measure" to run 1024 shots
4. The game corresponding to the most probable outcome receives +1 bonus guess

### Strategy Tips
- Use Hadamard gates on all qubits for equal distribution
- Use X gates to deterministically target a specific game
- Create entangled states (Bell states) to limit outcomes to specific games
- Balance your circuit strategy based on which games need extra help

## Game Rules Reference

| Parameter | Formula | Example (n=2) |
|-----------|---------|---------------|
| Number of Games | 2^n | 4 games |
| Base Guesses | 5 + ⌈n/2⌉ | 6 guesses |
| Measurement Shots | 1024 | 1024 |
| Bonus per Measurement | +1 guess | +1 guess |

## Development

### Available Scripts
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run test      # Run tests
```

### Build Configuration
The project uses Vite with path aliases configured for local package imports:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@qcjs': path.resolve(__dirname, '../qcjs'),
    '@qc-builder': path.resolve(__dirname, '../web_qc_builder/src'),
  }
}
```

## Implementation Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Complete | Project setup, Vite, Tailwind, word list |
| Phase 1 | ✅ Complete | Single-game Wordle mechanics |
| Phase 2 | ✅ Complete | Multi-game system (2^n games) |
| Phase 3 | ✅ Complete | Quantum circuit integration |
| Phase 4 | 🔜 Pending | Polish & UX |
| Phase 5 | 🔜 Pending | Testing & Optimization |
| Phase 6 | 🔜 Pending | Deployment |

### Phase 3 Features (Current)
- Full quantum circuit builder integration using web_qc_builder components
- Interactive gate palette with standard quantum gates (H, X, Y, Z, CNOT, etc.)
- Visual circuit canvas for building and editing circuits
- Circuit execution via qcjs quantum simulator
- 1024-shot measurement with probability distribution display
- Bonus guess system: most probable measurement outcome grants +1 guess to corresponding game
- Real-time results panel showing measurement histogram
- Undo/redo support for circuit editing
- Quick tips section explaining quantum gate effects

### Phase 2 Features
- Play 2^n simultaneous Wordle games (2, 4, 8, 16, or 32)
- Responsive grid layout adapts to game count
- Shared input field - each guess applies to ALL active games
- Individual game status tracking (playing/won/lost)
- Compact GameCard display with quantum state labels (|00⟩, |01⟩, etc.)
- Global keyboard with aggregated letter states
- Game completion summary with win/loss statistics
- Binary labels mapping games to quantum states

### Phase 1 Features
- Full single-game Wordle functionality
- 5-letter word validation (2311 words dictionary)
- Color evaluation with proper duplicate letter handling
- Virtual keyboard with state colors
- Physical keyboard support
- Win/loss detection
- Tile flip animations
- Error handling for invalid words

## Implementation Plans

Detailed implementation plans are available in the `/plans` directory:

1. **[Architecture Overview](plans/01-architecture-overview.md)** - System design and data flow
2. **[Wordle Core Mechanics](plans/02-wordle-core-mechanics.md)** - Word validation and tile evaluation
3. **[Quantum Circuit System](plans/03-quantum-circuit-system.md)** - qcjs and web_qc_builder integration
4. **[UI/UX Components](plans/04-ui-ux-components.md)** - Visual design and component specs
5. **[Implementation Phases](plans/05-implementation-phases.md)** - Development roadmap

## Acknowledgments

- Wordle by Josh Wardle / New York Times
- Quantum simulation powered by [qcjs](../qcjs) and TensorFlow.js
- Circuit UI components from [web_qc_builder](../web_qc_builder)

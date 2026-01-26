# QWordle

A quantum-enhanced Wordle game where players simultaneously play 2^n Wordle games (n = 1-5) and use quantum circuit construction to earn bonus guesses through quantum measurement.

**[Play QWordle](https://nathanielasun.github.io/qwordle/)**

## Game Concept

### Core Mechanics
- **Multiple Simultaneous Games**: Play 2, 4, 8, 16, or 32 Wordle games at once
- **Shared Guesses**: Each guess you make applies to ALL active games
- **Dynamic Guess Limits**: Each game has 5 + ⌈n/2⌉ base guesses (e.g., n=2 gives 6 guesses per game)
- **Quantum Bonus System**: Build quantum circuits and measure them to earn bonus guesses

### Quantum Integration
The quantum aspect comes from how bonus guesses are distributed:

1. **Earn Charges**: Get correct letters (green tiles) to earn quantum charges (4 letters = 1 charge)
2. **Build a Circuit**: Construct a quantum circuit with n qubits using the circuit builder
3. **Measure**: Spend a charge to run the circuit with 1024 shots
4. **Collapse**: The most probable measurement outcome determines which game receives +1 bonus guess
5. **Entanglement Metaphor**: Games correspond to quantum states (|00⟩, |01⟩, |10⟩, |11⟩ for n=2)

This creates a strategic element where players can use quantum concepts (superposition, entanglement) to influence which games get extra chances, but must first earn the ability to use them through gameplay.

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
│   │       ├── Modal.tsx           # Reusable modal component
│   │       ├── HelpModal.tsx       # Game instructions
│   │       ├── GameOverModal.tsx   # End-game statistics
│   │       └── Toast.tsx           # Notification toast
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
│   │   ├── keyboardState.ts    # Keyboard coloring logic
│   │   ├── localStorage.ts     # Lifetime stats persistence
│   │   └── webglSupport.ts     # WebGL detection for TensorFlow.js
│   ├── test/
│   │   └── setup.ts            # Vitest test setup and mocks
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
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI workflow (lint, test, build)
│       └── deploy.yml          # GitHub Pages deployment
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts            # Vitest test configuration
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
    "@testing-library/jest-dom": "^6.9.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/react": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "jsdom": "^27.4.0",
    "rollup-plugin-visualizer": "^6.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.1.0",
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

### Quantum Charges
Players must **earn** quantum charges by getting correct letters (green tiles):
- Every **4 correct letters** (across all games) = **1 quantum charge**
- Charges accumulate as you play and can be used at any time
- The quantum panel is locked until you have at least 1 charge

### Using Quantum Bonuses
1. Earn quantum charges by guessing correct letters
2. Once unlocked, build a circuit using available gates:
   - **H** (Hadamard): Creates superposition
   - **X** (Pauli-X): Bit flip
   - **CNOT**: Entangles qubits
   - And more...
3. Click "Measure" to spend 1 charge and run 1024 shots
4. The game corresponding to the most probable outcome receives +1 bonus guess

### Strategy Tips
- Use Hadamard gates on all qubits for equal distribution
- Use X gates to deterministically target a specific game
- Create entangled states (Bell states) to limit outcomes to specific games
- Save your quantum charges for games that are running low on guesses
- Balance your circuit strategy based on which games need extra help

## Game Rules Reference

| Parameter | Formula | Example (n=2) |
|-----------|---------|---------------|
| Number of Games | 2^n | 4 games |
| Base Guesses | 5 + ⌈n/2⌉ | 6 guesses |
| Correct Letters per Charge | 4 | 4 letters |
| Measurement Shots | 1024 | 1024 |
| Bonus per Measurement | +1 guess | +1 guess |

## Development

### Available Scripts
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run build:analyze # Build with bundle analysis (outputs bundle-stats.html)
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report
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

## Deployment

### Live Site
The game is deployed at: **https://nathanielasun.github.io/qwordle/**

### GitHub Pages Setup
The project uses GitHub Actions for automatic deployment:

1. **CI Workflow** (`.github/workflows/ci.yml`):
   - Runs on all PRs and pushes to main
   - Executes linter, tests, and build

2. **Deploy Workflow** (`.github/workflows/deploy.yml`):
   - Triggers on push to main
   - Builds the project and deploys to GitHub Pages

### Manual Deployment
To deploy manually:

1. **Build for production**:
   ```bash
   NODE_ENV=production npm run build
   ```

2. **Preview locally**:
   ```bash
   npm run preview
   ```

3. The `dist/` folder contains the production build ready for deployment.

### Enabling GitHub Pages
To enable GitHub Pages for your fork:
1. Go to your repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions"
3. Push to main branch to trigger deployment

## Implementation Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Complete | Project setup, Vite, Tailwind, word list |
| Phase 1 | ✅ Complete | Single-game Wordle mechanics |
| Phase 2 | ✅ Complete | Multi-game system (2^n games) |
| Phase 3 | ✅ Complete | Quantum circuit integration |
| Phase 4 | ✅ Complete | Polish & UX |
| Phase 5 | ✅ Complete | Testing & Optimization |
| Phase 6 | ✅ Complete | Deployment |

### Phase 6 Features (Current)
- **GitHub Pages Deployment**: Automatic deployment on push to main
- **CI/CD Pipeline**: GitHub Actions workflow for testing and deployment
  - Runs linter, tests, and build on all PRs
  - Auto-deploys to GitHub Pages on merge to main
- **Production Build Optimization**: Configured base path for GitHub Pages hosting

### Phase 5 Features
- **Testing Infrastructure**: Vitest with React Testing Library and jsdom
- **Unit Test Coverage**: 82 tests covering:
  - Word validation utilities
  - Guess evaluation (color logic) with duplicate letter handling
  - Game state transitions (Zustand store)
  - LocalStorage persistence
- **Performance Optimization**:
  - React.memo on WordleTile and Keyboard components
  - useCallback for keyboard event handlers
- **Bundle Analysis**: rollup-plugin-visualizer for build size monitoring
- **WebGL Support Detection**: Browser compatibility checking for TensorFlow.js GPU acceleration

### Phase 4 Features
- **Animations**: Tile flip reveal animation, win celebration bounce, pop animation for new letters
- **Help Modal**: Comprehensive instructions accessible from header
- **Game Over Modal**: Detailed end-game summary with session and lifetime statistics
- **LocalStorage Persistence**: Lifetime stats tracked across sessions (win rate, perfect games, streaks)
- **Accessibility**: ARIA labels for tiles, keyboard keys, and game cards
- **Toast Notifications**: Visual feedback for errors, quantum charge earned, and bonus guesses granted
- **Responsive modals**: ESC key to close, click outside to dismiss

### Phase 3 Features
- Full quantum circuit builder integration using web_qc_builder components
- Interactive gate palette with standard quantum gates (H, X, Y, Z, CNOT, etc.)
- Visual circuit canvas for building and editing circuits
- Circuit execution via qcjs quantum simulator
- 1024-shot measurement with probability distribution display
- Bonus guess system: most probable measurement outcome grants +1 guess to corresponding game
- **Quantum charge system**: Players must earn charges by getting correct letters
  - 4 correct letters (green tiles) = 1 quantum charge
  - Quantum panel locked until charges are available
  - Progress bar shows advancement toward next charge
- Real-time results panel showing measurement histogram
- Undo/redo support for circuit editing
- Quick tips section explaining quantum gate effects
- Quantum panel positioned below game grid for better UX flow

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

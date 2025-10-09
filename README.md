# HVAC Drawing Tool

A professional CAD-style drawing application for HVAC duct design with intelligent snap-to-line functionality and real-time measurement summaries.

![HVAC Drawing Tool](https://img.shields.io/badge/status-production%20ready-brightgreen)
![CI/CD](https://github.com/engryamato/hvac-canvas/workflows/CI/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Tests](https://img.shields.io/badge/tests-188%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)
![E2E](https://img.shields.io/badge/E2E-29%2F30-yellow)
![Bundle Size](https://img.shields.io/badge/bundle-161%20KB-success)
![Build Time](https://img.shields.io/badge/build-632ms-success)

---

## ✨ Features

### 🎨 Drawing
- **Click-Click Drawing** - CAD-style interaction (no dragging required)
- **Live Preview** - See your line before completing it
- **Snap-to-Line** - Automatically snap to endpoints, midpoints, and line segments
- **Visual Feedback** - Cyan dot shows snap points
- **Escape to Cancel** - Cancel drawing anytime

### 📏 Measurements
- **Automatic Scaling** - Default 1:1 (1 pixel = 1 inch)
- **20 Predefined Scales** - Architectural, Engineering, and Metric
- **Smart Formatting** - Imperial (16'-8") or Metric (5.2 m)
- **Real-Time Calculations** - Instant length updates

### 📊 Summary Table
- **Grouped by Width** - Automatic grouping
- **Count & Total Length** - See totals at a glance
- **Real-Time Updates** - Updates as you draw/delete
- **Professional Styling** - Clean, easy-to-read table

### 🎛️ Interface
- **Collapsible Sidebar** - 320px sidebar with toggle
- **Responsive Canvas** - Auto-adjusts to sidebar state
- **Width Adjustment** - Slider or keyboard shortcuts
- **Line Selection** - Click to select, delete with button or key

---

## 🚀 Quick Start

### Installation
```bash
# Clone or download the project
cd "Working Canvas"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5174/`

---

## 📖 How to Use

### Drawing Lines

1. **Enable Draw Mode**
   - Click the blue FAB button (bottom right)
   - Or press **D** key

2. **Draw a Line**
   - Click once to set the start point
   - Move your mouse (you'll see a dashed preview)
   - Click again to complete the line

3. **Cancel Drawing**
   - Press **Escape** key

### Adjusting Line Width

**Before Drawing:**
- Press **[** to decrease width
- Press **]** to increase width

**After Drawing:**
- Click a line to select it
- Use the slider or **[** / **]** keys

### Deleting Lines

1. Click a line to select it
2. Click the **Delete** button
3. Or press **Delete** or **Backspace** key

### Using the Sidebar

**View Summary:**
- See all lines grouped by width
- View count and total length for each size

**Collapse/Expand:**
- Click the thin vertical button between canvas and sidebar
- Sidebar slides in/out smoothly

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **D** | Toggle draw mode on/off |
| **Escape** | Cancel current drawing |
| **[** | Decrease line width |
| **]** | Increase line width |
| **Delete** | Delete selected line |
| **Backspace** | Delete selected line |

---

## 🎯 Snap-to-Line Feature

The tool automatically snaps to existing lines when drawing:

### Snap Points (in priority order)
1. **Endpoints** (20px threshold) - Highest priority
2. **Midpoints** (18px threshold) - Medium priority
3. **Any point on line** (15px threshold) - Base priority

### Visual Feedback
- **Cyan dot** appears at snap point **immediately** when entering draw mode
- Snap indicator visible **before** clicking (hover snap)
- Cursor automatically aligns to snap point
- Line connects precisely to snap location

### How It Works
1. Press **D** to enter drawing mode
2. **Hover** near existing lines - cyan snap indicator appears automatically
3. Click to place starting point (snaps to nearest point)
4. Move to end position - snap indicator continues to guide you
5. Click to complete the line

---

## 📊 Summary Table

The sidebar shows a real-time summary of all lines:

| Column | Description |
|--------|-------------|
| **Count** | Number of lines with this width |
| **Size** | Width in inches (e.g., "8\"") |
| **Total Length** | Sum of all line lengths (e.g., "28'-6\"") |

**Features:**
- Automatically groups lines by width
- Sorts by width (smallest to largest)
- Updates in real-time as you draw/delete
- Shows "No lines drawn yet" when empty

---

## 📏 Scale System

### Default Scale
- **1:1** - 1 pixel = 1 inch

### Available Scales

**Architectural Scales:**
- 1/16" = 1'-0"
- 1/8" = 1'-0"
- 1/4" = 1'-0"
- 1/2" = 1'-0"
- 3/4" = 1'-0"
- 1" = 1'-0"

**Engineering Scales:**
- 1" = 10'
- 1" = 20'
- 1" = 30'
- 1" = 40'
- 1" = 50'
- 1" = 60'

**Metric Scales:**
- 1:1, 1:5, 1:10, 1:20, 1:50, 1:100, 1:200, 1:500

*Note: Scale selector UI coming in future update*

---

## 🧪 Testing

### Run Tests
```bash
# Run unit tests
npm run test:unit

# Run unit tests with coverage
npm run test:unit -- --coverage

# Run unit tests in watch mode
npm run test:unit -- --watch

# Install Playwright (first time only)
npx playwright install chromium

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e -- --ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e -- --headed
```

### Test Coverage
- ✅ **176 unit tests** passing (100% pass rate)
- ✅ **~80% code coverage** across all layers
- ✅ **29/30 E2E tests** passing
- ✅ Utils: ~95% coverage (51 tests)
- ✅ Services: ~100% coverage (50 tests)
- ✅ Hooks: ~100% coverage (34 tests)
- ✅ Components: ~95% coverage (41 tests)

For detailed testing information, see [`docs/TESTING_STRATEGY.md`](docs/TESTING_STRATEGY.md)

---

## 🏗️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **TypeScript 5.1** - Type safety
- **Vite 5.0** - Build tool
- **Canvas API** - Drawing
- **Playwright** - Testing
- **Lucide React** - Icons

---

## 📁 Project Structure

```
hvac-canvas/
├── src/
│   ├── types/                    # TypeScript type definitions
│   │   ├── canvas.types.ts       # Canvas primitives (Pt, Line, ViewportTransform)
│   │   ├── drawing.types.ts      # Drawing state (DrawingPhase)
│   │   ├── scale.types.ts        # Measurement scales
│   │   ├── snap.types.ts         # Snap detection types
│   │   └── index.ts              # Barrel export
│   │
│   ├── constants/                # Configuration and static values
│   │   ├── canvas.constants.ts   # Canvas config (zoom, selection)
│   │   ├── scale.constants.ts    # Scale definitions
│   │   ├── snap.constants.ts     # Snap thresholds
│   │   ├── theme.constants.ts    # Theme tokens
│   │   └── index.ts              # Barrel export
│   │
│   ├── utils/                    # Pure utility functions
│   │   ├── geometry/             # Point and line calculations
│   │   ├── canvas/               # Coordinate transformations
│   │   ├── snap/                 # Snap detection logic
│   │   ├── scale/                # Scale conversions
│   │   ├── id.ts                 # Unique ID generation
│   │   ├── __tests__/            # 51 unit tests (~95% coverage)
│   │   └── index.ts              # Barrel export
│   │
│   ├── services/                 # Domain logic layer
│   │   ├── drawing/              # Line creation and management
│   │   ├── viewport/             # Viewport transformations
│   │   ├── __tests__/            # 50 unit tests (~100% coverage)
│   │   └── index.ts              # Barrel export
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useDrawingState.ts    # Drawing state machine
│   │   ├── useViewportTransform.ts # Viewport zoom/pan
│   │   ├── useCanvasSetup.ts     # Canvas initialization
│   │   ├── useKeyboardShortcuts.ts # Keyboard handling
│   │   ├── __tests__/            # 34 unit tests (~100% coverage)
│   │   └── index.ts              # Barrel export
│   │
│   ├── components/               # React UI components
│   │   └── DrawingCanvas/        # Main canvas feature
│   │       ├── WidthHUD.tsx      # Line width editor
│   │       ├── DrawButton.tsx    # Draw mode toggle
│   │       ├── Sidebar.tsx       # Line summary
│   │       ├── BottomBar.tsx     # Zoom controls
│   │       ├── CanvasRenderer.tsx # Canvas with events
│   │       ├── __tests__/        # 41 unit tests (~95% coverage)
│   │       └── index.ts          # Barrel export
│   │
│   ├── DrawingCanvas.tsx         # Main component (902 lines)
│   ├── App.tsx                   # Root component
│   └── styles.css                # Utility classes
│
├── tests/
│   └── e2e/
│       └── drawing-canvas.spec.ts # 30 E2E tests (29 passing)
│
├── docs/
│   ├── adrs/                     # Architecture Decision Records
│   │   ├── ADR-001-types-constants.md
│   │   ├── ADR-002-utilities.md
│   │   ├── ADR-003-services.md
│   │   ├── ADR-004-hooks.md
│   │   ├── ADR-005-components.md
│   │   └── ADR-006-optimization.md
│   ├── phases/                   # Phase summaries
│   ├── ARCHITECTURE.md           # System architecture
│   ├── TESTING_STRATEGY.md       # Testing approach
│   └── REFACTOR_SCORECARD.md     # Metrics tracking
│
├── vitest.config.ts              # Unit test configuration
├── playwright.config.ts          # E2E test configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

### Architecture Layers

The application follows a strict layered architecture:

```
Components (UI)
    ↓
Hooks (State Management)
    ↓
Services (Domain Logic)
    ↓
Utils (Pure Functions)
    ↓
Constants & Types (Foundation)
```

**Key Principles:**
- ✅ Clear separation of concerns
- ✅ Enforced dependency flow (top → bottom only)
- ✅ No circular dependencies
- ✅ Comprehensive test coverage at each layer

For detailed architecture information, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

## 🐛 Troubleshooting

### Sidebar not visible?
- Refresh the browser (F5 or Ctrl+R)
- Check that the toggle button is visible
- Click the toggle button to expand

### Lines not snapping?
- Make sure you're in draw mode (blue FAB button)
- Move cursor closer to existing lines
- Snap threshold: 20px for endpoints, 18px for midpoints

### Table not updating?
- Table updates automatically when lines are added/deleted
- If empty, it shows "No lines drawn yet"
- Try drawing a line to see the table appear

---

## 📝 Tips & Best Practices

1. **Use Snap-to-Line** - Let lines connect automatically for precision
2. **Adjust Width First** - Set width before drawing for efficiency
3. **Use Keyboard Shortcuts** - Faster than clicking buttons
4. **Collapse Sidebar** - More canvas space when needed
5. **Check Summary Table** - Verify totals before finalizing

---

## 🎯 Use Cases

- **HVAC Duct Design** - Plan ductwork layouts
- **Technical Drawings** - Create precise line drawings
- **Floor Plans** - Sketch room layouts
- **Diagrams** - Draw connected line diagrams
- **Measurements** - Calculate total lengths by size

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Support

For questions or issues, please contact the development team.

---

**Happy Drawing!** 🎨✨


# HVAC Canvas - Current Codebase Specifications

**Generated:** 2025-10-16  
**Version:** 2.0 (Post-Refactoring)  
**Purpose:** Complete specification for Task Master AI analysis

---

## 📋 Executive Summary

**HVAC Canvas** is a professional CAD-style drawing application for HVAC duct design, built with React 18 + TypeScript. The application has been fully refactored from a monolithic 1,228-line component into a modular, well-tested architecture.

### Key Metrics
- **Total Files:** 59 organized files
- **Architecture Layers:** 7 distinct layers
- **Test Coverage:** ~80% overall (176 unit tests + 29 E2E tests)
- **Bundle Size:** 161 KB JavaScript + 4.6 KB CSS
- **Build Time:** 676ms
- **Lines of Code:** ~8,000+ lines (excluding tests)

---

## 🏗️ Architecture Overview

### Layered Architecture (Strict Dependency Flow)

```
┌─────────────────────────────────────────┐
│  Layer 7: Components (UI)               │  ← React components
├─────────────────────────────────────────┤
│  Layer 6: Hooks (State Management)      │  ← Custom React hooks
├─────────────────────────────────────────┤
│  Layer 5: Services (Domain Logic)       │  ← Business rules
├─────────────────────────────────────────┤
│  Layer 4: Utils (Pure Functions)        │  ← Calculations
├─────────────────────────────────────────┤
│  Layer 3: Constants (Configuration)     │  ← Static values
├─────────────────────────────────────────┤
│  Layer 2: Types (TypeScript Definitions)│  ← Data structures
└─────────────────────────────────────────┘
```

**Dependency Rules:**
- ✅ Each layer can ONLY import from layers below it
- ❌ No circular dependencies allowed
- ❌ No upward dependencies (e.g., Utils cannot import Services)

---

## 🎯 Core Features

### 1. Drawing Capabilities
- **Click-Click CAD Drawing:** Two-click line creation (no drag required)
- **Live Preview:** Dashed preview line while drawing
- **Snap-to-Line:** Magnetic snapping to endpoints, midpoints, and segments
- **Visual Feedback:** Cyan dot indicator for snap targets
- **Line Selection:** Click to select, multi-select support
- **Line Editing:** Width adjustment via slider and keyboard shortcuts
- **Line Deletion:** Delete button + keyboard shortcuts (Delete/Backspace)

### 2. Measurement System
- **Default Scale:** 1:1 (1 pixel = 1 inch)
- **Predefined Scales:** 20 total scales
  - Architectural: 6 scales (1/16"=1'-0" to 1"=1'-0")
  - Engineering: 6 scales (1"=10' to 1"=60')
  - Metric: 8 scales (1:1 to 1:500)
- **Unit Conversion:** Automatic pixel-to-real-world conversion
- **Length Formatting:** Imperial (16'-8") and Metric (5.2 m)

### 3. PDF Background Support
- **PDF Upload:** Load PDF floor plans as background
- **PDF Rendering:** Uses PDF.js for rendering
- **Opacity Control:** Adjustable PDF opacity (default 50%)
- **Multi-Page:** Support for multi-page PDFs
- **Positioning:** Offset and scale controls

### 4. Viewport Controls
- **Zoom:** Mouse wheel zoom (1.2x factor, 0.1x to 10x range)
- **Pan:** Right-click drag to pan
- **Touch Support:** Pinch-to-zoom on touch devices
- **HiDPI Support:** Sharp rendering on retina displays
- **Responsive:** Auto-resize on window resize

### 5. UI Components
- **Collapsible Sidebar:** 320px width, line summary table
- **Line Summary Table:** Groups lines by width, shows count and total length
- **Draw Button:** FAB-style toggle for draw mode
- **Line Properties Modal:** Comprehensive duct property editor (in development)
- **Bottom Bar:** Zoom controls and scale display
- **Keyboard Shortcuts:** D (draw), Escape (cancel), [ ] (width), Delete

---

## 📁 Project Structure

```
hvac-canvas/
├── src/
│   ├── types/                    # TypeScript type definitions
│   │   ├── canvas.types.ts       # Pt, ViewportTransform
│   │   ├── drawing.types.ts      # Line, DrawingPhase, DuctType
│   │   ├── duct.types.ts         # Material, Gauge, DuctTypeConfig
│   │   ├── modal.types.ts        # ModalTab, ModalPosition
│   │   ├── scale.types.ts        # Scale, LineSummaryRow
│   │   ├── snap.types.ts         # SnapType, SnapTarget
│   │   └── pdf.types.ts          # PdfState
│   │
│   ├── constants/                # Configuration values
│   │   ├── canvas.constants.ts   # Zoom, selection, hit test
│   │   ├── duct.constants.ts     # DUCT_TYPES, MATERIALS, GAUGES
│   │   ├── modal.constants.ts    # Modal dimensions, animations
│   │   ├── calculations.constants.ts  # HVAC formulas
│   │   ├── scale.constants.ts    # Scale definitions
│   │   ├── snap.constants.ts     # Snap thresholds
│   │   ├── theme.constants.ts    # Theme tokens
│   │   └── design-tokens.ts      # Design system
│   │
│   ├── utils/                    # Pure utility functions
│   │   ├── geometry/             # Point/line calculations
│   │   │   ├── point.ts          # dist, midpoint
│   │   │   └── line.ts           # getLineLength, distancePointToSegment
│   │   ├── canvas/               # Canvas utilities
│   │   │   ├── coordinates.ts    # screenToCanvas, canvasToScreen
│   │   │   └── setup.ts          # setupHiDPICanvas
│   │   ├── snap/                 # Snap detection
│   │   │   └── snapDetection.ts  # findSnapTarget, resolveSnapPoint
│   │   ├── scale/                # Scale conversions
│   │   │   └── scaleConversion.ts # pixelsToInches, formatLength
│   │   ├── pdf/                  # PDF utilities
│   │   │   └── pdfLoader.ts      # loadPdfFile, renderPdfPage
│   │   └── id.ts                 # uid() - unique ID generation
│   │
│   ├── services/                 # Domain logic services
│   │   ├── drawing/              # Drawing operations
│   │   │   ├── DrawingService.ts # Line creation, validation
│   │   │   └── LineManager.ts    # Line CRUD operations
│   │   └── viewport/             # Viewport operations
│   │       └── ViewportService.ts # Zoom, pan, transformations
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useDrawingState.ts    # Drawing state machine
│   │   ├── useViewportTransform.ts # Viewport zoom/pan state
│   │   ├── useCanvasSetup.ts     # Canvas initialization
│   │   └── useKeyboardShortcuts.ts # Keyboard event handling
│   │
│   ├── components/               # React UI components
│   │   └── DrawingCanvas/
│   │       ├── CanvasRenderer.tsx    # Canvas element + events
│   │       ├── DrawButton.tsx        # Draw mode toggle FAB
│   │       ├── Sidebar.tsx           # Line summary sidebar
│   │       ├── BottomBar.tsx         # Zoom controls
│   │       ├── LinePropertiesModal.tsx # Duct property editor
│   │       └── __tests__/            # Component tests
│   │
│   ├── DrawingCanvas.tsx         # Main canvas component (root)
│   ├── App.tsx                   # Application root
│   ├── main.tsx                  # Entry point
│   └── styles.css                # Global styles
│
├── tests/                        # E2E tests
│   └── e2e/                      # Playwright tests
│       ├── drawing-canvas.spec.ts
│       ├── line-properties-modal.spec.ts
│       └── zoom-pan.spec.ts
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # System architecture
│   ├── PROJECT_SUMMARY.md        # Project overview
│   ├── LINE_PROPERTIES_MODAL.md  # Modal feature docs
│   ├── REFACTORING_SUMMARY.md    # Refactoring history
│   └── TASK_MASTER_AI_SETUP.md   # Task Master AI guide
│
├── .cursor/                      # Cursor IDE config
│   └── mcp.json                  # MCP server config
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite build config
├── vitest.config.ts              # Vitest test config
├── playwright.config.ts          # Playwright E2E config
└── .env                          # Environment variables
```

---

## 🔧 Technology Stack

### Core Technologies
- **React 18.2.0** - UI framework
- **TypeScript 5.1.6** - Type safety
- **Vite 4.5.0** - Build tool and dev server

### UI Libraries
- **Lucide React 0.277.0** - Icon library
- **PDF.js 5.4.296** - PDF rendering

### Testing
- **Vitest 3.2.4** - Unit testing framework
- **React Testing Library 16.3.0** - Component testing
- **Playwright 1.40.0** - E2E testing
- **JSDOM 27.0.0** - DOM simulation for tests

### Development Tools
- **Task Master AI 0.29.0** - AI-powered task management (newly installed)
- **Docker** - Containerization for deployment
- **ESLint** - Code linting (implicit via Vite)

---

## 📊 Test Coverage

### Unit Tests (176 total)
- **Utils Layer:** 51 tests (~95% coverage)
- **Services Layer:** 50 tests (~100% coverage)
- **Hooks Layer:** 34 tests (~100% coverage)
- **Components Layer:** 41 tests (~95% coverage)

### E2E Tests (29 total)
- Drawing interactions (click-click, snap, cancel)
- Line management (select, edit, delete)
- Sidebar functionality (collapse, table updates)
- Modal interactions (open, edit, close)
- Zoom/pan controls
- Keyboard shortcuts

### Test Commands
```bash
npm run test:unit          # Run unit tests
npm run test:unit:ui       # Unit tests with UI
npm run test:unit:coverage # Coverage report
npm run test:e2e           # Run E2E tests
npm run test:e2e:ui        # E2E tests with UI
npm run test:e2e:headed    # E2E tests in browser
```

---

## 🚀 Development Workflow

### Local Development
```bash
npm run dev                # Start dev server (http://localhost:5174)
npm run build              # Production build
npm run preview            # Preview production build
```

### Docker Development
```bash
npm run docker:dev         # Start dev container
npm run docker:dev:build   # Build dev image
npm run docker:dev:stop    # Stop dev container
npm run docker:prod        # Start production container
```

### Testing Workflow
1. Write unit tests for utils/services/hooks
2. Write component tests for UI components
3. Write E2E tests for user flows
4. Run tests locally before committing
5. CI runs all tests on push

---

## 🎨 Design System

### Color Tokens (Tech Blue Theme)
- **Primary:** Blue (#2563eb, #3b82f6, #60a5fa)
- **Neutral:** Gray (#171717, #404040, #737373, #a3a3a3, #d4d4d4, #e5e5e5, #f5f5f5)
- **Success:** Green (#16a34a)
- **Warning:** Amber (#f59e0b)
- **Error:** Red (#dc2626)

### Typography
- **Font Family:** System font stack (SF Pro, Segoe UI, Roboto)
- **Font Sizes:** 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl)

### Spacing
- **Base Unit:** 4px
- **Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

---

## 🔄 Current Development Status

### Completed Features ✅
- Core drawing functionality
- Snap-to-line system
- Measurement and scaling
- PDF background support
- Viewport controls (zoom/pan)
- Line summary table
- Collapsible sidebar
- Keyboard shortcuts
- Comprehensive test suite
- Docker deployment
- Refactored architecture

### In Progress 🚧
- **Line Properties Modal** (14/103 tasks, 13.6% complete)
  - Foundation layer complete (types, constants, utils)
  - Services layer in progress
  - Hooks and components pending

### Planned Enhancements 📋
- Multi-select batch operations
- HVAC calculations (velocity, friction, pressure)
- Export/import functionality
- Undo/redo system
- Layer management
- Custom scale setter
- Grid/snap-to-grid
- Dark mode theme

---

## 📝 Key Files to Understand

### Entry Points
1. **`src/main.tsx`** - Application entry point
2. **`src/App.tsx`** - Root component
3. **`src/DrawingCanvas.tsx`** - Main canvas component (1,200+ lines)

### Core Logic
4. **`src/hooks/useDrawingState.ts`** - Drawing state machine
5. **`src/services/drawing/DrawingService.ts`** - Line creation logic
6. **`src/utils/snap/snapDetection.ts`** - Snap algorithm

### Type Definitions
7. **`src/types/drawing.types.ts`** - Line and drawing types
8. **`src/types/duct.types.ts`** - HVAC-specific types

### Configuration
9. **`src/constants/duct.constants.ts`** - Duct properties database
10. **`vite.config.ts`** - Build configuration

---

## 🎯 Next Steps for Task Master AI

### Recommended First Tasks
1. **Analyze Architecture** - Review layered architecture and dependency flow
2. **Complete Line Properties Modal** - Finish the 89 remaining tasks
3. **Improve Test Coverage** - Add tests for edge cases
4. **Performance Optimization** - Profile and optimize rendering
5. **Documentation** - Add JSDoc comments to all public APIs

### Questions to Explore
- How can we improve the snap detection algorithm?
- What's the best way to implement undo/redo?
- Should we add a state management library (Redux/Zustand)?
- How can we optimize canvas rendering for large drawings?
- What's the best approach for export/import functionality?

---

**End of Specification Document**


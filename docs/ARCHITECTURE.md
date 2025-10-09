# HVAC Canvas - System Architecture

**Last Updated:** 2025-10-09  
**Version:** 2.0 (Post-Refactoring)

---

## Overview

The HVAC Canvas application is a CAD-style drawing tool for HVAC duct design. The application has been refactored from a monolithic 1,228-line component into a well-structured, modular architecture with clear separation of concerns across 7 layers.

### Key Characteristics

- **Modular:** 59 files organized into 7 architectural layers
- **Tested:** 176 unit tests with ~80% coverage
- **Type-Safe:** Full TypeScript strict mode compliance
- **Performant:** 161 KB bundle, 676ms build time
- **Maintainable:** Clear dependency flow, no circular dependencies

---

## Architectural Layers

The application follows a strict layered architecture with enforced dependency flow:

```
┌─────────────────────────────────────────┐
│          Components (UI Layer)          │  ← User Interface
├─────────────────────────────────────────┤
│        Hooks (State Management)         │  ← Stateful Logic
├─────────────────────────────────────────┤
│       Services (Domain Logic)           │  ← Business Rules
├─────────────────────────────────────────┤
│      Utils (Pure Functions)             │  ← Calculations
├─────────────────────────────────────────┤
│    Constants (Configuration)            │  ← Static Values
├─────────────────────────────────────────┤
│       Types (Type Definitions)          │  ← Data Structures
└─────────────────────────────────────────┘
```

### Dependency Flow Rules

**Allowed Dependencies (Top → Bottom):**
- Components → Hooks → Services → Utils → Constants/Types
- Each layer can only import from layers below it
- No circular dependencies allowed

**Forbidden Dependencies:**
- ❌ Utils cannot import from Services
- ❌ Services cannot import from Hooks
- ❌ Hooks cannot import from Components
- ❌ No layer can import from layers above it

---

## Layer Details

### 1. Types Layer (`src/types/`)

**Purpose:** Define all TypeScript interfaces and type aliases

**Files:**
- `canvas.types.ts` - Canvas primitives (Pt, Line, ViewportTransform)
- `drawing.types.ts` - Drawing state (DrawingPhase)
- `scale.types.ts` - Measurement scales (Scale, LineSummaryRow)
- `snap.types.ts` - Snap detection (SnapType, SnapTarget)

**Dependencies:** None (foundation layer)

**Key Types:**
```typescript
interface Pt { x: number; y: number; }
interface Line { id: string; start: Pt; end: Pt; width: number; color: string; }
type DrawingPhase = 'idle' | 'waiting-for-end' | 'selected';
```

### 2. Constants Layer (`src/constants/`)

**Purpose:** Define all configuration values and static data

**Files:**
- `canvas.constants.ts` - Canvas config (zoom, selection, hit test)
- `scale.constants.ts` - Scale definitions (architectural, engineering, metric)
- `snap.constants.ts` - Snap thresholds and indicators
- `theme.constants.ts` - Theme tokens (TechBlueTokens)

**Dependencies:** Types

**Key Constants:**
```typescript
ZOOM_FACTOR = 1.2
MIN_LINE_LENGTH = 5
SNAP_THRESHOLD_ENDPOINT = 15
ARCHITECTURAL_SCALES = [...]
```

### 3. Utils Layer (`src/utils/`)

**Purpose:** Pure functions for calculations and transformations

**Modules:**
- `geometry/` - Point and line calculations (dist, distancePointToSegment)
- `canvas/` - Coordinate transformations (screenToCanvas, setupHiDPICanvas)
- `snap/` - Snap detection (findSnapTarget)
- `scale/` - Scale conversions (pixelsToInches, formatLength)
- `id.ts` - Unique ID generation (uid)

**Dependencies:** Types, Constants

**Test Coverage:** ~95% (51 tests)

**Characteristics:**
- Pure functions (no side effects)
- Immutable (don't mutate inputs)
- Stateless (no external dependencies)

### 4. Services Layer (`src/services/`)

**Purpose:** Encapsulate domain logic and orchestrate utilities

**Modules:**
- `drawing/` - Line creation and management (DrawingService, LineManager)
- `viewport/` - Viewport transformations (ViewportService)

**Dependencies:** Utils, Types, Constants

**Test Coverage:** ~100% (50 tests)

**Characteristics:**
- Stateless (no React hooks)
- Immutable operations (return new data)
- Clear interfaces (well-defined contracts)
- Utility composition (combine utilities for complex operations)

### 5. Hooks Layer (`src/hooks/`)

**Purpose:** Manage stateful logic and side effects

**Modules:**
- `useDrawingState.ts` - Drawing interaction state machine
- `useViewportTransform.ts` - Viewport zoom and pan state
- `useCanvasSetup.ts` - Canvas initialization and resize
- `useKeyboardShortcuts.ts` - Keyboard event handling

**Dependencies:** Services, Utils, Types, Constants

**Test Coverage:** ~100% (34 tests)

**Characteristics:**
- Stateful (use React hooks)
- Composable (can be combined in components)
- Service integration (use services for domain logic)
- Proper dependencies (useCallback, useMemo)

### 6. Components Layer (`src/components/`)

**Purpose:** Render UI and handle user interactions

**Modules:**
- `DrawingCanvas/` - Main canvas and UI components
  - `WidthHUD.tsx` - Line width editor
  - `DrawButton.tsx` - Draw mode toggle
  - `Sidebar.tsx` - Line summary
  - `BottomBar.tsx` - Zoom controls
  - `CanvasRenderer.tsx` - Canvas with event handlers

**Dependencies:** Hooks, Services, Utils, Types, Constants

**Test Coverage:** ~95% (41 tests)

**Characteristics:**
- Props-based (receive data via props)
- Composable (combine to create UI)
- Type-safe (strongly typed props)
- Accessible (ARIA labels and roles)

---

## Data Flow

### User Interaction Flow

```
User Action (click, keyboard)
    ↓
Component (event handler)
    ↓
Hook (state update)
    ↓
Service (domain logic)
    ↓
Utils (calculations)
    ↓
New State
    ↓
Component Re-render
    ↓
UI Update
```

### Example: Drawing a Line

1. **User clicks canvas** → Component receives pointer event
2. **Component calls hook** → `startDrawing(point)`
3. **Hook updates state** → `phase = 'waiting-for-end'`, `startPt = point`
4. **Component re-renders** → Shows preview line
5. **User clicks again** → Component receives second pointer event
6. **Component calls hook** → `finishDrawing()`
7. **Hook calls service** → `createLine(startPt, endPt, width)`
8. **Service validates** → Checks minimum length
9. **Service uses utils** → `dist(startPt, endPt)` for length
10. **Service creates line** → Returns new Line object
11. **Hook updates state** → Adds line to collection
12. **Component re-renders** → Shows completed line

---

## State Management

### State Organization

**Component State (useState):**
- UI-specific state (sidebar collapsed, HUD position)
- Temporary state (mouse position, hover state)

**Custom Hook State:**
- Drawing state (phase, startPt, selectedLineId)
- Viewport state (scale, offset)
- Line collection (lines array)

**No Global State:**
- All state is local to components/hooks
- Props passed down for data sharing
- No Redux or other global state management

### State Flow

```
DrawingCanvas (root component)
  ├─ useDrawingState() → drawing state
  ├─ useViewportTransform() → viewport state
  ├─ useState() → lines, sidebar, HUD
  │
  └─ Props ↓
      ├─ CanvasRenderer (canvas + events)
      ├─ WidthHUD (line editor)
      ├─ DrawButton (draw toggle)
      ├─ Sidebar (line summary)
      └─ BottomBar (zoom controls)
```

---

## Performance Considerations

### Bundle Size

- **JavaScript:** 161.02 KB (within 176 KB budget)
- **CSS:** 4.59 KB (within 10 KB budget)
- **Gzipped Total:** ~52.13 KB (within 60 KB budget)

### Build Time

- **Development:** ~676ms (within 773ms budget)
- **Production:** ~676ms (optimized)

### Runtime Performance

- **60 FPS target** for all interactions
- **HiDPI canvas** for sharp rendering
- **Efficient re-renders** via useCallback/useMemo
- **Immutable updates** prevent unnecessary renders

### Optimization Strategies

1. **Code Splitting:** Not needed (small bundle)
2. **Memoization:** useCallback for event handlers, useMemo for expensive calculations
3. **Virtual DOM:** React's reconciliation handles efficiently
4. **Canvas Rendering:** Direct canvas API (no intermediate layers)

---

## Testing Strategy

### Test Pyramid

```
        /\
       /E2\      E2E Tests (29/30)
      /____\     - Full user flows
     /      \    - Playwright
    / Unit  \   Unit Tests (176)
   /  Tests  \  - Utils, Services, Hooks, Components
  /___________\ - Vitest + React Testing Library
```

### Coverage Targets

- **Utils:** ≥80% (achieved ~95%)
- **Services:** ≥80% (achieved ~100%)
- **Hooks:** ≥70% (achieved ~100%)
- **Components:** ≥70% (achieved ~95%)
- **Overall:** ≥80% (achieved ~80%)

### Test Organization

```
src/
├── utils/__tests__/
├── services/__tests__/
├── hooks/__tests__/
└── components/DrawingCanvas/__tests__/

tests/
└── e2e/ (Playwright tests)
```

---

## Technology Stack

### Core

- **React 18.2** - UI framework
- **TypeScript 5.1** - Type safety
- **Vite 4.5** - Build tool

### Testing

- **Vitest 3.2.4** - Unit testing
- **React Testing Library** - Component/hook testing
- **Playwright** - E2E testing

### Styling

- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library

---

## Future Enhancements

### Potential Improvements

1. **Architecture Tests** - Automated dependency flow validation
2. **Visual Regression Testing** - Chromatic or Percy integration
3. **Performance Monitoring** - Lighthouse CI
4. **Code Coverage Badges** - Display coverage in README
5. **Storybook** - Component documentation and development

### Scalability Considerations

- **More Components:** Easy to add following established patterns
- **More Features:** Service layer provides clean extension points
- **More Tests:** Test infrastructure supports growth
- **More Developers:** Clear architecture enables team collaboration

---

## Related Documentation

- **ADRs:** `docs/adrs/` - Architectural decisions
- **Phase Summaries:** `docs/phases/` - Refactoring progress
- **Testing Strategy:** `docs/TESTING_STRATEGY.md` - Testing approach
- **Refactor Scorecard:** `docs/REFACTOR_SCORECARD.md` - Metrics tracking
- **Directory READMEs:** `src/*/README.md` - Layer-specific documentation


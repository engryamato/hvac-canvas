# HVAC Canvas - Complete Architectural Inventory

**Generated:** 2025-10-19  
**Version:** 2.0 (Post-Refactoring)  
**Purpose:** Comprehensive reference for all components, dependencies, and architectural patterns

---

## A. Application Structure Overview

### Entry Points
- **`src/main.tsx`** - React root initialization with CSS imports
- **`src/App.tsx`** - Root component wrapper
- **`src/DrawingCanvas.tsx`** - Main application component (1,200+ lines)

### Routing Structure
- **Single-page application** - No routing framework (Vite + React)
- **Full-screen canvas** - 100vw × 100vh responsive layout
- **No multi-page navigation** - All features on single canvas

### Core Feature Areas
1. **Drawing System** - Click-click line drawing with snap detection
2. **Viewport Management** - Zoom, pan, coordinate transformation
3. **Line Properties** - Modal-based HVAC duct property editor
4. **UI Controls** - Sidebar, bottom bar, floating action buttons
5. **PDF Support** - Background layer rendering with opacity control

---

## B. Component Hierarchy

### Root Component Tree
```
App
└── DrawingCanvas (main orchestrator)
    ├── CanvasRenderer (canvas element + events)
    │   ├── LinePropertiesModal (floating modal)
    │   │   ├── ModalHeader
    │   │   ├── TabBar (Properties | Calculations | Advanced)
    │   │   ├── PropertiesTab
    │   │   ├── CalculationsTab
    │   │   ├── AdvancedTab
    │   │   ├── MultiSelectHeader
    │   │   ├── MultiSelectWarning
    │   │   ├── ModalFooter
    │   │   └── Separator
    │   └── DrawButton (FAB for draw mode toggle)
    ├── Sidebar (collapsible line summary)
    └── BottomBar (zoom controls + scale selector)
```

### Shared Components
- **LinePropertiesModal** - Reusable modal for line editing (single/multi-select)
- **CanvasRenderer** - Canvas element with all event handlers
- **DrawButton** - Floating action button (draw mode toggle)
- **Sidebar** - Line summary with width grouping
- **BottomBar** - Zoom controls and scale selector

### Component Organization
```
src/components/
├── DrawingCanvas/
│   ├── CanvasRenderer.tsx (118 lines)
│   ├── DrawButton.tsx (85 lines)
│   ├── Sidebar.tsx (180 lines)
│   ├── BottomBar.tsx (250 lines)
│   ├── PdfControls.tsx (PDF upload/opacity)
│   ├── index.ts (barrel export)
│   └── __tests__/ (component tests)
└── LinePropertiesModal/
    ├── LinePropertiesModal.tsx (main component)
    ├── ModalHeader.tsx
    ├── TabBar.tsx
    ├── PropertiesTab.tsx
    ├── CalculationsTab.tsx
    ├── AdvancedTab.tsx
    ├── ModalFooter.tsx
    ├── MultiSelect/ (multi-select UI)
    ├── shared/ (Separator, etc.)
    └── __tests__/ (modal tests)
```

---

## C. UI Elements Catalog

### DrawButton Component
- **Type:** Floating Action Button (FAB)
- **Location:** `src/components/DrawingCanvas/DrawButton.tsx`
- **Props:** `isActive: boolean`, `onToggle: () => void`, `sidebarWidth: number`
- **State:** None (stateless)
- **Styling:** Neumorphic (raised/inset states)
- **Events:** Click to toggle draw mode
- **Keyboard:** D key shortcut
- **Usage:** Main canvas component

### Sidebar Component
- **Type:** Collapsible panel
- **Location:** `src/components/DrawingCanvas/Sidebar.tsx`
- **Props:** `collapsed: boolean`, `onToggle: () => void`, `lineSummary: LineSummaryRow[]`, `currentScale: Scale`, `width?: number`
- **State:** None (stateless)
- **Styling:** Neumorphic raised surfaces
- **Features:** Line grouping by width, total length display
- **Usage:** Main canvas component

### BottomBar Component
- **Type:** Fixed bottom control bar
- **Location:** `src/components/DrawingCanvas/BottomBar.tsx`
- **Props:** `zoom: number`, `canZoomIn/Out: boolean`, `onZoomIn/Out: () => void`, `currentScale: Scale`, `scaleOptions: Scale[]`, `onScaleChange: (scale: Scale) => void`, `onPdfUpload?: (file: File) => void`
- **State:** None (stateless)
- **Styling:** Neumorphic with shadow overlay
- **Features:** Zoom controls, scale selector, PDF upload
- **Usage:** Main canvas component

### CanvasRenderer Component
- **Type:** Canvas element wrapper
- **Location:** `src/components/DrawingCanvas/CanvasRenderer.tsx`
- **Props:** `canvasRef`, `containerRef`, `isDrawActive`, event handlers (onPointerDown/Move/Up, onWheel, onContextMenu, onTouchStart/Move/End), `sidebarWidth`
- **State:** None (stateless)
- **Features:** Dynamic cursor, responsive sizing, children support
- **Events:** Pointer, wheel, context menu, touch events
- **Usage:** Main canvas component

### LinePropertiesModal Component
- **Type:** Floating modal dialog
- **Location:** `src/components/LinePropertiesModal/LinePropertiesModal.tsx`
- **Props:** `selectedLines: Line[]`, `onUpdate`, `onBatchUpdate`, `onClose`, `onDuplicate`, `onDelete`, `onDeleteAll`, `viewportBounds`, `canvasBounds`, `isOpen`
- **State:** `activeTab`, `isDragging`, `animation`
- **Features:** Multi-tab interface, drag-to-move, keyboard navigation, multi-select support
- **Styling:** Neumorphic (raised effect with dual shadows)
- **Usage:** Main canvas component (conditional render)

---

## D. Data Flow Architecture

### State Management Approach
- **Local Component State:** UI-specific state (sidebar collapsed, modal position)
- **Custom Hooks:** Drawing state, viewport state, line collection
- **No Global State:** No Redux, Context, or Zustand
- **Props Drilling:** Data passed down from DrawingCanvas to child components

### State Hierarchy
```
DrawingCanvas (root state)
├── useDrawingState() → drawing phase, start/end points, snap target
├── useViewportTransform() → zoom scale, pan offset
├── useLineStore() → lines array, selected IDs, modal visibility
├── useState() → sidebar collapsed, HUD position, PDF state
│
└── Props ↓
    ├── CanvasRenderer (canvas + events)
    ├── LinePropertiesModal (line editing)
    ├── DrawButton (draw toggle)
    ├── Sidebar (line summary)
    └── BottomBar (zoom controls)
```

### Data Flow Patterns
1. **Drawing Flow:** Click → startDrawing → updateEndPoint → finishDrawing → createLine
2. **Selection Flow:** Click line → hitTest → handleLineSelection → openModal
3. **Viewport Flow:** Wheel/drag → updateViewport → render
4. **Modal Flow:** Select line → openModal → updateLine → closeModal

---

## E. Dependencies & Imports

### External Libraries
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library (Pencil, ChevronLeft, ZoomIn, etc.)
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **pdfjs-dist** - PDF rendering

### Internal Utility Functions
- **Geometry:** `dist()`, `getLineLength()`, `getDistancePointToSegment()`
- **Canvas:** `setupHiDPICanvas()`, `screenToCanvas()`, `canvasToScreen()`
- **Snap:** `findSnapTarget()`, `resolveSnapPoint()`
- **Scale:** `pixelsToInches()`, `formatLength()`
- **ID:** `uid()` - unique ID generation

### Shared Type Definitions
- **`Pt`** - 2D point {x, y}
- **`Line`** - Full duct line with properties
- **`DrawingPhase`** - 'idle' | 'waiting-for-end'
- **`SnapTarget`** - Snap point information
- **`ViewportTransform`** - {scale, offset}
- **`Scale`** - Measurement scale configuration
- **`ModalTab`** - 'properties' | 'calculations' | 'advanced'

### Common Constants
- **Canvas:** `MIN_ZOOM`, `MAX_ZOOM`, `HIT_TEST_MIN_TOLERANCE`
- **Snap:** `SNAP_THRESHOLD`, `SNAP_INDICATOR_RADIUS`
- **Modal:** `MODAL_WIDTH`, `MODAL_MIN_HEIGHT`
- **Duct:** `DUCT_TYPES`, `MATERIALS`, `GAUGES`, `STANDARD_WIDTHS`

---

## F. Styling System

### Styling Approach
- **Tailwind CSS** - Utility-first classes
- **CSS Modules** - Not used (Tailwind preferred)
- **CSS Custom Properties** - Design tokens via `css-tokens.tsx`
- **Inline Styles** - For dynamic positioning (modal, FAB)

### CSS Files
1. **`src/styles.css`** - Tailwind base + custom utilities
2. **`src/styles/typography.css`** - Font sizes, weights, line heights
3. **`src/styles/neumorphism.css`** - Soft UI shadow effects (PRIMARY)

### Design System
- **Theme:** Neumorphism (soft UI with dual shadows)
- **Base Color:** #E0E5EC (light gray-blue)
- **Primary Color:** Tech Blue (#3B82F6)
- **Accent Colors:** Success (green), Warning (amber), Error (red)

### Neumorphism Classes
- `.neumorphic-base` - Base background
- `.neumorphic-raised-{sm|md|lg|xl}` - Raised elements
- `.neumorphic-inset-{sm|md|lg}` - Inset/pressed elements
- `.neumorphic-hover` - Enhanced shadows on hover
- `.neumorphic-active` - Inverted shadows when pressed

### Accessibility Features
- Respects `prefers-reduced-motion`
- Respects `prefers-reduced-transparency`
- Respects `prefers-contrast: high`
- Respects `prefers-color-scheme: dark`
- Focus rings on interactive elements
- ARIA labels and roles

---

## G. Key Patterns & Conventions

### Naming Conventions
- **Components:** PascalCase (DrawButton, LinePropertiesModal)
- **Hooks:** camelCase with 'use' prefix (useDrawingState, useViewportTransform)
- **Services:** PascalCase with 'Service' suffix (DrawingService, ViewportService)
- **Utils:** camelCase (pixelsToInches, findSnapTarget)
- **Types:** PascalCase (Pt, Line, DrawingPhase)
- **Constants:** UPPER_SNAKE_CASE (MIN_ZOOM, SNAP_THRESHOLD)

### File Organization
- **Components:** Feature-based folders with index.ts barrel exports
- **Hooks:** One hook per file with clear responsibility
- **Services:** Domain-based folders (drawing/, viewport/, line/)
- **Utils:** Utility-based folders (geometry/, canvas/, snap/, scale/)
- **Types:** Domain-based files (canvas.types.ts, drawing.types.ts)
- **Constants:** Domain-based files (canvas.constants.ts, duct.constants.ts)

### Architectural Patterns
1. **7-Layer Architecture:** Types → Constants → Utils → Services → Hooks → Components → App
2. **Composition Over Inheritance:** React functional components with hooks
3. **Immutable Operations:** Services return new data, never mutate inputs
4. **Separation of Concerns:** Clear boundaries between layers
5. **Dependency Injection:** Props passed down, not imported directly
6. **State Colocalization:** State lives as close to usage as possible

### Testing Patterns
- **Unit Tests:** Services, utilities, hooks (Vitest)
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright for user workflows
- **Coverage Target:** ~80% overall (176 unit + 29 E2E tests)

---

## H. Architecture Layers

### Layer 1: Types (`src/types/`)
- Foundation layer - no dependencies
- Domain-specific files: canvas, drawing, duct, modal, scale, snap, pdf
- Barrel export: `src/types/index.ts`

### Layer 2: Constants (`src/constants/`)
- Configuration and static values
- Domain-specific files: canvas, duct, scale, snap, theme, modal
- Design tokens: `design-tokens.ts`, `css-tokens.tsx`
- Barrel export: `src/constants/index.ts`

### Layer 3: Utils (`src/utils/`)
- Pure utility functions
- Organized by domain: canvas, geometry, hvac, modal, pdf, scale, snap
- No side effects, no React hooks
- Barrel exports per domain

### Layer 4: Services (`src/services/`)
- Domain logic orchestration
- Organized by domain: drawing, viewport, line
- Stateless functions
- Compose utilities for complex operations
- Barrel exports per domain

### Layer 5: Hooks (`src/hooks/`)
- Stateful logic and side effects
- Custom hooks: useDrawingState, useViewportTransform, useCanvasSetup, useKeyboardShortcuts, useLineStore, useModalAnimation, useModalDrag, useModalKeyboard, useModalPosition
- Barrel export: `src/hooks/index.ts`

### Layer 6: Components (`src/components/`)
- React UI components
- Feature-based organization
- Receive data via props
- Barrel exports per feature

### Layer 7: App (`src/`)
- Root component (App.tsx)
- Main orchestrator (DrawingCanvas.tsx)
- Entry point (main.tsx)

---

## I. Key Metrics

- **Total Files:** 59 organized files
- **Architecture Layers:** 7 distinct layers
- **Test Coverage:** ~80% overall (176 unit tests + 29 E2E tests)
- **Bundle Size:** 161 KB JavaScript + 4.6 KB CSS
- **Build Time:** 676ms
- **Lines of Code:** ~8,000+ lines (excluding tests)
- **Status:** Production Ready (Core refactoring complete)

---

## J. Related Documentation

- **Architecture:** `docs/ARCHITECTURE.md`
- **Module Guidelines:** `docs/MODULE_GUIDELINES.md`
- **Current Specs:** `docs/CURRENT_CODEBASE_SPECS.md`
- **Design Audit:** `docs/LINE_PROPERTIES_MODAL_DESIGN_AUDIT.md`
- **ADRs:** `docs/adrs/` - Architecture Decision Records


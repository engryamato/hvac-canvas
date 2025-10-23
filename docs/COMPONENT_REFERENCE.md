# HVAC Canvas - Component Reference Guide

**Generated:** 2025-10-19  
**Purpose:** Detailed reference for all components, hooks, services, and utilities

---

## Components

### DrawingCanvas (Main Orchestrator)
- **File:** `src/DrawingCanvas.tsx` (1,200+ lines)
- **Purpose:** Main application component orchestrating all features
- **State Management:**
  - `useDrawingState()` - Drawing interaction state
  - `useViewportTransform()` - Zoom and pan
  - `useLineStore()` - Line collection and selection
  - `useState()` - UI state (sidebar, modal, PDF)
- **Key Props:** None (root component)
- **Children:** CanvasRenderer, Sidebar, BottomBar, LinePropertiesModal
- **Keyboard Shortcuts:** D (draw), [ ] (width), +/- (zoom), 0 (reset), Delete (remove)

### CanvasRenderer
- **File:** `src/components/DrawingCanvas/CanvasRenderer.tsx`
- **Purpose:** Canvas element with event handlers
- **Props:**
  - `canvasRef: RefObject<HTMLCanvasElement>`
  - `containerRef: RefObject<HTMLDivElement>`
  - `isDrawActive: boolean`
  - `onPointerDown/Move/Up: (e: PointerEvent) => void`
  - `onWheel: (e: WheelEvent) => void`
  - `onContextMenu: (e: MouseEvent) => void`
  - `onTouchStart/Move/End: (e: TouchEvent) => void`
  - `sidebarWidth: number`
  - `children?: ReactNode`
- **Features:** Dynamic cursor, responsive sizing, event delegation
- **Styling:** Tailwind (flex, overflow-hidden)

### DrawButton
- **File:** `src/components/DrawingCanvas/DrawButton.tsx`
- **Purpose:** Floating action button for draw mode toggle
- **Props:**
  - `isActive: boolean`
  - `onToggle: () => void`
  - `sidebarWidth: number`
- **Styling:** Neumorphic (raised/inset), Lucide Pencil icon
- **Position:** Fixed bottom-right, adjusted for sidebar
- **Accessibility:** aria-label, aria-pressed, title attribute

### Sidebar
- **File:** `src/components/DrawingCanvas/Sidebar.tsx`
- **Purpose:** Collapsible sidebar with line summary
- **Props:**
  - `collapsed: boolean`
  - `onToggle: () => void`
  - `lineSummary: LineSummaryRow[]`
  - `currentScale: Scale`
  - `width?: number`
- **Features:** Line grouping by width, total length display, collapse animation
- **Styling:** Neumorphic raised surfaces, Tailwind layout

### BottomBar
- **File:** `src/components/DrawingCanvas/BottomBar.tsx`
- **Purpose:** Bottom control bar with zoom and scale controls
- **Props:**
  - `zoom: number`
  - `canZoomIn/Out: boolean`
  - `onZoomIn/Out: () => void`
  - `currentScale: Scale`
  - `scaleOptions: Scale[]`
  - `onScaleChange: (scale: Scale) => void`
  - `onPdfUpload?: (file: File) => void`
  - `hasPdf?: boolean`
  - `pdfOpacity?: number`
  - `onPdfOpacityChange?: (opacity: number) => void`
- **Features:** Zoom controls, scale selector, PDF upload, opacity slider
- **Styling:** Neumorphic with shadow overlay

### LinePropertiesModal
- **File:** `src/components/LinePropertiesModal/LinePropertiesModal.tsx`
- **Purpose:** Modal for editing line/duct properties
- **Props:**
  - `selectedLines: Line[]`
  - `onUpdate: (lineId: string, updates: Partial<Line>) => void`
  - `onBatchUpdate?: (lineIds: string[], updates: Partial<Line>) => void`
  - `onClose: () => void`
  - `onDuplicate: () => void`
  - `onDelete: () => void`
  - `onDeleteAll?: () => void`
  - `viewportBounds: ViewportBounds`
  - `canvasBounds?: DOMRect`
  - `isOpen: boolean`
- **Features:** Multi-tab interface, drag-to-move, keyboard navigation, multi-select
- **Tabs:** Properties, Calculations, Advanced
- **Styling:** Neumorphic (raised effect with dual shadows)
- **Hooks Used:** useModalPosition, useModalAnimation, useModalDrag, useModalKeyboard

---

## Custom Hooks

### useDrawingState
- **File:** `src/hooks/useDrawingState.ts`
- **Returns:**
  - `phase: DrawingPhase` - 'idle' | 'waiting-for-end'
  - `startPoint: Pt | null`
  - `endPoint: Pt | null`
  - `snapTarget: SnapTarget | null`
  - `reset: () => void`
  - `startDrawing: (point: Pt, snap: SnapTarget | null) => void`
  - `updateEndPoint: (point: Pt, snap: SnapTarget | null) => void`
  - `setSnapTarget: (snap: SnapTarget | null) => void`
- **Purpose:** Manages drawing interaction state machine

### useViewportTransform
- **File:** `src/hooks/useViewportTransform.ts`
- **Returns:**
  - `scale: number`
  - `offset: Pt`
  - `transform: ViewportTransform`
  - `zoomIn/Out: (mouseScreenPos: Pt) => void`
  - `zoomByWheel: (mouseScreenPos: Pt, deltaY: number) => void`
  - `startPan/updatePan/endPan: () => void`
  - `isPanning: boolean`
  - `startPinchZoom/updatePinchZoom/endPinchZoom: () => void`
  - `reset: () => void`
  - `canZoomIn/Out: boolean`
- **Purpose:** Manages viewport zoom and pan state

### useCanvasSetup
- **File:** `src/hooks/useCanvasSetup.ts`
- **Parameters:**
  - `canvasRef: RefObject<HTMLCanvasElement>`
  - `containerRef: RefObject<HTMLDivElement>`
  - `transform: ViewportTransform`
  - `onResize?: () => void`
- **Purpose:** Canvas initialization and resize handling

### useKeyboardShortcuts
- **File:** `src/hooks/useKeyboardShortcuts.ts`
- **Parameters:**
  - `handlers: KeyboardShortcutHandlers`
  - `isDrawing: boolean`
  - `hasSelection: boolean`
- **Shortcuts:**
  - D - Toggle draw mode
  - Escape - Cancel drawing
  - Delete/Backspace - Delete selected
  - [ ] - Decrease/increase width
  - +/- - Zoom in/out
  - 0 - Reset zoom
- **Purpose:** Keyboard event handling

### useLineStore
- **File:** `src/hooks/useLineStore.ts`
- **Returns:**
  - `lines: Line[]`
  - `selectedLineIds: string[]`
  - `isModalOpen: boolean`
  - `selectedLines: Line[]`
  - `hasSelection: boolean`
  - `connections: ConnectionGraph` - Connection graph for all lines
  - `getConnectedEndpoints: (lineId: string, endpoint: LineEndpoint) => LineConnection[]` - Get connections for specific endpoint
  - `addLine: (line: Line) => void`
  - `updateLine: (id: string, updates: Partial<Line>) => void`
  - `batchUpdateLines: (ids: string[], updates: Partial<Line>) => void`
  - `deleteLines: (ids: string[]) => void`
  - `duplicateLine: (id: string) => void`
  - `selectLines: (ids: string[]) => void`
  - `clearSelection: () => void`
  - `openModal: () => void`
  - `closeModal: () => void`
- **Purpose:** Centralized line collection, selection logic, and connection detection
- **Connection Detection:**
  - Automatically builds connection graph from current lines
  - Updates in real-time as lines are added, modified, or deleted
  - Memoized for performance (only recomputes when lines change)
  - Provides getConnectedEndpoints callback for querying connections

### useModalPosition
- **File:** `src/hooks/useModalPosition.ts`
- **Purpose:** Calculate optimal modal position near selected line

### useModalAnimation
- **File:** `src/hooks/useModalAnimation.ts`
- **Purpose:** Handle modal open/close animations

### useModalDrag
- **File:** `src/hooks/useModalDrag.ts`
- **Purpose:** Handle modal drag-to-move functionality

### useModalKeyboard
- **File:** `src/hooks/useModalKeyboard.ts`
- **Purpose:** Handle keyboard navigation and focus trapping

---

## Services

### Drawing Services (`src/services/drawing/`)

#### DrawingService
- `createLine(params: CreateLineParams): CreateLineResult`
- `validateLine(line: Line): boolean`
- `calculateLineLength(line: Line): number`
- `updateLineWidth(line: Line, newWidth: number): Line`
- `updateLineColor(line: Line, newColor: string): Line`

#### LineManager
- `addLine(lines: Line[], newLine: Line): Line[]`
- `removeLine(lines: Line[], lineId: string): Line[]`
- `removeLines(lines: Line[], lineIds: string[]): Line[]`
- `updateLineWidth(lines: Line[], lineId: string, newWidth: number): Line[]`
- `updateLineColor(lines: Line[], lineId: string, newColor: string): Line[]`
- `updateLineLength(lines: Line[], lineId: string, newLength: number): Line[]`
- `findLineById(lines: Line[], lineId: string): Line | undefined`
- `getLinesByWidth(lines: Line[], width: number): Line[]`
- `getUniqueWidths(lines: Line[]): number[]`

#### HitTestService
- `findLineHit(lines: Line[], point: Pt): string | null`
- `findEndpointHit(line: Line, point: Pt, threshold?: number): 'a' | 'b' | null`

#### CanvasRenderService
- `drawLines(ctx: CanvasRenderingContext2D, lines: Line[], options: DrawLinesOptions): void`
- `drawSnapIndicator(ctx: CanvasRenderingContext2D, snapTarget: SnapTarget, viewportScale: number): void`
- `drawDraftLine(ctx: CanvasRenderingContext2D, start: Pt, end: Pt, width: number, viewportScale: number): void`

### Viewport Services (`src/services/viewport/`)

#### ViewportService
- `calculateZoom(currentScale: number, direction: 'in' | 'out'): number`
- `calculateZoomByWheel(currentScale: number, deltaY: number): number`
- `calculatePan(offset: Pt, delta: Pt): Pt`
- `resetViewport(): ViewportTransform`
- `canZoomIn(scale: number): boolean`
- `canZoomOut(scale: number): boolean`

### Line Services (`src/services/line/`)

#### LinePropertiesService
- `initializeLineDefaults(line: Partial<Line>): Line`
- `updateLineProperties(line: Line, updates: Partial<Line>): Line`
- `validateLineProperties(line: Line): ValidationResult`
- `batchUpdateLines(lines: Line[], updates: Partial<Line>): Line[]`
- `getMixedValue(lines: Line[], key: keyof Line): string | number | boolean | null`
- `duplicateLine(line: Line): Line`
- `calculateAggregateStats(lines: Line[]): AggregateStats`

### Connection Detection Services (`src/services/drawing/`)

#### ConnectionService
- **File:** `src/services/drawing/ConnectionService.ts`
- **Purpose:** Detects and manages line endpoint connections
- **Key Functions:**
  - `normalizeCoordinate(value: number, tolerance: number): number` - Round coordinates to tolerance bucket
  - `buildConnectionGraph(lines: Line[], tolerance: number): ConnectionGraph` - Build complete connection graph
  - `getConnectedEndpoints(graph: ConnectionGraph, lineId: string, endpoint: LineEndpoint): LineConnection[]` - Query connections for specific endpoint
  - `getConnectionsForLine(graph: ConnectionGraph, lineId: string): LineConnectionMap` - Get all connections for a line
- **Integration:**
  - Used by `useLineStore` hook to compute connections
  - Tolerance aligned with snapping system (20px)
  - Bidirectional connection tracking for O(1) lookups
  - Memoized in hook for performance

---

## Utilities

### Geometry Utils (`src/utils/geometry/`)
- `dist(p1: Pt, p2: Pt): number` - Distance between points
- `getLineLength(line: Line): number` - Line length in pixels
- `getDistancePointToSegment(point: Pt, a: Pt, b: Pt): number` - Point-to-line distance

### Canvas Utils (`src/utils/canvas/`)
- `setupHiDPICanvas(canvas: HTMLCanvasElement, transform: ViewportTransform): void`
- `screenToCanvas(screenPos: Pt, transform: ViewportTransform): Pt`
- `canvasToScreen(canvasPos: Pt, transform: ViewportTransform): Pt`

### Snap Utils (`src/utils/snap/`)
- `findSnapTarget(cursorPos: Pt, lines: Line[]): SnapTarget | null`
- `resolveSnapPoint(cursorPos: Pt, snap: SnapTarget | null): Pt`

### Scale Utils (`src/utils/scale/`)
- `pixelsToInches(pixels: number, scale: Scale): number`
- `formatLength(inches: number, scale: Scale): string`

### ID Utils (`src/utils/id.ts`)
- `uid(): string` - Generate unique ID

---

## Type Definitions

### Core Types
- **`Pt`** - {x: number, y: number}
- **`Line`** - Full duct line with all properties
- **`DrawingPhase`** - 'idle' | 'waiting-for-end'
- **`ViewportTransform`** - {scale: number, offset: Pt}
- **`SnapTarget`** - {type: SnapType, point: Pt, lineId: string}
- **`Scale`** - {type: ScaleType, pixelsPerInch: number, displayName: string, unit: ScaleUnit}
- **`ModalTab`** - 'properties' | 'calculations' | 'advanced' | 'connections'

### Connection Detection Types
- **`LineEndpoint`** - 'a' | 'b' (represents a line endpoint)
- **`LineConnection`** - {lineId: string, endpoint: LineEndpoint} (single connection record)
- **`LineConnectionMap`** - {a: LineConnection[], b: LineConnection[]} (connections for one line)
- **`ConnectionGraph`** - Record<string, LineConnectionMap> (all connections for all lines)

---

## Constants

### Canvas Constants
- `MIN_ZOOM = 0.1`
- `MAX_ZOOM = 10`
- `DEFAULT_ZOOM = 1`
- `HIT_TEST_MIN_TOLERANCE = 5`
- `HIT_TEST_WIDTH_FACTOR = 2`

### Snap Constants
- `SNAP_THRESHOLD = 15`
- `SNAP_INDICATOR_RADIUS = 8`
- `SNAP_INDICATOR_COLOR = '#3B82F6'`
- `CONNECTION_TOLERANCE_PX = 20` (aligned with SNAP_THRESHOLD_ENDPOINT)

### Modal Constants
- `MODAL_WIDTH = 360`
- `MODAL_MIN_HEIGHT = 400`
- `MODAL_ANIMATION_DURATION = 200`

### Duct Constants
- `DUCT_TYPES = ['supply', 'return']`
- `MATERIALS = ['Galvanized Steel', 'Stainless Steel', 'Aluminum', 'Fiberglass', 'Flex Duct']`
- `GAUGES = ['26ga', '24ga', '22ga', '20ga', '18ga']`
- `STANDARD_WIDTHS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 24]`

---

## Design Tokens

### Colors
- **Primary:** Tech Blue (#3B82F6)
- **Neutral:** Gray scale (#111827 to #F3F4F6)
- **Success:** Green (#10B981)
- **Warning:** Amber (#F59E0B)
- **Error:** Red (#EF4444)

### Typography
- **Primary Font:** Inter (UI)
- **Mono Font:** JetBrains Mono (data)
- **Sizes:** xs (12px) to 3xl (30px)
- **Weights:** normal (400), medium (500), semibold (600), bold (700)

### Spacing
- **Scale:** 4px base unit (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64)

### Shadows
- **sm:** 0 1px 2px rgba(0,0,0,0.05)
- **md:** 0 4px 6px rgba(0,0,0,0.1)
- **lg:** 0 10px 15px rgba(0,0,0,0.1)
- **xl:** 0 20px 25px rgba(0,0,0,0.1)

---

## Styling Classes

### Neumorphism (Current)
- `.neumorphic-base` - Base background
- `.neumorphic-raised-sm/md/lg/xl` - Raised elements
- `.neumorphic-inset-sm/md/lg` - Inset elements
- `.neumorphic-hover` - Hover state
- `.neumorphic-active` - Active/pressed state

---

## Testing

### Test Files
- **Unit Tests:** `src/**/__tests__/*.test.ts`
- **Component Tests:** `src/components/**/__tests__/*.test.tsx`
- **E2E Tests:** `tests/e2e/*.spec.ts`

### Coverage
- **Overall:** ~80%
- **Services:** ~100%
- **Hooks:** ~100%
- **Components:** ~95%
- **Utils:** ~100%

### Test Frameworks
- **Unit:** Vitest + React Testing Library
- **E2E:** Playwright
- **Config:** `vitest.config.ts`, `playwright.config.ts`


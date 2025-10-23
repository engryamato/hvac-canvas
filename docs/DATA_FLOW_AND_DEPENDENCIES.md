# HVAC Canvas - Data Flow & Dependencies Guide

**Generated:** 2025-10-19  
**Purpose:** Document how data flows through the application and all dependencies

---

## A. Data Flow Patterns

### 1. Drawing Workflow
```
User Click (canvas)
  ↓
onPointerDown (CanvasRenderer)
  ↓
handleDrawingFirstClick (DrawingCanvas)
  ↓
drawingState.startDrawing(point, snap)
  ↓
[Phase: idle → waiting-for-end]
  ↓
onPointerMove (CanvasRenderer)
  ↓
drawingState.updateEndPoint(point, snap)
  ↓
render() [draws draft line]
  ↓
User Click (canvas)
  ↓
handleDrawingSecondClick (DrawingCanvas)
  ↓
createLine(startPoint, endPoint, width, color)
  ↓
addLine(lines, newLine)
  ↓
setLines([...lines, newLine])
  ↓
drawingState.reset()
  ↓
[Phase: waiting-for-end → idle]
  ↓
render() [draws completed line]
```

### 2. Selection & Modal Workflow
```
User Click (line on canvas)
  ↓
onPointerDown (CanvasRenderer)
  ↓
hitTest(point) → lineId
  ↓
handleLineSelection(lineId, isMultiSelect)
  ↓
setSelectedLineIds([...ids, lineId])
  ↓
openModal()
  ↓
[isModalOpen = true]
  ↓
LinePropertiesModal renders
  ↓
User edits properties
  ↓
onUpdate(lineId, updates)
  ↓
updateLine(lineId, updates)
  ↓
setLines([...updated lines])
  ↓
render() [redraws with new properties]
```

### 3. Viewport Zoom Workflow
```
User Wheel (canvas)
  ↓
onWheel (CanvasRenderer)
  ↓
viewport.zoomByWheel(mousePos, deltaY)
  ↓
calculateZoomByWheel(currentScale, deltaY)
  ↓
setScale(newScale)
  ↓
setOffset(adjustedOffset)
  ↓
render() [redraws at new scale]
```

### 4. Snap Detection Workflow
```
onPointerMove (CanvasRenderer)
  ↓
findSnapTarget(cursorPos, lines)
  ↓
[Check endpoints, midpoints, line intersections]
  ↓
drawingState.setSnapTarget(snap)
  ↓
render() [draws snap indicator]
  ↓
resolveSnapPoint(cursorPos, snap)
  ↓
drawingState.updateEndPoint(resolvedPoint, snap)
```

---

## B. State Management Architecture

### Root State (DrawingCanvas)
```typescript
// Drawing state
const drawingState = useDrawingState();
// → phase, startPoint, endPoint, snapTarget
// → reset(), startDrawing(), updateEndPoint(), setSnapTarget()

// Viewport state
const viewport = useViewportTransform();
// → scale, offset, transform
// → zoomIn(), zoomOut(), zoomByWheel(), startPan(), updatePan(), endPan()

// Line collection state
const lineStore = useLineStore();
// → lines, selectedLineIds, isModalOpen, selectedLines
// → addLine(), updateLine(), deleteLines(), selectLines(), openModal()

// UI state
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [isPanning, setIsPanning] = useState(false);
const [draggingEndpoint, setDraggingEndpoint] = useState(null);
const [pdfState, setPdfState] = useState(null);
```

### Props Flow
```
DrawingCanvas (root)
  ├─ CanvasRenderer
  │   ├─ canvasRef, containerRef
  │   ├─ isDrawActive, onPointerDown/Move/Up, onWheel, onContextMenu
  │   ├─ onTouchStart/Move/End
  │   ├─ sidebarWidth
  │   └─ children
  │       ├─ LinePropertiesModal
  │       │   ├─ selectedLines
  │       │   ├─ onUpdate, onBatchUpdate, onClose
  │       │   ├─ onDuplicate, onDelete, onDeleteAll
  │       │   ├─ viewportBounds, canvasBounds, isOpen
  │       │   └─ [internal state: activeTab, isDragging, animation]
  │       └─ DrawButton
  │           ├─ isActive, onToggle
  │           └─ sidebarWidth
  ├─ Sidebar
  │   ├─ collapsed, onToggle
  │   ├─ lineSummary, currentScale
  │   └─ width
  └─ BottomBar
      ├─ zoom, canZoomIn/Out, onZoomIn/Out
      ├─ currentScale, scaleOptions, onScaleChange
      ├─ onPdfUpload, hasPdf, pdfOpacity, onPdfOpacityChange
      └─ [internal state: scale selector, PDF controls]
```

---

## C. Dependency Graph

### Layer Dependencies
```
Layer 1: Types (foundation)
  ↓ (no dependencies)

Layer 2: Constants
  ↓ (depends on Types)

Layer 3: Utils
  ↓ (depends on Types, Constants)

Layer 4: Services
  ↓ (depends on Types, Constants, Utils)

Layer 5: Hooks
  ↓ (depends on Types, Constants, Utils, Services)

Layer 6: Components
  ↓ (depends on Types, Constants, Utils, Hooks)

Layer 7: App
  ↓ (depends on all layers)
```

### Component Dependencies
```
DrawingCanvas
├─ useDrawingState (hook)
├─ useViewportTransform (hook)
├─ useLineStore (hook)
├─ useKeyboardShortcuts (hook)
├─ useCanvasSetup (hook)
├─ CanvasRenderer (component)
│   ├─ LinePropertiesModal (component)
│   │   ├─ useModalPosition (hook)
│   │   ├─ useModalAnimation (hook)
│   │   ├─ useModalDrag (hook)
│   │   ├─ useModalKeyboard (hook)
│   │   ├─ ModalHeader (component)
│   │   ├─ TabBar (component)
│   │   ├─ PropertiesTab (component)
│   │   ├─ CalculationsTab (component)
│   │   ├─ AdvancedTab (component)
│   │   ├─ MultiSelectHeader (component)
│   │   ├─ MultiSelectWarning (component)
│   │   ├─ ModalFooter (component)
│   │   └─ Separator (component)
│   └─ DrawButton (component)
├─ Sidebar (component)
└─ BottomBar (component)
```

### Service Dependencies
```
DrawingService
├─ dist() [geometry util]
├─ getLineLength() [geometry util]
├─ uid() [id util]
└─ MIN_LINE_LENGTH [constant]

LineManager
├─ DrawingService
├─ uid() [id util]
└─ [line constants]

HitTestService
├─ getDistancePointToSegment() [geometry util]
├─ dist() [geometry util]
├─ HIT_TEST_MIN_TOLERANCE [constant]
└─ HIT_TEST_WIDTH_FACTOR [constant]

CanvasRenderService
├─ SELECTION_HIGHLIGHT_WIDTH [constant]
├─ SNAP_INDICATOR_* [constants]
└─ [canvas rendering logic]

ViewportService
├─ MIN_ZOOM, MAX_ZOOM [constants]
└─ [viewport math]

LinePropertiesService
├─ uid() [id util]
├─ [duct constants]
└─ [line validation logic]
```

### Hook Dependencies
```
useDrawingState
├─ useState (React)
├─ useCallback (React)
└─ [no service dependencies]

useViewportTransform
├─ useState (React)
├─ useCallback (React)
├─ ViewportService
├─ MIN_ZOOM, MAX_ZOOM [constants]
└─ [viewport math]

useCanvasSetup
├─ useEffect (React)
├─ setupHiDPICanvas() [canvas util]
└─ ResizeObserver (browser API)

useKeyboardShortcuts
├─ useEffect (React)
├─ [keyboard event handling]
└─ [no service dependencies]

useLineStore
├─ useState (React)
├─ useCallback (React)
├─ useMemo (React)
├─ LineManager service
├─ LinePropertiesService
└─ duplicateLine() [service]

useModalPosition
├─ useState (React)
├─ useEffect (React)
└─ [positioning logic]

useModalAnimation
├─ useState (React)
├─ useEffect (React)
└─ [animation timing]

useModalDrag
├─ useState (React)
├─ useCallback (React)
└─ [drag logic]

useModalKeyboard
├─ useEffect (React)
└─ [keyboard event handling]
```

---

## D. Import Chains

### Example: Drawing a Line
```
DrawingCanvas.tsx
├─ import { useDrawingState } from './hooks'
│   └─ src/hooks/useDrawingState.ts
│       ├─ import { DrawingPhase, Pt, SnapTarget } from '../types'
│       └─ import { useCallback, useState } from 'react'
├─ import { createLine } from './services'
│   └─ src/services/drawing/DrawingService.ts
│       ├─ import { dist, getLineLength } from '../utils/geometry'
│       ├─ import { uid } from '../utils'
│       └─ import { MIN_LINE_LENGTH } from '../constants'
└─ import { drawLines } from './services'
    └─ src/services/drawing/CanvasRenderService.ts
        ├─ import { SELECTION_HIGHLIGHT_WIDTH } from '../constants'
        └─ [canvas rendering logic]
```

### Example: Selecting a Line
```
DrawingCanvas.tsx
├─ import { useLineStore } from './hooks'
│   └─ src/hooks/useLineStore.ts
│       ├─ import { LineManager } from '../services'
│       ├─ import { LinePropertiesService } from '../services/line'
│       └─ import { Line } from '../types'
├─ import { findLineHit } from './services'
│   └─ src/services/drawing/HitTestService.ts
│       ├─ import { getDistancePointToSegment } from '../utils/geometry'
│       └─ import { HIT_TEST_MIN_TOLERANCE } from '../constants'
└─ import { LinePropertiesModal } from './components'
    └─ src/components/LinePropertiesModal/LinePropertiesModal.tsx
        ├─ import { useModalPosition } from '../hooks'
        ├─ import { useModalAnimation } from '../hooks'
        ├─ import { useModalDrag } from '../hooks'
        ├─ import { useModalKeyboard } from '../hooks'
        └─ import { Line } from '../types'
```

---

## E. External Dependencies

### React Ecosystem
- **react** (18.x) - UI framework
- **react-dom** (18.x) - DOM rendering
- **@vitejs/plugin-react** - Vite React plugin

### Development Tools
- **typescript** - Type checking
- **vite** - Build tool
- **vitest** - Unit testing
- **@testing-library/react** - Component testing
- **@testing-library/user-event** - User interaction testing
- **playwright** - E2E testing

### UI & Styling
- **tailwindcss** - Utility-first CSS
- **lucide-react** - Icon library
- **autoprefixer** - CSS vendor prefixes
- **postcss** - CSS processing

### PDF Support
- **pdfjs-dist** - PDF rendering

### Utilities
- **@types/node** - Node.js types
- **@types/react** - React types
- **@types/react-dom** - React DOM types

---

## F. Callback Chains

### Drawing Completion
```
handleDrawingSecondClick()
  ↓
createLine(startPoint, endPoint, width, color)
  ↓
addLine(lines, newLine)
  ↓
setLines([...lines, newLine])
  ↓
drawingState.reset()
  ↓
render()
```

### Line Update
```
onUpdate(lineId, updates)
  ↓
updateLine(lineId, updates)
  ↓
setLines([...updated lines])
  ↓
render()
  ↓
onClose()
  ↓
closeModal()
  ↓
setIsModalOpen(false)
```

### Batch Update
```
onBatchUpdate(lineIds, updates)
  ↓
batchUpdateLines(lineIds, updates)
  ↓
setLines([...updated lines])
  ↓
render()
```

---

## G. Event Handler Flow

### Pointer Events
```
onPointerDown
  ├─ Check if drawing mode
  │   ├─ If idle: handleDrawingFirstClick()
  │   └─ If waiting-for-end: handleDrawingSecondClick()
  └─ Check if selection mode
      ├─ hitTest() → find line
      ├─ hitTestEndpoint() → check endpoint
      └─ handleLineSelection() or handleClearSelection()

onPointerMove
  ├─ Update mouse position
  ├─ If drawing: update draft line
  ├─ If panning: update viewport offset
  └─ If dragging endpoint: update endpoint position

onPointerUp
  ├─ End panning
  └─ End endpoint dragging
```

### Keyboard Events
```
D key
  └─ setIsDrawActive(!isDrawActive)

Escape key
  ├─ If drawing: drawingState.reset()
  └─ If modal open: closeModal()

Delete/Backspace
  ├─ If selection: deleteLines(selectedLineIds)
  └─ If drawing: drawingState.reset()

[ / ]
  └─ Adjust line width (selected or default)

+/- or 0
  └─ Zoom in/out or reset zoom
```

### Wheel Events
```
onWheel
  ├─ If Ctrl/Cmd: zoom
  │   └─ viewport.zoomByWheel(mousePos, deltaY)
  └─ Else: pan
      └─ viewport.updatePan(delta)
```

---

## H. Rendering Pipeline

### Canvas Render Cycle
```
useEffect(() => {
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Apply viewport transform
  ctx.translate(offset.x, offset.y);
  ctx.scale(scale, scale);
  
  // Draw PDF background (if loaded)
  if (pdfState) drawPdfOnCanvas(...);
  
  // Draw all lines
  if (lines.length > 0) drawLines(ctx, lines, { selectedLineIds, viewportScale });
  
  // Draw snap indicator (if snapping)
  if (drawingState.snapTarget) drawSnapIndicator(ctx, drawingState.snapTarget, viewportScale);
  
  // Draw draft line (if drawing)
  if (isDrawActive && drawingState.phase === 'waiting-for-end') {
    drawDraftLine(ctx, startPoint, endPoint, defaultWidth, viewportScale);
  }
}, [lines, selectedLineIds, isDrawActive, drawingState, defaultWidth, viewportScale, pdfState]);
```

### Dependency Array
- `lines` - Redraws when lines change
- `selectedLineIds` - Redraws when selection changes
- `isDrawActive` - Redraws when draw mode toggles
- `drawingState` - Redraws when drawing state changes
- `defaultWidth` - Redraws when default width changes
- `viewportScale` - Redraws when zoom changes
- `pdfState` - Redraws when PDF changes

---

## I. Performance Considerations

### Memoization
- `selectedLines` - Memoized in useLineStore
- `lineSummary` - Computed from lines in DrawingCanvas
- `scaleOptions` - Constant array

### Optimization Techniques
- **Canvas rendering** - Only redraws on state changes
- **Hit testing** - Early exit on first match
- **Snap detection** - Threshold-based filtering
- **GPU acceleration** - CSS transforms for modals
- **Lazy evaluation** - Calculations only when needed

### Potential Bottlenecks
- Large line collections (1000+ lines)
- Frequent viewport updates
- Complex snap detection
- Modal drag operations

---

## J. Testing Dependencies

### Unit Test Imports
```
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

### E2E Test Imports
```
import { test, expect } from '@playwright/test';
```

### Mock Patterns
- Mock canvas context
- Mock ResizeObserver
- Mock keyboard events
- Mock pointer events


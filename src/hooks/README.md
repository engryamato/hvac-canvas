# Hooks Directory

This directory contains custom React hooks that encapsulate stateful logic and side effects. Hooks provide clean interfaces for components to manage state and interact with services.

## Organization

Hooks are organized by concern:

- **`useDrawingState.ts`** - Drawing interaction state management
- **`useViewportTransform.ts`** - Viewport zoom and pan state
- **`useCanvasSetup.ts`** - Canvas initialization and resize handling
- **`useKeyboardShortcuts.ts`** - Keyboard event handling
- **`index.ts`** - Barrel export for clean imports

## Test Coverage

All hooks have comprehensive tests with **~100% coverage**:

```
src/hooks/__tests__/
├── useDrawingState.test.ts (7 tests)
├── useViewportTransform.test.ts (13 tests)
├── useKeyboardShortcuts.test.ts (14 tests)
└── (useCanvasSetup tested via integration)
```

## Hook Modules

### useDrawingState

Manages drawing interaction state machine:

```typescript
export function useDrawingState() {
  return {
    // State
    phase: DrawingPhase;           // 'idle' | 'waiting-for-end' | 'selected'
    startPt: Pt | null;            // First point when drawing
    selectedLineId: string | null; // ID of selected line
    
    // Actions
    startDrawing: (pt: Pt) => void;
    finishDrawing: () => void;
    selectLine: (id: string | null) => void;
    reset: () => void;
  };
}
```

**State Machine:**
```
idle → waiting-for-end (startDrawing)
waiting-for-end → idle (finishDrawing)
idle → selected (selectLine)
selected → idle (selectLine(null) or reset)
```

**Usage:**
```typescript
import { useDrawingState } from '../hooks';

function DrawingCanvas() {
  const { phase, startPt, startDrawing, finishDrawing } = useDrawingState();
  
  const handleClick = (pt: Pt) => {
    if (phase === 'idle') {
      startDrawing(pt);
    } else if (phase === 'waiting-for-end') {
      finishDrawing();
    }
  };
  
  return <canvas onClick={handleClick} />;
}
```

### useViewportTransform

Manages viewport zoom and pan state:

```typescript
export function useViewportTransform() {
  return {
    // State
    viewportScale: number;         // Current zoom level (1.0 = 100%)
    viewportOffset: Pt;            // Pan offset in pixels
    canZoomIn: boolean;            // Can zoom in further
    canZoomOut: boolean;           // Can zoom out further
    
    // Actions
    zoom: (direction: 'in' | 'out', center?: Pt) => void;
    pan: (delta: Pt) => void;
    reset: () => void;
  };
}
```

**Usage:**
```typescript
import { useViewportTransform } from '../hooks';

function DrawingCanvas() {
  const { viewportScale, zoom, pan, reset } = useViewportTransform();
  
  const handleWheel = (e: WheelEvent) => {
    const direction = e.deltaY < 0 ? 'in' : 'out';
    const center = { x: e.clientX, y: e.clientY };
    zoom(direction, center);
  };
  
  const handleRightDrag = (delta: Pt) => {
    pan(delta);
  };
  
  return <canvas onWheel={handleWheel} />;
}
```

### useCanvasSetup

Handles canvas initialization and resize:

```typescript
export function useCanvasSetup(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  viewportScale: number,
  viewportOffset: Pt
): void;
```

**Features:**
- Sets up HiDPI canvas rendering
- Handles window resize events
- Applies viewport transformations
- Cleans up event listeners on unmount

**Usage:**
```typescript
import { useCanvasSetup } from '../hooks';

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewportScale, viewportOffset } = useViewportTransform();
  
  useCanvasSetup(canvasRef, containerRef, viewportScale, viewportOffset);
  
  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
```

### useKeyboardShortcuts

Handles keyboard event listeners:

```typescript
export interface KeyboardHandlers {
  onToggleDrawMode?: () => void;
  onIncreaseWidth?: () => void;
  onDecreaseWidth?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onEscape?: () => void;
  onDelete?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardHandlers): void;
```

**Keyboard Shortcuts:**
- `D` - Toggle draw mode
- `[` - Decrease line width
- `]` - Increase line width
- `+` or `=` - Zoom in
- `-` or `_` - Zoom out
- `0` - Reset zoom
- `Escape` - Cancel/deselect
- `Delete` or `Backspace` - Delete selected line

**Usage:**
```typescript
import { useKeyboardShortcuts } from '../hooks';

function DrawingCanvas() {
  const { zoom, reset } = useViewportTransform();
  const [isDrawActive, setIsDrawActive] = useState(false);
  
  useKeyboardShortcuts({
    onToggleDrawMode: () => setIsDrawActive(prev => !prev),
    onZoomIn: () => zoom('in'),
    onZoomOut: () => zoom('out'),
    onResetZoom: reset,
  });
  
  return <canvas />;
}
```

## Hook Principles

### 1. Single Responsibility

Each hook handles one concern:

```typescript
// ✅ Single responsibility
useDrawingState();      // Drawing state only
useViewportTransform(); // Viewport state only

// ❌ Multiple responsibilities
useCanvasState(); // Drawing + viewport + keyboard
```

### 2. Composability

Hooks can be composed in components:

```typescript
function DrawingCanvas() {
  const drawingState = useDrawingState();
  const viewportTransform = useViewportTransform();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useCanvasSetup(canvasRef, containerRef, viewportTransform.viewportScale, viewportTransform.viewportOffset);
  useKeyboardShortcuts({ /* handlers */ });
  
  // Use all hooks together
}
```

### 3. Service Integration

Hooks use services for domain logic:

```typescript
// ✅ Uses service
function useDrawingState() {
  const finishDrawing = useCallback(() => {
    if (startPt) {
      const line = createLine(startPt, endPt, width); // Service
      if (line) {
        setLines(prev => addLine(prev, line)); // Service
      }
    }
  }, [startPt, endPt, width]);
}

// ❌ Duplicates logic
function useDrawingState() {
  const finishDrawing = useCallback(() => {
    const length = Math.sqrt(...); // Duplicates utility logic
    if (length < 5) return;
    // ...
  }, []);
}
```

### 4. Proper Dependencies

Use `useCallback` and `useMemo` with correct dependencies:

```typescript
// ✅ Correct dependencies
const zoom = useCallback((direction: 'in' | 'out') => {
  setViewportScale(prev => calculateZoom(prev, direction));
}, []); // No dependencies needed

// ❌ Missing dependencies
const zoom = useCallback((direction: 'in' | 'out') => {
  const newZoom = calculateZoom(viewportScale, direction);
  setViewportScale(newZoom);
}, []); // Should include viewportScale
```

## Testing Guidelines

### Test Structure

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useHookName', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current.state).toBe(defaultValue);
  });
  
  it('should update state when action called', () => {
    const { result } = renderHook(() => useHookName());
    
    act(() => {
      result.current.action(newValue);
    });
    
    expect(result.current.state).toBe(newValue);
  });
});
```

### Coverage Targets

- **Line Coverage:** ≥70%
- **Branch Coverage:** ≥70%
- **Function Coverage:** 100%

## Adding New Hooks

When adding new hooks:

1. **Identify the concern** (state management, side effects, etc.)
2. **Define clear interface** with TypeScript types
3. **Write tests first** using React Testing Library
4. **Use services** for domain logic (don't duplicate)
5. **Add proper dependencies** to useCallback/useMemo
6. **Add JSDoc comments** explaining purpose and usage
7. **Export from index.ts** barrel export
8. **Update this README** with usage examples

Example:
```typescript
// src/hooks/useUndoRedo.ts

/**
 * Manage undo/redo history for lines
 * @param initialLines - Initial lines array
 * @returns Undo/redo state and actions
 */
export function useUndoRedo(initialLines: Line[]) {
  const [history, setHistory] = useState<Line[][]>([initialLines]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);
  
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length]);
  
  const addToHistory = useCallback((lines: Line[]) => {
    setHistory(prev => [...prev.slice(0, currentIndex + 1), lines]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);
  
  return {
    lines: history[currentIndex],
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    undo,
    redo,
    addToHistory,
  };
}

// src/hooks/__tests__/useUndoRedo.test.ts
describe('useUndoRedo', () => {
  it('should undo to previous state', () => {
    const { result } = renderHook(() => useUndoRedo([]));
    
    act(() => {
      result.current.addToHistory([mockLine]);
    });
    
    act(() => {
      result.current.undo();
    });
    
    expect(result.current.lines).toEqual([]);
  });
});
```

## Related Documentation

- **ADR-004:** Extract Custom Hooks - Decision rationale
- **Services:** `src/services/` - Services used by hooks
- **Components:** `src/components/` - Components that use hooks
- **Testing Strategy:** `docs/TESTING_STRATEGY.md` - Testing approach

## Dependencies

Hooks depend on **Services**, **Utils**, **Types**, and **Constants**:

```
Types & Constants
  ↓
Utils
  ↓
Services
  ↓
Hooks (stateful logic)
  ↑
Components
```

**Dependency Rules:**
- ✅ Hooks can import from Services, Utils, Types, Constants
- ❌ Hooks cannot import from Components
- ✅ Hooks can use React hooks (useState, useEffect, etc.)


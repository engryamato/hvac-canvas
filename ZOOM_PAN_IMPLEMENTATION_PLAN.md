# Zoom and Pan Implementation Plan for HVAC Canvas

## Executive Summary

This document provides a comprehensive plan for implementing zoom and pan functionality for the HVAC Canvas application. The implementation will support mouse wheel zoom, click-and-drag panning, and touch gestures for tablet users.

---

## 1. Current Canvas Implementation Analysis

### Technology Stack
- **Canvas Type**: HTML5 Canvas (native `<canvas>` element)
- **Framework**: React 18.2 with TypeScript 5.1
- **No external canvas libraries**: Pure Canvas API implementation
- **Rendering**: Direct 2D context manipulation

### Current Architecture

#### Canvas Setup
- **HiDPI Support**: `setupHiDPICanvas()` applies `devicePixelRatio` scaling
- **Current Transform**: `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` - only DPI scaling applied
- **Coordinate System**: Lines stored in CSS pixel coordinates (not canvas pixels)
- **Rendering Pipeline**: 
  1. Clear canvas
  2. Draw all lines with their stored coordinates
  3. Draw selection highlights
  4. Draw snap indicators
  5. Draw rubber-band preview

#### Event Handlers
- **onPointerDown**: Handles drawing start/end clicks and line selection
- **onPointerMove**: Handles snap detection and rubber-band preview updates
- **onPointerUp**: Cleans up pointer capture
- **No wheel events**: Currently not implemented
- **No touch gesture handling**: Only basic pointer events

#### Data Model
```typescript
type Line = {
  id: string;
  a: Pt;  // start point {x, y} in CSS pixels
  b: Pt;  // end point {x, y} in CSS pixels
  width: number;
  color: string;
};
```

#### Key Functions
- `getPointerPos()`: Converts screen coordinates to canvas coordinates
- `render()`: Main rendering function
- `hitTest()`: Line selection detection
- `findSnapTarget()`: Snap point detection
- `calculateHudPosition()`: HUD positioning

---

## 2. Zoom and Pan Best Practices Research

### Canvas Transformation Strategy

#### Recommended Approach: Canvas Context Transform
Use `ctx.setTransform()` to apply zoom and pan transformations:
```typescript
ctx.setTransform(
  scale * dpr,           // horizontal scaling
  0,                     // horizontal skewing
  0,                     // vertical skewing
  scale * dpr,           // vertical scaling
  offsetX * dpr,         // horizontal translation
  offsetY * dpr          // vertical translation
);
```

**Advantages**:
- Hardware-accelerated
- Automatic coordinate transformation
- Clean separation of concerns
- No need to modify stored line coordinates

### Coordinate Transformation

#### Two Coordinate Spaces
1. **Screen Space**: Mouse/touch event coordinates
2. **Canvas Space**: Logical drawing coordinates (where lines are stored)

#### Transformation Functions Needed
```typescript
// Screen to Canvas (for mouse events)
function screenToCanvas(screenX: number, screenY: number): Pt {
  return {
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale
  };
}

// Canvas to Screen (for UI positioning)
function canvasToScreen(canvasX: number, canvasY: number): Pt {
  return {
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY
  };
}
```

### Zoom Implementation

#### Mouse Wheel Zoom
- **Event**: `onWheel` handler
- **Zoom Factor**: 1.1 per wheel tick (10% zoom in/out)
- **Zoom Center**: Mouse cursor position (zoom toward cursor)
- **Algorithm**:
  1. Get mouse position in canvas space (before zoom)
  2. Apply zoom scale change
  3. Adjust pan offset so mouse position stays fixed

```typescript
// Zoom toward mouse cursor
const mouseCanvasX = (mouseScreenX - offsetX) / oldScale;
const mouseCanvasY = (mouseScreenY - offsetY) / oldScale;

const newScale = oldScale * zoomFactor;

const newOffsetX = mouseScreenX - mouseCanvasX * newScale;
const newOffsetY = mouseScreenY - mouseCanvasY * newScale;
```

#### Zoom Constraints
- **Min Zoom**: 0.1 (10% - see entire drawing)
- **Max Zoom**: 10.0 (1000% - pixel-level detail)
- **Default**: 1.0 (100% - no zoom)

### Pan Implementation

#### Click-and-Drag Panning
- **Trigger**: Middle mouse button OR Space + Left mouse button
- **Mode Detection**: Track pan mode state separately from draw mode
- **Algorithm**:
  1. On pan start: Record initial mouse position and current offset
  2. On pan move: Calculate delta and update offset
  3. On pan end: Clear pan state

#### Pan Constraints
- **Option 1**: No constraints (infinite canvas)
- **Option 2**: Constrain to content bounds with padding
- **Recommendation**: Start with no constraints, add optional bounds later

### Touch Gesture Support

#### Pinch-to-Zoom
- **Detection**: Track two simultaneous touch points
- **Algorithm**:
  1. Calculate initial distance between touches
  2. Calculate current distance between touches
  3. Scale = currentDistance / initialDistance
  4. Zoom center = midpoint between touches

#### Two-Finger Pan
- **Detection**: Two touches moving in same direction
- **Algorithm**: Similar to mouse pan, but use touch midpoint

---

## 3. Comprehensive Implementation Plan

### Phase 1: State Management (30 minutes)

#### New State Variables
```typescript
// Viewport transform state
const [viewportScale, setViewportScale] = useState(1.0);
const [viewportOffset, setViewportOffset] = useState<Pt>({ x: 0, y: 0 });

// Pan interaction state
const [isPanning, setIsPanning] = useState(false);
const [panStart, setPanStart] = useState<Pt | null>(null);
const [panOffsetStart, setPanOffsetStart] = useState<Pt | null>(null);

// Touch gesture state
const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
const [touchStartScale, setTouchStartScale] = useState<number>(1.0);
const [touchStartOffset, setTouchStartOffset] = useState<Pt | null>(null);
```

#### Constants
```typescript
const ZOOM_FACTOR = 1.1;           // 10% per wheel tick
const MIN_ZOOM = 0.1;              // 10% minimum
const MAX_ZOOM = 10.0;             // 1000% maximum
const ZOOM_SENSITIVITY = 0.001;    // For smooth zooming
```

### Phase 2: Coordinate Transformation Functions (20 minutes)

#### File: `src/DrawingCanvas.tsx`
#### Location: After `getPointerPos()` function (around line 33)

```typescript
/**
 * Transform state for viewport
 */
type ViewportTransform = {
  scale: number;
  offset: Pt;
};

/**
 * Convert screen coordinates to canvas coordinates
 * Accounts for viewport zoom and pan
 */
function screenToCanvas(
  screenX: number,
  screenY: number,
  transform: ViewportTransform
): Pt {
  return {
    x: (screenX - transform.offset.x) / transform.scale,
    y: (screenY - transform.offset.y) / transform.scale
  };
}

/**
 * Convert canvas coordinates to screen coordinates
 * Accounts for viewport zoom and pan
 */
function canvasToScreen(
  canvasX: number,
  canvasY: number,
  transform: ViewportTransform
): Pt {
  return {
    x: canvasX * transform.scale + transform.offset.x,
    y: canvasY * transform.scale + transform.offset.y
  };
}

/**
 * Apply viewport transform to canvas context
 * Must be called before any drawing operations
 */
function applyViewportTransform(
  ctx: CanvasRenderingContext2D,
  transform: ViewportTransform,
  dpr: number
): void {
  ctx.setTransform(
    transform.scale * dpr,
    0,
    0,
    transform.scale * dpr,
    transform.offset.x * dpr,
    transform.offset.y * dpr
  );
}
```

### Phase 3: Update `setupHiDPICanvas` Function (15 minutes)

#### Modification Required
The `setupHiDPICanvas` function currently sets a fixed transform. We need to make it accept viewport transform parameters.

```typescript
function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  transform: ViewportTransform
) {
  const dpr = window.devicePixelRatio || 1;
  const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.floor(cssW));
  const h = Math.max(1, Math.floor(cssH));
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    applyViewportTransform(ctx, transform, dpr);
  }
}
```

### Phase 4: Update `render` Function (20 minutes)

#### Modifications Required
1. Apply viewport transform before drawing
2. All drawing operations remain unchanged (automatic transformation)
3. Snap indicators and HUD need special handling

```typescript
const render = useCallback(() => {
  const c = canvasRef.current;
  if (!c) return;
  const ctx = c.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const transform = { scale: viewportScale, offset: viewportOffset };

  // Apply viewport transform
  applyViewportTransform(ctx, transform, dpr);

  // Clear with transform applied
  ctx.clearRect(
    -viewportOffset.x / viewportScale,
    -viewportOffset.y / viewportScale,
    c.width / (viewportScale * dpr),
    c.height / (viewportScale * dpr)
  );

  // Draw lines (coordinates automatically transformed)
  for (const ln of lines) {
    ctx.lineWidth = ln.width;
    ctx.strokeStyle = ln.color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(ln.a.x, ln.a.y);
    ctx.lineTo(ln.b.x, ln.b.y);
    ctx.stroke();

    // Selection highlight
    if (ln.id === selectedId) {
      ctx.lineWidth = ln.width + SELECTION_HIGHLIGHT_WIDTH;
      ctx.strokeStyle = "rgba(37, 99, 235, 0.15)";
      ctx.beginPath();
      ctx.moveTo(ln.a.x, ln.a.y);
      ctx.lineTo(ln.b.x, ln.b.y);
      ctx.stroke();
    }
  }

  // Draw snap indicator (coordinates automatically transformed)
  if (drawingState.snapTarget) {
    ctx.beginPath();
    ctx.arc(
      drawingState.snapTarget.point.x,
      drawingState.snapTarget.point.y,
      SNAP_INDICATOR_RADIUS / viewportScale, // Scale indicator size
      0,
      Math.PI * 2
    );
    ctx.fillStyle = SNAP_INDICATOR_FILL;
    ctx.fill();
    ctx.strokeStyle = SNAP_INDICATOR_COLOR;
    ctx.lineWidth = 2 / viewportScale; // Scale line width
    ctx.stroke();
  }

  // Draw rubber-band preview
  if (isDrawActive && drawingState.phase === 'waiting-for-end' && 
      drawingState.startPoint && drawingState.endPoint) {
    ctx.setLineDash([8 / viewportScale, 6 / viewportScale]); // Scale dash pattern
    ctx.lineWidth = defaultWidth;
    ctx.strokeStyle = "#64748B";
    ctx.beginPath();
    ctx.moveTo(drawingState.startPoint.x, drawingState.startPoint.y);
    ctx.lineTo(drawingState.endPoint.x, drawingState.endPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}, [lines, selectedId, isDrawActive, drawingState, defaultWidth, viewportScale, viewportOffset]);
```

### Phase 5: Update `getPointerPos` Function (15 minutes)

#### Modification Required
Update to account for viewport transformation:

```typescript
function getPointerPos(
  canvas: HTMLCanvasElement,
  evt: PointerEvent | React.PointerEvent,
  transform: ViewportTransform
) {
  const r = canvas.getBoundingClientRect();
  const screenX = evt.clientX - r.left;
  const screenY = evt.clientY - r.top;
  return screenToCanvas(screenX, screenY, transform);
}
```

### Phase 6: Mouse Wheel Zoom Handler (30 minutes)

#### New Event Handler
Add to canvas element and component:

```typescript
const onWheel = useCallback((e: React.WheelEvent) => {
  e.preventDefault(); // Prevent page scroll

  const c = canvasRef.current;
  if (!c) return;

  const rect = c.getBoundingClientRect();
  const mouseScreenX = e.clientX - rect.left;
  const mouseScreenY = e.clientY - rect.top;

  // Calculate zoom direction and factor
  const delta = -e.deltaY;
  const zoomFactor = delta > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

  // Calculate new scale with constraints
  const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewportScale * zoomFactor));

  if (newScale === viewportScale) return; // At zoom limit

  // Get mouse position in canvas space (before zoom)
  const mouseCanvasX = (mouseScreenX - viewportOffset.x) / viewportScale;
  const mouseCanvasY = (mouseScreenY - viewportOffset.y) / viewportScale;

  // Calculate new offset to keep mouse position fixed
  const newOffsetX = mouseScreenX - mouseCanvasX * newScale;
  const newOffsetY = mouseScreenY - mouseCanvasY * newScale;

  setViewportScale(newScale);
  setViewportOffset({ x: newOffsetX, y: newOffsetY });
}, [viewportScale, viewportOffset]);
```

### Phase 7: Pan Interaction Handlers (40 minutes)

#### Pan Mode Detection
```typescript
const shouldEnterPanMode = useCallback((e: React.PointerEvent): boolean => {
  // Middle mouse button
  if (e.button === 1) return true;

  // Space + Left mouse button
  if (e.button === 0 && e.getModifierState('Space')) return true;

  return false;
}, []);
```

#### Updated `onPointerDown` Handler
```typescript
const onPointerDown = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current;
  if (!c) return;

  const transform = { scale: viewportScale, offset: viewportOffset };

  // Check for pan mode
  if (shouldEnterPanMode(e)) {
    e.preventDefault();
    setIsPanning(true);
    const rect = c.getBoundingClientRect();
    setPanStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setPanOffsetStart({ ...viewportOffset });
    c.style.cursor = 'grabbing';
    return;
  }

  c.setPointerCapture(e.pointerId);
  const rawPos = getPointerPos(c, e.nativeEvent as any, transform);

  if (isDrawActive) {
    // Click-click drawing logic
    if (drawingState.phase === 'idle') {
      handleDrawingFirstClick(rawPos);
    } else if (drawingState.phase === 'waiting-for-end') {
      handleDrawingSecondClick();
    }
  } else {
    // Selection mode
    const id = hitTest(rawPos);
    setSelectedId(id);

    if (id) {
      setTimeout(() => {
        const position = calculateHudPosition(id);
        setHudPosition(position);
      }, 0);
    } else {
      setHudPosition(null);
    }

    render();
  }
}, [
  isDrawActive,
  drawingState,
  handleDrawingFirstClick,
  handleDrawingSecondClick,
  hitTest,
  render,
  calculateHudPosition,
  viewportScale,
  viewportOffset,
  shouldEnterPanMode
]);
```

#### Updated `onPointerMove` Handler
```typescript
const onPointerMove = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current;
  if (!c) return;

  const rect = c.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;

  // Handle panning
  if (isPanning && panStart && panOffsetStart) {
    const deltaX = screenX - panStart.x;
    const deltaY = screenY - panStart.y;
    setViewportOffset({
      x: panOffsetStart.x + deltaX,
      y: panOffsetStart.y + deltaY
    });
    return;
  }

  // Only process snapping when in draw mode
  if (!isDrawActive) return;

  const transform = { scale: viewportScale, offset: viewportOffset };
  const cursorPos = screenToCanvas(screenX, screenY, transform);

  // Find and update snap target for visual feedback
  const snap = findSnapTarget(cursorPos, lines);
  drawingState.setSnapTarget(snap);

  // Update draft line endpoint when actively drawing
  const isActivelyDrawing = drawingState.phase === 'waiting-for-end' && drawingState.startPoint;
  if (isActivelyDrawing) {
    const endPos = resolveSnapPoint(cursorPos, snap);
    drawingState.updateEndPoint(endPos, snap);
  }
}, [
  isDrawActive,
  drawingState,
  lines,
  isPanning,
  panStart,
  panOffsetStart,
  viewportScale,
  viewportOffset
]);
```

#### Updated `onPointerUp` Handler
```typescript
const onPointerUp = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current;
  if (!c) return;

  // Handle pan end
  if (isPanning) {
    setIsPanning(false);
    setPanStart(null);
    setPanOffsetStart(null);
    c.style.cursor = isDrawActive ? 'crosshair' : 'default';
    return;
  }

  try {
    c.releasePointerCapture(e.pointerId);
  } catch {}
  // Note: Line creation now happens in onPointerDown (second click)
  // This handler just cleans up pointer capture
}, [isPanning, isDrawActive]);
```

### Phase 8: Touch Gesture Support (45 minutes)

#### Touch Event Handlers
```typescript
const onTouchStart = useCallback((e: React.TouchEvent) => {
  if (e.touches.length === 2) {
    e.preventDefault();

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );

    setTouchStartDistance(distance);
    setTouchStartScale(viewportScale);
    setTouchStartOffset({ ...viewportOffset });
  }
}, [viewportScale, viewportOffset]);

const onTouchMove = useCallback((e: React.TouchEvent) => {
  if (e.touches.length === 2 && touchStartDistance !== null) {
    e.preventDefault();

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );

    const scaleFactor = currentDistance / touchStartDistance;
    const newScale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, touchStartScale * scaleFactor)
    );

    // Calculate midpoint between touches (zoom center)
    const c = canvasRef.current;
    if (!c) return;

    const rect = c.getBoundingClientRect();
    const midX = ((touch1.clientX + touch2.clientX) / 2) - rect.left;
    const midY = ((touch1.clientY + touch2.clientY) / 2) - rect.top;

    // Get midpoint in canvas space
    const midCanvasX = (midX - touchStartOffset!.x) / touchStartScale;
    const midCanvasY = (midY - touchStartOffset!.y) / touchStartScale;

    // Calculate new offset to keep midpoint fixed
    const newOffsetX = midX - midCanvasX * newScale;
    const newOffsetY = midY - midCanvasY * newScale;

    setViewportScale(newScale);
    setViewportOffset({ x: newOffsetX, y: newOffsetY });
  }
}, [touchStartDistance, touchStartScale, touchStartOffset]);

const onTouchEnd = useCallback((e: React.TouchEvent) => {
  if (e.touches.length < 2) {
    setTouchStartDistance(null);
    setTouchStartScale(1.0);
    setTouchStartOffset(null);
  }
}, []);
```

### Phase 9: Update HUD Position Calculation (25 minutes)

#### Modification Required
The `calculateHudPosition` function needs to account for viewport transformation:

```typescript
const calculateHudPosition = useCallback((lineId: string): { x: number; y: number } | null => {
  const line = lines.find(l => l.id === lineId);
  if (!line) return null;

  const canvas = canvasRef.current;
  if (!canvas) return null;

  const hud = hudRef.current;

  // Get canvas bounds (accounts for sidebar)
  const canvasBounds = canvas.getBoundingClientRect();

  // Calculate line midpoint in canvas coordinates
  const midCanvasX = (line.a.x + line.b.x) / 2;
  const midCanvasY = (line.a.y + line.b.y) / 2;

  // Transform to screen coordinates
  const transform = { scale: viewportScale, offset: viewportOffset };
  const midScreen = canvasToScreen(midCanvasX, midCanvasY, transform);

  // Get HUD dimensions
  const hudWidth = hud?.offsetWidth || 450;
  const hudHeight = hud?.offsetHeight || 50;

  // Constants
  const VERTICAL_OFFSET = 16;
  const EDGE_PADDING = 8;
  const LINE_CLEARANCE = (line.width * viewportScale) / 2; // Scale line width

  // Calculate initial position (above line, centered horizontally)
  let x = midScreen.x - hudWidth / 2;
  let y = midScreen.y - LINE_CLEARANCE - VERTICAL_OFFSET - hudHeight;

  // Flip to below if near top edge
  if (y < EDGE_PADDING) {
    y = midScreen.y + LINE_CLEARANCE + VERTICAL_OFFSET;
  }

  // Constrain horizontally
  x = Math.max(EDGE_PADDING, Math.min(x, canvasBounds.width - hudWidth - EDGE_PADDING));

  // Constrain vertically
  y = Math.max(EDGE_PADDING, Math.min(y, canvasBounds.height - hudHeight - EDGE_PADDING));

  return { x, y };
}, [lines, viewportScale, viewportOffset]);
```

### Phase 10: UI Controls (30 minutes)

#### Zoom Controls Component
Add zoom controls to the canvas container:

```typescript
{/* Zoom Controls */}
<div className="absolute top-4 left-4 flex flex-col gap-2 bg-white/95 backdrop-blur rounded-lg shadow-md border border-neutral-200 p-2">
  {/* Zoom In Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.min(MAX_ZOOM, viewportScale * ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors"
    aria-label="Zoom in"
    title="Zoom in (+)"
  >
    <span className="text-lg font-bold text-neutral-700">+</span>
  </button>

  {/* Zoom Level Indicator */}
  <div className="w-8 h-8 flex items-center justify-center">
    <span className="text-xs text-neutral-600 font-medium">
      {Math.round(viewportScale * 100)}%
    </span>
  </div>

  {/* Zoom Out Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.max(MIN_ZOOM, viewportScale / ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors"
    aria-label="Zoom out"
    title="Zoom out (-)"
  >
    <span className="text-lg font-bold text-neutral-700">−</span>
  </button>

  {/* Reset View Button */}
  <button
    type="button"
    onClick={() => {
      setViewportScale(1.0);
      setViewportOffset({ x: 0, y: 0 });
    }}
    className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors border-t border-neutral-200 mt-1 pt-1"
    aria-label="Reset view"
    title="Reset view (1:1)"
  >
    <span className="text-xs text-neutral-700">⊙</span>
  </button>
</div>
```

#### Keyboard Shortcuts
Add to existing keyboard handler:

```typescript
useEffect(() => {
  const h = (e: KeyboardEvent) => {
    // Existing shortcuts...

    // Zoom shortcuts
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setViewportScale(s => Math.min(MAX_ZOOM, s * ZOOM_FACTOR));
    }
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      setViewportScale(s => Math.max(MIN_ZOOM, s / ZOOM_FACTOR));
    }
    if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setViewportScale(1.0);
      setViewportOffset({ x: 0, y: 0 });
    }
  };
  window.addEventListener("keydown", h);
  return () => window.removeEventListener("keydown", h);
}, [/* dependencies */]);
```

---

## 4. Files to Modify

### Primary File
- **`src/DrawingCanvas.tsx`** - Main component file (all changes)

### No New Files Required
All functionality will be added to the existing component.

---

## 5. Implementation Sequence

### Step-by-Step Order

1. **Add Type Definitions** (5 min)
   - Add `ViewportTransform` type
   - Add zoom/pan constants

2. **Add Coordinate Transformation Functions** (20 min)
   - `screenToCanvas()`
   - `canvasToScreen()`
   - `applyViewportTransform()`

3. **Add State Variables** (10 min)
   - Viewport transform state
   - Pan interaction state
   - Touch gesture state

4. **Update `setupHiDPICanvas`** (15 min)
   - Accept transform parameter
   - Apply viewport transform

5. **Update `getPointerPos`** (15 min)
   - Accept transform parameter
   - Use `screenToCanvas()`

6. **Update `render` Function** (20 min)
   - Apply viewport transform
   - Scale visual elements appropriately

7. **Add Mouse Wheel Handler** (30 min)
   - Implement zoom toward cursor
   - Apply zoom constraints

8. **Update Pointer Event Handlers** (40 min)
   - Add pan mode detection
   - Update `onPointerDown`
   - Update `onPointerMove`
   - Update `onPointerUp`

9. **Add Touch Gesture Handlers** (45 min)
   - `onTouchStart`
   - `onTouchMove`
   - `onTouchEnd`

10. **Update `calculateHudPosition`** (25 min)
    - Transform canvas to screen coordinates
    - Scale line width for clearance

11. **Add UI Controls** (30 min)
    - Zoom in/out buttons
    - Zoom level indicator
    - Reset view button

12. **Add Keyboard Shortcuts** (15 min)
    - +/- for zoom
    - Ctrl+0 for reset

13. **Update Canvas Element** (10 min)
    - Add `onWheel` handler
    - Add touch event handlers
    - Prevent default touch behaviors

**Total Estimated Time**: ~4.5 hours

---

## 6. Edge Cases and Considerations

### Coordinate Transformation Edge Cases

1. **HiDPI Displays**
   - Current: `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`
   - Updated: `ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr)`
   - **Issue**: Must multiply both scale and offset by DPR
   - **Solution**: Handled in `applyViewportTransform()`

2. **Snap Detection at Different Zoom Levels**
   - Snap thresholds are in canvas pixels
   - At high zoom, thresholds become very small in screen space
   - **Solution**: Keep thresholds in canvas space (no change needed)

3. **Line Width Rendering**
   - Line widths are stored in canvas pixels
   - Canvas transform automatically scales them
   - **Issue**: Very thin lines at low zoom, very thick at high zoom
   - **Solution**: This is expected behavior (shows actual scale)

### Pan Interaction Edge Cases

1. **Pan During Drawing**
   - User might accidentally trigger pan while drawing
   - **Solution**: Disable pan when `isDrawActive` is true
   - Alternative: Allow pan with specific modifier key only

2. **Pan Mode Cursor**
   - Cursor should change to indicate pan mode
   - **Solution**: Set `cursor: 'grabbing'` during pan

3. **Pan Boundaries**
   - Infinite canvas vs. bounded canvas
   - **Solution**: Start with no boundaries (infinite canvas)
   - Future: Add optional content-based boundaries

### Touch Gesture Edge Cases

1. **Touch vs. Pointer Events**
   - Touch events fire alongside pointer events
   - **Solution**: Use `preventDefault()` in touch handlers
   - Prevent default touch behaviors with CSS: `touch-action: none`

2. **Single Touch During Drawing**
   - Single touch should work for drawing
   - Two touches should trigger zoom/pan
   - **Solution**: Check `e.touches.length` in handlers

3. **Gesture Conflicts**
   - Browser may interpret gestures as page zoom
   - **Solution**: Add `touch-action: none` to canvas CSS

### HUD Positioning Edge Cases

1. **HUD Off-Screen After Zoom**
   - Line might be visible but HUD positioned off-screen
   - **Solution**: Constrain HUD to canvas bounds (already implemented)

2. **HUD Size at Different Zoom Levels**
   - HUD should remain constant size (not scaled)
   - **Solution**: HUD is DOM element, not canvas-drawn (correct)

3. **HUD Position During Pan**
   - HUD should move with line
   - **Solution**: Recalculate on viewport change

### Performance Considerations

1. **Render Performance**
   - Redrawing on every pan/zoom event
   - **Solution**: Use `requestAnimationFrame` for smooth updates
   - Current `render()` is already optimized with `useCallback`

2. **Large Number of Lines**
   - All lines redrawn on every frame
   - **Solution**: Canvas transform is hardware-accelerated
   - Future: Implement viewport culling (only draw visible lines)

3. **Touch Event Throttling**
   - Touch events fire very frequently
   - **Solution**: Consider throttling with `requestAnimationFrame`

---

## 7. Testing Strategy

### Manual Testing Checklist

#### Zoom Functionality
- [ ] Mouse wheel zoom in/out works
- [ ] Zoom centers on mouse cursor position
- [ ] Zoom respects min/max limits (0.1 to 10.0)
- [ ] Zoom buttons work correctly
- [ ] Zoom level indicator shows correct percentage
- [ ] Keyboard shortcuts (+, -, Ctrl+0) work
- [ ] Lines scale correctly at different zoom levels
- [ ] Snap indicators scale appropriately
- [ ] Selection highlights scale correctly

#### Pan Functionality
- [ ] Middle mouse button panning works
- [ ] Space + left mouse button panning works
- [ ] Cursor changes to 'grabbing' during pan
- [ ] Pan is smooth and responsive
- [ ] Pan doesn't interfere with drawing mode
- [ ] Pan doesn't interfere with selection mode

#### Touch Gestures (Tablet Testing)
- [ ] Pinch-to-zoom works smoothly
- [ ] Zoom centers on pinch midpoint
- [ ] Two-finger pan works
- [ ] Single touch still works for drawing
- [ ] No conflicts with browser gestures

#### Coordinate Transformation
- [ ] Drawing works correctly at all zoom levels
- [ ] Line selection works correctly at all zoom levels
- [ ] Snap detection works correctly at all zoom levels
- [ ] HUD positioning is correct at all zoom levels
- [ ] HUD stays on screen when zoomed/panned

#### Edge Cases
- [ ] Zoom in to max limit (1000%)
- [ ] Zoom out to min limit (10%)
- [ ] Pan far from origin
- [ ] Reset view returns to 1:1 at origin
- [ ] Resize window while zoomed/panned
- [ ] HiDPI display rendering is sharp

#### Integration Testing
- [ ] Drawing mode works with zoom/pan
- [ ] Selection mode works with zoom/pan
- [ ] Width editing works with zoom/pan
- [ ] Line deletion works with zoom/pan
- [ ] Sidebar toggle works with zoom/pan
- [ ] Keyboard shortcuts don't conflict

### Automated Testing Considerations

#### Playwright Tests to Add
```typescript
test('zoom in with mouse wheel', async ({ page }) => {
  // Simulate wheel event
  // Verify scale increased
  // Verify lines are larger
});

test('pan with middle mouse button', async ({ page }) => {
  // Simulate middle button drag
  // Verify offset changed
  // Verify lines moved
});

test('reset view button', async ({ page }) => {
  // Zoom and pan
  // Click reset button
  // Verify scale = 1.0 and offset = {0, 0}
});
```

---

## 8. Potential Issues and Solutions

### Issue 1: Performance Degradation with Many Lines

**Problem**: Redrawing all lines on every pan/zoom event may be slow with 100+ lines.

**Solutions**:
1. **Viewport Culling**: Only draw lines within visible viewport
   ```typescript
   function isLineVisible(line: Line, viewport: Rect): boolean {
     // Check if line intersects viewport bounds
   }
   ```
2. **Debouncing**: Only render after pan/zoom settles
3. **Canvas Layers**: Use separate canvas for static content

**Recommendation**: Implement if performance issues arise (not initially).

### Issue 2: Snap Threshold Scaling

**Problem**: Snap thresholds feel different at different zoom levels.

**Current Behavior**: Thresholds are in canvas space (constant in world coordinates).
- At 100% zoom: 20px threshold = 20 screen pixels
- At 200% zoom: 20px threshold = 40 screen pixels (easier to snap)
- At 50% zoom: 20px threshold = 10 screen pixels (harder to snap)

**Solutions**:
1. **Keep Current**: Thresholds in canvas space (easier to snap when zoomed in)
2. **Screen Space Thresholds**: Divide by scale (constant screen pixels)
   ```typescript
   const adjustedThreshold = SNAP_THRESHOLD_ENDPOINT / viewportScale;
   ```

**Recommendation**: Keep current behavior initially, adjust if user feedback indicates issues.

### Issue 3: HUD Flickering During Pan

**Problem**: HUD position recalculates on every pan event, causing flicker.

**Solutions**:
1. **Debounce**: Only update HUD after pan settles
2. **Transform HUD**: Apply CSS transform instead of recalculating position
3. **Hide During Pan**: Hide HUD while panning, show after

**Recommendation**: Monitor during testing, implement debouncing if needed.

### Issue 4: Touch Event Conflicts

**Problem**: Browser may interpret touch gestures as page zoom/scroll.

**Solutions**:
1. **CSS**: Add `touch-action: none` to canvas
2. **preventDefault**: Call in touch event handlers
3. **Meta Tag**: Add viewport meta tag to prevent zoom
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
   ```

**Recommendation**: Implement all three solutions.

### Issue 5: Zoom Accumulation Errors

**Problem**: Repeated zoom operations may accumulate floating-point errors.

**Solutions**:
1. **Snap to Common Scales**: Round to common zoom levels (0.5, 1.0, 2.0, etc.)
2. **Limit Precision**: Round scale to 2 decimal places
3. **Reset Mechanism**: Provide easy way to reset to 1:1

**Recommendation**: Implement precision limiting and reset button.

---

## 9. Future Enhancements

### Phase 2 Features (Not in Initial Implementation)

1. **Fit to Content**
   - Button to zoom/pan to show all lines
   - Calculate bounding box of all lines
   - Set scale and offset to fit

2. **Minimap**
   - Small overview of entire canvas
   - Show current viewport rectangle
   - Click to jump to location

3. **Zoom to Selection**
   - When line selected, button to zoom to that line
   - Center and scale to show line clearly

4. **Pan Boundaries**
   - Optional: Constrain pan to content bounds
   - Prevent panning to empty space
   - Configurable padding around content

5. **Smooth Zoom Animation**
   - Animate scale and offset changes
   - Use `requestAnimationFrame` for smooth transitions
   - Configurable animation duration

6. **Viewport Culling**
   - Only render lines within visible viewport
   - Significant performance improvement for large drawings
   - Calculate viewport bounds in canvas space

7. **Grid Overlay**
   - Optional grid that scales with zoom
   - Helps with alignment and measurement
   - Configurable grid spacing

8. **Zoom Presets**
   - Quick buttons for common zoom levels
   - 25%, 50%, 100%, 200%, 400%
   - Keyboard shortcuts for each

---

## 10. Summary

### What Will Be Implemented

✅ **Mouse Wheel Zoom**
- Zoom in/out with mouse wheel
- Zoom centers on cursor position
- Min/max zoom constraints (10% to 1000%)

✅ **Click-and-Drag Panning**
- Middle mouse button pan
- Space + left mouse button pan
- Smooth pan interaction

✅ **Touch Gestures**
- Pinch-to-zoom (two fingers)
- Two-finger pan
- Tablet-friendly interactions

✅ **UI Controls**
- Zoom in/out buttons
- Zoom level indicator
- Reset view button

✅ **Keyboard Shortcuts**
- `+` / `-` for zoom
- `Ctrl+0` for reset view

✅ **Coordinate Transformation**
- Proper screen-to-canvas conversion
- Canvas-to-screen conversion for HUD
- Maintains drawing accuracy at all zoom levels

### What Will NOT Be Implemented (Initially)

❌ Fit to content button
❌ Minimap
❌ Zoom to selection
❌ Pan boundaries
❌ Smooth zoom animation
❌ Viewport culling
❌ Grid overlay
❌ Zoom presets

### Success Criteria

The implementation will be considered successful when:

1. ✅ User can zoom in/out smoothly with mouse wheel
2. ✅ Zoom centers on mouse cursor position
3. ✅ User can pan by dragging with middle mouse or Space+drag
4. ✅ Tablet users can pinch-to-zoom and two-finger pan
5. ✅ All drawing operations work correctly at any zoom level
6. ✅ Line selection works correctly at any zoom level
7. ✅ Snap detection works correctly at any zoom level
8. ✅ HUD positioning is correct at any zoom level
9. ✅ UI controls provide easy zoom/pan/reset functionality
10. ✅ No performance degradation with typical usage (< 100 lines)

### Estimated Implementation Time

- **Core Functionality**: 3.5 hours
- **Testing & Refinement**: 1 hour
- **Total**: ~4.5 hours

---

## 11. Implementation Notes

### Important Considerations

1. **Preserve Existing Functionality**
   - All current drawing features must continue to work
   - No breaking changes to existing interactions
   - Zoom/pan should feel like a natural addition

2. **Performance First**
   - Use hardware-accelerated canvas transforms
   - Minimize state updates during pan/zoom
   - Leverage `useCallback` and `useMemo` appropriately

3. **User Experience**
   - Zoom should feel smooth and predictable
   - Pan should be intuitive and responsive
   - Touch gestures should work naturally on tablets

4. **Code Quality**
   - Follow existing code patterns and style
   - Add comprehensive comments for complex logic
   - Use TypeScript types for all new functions

5. **Testing**
   - Test on multiple browsers (Chrome, Firefox, Safari)
   - Test on HiDPI displays
   - Test on tablets with touch support
   - Test with various numbers of lines (1, 10, 50, 100+)

### Development Workflow

1. Create a new branch: `feature/zoom-pan`
2. Implement changes incrementally (follow phase order)
3. Test each phase before moving to next
4. Commit frequently with descriptive messages
5. Create PR when all phases complete
6. Conduct thorough testing before merge

---

**End of Implementation Plan**


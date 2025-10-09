# Zoom and Pan - Final Comprehensive Implementation Plan

## Overview

This is the final, approved implementation plan incorporating the following requirements:
1. ✅ Create a bottom bar for view controls
2. ✅ Place zoom controls inside the bottom bar
3. ✅ Use **right-click** for click-and-drag pan (instead of middle mouse or Space+drag)
4. ✅ All other features from original research

---

## 1. Bottom Bar Design Specification

### Visual Layout
```
┌─────────────────────────────────────────────────────────────┐
│                     Canvas Area                              │
│                                                              │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Bottom Bar (Fixed, 60px height)                            │
│  ┌────────────┐  ┌──────────────────┐  ┌────────────┐      │
│  │ Zoom Out   │  │  Zoom: 100%      │  │ Zoom In    │      │
│  │    (−)     │  │  [Reset View]    │  │    (+)     │      │
│  └────────────┘  └──────────────────┘  └────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Bottom Bar Specifications
- **Height**: 60px
- **Position**: Fixed at bottom of viewport
- **Background**: White with subtle shadow
- **Border**: Top border (neutral-200)
- **Layout**: Flexbox, centered content
- **Z-index**: 10 (above canvas, below modals)

### Control Layout
```
[Zoom Out Button] [Zoom Indicator + Reset Button] [Zoom In Button]
      (−)              100% [Reset View]                (+)
```

---

## 2. Updated Pan Interaction

### Right-Click Pan (New Requirement)
- **Trigger**: Right mouse button (button === 2)
- **Behavior**: Click and drag to pan
- **Cursor**: Changes to 'grabbing' during pan
- **Context Menu**: Prevented with `e.preventDefault()`

### Removed Pan Methods
- ❌ Middle mouse button (removed)
- ❌ Space + left mouse button (removed)

### Updated Pan Detection
```typescript
const shouldEnterPanMode = useCallback((e: React.PointerEvent): boolean => {
  // Right mouse button only
  return e.button === 2;
}, []);
```

---

## 3. Implementation Phases (Updated)

### Phase 1: Create Bottom Bar Component (45 minutes)

#### File: `src/DrawingCanvas.tsx`
#### Location: Inside main component return, after sidebar

```typescript
{/* Bottom Bar - View Controls */}
<div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-neutral-200 shadow-lg z-10 flex items-center justify-center gap-4">
  {/* Zoom Out Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.max(MIN_ZOOM, viewportScale / ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    disabled={viewportScale <= MIN_ZOOM}
    className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    aria-label="Zoom out"
    title="Zoom out (or press -)"
  >
    <span className="text-2xl font-bold text-neutral-700">−</span>
  </button>

  {/* Zoom Indicator and Reset Button */}
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-neutral-300 bg-neutral-50">
    <span className="text-sm font-medium text-neutral-700 min-w-[60px] text-center tabular-nums">
      Zoom: {Math.round(viewportScale * 100)}%
    </span>
    <button
      type="button"
      onClick={() => {
        setViewportScale(1.0);
        setViewportOffset({ x: 0, y: 0 });
      }}
      className="px-3 py-1 text-sm font-medium text-white bg-[var(--tech-blue-600)] hover:bg-[var(--tech-blue-700)] rounded transition-colors"
      aria-label="Reset view to 100%"
      title="Reset view (Ctrl+0)"
    >
      Reset View
    </button>
  </div>

  {/* Zoom In Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.min(MAX_ZOOM, viewportScale * ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    disabled={viewportScale >= MAX_ZOOM}
    className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    aria-label="Zoom in"
    title="Zoom in (or press +)"
  >
    <span className="text-2xl font-bold text-neutral-700">+</span>
  </button>
</div>
```

#### Update Canvas Container
```typescript
{/* Canvas Container - Adjust for bottom bar */}
<div
  ref={containerRef}
  className="flex-1 relative overflow-hidden"
  style={{ 
    width: `calc(100% - ${sidebarWidth}px)`,
    height: 'calc(100vh - 60px)' // Subtract bottom bar height
  }}
>
  {/* Canvas and other content */}
</div>
```

### Phase 2: Add State Variables (30 minutes)

```typescript
// Viewport transform state
const [viewportScale, setViewportScale] = useState(1.0);
const [viewportOffset, setViewportOffset] = useState<Pt>({ x: 0, y: 0 });

// Pan interaction state (right-click only)
const [isPanning, setIsPanning] = useState(false);
const [panStart, setPanStart] = useState<Pt | null>(null);
const [panOffsetStart, setPanOffsetStart] = useState<Pt | null>(null);

// Touch gesture state
const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
const [touchStartScale, setTouchStartScale] = useState(1.0);
const [touchStartOffset, setTouchStartOffset] = useState<Pt | null>(null);
```

#### Constants
```typescript
const ZOOM_FACTOR = 1.1;           // 10% per wheel tick
const MIN_ZOOM = 0.1;              // 10% minimum
const MAX_ZOOM = 10.0;             // 1000% maximum
```

### Phase 3: Coordinate Transformation Functions (20 minutes)

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

### Phase 4: Update setupHiDPICanvas (15 minutes)

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

### Phase 5: Update getPointerPos (15 minutes)

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

### Phase 6: Update render Function (20 minutes)

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

  // Draw snap indicator (scale size appropriately)
  if (drawingState.snapTarget) {
    ctx.beginPath();
    ctx.arc(
      drawingState.snapTarget.point.x,
      drawingState.snapTarget.point.y,
      SNAP_INDICATOR_RADIUS / viewportScale,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = SNAP_INDICATOR_FILL;
    ctx.fill();
    ctx.strokeStyle = SNAP_INDICATOR_COLOR;
    ctx.lineWidth = 2 / viewportScale;
    ctx.stroke();
  }

  // Draw rubber-band preview
  if (isDrawActive && drawingState.phase === 'waiting-for-end' && 
      drawingState.startPoint && drawingState.endPoint) {
    ctx.setLineDash([8 / viewportScale, 6 / viewportScale]);
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

### Phase 7: Mouse Wheel Zoom Handler (30 minutes)

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

### Phase 8: Right-Click Pan Handlers (40 minutes)

#### Pan Mode Detection (Right-Click Only)
```typescript
const shouldEnterPanMode = useCallback((e: React.PointerEvent): boolean => {
  // Right mouse button only (button === 2)
  return e.button === 2;
}, []);
```

#### Prevent Context Menu
```typescript
const onContextMenu = useCallback((e: React.MouseEvent) => {
  e.preventDefault(); // Prevent right-click context menu
}, []);
```

#### Updated onPointerDown Handler
```typescript
const onPointerDown = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current;
  if (!c) return;

  const transform = { scale: viewportScale, offset: viewportOffset };

  // Check for pan mode (right-click)
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

#### Updated onPointerMove Handler
```typescript
const onPointerMove = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current;
  if (!c) return;

  const rect = c.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;

  // Handle panning (right-click drag)
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

#### Updated onPointerUp Handler
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

### Phase 9: Touch Gesture Support (45 minutes)

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

### Phase 10: Update HUD Positioning (25 minutes)

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

  // Constrain vertically (account for bottom bar)
  const maxY = canvasBounds.height - hudHeight - EDGE_PADDING - 60; // 60px for bottom bar
  y = Math.max(EDGE_PADDING, Math.min(y, maxY));

  return { x, y };
}, [lines, viewportScale, viewportOffset]);
```

### Phase 11: Keyboard Shortcuts (15 minutes)

```typescript
useEffect(() => {
  const h = (e: KeyboardEvent) => {
    // Existing shortcuts...
    if (e.key.toLowerCase() === "d") setIsDrawActive(v => !v);

    if (e.key === "Escape" && drawingState.phase === 'waiting-for-end') {
      drawingState.reset();
    }

    if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
      e.preventDefault();
      deleteLine(selectedId);
    }

    if (selectedId) {
      if (e.key === "[") updateSelectedWidth(w => Math.max(1, w - 1));
      if (e.key === "]") updateSelectedWidth(w => Math.min(60, w + 1));
    } else if (isDrawActive) {
      if (e.key === "[") setDefaultWidth(w => Math.max(1, w - 1));
      if (e.key === "]") setDefaultWidth(w => Math.min(60, w + 1));
    }

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
}, [isDrawActive, selectedId, drawingState, deleteLine, updateSelectedWidth, setDefaultWidth]);
```

### Phase 12: Update Canvas Element (10 minutes)

```typescript
<canvas
  ref={canvasRef}
  className={`absolute inset-0 bg-white ${isDrawActive ? "cursor-crosshair" : "cursor-default"}`}
  onPointerDown={onPointerDown}
  onPointerMove={onPointerMove}
  onPointerUp={onPointerUp}
  onPointerCancel={onPointerUp}
  onWheel={onWheel}
  onContextMenu={onContextMenu}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  style={{ touchAction: 'none' }}
  aria-label="Drawing canvas"
  role="img"
/>
```

### Phase 13: Update useEffect for setupHiDPICanvas (10 minutes)

```typescript
useEffect(() => {
  const c = canvasRef.current, container = containerRef.current;
  if (!c || !container) return;

  const transform = { scale: viewportScale, offset: viewportOffset };
  setupHiDPICanvas(c, transform);

  const ro = new ResizeObserver(() => {
    setupHiDPICanvas(c, transform);
    render();
  });
  ro.observe(container);
  return () => ro.disconnect();
}, [viewportScale, viewportOffset, render]);
```

### Phase 14: Testing & Refinement (60 minutes)

---

## 4. Complete Bottom Bar Component Code

```typescript
{/* Bottom Bar - View Controls */}
<div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center gap-4">
  {/* Zoom Out Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.max(MIN_ZOOM, viewportScale / ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    disabled={viewportScale <= MIN_ZOOM}
    className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tech-blue-600)]"
    aria-label="Zoom out"
    title="Zoom out (or press -)"
  >
    <span className="text-2xl font-bold text-neutral-700">−</span>
  </button>

  {/* Zoom Indicator and Reset Button */}
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-neutral-300 bg-neutral-50">
    <span className="text-sm font-medium text-neutral-700 min-w-[70px] text-center tabular-nums">
      Zoom: {Math.round(viewportScale * 100)}%
    </span>
    <button
      type="button"
      onClick={() => {
        setViewportScale(1.0);
        setViewportOffset({ x: 0, y: 0 });
      }}
      className="px-3 py-1.5 text-sm font-medium text-white bg-[var(--tech-blue-600)] hover:bg-[var(--tech-blue-700)] rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tech-blue-300)]"
      aria-label="Reset view to 100%"
      title="Reset view (Ctrl+0)"
    >
      Reset View
    </button>
  </div>

  {/* Zoom In Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.min(MAX_ZOOM, viewportScale * ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    disabled={viewportScale >= MAX_ZOOM}
    className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tech-blue-600)]"
    aria-label="Zoom in"
    title="Zoom in (or press +)"
  >
    <span className="text-2xl font-bold text-neutral-700">+</span>
  </button>

  {/* Pan Instruction (Optional) */}
  <div className="ml-8 text-xs text-neutral-500">
    Right-click + drag to pan
  </div>
</div>
```

---

## 5. Updated Layout Structure

```typescript
return (
  <div className="fixed inset-0 w-screen h-screen overflow-hidden flex">
    <TechBlueTokens />

    {/* Canvas Container - Adjusted for bottom bar */}
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{
        width: `calc(100% - ${sidebarWidth}px)`,
        height: 'calc(100vh - 60px)' // Subtract bottom bar height
      }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 bg-white ${isDrawActive ? "cursor-crosshair" : "cursor-default"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'none' }}
        aria-label="Drawing canvas"
        role="img"
      />

      {/* HUD and FAB remain the same */}
      {selectedId && hudPosition && (
        <div ref={hudRef} /* ... HUD code ... */ />
      )}

      <button /* ... FAB code ... */ />
    </div>

    {/* Sidebar Toggle Button */}
    <button /* ... sidebar toggle ... */ />

    {/* Sidebar */}
    {!sidebarCollapsed && (
      <div /* ... sidebar code ... */ />
    )}

    {/* Bottom Bar - NEW */}
    <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center gap-4">
      {/* Bottom bar controls */}
    </div>
  </div>
);
```

---

## 6. Implementation Timeline

| Phase | Task | Time | Total |
|-------|------|------|-------|
| 1 | Create Bottom Bar Component | 45 min | 0:45 |
| 2 | Add State Variables | 30 min | 1:15 |
| 3 | Coordinate Transform Functions | 20 min | 1:35 |
| 4 | Update setupHiDPICanvas | 15 min | 1:50 |
| 5 | Update getPointerPos | 15 min | 2:05 |
| 6 | Update render Function | 20 min | 2:25 |
| 7 | Mouse Wheel Zoom Handler | 30 min | 2:55 |
| 8 | Right-Click Pan Handlers | 40 min | 3:35 |
| 9 | Touch Gesture Support | 45 min | 4:20 |
| 10 | Update HUD Positioning | 25 min | 4:45 |
| 11 | Keyboard Shortcuts | 15 min | 5:00 |
| 12 | Update Canvas Element | 10 min | 5:10 |
| 13 | Update useEffect | 10 min | 5:20 |
| 14 | Testing & Refinement | 60 min | 6:20 |
| **TOTAL** | | **6 hours 20 minutes** | |

---

## 7. Key Changes from Original Plan

### ✅ Added
1. **Bottom Bar Component** - Fixed 60px height bar at bottom
2. **View Controls in Bottom Bar** - Zoom buttons, indicator, reset button
3. **Right-Click Pan** - Changed from middle mouse/Space+drag to right-click only
4. **Context Menu Prevention** - Added `onContextMenu` handler
5. **Canvas Height Adjustment** - Reduced by 60px to accommodate bottom bar
6. **HUD Constraint Update** - Account for bottom bar in positioning

### ❌ Removed
1. **Top-Left Zoom Controls** - Moved to bottom bar
2. **Middle Mouse Pan** - Replaced with right-click
3. **Space + Left Mouse Pan** - Removed

---

## 8. Testing Checklist

### Bottom Bar
- [ ] Bottom bar displays correctly at bottom of viewport
- [ ] Bottom bar has proper styling (shadow, border)
- [ ] Zoom out button works and disables at min zoom
- [ ] Zoom in button works and disables at max zoom
- [ ] Zoom indicator shows correct percentage
- [ ] Reset button returns to 100% zoom and origin
- [ ] Bottom bar doesn't overlap with canvas content
- [ ] Bottom bar stays fixed during scroll (if any)

### Right-Click Pan
- [ ] Right-click initiates pan mode
- [ ] Cursor changes to 'grabbing' during pan
- [ ] Pan is smooth and responsive
- [ ] Context menu is prevented
- [ ] Pan doesn't interfere with drawing mode
- [ ] Pan doesn't interfere with selection mode
- [ ] Pan works correctly at all zoom levels

### Integration
- [ ] Canvas height is correctly reduced by 60px
- [ ] HUD positioning accounts for bottom bar
- [ ] FAB button positioning is correct
- [ ] Sidebar toggle works with bottom bar
- [ ] All existing features still work

### All Other Features
- [ ] Mouse wheel zoom (same as before)
- [ ] Touch gestures (same as before)
- [ ] Keyboard shortcuts (same as before)
- [ ] Drawing at all zoom levels
- [ ] Selection at all zoom levels
- [ ] Snap detection at all zoom levels

---

## 9. Files to Modify

### Single File
- **`src/DrawingCanvas.tsx`** - All changes in this file

### No New Files
- ✅ No new files to create
- ✅ No new dependencies to install

---

## 10. Success Criteria

### Functional
- ✅ Bottom bar displays with zoom controls
- ✅ Right-click pan works smoothly
- ✅ Mouse wheel zoom works
- ✅ Touch gestures work on tablets
- ✅ Keyboard shortcuts work
- ✅ All UI controls work correctly

### Visual
- ✅ Bottom bar has professional appearance
- ✅ Controls are clearly labeled
- ✅ Zoom percentage is easy to read
- ✅ Layout is balanced and clean

### Integration
- ✅ No breaking changes to existing features
- ✅ Canvas height properly adjusted
- ✅ HUD positioning correct
- ✅ All interactions work at all zoom levels

---

**End of Final Implementation Plan**


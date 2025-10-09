# Zoom and Pan - Quick Reference Guide

## Essential Formulas

### Coordinate Transformation
```typescript
// Screen to Canvas (for mouse events)
canvasX = (screenX - offsetX) / scale
canvasY = (screenY - offsetY) / scale

// Canvas to Screen (for UI positioning)
screenX = canvasX * scale + offsetX
screenY = canvasY * scale + offsetY
```

### Canvas Transform
```typescript
ctx.setTransform(
  scale * dpr,      // horizontal scaling
  0,                // horizontal skewing (none)
  0,                // vertical skewing (none)
  scale * dpr,      // vertical scaling
  offsetX * dpr,    // horizontal translation
  offsetY * dpr     // vertical translation
);
```

### Zoom Toward Cursor
```typescript
// 1. Get cursor position in canvas space (before zoom)
const cursorCanvasX = (cursorScreenX - oldOffsetX) / oldScale;
const cursorCanvasY = (cursorScreenY - oldOffsetY) / oldScale;

// 2. Apply new scale
const newScale = oldScale * zoomFactor;

// 3. Calculate new offset to keep cursor fixed
const newOffsetX = cursorScreenX - cursorCanvasX * newScale;
const newOffsetY = cursorScreenY - cursorCanvasY * newScale;
```

### Pinch-to-Zoom
```typescript
// Calculate distance between two touches
const distance = Math.hypot(
  touch2.clientX - touch1.clientX,
  touch2.clientY - touch1.clientY
);

// Calculate scale factor
const scaleFactor = currentDistance / initialDistance;
const newScale = initialScale * scaleFactor;

// Calculate midpoint (zoom center)
const midX = (touch1.clientX + touch2.clientX) / 2;
const midY = (touch1.clientY + touch2.clientY) / 2;
```

---

## Key Constants

```typescript
const ZOOM_FACTOR = 1.1;           // 10% per wheel tick
const MIN_ZOOM = 0.1;              // 10% minimum
const MAX_ZOOM = 10.0;             // 1000% maximum
const ZOOM_SENSITIVITY = 0.001;    // For smooth zooming
```

---

## State Variables

```typescript
// Viewport transform
const [viewportScale, setViewportScale] = useState(1.0);
const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });

// Pan interaction
const [isPanning, setIsPanning] = useState(false);
const [panStart, setPanStart] = useState<Pt | null>(null);
const [panOffsetStart, setPanOffsetStart] = useState<Pt | null>(null);

// Touch gestures
const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
const [touchStartScale, setTouchStartScale] = useState(1.0);
const [touchStartOffset, setTouchStartOffset] = useState<Pt | null>(null);
```

---

## Core Functions

### Transform Functions
```typescript
type ViewportTransform = {
  scale: number;
  offset: Pt;
};

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

---

## Event Handlers

### Mouse Wheel Zoom
```typescript
const onWheel = useCallback((e: React.WheelEvent) => {
  e.preventDefault();
  
  const c = canvasRef.current;
  if (!c) return;
  
  const rect = c.getBoundingClientRect();
  const mouseScreenX = e.clientX - rect.left;
  const mouseScreenY = e.clientY - rect.top;
  
  const delta = -e.deltaY;
  const zoomFactor = delta > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
  
  const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewportScale * zoomFactor));
  
  if (newScale === viewportScale) return;
  
  const mouseCanvasX = (mouseScreenX - viewportOffset.x) / viewportScale;
  const mouseCanvasY = (mouseScreenY - viewportOffset.y) / viewportScale;
  
  const newOffsetX = mouseScreenX - mouseCanvasX * newScale;
  const newOffsetY = mouseScreenY - mouseCanvasY * newScale;
  
  setViewportScale(newScale);
  setViewportOffset({ x: newOffsetX, y: newOffsetY });
}, [viewportScale, viewportOffset]);
```

### Pan Detection
```typescript
const shouldEnterPanMode = useCallback((e: React.PointerEvent): boolean => {
  if (e.button === 1) return true; // Middle mouse button
  if (e.button === 0 && e.getModifierState('Space')) return true; // Space + Left
  return false;
}, []);
```

### Touch Gestures
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
```

---

## Keyboard Shortcuts

```typescript
useEffect(() => {
  const h = (e: KeyboardEvent) => {
    // Zoom in
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setViewportScale(s => Math.min(MAX_ZOOM, s * ZOOM_FACTOR));
    }
    
    // Zoom out
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      setViewportScale(s => Math.max(MIN_ZOOM, s / ZOOM_FACTOR));
    }
    
    // Reset view
    if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setViewportScale(1.0);
      setViewportOffset({ x: 0, y: 0 });
    }
  };
  window.addEventListener("keydown", h);
  return () => window.removeEventListener("keydown", h);
}, []);
```

---

## UI Controls

```typescript
{/* Zoom In */}
<button onClick={() => setViewportScale(s => Math.min(MAX_ZOOM, s * ZOOM_FACTOR))}>
  +
</button>

{/* Zoom Out */}
<button onClick={() => setViewportScale(s => Math.max(MIN_ZOOM, s / ZOOM_FACTOR))}>
  −
</button>

{/* Zoom Indicator */}
<span>{Math.round(viewportScale * 100)}%</span>

{/* Reset View */}
<button onClick={() => {
  setViewportScale(1.0);
  setViewportOffset({ x: 0, y: 0 });
}}>
  Reset
</button>
```

---

## Canvas Element Setup

```typescript
<canvas
  ref={canvasRef}
  onPointerDown={onPointerDown}
  onPointerMove={onPointerMove}
  onPointerUp={onPointerUp}
  onPointerCancel={onPointerUp}
  onWheel={onWheel}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  style={{ touchAction: 'none' }}
  aria-label="Drawing canvas"
  role="img"
/>
```

---

## Common Patterns

### Update Existing Function to Use Transform
```typescript
// Before
const pos = getPointerPos(canvas, event);

// After
const transform = { scale: viewportScale, offset: viewportOffset };
const pos = getPointerPos(canvas, event, transform);
```

### Scale Visual Elements
```typescript
// Before
ctx.lineWidth = 2;
ctx.arc(x, y, 7, 0, Math.PI * 2);

// After
ctx.lineWidth = 2 / viewportScale;
ctx.arc(x, y, 7 / viewportScale, 0, Math.PI * 2);
```

### Clear Transformed Canvas
```typescript
// Before
ctx.clearRect(0, 0, canvas.width, canvas.height);

// After
ctx.clearRect(
  -viewportOffset.x / viewportScale,
  -viewportOffset.y / viewportScale,
  canvas.width / (viewportScale * dpr),
  canvas.height / (viewportScale * dpr)
);
```

---

## Debugging Tips

### Check Transform State
```typescript
console.log('Scale:', viewportScale);
console.log('Offset:', viewportOffset);
console.log('Transform:', ctx.getTransform());
```

### Verify Coordinate Transformation
```typescript
const screenPt = { x: 100, y: 100 };
const canvasPt = screenToCanvas(screenPt.x, screenPt.y, transform);
const backToScreen = canvasToScreen(canvasPt.x, canvasPt.y, transform);
console.log('Original:', screenPt);
console.log('Canvas:', canvasPt);
console.log('Back to screen:', backToScreen);
// backToScreen should equal screenPt
```

### Visualize Viewport Bounds
```typescript
const viewportBounds = {
  left: -viewportOffset.x / viewportScale,
  top: -viewportOffset.y / viewportScale,
  right: (canvas.width / dpr - viewportOffset.x) / viewportScale,
  bottom: (canvas.height / dpr - viewportOffset.y) / viewportScale
};
console.log('Viewport bounds (canvas space):', viewportBounds);
```

---

## Testing Checklist

### Basic Functionality
- [ ] Mouse wheel zoom in/out
- [ ] Zoom centers on cursor
- [ ] Middle mouse button pan
- [ ] Space + left mouse pan
- [ ] Pinch-to-zoom on tablet
- [ ] Two-finger pan on tablet

### Integration
- [ ] Drawing works at all zoom levels
- [ ] Selection works at all zoom levels
- [ ] Snap detection works at all zoom levels
- [ ] HUD positioning correct at all zoom levels

### Edge Cases
- [ ] Zoom to min limit (10%)
- [ ] Zoom to max limit (1000%)
- [ ] Pan far from origin
- [ ] Resize window while zoomed
- [ ] HiDPI display rendering

### UI Controls
- [ ] Zoom in button
- [ ] Zoom out button
- [ ] Zoom indicator shows correct %
- [ ] Reset button returns to 1:1

### Keyboard Shortcuts
- [ ] `+` zooms in
- [ ] `-` zooms out
- [ ] `Ctrl+0` resets view

---

## Performance Optimization

### If Performance Issues Arise

1. **Viewport Culling**
   ```typescript
   function isLineVisible(line: Line, viewport: Rect): boolean {
     // Check if line intersects viewport
     return lineIntersectsRect(line, viewport);
   }
   
   // In render:
   for (const line of lines) {
     if (!isLineVisible(line, viewportBounds)) continue;
     // Draw line
   }
   ```

2. **Debounced Rendering**
   ```typescript
   const debouncedRender = useMemo(
     () => debounce(render, 16), // ~60fps
     [render]
   );
   ```

3. **RequestAnimationFrame**
   ```typescript
   const rafId = useRef<number>();
   
   const scheduleRender = useCallback(() => {
     if (rafId.current) cancelAnimationFrame(rafId.current);
     rafId.current = requestAnimationFrame(render);
   }, [render]);
   ```

---

**End of Quick Reference**


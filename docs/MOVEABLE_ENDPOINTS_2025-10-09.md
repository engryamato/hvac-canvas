# Moveable Line Endpoints Feature

**Date:** 2025-10-09  
**Status:** ✅ Completed

---

## Overview

Implemented the ability to drag and move both endpoints of any line in the drawing canvas. Users can now click and drag either endpoint of a selected line to reposition it, with full snap support to connect to other lines.

---

## Features

### 1. **Visual Endpoint Handles**

When a line is selected, both endpoints are marked with circular handles:
- **White fill** with **blue border** (#3b82f6)
- **6px radius** (scales with viewport zoom)
- **2px stroke width** (scales with viewport zoom)
- Clearly indicates which points can be dragged

### 2. **Endpoint Detection**

- **15px threshold** for detecting endpoint clicks
- Prioritizes the closest endpoint if both are nearby
- Works in selection mode (not draw mode)

### 3. **Drag Interaction**

- Click on an endpoint handle to start dragging
- Cursor changes to `move` during drag
- Endpoint follows the mouse/pointer in real-time
- Line updates dynamically as you drag

### 4. **Snap Support**

- Full snap functionality while dragging endpoints
- Snaps to:
  - Other line endpoints (20px threshold)
  - Line midpoints (18px threshold)
  - Points along lines (15px threshold)
- Excludes the line being edited from snap targets
- Visual snap indicator shows when snapping

### 5. **HUD Update**

- Width HUD automatically updates position after endpoint drag
- Measurements update in real-time
- Sidebar line summary updates automatically

---

## Technical Implementation

### State Management

Added new state for tracking endpoint dragging:

```typescript
const [draggingEndpoint, setDraggingEndpoint] = useState<{
  lineId: string;
  endpoint: 'a' | 'b';
} | null>(null);
```

### Endpoint Detection Function

```typescript
const hitTestEndpoint = useCallback((p: Pt, lineId: string): 'a' | 'b' | null => {
  const line = lines.find(ln => ln.id === lineId);
  if (!line) return null;

  const ENDPOINT_THRESHOLD = 15; // pixels
  const distToA = dist(p, line.a);
  const distToB = dist(p, line.b);

  if (distToA <= ENDPOINT_THRESHOLD && distToA <= distToB) return 'a';
  if (distToB <= ENDPOINT_THRESHOLD) return 'b';
  return null;
}, [lines]);
```

### Pointer Event Handlers

#### onPointerDown
- Checks if clicking on a line
- If yes, checks if clicking near an endpoint
- If near endpoint: starts drag mode
- If not: regular selection

```typescript
if (id) {
  const endpoint = hitTestEndpoint(rawPos, id);
  
  if (endpoint) {
    setDraggingEndpoint({ lineId: id, endpoint });
    setSelectedId(id);
    c.style.cursor = 'move';
  } else {
    // Regular selection
    setSelectedId(id);
    const position = calculateHudPosition(id);
    setHudPosition(position);
  }
}
```

#### onPointerMove
- Detects if in drag mode
- Finds snap targets (excluding the line being edited)
- Updates the endpoint position in real-time

```typescript
if (draggingEndpoint) {
  const { lineId, endpoint } = draggingEndpoint;
  
  const snap = findSnapTarget(cursorPos, lines, lineId);
  const newPos = resolveSnapPoint(cursorPos, snap);
  
  setLines(prev => prev.map(line => {
    if (line.id !== lineId) return line;
    return {
      ...line,
      [endpoint]: newPos
    };
  }));
  
  return;
}
```

#### onPointerUp
- Ends drag mode
- Resets cursor
- Updates HUD position for the modified line

```typescript
if (draggingEndpoint) {
  const { lineId } = draggingEndpoint;
  setDraggingEndpoint(null);
  c.style.cursor = isDrawActive ? 'crosshair' : 'default';
  
  const position = calculateHudPosition(lineId);
  setHudPosition(position);
  
  return;
}
```

### Rendering Endpoint Handles

Added to the render function when a line is selected:

```typescript
if (ln.id === selectedId) {
  // ... existing selection highlight ...

  // Draw endpoint handles
  const ENDPOINT_RADIUS = 6 / viewportScale;
  const ENDPOINT_STROKE_WIDTH = 2 / viewportScale;
  
  // Endpoint A
  ctx.beginPath();
  ctx.arc(ln.a.x, ln.a.y, ENDPOINT_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = ENDPOINT_STROKE_WIDTH;
  ctx.stroke();
  
  // Endpoint B (same pattern)
  // ...
}
```

---

## User Experience

### How to Use

1. **Select a line** by clicking on it (not in draw mode)
2. **See endpoint handles** appear as white circles with blue borders
3. **Click and drag** either endpoint to move it
4. **Release** to finish moving
5. **Snap to other lines** automatically while dragging

### Visual Feedback

- ✅ Endpoint handles clearly visible on selected lines
- ✅ Cursor changes to `move` when dragging
- ✅ Line updates in real-time during drag
- ✅ Snap indicator shows when near snap targets
- ✅ HUD updates after drag completes

### Interaction Priority

1. **Right-click drag** → Pan (highest priority)
2. **Endpoint drag** → Move endpoint (when clicking near endpoint)
3. **Line selection** → Select line (when clicking on line body)
4. **Draw mode** → Create new lines (when draw mode active)

---

## Benefits

1. **Precision Editing:** Easily adjust line connections without redrawing
2. **Snap Support:** Automatically connects to other lines
3. **Visual Clarity:** Clear handles show what can be dragged
4. **Intuitive:** Familiar drag-and-drop interaction
5. **Non-destructive:** Doesn't affect line width or other properties
6. **Real-time Feedback:** See changes as you drag

---

## Files Modified

1. **`src/DrawingCanvas.tsx`**
   - Added `draggingEndpoint` state
   - Added `hitTestEndpoint` function
   - Updated `onPointerDown` to detect endpoint clicks
   - Updated `onPointerMove` to handle endpoint dragging
   - Updated `onPointerUp` to finish drag and update HUD
   - Added endpoint handle rendering in render function

---

## Testing

All existing tests continue to pass:
- ✅ 45 component tests
- ✅ No breaking changes
- ✅ All functionality preserved

---

## Future Enhancements

1. **Multi-select:** Drag multiple endpoints at once
2. **Constraints:** Hold Shift for horizontal/vertical constraints
3. **Undo/Redo:** Track endpoint movements for undo
4. **Keyboard nudging:** Arrow keys to fine-tune endpoint positions
5. **Endpoint snapping toggle:** Disable snapping with a modifier key

---

## Usage Example

```typescript
// User workflow:
1. Click on a line to select it
   → Endpoint handles appear

2. Click and drag an endpoint
   → Cursor changes to 'move'
   → Line follows the cursor
   → Snaps to nearby lines automatically

3. Release mouse button
   → Endpoint position is saved
   → HUD updates to new position
   → Measurements update in sidebar
```

---

## Summary

The moveable endpoints feature provides a professional-grade editing experience for HVAC drawings. Users can now easily adjust line connections with precision, leveraging the existing snap system for accurate alignment. The implementation is clean, performant, and integrates seamlessly with existing features.

**Live at:** http://localhost:5173/

Try it out:
1. Draw a few lines
2. Select a line
3. Drag the endpoint handles to reposition them
4. Watch them snap to other lines automatically! 🎯


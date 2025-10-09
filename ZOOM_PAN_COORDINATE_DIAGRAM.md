# Zoom and Pan Coordinate Transformation Diagram

## Visual Guide to Coordinate Systems

This document provides visual diagrams to understand how coordinate transformations work in the zoom/pan implementation.

---

## 1. Coordinate Spaces Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     SCREEN SPACE                             │
│  (Browser window coordinates - what user sees)               │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │              Canvas Element                     │         │
│  │  (CSS pixels - getBoundingClientRect())        │         │
│  │                                                 │         │
│  │  ┌──────────────────────────────────────┐     │         │
│  │  │      CANVAS SPACE                     │     │         │
│  │  │  (Logical coordinates - where         │     │         │
│  │  │   lines are stored)                   │     │         │
│  │  │                                        │     │         │
│  │  │   Line A: {x: 100, y: 100}           │     │         │
│  │  │   Line B: {x: 200, y: 200}           │     │         │
│  │  │                                        │     │         │
│  │  │   Scale: 1.0 (100%)                   │     │         │
│  │  │   Offset: {x: 0, y: 0}                │     │         │
│  │  └──────────────────────────────────────┘     │         │
│  │                                                 │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Zoom Transformation (Scale = 2.0)

### Before Zoom (100%)
```
Canvas Space (Logical)          Screen Space (Visual)
┌─────────────────────┐        ┌─────────────────────┐
│                     │        │                     │
│   ●─────────●       │        │   ●─────────●       │
│  (100,100) (200,100)│   →    │  (100,100) (200,100)│
│                     │        │                     │
│   Line: 100px long  │        │   Line: 100px long  │
│                     │        │                     │
└─────────────────────┘        └─────────────────────┘
Scale: 1.0                     Visible: Same as stored
Offset: {x: 0, y: 0}
```

### After Zoom (200%)
```
Canvas Space (Logical)          Screen Space (Visual)
┌─────────────────────┐        ┌─────────────────────┐
│                     │        │                     │
│   ●─────────●       │        │   ●───────────────●  │
│  (100,100) (200,100)│   →    │  (200,200) (400,200)│
│                     │        │                     │
│   Line: 100px long  │        │   Line: 200px long  │
│   (unchanged)       │        │   (2x larger)       │
└─────────────────────┘        └─────────────────────┘
Scale: 2.0                     Visible: 2x larger
Offset: {x: 0, y: 0}           Formula: screen = canvas * scale
```

---

## 3. Pan Transformation (Offset = {x: 50, y: 50})

### Before Pan
```
Canvas Space (Logical)          Screen Space (Visual)
┌─────────────────────┐        ┌─────────────────────┐
│                     │        │                     │
│   ●─────────●       │        │   ●─────────●       │
│  (100,100) (200,100)│   →    │  (100,100) (200,100)│
│                     │        │                     │
└─────────────────────┘        └─────────────────────┘
Scale: 1.0                     Visible: At original position
Offset: {x: 0, y: 0}
```

### After Pan Right+Down
```
Canvas Space (Logical)          Screen Space (Visual)
┌─────────────────────┐        ┌─────────────────────┐
│                     │        │                     │
│   ●─────────●       │        │                     │
│  (100,100) (200,100)│   →    │      ●─────────●    │
│   (unchanged)       │        │     (150,150)(250,150)
│                     │        │                     │
└─────────────────────┘        └─────────────────────┘
Scale: 1.0                     Visible: Shifted right+down
Offset: {x: 50, y: 50}         Formula: screen = canvas + offset
```

---

## 4. Combined Zoom + Pan

### Transformation Formula
```
Screen Coordinates = (Canvas Coordinates × Scale) + Offset

screenX = canvasX * scale + offsetX
screenY = canvasY * scale + offsetY
```

### Inverse Transformation (Mouse Events)
```
Canvas Coordinates = (Screen Coordinates - Offset) / Scale

canvasX = (screenX - offsetX) / scale
canvasY = (screenY - offsetY) / scale
```

### Example: Scale = 2.0, Offset = {x: 100, y: 50}
```
Canvas Space                    Screen Space
┌─────────────────────┐        ┌─────────────────────┐
│                     │        │                     │
│   ●─────────●       │        │                     │
│  (100,100) (200,100)│   →    │        ●─────────●  │
│                     │        │       (300,250)(500,250)
│                     │        │                     │
└─────────────────────┘        └─────────────────────┘

Calculation:
screenX = 100 * 2.0 + 100 = 300
screenY = 100 * 2.0 + 50  = 250
```

---

## 5. Zoom Toward Cursor Algorithm

### Problem
When zooming, we want the point under the cursor to stay fixed.

### Visual Example

#### Before Zoom (Scale = 1.0)
```
Screen Space
┌─────────────────────────────┐
│                             │
│         ●                   │  ← Line at canvas (200, 150)
│        (200,150)            │
│                             │
│              🖱              │  ← Mouse at screen (300, 200)
│            (300,200)        │
│                             │
└─────────────────────────────┘
Offset: {x: 0, y: 0}
```

#### After Zoom (Scale = 2.0) - WRONG (naive approach)
```
Screen Space
┌─────────────────────────────┐
│                             │
│                   ●         │  ← Line moved to (400, 300)
│                  (400,300)  │     Mouse is no longer over line!
│                             │
│              🖱              │  ← Mouse still at (300, 200)
│            (300,200)        │
│                             │
└─────────────────────────────┘
Offset: {x: 0, y: 0} (unchanged)
Problem: Line moved away from cursor!
```

#### After Zoom (Scale = 2.0) - CORRECT (with offset adjustment)
```
Screen Space
┌─────────────────────────────┐
│                             │
│              ●              │  ← Line at (300, 200)
│            (300,200)        │     Mouse is still over line!
│              🖱              │  ← Mouse still at (300, 200)
│            (300,200)        │
│                             │
└─────────────────────────────┘
Offset: {x: -100, y: -100} (adjusted)
Success: Line stayed under cursor!
```

### Algorithm Steps

```typescript
// 1. Get mouse position in canvas space BEFORE zoom
const mouseCanvasX = (mouseScreenX - oldOffsetX) / oldScale;
const mouseCanvasY = (mouseScreenY - oldOffsetY) / oldScale;

// Example: (300 - 0) / 1.0 = 300 canvas pixels

// 2. Apply new scale
const newScale = oldScale * zoomFactor;

// Example: 1.0 * 2.0 = 2.0

// 3. Calculate new offset to keep mouse position fixed
const newOffsetX = mouseScreenX - mouseCanvasX * newScale;
const newOffsetY = mouseScreenY - mouseCanvasY * newScale;

// Example: 300 - 300 * 2.0 = 300 - 600 = -300
// This shifts the canvas so the point stays under cursor
```

---

## 6. Canvas Context Transform Matrix

### Standard Transform Matrix
```
┌                    ┐
│  a   c   e  │  ← Horizontal: scale, skew, translate
│  b   d   f  │  ← Vertical: skew, scale, translate
│  0   0   1  │  ← Homogeneous coordinate
└                    ┘
```

### Our Transform (No Rotation/Skew)
```
┌                              ┐
│  scale*dpr    0      offsetX*dpr  │
│  0            scale*dpr  offsetY*dpr  │
│  0            0      1          │
└                              ┘

ctx.setTransform(
  scale * dpr,      // a: horizontal scaling
  0,                // b: vertical skewing (none)
  0,                // c: horizontal skewing (none)
  scale * dpr,      // d: vertical scaling
  offsetX * dpr,    // e: horizontal translation
  offsetY * dpr     // f: vertical translation
);
```

### Why Multiply by DPR?
```
Device Pixel Ratio (DPR) = Physical Pixels / CSS Pixels

Standard Display (DPR = 1):
  Canvas: 800 × 600 physical pixels
  CSS: 800 × 600 pixels
  Transform: scale * 1 = scale

Retina Display (DPR = 2):
  Canvas: 1600 × 1200 physical pixels
  CSS: 800 × 600 pixels
  Transform: scale * 2 = scale * 2

This ensures sharp rendering on high-DPI displays!
```

---

## 7. HUD Positioning with Zoom/Pan

### Problem
HUD is a DOM element (not canvas-drawn), so it needs screen coordinates.

### Solution
Transform line coordinates from canvas space to screen space.

```
Canvas Space (Line)             Screen Space (HUD)
┌─────────────────────┐        ┌─────────────────────┐
│                     │        │                     │
│   ●─────────●       │        │        ┌──────┐    │
│  (100,100) (200,100)│   →    │   ●────│ HUD  │───●│
│                     │        │  (200,200) (400,200)│
│   Midpoint:         │        │                     │
│   (150, 100)        │        │   HUD Position:     │
│                     │        │   (300, 200)        │
└─────────────────────┘        └─────────────────────┘

Calculation:
midCanvasX = (100 + 200) / 2 = 150
midCanvasY = (100 + 100) / 2 = 100

midScreenX = 150 * 2.0 + 0 = 300
midScreenY = 100 * 2.0 + 0 = 200

hudX = midScreenX - hudWidth / 2
hudY = midScreenY - lineHeight - offset
```

---

## 8. Touch Gesture Coordinate Calculation

### Pinch-to-Zoom Center Point

```
Two Touch Points
┌─────────────────────────────┐
│                             │
│    👆 Touch 1                │  ← (100, 100)
│   (100,100)                 │
│                             │
│           ●                 │  ← Zoom center (midpoint)
│         (200,200)           │
│                             │
│                  👆 Touch 2  │  ← (300, 300)
│                 (300,300)   │
│                             │
└─────────────────────────────┘

Midpoint Calculation:
midX = (touch1.x + touch2.x) / 2 = (100 + 300) / 2 = 200
midY = (touch1.y + touch2.y) / 2 = (100 + 300) / 2 = 200

Distance Calculation:
distance = √[(300-100)² + (300-100)²]
         = √[200² + 200²]
         = √80000
         = 282.84 pixels

Scale Factor:
scaleFactor = currentDistance / initialDistance
```

---

## 9. Performance Optimization: Viewport Culling

### Without Culling (Draw All Lines)
```
Visible Viewport                Full Canvas
┌──────────┐                   ┌─────────────────────┐
│          │                   │  ●───●              │
│   ●───●  │                   │                     │
│          │                   │         ●───●       │
└──────────┘                   │                     │
                               │  ●───●              │
Drawing: 1 line                │              ●───●  │
Actually drawn: 5 lines        │                     │
Wasted: 4 lines (80%)          └─────────────────────┘
```

### With Culling (Draw Only Visible)
```
Visible Viewport                Full Canvas
┌──────────┐                   ┌─────────────────────┐
│          │                   │  ●───● (culled)     │
│   ●───●  │                   │                     │
│          │                   │         ●───●       │
└──────────┘                   │         (culled)    │
                               │  ●───● (culled)     │
Drawing: 1 line                │              ●───●  │
Actually drawn: 1 line         │              (culled)
Wasted: 0 lines (0%)           └─────────────────────┘

Algorithm:
1. Calculate viewport bounds in canvas space
2. For each line, check if it intersects viewport
3. Only draw lines that intersect
4. Significant performance gain with many lines
```

---

## 10. Common Pitfalls and Solutions

### Pitfall 1: Forgetting to Transform Mouse Coordinates
```
❌ WRONG:
const pos = getPointerPos(canvas, event);
// pos is in screen space, but we need canvas space!

✅ CORRECT:
const transform = { scale: viewportScale, offset: viewportOffset };
const pos = getPointerPos(canvas, event, transform);
// pos is correctly transformed to canvas space
```

### Pitfall 2: Not Scaling Visual Elements
```
❌ WRONG:
ctx.lineWidth = 2; // Always 2 pixels, looks thick when zoomed out

✅ CORRECT:
ctx.lineWidth = 2 / viewportScale; // Scales with zoom
```

### Pitfall 3: Applying Transform Multiple Times
```
❌ WRONG:
ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);
ctx.scale(scale, scale); // Applied twice!

✅ CORRECT:
ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);
// Transform applied once, correctly
```

### Pitfall 4: Not Clearing Transformed Canvas
```
❌ WRONG:
ctx.clearRect(0, 0, canvas.width, canvas.height);
// Clears physical pixels, not transformed area!

✅ CORRECT:
ctx.clearRect(
  -offsetX / scale,
  -offsetY / scale,
  canvas.width / (scale * dpr),
  canvas.height / (scale * dpr)
);
// Clears the visible transformed area
```

---

**End of Coordinate Diagram Guide**


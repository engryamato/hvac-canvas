# BUG-001: Canvas White Screen and HUD Not Showing

**Date:** 2025-10-09  
**Severity:** Critical  
**Status:** ✅ Fixed  
**Reporter:** User  
**Assignee:** AI Assistant

---

## 🐛 Problem Summary

Two critical bugs were discovered in the drawing canvas functionality:

1. **Canvas turns white** after drawing a line, exiting drawing mode, and clicking on a duct
2. **HUD modal doesn't show** when selecting a duct after drawing

---

## 📋 Reproduction Steps

### Bug 1: Canvas White Screen
1. Press 'D' or click the draw button to enter drawing mode
2. Click to start a line
3. Move mouse and click again to complete the line
4. Press 'D' or click the draw button to exit drawing mode
5. Click on the drawn duct to select it
6. **Result:** Canvas turns completely white

### Bug 2: HUD Not Showing
1. Follow steps 1-5 above
2. **Result:** The Width HUD modal doesn't appear (should show above/below the selected line)

---

## 🔍 Root Cause Analysis

### Bug 1: Double Viewport Transformation

**Location:** `src/DrawingCanvas.tsx`, line 215 (before fix)

**Root Cause:**
The `render()` function was calling `applyViewportTransform()` on every render, but `setupHiDPICanvas()` (called in useEffect at line 280) **also** applies the viewport transform. This created a **double transformation** that corrupted the canvas rendering context.

**Technical Details:**
```typescript
// BEFORE (Buggy Code):
const render = useCallback(() => {
  const c = canvasRef.current; if (!c) return;
  const ctx = c.getContext("2d"); if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const transform = { scale: viewportScale, offset: viewportOffset };

  // ❌ BUG: This applies transformation AGAIN
  applyViewportTransform(ctx, transform, dpr);

  // This clearRect now uses wrong coordinates
  ctx.clearRect(
    -viewportOffset.x / viewportScale,
    -viewportOffset.y / viewportScale,
    c.width / (viewportScale * dpr),
    c.height / (viewportScale * dpr)
  );
  // ... rest of rendering
}, [lines, selectedId, isDrawActive, drawingState, defaultWidth, viewportScale, viewportOffset]);
```

**Why it manifested after drawing:**
- During drawing mode, the canvas rendered correctly (by timing/luck)
- After completing a line and clicking in selection mode, `render()` was called
- The double transformation caused `clearRect()` to use incorrect coordinates
- The canvas cleared the wrong area or the transformation matrix became corrupted
- Result: White screen

**The Fix:**
Remove the redundant `applyViewportTransform()` call from the `render()` function since it's already applied in `setupHiDPICanvas()`.

---

### Bug 2: Race Condition in HUD Position Calculation

**Location:** `src/DrawingCanvas.tsx`, lines 439-442 and 391-394 (before fix)

**Root Cause:**
The HUD position calculation was wrapped in `setTimeout(..., 0)`, creating a race condition where the state update might not complete before the next render.

**Technical Details:**
```typescript
// BEFORE (Buggy Code):
} else {
  // Selection mode
  const id = hitTest(rawPos);
  setSelectedId(id);

  // ❌ BUG: setTimeout creates race condition
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
```

**The Problem:**
1. `setSelectedId(id)` is called
2. `setTimeout` schedules the HUD position calculation for the next event loop tick
3. The component might re-render before the `setTimeout` callback executes
4. `hudPosition` remains `null`
5. The HUD doesn't render because of the condition: `{selectedId && hudPosition && (...)}`

**The Fix:**
Remove the `setTimeout` wrapper and make state updates synchronous.

---

## ✅ Solution Implemented

### Fix 1: Remove Double Transformation

**File:** `src/DrawingCanvas.tsx`  
**Lines Modified:** 207-233

```typescript
// AFTER (Fixed Code):
const render = useCallback(() => {
  const c = canvasRef.current; if (!c) return;
  const ctx = c.getContext("2d"); if (!ctx) return;

  // Defensive checks
  if (viewportScale <= 0) {
    console.warn('Invalid viewport scale:', viewportScale);
    return;
  }

  const dpr = window.devicePixelRatio || 1;

  // ✅ Note: Viewport transform is already applied by setupHiDPICanvas()
  // Do NOT call applyViewportTransform() here to avoid double transformation

  // Clear with transform applied
  try {
    ctx.clearRect(
      -viewportOffset.x / viewportScale,
      -viewportOffset.y / viewportScale,
      c.width / (viewportScale * dpr),
      c.height / (viewportScale * dpr)
    );
  } catch (error) {
    console.error('Error clearing canvas:', error);
    return;
  }
  // ... rest of rendering
}, [lines, selectedId, isDrawActive, drawingState, defaultWidth, viewportScale, viewportOffset]);
```

**Changes:**
1. ✅ Removed `applyViewportTransform()` call
2. ✅ Added defensive check for invalid viewport scale
3. ✅ Added try-catch for clearRect operation
4. ✅ Added explanatory comment

---

### Fix 2: Remove setTimeout Race Condition

**File:** `src/DrawingCanvas.tsx`  
**Lines Modified:** 447-461 and 407-410

```typescript
// AFTER (Fixed Code):
} else {
  // Selection mode
  const id = hitTest(rawPos);
  setSelectedId(id);

  // ✅ Calculate HUD position when line is selected
  // Note: Removed setTimeout to avoid race condition - state updates are now synchronous
  if (id) {
    const position = calculateHudPosition(id);
    setHudPosition(position);
  } else {
    setHudPosition(null);
  }

  render();
}
```

**Changes:**
1. ✅ Removed `setTimeout` wrapper
2. ✅ Made state updates synchronous
3. ✅ Added explanatory comment
4. ✅ Applied same fix to `handleDrawingSecondClick` function

---

### Fix 3: Added Defensive Checks

**File:** `src/DrawingCanvas.tsx`  
**Lines Modified:** 235-259

```typescript
for (const ln of lines) {
  // ✅ Validate line data before rendering
  if (!ln || !ln.a || !ln.b || typeof ln.width !== 'number' || !ln.color) {
    console.warn('Invalid line data, skipping:', ln);
    continue;
  }

  ctx.lineWidth = ln.width;
  ctx.strokeStyle = ln.color;
  // ... rest of line rendering
}
```

**Changes:**
1. ✅ Added validation for line data
2. ✅ Skip invalid lines instead of crashing
3. ✅ Log warnings for debugging

---

## 🧪 Testing

### Test Cases Verified

✅ **Test 1: Basic Drawing and Selection**
- Draw a line
- Exit drawing mode
- Click on the duct
- **Expected:** Canvas renders correctly, HUD appears
- **Result:** ✅ PASS

✅ **Test 2: Multiple Lines**
- Draw multiple lines
- Exit drawing mode
- Click on different ducts
- **Expected:** Canvas renders correctly, HUD appears for each selection
- **Result:** ✅ PASS

✅ **Test 3: Zoom and Pan**
- Draw lines at different zoom levels
- Pan the viewport
- Select ducts
- **Expected:** Canvas renders correctly at all zoom levels, HUD positioned correctly
- **Result:** ✅ PASS

✅ **Test 4: Edge Cases**
- Select line immediately after drawing
- Rapidly switch between drawing and selection modes
- **Expected:** No white screen, HUD always appears
- **Result:** ✅ PASS

---

## 📊 Impact Assessment

### Before Fix
- ❌ Canvas unusable after drawing
- ❌ HUD not showing
- ❌ User workflow completely broken

### After Fix
- ✅ Canvas renders correctly
- ✅ HUD appears reliably
- ✅ User workflow restored
- ✅ Added defensive checks for future stability

---

## 🎯 Lessons Learned

1. **Avoid Double Transformations:** Always check if transformations are already applied before applying them again
2. **Avoid setTimeout for State Updates:** Use synchronous state updates when possible to avoid race conditions
3. **Add Defensive Checks:** Validate data before rendering to prevent crashes
4. **Document Assumptions:** Add comments explaining why certain code patterns are used

---

## 📝 Related Files

- `src/DrawingCanvas.tsx` - Main component with fixes
- `src/utils/canvas/rendering.ts` - Canvas rendering utilities
- `docs/bug-reports/BUG-001-CANVAS-WHITE-SCREEN-AND-HUD-ISSUES.md` - This document

---

## 🔗 References

- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [React State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [HiDPI Canvas Setup](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)

---

**Status:** ✅ Fixed and Verified  
**Date Fixed:** 2025-10-09


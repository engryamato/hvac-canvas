# Detailed Refactoring Analysis

## 📊 Code Quality Metrics

### Current State (Before Refactoring)

**File**: `src/DrawingCanvas.tsx`
- **Total Lines**: 814
- **Component Lines**: ~580 (excluding types, constants, helpers)
- **Cyclomatic Complexity**: High (deeply nested conditionals)
- **Code Duplication**: 2 instances of 4-line state reset
- **Magic Numbers**: 4 instances
- **Function Length**: `onPointerDown` = 62 lines

### Issues Breakdown

#### 1. Code Duplication (Lines 294-298 vs 479-482)

**Current Code**:
```typescript
// Location 1: Escape key handler (lines 294-298)
if (e.key === "Escape" && drawingPhase === 'waiting-for-end') {
  setPendingStartPoint(null);
  setDraftEnd(null);
  setSnapTarget(null);
  setDrawingPhase('idle');
}

// Location 2: After line creation (lines 479-482)
// Reset to idle
setPendingStartPoint(null);
setDraftEnd(null);
setSnapTarget(null);
setDrawingPhase('idle');
```

**Problem**:
- Same 4 lines repeated
- Easy to forget updating one location
- Maintenance burden

**Impact**: 🔴 High
- If we add new drawing state, must update 2 places
- Risk of inconsistent state cleanup

---

#### 2. Magic Numbers

**Current Code**:
```typescript
// Line 460: Minimum line length check
if (dist(pendingStartPoint, draftEnd) > 2) {

// Line 335: Selection highlight width
ctx.lineWidth = ln.width + 8;

// Line 374: Hit test tolerance
const tol = Math.max(6, ln.width / 1.5);
```

**Problem**:
- What does `2` mean? Pixels? Why 2?
- Why `8` for highlight? Design decision?
- Why `6` and `1.5` for hit test?

**Impact**: 🟡 Medium
- Unclear intent
- Hard to tune values
- No documentation

---

#### 3. Complex Conditional Logic

**Current Code** (onPointerDown, lines 445-483):
```typescript
if (isDrawActive) {
  // Click-click drawing logic
  if (drawingPhase === 'idle') {
    // First click: Set start point
    const snap = findSnapTarget(rawPos, lines);
    const startPos = snap ? snap.point : rawPos;

    setSelectedId(null);
    setHudPosition(null);
    setPendingStartPoint(startPos);
    setDraftEnd(null);
    setSnapTarget(snap);
    setDrawingPhase('waiting-for-end');
  } else if (drawingPhase === 'waiting-for-end' && pendingStartPoint && draftEnd) {
    // Second click: Create line
    if (dist(pendingStartPoint, draftEnd) > 2) {
      const newLine: Line = {
        id: uid(),
        a: pendingStartPoint,
        b: draftEnd,
        width: defaultWidth,
        color: defaultColor
      };
      setLines(prev => [...prev, newLine]);
      setSelectedId(newLine.id);

      setTimeout(() => {
        const position = calculateHudPosition(newLine.id);
        setHudPosition(position);
      }, 0);
    }

    // Reset to idle
    setPendingStartPoint(null);
    setDraftEnd(null);
    setSnapTarget(null);
    setDrawingPhase('idle');
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
```

**Problem**:
- 3 levels of nesting
- 62 lines in one function
- Multiple responsibilities
- Hard to test individual parts

**Impact**: 🟡 Medium
- Reduced readability
- Harder to maintain
- Difficult to test

---

#### 4. State Management Coupling

**Current Code** (lines 246-250):
```typescript
// Click-click drawing state
const [drawingPhase, setDrawingPhase] = useState<DrawingPhase>('idle');
const [pendingStartPoint, setPendingStartPoint] = useState<Pt | null>(null);
const [draftEnd, setDraftEnd] = useState<Pt | null>(null);
const [snapTarget, setSnapTarget] = useState<SnapTarget | null>(null);
```

**Cleanup Effect** (lines 282-287):
```typescript
// Clear snap target when exiting draw mode
useEffect(() => {
  if (!isDrawActive) {
    setSnapTarget(null);
  }
}, [isDrawActive]);
```

**Problem**:
- 4 related states managed separately
- Cleanup logic scattered
- Easy to miss state updates
- No single source of truth

**Impact**: 🟡 Medium
- Potential for inconsistent state
- Harder to reason about state transitions

---

#### 5. Missing Abstraction

**Current Code**:
```typescript
// Line 450
const startPos = snap ? snap.point : rawPos;

// Line 520
const endPos = snap ? snap.point : rawPos;
```

**Problem**:
- Same ternary pattern repeated
- Logic not centralized
- Intent not immediately clear

**Impact**: 🟢 Low
- Minor duplication
- Could be clearer

---

#### 6. Inconsistent Naming

**Current Code**:
```typescript
// Line 443
const rawPos = getPointerPos(c, e.nativeEvent as any);

// Line 450
const startPos = snap ? snap.point : rawPos;

// Line 520
const endPos = snap ? snap.point : rawPos;
```

**Problem**:
- `rawPos` vs `startPos` vs `endPos`
- Inconsistent naming pattern
- Not immediately clear what "raw" means

**Impact**: 🟢 Low
- Slightly confusing
- Minor issue

---

## 🎯 Proposed Solutions

### Solution 1: Extract Constants

**Before**:
```typescript
if (dist(pendingStartPoint, draftEnd) > 2) {
```

**After**:
```typescript
const MIN_LINE_LENGTH = 2; // Minimum line length in pixels to create

if (dist(pendingStartPoint, draftEnd) > MIN_LINE_LENGTH) {
```

**Benefits**:
- ✅ Self-documenting code
- ✅ Easy to tune values
- ✅ Clear intent

---

### Solution 2: Extract Reset Helper

**Before**:
```typescript
// Duplicated in 2 places
setPendingStartPoint(null);
setDraftEnd(null);
setSnapTarget(null);
setDrawingPhase('idle');
```

**After**:
```typescript
const resetDrawingState = useCallback(() => {
  setPendingStartPoint(null);
  setDraftEnd(null);
  setSnapTarget(null);
  setDrawingPhase('idle');
}, []);

// Usage
resetDrawingState();
```

**Benefits**:
- ✅ DRY principle
- ✅ Single source of truth
- ✅ Easier to maintain

---

### Solution 3: Extract Snap Resolution

**Before**:
```typescript
const startPos = snap ? snap.point : rawPos;
```

**After**:
```typescript
function resolveSnapPoint(rawPoint: Pt, snapTarget: SnapTarget | null): Pt {
  return snapTarget ? snapTarget.point : rawPoint;
}

const startPos = resolveSnapPoint(rawPos, snap);
```

**Benefits**:
- ✅ Centralized logic
- ✅ Clearer intent
- ✅ Reusable

---

### Solution 4: Simplify onPointerDown

**Before**: 62 lines, 3 levels of nesting

**After**:
```typescript
const handleDrawingFirstClick = useCallback((rawPos: Pt) => {
  // ... 10 lines
}, [lines]);

const handleDrawingSecondClick = useCallback(() => {
  // ... 20 lines
}, [pendingStartPoint, draftEnd, ...]);

const onPointerDown = useCallback((e: React.PointerEvent) => {
  // ... 25 lines, 1-2 levels of nesting
}, [isDrawActive, drawingPhase, ...]);
```

**Benefits**:
- ✅ Reduced complexity
- ✅ Better testability
- ✅ Clearer responsibilities
- ✅ Easier to understand

---

### Solution 5: Improve onPointerMove

**Before**:
```typescript
const onPointerMove = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current; if (!c) return;

  // Enable snapping in draw mode (both idle and waiting-for-end phases)
  if (!isDrawActive) return;

  const rawPos = getPointerPos(c, e.nativeEvent as any);

  // Check for snap target
  const snap = findSnapTarget(rawPos, lines);

  // Update snap indicator for both hover (idle) and active drawing (waiting-for-end)
  setSnapTarget(snap);

  // Only update draft end point when actively drawing (waiting for end point)
  if (drawingPhase === 'waiting-for-end' && pendingStartPoint) {
    const endPos = snap ? snap.point : rawPos;
    setDraftEnd(endPos);
  }
}, [isDrawActive, drawingPhase, pendingStartPoint, lines]);
```

**After**:
```typescript
const onPointerMove = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current; if (!c) return;

  // Only process snapping when in draw mode
  if (!isDrawActive) return;

  const cursorPos = getPointerPos(c, e.nativeEvent as any);

  // Find and update snap target for visual feedback
  const snap = findSnapTarget(cursorPos, lines);
  setSnapTarget(snap);

  // Update draft line endpoint when actively drawing
  const isActivelyDrawing = drawingPhase === 'waiting-for-end' && pendingStartPoint;
  if (isActivelyDrawing) {
    const endPos = resolveSnapPoint(cursorPos, snap);
    setDraftEnd(endPos);
  }
}, [isDrawActive, drawingPhase, pendingStartPoint, lines]);
```

**Benefits**:
- ✅ Clearer variable names
- ✅ Better comments
- ✅ Extracted condition check
- ✅ Uses helper function

---

## 📊 Expected Improvements

### Code Metrics (After Refactoring)

**Phases 1-5 Complete**:
- **Code Duplication**: 0 instances (was 2)
- **Magic Numbers**: 0 instances (was 4)
- **Cyclomatic Complexity**: Reduced by ~30%
- **Function Length**: `onPointerDown` = ~25 lines (was 62)
- **Helper Functions**: +4 new helpers
- **Named Constants**: +4 new constants

### Maintainability Score

**Before**: 6/10
- ❌ Code duplication
- ❌ Magic numbers
- ❌ Complex conditionals
- ✅ Good type safety
- ✅ Decent comments

**After (Phases 1-5)**: 9/10
- ✅ No duplication
- ✅ Named constants
- ✅ Simplified logic
- ✅ Good type safety
- ✅ Excellent comments
- ✅ Helper functions

---

## 🎯 Conclusion

The refactoring plan addresses all identified issues with a phased approach that minimizes risk while maximizing value. Phases 1-5 are highly recommended and provide significant improvements with low to medium risk. Phase 6 is optional and should be evaluated based on team preferences.

**Recommendation**: Execute Phases 1-5 in order, testing after each phase.

---

**Created**: 2025-10-08
**Status**: Ready for Implementation


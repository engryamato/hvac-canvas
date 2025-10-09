# Comprehensive Refactoring Plan: Hover Snap Feature

## 📊 Analysis Summary

### Current Implementation Review

**Files Analyzed:**
- `src/DrawingCanvas.tsx` (814 lines)

**Hover Snap Changes Made:**
1. Lines 282-287: Effect to clear snap target on draw mode exit
2. Lines 504-523: Modified `onPointerMove` for hover snapping
3. Line 614: Added `snapTarget` to render dependencies

### Issues Identified

#### 1. **Code Duplication** 🔴 High Priority
- **Location**: Lines 294-298 and 479-482
- **Issue**: Drawing state reset logic duplicated in two places
- **Impact**: Maintenance burden, potential for inconsistency

#### 2. **Magic Numbers** 🟡 Medium Priority
- **Location**: Line 460 (`dist > 2`), Line 335 (`+ 8`), Line 374 (`> 6`)
- **Issue**: Unexplained numeric literals scattered throughout
- **Impact**: Unclear intent, difficult to tune

#### 3. **Complex Conditional Logic** 🟡 Medium Priority
- **Location**: Lines 447-483 (onPointerDown), Lines 356-365 (render)
- **Issue**: Deeply nested conditionals, multiple state checks
- **Impact**: Reduced readability, harder to test

#### 4. **State Management Coupling** 🟡 Medium Priority
- **Location**: Lines 246-250 (drawing state), Lines 282-287 (cleanup effect)
- **Issue**: Related states managed separately, cleanup logic scattered
- **Impact**: Easy to miss state updates, potential bugs

#### 5. **Missing Abstraction** 🟢 Low Priority
- **Location**: Lines 449-450, 513-516, 520-521
- **Issue**: Snap point resolution logic repeated
- **Impact**: Minor duplication, could be clearer

#### 6. **Inconsistent Naming** 🟢 Low Priority
- **Location**: Line 510 (`rawPos`), Line 450 (`startPos`), Line 520 (`endPos`)
- **Issue**: Inconsistent naming pattern for positions
- **Impact**: Slightly confusing, but minor

---

## 🎯 Refactoring Goals

1. **Eliminate duplication** in drawing state reset logic
2. **Extract magic numbers** into named constants
3. **Simplify complex conditionals** through helper functions
4. **Consolidate state management** for drawing-related states
5. **Improve code clarity** with better naming and structure
6. **Maintain 100% backward compatibility**

---

## 📋 Refactoring Plan (Phased Approach)

### **Phase 1: Extract Constants** ⚡ Low Risk
**Complexity**: Low | **Estimated Time**: 10 minutes

#### Changes:
1. Extract magic numbers to named constants
2. Group related constants together
3. Add documentation for each constant

#### Specific Actions:

**File**: `src/DrawingCanvas.tsx`

**Add after line 166** (after snap indicator constants):
```typescript
// Drawing interaction constants
const MIN_LINE_LENGTH = 2;           // Minimum line length in pixels to create
const SELECTION_HIGHLIGHT_WIDTH = 8;  // Additional width for selection highlight
const HIT_TEST_MIN_TOLERANCE = 6;    // Minimum hit test tolerance in pixels
const HIT_TEST_WIDTH_FACTOR = 1.5;   // Factor to calculate tolerance from line width
```

**Replace**:
- Line 460: `dist(pendingStartPoint, draftEnd) > 2` → `dist(pendingStartPoint, draftEnd) > MIN_LINE_LENGTH`
- Line 335: `ln.width + 8` → `ln.width + SELECTION_HIGHLIGHT_WIDTH`
- Line 374: `Math.max(6, ln.width / 1.5)` → `Math.max(HIT_TEST_MIN_TOLERANCE, ln.width / HIT_TEST_WIDTH_FACTOR)`

**Verification**:
- Run existing tests
- Verify drawing still works
- Check selection highlighting
- Test hit detection

**Risk**: ⚡ Very Low - Simple constant extraction

---

### **Phase 2: Extract Drawing State Reset Helper** ⚡ Low Risk
**Complexity**: Low | **Estimated Time**: 15 minutes

#### Changes:
1. Create `resetDrawingState` helper function
2. Replace duplicated reset logic
3. Ensure consistent state cleanup

#### Specific Actions:

**File**: `src/DrawingCanvas.tsx`

**Add after line 280** (after deleteLine callback):
```typescript
// Reset all drawing-related state to idle
const resetDrawingState = useCallback(() => {
    setPendingStartPoint(null);
    setDraftEnd(null);
    setSnapTarget(null);
    setDrawingPhase('idle');
  }, []);
```

**Replace**:
- Lines 295-298 (Escape key handler):
```typescript
// OLD:
setPendingStartPoint(null);
setDraftEnd(null);
setSnapTarget(null);
setDrawingPhase('idle');

// NEW:
resetDrawingState();
```

- Lines 479-482 (After line creation):
```typescript
// OLD:
setPendingStartPoint(null);
setDraftEnd(null);
setSnapTarget(null);
setDrawingPhase('idle');

// NEW:
resetDrawingState();
```

**Update dependencies**:
- Line 317: Add `resetDrawingState` to useEffect dependencies

**Verification**:
- Test Escape key cancellation
- Test line creation completion
- Verify state resets correctly in both cases

**Risk**: ⚡ Very Low - Simple extraction, no logic changes

---

### **Phase 3: Extract Snap Point Resolution Helper** 🟡 Medium Risk
**Complexity**: Medium | **Estimated Time**: 20 minutes

#### Changes:
1. Create `resolveSnapPoint` helper function
2. Centralize snap point resolution logic
3. Improve code clarity

#### Specific Actions:

**File**: `src/DrawingCanvas.tsx`

**Add after line 167** (after snap indicator constants):
```typescript
/**
 * Resolves the final point to use, applying snap if available
 * @param rawPoint - The raw cursor position
 * @param snapTarget - The snap target (if any)
 * @returns The final point (snapped or raw)
 */
function resolveSnapPoint(rawPoint: Pt, snapTarget: SnapTarget | null): Pt {
  return snapTarget ? snapTarget.point : rawPoint;
}
```

**Replace**:
- Line 450: `const startPos = snap ? snap.point : rawPos;` → `const startPos = resolveSnapPoint(rawPos, snap);`
- Line 520: `const endPos = snap ? snap.point : rawPos;` → `const endPos = resolveSnapPoint(rawPos, snap);`

**Verification**:
- Test snapping to endpoints
- Test snapping to midpoints
- Test snapping to line segments
- Test drawing without snapping

**Risk**: 🟡 Low-Medium - Simple helper, but touches core snap logic

---

### **Phase 4: Simplify onPointerDown Logic** 🟡 Medium Risk
**Complexity**: Medium | **Estimated Time**: 25 minutes

#### Changes:
1. Extract first click handler
2. Extract second click handler
3. Reduce nesting in onPointerDown

#### Specific Actions:

**File**: `src/DrawingCanvas.tsx`

**Add before onPointerDown** (around line 440):
```typescript
// Handle first click in drawing mode - set start point
const handleDrawingFirstClick = useCallback((rawPos: Pt) => {
  const snap = findSnapTarget(rawPos, lines);
  const startPos = resolveSnapPoint(rawPos, snap);

  setSelectedId(null);
  setHudPosition(null);
  setPendingStartPoint(startPos);
  setDraftEnd(null);
  setSnapTarget(snap);
  setDrawingPhase('waiting-for-end');
}, [lines]);

// Handle second click in drawing mode - create line
const handleDrawingSecondClick = useCallback(() => {
  if (!pendingStartPoint || !draftEnd) return;
  
  if (dist(pendingStartPoint, draftEnd) > MIN_LINE_LENGTH) {
    const newLine: Line = {
      id: uid(),
      a: pendingStartPoint,
      b: draftEnd,
      width: defaultWidth,
      color: defaultColor
    };
    setLines(prev => [...prev, newLine]);
    setSelectedId(newLine.id);

    // Calculate HUD position for newly created line
    setTimeout(() => {
      const position = calculateHudPosition(newLine.id);
      setHudPosition(position);
    }, 0);
  }

  resetDrawingState();
}, [pendingStartPoint, draftEnd, defaultWidth, defaultColor, calculateHudPosition, resetDrawingState]);
```

**Replace onPointerDown** (lines 440-502):
```typescript
const onPointerDown = useCallback((e: React.PointerEvent) => {
  const c = canvasRef.current; if (!c) return;
  c.setPointerCapture(e.pointerId);
  const rawPos = getPointerPos(c, e.nativeEvent as any);

  if (isDrawActive) {
    // Click-click drawing logic
    if (drawingPhase === 'idle') {
      handleDrawingFirstClick(rawPos);
    } else if (drawingPhase === 'waiting-for-end') {
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
}, [isDrawActive, drawingPhase, handleDrawingFirstClick, handleDrawingSecondClick, hitTest, render, calculateHudPosition]);
```

**Verification**:
- Test first click (start point)
- Test second click (line creation)
- Test selection mode
- Test HUD positioning

**Risk**: 🟡 Medium - Significant restructuring, but logic unchanged

---

### **Phase 5: Improve onPointerMove Clarity** ⚡ Low Risk
**Complexity**: Low | **Estimated Time**: 10 minutes

#### Changes:
1. Add clearer comments
2. Extract condition checks
3. Improve variable naming

#### Specific Actions:

**File**: `src/DrawingCanvas.tsx`

**Replace onPointerMove** (lines 504-523):
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

**Verification**:
- Test hover snap (before first click)
- Test active drawing snap (after first click)
- Verify snap indicator appears correctly

**Risk**: ⚡ Very Low - Mostly cosmetic changes

---

### **Phase 6: Consolidate Drawing State Management** 🔴 Higher Risk
**Complexity**: High | **Estimated Time**: 30 minutes

#### Changes:
1. Group related drawing states
2. Create custom hook for drawing state
3. Simplify state management

#### Specific Actions:

**File**: `src/DrawingCanvas.tsx`

**Add before component** (around line 234):
```typescript
// Custom hook for managing drawing state
function useDrawingState() {
  const [phase, setPhase] = useState<DrawingPhase>('idle');
  const [startPoint, setStartPoint] = useState<Pt | null>(null);
  const [endPoint, setEndPoint] = useState<Pt | null>(null);
  const [snapTarget, setSnapTarget] = useState<SnapTarget | null>(null);

  const reset = useCallback(() => {
    setStartPoint(null);
    setEndPoint(null);
    setSnapTarget(null);
    setPhase('idle');
  }, []);

  const startDrawing = useCallback((point: Pt, snap: SnapTarget | null) => {
    setStartPoint(point);
    setEndPoint(null);
    setSnapTarget(snap);
    setPhase('waiting-for-end');
  }, []);

  const updateEndPoint = useCallback((point: Pt, snap: SnapTarget | null) => {
    setEndPoint(point);
    setSnapTarget(snap);
  }, []);

  return {
    phase,
    startPoint,
    endPoint,
    snapTarget,
    reset,
    startDrawing,
    updateEndPoint,
    setSnapTarget
  };
}
```

**Replace in component** (lines 246-250):
```typescript
// OLD:
const [drawingPhase, setDrawingPhase] = useState<DrawingPhase>('idle');
const [pendingStartPoint, setPendingStartPoint] = useState<Pt | null>(null);
const [draftEnd, setDraftEnd] = useState<Pt | null>(null);
const [snapTarget, setSnapTarget] = useState<SnapTarget | null>(null);

// NEW:
const drawingState = useDrawingState();
```

**Update all references**:
- `drawingPhase` → `drawingState.phase`
- `pendingStartPoint` → `drawingState.startPoint`
- `draftEnd` → `drawingState.endPoint`
- `snapTarget` → `drawingState.snapTarget`
- `setSnapTarget` → `drawingState.setSnapTarget`
- `resetDrawingState()` → `drawingState.reset()`

**Verification**:
- Full regression testing
- Test all drawing scenarios
- Test state cleanup
- Test snap behavior

**Risk**: 🔴 High - Major refactoring, touches many parts

**Note**: This phase is OPTIONAL and should only be done if team agrees it adds value

---

## 🎯 Recommended Execution Order

### **Iteration 1: Quick Wins** (Low Risk, High Value)
1. ✅ Phase 1: Extract Constants
2. ✅ Phase 2: Extract Drawing State Reset Helper
3. ✅ Phase 5: Improve onPointerMove Clarity

**Total Time**: ~35 minutes
**Risk**: ⚡ Very Low
**Value**: Immediate code clarity improvement

### **Iteration 2: Structural Improvements** (Medium Risk, High Value)
4. ✅ Phase 3: Extract Snap Point Resolution Helper
5. ✅ Phase 4: Simplify onPointerDown Logic

**Total Time**: ~45 minutes
**Risk**: 🟡 Medium
**Value**: Significant maintainability improvement

### **Iteration 3: Advanced (Optional)** (High Risk, Debatable Value)
6. ⚠️ Phase 6: Consolidate Drawing State Management

**Total Time**: ~30 minutes
**Risk**: 🔴 High
**Value**: Debatable - adds abstraction but increases complexity

---

## ✅ Verification Strategy

### After Each Phase:
1. **Run automated tests**: `npm test`
2. **Manual testing checklist**:
   - [ ] Enter draw mode (press 'D')
   - [ ] Hover near existing line (see cyan snap indicator)
   - [ ] Click to start line (snap to point)
   - [ ] Move mouse (see preview line)
   - [ ] Click to complete line
   - [ ] Press Escape to cancel
   - [ ] Exit draw mode (press 'D')
   - [ ] Select existing line
   - [ ] Delete line (Delete key)
   - [ ] Adjust line width ([ and ] keys)

### Final Verification:
- Run full test suite
- Visual regression testing
- Performance check (no degradation)
- Code review

---

## 📊 Risk Assessment

| Phase | Risk Level | Breaking Change Potential | Rollback Difficulty |
|-------|-----------|---------------------------|---------------------|
| Phase 1 | ⚡ Very Low | None | Easy |
| Phase 2 | ⚡ Very Low | None | Easy |
| Phase 3 | 🟡 Low-Medium | Low | Easy |
| Phase 4 | 🟡 Medium | Medium | Moderate |
| Phase 5 | ⚡ Very Low | None | Easy |
| Phase 6 | 🔴 High | High | Difficult |

---

## 🎯 Success Metrics

- ✅ Zero breaking changes
- ✅ All tests passing
- ✅ Code duplication reduced by >50%
- ✅ Cyclomatic complexity reduced
- ✅ No performance degradation
- ✅ Improved code readability (subjective, team review)

---

## 📝 Notes

- Each phase is independent and can be done separately
- Phases 1-5 are recommended
- Phase 6 is optional and should be discussed with team
- All changes maintain backward compatibility
- Focus on clarity over cleverness

---

**Created**: 2025-10-08
**Status**: Ready for Review
**Estimated Total Time**: 2-3 hours (Phases 1-5)


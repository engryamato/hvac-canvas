# Modal Width Adjustment Plan - Dynamic Width for 4 Tabs

## Executive Summary

The LinePropertiesModal currently has a fixed width of 220px, which is insufficient to display 4 tabs (Properties, Calculations, Advanced, Connections) with readable labels. This plan outlines the systematic approach to implement dynamic width adjustment while maintaining modal centering and visual consistency.

---

## Problem Analysis

### Current State
- **Fixed Modal Width:** 220px
- **Modal Padding:** 16px (both sides) = 32px total
- **Available Tab Area:** 220 - 32 = 188px
- **Tab Count:** 4 tabs
- **Width Per Tab:** ~46px (with gaps)
- **Tab Labels:** "Properties" (10 chars), "Calculations" (12 chars), "Advanced" (8 chars), "Connections" (11 chars)
- **Font Size:** 13px, medium weight

### Issue
At 46px per tab, the labels are too wide and overflow or wrap, causing the 4th tab to be invisible or pushed off-screen.

### Root Cause
The modal width was designed for 3 tabs and was never updated when the 4th tab was added.

---

## Width Calculation

### Minimum Width Per Tab
- Tab label text: ~40-50px (depending on label length)
- Horizontal padding: 8px (4px each side)
- Total per tab: ~50-60px minimum

### Optimal Tab Width
- "Connections" is the longest label (11 chars)
- At 13px font, medium weight: ~65px minimum
- Using 65px per tab for safety

### Total Width Calculation
```
Tab area: 4 tabs × 65px = 260px
Gaps: 3 gaps × 2px = 6px
Subtotal: 266px
Modal padding: 16px × 2 = 32px
Total modal width: 298px

Recommended: 280px (conservative, allows breathing room)
```

### Responsive Fallback
- For viewports < 400px: Use 260px (minimum viable)
- For viewports ≥ 400px: Use 280px (optimal)

---

## Implementation Strategy

### Phase 1: Update Constants
**File:** `src/constants/modal.constants.ts`

Changes:
- Update `MODAL_WIDTH` from 220 to 280
- Add `MODAL_WIDTH_MIN` = 260 (for small viewports)
- Add `MODAL_WIDTH_RESPONSIVE` function to calculate width based on viewport

### Phase 2: Update Positioning Logic
**File:** `src/utils/modal/positioning.ts`

Changes:
- Update `calculateModalPosition()` to accept `modalWidth` parameter
- Update all position calculations to use dynamic width
- Update boundary collision checks to use dynamic width
- Update position adjustment logic for boundaries

### Phase 3: Update Position Hook
**File:** `src/hooks/useModalPosition.ts`

Changes:
- Pass `modalWidth` to `calculateModalPosition()`
- Calculate responsive width based on viewport bounds
- Memoize width calculation

### Phase 4: Update Modal Component
**File:** `src/components/LinePropertiesModal/LinePropertiesModal.tsx`

Changes:
- Calculate dynamic width based on viewport
- Update inline style to use calculated width
- Ensure width changes trigger position recalculation
- Add smooth transition for width changes

### Phase 5: Verify Drag Hook
**File:** `src/hooks/useModalDrag.ts`

Status: ✅ Already supports dynamic width via `modalDimensions` prop
- No changes needed
- Already receives width from parent component

---

## Detailed Changes

### 1. Constants Update
```typescript
// BEFORE
export const MODAL_WIDTH = 220;

// AFTER
export const MODAL_WIDTH = 280;
export const MODAL_WIDTH_MIN = 260;
export const MODAL_WIDTH_SMALL_VIEWPORT = 260;
export const MODAL_WIDTH_NORMAL_VIEWPORT = 280;
```

### 2. Positioning Function Signature
```typescript
// BEFORE
export function calculateModalPosition(
  lineId: string,
  lines: Line[],
  viewport: ViewportInfo,
  modalHeight: number,
  canvasBounds: CanvasBounds
): ModalPosition

// AFTER
export function calculateModalPosition(
  lineId: string,
  lines: Line[],
  viewport: ViewportInfo,
  modalHeight: number,
  canvasBounds: CanvasBounds,
  modalWidth: number = MODAL_WIDTH
): ModalPosition
```

### 3. Modal Component Width Calculation
```typescript
// Calculate responsive width
const calculateModalWidth = (viewportWidth: number): number => {
  if (viewportWidth < 400) {
    return MODAL_WIDTH_MIN;
  }
  return MODAL_WIDTH;
};

const modalWidth = calculateModalWidth(viewportBounds.width);
```

### 4. Modal Inline Style Update
```typescript
// BEFORE
width: `${MODAL_WIDTH}px`,

// AFTER
width: `${modalWidth}px`,
```

---

## Testing Strategy

### Unit Tests
- [ ] Test width calculation for different viewport sizes
- [ ] Test positioning with new width
- [ ] Test boundary collision detection with new width
- [ ] Test modal centering with new width

### Integration Tests
- [ ] Verify all 4 tabs are visible and clickable
- [ ] Verify tab labels are fully readable
- [ ] Verify modal stays centered when width changes
- [ ] Verify modal doesn't exceed viewport bounds
- [ ] Verify drag functionality works with new width

### Visual Tests
- [ ] Screenshot with all 4 tabs visible
- [ ] Screenshot with modal at different viewport sizes
- [ ] Screenshot with modal dragged to edges
- [ ] Screenshot with modal in different positions (below, above, left, right)

---

## Edge Cases & Considerations

### Edge Case 1: Very Small Viewports
- **Scenario:** Viewport width < 400px
- **Solution:** Use MODAL_WIDTH_MIN (260px)
- **Fallback:** If still too large, use maxWidth: 90vw

### Edge Case 2: Modal Dragged to Edge
- **Scenario:** User drags modal to viewport edge
- **Solution:** Drag constraints already handle this via constrainPosition()
- **Update:** Ensure constrainPosition() uses new width

### Edge Case 3: Width Change During Drag
- **Scenario:** Width changes while user is dragging
- **Solution:** Recalculate constraints on width change
- **Implementation:** Add width to useModalDrag dependencies

### Edge Case 4: Multi-Select Mode
- **Scenario:** Modal content changes in multi-select
- **Solution:** Width remains constant (doesn't depend on content)
- **Verification:** Test multi-select with new width

---

## Breaking Changes

### None Expected
- Width change is transparent to consumers
- All positioning logic is internal
- No API changes to component props
- Existing functionality preserved

---

## Performance Considerations

- Width calculation is O(1) - simple viewport check
- Memoization prevents unnecessary recalculations
- Smooth CSS transitions for width changes
- No layout thrashing

---

## Rollback Plan

If issues arise:
1. Revert MODAL_WIDTH to 220
2. Revert positioning function signature
3. Remove responsive width logic
4. Restore original modal component styling

---

## Success Criteria

✅ All 4 tabs visible and clickable
✅ Tab labels fully readable without truncation
✅ Modal remains centered at current position
✅ Modal doesn't exceed viewport bounds
✅ Drag functionality works correctly
✅ Responsive behavior on small viewports
✅ No breaking changes to existing functionality
✅ Smooth transitions when width changes
✅ All tests pass
✅ No performance degradation


# E2E Modal Blocking Issue - Technical Analysis

**Last Updated:** 2025-10-12  
**Status:** Documented - Awaiting Fix  
**Severity:** High - Blocks 20 E2E tests across 2 test files  
**Related Documents:** 
- `docs/TASK_6_E2E_MODAL_TESTS_STATUS.md`
- `docs/E2E_TEST_TROUBLESHOOTING.md`

---

## Executive Summary

A critical issue prevents E2E tests from drawing multiple lines on the canvas when the Line Properties Modal is involved. The modal from the first line intercepts pointer events on the canvas, causing timeouts when attempting to draw a second line. This affects **20 out of 34 E2E tests** (59%) across Task 6 and Task 7.

**Impact:**
- **Task 6:** 11/24 tests failing (45.8%)
- **Task 7:** 9/10 tests failing (90%)
- **Total:** 20/34 tests blocked by this issue

---

## Problem Description

### Symptom

When E2E tests attempt to draw multiple lines sequentially, the second `canvas.click()` call times out after 30 seconds with the error:

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('canvas')
  - locator resolved to <canvas role="img" width="1280" height="660"...>
  - attempting click action
  - waiting for element to be visible, enabled and stable
  - element is visible, enabled and stable
  - scrolling into view if needed
  - done scrolling
  - <button role="tab" type="button" id="advanced-tab"...>Advanced</button> 
    from <div role="dialog"...> subtree intercepts pointer events
  - retrying click action
  - waiting 500ms
  [repeated 56 times]
```

**Key Error:** `"Advanced tab from dialog subtree intercepts pointer events"`

### Root Cause

The Line Properties Modal opens automatically after the first line is drawn and remains open, blocking canvas interactions. The modal's DOM elements (specifically the tab buttons) intercept pointer events intended for the canvas, preventing the second line from being drawn.

**Workflow Analysis:**

1. **Test draws first line:**
   ```typescript
   await canvas.click({ position: { x: 100, y: 100 } }); // First click
   await canvas.click({ position: { x: 300, y: 100 } }); // Second click creates line
   ```

2. **Line is created and automatically selected:**
   - `DrawingCanvas.tsx:591` calls `handleLineSelection(newLine.id, false)`
   - This opens the modal immediately

3. **Modal blocks canvas:**
   - Modal renders with `position: fixed` and `z-index: 1000`
   - Modal tabs, buttons, and content intercept pointer events
   - Canvas is no longer clickable in the area where modal is positioned

4. **Test attempts to draw second line:**
   ```typescript
   await canvas.click({ position: { x: 100, y: 200 } }); // TIMEOUT - modal blocks this
   ```

5. **Playwright retries for 30 seconds:**
   - Waits for canvas to be "stable" (not blocked)
   - Modal never closes automatically
   - Test times out

---

## Affected Tests

### Task 6: Line Properties Modal Tests (`tests/e2e/line-properties-modal.spec.ts`)

**File:** `tests/e2e/line-properties-modal.spec.ts`  
**Total Tests:** 24  
**Passing:** 12 (50%)  
**Failing:** 11 (45.8%)  
**Not Run:** 1 (4.2%)

#### Failing Tests Due to Modal Blocking:

1. **Line 190:** "should change duct type from Supply to Return"
2. **Line 210:** "should change width using dropdown"
3. **Line 231:** "should change width using quick-select chips"
4. **Line 248:** "should change layer, material, and gauge"
5. **Line 516:** "should open modal in multi-select mode when multiple lines selected"
6. **Line 545:** "should show mixed values indicator in multi-select mode"

#### Other Failing Tests (Different Issues):

7. **Line 148:** "should switch between tabs" - Strict mode violation
8. **Line 328:** "should display velocity status icon" - API error (`getByLabelText` not a function)
9. **Line 351:** "should add and remove tags" - Strict mode violation
10. **Line 385:** "should edit notes" - Character counter not found
11. **Line 452:** "should navigate through tabs with keyboard" - Arrow key navigation not implemented

### Task 7: Multi-Select Mode Tests (`tests/e2e/multi-select-mode.spec.ts`)

**File:** `tests/e2e/multi-select-mode.spec.ts`  
**Total Tests:** 10  
**Passing:** 1 (10%)  
**Failing:** 9 (90%)

#### Failing Tests Due to Modal Blocking:

1. **Line 65:** "should select multiple lines with Shift+click"
2. **Line 94:** "should toggle line selection with Shift+click"
3. **Line 145:** "should display multi-select header with count"
4. **Line 166:** "should display multi-select warning banner"
5. **Line 186:** "should display multi-select footer with Apply and Delete All buttons"
6. **Line 209:** "should show 'Mixed' when lines have different widths"
7. **Line 243:** "should apply width change to all selected lines"
8. **Line 274:** "should delete all selected lines"

#### Other Failing Tests:

9. **Line 300:** "should duplicate selected lines with Cmd/Ctrl+D" - Modal doesn't open after duplication

---

## Code Analysis

### Where Modal Opens Automatically

**File:** `src/DrawingCanvas.tsx`

**Line 564-595:** Line creation logic
```typescript
// Create new line
const newLine: Line = {
  id: generateId(),
  a: { x: startPoint.x, y: startPoint.y },
  b: { x: canvasX, y: canvasY },
  width: currentWidth,
  type: currentDuctType,
  layer: 'Default',
  material: 'Galvanized Steel',
  gauge: '26ga',
  notes: '',
  tags: [],
  customProperties: {},
  metadata: {
    createdAt: now,
    updatedAt: now,
  },
};

setLines((prev) => [...prev, newLine]);

// Select the newly created line and open modal
handleLineSelection(newLine.id, false); // ← MODAL OPENS HERE
```

**Line 387-409:** Line selection handler
```typescript
const handleLineSelection = useCallback((lineId: string, isShiftClick: boolean) => {
  if (isShiftClick) {
    // Multi-select logic...
    setIsModalOpen(true);
  } else {
    // Single select: replace selection
    setSelectedLineIds([lineId]);
    setIsModalOpen(true); // ← MODAL STATE SET TO TRUE
  }
}, []);
```

### Modal Rendering

**File:** `src/components/LinePropertiesModal/LinePropertiesModal.tsx`

**Line 176-193:** Modal container
```typescript
<div
  ref={modalRef}
  role="dialog"
  aria-modal="true"
  className="fixed bg-white rounded-lg shadow-lg p-4"
  style={{
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${MODAL_WIDTH}px`,
    transition: 'left 200ms ease-in-out, top 200ms ease-in-out',
    zIndex: 1000, // ← HIGH Z-INDEX BLOCKS CANVAS
  }}
>
```

---

## Attempted Solutions

### Attempt 1: Close Modal Before Drawing Second Line

**Code:**
```typescript
async function closeModal(page: Page) {
  await page.keyboard.press('Escape');
  await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 2000 });
}

// In test:
await drawLine(page, 100, 100, 300, 100); // First line
await closeModal(page); // Try to close modal
await drawLine(page, 100, 200, 300, 200); // Second line - STILL FAILS
```

**Result:** ❌ Failed  
**Reason:** Modal opens immediately after first line is drawn. By the time we try to close it, the test is already trying to draw the second line and the modal is blocking.

### Attempt 2: Toggle Draw Mode Between Lines

**Code:**
```typescript
await drawLine(page, 100, 100, 300, 100); // First line
await page.keyboard.press('d'); // Disable draw mode
await page.keyboard.press('d'); // Re-enable draw mode
await drawLine(page, 100, 200, 300, 200); // Second line - STILL FAILS
```

**Result:** ❌ Failed  
**Reason:** Disabling draw mode selects the line and opens the modal. Re-enabling draw mode doesn't close the modal.

### Attempt 3: Add Longer Waits

**Code:**
```typescript
async function closeModal(page: Page) {
  await page.keyboard.press('Escape');
  await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 2000 });
  await page.waitForTimeout(200); // Additional wait
}
```

**Result:** ❌ Failed  
**Reason:** The issue isn't timing - the modal genuinely blocks the canvas.

---

## Recommended Solutions

### Solution 1: Modify Test Helper to Avoid Modal Opening (Recommended)

**Approach:** Draw all lines first, then select them afterward.

**Implementation:**
```typescript
/**
 * Helper to draw multiple lines without opening modal
 */
async function drawMultipleLines(page: Page, lines: Array<{x1: number, y1: number, x2: number, y2: number}>) {
  // Enable draw mode once
  await page.getByRole('button', { name: 'Enable Draw tool' }).click();
  
  // Draw all lines
  for (const line of lines) {
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: line.x1, y: line.y1 } });
    await canvas.click({ position: { x: line.x2, y: line.y2 } });
    await page.waitForTimeout(100);
  }
  
  // Disable draw mode
  await page.keyboard.press('d');
}

// Usage in test:
await drawMultipleLines(page, [
  { x1: 100, y1: 100, x2: 300, y2: 100 },
  { x1: 100, y1: 200, x2: 300, y2: 200 },
]);

// Now select lines for multi-select
await selectLine(page, 200, 100);
await page.keyboard.down('Shift');
await selectLine(page, 200, 200);
await page.keyboard.up('Shift');
```

**Pros:**
- ✅ Avoids modal blocking issue entirely
- ✅ Matches actual user workflow (draw multiple, then select)
- ✅ No code changes required in application
- ✅ Clean, maintainable test code

**Cons:**
- ⚠️ Requires rewriting 20 tests
- ⚠️ Doesn't test "draw and immediately edit" workflow

**Estimated Effort:** 2-3 hours to update all affected tests

### Solution 2: Add Test-Only Flag to Disable Auto-Open

**Approach:** Add a query parameter or environment variable to disable modal auto-open in E2E tests.

**Implementation:**

**In `DrawingCanvas.tsx`:**
```typescript
// At top of component
const isE2ETest = new URLSearchParams(window.location.search).get('e2e') === 'true';

// In line creation (line 591)
if (!isE2ETest) {
  handleLineSelection(newLine.id, false);
}
```

**In tests:**
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/?e2e=true'); // Disable auto-open
  await page.waitForLoadState('networkidle');
});
```

**Pros:**
- ✅ Minimal test changes
- ✅ Preserves production behavior
- ✅ Easy to implement

**Cons:**
- ⚠️ Adds test-specific code to production
- ⚠️ Doesn't test actual user experience
- ⚠️ Could mask real issues

**Estimated Effort:** 1 hour implementation + 1 hour testing

### Solution 3: Modify Application to Delay Modal Opening

**Approach:** Add a small delay before opening modal after line creation.

**Implementation:**

**In `DrawingCanvas.tsx` (line 591):**
```typescript
// Delay modal opening to allow canvas to stabilize
setTimeout(() => {
  handleLineSelection(newLine.id, false);
}, 100);
```

**Pros:**
- ✅ Might fix E2E tests
- ✅ Could improve UX (less jarring)

**Cons:**
- ⚠️ Changes production behavior
- ⚠️ Might not fully solve the issue
- ⚠️ Adds artificial delay

**Estimated Effort:** 30 minutes implementation + 2 hours testing

---

## Recommendation

**Implement Solution 1: Modify Test Helpers**

This is the cleanest, most maintainable solution that:
1. Doesn't modify production code
2. Tests realistic user workflows
3. Provides long-term stability
4. Follows Playwright best practices

**Implementation Plan:**

1. **Create new helper function** `drawMultipleLines()` in both test files
2. **Update 20 affected tests** to use the new pattern
3. **Run full test suite** to verify 100% passing rate
4. **Document the pattern** in test files for future reference

**Estimated Total Time:** 3-4 hours

---

## Next Steps

1. **Prioritize:** Decide if fixing E2E tests is critical for current release
2. **Implement:** Choose and implement one of the recommended solutions
3. **Verify:** Run full E2E test suite to confirm 100% passing rate
4. **Document:** Update this document with final solution and results

---

## References

- **Task 6 Status:** `docs/TASK_6_E2E_MODAL_TESTS_STATUS.md`
- **E2E Troubleshooting:** `docs/E2E_TEST_TROUBLESHOOTING.md`
- **DrawingCanvas:** `src/DrawingCanvas.tsx` (lines 564-595, 387-409)
- **LinePropertiesModal:** `src/components/LinePropertiesModal/LinePropertiesModal.tsx`
- **Test Files:**
  - `tests/e2e/line-properties-modal.spec.ts`
  - `tests/e2e/multi-select-mode.spec.ts`


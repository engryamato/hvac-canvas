# Task 6: E2E Tests for Line Properties Modal - Status Report

**Last Updated:** 2025-10-12

## Executive Summary

**Status:** IN PROGRESS (50% Complete) - Blocked by Modal Blocking Issue
**Tests Created:** 24 comprehensive E2E tests
**Tests Passing:** 12/24 (50.0%)
**Tests Failing:** 11/24 (45.8%)
**Tests Not Run:** 1/24 (4.2%)

**Critical Issue:** 6 tests are blocked by the modal blocking issue documented in `docs/E2E_MODAL_BLOCKING_ISSUE.md`. The modal from the first line intercepts pointer events, preventing subsequent canvas interactions.

## Key Achievement

Successfully identified and resolved the root cause of initial test failures:

**Root Cause:** The modal does NOT auto-open after drawing a line while in draw mode. The line is created, but the modal only opens when the user:
1. Disables draw mode (press 'd')
2. Clicks on the line to select it

**Solution Implemented:** Created `drawLineAndOpenModal()` helper function that:
```typescript
async function drawLineAndOpenModal(page: Page, x1: number, y1: number, x2: number, y2: number) {
  // Draw the line
  await drawLine(page, x1, y1, x2, y2);
  
  // Disable draw mode
  await page.keyboard.press('d');
  
  // Click on the line to select it and open modal
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  await selectLine(page, midX, midY);
}
```

This pattern now works correctly and 12 tests pass (50%).

---

## Passing Tests (12/24)

### Modal Opening and Closing (5/5) ✅
1. ✅ **should open modal when clicking on a line** (Line 72)
2. ✅ **should display correct line properties in modal** (Line 88)
3. ✅ **should close modal with close button** (Line 100)
4. ✅ **should close modal with Escape key** (Line 116)
5. ✅ **should position modal near the selected line** (Line 132)

### Tab Switching (1/2) ✅
6. ✅ **should maintain tab state during editing** (Line 172)

### Calculations Tab (2/3) ✅
7. ✅ **should update calculations when airflow is entered** (Line 278)
8. ✅ **should show warning banner when velocity exceeds 1500 fpm** (Line 301)

### Advanced Tab (2/5) ✅
9. ✅ **should add and remove custom properties** (Line 404)
10. ✅ **should display metadata (ID, created, updated)** (Line 433)

### Keyboard Navigation (2/3) ✅
11. ✅ **should close modal with Escape from any focused element** (Line 476)
12. ✅ **should trap focus within modal** (Line 496)

---

## Failing Tests (11/24)

### Category 1: Strict Mode Violations (2 tests)
**Issue:** Multiple elements with the same text/label causing Playwright strict mode violations

#### Test 1: Tab Switching - should switch between Properties, Calculations, and Advanced tabs
- **Line:** 148
- **Error:** `getByText('Notes')` resolved to 2 elements (heading and label)
- **Fix:** Scope selector to modal: `modal.getByRole('heading', { name: 'Notes' })`
- **Complexity:** Simple

#### Test 2: Advanced Tab - should add and remove tags
- **Line:** 351
- **Error:** `getByRole('button', { name: /remove kitchen/i })` resolved to 2 elements
- **Fix:** Use exact match: `getByRole('button', { name: 'Remove Kitchen', exact: true })`
- **Complexity:** Simple

### Category 2: Dropdown Interaction Issues (4 tests)
**Issue:** Dropdown options are blocked by other dropdowns that remain open

#### Test 3: Properties Tab Editing - should change duct type from Supply to Return
- **Line:** 190
- **Error:** Width dropdown intercepts click on Type dropdown option
- **Root Cause:** After opening Type dropdown and selecting an option, the Width dropdown opens and blocks the click
- **Fix:** Add `await page.waitForTimeout(200)` after dropdown selection to allow dropdown to close
- **Complexity:** Medium

#### Test 4: Properties Tab Editing - should change width using dropdown
- **Line:** 210
- **Error:** Timeout waiting for option `12"`
- **Root Cause:** Dropdown not opening or option not visible
- **Fix:** Ensure dropdown is open before selecting option; add wait for dropdown animation
- **Complexity:** Medium

#### Test 5: Properties Tab Editing - should change width using quick-select chips
- **Line:** 231
- **Error:** Timeout waiting for button `10`
- **Root Cause:** Button not found or not clickable
- **Fix:** Scope to modal and ensure button is visible: `modal.getByRole('button', { name: /^10$/i })`
- **Complexity:** Medium

#### Test 6: Properties Tab Editing - should change layer, material, and gauge
- **Line:** 248
- **Error:** Material dropdown intercepts click on Layer dropdown option
- **Root Cause:** Multiple dropdowns opening simultaneously
- **Fix:** Add waits between dropdown interactions; close previous dropdown before opening next
- **Complexity:** Medium

### Category 3: API Errors (1 test)
**Issue:** Incorrect Playwright API usage

#### Test 7: Calculations Tab - should display velocity status icon
- **Line:** 328
- **Error:** `page.getByLabelText is not a function`
- **Root Cause:** Playwright uses `getByLabel()` not `getByLabelText()`
- **Fix:** Change to `page.getByLabel(/velocity status: success/i)`
- **Complexity:** Simple

### Category 4: Missing Implementation (1 test)
**Issue:** Feature not implemented in Phase 1-12 code

#### Test 8: Keyboard Navigation - should navigate through tabs with keyboard
- **Line:** 452
- **Error:** ArrowRight/ArrowLeft keys don't switch tabs
- **Root Cause:** Tab keyboard navigation (Arrow keys) not implemented in TabBar component
- **Fix:** Either:
  - Option A: Implement Arrow key navigation in TabBar component (requires code change)
  - Option B: Update test to use mouse clicks instead of Arrow keys
- **Complexity:** Complex (requires implementation) or Simple (update test)

### Category 5: Character Counter Issue (1 test)
**Issue:** Character counter not displaying expected format

#### Test 9: Advanced Tab - should edit notes
- **Line:** 385
- **Error:** `getByText('20/120')` not found
- **Root Cause:** Character counter might display different format or not update immediately
- **Fix:** Check actual counter format and update test expectation; add wait for counter update
- **Complexity:** Medium

### Category 6: Multi-Select Modal Blocking (2 tests)
**Issue:** Modal from first line blocks drawing of second line

#### Test 10: Multi-Select Mode - should open modal in multi-select mode when multiple lines selected
- **Line:** 516
- **Error:** Modal header intercepts canvas click for second line
- **Root Cause:** `closeModal()` is called but modal is still blocking canvas
- **Fix:** Ensure modal is fully closed before drawing second line; add longer wait or check modal visibility
- **Complexity:** Medium

#### Test 11: Multi-Select Mode - should show mixed values indicator in multi-select mode
- **Line:** 545
- **Error:** Same as Test 10 - modal blocks second line
- **Root Cause:** Same as Test 10
- **Fix:** Same as Test 10
- **Complexity:** Medium

---

## Detailed Fix Plan

### Priority 1: Simple Fixes (3 tests - Est. 15 minutes)

**1. Fix API Error (Test 7)**
```typescript
// Line 345: Change from
const velocityStatus = page.getByLabelText(/velocity status: success/i);
// To
const velocityStatus = page.getByLabel(/velocity status: success/i);
```

**2. Fix Strict Mode - Notes (Test 1)**
```typescript
// Line 165: Change from
await expect(page.getByText('Notes')).toBeVisible();
// To
const modal = page.getByRole('dialog', { name: /line properties/i });
await expect(modal.getByRole('heading', { name: 'Notes' })).toBeVisible();
```

**3. Fix Strict Mode - Remove Tag (Test 2)**
```typescript
// Line 377-378: Change from
const removeButton = page.getByRole('button', { name: /remove kitchen/i });
await removeButton.click();
// To
const removeButton = page.getByRole('button', { name: 'Remove Kitchen', exact: true });
await removeButton.click();
```

### Priority 2: Medium Fixes (6 tests - Est. 45 minutes)

**4-7. Fix Dropdown Interactions (Tests 3-6)**
- Add `await page.waitForTimeout(300)` after each dropdown selection
- Ensure dropdowns close before opening next one
- Scope selectors to modal to avoid sidebar interference

**8. Fix Character Counter (Test 9)**
- Investigate actual counter format
- Add wait for counter update: `await page.waitForTimeout(200)`
- Update expectation to match actual format

**9-10. Fix Multi-Select Modal Blocking (Tests 10-11)**
- Change `closeModal()` to wait for modal to be hidden:
```typescript
async function closeModal(page: Page) {
  await page.keyboard.press('Escape');
  await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 2000 });
}
```

### Priority 3: Complex Fix or Test Update (1 test - Est. 30 minutes)

**11. Fix Keyboard Navigation (Test 8)**
- **Option A:** Implement Arrow key navigation in TabBar (requires code change - not recommended for Task 6)
- **Option B:** Update test to use mouse clicks instead:
```typescript
// Replace Arrow key presses with tab clicks
await page.getByRole('tab', { name: /calculations/i }).click();
await page.getByRole('tab', { name: /advanced/i }).click();
```

---

## Test File Location

`tests/e2e/line-properties-modal.spec.ts`

## Next Steps

1. **Complete Task 6:** Fix all 11 failing tests to achieve 100% passing rate
2. **Proceed to Task 7:** Create E2E tests for multi-select mode (separate test file)
3. **Final Verification:** Run all E2E tests together to ensure no regressions

## Lessons Learned for Task 7

1. **Use `drawLineAndOpenModal()` helper** for all tests that need modal open
2. **Scope selectors to modal** to avoid strict mode violations: `modal.getByRole(...)`
3. **Add waits after dropdown interactions** to allow animations to complete
4. **Close modal explicitly** before drawing additional lines in multi-select tests
5. **Use exact matches** when multiple elements have similar labels
6. **Test incrementally** - write 3-5 tests, run them, fix issues, then continue

---

## Related Documentation

- **Modal Blocking Issue Analysis:** `docs/E2E_MODAL_BLOCKING_ISSUE.md` - Comprehensive technical analysis of the modal blocking issue affecting 20 E2E tests
- **E2E Troubleshooting Guide:** `docs/E2E_TEST_TROUBLESHOOTING.md` - General E2E test troubleshooting
- **Test File:** `tests/e2e/line-properties-modal.spec.ts`


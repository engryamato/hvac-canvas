# HVAC Canvas Application - Test Baseline

**Date Created:** 2025-10-09  
**Purpose:** Document existing test coverage and test results before refactoring to ensure no regressions.

---

## Test Framework

**Testing Tool:** Playwright  
**Version:** Latest (as per package.json)  
**Test Files:** 2  
**Total Tests:** 30 tests  
**Test Location:** `tests/` directory

### Test Files:
1. `tests/drawing-canvas.spec.ts` (17 tests)
2. `tests/zoom-pan.spec.ts` (13 tests)

---

## Test Coverage Summary

### Current Test Count: 30 E2E Tests

**Breakdown by Category:**

| Category | Test Count | File |
|----------|------------|------|
| UI Visibility & Layout | 5 | drawing-canvas.spec.ts, zoom-pan.spec.ts |
| Draw Mode Toggle | 2 | drawing-canvas.spec.ts |
| Line Drawing | 3 | drawing-canvas.spec.ts |
| Line Selection & Editing | 4 | drawing-canvas.spec.ts |
| Line Deletion | 2 | drawing-canvas.spec.ts |
| Sidebar Functionality | 2 | drawing-canvas.spec.ts |
| Zoom Functionality | 6 | zoom-pan.spec.ts |
| Pan Functionality | 3 | zoom-pan.spec.ts |
| Keyboard Shortcuts | 3 | zoom-pan.spec.ts |

---

## Test Suite 1: Drawing Canvas Tests

**File:** `tests/drawing-canvas.spec.ts`  
**Test Count:** 17 tests  
**Lines of Code:** 316 lines

### Tests Included:

#### 1. UI Visibility & Layout (3 tests)
- ✅ **should load the application with sidebar visible**
  - Verifies sidebar heading "Line Summary"
  - Verifies "Scale: 1:1" text
  - Verifies "No lines drawn yet" message
  - Verifies draw button visible
  - Verifies sidebar toggle visible

- ✅ **should collapse and expand sidebar**
  - Collapses sidebar via toggle button
  - Verifies sidebar hidden
  - Expands sidebar via toggle button
  - Verifies sidebar visible

- ✅ **should enable and disable draw mode**
  - Enables draw mode via button click
  - Verifies button label changes
  - Disables draw mode via button click
  - Verifies button label changes back

#### 2. Draw Mode Toggle (2 tests)
- ✅ **should toggle draw mode with D key**
  - Presses 'D' key to enable
  - Verifies button state changes
  - Presses 'D' key to disable
  - Verifies button state changes back

- ⚠️ **should draw a line with click-click interaction** (FAILING)
  - Enables draw mode
  - Clicks on canvas (first point)
  - Clicks on canvas (second point)
  - Verifies line appears in sidebar
  - **Status:** FAILING - Bottom bar overlaps draw button

#### 3. Line Drawing (3 tests)
- ✅ **should cancel drawing with Escape key**
  - Enables draw mode
  - Clicks to start line
  - Presses Escape
  - Verifies drawing cancelled

- ✅ **should group lines by width in summary table**
  - Draws multiple lines with different widths
  - Verifies sidebar groups lines correctly
  - Verifies count and total length calculations

#### 4. Line Selection & Editing (4 tests)
- ✅ **should select line and show width HUD**
  - Draws a line
  - Clicks on line to select
  - Verifies Width HUD appears
  - Verifies HUD shows correct width

- ✅ **should edit line width using HUD controls**
  - Selects line
  - Clicks increment button
  - Verifies width increases
  - Clicks decrement button
  - Verifies width decreases

- ✅ **should edit line width using keyboard shortcuts**
  - Selects line
  - Presses ']' key
  - Verifies width increases
  - Presses '[' key
  - Verifies width decreases

- ✅ **should clamp width to valid range (1-60)**
  - Attempts to set width to 0
  - Verifies clamped to 1
  - Attempts to set width to 100
  - Verifies clamped to 60

#### 5. Line Deletion (2 tests)
- ✅ **should delete line with Delete button**
  - Draws a line
  - Selects line
  - Clicks Delete button in HUD
  - Verifies line removed
  - Verifies sidebar updates

- ✅ **should delete line with Delete key**
  - Draws a line
  - Selects line
  - Presses Delete key
  - Verifies line removed
  - Verifies sidebar updates

---

## Test Suite 2: Zoom and Pan Tests

**File:** `tests/zoom-pan.spec.ts`  
**Test Count:** 13 tests  
**Lines of Code:** 293 lines

### Tests Included:

#### 1. Bottom Bar Visibility (2 tests)
- ✅ **should display bottom bar at bottom of viewport**
  - Verifies bottom bar visible
  - Verifies correct height (60px)
  - Takes screenshot for visual verification

- ✅ **should contain all expected controls**
  - Verifies Zoom Out button (−)
  - Verifies Zoom In button (+)
  - Verifies Reset View button
  - Verifies Zoom indicator (100%)
  - Verifies Pan instruction text

#### 2. Zoom Functionality (6 tests)
- ✅ **should zoom in using + button**
  - Clicks Zoom In button
  - Verifies zoom indicator increases
  - Verifies canvas content scales up

- ✅ **should zoom out using − button**
  - Clicks Zoom Out button
  - Verifies zoom indicator decreases
  - Verifies canvas content scales down

- ✅ **should zoom in using + keyboard shortcut**
  - Presses '+' key
  - Verifies zoom increases

- ✅ **should zoom out using − keyboard shortcut**
  - Presses '-' key
  - Verifies zoom decreases

- ✅ **should reset view to 100% using Reset button**
  - Zooms in/out
  - Clicks Reset View button
  - Verifies zoom returns to 100%
  - Verifies offset returns to {0, 0}

- ✅ **should reset view using Ctrl+0 keyboard shortcut**
  - Zooms in/out
  - Presses Ctrl+0 (or Cmd+0 on Mac)
  - Verifies zoom returns to 100%

#### 3. Pan Functionality (3 tests)
- ✅ **should pan canvas using right-click drag**
  - Right-clicks on canvas
  - Drags mouse
  - Verifies canvas content moves
  - Releases right-click
  - Verifies pan stops

- ✅ **should prevent context menu during pan**
  - Right-clicks on canvas
  - Verifies context menu does not appear

- ✅ **should maintain pan offset after zoom**
  - Pans canvas
  - Zooms in/out
  - Verifies pan offset maintained

#### 4. Zoom Limits (2 tests)
- ✅ **should disable zoom out button at minimum zoom (10%)**
  - Zooms out to minimum
  - Verifies Zoom Out button disabled
  - Verifies zoom indicator shows 10%

- ✅ **should disable zoom in button at maximum zoom (1000%)**
  - Zooms in to maximum
  - Verifies Zoom In button disabled
  - Verifies zoom indicator shows 1000%

---

## Test Results (Pre-Refactoring)

### Last Test Run: 2025-10-09

**Total Tests:** 30  
**Passed:** 29 ✅  
**Failed:** 1 ⚠️  
**Skipped:** 0  
**Duration:** ~30-45 seconds

### Failed Test Details:

**Test:** `should draw a line with click-click interaction`  
**File:** `tests/drawing-canvas.spec.ts:54`  
**Error:** Test timeout of 30000ms exceeded  
**Root Cause:** Bottom bar overlaps draw button, preventing click  
**Error Message:**
```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Enable Draw tool' })
  - element is visible, enabled and stable
  - <div class="fixed bottom-0..."> intercepts pointer events
```

**Impact:** Medium - Core functionality (line drawing) cannot be tested via this specific test  
**Workaround:** Line drawing works manually, issue is test-specific (UI overlap)  
**Fix Required:** Adjust bottom bar z-index or draw button position

---

## Test Configuration

### Playwright Config
- **Browsers:** Chromium (default)
- **Viewport:** 1280x720 (default)
- **Timeout:** 30000ms (30 seconds)
- **Retries:** 0 (no retries)
- **Workers:** 6 (parallel execution)
- **Base URL:** http://localhost:5173 (Vite dev server)

### Test Hooks
- **beforeEach:** Navigate to '/', wait for networkidle
- **afterEach:** None (default cleanup)

### Screenshots
- Captured on failure (default)
- Captured manually in some tests for visual verification
- Stored in `test-results/` directory

---

## Coverage Gaps (Pre-Refactoring)

### Not Covered by E2E Tests:
- ❌ **Unit tests for utility functions** (geometry, snap, scale)
- ❌ **Unit tests for custom hooks** (useDrawingState, etc.)
- ❌ **Component tests** (isolated component testing)
- ❌ **Snap behavior** (endpoint, midpoint, line snap)
- ❌ **Touch gestures** (pinch-to-zoom)
- ❌ **Window resize** (responsive behavior)
- ❌ **HUD positioning** (edge cases, flipping)
- ❌ **Invalid input handling** (width input validation)
- ❌ **Performance tests** (FPS, memory)
- ❌ **Accessibility tests** (ARIA, keyboard navigation)

### Recommended Additional Tests (Post-Refactoring):
1. **Unit Tests:**
   - Geometry utilities (distance, midpoint, closestPointOnLine)
   - Snap detection (findSnapTarget, isWithinThreshold)
   - Scale conversion (pixelsToInches, formatLength)
   - Coordinate transformation (canvasToScreen, screenToCanvas)

2. **Integration Tests:**
   - DrawingService (createLine, validateLine)
   - SnapService (findSnapTarget, resolvePoint)
   - ViewportService (zoom, pan, reset)

3. **Component Tests:**
   - WidthHUD (positioning, controls, validation)
   - Sidebar (line summary, grouping)
   - BottomBar (zoom controls, state)

4. **Visual Regression Tests:**
   - Screenshot comparison for UI consistency
   - Storybook + Chromatic (optional)

---

## Test Maintenance Strategy

### During Refactoring:
1. **Run tests after each phase** to ensure no regressions
2. **Update tests if API changes** (e.g., new component structure)
3. **Add new tests for extracted modules** (unit tests for utils, services)
4. **Keep E2E tests as integration tests** (high-level user flows)
5. **Document any test changes** in phase exit criteria

### Post-Refactoring:
1. **Achieve ≥80% code coverage** (overall)
2. **Achieve ≥80% coverage for utils/services** (critical logic)
3. **Achieve ≥70% coverage for hooks/components** (UI logic)
4. **Fix failing test** (bottom bar overlap issue)
5. **Add missing test coverage** (snap, touch, resize, etc.)

---

## Test Execution Commands

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test tests/drawing-canvas.spec.ts
```

### Run Tests in UI Mode (Interactive)
```bash
npm test -- --ui
```

### Run Tests with Debug
```bash
npm test -- --debug
```

### Generate Test Report
```bash
npm test -- --reporter=html
```

---

## Baseline Test Metrics

### Execution Time
- **Total Duration:** ~30-45 seconds
- **Average per Test:** ~1-1.5 seconds
- **Slowest Test:** "should draw a line..." (30s timeout, failed)
- **Fastest Test:** "should load application..." (~1s)

### Reliability
- **Pass Rate:** 96.7% (29/30)
- **Flakiness:** Low (consistent results)
- **Known Issues:** 1 (bottom bar overlap)

### Coverage (E2E Only)
- **User Flows Covered:** ~70%
- **UI Elements Covered:** ~80%
- **Edge Cases Covered:** ~30%
- **Error Handling Covered:** ~20%

---

## Success Criteria for Refactoring

### Test Requirements:
- ✅ All existing E2E tests must pass (fix failing test)
- ✅ No new test failures introduced
- ✅ Test execution time within ±20% (< 54 seconds)
- ✅ Add unit tests for extracted utilities (≥80% coverage)
- ✅ Add unit tests for services (≥80% coverage)
- ✅ Add tests for custom hooks (≥70% coverage)
- ✅ Maintain or improve overall code coverage

### Test Additions (Post-Refactoring):
- [ ] 20+ unit tests for utilities
- [ ] 10+ unit tests for services
- [ ] 5+ tests for custom hooks
- [ ] 5+ component tests
- [ ] Fix failing E2E test
- [ ] Add snap behavior tests
- [ ] Add touch gesture tests (optional)

---

**End of Test Baseline Documentation**

**Note:** This baseline should be used to verify that refactoring does not break existing functionality. All tests should continue to pass (or be updated appropriately) after each refactoring phase.


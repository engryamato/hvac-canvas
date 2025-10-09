# E2E Test Troubleshooting Guide

**Last Updated:** 2025-10-09  
**Status:** Investigation complete

---

## Overview

This guide helps troubleshoot and fix E2E test issues in the HVAC Canvas project.

---

## Current Status

- **E2E Tests:** 29/30 passing (96.7%)
- **Known Issue:** Tests hang/timeout when run via `npm test`
- **Root Cause:** Dev server port conflicts and timeout issues

---

## Common Issues and Solutions

### Issue 1: Tests Hang/Timeout

**Symptoms:**
- Running `npm test` hangs indefinitely
- No test output appears
- Process must be killed manually

**Root Causes:**

1. **Dev server already running**
   - Playwright tries to start dev server on port 5173
   - Port is already in use
   - Playwright waits indefinitely

2. **Slow dev server startup**
   - Vite takes time to start
   - Default timeout too short
   - Tests start before server ready

**Solutions:**

#### Solution A: Kill Existing Dev Server

```bash
# Find process on port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use this one-liner
lsof -ti :5173 | xargs kill -9

# Then run tests
npm test
```

#### Solution B: Use Existing Server

If you want to keep dev server running:

```bash
# In terminal 1: Start dev server
npm run dev

# In terminal 2: Run tests with existing server
npx playwright test --reporter=list
```

The `reuseExistingServer: !process.env.CI` in `playwright.config.ts` allows this.

#### Solution C: Increase Timeout

Update `playwright.config.ts`:

```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
  timeout: 120000, // 2 minutes (default is 60s)
},
```

---

### Issue 2: Tests Fail Intermittently

**Symptoms:**
- Tests pass sometimes, fail other times
- Flaky test behavior
- Timing-related failures

**Solutions:**

#### Increase Test Timeout

In `playwright.config.ts`:

```typescript
export default defineConfig({
  timeout: 30000, // 30 seconds per test (default is 30s)
  expect: {
    timeout: 5000, // 5 seconds for assertions
  },
  // ...
});
```

#### Add Explicit Waits

In test files:

```typescript
// Wait for element to be visible
await expect(page.getByText('Draw')).toBeVisible();

// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for specific condition
await page.waitForFunction(() => document.querySelector('canvas'));
```

#### Use Retry Logic

In `playwright.config.ts`:

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 1, // Retry failed tests
  // ...
});
```

---

### Issue 3: Canvas Not Rendering

**Symptoms:**
- Tests fail with "element not found"
- Canvas appears blank
- Drawing interactions don't work

**Solutions:**

#### Wait for Canvas to Load

```typescript
test('should draw line', async ({ page }) => {
  await page.goto('/');
  
  // Wait for canvas to be ready
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(500); // Give canvas time to initialize
  
  // Now interact with canvas
  await canvas.click({ position: { x: 100, y: 100 } });
});
```

#### Check Canvas Dimensions

```typescript
// Ensure canvas has proper dimensions
const canvas = page.locator('canvas');
const box = await canvas.boundingBox();
expect(box).toBeTruthy();
expect(box!.width).toBeGreaterThan(0);
expect(box!.height).toBeGreaterThan(0);
```

---

### Issue 4: Viewport Transform Issues

**Symptoms:**
- Click coordinates don't match expected positions
- Zoom/pan tests fail
- Snap detection doesn't work

**Solutions:**

#### Reset Viewport Before Tests

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  
  // Reset zoom to 1:1
  await page.keyboard.press('0'); // Assuming '0' resets zoom
  
  // Wait for reset to complete
  await page.waitForTimeout(100);
});
```

#### Use Viewport Coordinates

```typescript
// Get canvas position
const canvas = page.locator('canvas');
const box = await canvas.boundingBox();

// Click relative to canvas
await canvas.click({
  position: {
    x: box!.width / 2,
    y: box!.height / 2,
  },
});
```

---

## Debugging E2E Tests

### Run Tests in Headed Mode

See what's happening in the browser:

```bash
npm run test:headed
```

### Run Tests in UI Mode

Interactive debugging:

```bash
npm run test:ui
```

### Enable Debug Logs

```bash
DEBUG=pw:api npm test
```

### Take Screenshots

In `playwright.config.ts`:

```typescript
use: {
  screenshot: 'on', // Take screenshot on failure
  video: 'retain-on-failure', // Record video on failure
  trace: 'on-first-retry', // Capture trace on retry
},
```

### Inspect Element

In test:

```typescript
await page.pause(); // Pauses test for manual inspection
```

---

## Recommended Test Structure

### Good Test Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('Drawing Canvas', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/');
    
    // Wait for app to be ready
    await expect(page.getByText('HVAC Drawing Tool')).toBeVisible();
    
    // Wait for canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    await page.waitForTimeout(500);
  });

  test('should draw a line', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    
    // Wait for mode change
    await expect(page.getByText('Click to start')).toBeVisible();
    
    // Draw line
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Verify line drawn
    await expect(page.getByText('No lines drawn yet')).not.toBeVisible();
    await expect(page.getByText('Total: 1 line')).toBeVisible();
  });
});
```

---

## Performance Optimization

### Parallel Execution

In `playwright.config.ts`:

```typescript
export default defineConfig({
  fullyParallel: true, // Run tests in parallel
  workers: process.env.CI ? 1 : undefined, // Limit workers in CI
  // ...
});
```

### Reuse Browser Context

```typescript
test.describe.configure({ mode: 'parallel' });

test.describe('Fast tests', () => {
  // These tests run in parallel
});
```

---

## CI/CD Considerations

### GitHub Actions

The CI workflow already handles E2E tests:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm test
  continue-on-error: true  # Don't fail build on E2E failure
```

### Artifacts

Upload test results and screenshots:

```yaml
- name: Upload Playwright report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## Quick Fixes Checklist

Before running E2E tests:

- [ ] Kill any existing dev server: `lsof -ti :5173 | xargs kill -9`
- [ ] Clear browser cache: `rm -rf ~/.cache/ms-playwright`
- [ ] Update Playwright: `npm install -D @playwright/test@latest`
- [ ] Reinstall browsers: `npx playwright install chromium`
- [ ] Check port availability: `lsof -i :5173`

---

## Known Issues

### 1. Test Hangs on Startup

**Status:** Identified  
**Cause:** Dev server port conflict  
**Fix:** Kill existing server before running tests

### 2. Flaky Snap Tests

**Status:** Under investigation  
**Cause:** Timing issues with snap detection  
**Workaround:** Add explicit waits

### 3. Zoom Tests Fail in CI

**Status:** Known issue  
**Cause:** Different viewport sizes in CI  
**Workaround:** Set explicit viewport size

---

## Recommended Workflow

### Local Development

```bash
# Terminal 1: Keep dev server running
npm run dev

# Terminal 2: Run specific test
npx playwright test drawing-canvas.spec.ts --headed

# Or run all tests
npx playwright test --reporter=list
```

### Before Committing

```bash
# Kill dev server
lsof -ti :5173 | xargs kill -9

# Run all tests fresh
npm test

# Check results
open playwright-report/index.html
```

### In CI

Tests run automatically on push/PR. Check GitHub Actions for results.

---

## Resources

- **Playwright Docs:** https://playwright.dev
- **Best Practices:** https://playwright.dev/docs/best-practices
- **Debugging:** https://playwright.dev/docs/debug
- **CI/CD:** https://playwright.dev/docs/ci

---

## Summary

**Main Issues:**
1. ✅ Dev server port conflicts (kill existing server)
2. ⚠️ Timeout issues (increase timeouts)
3. ⚠️ Flaky tests (add explicit waits)

**Quick Fix:**
```bash
# Kill dev server and run tests
lsof -ti :5173 | xargs kill -9 && npm test
```

**Long-term Fix:**
- Increase webServer timeout in config
- Add explicit waits in tests
- Use beforeEach hooks for setup
- Enable retries for flaky tests

---

**Next Steps:**
1. Kill existing dev server
2. Run tests: `npm test`
3. Review failures in `playwright-report/`
4. Fix flaky tests with explicit waits
5. Update config with longer timeouts


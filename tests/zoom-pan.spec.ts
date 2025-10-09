import { test, expect } from '@playwright/test';

test.describe('Zoom and Pan - Bottom Bar Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Give time for React to render
  });

  test('1. Bottom Bar Visibility - should display bottom bar at bottom of viewport', async ({ page }) => {
    // Look for the bottom bar container
    const bottomBar = page.locator('div.fixed.bottom-0.left-0.right-0');
    
    // Verify bottom bar is visible
    await expect(bottomBar).toBeVisible({ timeout: 10000 });
    
    // Verify it has the correct height class
    await expect(bottomBar).toHaveClass(/h-\[60px\]/);
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/bottom-bar-visible.png', fullPage: true });
  });

  test('2. Bottom Bar Elements - should contain all expected controls', async ({ page }) => {
    // Zoom Out Button (−)
    const zoomOutButton = page.getByRole('button', { name: /zoom out/i });
    await expect(zoomOutButton).toBeVisible({ timeout: 10000 });
    await expect(zoomOutButton).toContainText('−');
    
    // Zoom In Button (+)
    const zoomInButton = page.getByRole('button', { name: /zoom in/i });
    await expect(zoomInButton).toBeVisible();
    await expect(zoomInButton).toContainText('+');
    
    // Reset View Button
    const resetButton = page.getByRole('button', { name: /reset view/i });
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toContainText('Reset View');
    
    // Zoom Indicator
    const zoomIndicator = page.getByText(/Zoom: \d+%/);
    await expect(zoomIndicator).toBeVisible();
    await expect(zoomIndicator).toContainText('Zoom: 100%');
    
    // Pan Instruction Text
    const panInstruction = page.getByText(/right-click.*drag.*pan/i);
    await expect(panInstruction).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/bottom-bar-elements.png', fullPage: true });
  });

  test('3. Bottom Bar Height - should have exactly 60px height', async ({ page }) => {
    const bottomBar = page.locator('div.fixed.bottom-0.left-0.right-0').first();
    
    const boundingBox = await bottomBar.boundingBox();
    expect(boundingBox).not.toBeNull();
    
    if (boundingBox) {
      // Height should be 60px
      expect(boundingBox.height).toBe(60);
      
      // Should be at the bottom of the viewport
      const viewportSize = page.viewportSize();
      if (viewportSize) {
        expect(boundingBox.y + boundingBox.height).toBe(viewportSize.height);
      }
    }
  });

  test('4. Zoom Out Button - should be functional and update zoom indicator', async ({ page }) => {
    const zoomOutButton = page.getByRole('button', { name: /zoom out/i });
    const zoomIndicator = page.getByText(/Zoom: \d+%/);
    
    // Initial zoom should be 100%
    await expect(zoomIndicator).toContainText('Zoom: 100%');
    
    // Click zoom out button
    await zoomOutButton.click();
    await page.waitForTimeout(100);
    
    // Zoom should decrease to ~91% (100 / 1.1)
    await expect(zoomIndicator).toContainText('Zoom: 91%');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/zoom-out-clicked.png', fullPage: true });
  });

  test('5. Zoom In Button - should be functional and update zoom indicator', async ({ page }) => {
    const zoomInButton = page.getByRole('button', { name: /zoom in/i });
    const zoomIndicator = page.getByText(/Zoom: \d+%/);
    
    // Initial zoom should be 100%
    await expect(zoomIndicator).toContainText('Zoom: 100%');
    
    // Click zoom in button
    await zoomInButton.click();
    await page.waitForTimeout(100);
    
    // Zoom should increase to 110%
    await expect(zoomIndicator).toContainText('Zoom: 110%');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/zoom-in-clicked.png', fullPage: true });
  });

  test('6. Reset View Button - should reset zoom to 100%', async ({ page }) => {
    const zoomInButton = page.getByRole('button', { name: /zoom in/i });
    const resetButton = page.getByRole('button', { name: /reset view/i });
    const zoomIndicator = page.getByText(/Zoom: \d+%/);
    
    // Zoom in a few times
    await zoomInButton.click();
    await zoomInButton.click();
    await page.waitForTimeout(100);
    
    // Zoom should be ~121% (100 * 1.1 * 1.1)
    await expect(zoomIndicator).toContainText('Zoom: 121%');
    
    // Click reset
    await resetButton.click();
    await page.waitForTimeout(100);
    
    // Zoom should be back to 100%
    await expect(zoomIndicator).toContainText('Zoom: 100%');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/reset-view-clicked.png', fullPage: true });
  });

  test('7. Zoom Buttons Disabled States - should disable at min/max zoom', async ({ page }) => {
    const zoomOutButton = page.getByRole('button', { name: /zoom out/i });
    const zoomInButton = page.getByRole('button', { name: /zoom in/i });
    
    // Zoom out to minimum (10%)
    for (let i = 0; i < 25; i++) {
      await zoomOutButton.click();
      await page.waitForTimeout(50);
    }
    
    // Zoom out button should be disabled at min zoom
    await expect(zoomOutButton).toBeDisabled();
    
    // Zoom in to maximum (1000%)
    for (let i = 0; i < 50; i++) {
      await zoomInButton.click();
      await page.waitForTimeout(50);
    }
    
    // Zoom in button should be disabled at max zoom
    await expect(zoomInButton).toBeDisabled();
  });

  test('8. Canvas Container Height - should be calc(100vh - 60px)', async ({ page }) => {
    const canvasContainer = page.locator('div.flex-1.relative.overflow-hidden').first();
    
    const containerBox = await canvasContainer.boundingBox();
    const viewportSize = page.viewportSize();
    
    expect(containerBox).not.toBeNull();
    expect(viewportSize).not.toBeNull();
    
    if (containerBox && viewportSize) {
      // Container height should be viewport height minus 60px (bottom bar)
      expect(containerBox.height).toBe(viewportSize.height - 60);
    }
  });

  test('9. Canvas Visibility - should still be visible with bottom bar', async ({ page }) => {
    const canvas = page.locator('canvas');
    
    // Canvas should be visible
    await expect(canvas).toBeVisible();
    
    // Canvas should have proper dimensions
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    
    if (canvasBox) {
      expect(canvasBox.width).toBeGreaterThan(0);
      expect(canvasBox.height).toBeGreaterThan(0);
    }
  });

  test('10. No Overlapping Elements - bottom bar should not overlap canvas', async ({ page }) => {
    const canvas = page.locator('canvas');
    const bottomBar = page.locator('div.fixed.bottom-0.left-0.right-0').first();
    
    const canvasBox = await canvas.boundingBox();
    const bottomBarBox = await bottomBar.boundingBox();
    
    expect(canvasBox).not.toBeNull();
    expect(bottomBarBox).not.toBeNull();
    
    if (canvasBox && bottomBarBox) {
      // Canvas bottom should not extend into bottom bar area
      expect(canvasBox.y + canvasBox.height).toBeLessThanOrEqual(bottomBarBox.y);
    }
  });

  test('11. Visual Regression - full page screenshot', async ({ page }) => {
    // Wait for everything to load
    await page.waitForTimeout(1000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/full-page-with-bottom-bar.png', 
      fullPage: true 
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: 'test-results/viewport-with-bottom-bar.png', 
      fullPage: false 
    });
  });

  test('12. Bottom Bar Styling - should have correct visual appearance', async ({ page }) => {
    const bottomBar = page.locator('div.fixed.bottom-0.left-0.right-0').first();
    
    // Check background color (should be white)
    const bgColor = await bottomBar.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(bgColor).toBe('rgb(255, 255, 255)'); // white
    
    // Check border-top
    const borderTop = await bottomBar.evaluate((el) => {
      return window.getComputedStyle(el).borderTopWidth;
    });
    expect(borderTop).not.toBe('0px');
    
    // Check z-index
    const zIndex = await bottomBar.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    expect(zIndex).toBe('10');
  });

  test('13. Keyboard Shortcuts - zoom with + and - keys', async ({ page }) => {
    const zoomIndicator = page.getByText(/Zoom: \d+%/);
    
    // Initial zoom
    await expect(zoomIndicator).toContainText('Zoom: 100%');
    
    // Press + to zoom in
    await page.keyboard.press('+');
    await page.waitForTimeout(100);
    await expect(zoomIndicator).toContainText('Zoom: 110%');
    
    // Press - to zoom out
    await page.keyboard.press('-');
    await page.waitForTimeout(100);
    await expect(zoomIndicator).toContainText('Zoom: 100%');
  });

  test('14. Keyboard Shortcuts - reset with Ctrl+0', async ({ page }) => {
    const zoomInButton = page.getByRole('button', { name: /zoom in/i });
    const zoomIndicator = page.getByText(/Zoom: \d+%/);
    
    // Zoom in
    await zoomInButton.click();
    await zoomInButton.click();
    await page.waitForTimeout(100);
    
    // Press Ctrl+0 to reset
    await page.keyboard.press('Control+0');
    await page.waitForTimeout(100);
    
    // Should be back to 100%
    await expect(zoomIndicator).toContainText('Zoom: 100%');
  });

  test('15. Integration - drawing should work with bottom bar present', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: /enable draw tool/i }).click();
    
    const canvas = page.locator('canvas');
    
    // Draw a line
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Verify line was created
    await expect(page.getByText('No lines drawn yet')).not.toBeVisible();
    
    // Bottom bar should still be visible
    const bottomBar = page.locator('div.fixed.bottom-0.left-0.right-0').first();
    await expect(bottomBar).toBeVisible();
  });
});


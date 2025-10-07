import { test, expect } from '@playwright/test';

test.describe('HVAC Drawing Canvas - Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the application with sidebar visible', async ({ page }) => {
    // Check that sidebar is visible
    await expect(page.getByRole('heading', { name: 'Line Summary' })).toBeVisible();
    await expect(page.getByText('Scale: 1:1')).toBeVisible();
    await expect(page.getByText('No lines drawn yet')).toBeVisible();
    
    // Check that draw button is visible
    await expect(page.getByRole('button', { name: 'Enable Draw tool' })).toBeVisible();
    
    // Check that sidebar toggle is visible
    await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible();
  });

  test('should collapse and expand sidebar', async ({ page }) => {
    // Collapse sidebar
    await page.getByRole('button', { name: 'Collapse sidebar' }).click();
    await expect(page.getByRole('heading', { name: 'Line Summary' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
    
    // Expand sidebar
    await page.getByRole('button', { name: 'Expand sidebar' }).click();
    await expect(page.getByRole('heading', { name: 'Line Summary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible();
  });

  test('should enable and disable draw mode', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    await expect(page.getByRole('button', { name: 'Disable Draw tool' })).toBeVisible();
    
    // Disable draw mode
    await page.getByRole('button', { name: 'Disable Draw tool' }).click();
    await expect(page.getByRole('button', { name: 'Enable Draw tool' })).toBeVisible();
  });

  test('should toggle draw mode with D key', async ({ page }) => {
    // Press D to enable
    await page.keyboard.press('d');
    await expect(page.getByRole('button', { name: 'Disable Draw tool' })).toBeVisible();
    
    // Press D to disable
    await page.keyboard.press('d');
    await expect(page.getByRole('button', { name: 'Enable Draw tool' })).toBeVisible();
  });

  test('should draw a line with click-click interaction', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');
    
    // First click to start
    await canvas.click({ position: { x: 100, y: 100 } });
    
    // Move mouse (preview should show)
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.waitForTimeout(100);
    
    // Second click to finish
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Check that table now shows 1 line
    await expect(page.getByText('No lines drawn yet')).not.toBeVisible();
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Should show 1 line with 8" width
    await expect(table.getByText('8"')).toBeVisible();
    await expect(table.getByText('1')).toBeVisible(); // Count
  });

  test('should cancel drawing with Escape key', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    
    const canvas = page.locator('canvas');
    
    // First click to start
    await canvas.click({ position: { x: 100, y: 100 } });
    
    // Press Escape to cancel
    await page.keyboard.press('Escape');
    
    // Table should still show "No lines drawn yet"
    await expect(page.getByText('No lines drawn yet')).toBeVisible();
  });

  test('should group lines by width in summary table', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    
    const canvas = page.locator('canvas');
    
    // Draw 2 lines with default width (8")
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    await canvas.click({ position: { x: 100, y: 150 } });
    await canvas.click({ position: { x: 300, y: 150 } });
    
    // Change width to 12" (press ] 4 times)
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press(']');
    }
    
    // Draw 1 line with 12" width
    await canvas.click({ position: { x: 100, y: 200 } });
    await canvas.click({ position: { x: 300, y: 200 } });
    
    // Check table
    const table = page.locator('table');
    
    // Should show 2 rows (8" and 12")
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(2);
    
    // First row: 2 lines with 8"
    const row1 = rows.nth(0);
    await expect(row1.getByText('2')).toBeVisible(); // Count
    await expect(row1.getByText('8"')).toBeVisible(); // Size
    
    // Second row: 1 line with 12"
    const row2 = rows.nth(1);
    await expect(row2.getByText('1')).toBeVisible(); // Count
    await expect(row2.getByText('12"')).toBeVisible(); // Size
  });

  test('should delete line with Delete button', async ({ page }) => {
    // Enable draw mode and draw a line
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Disable draw mode
    await page.keyboard.press('d');
    
    // Click on the line to select it
    await canvas.click({ position: { x: 200, y: 100 } });
    
    // Delete button should appear
    await expect(page.getByRole('button', { name: 'Delete selected line' })).toBeVisible();
    
    // Click delete
    await page.getByRole('button', { name: 'Delete selected line' }).click();
    
    // Table should show "No lines drawn yet"
    await expect(page.getByText('No lines drawn yet')).toBeVisible();
  });

  test('should delete line with Delete key', async ({ page }) => {
    // Enable draw mode and draw a line
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Disable draw mode
    await page.keyboard.press('d');
    
    // Click on the line to select it
    await canvas.click({ position: { x: 200, y: 100 } });
    
    // Press Delete key
    await page.keyboard.press('Delete');
    
    // Table should show "No lines drawn yet"
    await expect(page.getByText('No lines drawn yet')).toBeVisible();
  });

  test('should update table when line is deleted', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    const canvas = page.locator('canvas');
    
    // Draw 2 lines
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    await canvas.click({ position: { x: 100, y: 150 } });
    await canvas.click({ position: { x: 300, y: 150 } });
    
    // Table should show count of 2
    const table = page.locator('table');
    await expect(table.getByText('2')).toBeVisible();
    
    // Disable draw mode and select a line
    await page.keyboard.press('d');
    await canvas.click({ position: { x: 200, y: 100 } });
    
    // Delete the line
    await page.keyboard.press('Delete');
    
    // Table should now show count of 1
    await expect(table.getByText('1')).toBeVisible();
    await expect(table.getByText('2')).not.toBeVisible();
  });

  test('should adjust line width with bracket keys', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    
    // Increase width with ]
    await page.keyboard.press(']');
    await page.keyboard.press(']');
    
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Table should show 10" (8 + 2)
    const table = page.locator('table');
    await expect(table.getByText('10"')).toBeVisible();
  });

  test('should display scale in sidebar header', async ({ page }) => {
    // Check default scale
    await expect(page.getByText('Scale: 1:1')).toBeVisible();
  });

  test('should format lengths in imperial units', async ({ page }) => {
    // Enable draw mode
    await page.getByRole('button', { name: 'Enable Draw tool' }).click();
    
    const canvas = page.locator('canvas');
    
    // Draw a line (200px = 200 inches = 16'-8" at 1:1 scale)
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Check that length is formatted as feet and inches
    const table = page.locator('table');
    const lengthCell = table.locator('tbody tr td').nth(2);
    const text = await lengthCell.textContent();
    
    // Should contain feet (') and inches (")
    expect(text).toMatch(/\d+'-\d+"/);
  });

  test('should maintain canvas size when sidebar is toggled', async ({ page }) => {
    const canvas = page.locator('canvas');
    const initialBox = await canvas.boundingBox();
    
    // Collapse sidebar
    await page.getByRole('button', { name: 'Collapse sidebar' }).click();
    await page.waitForTimeout(100);
    
    const collapsedBox = await canvas.boundingBox();
    
    // Canvas should be wider when sidebar is collapsed
    expect(collapsedBox!.width).toBeGreaterThan(initialBox!.width);
    
    // Expand sidebar
    await page.getByRole('button', { name: 'Expand sidebar' }).click();
    await page.waitForTimeout(100);
    
    const expandedBox = await canvas.boundingBox();
    
    // Canvas should return to original width
    expect(expandedBox!.width).toBe(initialBox!.width);
  });
});


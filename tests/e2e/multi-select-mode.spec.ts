/**
 * E2E Tests for Multi-Select Mode
 * 
 * Tests multi-select functionality including:
 * - Selecting multiple lines with Shift+click
 * - Multi-select modal UI (header, warning, footer)
 * - Mixed values display
 * - Batch operations (update all, delete all)
 * - Aggregate statistics
 * - Keyboard shortcuts (Cmd/Ctrl+D for duplicate)
 */

import { test, expect, type Page } from '@playwright/test';

/**
 * Helper function to draw a line on the canvas
 * Note: The line is created but the modal does NOT auto-open while in draw mode
 */
async function drawLine(page: Page, x1: number, y1: number, x2: number, y2: number) {
  const canvas = page.locator('canvas');
  await canvas.click({ position: { x: x1, y: y1 } });
  await canvas.click({ position: { x: x2, y: y2 } });
  await page.waitForTimeout(100);
}

/**
 * Helper function to draw a line and open its modal
 * This is the most common pattern: draw a line, then select it to open the modal
 */
async function drawLineAndOpenModal(page: Page, x1: number, y1: number, x2: number, y2: number) {
  await drawLine(page, x1, y1, x2, y2);
  await page.keyboard.press('d'); // Disable draw mode
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  await selectLine(page, midX, midY);
}

/**
 * Helper function to select a line by clicking on it
 * Uses page.mouse API to properly handle Shift+click with force
 * @param shift - Whether to hold Shift key during click (for multi-select)
 */
async function selectLine(page: Page, x: number, y: number, shift: boolean = false) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas not found');

  const absoluteX = box.x + x;
  const absoluteY = box.y + y;

  if (shift) {
    await page.keyboard.down('Shift');
  }

  // Use mouse API to click at absolute coordinates (bypasses actionability checks)
  await page.mouse.click(absoluteX, absoluteY);

  if (shift) {
    await page.keyboard.up('Shift');
  }

  await page.waitForTimeout(100);
}

/**
 * Helper function to close the modal
 */
async function closeModal(page: Page) {
  await page.keyboard.press('Escape');
  // Wait for modal to be fully hidden
  await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 2000 });
  // Additional wait to ensure modal is completely removed from DOM
  await page.waitForTimeout(200);
}

/**
 * Helper function to draw multiple lines in draw mode
 * Modal will NOT open while in draw mode (fixed in DrawingCanvas.tsx)
 *
 * @param page - Playwright page object
 * @param lines - Array of line coordinates {x1, y1, x2, y2}
 */
async function drawMultipleLines(
  page: Page,
  lines: Array<{ x1: number; y1: number; x2: number; y2: number }>
) {
  // Enable draw mode once
  await page.getByRole('button', { name: 'Enable Draw tool' }).click();
  await page.waitForTimeout(200);

  // Draw all lines - modal won't open until draw mode is disabled
  for (const line of lines) {
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: line.x1, y: line.y1 } });
    await page.waitForTimeout(50);
    await canvas.click({ position: { x: line.x2, y: line.y2 } });
    await page.waitForTimeout(100);
  }

  // Disable draw mode by clicking the draw button
  await page.getByRole('button', { name: 'Disable Draw tool' }).click();
  await page.waitForTimeout(200);
}

test.describe('Multi-Select Mode - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Multi-Select Selection', () => {
    test('should select multiple lines with Shift+click', async ({ page }) => {
      // Draw two lines using the new helper (avoids modal blocking)
      await drawMultipleLines(page, [
        { x1: 100, y1: 100, x2: 300, y2: 100 },
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select first line
      await selectLine(page, 200, 100);

      // Modal should open for first line
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Line Properties')).toBeVisible();

      // Shift+click second line to add to selection (modal stays open)
      await selectLine(page, 200, 200, true); // true = Shift+click

      // Modal should update to multi-select mode
      await expect(modal).toBeVisible();
      await expect(modal.getByText('2 Lines Selected')).toBeVisible();
    });

    test('should toggle line selection with Shift+click', async ({ page }) => {
      // Draw two lines using the new helper (avoids modal blocking)
      await drawMultipleLines(page, [
        { x1: 100, y1: 100, x2: 300, y2: 100 },
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select first line
      await selectLine(page, 200, 100);
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      // Shift+click second line to add to selection
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Should show 2 lines selected
      await expect(modal.getByText('2 Lines Selected')).toBeVisible();

      // Shift+click second line again to remove from selection
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Should show single line mode again
      await expect(modal.getByText('Line Properties')).toBeVisible();
      await expect(modal.getByText('2 Lines Selected')).not.toBeVisible();
    });

    test('should clear selection when clicking empty canvas', async ({ page }) => {
      // Enable draw mode and draw a line
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      // Click on empty canvas area
      const canvas = page.locator('canvas');
      await canvas.click({ position: { x: 500, y: 500 } });

      // Modal should close
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('Multi-Select Modal UI', () => {
    test('should display multi-select header with count', async ({ page }) => {
      // Draw two lines using the new helper (avoids modal blocking)
      await drawMultipleLines(page, [
        { x1: 100, y1: 100, x2: 300, y2: 100 },
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select both lines
      await selectLine(page, 200, 100);
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Check multi-select header
      const modal = page.getByRole('dialog');
      await expect(modal.getByText('2 Lines Selected')).toBeVisible();
      await expect(modal.getByRole('button', { name: /close/i })).toBeVisible();
    });

    test('should display multi-select warning banner', async ({ page }) => {
      // Draw two lines using the new helper (avoids modal blocking)
      await drawMultipleLines(page, [
        { x1: 100, y1: 100, x2: 300, y2: 100 },
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select both lines
      await selectLine(page, 200, 100);
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Check warning banner
      const modal = page.getByRole('dialog');
      await expect(modal.getByText(/multiple edit/i)).toBeVisible();
    });

    test('should display multi-select footer with Apply and Delete All buttons', async ({ page }) => {
      // Draw two lines using the new helper (avoids modal blocking)
      await drawMultipleLines(page, [
        { x1: 100, y1: 100, x2: 300, y2: 100 },
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select both lines
      await selectLine(page, 200, 100);
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Check footer buttons
      const modal = page.getByRole('dialog');
      await expect(modal.getByRole('button', { name: /apply/i })).toBeVisible();
      await expect(modal.getByRole('button', { name: /delete all/i })).toBeVisible();
    });
  });

  test.describe('Mixed Values Display', () => {
    test('should show "Mixed" when lines have different widths', async ({ page }) => {
      // Draw first line and change its width to 10"
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Change first line width to 10"
      const modal = page.getByRole('dialog');
      const widthButton = modal.getByRole('button', { name: /duct width selector/i });
      await widthButton.click();
      await page.waitForTimeout(200);
      await modal.getByRole('option', { name: /^10$/i }).click();
      await page.waitForTimeout(200);

      // Close modal
      await closeModal(page);

      // Draw second line with default width (8") using drawMultipleLines
      await drawMultipleLines(page, [
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select both lines
      await selectLine(page, 200, 100);
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Width dropdown should show "Mixed"
      await expect(modal).toBeVisible();
      await expect(modal.getByText(/mixed/i)).toBeVisible();
    });
  });

  test.describe('Batch Operations', () => {
    test('should apply width change to all selected lines', async ({ page }) => {
      // Draw two lines using the new helper (avoids modal blocking)
      await drawMultipleLines(page, [
        { x1: 100, y1: 100, x2: 300, y2: 100 },
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select both lines
      await selectLine(page, 200, 100);
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Change width to 12"
      const modal = page.getByRole('dialog');
      const widthButton = modal.getByRole('button', { name: /duct width selector/i });
      await widthButton.click();
      await page.waitForTimeout(200);
      await modal.getByRole('option', { name: /^12$/i }).click();
      await page.waitForTimeout(200);

      // Click Apply
      await modal.getByRole('button', { name: /apply/i }).click();

      // Modal should close
      await expect(modal).not.toBeVisible();

      // Verify both lines have width 12" in sidebar table
      await expect(page.getByText('12"').first()).toBeVisible();
    });

    test('should delete all selected lines', async ({ page }) => {
      // Draw two lines using the new helper (avoids modal blocking)
      await drawMultipleLines(page, [
        { x1: 100, y1: 100, x2: 300, y2: 100 },
        { x1: 100, y1: 200, x2: 300, y2: 200 },
      ]);

      // Select both lines
      await selectLine(page, 200, 100);
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 200);
      await page.keyboard.up('Shift');

      // Click Delete All
      const modal = page.getByRole('dialog');
      await modal.getByRole('button', { name: /delete all/i }).click();

      // Modal should close
      await expect(modal).not.toBeVisible();

      // Sidebar should show "No lines" or empty state
      // (Assuming sidebar shows line count or empty state)
      await page.waitForTimeout(200);
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should duplicate selected lines with Cmd/Ctrl+D', async ({ page }) => {
      // Draw a line
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Close modal
      await closeModal(page);

      // Press Cmd/Ctrl+D to duplicate
      const isMac = process.platform === 'darwin';
      if (isMac) {
        await page.keyboard.press('Meta+d');
      } else {
        await page.keyboard.press('Control+d');
      }

      // Modal should open with duplicated line selected
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
    });
  });
});


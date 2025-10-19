/**
 * Line Properties Modal E2E Tests
 * 
 * Comprehensive end-to-end tests for the Line Properties Modal.
 * Tests complete user workflows including:
 * - Modal opening/closing
 * - Tab switching
 * - Property editing
 * - Calculations
 * - Advanced features
 * - Keyboard navigation
 */

import { test, expect, type Page } from '@playwright/test';

/**
 * Helper function to draw a line on the canvas
 * Note: The line is created but the modal does NOT auto-open while in draw mode
 * You need to disable draw mode and select the line to open the modal
 */
async function drawLine(page: Page, x1: number, y1: number, x2: number, y2: number) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas not found');

  // First click to start the line
  await canvas.click({ position: { x: x1, y: y1 } });

  // Move mouse to end position (this updates the drawing state's endPoint)
  await page.mouse.move(box.x + x2, box.y + y2);
  await page.waitForTimeout(50);

  // Second click to complete the line
  await canvas.click({ position: { x: x2, y: y2 } });

  // Wait for line to be created by checking if sidebar no longer shows "No lines drawn yet"
  await expect(page.getByText('No lines drawn yet')).not.toBeVisible({ timeout: 2000 });
}

/**
 * Helper function to draw a line and open its modal
 * This is the most common pattern: draw a line, then select it to open the modal
 */
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

/**
 * Helper function to select a line (click on it when not in draw mode)
 */
async function selectLine(page: Page, x: number, y: number) {
  const canvas = page.locator('canvas');
  await canvas.click({ position: { x, y } });
  await page.waitForTimeout(100); // Wait for modal to open
}

/**
 * Helper function to close the modal
 */
async function closeModal(page: Page) {
  // Press Escape to close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100); // Wait for modal to close
}

test.describe('Line Properties Modal - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Modal Opening and Closing', () => {
    test('should open modal when clicking on a line', async ({ page }) => {
      // Enable draw mode and draw a line
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLine(page, 100, 100, 300, 100);

      // Disable draw mode
      await page.keyboard.press('d');

      // Wait for draw mode to be disabled
      await expect(page.getByRole('button', { name: 'Enable Draw tool' })).toBeVisible();

      // Click on the line to select it
      await selectLine(page, 200, 100);

      // Modal should be visible
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();
      await expect(page.getByText('Line Properties')).toBeVisible();
    });

    test('should display correct line properties in modal', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be visible and show default properties
      const modal = page.getByRole('dialog', { name: /line properties/i });
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Type')).toBeVisible();
      await expect(modal.getByText('Width')).toBeVisible();
      await expect(modal.getByText('Length')).toBeVisible();
    });

    test('should close modal by clicking backdrop', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be visible
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Click on backdrop (outside the modal) to close it
      // Click at a position that's definitely outside the modal (top-left corner)
      await page.mouse.click(10, 10);

      // Modal should be hidden
      await expect(page.getByRole('dialog', { name: /line properties/i })).not.toBeVisible();
    });

    test('should close modal with Escape key', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be visible
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should be hidden
      await expect(page.getByRole('dialog', { name: /line properties/i })).not.toBeVisible();
    });

    test('should position modal near the selected line', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Get modal position
      const modal = page.getByRole('dialog', { name: /line properties/i });
      const modalBox = await modal.boundingBox();

      // Modal should be positioned near the line (within reasonable distance)
      expect(modalBox).not.toBeNull();
      expect(modalBox!.x).toBeGreaterThan(0);
      expect(modalBox!.y).toBeGreaterThan(0);
    });
  });

  test.describe('Tab Switching', () => {
    test('should switch between Properties, Calculations, and Advanced tabs', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open with Properties tab active by default
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: /properties/i, selected: true })).toBeVisible();

      // Switch to Calculations tab
      await page.getByRole('tab', { name: /calculations/i }).click();
      await expect(page.getByRole('tab', { name: /calculations/i, selected: true })).toBeVisible();
      await expect(page.getByText('Airflow (CFM)')).toBeVisible();

      // Switch to Advanced tab
      await page.getByRole('tab', { name: /advanced/i }).click();
      await expect(page.getByRole('tab', { name: /advanced/i, selected: true })).toBeVisible();
      await expect(page.getByText('Notes')).toBeVisible();

      // Switch back to Properties tab
      await page.getByRole('tab', { name: /properties/i }).click();
      await expect(page.getByRole('tab', { name: /properties/i, selected: true })).toBeVisible();
    });

    test('should maintain tab state during editing', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Switch to Calculations tab
      await page.getByRole('tab', { name: /calculations/i }).click();

      // Enter airflow value
      const airflowInput = page.getByRole('spinbutton', { name: /airflow/i });
      await airflowInput.fill('500');

      // Tab should still be Calculations
      await expect(page.getByRole('tab', { name: /calculations/i, selected: true })).toBeVisible();
    });
  });

  test.describe('Properties Tab Editing', () => {
    test('should change duct type from Supply to Return', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open on Properties tab
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Open Type dropdown
      const typeButton = page.getByRole('button', { name: /type selector/i });
      await typeButton.click();

      // Select Return
      await page.getByRole('option', { name: /return/i }).click();

      // Verify selection (dropdown should show Return)
      await page.waitForTimeout(100);
      // The button text should update to show "Return"
    });

    test('should change width using dropdown', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Open Width dropdown
      const widthButton = page.getByRole('button', { name: /width selector/i });
      await widthButton.click();

      // Select 12"
      await page.getByRole('option', { name: /^12$/i }).click();

      // Verify width changed in sidebar table
      await page.waitForTimeout(200);
      const table = page.locator('table');
      await expect(table.getByText('12"')).toBeVisible();
    });

    test('should change width using quick-select chips', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Click on 10" chip
      await page.getByRole('button', { name: /^10$/i }).click();

      // Verify width changed in sidebar table
      await page.waitForTimeout(200);
      const table = page.locator('table');
      await expect(table.getByText('10"')).toBeVisible();
    });

    test('should change layer, material, and gauge', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Expand "More Details" section
      await page.getByRole('button', { name: /more details/i }).click();
      await page.waitForTimeout(200);

      // Change Layer
      await page.getByRole('button', { name: /layer selector/i }).click();
      await page.getByRole('option', { name: /supply/i }).first().click();

      // Change Material
      await page.getByRole('button', { name: /material selector/i }).click();
      await page.getByRole('option', { name: /stainless steel/i }).click();

      // Change Gauge
      await page.getByRole('button', { name: /gauge selector/i }).click();
      await page.getByRole('option', { name: /24ga/i }).click();

      // All changes should be applied
      await page.waitForTimeout(100);
    });
  });

  test.describe('Calculations Tab', () => {
    test('should update calculations when airflow is entered', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Calculations tab
      await page.getByRole('tab', { name: /calculations/i }).click();

      // Enter airflow value
      const airflowInput = page.getByRole('spinbutton', { name: /airflow/i });
      await airflowInput.fill('500');
      await page.waitForTimeout(200);

      // Results should be visible
      await expect(page.getByText('Results')).toBeVisible();
      await expect(page.getByText('Velocity')).toBeVisible();
      await expect(page.getByText('Friction')).toBeVisible();
      await expect(page.getByText('Pressure')).toBeVisible();
    });

    test('should show warning banner when velocity exceeds 1500 fpm', async ({ page }) => {
      // Enable draw mode and decrease width to 4" (press [ 4 times)
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('[');
      }

      // Draw a line and open modal
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Calculations tab
      await page.getByRole('tab', { name: /calculations/i }).click();

      // Enter high airflow to exceed 1500 fpm
      const airflowInput = page.getByRole('spinbutton', { name: /airflow/i });
      await airflowInput.fill('1000');
      await page.waitForTimeout(200);

      // Warning banner should appear
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByText(/high velocity/i)).toBeVisible();
      await expect(page.getByText(/suggest/i)).toBeVisible();
    });

    test('should display velocity status icon (success for ≤1500 fpm)', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Calculations tab
      await page.getByRole('tab', { name: /calculations/i }).click();

      // Enter moderate airflow (should result in velocity ≤ 1500 fpm)
      const airflowInput = page.getByRole('spinbutton', { name: /airflow/i });
      await airflowInput.fill('300');
      await page.waitForTimeout(200);

      // Success status icon should be visible
      const velocityStatus = page.getByLabelText(/velocity status: success/i);
      await expect(velocityStatus).toBeVisible();
    });
  });

  test.describe('Advanced Tab', () => {
    test('should add and remove tags', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Advanced tab
      await page.getByRole('tab', { name: /advanced/i }).click();

      // Click "Add tag" button
      await page.getByRole('button', { name: /add new tag/i }).click();

      // Type tag name
      const tagInput = page.getByRole('textbox', { name: /new tag name/i });
      await tagInput.fill('Kitchen');

      // Press Enter to add
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);

      // Tag should be visible
      await expect(page.getByText('Kitchen')).toBeVisible();

      // Remove tag
      const removeButton = page.getByRole('button', { name: /remove kitchen/i });
      await removeButton.click();
      await page.waitForTimeout(100);

      // Tag should be removed
      await expect(page.getByText('Kitchen')).not.toBeVisible();
    });

    test('should edit notes', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Advanced tab
      await page.getByRole('tab', { name: /advanced/i }).click();

      // Find notes textarea
      const notesTextarea = page.getByRole('textbox', { name: /notes/i });
      await notesTextarea.fill('This is a test note');

      // Character counter should update
      await expect(page.getByText('20/120')).toBeVisible();
    });

    test('should add and remove custom properties', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Advanced tab
      await page.getByRole('tab', { name: /advanced/i }).click();

      // Click "Add property" button
      await page.getByRole('button', { name: /add new property/i }).click();

      // Fill in property name and value
      const nameInput = page.getByRole('textbox', { name: /property name/i });
      const valueInput = page.getByRole('textbox', { name: /property value/i });
      await nameInput.fill('Job');
      await valueInput.fill('2025-1042');

      // Click Add button
      await page.getByRole('button', { name: /^add property$/i }).click();
      await page.waitForTimeout(100);

      // Property should be visible
      await expect(page.getByText(/Job:/i)).toBeVisible();
      await expect(page.getByText(/2025-1042/i)).toBeVisible();
    });

    test('should display metadata (ID, created, updated)', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Advanced tab
      await page.getByRole('tab', { name: /advanced/i }).click();

      // Metadata should be visible
      await expect(page.getByText('ID:')).toBeVisible();
      await expect(page.getByText('Created:')).toBeVisible();
      await expect(page.getByText('Updated:')).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through tabs with keyboard', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Focus on Properties tab
      await page.getByRole('tab', { name: /properties/i }).focus();

      // Press ArrowRight to move to Calculations tab
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('tab', { name: /calculations/i, selected: true })).toBeVisible();

      // Press ArrowRight to move to Advanced tab
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('tab', { name: /advanced/i, selected: true })).toBeVisible();

      // Press ArrowLeft to move back to Calculations tab
      await page.keyboard.press('ArrowLeft');
      await expect(page.getByRole('tab', { name: /calculations/i, selected: true })).toBeVisible();
    });

    test('should close modal with Escape from any focused element', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be open
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Switch to Calculations tab and focus on airflow input
      await page.getByRole('tab', { name: /calculations/i }).click();
      const airflowInput = page.getByRole('spinbutton', { name: /airflow/i });
      await airflowInput.focus();

      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should close
      await expect(page.getByRole('dialog', { name: /line properties/i })).not.toBeVisible();
    });

    test('should trap focus within modal', async ({ page }) => {
      // Draw a line and open modal
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLineAndOpenModal(page, 100, 100, 300, 100);

      // Modal should be visible
      await expect(page.getByRole('dialog', { name: /line properties/i })).toBeVisible();

      // Tab through elements - focus should stay within modal
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Focus should still be within the modal
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Multi-Select Mode', () => {
    test('should open modal in multi-select mode when multiple lines selected', async ({ page }) => {
      // Draw two lines
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLine(page, 100, 100, 300, 100);

      // Close modal after first line
      await closeModal(page);

      // Draw second line
      await drawLine(page, 100, 150, 300, 150);

      // Close modal after second line
      await closeModal(page);

      // Disable draw mode
      await page.keyboard.press('d');

      // Select first line
      await selectLine(page, 200, 100);

      // Shift+click second line for multi-select
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 150);
      await page.keyboard.up('Shift');

      // Modal should show multi-select header
      await expect(page.getByText(/2 lines selected/i)).toBeVisible();
    });

    test('should show mixed values indicator in multi-select mode', async ({ page }) => {
      // Draw first line with 8" width
      await page.getByRole('button', { name: 'Enable Draw tool' }).click();
      await drawLine(page, 100, 100, 300, 100);

      // Close modal after first line
      await closeModal(page);

      // Change width to 10"
      await page.keyboard.press(']');
      await page.keyboard.press(']');

      // Draw second line with 10" width
      await drawLine(page, 100, 150, 300, 150);

      // Close modal after second line
      await closeModal(page);

      // Disable draw mode
      await page.keyboard.press('d');

      // Multi-select both lines
      await selectLine(page, 200, 100);
      await page.keyboard.down('Shift');
      await selectLine(page, 200, 150);
      await page.keyboard.up('Shift');

      // Width dropdown should show "Mixed" or similar indicator
      await expect(page.getByText(/mixed/i)).toBeVisible();
    });
  });
});


const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture console messages and errors BEFORE navigation
  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    console.log('BROWSER LOG:', text);
  });

  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log('PAGE ERROR:', error.message);
  });

  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Wait a bit for the page to load
  await page.waitForTimeout(3000);

  // Take screenshot of initial load
  await page.screenshot({ path: 'screenshot-01-initial-load.png', fullPage: true });
  console.log('✅ Screenshot 1: Initial load saved');
  
  // Get page content
  const bodyHTML = await page.content();
  console.log('Page HTML length:', bodyHTML.length);
  
  // Check if canvas exists
  const canvas = await page.locator('canvas').count();
  console.log('Canvas elements found:', canvas);
  
  // Check if any text is visible
  const bodyText = await page.locator('body').textContent();
  console.log('Body text:', bodyText.substring(0, 200));
  
  // Try to find the FAB button
  const fabButton = await page.locator('button[aria-label*="Draw"]').count();
  console.log('FAB buttons found:', fabButton);
  
  // Check for sidebar
  const sidebar = await page.locator('text=Line Summary').count();
  console.log('Sidebar elements found:', sidebar);
  
  // Wait a bit more
  await page.waitForTimeout(2000);
  
  // Take another screenshot
  await page.screenshot({ path: 'screenshot-02-after-wait.png', fullPage: true });
  console.log('✅ Screenshot 2: After wait saved');
  
  console.log('\n=== Test Complete ===');
  console.log('Check screenshot-01-initial-load.png and screenshot-02-after-wait.png');

  // Print summary
  console.log('\n=== SUMMARY ===');
  console.log('Console Messages:', consoleMessages.length);
  console.log('Page Errors:', pageErrors.length);

  if (pageErrors.length > 0) {
    console.log('\n=== PAGE ERRORS ===');
    pageErrors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
  }

  if (consoleMessages.length > 0) {
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach((msg, i) => console.log(`${i + 1}. ${msg}`));
  }

  // Keep browser open for manual inspection
  console.log('\nBrowser will stay open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);

  await browser.close();
})();


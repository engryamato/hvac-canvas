#!/usr/bin/env python3
"""
Script to update E2E tests to use drawLineAndOpenModal() helper
"""

import re

# Read the test file
with open('tests/e2e/line-properties-modal.spec.ts', 'r') as f:
    content = f.read()

# Pattern 1: Replace "Draw a line (modal opens automatically)" pattern
# This pattern appears in tests that expect the modal to auto-open
pattern1 = r'(      // Draw a line \(modal opens automatically\)\n      await page\.getByRole\(\'button\', \{ name: \'Enable Draw tool\' \}\)\.click\(\);\n      await drawLine\(page, (\d+), (\d+), (\d+), (\d+)\);)'

replacement1 = r'      // Draw a line and open modal\n      await page.getByRole(\'button\', { name: \'Enable Draw tool\' }).click();\n      await drawLineAndOpenModal(page, \2, \3, \4, \5);'

content = re.sub(pattern1, replacement1, content)

# Write the updated content back
with open('tests/e2e/line-properties-modal.spec.ts', 'w') as f:
    f.write(content)

print("Updated test file successfully!")


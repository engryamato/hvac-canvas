# Width HUD Enhancement - Testing Guide

## Overview
This guide provides comprehensive testing procedures for the Width HUD enhancements, including:
- **Part 1:** Slider replacement with increment/decrement controls
- **Part 2:** Dynamic HUD positioning near selected lines

---

## Prerequisites
- Application is running at: http://localhost:5173/
- Browser window is at least 1024x768 for optimal testing
- No browser extensions interfering with pointer events

---

## Part 1: Slider Replacement Testing

### Test 1.1: Increment/Decrement Buttons
**Objective:** Verify arrow buttons increase/decrease line width correctly

**Steps:**
1. Enable Draw mode (press `D` or click the pencil FAB)
2. Draw a line by clicking two points on the canvas
3. The line should auto-select and the Width HUD should appear
4. Click the **Up Arrow (↑)** button
   - ✅ Width should increase by 1
   - ✅ Display should update (e.g., "8px" → "9px")
   - ✅ Line should visually become thicker
5. Click the **Down Arrow (↓)** button
   - ✅ Width should decrease by 1
   - ✅ Display should update (e.g., "9px" → "8px")
   - ✅ Line should visually become thinner

**Expected Results:**
- Buttons respond immediately to clicks
- Width changes are reflected in real-time
- Smooth visual feedback on button hover

---

### Test 1.2: Button Boundary Constraints
**Objective:** Verify buttons are disabled at min/max values

**Steps:**
1. Select a line (or draw a new one)
2. Click the **Down Arrow (↓)** repeatedly until width reaches 1
   - ✅ Down arrow button should become disabled (grayed out)
   - ✅ Clicking disabled button should have no effect
   - ✅ Up arrow should still be enabled
3. Click the **Up Arrow (↑)** repeatedly until width reaches 60
   - ✅ Up arrow button should become disabled (grayed out)
   - ✅ Clicking disabled button should have no effect
   - ✅ Down arrow should still be enabled

**Expected Results:**
- Buttons disable at boundaries (1 and 60)
- Disabled buttons show reduced opacity (40%)
- Cursor changes to "not-allowed" on disabled buttons

---

### Test 1.3: Direct Number Input
**Objective:** Verify users can type width values directly

**Steps:**
1. Select a line
2. Click inside the number input field (between the arrows)
3. Clear the current value and type `25`
   - ✅ Width should update to 25
   - ✅ Line should become thicker
   - ✅ Display should show "25px"
4. Clear and type `5`
   - ✅ Width should update to 5
   - ✅ Line should become thinner
   - ✅ Display should show "5px"

**Expected Results:**
- Input field accepts keyboard input
- Width updates immediately on valid input
- Input field is wide enough for 2-digit numbers

---

### Test 1.4: Input Validation
**Objective:** Verify invalid inputs are handled correctly

**Steps:**
1. Select a line
2. Click the input field and try entering:
   - **Invalid: `0`** → Should be ignored or clamped to 1 on blur
   - **Invalid: `100`** → Should be clamped to 60 on blur
   - **Invalid: `-5`** → Should be clamped to 1 on blur
   - **Invalid: `abc`** → Should be ignored
   - **Invalid: `12.5`** → Should accept only integer part (12)
3. Clear the input field completely and click outside (blur)
   - ✅ Should reset to current width value

**Expected Results:**
- Out-of-range values are clamped to 1-60
- Non-numeric input is rejected
- Empty input resets to current value on blur

---

### Test 1.5: Keyboard Shortcuts
**Objective:** Verify existing keyboard shortcuts still work

**Steps:**
1. Select a line
2. Press the `]` key (right bracket)
   - ✅ Width should increase by 1
   - ✅ HUD should update
3. Press the `[` key (left bracket)
   - ✅ Width should decrease by 1
   - ✅ HUD should update
4. Rapidly press `]` multiple times
   - ✅ Width should increase smoothly
   - ✅ Should stop at 60 (max)

**Expected Results:**
- Keyboard shortcuts work as before
- Shortcuts and buttons/input work together seamlessly
- No conflicts between input methods

---

## Part 2: Dynamic Positioning Testing

### Test 2.1: Horizontal Line Positioning
**Objective:** Verify HUD positions correctly above horizontal lines

**Steps:**
1. Draw a horizontal line in the **center** of the canvas
   - ✅ HUD should appear **above** the line
   - ✅ HUD should be **centered** horizontally on the line
   - ✅ HUD should not overlap the line
2. Draw a horizontal line near the **top** of the canvas
   - ✅ HUD should **flip below** the line (not enough space above)
   - ✅ HUD should remain fully visible
3. Draw a horizontal line near the **bottom** of the canvas
   - ✅ HUD should appear **above** the line
   - ✅ HUD should remain fully visible

**Expected Results:**
- HUD intelligently positions above or below based on available space
- HUD is always fully visible within viewport
- Smooth transition when HUD appears

---

### Test 2.2: Vertical Line Positioning
**Objective:** Verify HUD positions correctly for vertical lines

**Steps:**
1. Draw a vertical line in the **center** of the canvas
   - ✅ HUD should appear **above** the line's midpoint
   - ✅ HUD should be **centered** horizontally on the midpoint
2. Draw a vertical line near the **left edge** of the canvas
   - ✅ HUD should shift right to stay within viewport
   - ✅ HUD should maintain 8px padding from left edge
3. Draw a vertical line near the **right edge** of the canvas
   - ✅ HUD should shift left to stay within viewport
   - ✅ HUD should maintain 8px padding from right edge

**Expected Results:**
- HUD adjusts horizontal position to avoid viewport overflow
- Minimum 8px padding from all edges
- HUD remains readable and accessible

---

### Test 2.3: Diagonal Line Positioning
**Objective:** Verify HUD positions correctly for diagonal lines

**Steps:**
1. Draw a diagonal line from **bottom-left to top-right**
   - ✅ HUD should appear above the line's midpoint
   - ✅ HUD should be centered on the midpoint
2. Draw a diagonal line from **top-left to bottom-right**
   - ✅ HUD should position based on midpoint location
   - ✅ HUD should flip below if midpoint is near top
3. Draw a diagonal line in each **corner** of the canvas
   - ✅ HUD should adjust position to stay fully visible
   - ✅ HUD should maintain edge padding

**Expected Results:**
- HUD calculates midpoint correctly for any angle
- Edge detection works for all line orientations
- No part of HUD is clipped or hidden

---

### Test 2.4: Edge Case - Very Short Lines
**Objective:** Verify HUD positioning for short lines

**Steps:**
1. Draw a very short line (< 50px)
   - ✅ HUD should still appear centered on midpoint
   - ✅ HUD may extend beyond line ends (acceptable)
   - ✅ HUD should remain fully visible

**Expected Results:**
- HUD doesn't break for short lines
- Positioning algorithm handles edge case gracefully

---

### Test 2.5: Smooth Transitions
**Objective:** Verify HUD animates smoothly when repositioning

**Steps:**
1. Draw a line in the center of the canvas
2. Select the line (HUD appears)
3. Deselect by clicking empty space
4. Select a different line in a different location
   - ✅ HUD should smoothly transition to new position
   - ✅ Transition should take ~200ms
   - ✅ Movement should feel natural, not jarring

**Expected Results:**
- CSS transition creates smooth movement
- Duration (200ms) feels responsive but not instant
- Ease-out timing function provides polished feel

---

### Test 2.6: Window Resize Behavior
**Objective:** Verify HUD repositions correctly on window resize

**Steps:**
1. Draw and select a line near the right edge
2. Resize the browser window to be narrower
   - ✅ HUD should reposition to stay within viewport
   - ✅ HUD should maintain 8px edge padding
3. Resize the window to be wider
   - ✅ HUD should recalculate position
   - ✅ HUD should remain properly positioned

**Expected Results:**
- Window resize triggers HUD recalculation
- HUD never goes off-screen during resize
- Smooth repositioning during resize

---

### Test 2.7: Sidebar Toggle Behavior
**Objective:** Verify HUD repositions when sidebar is toggled

**Steps:**
1. Draw and select a line
2. Click the sidebar toggle button (collapse sidebar)
   - ✅ Canvas expands
   - ✅ HUD repositions based on new canvas bounds
   - ✅ HUD remains properly positioned
3. Click the sidebar toggle button again (expand sidebar)
   - ✅ Canvas shrinks
   - ✅ HUD repositions again
   - ✅ HUD stays within visible canvas area

**Expected Results:**
- Sidebar toggle triggers HUD recalculation
- HUD accounts for changing canvas dimensions
- No visual glitches during transition

---

## Edge Cases & Stress Testing

### Test 3.1: Rapid Line Selection
**Objective:** Test performance with rapid selection changes

**Steps:**
1. Draw 5-10 lines across the canvas
2. Rapidly click different lines in succession
   - ✅ HUD should reposition smoothly for each selection
   - ✅ No lag or stuttering
   - ✅ No visual artifacts

**Expected Results:**
- Smooth performance even with rapid changes
- No memory leaks or performance degradation

---

### Test 3.2: Width Changes and Repositioning
**Objective:** Verify HUD repositions when line width changes

**Steps:**
1. Select a line with width 8
2. Increase width to 60 using increment button
   - ✅ HUD should slightly reposition (line clearance increases)
   - ✅ Repositioning should be smooth
3. Decrease width back to 1
   - ✅ HUD should reposition again
   - ✅ No visual glitches

**Expected Results:**
- Width changes trigger HUD recalculation
- LINE_CLEARANCE (width/2) is accounted for
- Smooth transitions during width adjustments

---

### Test 3.3: Delete Line Behavior
**Objective:** Verify HUD disappears when line is deleted

**Steps:**
1. Select a line
2. Click the **Delete** button
   - ✅ Line should be removed from canvas
   - ✅ HUD should disappear immediately
   - ✅ No errors in console

**Expected Results:**
- HUD cleans up properly on deletion
- No orphaned HUD elements
- State is properly reset

---

## Accessibility Testing

### Test 4.1: Keyboard Navigation
**Objective:** Verify all controls are keyboard accessible

**Steps:**
1. Select a line
2. Press `Tab` to navigate through HUD controls
   - ✅ Focus should move: Down Arrow → Input → Up Arrow → Delete
   - ✅ Focus indicators should be visible
3. Press `Enter` or `Space` on focused buttons
   - ✅ Buttons should activate
   - ✅ Width should change

**Expected Results:**
- All interactive elements are keyboard accessible
- Tab order is logical and intuitive
- Focus indicators are clearly visible

---

### Test 4.2: ARIA Labels
**Objective:** Verify screen reader accessibility

**Steps:**
1. Inspect HUD elements in browser DevTools
2. Check ARIA attributes:
   - ✅ Down arrow: `aria-label="Decrease width"`
   - ✅ Input: `aria-label="Line width value"`
   - ✅ Up arrow: `aria-label="Increase width"`
   - ✅ Delete: `aria-label="Delete selected line"`

**Expected Results:**
- All controls have descriptive ARIA labels
- Labels accurately describe control function

---

## Visual & UX Testing

### Test 5.1: Design Consistency
**Objective:** Verify styling matches application design language

**Steps:**
1. Compare HUD styling with existing UI elements
   - ✅ Border radius matches (rounded-2xl)
   - ✅ Shadow and backdrop blur consistent
   - ✅ Color scheme matches (neutral grays, tech blue)
   - ✅ Spacing and padding feel balanced

**Expected Results:**
- HUD feels like a native part of the application
- Professional, polished appearance
- Consistent with CAD-style tool aesthetic

---

### Test 5.2: Button Affordances
**Objective:** Verify buttons provide clear visual feedback

**Steps:**
1. Hover over increment/decrement buttons
   - ✅ Background changes to neutral-50
   - ✅ Transition is smooth
2. Hover over disabled buttons
   - ✅ Cursor shows "not-allowed"
   - ✅ No hover effect
3. Click buttons
   - ✅ Immediate visual response
   - ✅ Clear that action occurred

**Expected Results:**
- Buttons have clear hover states
- Disabled state is visually obvious
- Interactions feel responsive

---

## Test Summary Checklist

### Part 1: Slider Replacement
- [ ] Increment button increases width
- [ ] Decrement button decreases width
- [ ] Buttons disable at boundaries (1, 60)
- [ ] Direct number input works
- [ ] Invalid inputs are handled correctly
- [ ] Keyboard shortcuts (`[` and `]`) still work
- [ ] Input field is appropriately sized

### Part 2: Dynamic Positioning
- [ ] HUD positions above horizontal lines
- [ ] HUD flips below when near top edge
- [ ] HUD adjusts horizontally for vertical lines
- [ ] HUD handles diagonal lines correctly
- [ ] HUD maintains 8px edge padding
- [ ] Smooth transitions (200ms duration)
- [ ] Window resize triggers repositioning
- [ ] Sidebar toggle triggers repositioning
- [ ] Rapid selection changes work smoothly
- [ ] Width changes trigger repositioning
- [ ] Delete removes HUD properly

### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] ARIA labels are present and accurate
- [ ] Focus indicators are visible

### Visual/UX
- [ ] Design is consistent with app
- [ ] Buttons have clear hover states
- [ ] Disabled states are obvious
- [ ] Overall polish and professionalism

---

## Reporting Issues

If you encounter any issues during testing, please note:
1. **What you were doing** (specific test step)
2. **What you expected** (from checklist)
3. **What actually happened** (observed behavior)
4. **Browser and version** (e.g., Chrome 120)
5. **Console errors** (if any)

---

## Next Steps

After completing all tests:
1. Mark completed tests in the checklist
2. Report any issues found
3. Verify fixes for reported issues
4. Perform final regression testing
5. Sign off on implementation

---

**Testing Status:** Ready for testing
**Application URL:** http://localhost:5173/
**Last Updated:** 2025-10-08


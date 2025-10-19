"# FAB Positioning Test Checklist

## Pre-Test Setup
- [ ] Ensure sidebar is visible and functional
- [ ] FAB is visible in bottom-right area
- [ ] Browser window is wide enough to see both sidebar and FAB

## Test Scenarios

### 1. Expanded Sidebar State
- [ ] FAB maintains 24px spacing from sidebar edge
- [ ] FAB does not overlap with sidebar content
- [ ] FAB position is visually consistent with design system

### 2. Collapsed Sidebar State
- [ ] FAB repositions to 48px from screen edge (24px toggle + 24px spacing)
- [ ] FAB does not interfere with collapsed sidebar toggle
- [ ] Position looks natural and accessible

### 3. Transition Behavior
- [ ] Smooth animation when toggling sidebar (300ms duration)
- [ ] No jarring jumps or glitches during transition
- [ ] FAB remains clickable throughout transition
- [ ] Ease-in-out timing feels natural

### 4. Responsive Behavior
- [ ] Works correctly on different screen sizes
- [ ] Maintains proper spacing ratios
- [ ] No horizontal scrollbars introduced

### 5. Accessibility & Functionality
- [ ] FAB remains accessible via keyboard
- [ ] Click functionality preserved
- [ ] Hover effects work correctly
- [ ] Z-index keeps FAB above other elements

## Expected CSS Values
\\```css
/* Expanded state */
.fab-expanded {
  right: 344px; /* 320px sidebar + 24px spacing */
}

/* Collapsed state */
.fab-collapsed {
  right: 48px; /* 24px toggle button + 24px spacing */
}

/* Transition */
.fab-transition {
  transition: right 300ms ease-in-out;
  z-index: 50;
}
\\```

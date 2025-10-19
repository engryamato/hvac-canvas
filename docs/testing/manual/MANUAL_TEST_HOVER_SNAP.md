# Manual Test: Hover Snap Feature

## Feature Description
When entering drawing mode, the magnetic snapping indicator should appear **immediately** when hovering near existing lines, **before** clicking the first point.

## Test Steps

### Setup
1. Open the application at http://localhost:5173/
2. Ensure the canvas is visible

### Test 1: Draw Initial Line
1. Press `D` key to enter drawing mode
2. Click at position (100, 100) on the canvas
3. Click at position (300, 100) to complete a horizontal line
4. **Expected**: A horizontal line should be created and visible

### Test 2: Verify Hover Snap (NEW BEHAVIOR)
1. Ensure you're still in drawing mode (blue FAB button)
2. **Slowly** move your mouse cursor near the left endpoint of the line you just drew (around x=100, y=100)
3. **Expected**: As you get within ~20 pixels of the endpoint, a **cyan circle** should appear at the snap point
4. **Key Point**: This cyan circle should appear **BEFORE** you click - just by hovering!

### Test 3: Snap the Starting Point
1. With the cyan snap indicator visible, click to start a new line
2. Move your mouse to a different location (e.g., x=100, y=300)
3. Click to complete the line
4. **Expected**: The new line should start exactly at the snapped point (100, 100)

### Test 4: Exit Drawing Mode
1. Press `D` key to exit drawing mode
2. **Expected**: The cyan snap indicator should disappear immediately

### Test 5: Re-enter Drawing Mode
1. Press `D` key to re-enter drawing mode
2. Move mouse near any existing line endpoint
3. **Expected**: Cyan snap indicator should appear again

## Success Criteria

✅ Snap indicator (cyan circle) appears when hovering near lines in draw mode
✅ Snap indicator appears BEFORE clicking (not just during active drawing)
✅ Snap indicator disappears when exiting draw mode
✅ Lines can be drawn with snapped starting points
✅ Existing drawing functionality still works correctly

## Visual Reference

The snap indicator should look like:
- **Color**: Cyan (#06B6D4)
- **Shape**: Circle with radius ~7px
- **Fill**: Semi-transparent cyan
- **Stroke**: Solid cyan, 2px width

## Notes

- Snap thresholds:
  - Endpoints: 20px
  - Midpoints: 18px
  - Any point on line: 15px
- The snap indicator should prioritize endpoints over midpoints over line segments


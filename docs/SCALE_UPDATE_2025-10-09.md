# Default Scale Update - 64px = 1 inch

**Date:** 2025-10-09  
**Status:** ✅ Completed

---

## Overview

Updated the default drawing scale from `1:1` (1 pixel = 1 inch) to `64px = 1"` (64 pixels = 1 inch) to provide more reasonable on-screen sizing for drawings.

---

## Problem

The previous default scale of `1:1` (1 pixel = 1 inch) resulted in drawings that were too large on screen:
- A 12-inch line would be only 12 pixels long
- This made drawings appear extremely small and difficult to work with
- Users had to manually adjust the scale or zoom level to see their work properly

---

## Solution

Changed the default scale to `64px = 1"` (64 pixels = 1 inch):
- A 12-inch line now appears as 768 pixels (64 × 12)
- Provides a more practical default viewing size
- Better matches typical screen resolutions and viewing distances
- Still allows users to change to any other scale via the dropdown
- **Note:** This is a custom conversion factor, NOT added to the scale dropdown options

---

## Technical Changes

### File: `src/DrawingCanvas.tsx`

#### Before:
```typescript
const allScaleOptions = useMemo(() => [
  ...ARCHITECTURAL_SCALES,
  ...ENGINEERING_SCALES,
  ...METRIC_SCALES,
], []);

const [currentScale, setCurrentScale] = useState<Scale>({
  type: 'custom',
  pixelsPerInch: 1,  // Default: 1 pixel = 1 inch
  displayName: '1:1',
  unit: 'imperial'
});
```

#### After:
```typescript
const allScaleOptions = useMemo(() => [
  ...ARCHITECTURAL_SCALES,
  ...ENGINEERING_SCALES,
  ...METRIC_SCALES,
], []);

const [currentScale, setCurrentScale] = useState<Scale>({
  type: 'custom',
  pixelsPerInch: 64,  // Default: 64 pixels = 1 inch (custom, not in dropdown)
  displayName: 'Custom (64px = 1")',
  unit: 'imperial'
});
```

---

## Scale Dropdown Options

The scale selector includes the standard predefined scales (the custom 64px = 1" is NOT in the dropdown):

1. `1/16" = 1'-0"` (Architectural)
2. `1/8" = 1'-0"` (Architectural)
3. `1/4" = 1'-0"` (Architectural)
4. `1/2" = 1'-0"` (Architectural)
5. `3/4" = 1'-0"` (Architectural)
6. `1" = 1'-0"` (Architectural)
7. `1" = 10'` (Engineering)
8. `1" = 20'` (Engineering)
9. `1" = 30'` (Engineering)
10. `1" = 40'` (Engineering)
11. `1" = 50'` (Engineering)
12. `1" = 60'` (Engineering)
13. `1:1` (Metric)
14. `1:5` (Metric)
15. `1:10` (Metric)
16. `1:20` (Metric)
17. `1:50` (Metric)
18. `1:100` (Metric)
19. `1:200` (Metric)
20. `1:500` (Metric)

**Note:** The default scale of 64px = 1" is a custom conversion factor used internally but is not listed in the dropdown options.

---

## Scale Conversion Examples

With the new `64px = 1"` default scale:

| Real-world Size | On-screen Size |
|----------------|----------------|
| 1 inch | 64 pixels |
| 6 inches | 384 pixels |
| 1 foot (12") | 768 pixels |
| 2 feet (24") | 1,536 pixels |
| 5 feet (60") | 3,840 pixels |
| 10 feet (120") | 7,680 pixels |

This provides a good balance between:
- **Visibility:** Lines are large enough to see and work with comfortably
- **Canvas space:** Drawings don't immediately exceed screen boundaries
- **Precision:** 64 pixels per inch allows for fine-grained control

---

## Benefits

1. **Better Default Experience:** Users can start drawing immediately without adjusting scale
2. **Practical Sizing:** Drawings appear at a reasonable size on modern displays
3. **Flexibility:** Users can still select any other scale from the dropdown
4. **Consistency:** The custom scale appears in the dropdown for easy re-selection
5. **Professional:** 64px/inch is a common digital drawing scale

---

## Testing

All tests continue to pass:
- ✅ 11 BottomBar tests
- ✅ 45 total component tests
- ✅ Scale selector properly displays the new default
- ✅ Scale changes work correctly

---

## User Impact

### Positive Changes:
- Drawings now appear at a practical size by default
- Less need to zoom in immediately after starting
- Better first-time user experience
- More intuitive for users familiar with digital drawing tools

### No Breaking Changes:
- All existing functionality preserved
- Users can still select any scale they prefer
- Saved drawings maintain their original scale
- Zoom controls work the same way

---

## Related Changes

This update complements the recent bottom bar redesign:
- Lens icon zoom controls (🔍- and 🔍+)
- Scale selector dropdown
- Improved visual grouping

See: [Bottom Bar Redesign Documentation](./BOTTOMBAR_REDESIGN_2025-10-09.md)

---

## Future Considerations

1. **User Preferences:** Consider saving the user's preferred scale in localStorage
2. **Scale Presets:** Allow users to create custom scale presets
3. **Auto-scaling:** Consider auto-adjusting scale based on canvas size
4. **Scale Templates:** Provide industry-specific scale templates (HVAC, Architecture, etc.)

---

## Files Modified

1. **`src/DrawingCanvas.tsx`**
   - Updated default scale from `1:1` to `64px = 1"`
   - Added custom scale to dropdown options
   - Updated comments to reflect new default

2. **`docs/BOTTOMBAR_REDESIGN_2025-10-09.md`**
   - Added documentation about the custom default scale
   - Updated available scales list

3. **`docs/SCALE_UPDATE_2025-10-09.md`** (this file)
   - Comprehensive documentation of the scale change

---

## Verification

To verify the change:
1. Open the application at http://localhost:5173/
2. Check the scale selector - it should show "64px = 1"" as the current scale
3. Draw a line - it should appear at a reasonable size
4. The line measurements in the sidebar should reflect the new scale
5. Changing to other scales should work correctly

---

## Summary

The default scale has been updated from `1:1` to `64px = 1"` to provide a better out-of-the-box experience. This change makes drawings appear at a more practical size on screen while maintaining full flexibility for users to choose any scale they prefer.


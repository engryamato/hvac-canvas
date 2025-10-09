# HVAC Canvas Application - User Flows Documentation

**Date Created:** 2025-10-09  
**Purpose:** Document step-by-step user interactions to ensure behavior consistency after refactoring.

---

## Flow 1: Initial Application Load

### Steps:
1. User navigates to application URL
2. Browser loads HTML, CSS, and JavaScript
3. React application initializes
4. DrawingCanvas component mounts
5. Canvas element created with HiDPI support
6. Event listeners attached

### Expected State:
- ✅ Sidebar visible (expanded, 320px width)
- ✅ Sidebar shows "Line Summary" header
- ✅ Sidebar shows "Scale: 1:1"
- ✅ Sidebar shows "No lines drawn yet" message
- ✅ Canvas visible (white background, fills available space)
- ✅ Draw button visible (white/inactive, bottom-right)
- ✅ Bottom bar visible (60px height, zoom controls)
- ✅ Sidebar toggle button visible (right edge)
- ✅ Zoom indicator shows "Zoom: 100%"
- ✅ All buttons enabled (except zoom limits)

### Validation:
- Canvas dimensions: `calc(100% - 320px)` × `calc(100vh - 60px)`
- No console errors
- No visual glitches
- All interactive elements focusable

---

## Flow 2: Toggle Draw Mode

### Steps:
1. User presses **D** key OR clicks Draw button
2. `isDrawActive` state changes to `true`
3. Component re-renders
4. Canvas cursor changes to crosshair
5. Draw button changes to active state (blue)

### Expected Changes:
- ✅ Draw button background: white → blue (#2563EB)
- ✅ Draw button ring: neutral-200 → tech-blue-300
- ✅ Draw button icon scales up (1.0 → 1.1)
- ✅ Canvas cursor: default → crosshair
- ✅ Button aria-label: "Enable Draw tool" → "Disable Draw tool"
- ✅ Button aria-pressed: false → true

### Deactivation:
1. User presses **D** key again OR clicks Draw button
2. `isDrawActive` state changes to `false`
3. All changes reverse

### Validation:
- State toggles correctly
- Visual feedback immediate
- No side effects on other UI elements

---

## Flow 3: Draw a Line (Click-Click Interaction)

### Prerequisites:
- Draw mode active (blue button, crosshair cursor)

### Steps:
1. User clicks on canvas (first click)
   - `drawingState.phase` changes to 'waiting-for-end'
   - `drawingState.startPoint` set to click position
   - Snap detection runs, may snap to nearby line
2. User moves mouse
   - `drawingState.endPoint` updates continuously
   - Snap detection runs on every move
   - Snap indicator appears if near snap target (cyan circle)
   - Draft line renders (dashed gray line from start to cursor)
3. User clicks on canvas (second click)
   - Line length calculated
   - If length > 2px, line is created
   - Line added to `lines` array
   - Line automatically selected
   - `drawingState` resets to 'idle'
   - Width HUD appears above new line

### Expected Behavior:
- ✅ First click sets start point (no visual change except snap indicator)
- ✅ Mouse move shows draft line (dashed, gray)
- ✅ Snap indicator appears within thresholds (20px/18px/15px)
- ✅ Second click creates line (solid, black, default width)
- ✅ Line appears immediately
- ✅ Line is selected (blue highlight)
- ✅ Width HUD appears above line
- ✅ Sidebar updates with line summary
- ✅ Drawing state resets (ready for next line)

### Edge Cases:
- **Too short:** If line length ≤ 2px, no line created
- **Snap:** Final point uses snap target if available
- **Cancel:** Escape key cancels drawing, resets state

### Validation:
- Line coordinates stored correctly
- Line renders at correct position
- Snap works for all types (endpoint, midpoint, line)
- HUD positioned correctly

---

## Flow 4: Select and Edit Line Width

### Prerequisites:
- At least one line drawn on canvas
- Draw mode inactive

### Steps:
1. User clicks on existing line
   - Hit test performed (tolerance based on line width)
   - Line selected if click within tolerance
   - `selectedId` set to line ID
   - Component re-renders
   - Width HUD appears above line
2. User edits width using HUD controls:
   - **Decrement button:** Width decreases by 1 (min: 1)
   - **Increment button:** Width increases by 1 (max: 60)
   - **Number input:** User types new value (1-60)
   - **Keyboard [ key:** Width decreases by 1
   - **Keyboard ] key:** Width increases by 1
3. Each change updates line width immediately
4. Canvas re-renders with new width
5. Sidebar updates total length (if width affects grouping)

### Expected Behavior:
- ✅ Click on line selects it
- ✅ Selection highlight appears (8px wider, blue, 15% opacity)
- ✅ Width HUD appears above line
- ✅ HUD shows current width value
- ✅ All width controls functional
- ✅ Width changes immediately visible
- ✅ Width clamped to 1-60 range
- ✅ Invalid input rejected (non-numbers, out of range)
- ✅ Sidebar updates if grouping changes

### HUD Positioning:
- **Default:** Above line, centered horizontally
- **Near top edge:** Flips to below line
- **Near left edge:** Shifts right (8px padding)
- **Near right edge:** Shifts left (8px padding)
- **Near bottom:** Constrained to visible area (60px clearance)

### Validation:
- HUD always visible and accessible
- Width changes persist
- No visual glitches during updates

---

## Flow 5: Delete Line

### Prerequisites:
- At least one line drawn on canvas
- Line selected (Width HUD visible)

### Method 1: Delete Button
1. User clicks "Delete" button in Width HUD
2. Line removed from `lines` array
3. `selectedId` set to null
4. `hudPosition` set to null
5. Component re-renders
6. Line disappears
7. Width HUD disappears
8. Sidebar updates

### Method 2: Delete Key
1. User presses **Delete** or **Backspace** key
2. Same behavior as Method 1
3. Browser back navigation prevented (Backspace)

### Expected Behavior:
- ✅ Line removed immediately
- ✅ Width HUD disappears
- ✅ Sidebar updates (line count, summary)
- ✅ No console errors
- ✅ Canvas re-renders cleanly

### Validation:
- Line completely removed from state
- No orphaned references
- Sidebar reflects accurate count

---

## Flow 6: Zoom In/Out

### Method 1: Mouse Wheel
1. User scrolls mouse wheel over canvas
2. Wheel event captured (default scroll prevented)
3. Zoom direction determined (up = in, down = out)
4. New scale calculated (current × 1.1 or ÷ 1.1)
5. Scale clamped to 0.1 - 10.0 range
6. Mouse position in canvas space calculated
7. New offset calculated to keep mouse position fixed
8. `viewportScale` and `viewportOffset` updated
9. Canvas re-renders with new transform
10. Zoom indicator updates

### Method 2: Keyboard
- **+ or =:** Zoom in (same as wheel up)
- **- or _:** Zoom out (same as wheel down)
- **Ctrl+0 or Cmd+0:** Reset to 100%, offset to {0, 0}

### Method 3: Bottom Bar Buttons
- **Zoom In button:** Same as + key
- **Zoom Out button:** Same as - key
- **Reset View button:** Same as Ctrl+0

### Expected Behavior:
- ✅ Zoom centers on mouse cursor (wheel) or canvas center (keyboard/buttons)
- ✅ Zoom smooth and responsive
- ✅ Zoom indicator updates (e.g., "Zoom: 150%")
- ✅ Zoom limits enforced (10% - 1000%)
- ✅ Buttons disable at limits
- ✅ Lines scale correctly
- ✅ HUD repositions if line selected

### Validation:
- Mouse position stays fixed during wheel zoom
- Reset returns to exact initial state
- No visual artifacts during zoom

---

## Flow 7: Pan Canvas

### Prerequisites:
- Canvas has content (lines drawn)
- Optionally zoomed in for better pan visibility

### Steps:
1. User right-clicks on canvas (button 2)
2. Context menu prevented
3. `isPanning` set to true
4. Pan start position and initial offset captured
5. Cursor changes to 'grabbing'
6. User drags mouse
7. On each mouse move:
   - Delta calculated (current - start)
   - New offset = initial offset + delta
   - `viewportOffset` updated
   - Canvas re-renders
8. User releases right-click
9. `isPanning` set to false
10. Cursor returns to normal (crosshair or default)

### Expected Behavior:
- ✅ Right-click initiates pan (no context menu)
- ✅ Cursor changes to grabbing
- ✅ Canvas content moves with mouse
- ✅ Pan smooth and responsive (60 FPS)
- ✅ Pan works at any zoom level
- ✅ Release stops pan
- ✅ Cursor returns to appropriate state

### Validation:
- Pan offset calculated correctly
- No drift or lag
- Works with zoom

---

## Flow 8: Snap to Line Features

### Prerequisites:
- At least one line drawn on canvas
- Draw mode active
- Starting to draw a new line

### Snap to Endpoint:
1. User clicks to start new line
2. User moves cursor near existing line's endpoint (within 20px)
3. Snap indicator appears at endpoint (cyan circle, 7px radius)
4. Draft line endpoint snaps to exact endpoint position
5. User clicks to complete line
6. New line connects exactly to endpoint

### Snap to Midpoint:
1. User moves cursor near existing line's midpoint (within 18px)
2. Snap indicator appears at midpoint
3. Draft line endpoint snaps to exact midpoint position
4. User clicks to complete line
5. New line connects exactly to midpoint

### Snap to Line:
1. User moves cursor near existing line (within 15px, not endpoint/midpoint)
2. Snap indicator appears at closest point on line
3. Draft line endpoint snaps to that point
4. User clicks to complete line
5. New line connects exactly to that point

### Snap Priority:
- Endpoint (20px) > Midpoint (18px) > Line (15px)
- If multiple snap targets, closest one wins

### Expected Behavior:
- ✅ Snap indicator appears/disappears smoothly
- ✅ Snap indicator positioned exactly at snap point
- ✅ Draft line endpoint updates to snap point
- ✅ Final line uses snap point
- ✅ Snap works at any zoom level
- ✅ Snap thresholds consistent

### Validation:
- Lines connect precisely
- No gaps or overlaps
- Snap indicator visible and accurate

---

## Flow 9: Sidebar Toggle

### Steps:
1. User clicks sidebar toggle button
2. `sidebarCollapsed` state toggles
3. Component re-renders
4. Sidebar width animates (320px → 0px or vice versa)
5. Canvas width adjusts to fill space
6. Draw button repositions
7. Toggle button icon changes

### Expected Behavior:
- ✅ Sidebar collapses/expands smoothly
- ✅ Canvas width adjusts (no layout shift)
- ✅ Draw button moves to maintain 24px from edge
- ✅ Toggle icon changes (ChevronRight ↔ ChevronLeft)
- ✅ Lines remain in same canvas coordinates
- ✅ HUD repositions if line selected

### Validation:
- No visual glitches
- Smooth transition
- All elements reposition correctly

---

## Flow 10: Window Resize

### Steps:
1. User resizes browser window
2. ResizeObserver detects change
3. Canvas dimensions recalculated
4. Canvas element resized (HiDPI support maintained)
5. Viewport transform reapplied
6. Canvas re-renders
7. HUD repositions if line selected

### Expected Behavior:
- ✅ Canvas fills available space
- ✅ Lines maintain their coordinates
- ✅ Viewport transform maintained
- ✅ HUD repositions correctly
- ✅ No visual artifacts
- ✅ Responsive at any window size

### Validation:
- Canvas always fills container
- Lines don't move in canvas space
- HUD always visible

---

## Flow 11: Keyboard Shortcut Summary

### All Shortcuts:
| Key | Action | Context |
|-----|--------|---------|
| D | Toggle draw mode | Global |
| [ | Decrease width | Selected line or draw mode |
| ] | Increase width | Selected line or draw mode |
| + or = | Zoom in | Global |
| - or _ | Zoom out | Global |
| Ctrl+0 / Cmd+0 | Reset view | Global |
| Escape | Cancel drawing | Drawing in progress |
| Delete / Backspace | Delete line | Line selected |

### Expected Behavior:
- ✅ All shortcuts work as documented
- ✅ Shortcuts provide immediate feedback
- ✅ No conflicts with browser shortcuts (except prevented ones)
- ✅ Tooltips show shortcuts

---

## Flow 12: Error Handling

### Invalid Width Input:
1. User types invalid value in width input (e.g., "abc", "0", "100")
2. On blur, value resets to current width
3. No error message (silent correction)

### Line Too Short:
1. User clicks twice in nearly same position
2. Line length ≤ 2px
3. No line created
4. Drawing state resets
5. No error message

### Expected Behavior:
- ✅ Invalid input handled gracefully
- ✅ No console errors
- ✅ User can continue working

---

**End of User Flows Documentation**

**Note:** These flows should be tested manually after each refactoring phase to ensure behavior consistency.


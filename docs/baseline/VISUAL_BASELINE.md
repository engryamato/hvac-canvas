# HVAC Canvas Application - Visual Baseline Documentation

**Date Created:** 2025-10-09  
**Purpose:** Document the visual appearance of the application before refactoring to detect visual regressions.

---

## Screenshots Captured

### 1. Initial Load State
**Filename:** `screenshots/01-initial-load.png`  
**Description:**
- Sidebar visible on the right (320px width)
- "Line Summary" header with "Scale: 1:1"
- "No lines drawn yet" message in sidebar
- White canvas filling main area
- Draw FAB button (white, inactive) at bottom-right
- Bottom bar with zoom controls at bottom
- Sidebar toggle button visible

**Expected Elements:**
- ✅ Canvas element (white background)
- ✅ Sidebar (expanded, 320px)
- ✅ Draw button (bottom-right, white/inactive)
- ✅ Bottom bar (60px height, zoom controls)
- ✅ Sidebar toggle (right edge)

---

### 2. Draw Mode Active
**Filename:** `screenshots/02-draw-mode-active.png`  
**Description:**
- Draw FAB button now blue (tech-blue-600)
- Canvas cursor changes to crosshair
- All other UI elements unchanged
- Button shows "Disable Draw tool" aria-label

**Expected Changes:**
- ✅ Draw button background: white → blue
- ✅ Draw button ring: neutral-200 → tech-blue-300
- ✅ Canvas cursor: default → crosshair
- ✅ Button aria-pressed: false → true

---

### 3. Line Selected with HUD
**Filename:** `screenshots/03-line-selected-hud.png`  
**Description:**
- One or more lines drawn on canvas
- One line selected (highlighted with blue overlay)
- Width HUD visible above selected line
- HUD contains: "Width" label, decrement button, input field, increment button, unit display, delete button
- HUD has rounded corners, shadow, semi-transparent white background

**Expected Elements:**
- ✅ Drawn line(s) on canvas
- ✅ Selected line with blue highlight (8px wider)
- ✅ Width HUD positioned above line
- ✅ HUD controls functional
- ✅ Sidebar shows line summary (count, size, length)

---

### 4. Sidebar Collapsed
**Filename:** `screenshots/04-sidebar-collapsed.png`  
**Description:**
- Sidebar hidden (width: 0)
- Sidebar toggle button shows ChevronLeft icon
- Canvas expands to fill available space
- Draw button repositions closer to right edge (24px from edge)
- Bottom bar unchanged

**Expected Changes:**
- ✅ Sidebar width: 320px → 0px
- ✅ Canvas width increases
- ✅ Draw button right position adjusts
- ✅ Toggle icon: ChevronRight → ChevronLeft

---

### 5. Zoom at 50%
**Filename:** `screenshots/05-zoom-50.png`  
**Description:**
- Zoom indicator shows "Zoom: 50%"
- Canvas content appears smaller
- Lines maintain their pixel width but appear smaller relative to viewport
- Zoom out button may be disabled if at minimum
- All UI elements maintain position

**Expected State:**
- ✅ Zoom indicator: "Zoom: 50%"
- ✅ Canvas content scaled down
- ✅ Zoom out button state reflects limit
- ✅ Lines visible but smaller

---

### 6. Zoom at 100% (Default)
**Filename:** `screenshots/06-zoom-100.png`  
**Description:**
- Zoom indicator shows "Zoom: 100%"
- Canvas at default scale
- This is the baseline zoom level
- Both zoom buttons enabled

**Expected State:**
- ✅ Zoom indicator: "Zoom: 100%"
- ✅ Canvas at 1:1 scale
- ✅ Both zoom buttons enabled

---

### 7. Zoom at 200%
**Filename:** `screenshots/07-zoom-200.png`  
**Description:**
- Zoom indicator shows "Zoom: 200%"
- Canvas content appears larger
- Lines maintain their pixel width but appear larger relative to viewport
- Zoom in button enabled (max is 1000%)
- Pan may be needed to see all content

**Expected State:**
- ✅ Zoom indicator: "Zoom: 200%"
- ✅ Canvas content scaled up
- ✅ Zoom in button enabled
- ✅ Lines visible and larger

---

## Video Recordings

### Video 1: Complete User Flow
**Filename:** `videos/complete-flow.mp4`  
**Duration:** ~30-45 seconds  
**Steps Demonstrated:**
1. Initial load (sidebar visible, canvas empty)
2. Toggle draw mode (D key or button click)
3. Draw first line (click-click interaction)
4. Draw second line (demonstrating snap to endpoint)
5. Select first line (click on line)
6. Width HUD appears
7. Edit width using increment button
8. Edit width using keyboard (] key)
9. Delete line using Delete button
10. Return to initial state

**Key Behaviors to Observe:**
- Smooth transitions
- HUD positioning (above line, flips if near edge)
- Snap indicator appearance (cyan circle)
- Line selection highlight
- Sidebar updates with line summary

---

### Video 2: Zoom and Pan Interaction
**Filename:** `videos/zoom-pan.mp4`  
**Duration:** ~20-30 seconds  
**Steps Demonstrated:**
1. Draw a few lines for reference
2. Zoom in using mouse wheel
3. Zoom indicator updates
4. Pan using right-click drag
5. Cursor changes to grabbing
6. Zoom out using keyboard (- key)
7. Reset view using Ctrl+0
8. Canvas returns to center, 100% zoom

**Key Behaviors to Observe:**
- Zoom centers on mouse cursor position
- Pan is smooth and responsive
- Cursor changes appropriately
- Reset view returns to exact initial state
- Zoom limits enforced (buttons disable at limits)

---

### Video 3: Snap Behavior Demonstration
**Filename:** `videos/snap-behavior.mp4`  
**Duration:** ~20-30 seconds  
**Steps Demonstrated:**
1. Draw first line
2. Start drawing second line
3. Move cursor near first line's endpoint → snap indicator appears
4. Move cursor near first line's midpoint → snap indicator moves
5. Move cursor near first line (not endpoint/midpoint) → snap to line
6. Complete line with snap
7. Demonstrate snap threshold (move just outside range, indicator disappears)

**Key Behaviors to Observe:**
- Snap indicator (cyan circle, 7px radius)
- Snap priority: endpoint > midpoint > line
- Snap thresholds: 20px, 18px, 15px respectively
- Smooth indicator movement
- Line connects exactly to snap point

---

## Visual Specifications

### Color Palette
- **Tech Blue 300:** `#60A5FA` (button ring, active state)
- **Tech Blue 500:** `#3B82F6`
- **Tech Blue 600:** `#2563EB` (button background, active)
- **Tech Blue 700:** `#1D4ED8` (button hover)
- **Neutral 200:** `#E5E5E5` (borders, inactive ring)
- **Neutral 500:** `#737373` (secondary text)
- **Neutral 700:** `#404040` (primary text)
- **Neutral 800:** `#262626` (headings)
- **Snap Indicator:** `#06B6D4` (cyan)
- **Selection Highlight:** `rgba(37, 99, 235, 0.15)` (blue, 15% opacity)

### Typography
- **Font Family:** Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial
- **Heading (Sidebar):** 1.125rem (18px), font-weight: 600
- **Body Text:** 0.875rem (14px), font-weight: 400
- **Small Text:** 0.75rem (12px)
- **Tabular Numbers:** font-variant-numeric: tabular-nums

### Spacing
- **Sidebar Width:** 320px
- **Bottom Bar Height:** 60px
- **Draw Button Size:** 56px × 56px (3.5rem)
- **Draw Button Position:** 24px from right, 24px from bottom (adjusted for sidebar)
- **HUD Padding:** 16px horizontal, 8px vertical
- **HUD Gap:** 12px between elements
- **Edge Padding:** 8px (industry standard)

### Shadows
- **Draw Button:** `box-shadow: 0 10px 15px rgba(0,0,0,0.1)`
- **Width HUD:** `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`
- **Bottom Bar:** `box-shadow: 0 -2px 10px rgba(0,0,0,0.1)`

### Borders
- **Sidebar:** 1px solid #E5E5E5 (left border)
- **Bottom Bar:** 1px solid #E5E5E5 (top border)
- **Width HUD:** 1px solid #E5E5E5
- **Buttons:** 2px solid (varies by state)

### Transitions
- **Width HUD:** `transition-all duration-200 ease-out`
- **Buttons:** `transition-colors` (150ms)
- **Draw Button Icon:** `transition-transform` (150ms)

---

## Layout Specifications

### Canvas Container
- **Width:** `calc(100% - ${sidebarWidth}px)` where sidebarWidth = 320 or 0
- **Height:** `calc(100vh - 60px)` (subtract bottom bar)
- **Position:** Relative
- **Overflow:** Hidden

### Sidebar
- **Width:** 320px (expanded) or 0px (collapsed)
- **Height:** 100vh
- **Position:** Fixed right
- **Z-index:** Default (below bottom bar)

### Bottom Bar
- **Width:** 100vw
- **Height:** 60px
- **Position:** Fixed bottom
- **Z-index:** 10 (above canvas and sidebar)

### Draw Button
- **Position:** Fixed
- **Bottom:** 24px (1.5rem)
- **Right:** `${sidebarWidth + 24}px`
- **Z-index:** Default (below bottom bar, above canvas)

### Width HUD
- **Position:** Absolute (within canvas container)
- **Top/Left:** Calculated dynamically
- **Z-index:** Default (above canvas, below bottom bar)

---

## Responsive Behavior

### Window Resize
- Canvas container adjusts to new dimensions
- Canvas element resizes via ResizeObserver
- HUD position recalculates
- Drawn lines maintain their coordinates (canvas space)
- Viewport transform maintained

### Sidebar Toggle
- Canvas width adjusts smoothly
- Draw button repositions
- No layout shift in bottom bar
- Lines remain in same canvas coordinates

---

## Accessibility Features

### ARIA Labels
- Draw button: "Enable Draw tool" / "Disable Draw tool"
- Sidebar toggle: "Expand sidebar" / "Collapse sidebar"
- Zoom buttons: "Zoom in" / "Zoom out"
- Reset button: "Reset view to 100%"
- Width controls: "Increase width" / "Decrease width"
- Delete button: "Delete selected line"
- Canvas: `aria-label="Drawing canvas"`, `role="img"`

### Keyboard Navigation
- All interactive elements focusable
- Focus visible (outline)
- Keyboard shortcuts documented in tooltips

### Visual Indicators
- Button states clearly differentiated
- Disabled states have reduced opacity (40%)
- Hover states provide feedback
- Active/pressed states visually distinct

---

**End of Visual Baseline Documentation**

**Note:** Actual screenshots and videos should be captured manually or via automated screenshot tools and stored in the `docs/baseline/screenshots/` and `docs/baseline/videos/` directories.


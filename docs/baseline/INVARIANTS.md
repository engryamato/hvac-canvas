# HVAC Canvas Application - Invariants Documentation

**Date Created:** 2025-10-09  
**Purpose:** Document the current state of the application before refactoring to serve as a baseline for regression detection.

---

## 1. DOM Structure

### **Root Container**
```
<div class="fixed inset-0 w-screen h-screen overflow-hidden flex">
  ├── <TechBlueTokens /> (CSS variables)
  ├── Canvas Container (flex-1, calc(100vh - 60px))
  │   ├── <canvas> (absolute inset-0)
  │   ├── Width HUD (conditional, absolute positioned)
  │   └── Draw FAB Button (fixed bottom-6 right-6)
  ├── Sidebar Toggle Button (fixed, right edge)
  ├── Sidebar (conditional, 320px width)
  └── Bottom Bar (fixed bottom-0, 60px height)
```

### **Canvas Container**
- **Element:** `<div ref={containerRef}>`
- **Classes:** `flex-1 relative overflow-hidden`
- **Dimensions:** `width: calc(100% - ${sidebarWidth}px)`, `height: calc(100vh - 60px)`
- **Purpose:** Contains the drawing canvas and overlays

### **Canvas Element**
- **Element:** `<canvas ref={canvasRef}>`
- **Classes:** `absolute inset-0 bg-white` + cursor classes
- **Cursor States:**
  - `cursor-crosshair` when `isDrawActive === true`
  - `cursor-default` when `isDrawActive === false`
  - `cursor: grabbing` when panning (right-click drag)
- **Attributes:**
  - `aria-label="Drawing canvas"`
  - `role="img"`
  - `style={{ touchAction: 'none' }}`

### **Width HUD (Conditional)**
- **Visibility:** Only when `selectedId && hudPosition`
- **Element:** `<div ref={hudRef}>`
- **Classes:** `absolute rounded-2xl shadow-md border border-neutral-200 bg-white/95 backdrop-blur px-4 py-2 flex items-center gap-3 transition-all duration-200 ease-out`
- **Position:** Dynamic, calculated by `calculateHudPosition()`
- **Contents:**
  - Label: "Width"
  - Decrement button (ChevronDown icon)
  - Number input (width value, 1-60 range)
  - Increment button (ChevronUp icon)
  - Display unit (e.g., "8px")
  - Delete button

### **Draw FAB Button**
- **Element:** `<button>`
- **Classes:** Dynamic based on `isDrawActive` state
- **Position:** `fixed bottom-6`, `right: ${sidebarWidth + 24}px`
- **Dimensions:** `h-14 w-14 rounded-full`
- **States:**
  - Active: `bg-[var(--tech-blue-600)] ring-[var(--tech-blue-300)]`
  - Inactive: `bg-white ring-neutral-200`
- **Icon:** Pencil (from lucide-react)
- **Attributes:**
  - `aria-label`: "Enable Draw tool" or "Disable Draw tool"
  - `aria-pressed`: boolean
  - `title="Toggle Draw (D)"`

### **Sidebar Toggle Button**
- **Position:** `fixed top-0 bottom-0`, `right: ${sidebarWidth}px`
- **Width:** `w-6`
- **Icon:** ChevronLeft (collapsed) or ChevronRight (expanded)
- **Attributes:**
  - `aria-label`: "Expand sidebar" or "Collapse sidebar"

### **Sidebar (Conditional)**
- **Visibility:** Only when `!sidebarCollapsed`
- **Width:** `320px`
- **Classes:** `h-full bg-white border-l border-neutral-200 flex flex-col`
- **Structure:**
  - Header: "Line Summary" + scale display
  - Content: Scrollable table or "No lines drawn yet" message
- **Table Columns:**
  - Count (number of lines)
  - Size (width in inches)
  - Total Length (formatted length)

### **Bottom Bar**
- **Position:** `fixed bottom-0 left-0 right-0`
- **Height:** `60px`
- **Classes:** `bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center gap-4`
- **Contents:**
  - Zoom Out button (− symbol)
  - Zoom indicator + Reset View button
  - Zoom In button (+ symbol)
  - Pan instruction text

---

## 2. Keyboard Shortcuts

| Key | Action | Context | Behavior |
|-----|--------|---------|----------|
| **D** | Toggle Draw Mode | Global | Toggles `isDrawActive` state |
| **[** | Decrease Width | Selected line OR Draw mode | Decrements width by 1 (min: 1) |
| **]** | Increase Width | Selected line OR Draw mode | Increments width by 1 (max: 60) |
| **+** or **=** | Zoom In | Global | Multiplies scale by 1.1 (max: 10.0) |
| **-** or **_** | Zoom Out | Global | Divides scale by 1.1 (min: 0.1) |
| **Ctrl+0** or **Cmd+0** | Reset View | Global | Sets scale to 1.0, offset to {x:0, y:0} |
| **Escape** | Cancel Drawing | Drawing in progress | Resets drawing state to idle |
| **Delete** or **Backspace** | Delete Line | Line selected | Deletes selected line, prevents browser back |

**Notes:**
- All keyboard handlers are attached to `window` via `addEventListener`
- Handlers are cleaned up on component unmount
- Some keys prevent default browser behavior (e.g., Backspace, Ctrl+0)

---

## 3. Mouse/Touch Interactions

### **Left Click (Primary Button)**
- **Draw Mode Idle:** First click sets start point, enters "waiting-for-end" phase
- **Draw Mode Waiting:** Second click creates line (if length > 2px), resets to idle
- **Selection Mode:** Selects line via hit test, shows Width HUD

### **Right Click (Secondary Button)**
- **Action:** Initiates pan mode
- **Behavior:** 
  - Sets `isPanning = true`
  - Captures start position and current offset
  - Changes cursor to `grabbing`
  - Context menu is prevented

### **Mouse Move**
- **Pan Mode:** Updates viewport offset based on drag delta
- **Draw Mode:** Updates snap target and draft line endpoint
- **Selection Mode:** No action

### **Mouse Wheel**
- **Action:** Zoom in/out
- **Behavior:**
  - Prevents page scroll
  - Zooms toward cursor position (mouse position stays fixed in canvas space)
  - Respects min/max zoom limits (0.1 - 10.0)

### **Touch Gestures**
- **Two-Finger Pinch:** Zoom in/out
- **Behavior:**
  - Calculates distance between two touch points
  - Scales viewport based on distance change
  - Zooms toward midpoint between fingers

---

## 4. Rendering Timing & Effects

### **useEffect Dependencies**

#### **Canvas Setup & Resize**
```javascript
useEffect(() => {
  // Runs when: viewportScale, viewportOffset, or render function changes
  // Actions: setupHiDPICanvas, attach ResizeObserver
}, [viewportScale, viewportOffset, render])
```

#### **Render Trigger**
```javascript
useEffect(() => { render(); }, [render])
```

#### **Re-render on State Changes**
```javascript
useEffect(() => { render(); }, [lines, drawingState, selectedId, render])
```

#### **HUD Position Recalculation**
```javascript
useEffect(() => {
  // Runs when: selectedId or lines change
  // Action: Recalculate HUD position
}, [selectedId, lines, calculateHudPosition])

useEffect(() => {
  // Runs when: selectedId changes
  // Action: Recalculate HUD position on window resize
  // Cleanup: Remove resize listener
}, [selectedId, calculateHudPosition])
```

#### **Keyboard Shortcuts**
```javascript
useEffect(() => {
  // Runs when: isDrawActive, selectedId, drawingState, or deleteLine changes
  // Action: Attach keydown listener
  // Cleanup: Remove keydown listener
}, [isDrawActive, selectedId, drawingState, deleteLine])
```

#### **Clear Snap on Mode Exit**
```javascript
useEffect(() => {
  // Runs when: isDrawActive changes
  // Action: Clear snap target when exiting draw mode
}, [isDrawActive, drawingState])
```

---

## 5. State Variables

### **Tool/UI State**
- `isDrawActive: boolean` - Draw mode toggle
- `lines: Line[]` - Array of drawn lines
- `selectedId: string | null` - Currently selected line ID
- `hudPosition: { x: number; y: number } | null` - Width HUD position

### **Drawing State (via useDrawingState hook)**
- `phase: DrawingPhase` - 'idle' | 'waiting-for-end'
- `startPoint: Pt | null` - First click position
- `endPoint: Pt | null` - Current cursor position (draft)
- `snapTarget: SnapTarget | null` - Current snap target

### **Scale Management**
- `currentScale: Scale` - Current scale configuration
  - Default: `{ type: 'custom', pixelsPerInch: 1, displayName: '1:1', unit: 'imperial' }`

### **Sidebar State**
- `sidebarCollapsed: boolean` - Sidebar visibility toggle
- `defaultWidth: number` - Default line width (default: 8)
- `defaultColor: string` - Default line color (default: "#111827")

### **Viewport Transform**
- `viewportScale: number` - Zoom level (default: 1.0, range: 0.1 - 10.0)
- `viewportOffset: Pt` - Pan offset (default: {x: 0, y: 0})

### **Pan Interaction**
- `isPanning: boolean` - Pan mode active
- `panStart: Pt | null` - Pan start position
- `panOffsetStart: Pt | null` - Viewport offset at pan start

### **Touch Gesture**
- `touchStartDistance: number | null` - Initial distance between touches
- `touchStartScale: number` - Viewport scale at touch start
- `touchStartOffset: Pt | null` - Viewport offset at touch start

---

## 6. Component Lifecycle

### **Mount**
1. Initialize all state variables to defaults
2. Attach keyboard event listener to window
3. Set up canvas with HiDPI support
4. Attach ResizeObserver to container
5. Initial render

### **Update (State Changes)**
1. State change triggers re-render
2. useEffect hooks run based on dependencies
3. Canvas re-rendered if lines/drawing state changes
4. HUD position recalculated if selection changes

### **Unmount**
1. Remove keyboard event listener
2. Disconnect ResizeObserver
3. Clean up all event listeners

---

## 7. Constants & Configuration

### **Zoom/Pan**
- `ZOOM_FACTOR: 1.1` (10% per step)
- `MIN_ZOOM: 0.1` (10%)
- `MAX_ZOOM: 10.0` (1000%)

### **Drawing**
- `MIN_LINE_LENGTH: 2` (pixels)
- `SELECTION_HIGHLIGHT_WIDTH: 8` (pixels)
- `HIT_TEST_MIN_TOLERANCE: 6` (pixels)
- `HIT_TEST_WIDTH_FACTOR: 1.5`

### **Snap System**
- `SNAP_THRESHOLD_ENDPOINT: 20` (pixels)
- `SNAP_THRESHOLD_MIDPOINT: 18` (pixels)
- `SNAP_THRESHOLD_LINE: 15` (pixels)
- `SNAP_INDICATOR_RADIUS: 7` (pixels)
- `SNAP_INDICATOR_COLOR: '#06B6D4'` (cyan)
- `SNAP_INDICATOR_FILL: 'rgba(6, 182, 212, 0.3)'`

### **HUD Positioning**
- `VERTICAL_OFFSET: 16` (pixels)
- `EDGE_PADDING: 8` (pixels)
- Bottom bar clearance: `60px`

---

## 8. Critical Behaviors

### **Line Creation**
1. User clicks in draw mode → sets start point
2. User moves mouse → updates draft line endpoint with snap
3. User clicks again → creates line if length > 2px
4. Line is added to `lines` array
5. Line is automatically selected
6. Width HUD appears at calculated position

### **Snap Detection**
1. On mouse move in draw mode, find closest snap target
2. Priority: endpoint (20px) > midpoint (18px) > line (15px)
3. Visual indicator (cyan circle) appears at snap point
4. Final point uses snap point if available, otherwise raw cursor position

### **Zoom Behavior**
1. Mouse wheel or keyboard triggers zoom
2. Calculate new scale (clamped to min/max)
3. Calculate mouse position in canvas space (before zoom)
4. Calculate new offset to keep mouse position fixed
5. Update scale and offset simultaneously
6. Canvas re-renders with new transform

### **Pan Behavior**
1. Right-click down → enter pan mode
2. Mouse move → calculate delta from start
3. Update offset by delta
4. Right-click up → exit pan mode

---

## 9. Known Issues (Pre-Refactoring)

1. **Test Failure:** One Playwright test failing due to bottom bar overlapping draw button
2. **File Size:** DrawingCanvas.tsx is 1,228 lines (exceeds best practices)
3. **Mixed Concerns:** UI, business logic, and utilities all in one file
4. **No Unit Tests:** Only E2E tests exist
5. **Limited Reusability:** Utilities and hooks embedded in component

---

**End of Invariants Documentation**


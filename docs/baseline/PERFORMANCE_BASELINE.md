# HVAC Canvas Application - Performance Baseline

**Date Created:** 2025-10-09  
**Purpose:** Document performance metrics before refactoring to detect performance regressions.

---

## Build Metrics

### Bundle Size (Production Build)
```
Build Tool: Vite 4.5.14
Build Time: 644ms
Total Modules Transformed: 1,293

Output Files:
├── index.html          0.39 kB  (gzip: 0.27 kB)
├── index-ecb341d4.css  4.59 kB  (gzip: 1.47 kB)
└── index-c5d29e80.js 159.91 kB  (gzip: 51.79 kB)

Total Dist Size: 172 KB (uncompressed)
Total Gzipped: ~53.53 KB
```

**Key Metrics:**
- **JavaScript Bundle:** 159.91 KB (51.79 KB gzipped)
- **CSS Bundle:** 4.59 KB (1.47 KB gzipped)
- **HTML:** 0.39 KB (0.27 KB gzipped)
- **Build Time:** 644ms
- **Total Dist Folder:** 172 KB

**Dependencies Included:**
- React 18.2.0
- React DOM 18.2.0
- Lucide React 0.277.0

---

## Runtime Performance Metrics

### Initial Load Performance

**Estimated Metrics (to be measured):**
- **Time to First Byte (TTFB):** < 100ms (local dev)
- **First Contentful Paint (FCP):** < 500ms
- **Largest Contentful Paint (LCP):** < 1000ms
- **Time to Interactive (TTI):** < 1500ms
- **Total Blocking Time (TBT):** < 200ms
- **Cumulative Layout Shift (CLS):** 0 (no layout shifts expected)

**Initial Render Steps:**
1. Load HTML (0.39 KB)
2. Load CSS (4.59 KB)
3. Load JavaScript (159.91 KB)
4. Parse and execute React
5. Mount DrawingCanvas component
6. Initialize canvas with HiDPI support
7. Attach event listeners
8. First render complete

**Expected Initial Render Time:** < 100ms (after JS loaded)

---

## Canvas Rendering Performance

### Frame Rate (FPS)

**Target:** 60 FPS (16.67ms per frame)

**Scenarios:**

#### 1. Idle State (No Drawing)
- **Expected FPS:** 60 FPS
- **Frame Time:** ~16.67ms
- **Re-renders:** Only on user interaction
- **Notes:** Canvas is static, no continuous rendering

#### 2. Drawing Mode (Mouse Move)
- **Expected FPS:** 60 FPS
- **Frame Time:** ~16.67ms
- **Re-renders:** On every mouse move (throttled by browser)
- **Operations per frame:**
  - Find snap target (iterate through lines)
  - Update snap indicator
  - Render draft line
  - Clear and redraw canvas

#### 3. Panning (Right-Click Drag)
- **Expected FPS:** 60 FPS
- **Frame Time:** ~16.67ms
- **Re-renders:** On every mouse move
- **Operations per frame:**
  - Calculate new offset
  - Apply viewport transform
  - Redraw all lines

#### 4. Zooming (Mouse Wheel)
- **Expected FPS:** 60 FPS
- **Frame Time:** ~16.67ms
- **Re-renders:** On every wheel event
- **Operations per frame:**
  - Calculate new scale and offset
  - Apply viewport transform
  - Redraw all lines

### Rendering Complexity by Line Count

| Line Count | Expected FPS | Frame Time | Notes |
|------------|--------------|------------|-------|
| 0 lines | 60 FPS | ~1ms | Minimal rendering |
| 10 lines | 60 FPS | ~2-3ms | Negligible impact |
| 50 lines | 60 FPS | ~5-8ms | Still well under budget |
| 100 lines | 60 FPS | ~10-12ms | Approaching complexity |
| 500 lines | 55-60 FPS | ~15-18ms | May see slight drops |
| 1000 lines | 45-55 FPS | ~20-25ms | Noticeable performance impact |

**Rendering Operations per Frame:**
- Clear canvas: O(1)
- Draw N lines: O(N)
- Draw selection highlight: O(1)
- Draw snap indicator: O(1)
- Draw draft line: O(1)

**Total Complexity:** O(N) where N = number of lines

---

## Memory Usage

### Baseline Memory (Idle)

**Estimated Metrics:**
- **Initial Heap Size:** ~5-10 MB
- **DOM Nodes:** ~50-100 nodes
- **Event Listeners:** ~5-10 listeners
- **Canvas Memory:** ~1-2 MB (depends on resolution)

### Memory by Line Count

| Line Count | Estimated Heap Size | Notes |
|------------|---------------------|-------|
| 0 lines | ~5-10 MB | Baseline |
| 10 lines | ~5-11 MB | +10 Line objects |
| 100 lines | ~6-12 MB | +100 Line objects |
| 500 lines | ~8-15 MB | +500 Line objects |
| 1000 lines | ~10-20 MB | +1000 Line objects |

**Line Object Size:**
```typescript
type Line = {
  id: string;        // ~36 bytes (UUID)
  a: Pt;            // 16 bytes (2 numbers)
  b: Pt;            // 16 bytes (2 numbers)
  width: number;    // 8 bytes
  color: string;    // ~8 bytes
}
// Total: ~84 bytes per line
```

**Memory Growth:** ~84 bytes per line (plus overhead)

### Memory Leaks Check

**Potential Leak Sources:**
- ✅ Event listeners properly cleaned up in useEffect
- ✅ ResizeObserver disconnected on unmount
- ✅ No circular references in state
- ✅ Canvas context released on unmount

**Expected:** No memory leaks

---

## Re-render Performance

### Re-render Triggers

**State Changes that Trigger Re-renders:**
1. `isDrawActive` change → Full component re-render
2. `lines` change → Full component re-render + canvas redraw
3. `selectedId` change → Full component re-render + canvas redraw
4. `hudPosition` change → HUD re-render only
5. `viewportScale` change → Full component re-render + canvas redraw
6. `viewportOffset` change → Full component re-render + canvas redraw
7. `sidebarCollapsed` change → Full component re-render

**Optimizations in Place:**
- `useCallback` for all event handlers
- `useMemo` for line summary calculation
- Canvas rendering only on relevant state changes
- HUD position calculated only when needed

### Re-render Count for Common Operations

| Operation | Re-renders | Notes |
|-----------|------------|-------|
| Toggle draw mode | 1 | State change only |
| Draw line | 2 | Start point + complete line |
| Select line | 1 | Selection change |
| Edit width | 1 per change | Continuous updates |
| Zoom | 1 per wheel event | Can be rapid |
| Pan | 1 per mouse move | Can be rapid |
| Toggle sidebar | 1 | Layout change |

**Expected:** Minimal unnecessary re-renders

---

## Network Performance

### Development Server
- **Server:** Vite Dev Server
- **Port:** 5173
- **Hot Module Replacement (HMR):** Enabled
- **Response Time:** < 50ms (local)

### Production Build
- **Served via:** Static file server
- **Caching:** Browser cache enabled
- **Compression:** Gzip enabled
- **Expected Load Time:** < 500ms (on fast connection)

---

## Interaction Performance

### Click Response Time
- **Target:** < 100ms
- **Measured:** Time from click to visual feedback
- **Operations:**
  - Event handler execution
  - State update
  - Re-render
  - Canvas redraw

### Keyboard Response Time
- **Target:** < 50ms
- **Measured:** Time from keypress to action
- **Operations:**
  - Event handler execution
  - State update
  - Re-render (if needed)

### Zoom/Pan Smoothness
- **Target:** 60 FPS during interaction
- **Measured:** Frame rate during continuous zoom/pan
- **Critical:** Maintain 60 FPS for smooth UX

---

## Performance Budget

### Bundle Size Budget
- **JavaScript:** < 200 KB (currently 159.91 KB) ✅
- **CSS:** < 10 KB (currently 4.59 KB) ✅
- **Total Gzipped:** < 60 KB (currently ~53.53 KB) ✅

### Runtime Performance Budget
- **Initial Load:** < 2 seconds
- **Time to Interactive:** < 2 seconds
- **FPS (10 lines):** 60 FPS
- **FPS (100 lines):** 60 FPS
- **FPS (500 lines):** > 55 FPS
- **Memory (100 lines):** < 30 MB

### Build Performance Budget
- **Build Time:** < 5 seconds (currently 644ms) ✅
- **Module Count:** < 2000 (currently 1,293) ✅

---

## Performance Testing Methodology

### Manual Testing
1. **FPS Measurement:**
   - Open Chrome DevTools → Performance tab
   - Start recording
   - Perform interaction (draw, zoom, pan)
   - Stop recording
   - Analyze frame rate

2. **Memory Measurement:**
   - Open Chrome DevTools → Memory tab
   - Take heap snapshot (idle)
   - Draw 100 lines
   - Take heap snapshot (100 lines)
   - Compare heap sizes

3. **Load Time Measurement:**
   - Open Chrome DevTools → Network tab
   - Hard reload (Cmd+Shift+R)
   - Measure DOMContentLoaded and Load events

### Automated Testing (Future)
- Lighthouse CI for performance scores
- Custom performance profiling scripts
- Automated FPS monitoring during E2E tests

---

## Performance Optimization Opportunities

### Current Optimizations
✅ HiDPI canvas support (prevents blurry rendering)
✅ useCallback for event handlers (prevents re-creation)
✅ useMemo for expensive calculations (line summary)
✅ Conditional rendering (HUD, sidebar)
✅ CSS transitions (hardware-accelerated)

### Potential Future Optimizations
- [ ] Canvas rendering optimization (dirty rectangles)
- [ ] Virtualization for large line counts (>1000 lines)
- [ ] Web Workers for heavy calculations
- [ ] OffscreenCanvas for background rendering
- [ ] Debouncing/throttling for rapid events
- [ ] Code splitting for lazy loading

---

## Baseline Summary

**Current State (Pre-Refactoring):**
- ✅ Bundle size within budget (159.91 KB JS)
- ✅ Fast build time (644ms)
- ✅ Expected 60 FPS for typical usage
- ✅ Low memory footprint
- ✅ No known memory leaks
- ✅ Responsive interactions

**Refactoring Goals:**
- Maintain or improve all performance metrics
- Keep bundle size within ±10% (< 176 KB JS)
- Keep build time within ±20% (< 773ms)
- Maintain 60 FPS for all interactions
- No performance regressions

---

**End of Performance Baseline Documentation**

**Note:** Actual performance measurements should be taken using Chrome DevTools or automated performance testing tools and recorded here for precise baseline values.


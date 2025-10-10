# HVAC Canvas - Component Design Specifications

**Version:** 1.0  
**Last Updated:** 2025-10-09

---

## Component-by-Component Specifications

This document provides exact specifications for each component in the HVAC Canvas application.

---

## 1. Sidebar Component

### Container
```css
.sidebar {
  width: 320px;                          /* Keep current */
  height: 100vh;
  background: #FFFFFF;
  border-left: 1px solid #E2E8F0;       /* Updated from #e5e5e5 */
  display: flex;
  flex-direction: column;
}
```

### Header Section
```css
.sidebar-header {
  padding: 16px;                         /* Keep current */
  background: #F8FAFC;                   /* NEW: Subtle tint */
  border-bottom: 1px solid #E2E8F0;     /* Updated */
}

.sidebar-title {
  font-family: 'Inter', sans-serif;
  font-size: 20px;                       /* Updated from 18px */
  font-weight: 600;                      /* Keep semibold */
  line-height: 1.25;                     /* NEW: Tight */
  color: #1E293B;                        /* Updated from #262626 */
  margin: 0;
}

.sidebar-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;                       /* Keep current */
  font-weight: 400;
  line-height: 1.5;
  color: #64748B;                        /* Updated from #737373 */
  margin-top: 4px;
}
```

### Table Section
```css
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.sidebar-table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
}

.sidebar-table thead th {
  padding: 8px;
  font-weight: 600;                      /* Updated from 500 */
  color: #475569;                        /* Updated from #737373 */
  text-align: left;
  border-bottom: 1px solid #E2E8F0;
}

.sidebar-table tbody td {
  padding: 8px;
  color: #1E293B;                        /* Updated from #262626 */
  border-bottom: 1px solid #F1F5F9;     /* Updated from #f5f5f5 */
}

.sidebar-table tbody tr:hover {
  background: #F8FAFC;                   /* Updated from #fafafa */
}

/* Numeric columns - NEW */
.sidebar-table .numeric {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.sidebar-table .width-column {
  font-weight: 500;                      /* Medium weight */
}
```

### Empty State
```css
.sidebar-empty {
  padding: 32px 16px;
  text-align: center;
  font-size: 14px;
  color: #64748B;                        /* Updated */
}
```

---

## 2. Bottom Bar Component

### Container
```css
.bottombar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;                          /* Keep current */
  background: #FFFFFF;
  border-top: 1px solid #E2E8F0;        /* Updated */
  box-shadow: 0 -2px 10px rgba(15, 23, 42, 0.08); /* Updated */
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
```

### Zoom Buttons
```css
.zoom-button {
  height: 40px;                          /* NEW: Explicit height */
  padding: 0 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;                      /* Medium */
  color: #475569;                        /* Updated */
  background: #FFFFFF;
  border: 1px solid #CBD5E1;            /* Updated from #d4d4d4 */
  border-radius: 6px;                    /* Updated from 4px */
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: background-color 150ms, border-color 150ms;
}

.zoom-button:hover:not(:disabled) {
  background: #F8FAFC;                   /* Updated */
  border-color: #94A3B8;                /* NEW: Stronger on hover */
}

.zoom-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-button-icon {
  width: 16px;
  height: 16px;
}
```

### Zoom Display
```css
.zoom-display {
  font-family: 'JetBrains Mono', monospace; /* NEW: Monospace */
  font-size: 16px;                       /* Updated from 14px */
  font-weight: 500;                      /* Medium */
  font-variant-numeric: tabular-nums;
  color: #1E293B;                        /* Updated */
  min-width: 64px;                       /* Updated from 60px */
  text-align: center;
}
```

### Help Text
```css
.bottombar-help {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #64748B;                        /* Updated */
  margin-left: 16px;
}
```

---

## 3. Width HUD Component

### Container
```css
.width-hud {
  position: absolute;
  padding: 12px 16px;                    /* Updated from 8px 16px */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #E2E8F0;            /* Updated */
  border-radius: 16px;                   /* Keep current */
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.1),
              0 2px 4px -2px rgba(15, 23, 42, 0.1); /* Updated */
  display: flex;
  align-items: center;
  gap: 12px;
  transition: opacity 200ms, transform 200ms;
}
```

### Label
```css
.hud-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;                      /* Medium */
  color: #475569;                        /* Updated */
}
```

### Slider
```css
.hud-slider {
  accent-color: #2563EB;                /* Primary-600 */
  cursor: pointer;
}
```

### Value Display
```css
.hud-value {
  font-family: 'JetBrains Mono', monospace; /* NEW: Monospace */
  font-size: 16px;                       /* Updated from 14px */
  font-weight: 600;                      /* Semibold */
  font-variant-numeric: tabular-nums;
  color: #1E293B;                        /* Updated */
  min-width: 48px;                       /* Updated from 40px */
  text-align: right;
}
```

---

## 4. Draw Button (FAB) Component

### Button Container
```css
.draw-button {
  position: fixed;
  bottom: 24px;
  width: 56px;                           /* Keep current */
  height: 56px;                          /* Keep current */
  border-radius: 9999px;                 /* Keep current */
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.1),
              0 4px 6px -4px rgba(15, 23, 42, 0.1); /* Updated */
  cursor: pointer;
  transition: background-color 150ms,
              box-shadow 150ms,
              transform 150ms;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draw-button:hover {
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1),
              0 8px 10px -6px rgba(15, 23, 42, 0.1); /* Stronger */
  transform: translateY(-1px);           /* NEW: Subtle lift */
}

.draw-button:active {
  transform: translateY(0);              /* Reset on click */
}
```

### Active State
```css
.draw-button.active {
  background: #2563EB;                   /* Primary-600 */
  border: 2px solid #93C5FD;            /* Updated from #60A5FA */
}

.draw-button.active:hover {
  background: #1D4ED8;                   /* Primary-700 */
}

.draw-button.active .icon {
  color: #FFFFFF;
  transform: scale(1.1);
}
```

### Inactive State
```css
.draw-button.inactive {
  background: #FFFFFF;
  border: 2px solid #CBD5E1;            /* Updated from #e5e5e5 */
}

.draw-button.inactive:hover {
  border-color: #94A3B8;                /* NEW: Visible change */
}

.draw-button.inactive .icon {
  color: #475569;                        /* Updated from #404040 */
}
```

### Icon
```css
.draw-button-icon {
  width: 24px;
  height: 24px;
  transition: transform 150ms, color 150ms;
}
```

---

## 5. Sidebar Toggle Button

### Button
```css
.sidebar-toggle {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 24px;                           /* Keep current */
  background: #E2E8F0;                   /* Updated from #e5e5e5 */
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms;
  z-index: 10;
}

.sidebar-toggle:hover {
  background: #CBD5E1;                   /* Updated from #d4d4d4 */
}

.sidebar-toggle-icon {
  width: 16px;
  height: 16px;
  color: #334155;                        /* Updated from #404040 */
}
```

---

## 6. Canvas Element

### Canvas Container
```css
.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #FFFFFF;                   /* Pure white */
}

.canvas-element {
  position: absolute;
  inset: 0;
  background: #FFFFFF;
  touch-action: none;
}
```

### Cursor States
```css
.canvas-element.draw-mode {
  cursor: crosshair;
}

.canvas-element.pan-mode {
  cursor: grab;
}

.canvas-element.panning {
  cursor: grabbing;
}

.canvas-element.default {
  cursor: default;
}
```

### Drawing Colors (Canvas Context)
```javascript
// Line colors
const LINE_DEFAULT = '#0F172A';        // neutral-900
const LINE_SELECTED = '#2563EB';       // primary-600
const LINE_HOVER = '#60A5FA';          // primary-400

// Snap indicator
const SNAP_INDICATOR = '#3B82F6';      // primary-500
const SNAP_INDICATOR_RADIUS = 8;
const SNAP_INDICATOR_WIDTH = 2;

// Selection highlight
const SELECTION_COLOR = '#2563EB';     // primary-600
const SELECTION_WIDTH = 4;
```

---

## 7. Focus States (Global)

### Focus Visible
```css
:focus-visible {
  outline: 2px solid #2563EB;           /* Primary-600 */
  outline-offset: 2px;
}

/* Button focus */
button:focus-visible {
  box-shadow: 0 0 0 3px #DBEAFE;        /* Primary-100 */
}

/* Input focus */
input:focus,
input[type="range"]:focus {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

---

## 8. Responsive Behavior

### Sidebar Collapse
```css
.sidebar.collapsed {
  width: 0;
  overflow: hidden;
}

.sidebar-toggle.collapsed {
  right: 0;
}

.sidebar-toggle.expanded {
  right: 320px;
}
```

### Canvas Adjustment
```css
.canvas-container {
  width: calc(100% - var(--sidebar-width));
  height: calc(100vh - 60px);           /* Subtract bottom bar */
}
```

---

## 9. Animation & Transitions

### Standard Transitions
```css
/* Fast (100ms) - Micro-interactions */
.icon-transition {
  transition: transform 100ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Base (150ms) - Standard interactions */
.button-transition {
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slow (200ms) - Panels, modals */
.panel-transition {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Accessibility Annotations

### ARIA Labels
```html
<!-- Sidebar -->
<div role="complementary" aria-label="Line summary sidebar">
  <h2 id="sidebar-title">Line Summary</h2>
  <table aria-labelledby="sidebar-title">...</table>
</div>

<!-- Bottom Bar -->
<div role="toolbar" aria-label="Zoom controls">
  <button aria-label="Zoom out">...</button>
  <span aria-live="polite" aria-atomic="true">100%</span>
  <button aria-label="Zoom in">...</button>
</div>

<!-- Width HUD -->
<div role="dialog" aria-label="Line width editor">
  <label for="width-slider">Width</label>
  <input id="width-slider" type="range" aria-label="Selected line width" />
  <span aria-live="polite">24px</span>
</div>

<!-- Draw Button -->
<button 
  aria-label="Toggle draw mode"
  aria-pressed="false"
  title="Toggle Draw (D)">
  ...
</button>

<!-- Canvas -->
<canvas 
  role="img"
  aria-label="Drawing canvas">
</canvas>
```

---

## Summary of Key Changes

### Typography
- ✅ Sidebar title: 18px → 20px
- ✅ HUD value: 14px → 16px + monospace
- ✅ Zoom display: 14px → 16px + monospace
- ✅ Table numbers: Add monospace font

### Colors
- ✅ Neutrals: Basic gray → Slate palette
- ✅ Borders: #e5e5e5 → #E2E8F0
- ✅ Text: Darker, richer colors
- ✅ Hover states: More visible

### Spacing
- ✅ HUD padding: 8px → 12px (vertical)
- ✅ Button height: Explicit 40px
- ✅ Consistent 8px grid

### Polish
- ✅ Shadows: Richer, layered
- ✅ Border radius: 4px → 6px (buttons)
- ✅ Transitions: Consistent timing
- ✅ Hover effects: More noticeable

---

**All measurements are final and ready for implementation.**



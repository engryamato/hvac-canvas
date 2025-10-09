# Bottom Bar - Visual Mockup and Specifications

## Visual Design

### Full Layout
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          CANVAS AREA                                        │
│                     (Drawing, Lines, HUD, FAB)                              │
│                                                                             │
│                     Height: calc(100vh - 60px)                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BOTTOM BAR (60px)                                  │
│                                                                             │
│         ┌────┐    ┌──────────────────────────┐    ┌────┐                  │
│         │ −  │    │ Zoom: 100%  [Reset View] │    │ +  │  Right-click +   │
│         └────┘    └──────────────────────────┘    └────┘  drag to pan      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bottom Bar Detailed View
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Bottom Bar - Fixed at bottom, 60px height, white background, top shadow   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌──────────┐      ┌────────────────────────────────┐      ┌──────────┐ │
│    │          │      │                                │      │          │ │
│    │    −     │      │  Zoom: 100%   [Reset View]    │      │    +     │ │
│    │          │      │                                │      │          │ │
│    └──────────┘      └────────────────────────────────┘      └──────────┘ │
│    48x48 button      Indicator + Reset Button Group         48x48 button  │
│    Border: 2px       Background: neutral-50                  Border: 2px  │
│    Rounded: lg       Border: 1px neutral-300                 Rounded: lg  │
│                      Rounded: lg                                          │
│                                                                             │
│                                                    ┌──────────────────────┐│
│                                                    │ Right-click + drag   ││
│                                                    │ to pan               ││
│                                                    └──────────────────────┘│
│                                                    Optional instruction    │
│                                                    text (xs, neutral-500)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Zoom Out Button
```
┌──────────┐
│          │
│    −     │  ← Text: 2xl, bold, neutral-700
│          │
└──────────┘
   48x48px
```

**Specifications**:
- Size: 48px × 48px
- Border: 2px solid neutral-300
- Border Radius: lg (8px)
- Background: white
- Hover: bg-neutral-50
- Disabled: opacity-40, cursor-not-allowed
- Focus: ring-2 ring-tech-blue-600
- Text: "−" (minus sign), 2xl, bold, neutral-700

**States**:
- Normal: White background, neutral-300 border
- Hover: neutral-50 background
- Disabled: When viewportScale <= MIN_ZOOM (0.1)
- Focus: Blue ring

### 2. Zoom Indicator + Reset Button Group
```
┌────────────────────────────────┐
│                                │
│  Zoom: 100%   [Reset View]    │
│                                │
└────────────────────────────────┘
```

**Outer Container**:
- Background: neutral-50
- Border: 1px solid neutral-300
- Border Radius: lg (8px)
- Padding: 16px horizontal, 8px vertical
- Display: flex, items-center, gap-3

**Zoom Indicator**:
- Text: "Zoom: {percentage}%"
- Font: sm, medium, neutral-700
- Min Width: 70px
- Text Align: center
- Font Feature: tabular-nums (monospace numbers)

**Reset Button**:
- Text: "Reset View"
- Font: sm, medium, white
- Background: tech-blue-600
- Hover: tech-blue-700
- Padding: 12px horizontal, 6px vertical
- Border Radius: 4px
- Focus: ring-2 ring-tech-blue-300

### 3. Zoom In Button
```
┌──────────┐
│          │
│    +     │  ← Text: 2xl, bold, neutral-700
│          │
└──────────┘
   48x48px
```

**Specifications**:
- Size: 48px × 48px
- Border: 2px solid neutral-300
- Border Radius: lg (8px)
- Background: white
- Hover: bg-neutral-50
- Disabled: opacity-40, cursor-not-allowed
- Focus: ring-2 ring-tech-blue-600
- Text: "+" (plus sign), 2xl, bold, neutral-700

**States**:
- Normal: White background, neutral-300 border
- Hover: neutral-50 background
- Disabled: When viewportScale >= MAX_ZOOM (10.0)
- Focus: Blue ring

### 4. Pan Instruction (Optional)
```
┌──────────────────────┐
│ Right-click + drag   │
│ to pan               │
└──────────────────────┘
```

**Specifications**:
- Text: "Right-click + drag to pan"
- Font: xs, neutral-500
- Margin Left: 32px (ml-8)
- Optional: Can be removed if space is tight

---

## Spacing and Layout

### Flexbox Layout
```css
display: flex;
align-items: center;
justify-content: center;
gap: 16px; /* 1rem / 4 in Tailwind */
```

### Element Spacing
```
[Zoom Out] ←16px→ [Indicator Group] ←16px→ [Zoom In] ←32px→ [Instruction]
```

### Vertical Centering
All elements are vertically centered within the 60px height bar using `items-center`.

---

## Color Palette

### Backgrounds
- **Bottom Bar**: `bg-white`
- **Indicator Group**: `bg-neutral-50`
- **Buttons**: `bg-white`
- **Reset Button**: `bg-[var(--tech-blue-600)]`

### Borders
- **Bottom Bar Top**: `border-t border-neutral-200`
- **Buttons**: `border-2 border-neutral-300`
- **Indicator Group**: `border border-neutral-300`

### Text
- **Button Symbols**: `text-neutral-700`
- **Zoom Indicator**: `text-neutral-700`
- **Reset Button**: `text-white`
- **Instruction**: `text-neutral-500`

### Shadows
- **Bottom Bar**: `shadow-[0_-2px_10px_rgba(0,0,0,0.1)]` (upward shadow)

---

## Responsive Behavior

### Desktop (> 1024px)
- Full layout with all elements
- Instruction text visible

### Tablet (768px - 1024px)
- Full layout
- Instruction text may be hidden if space is tight

### Small Screens (< 768px)
- Not primary target (app is for computers/laptops/tablets)
- May need to adjust spacing or hide instruction text

---

## Accessibility

### ARIA Labels
```typescript
// Zoom Out Button
aria-label="Zoom out"
title="Zoom out (or press -)"

// Zoom In Button
aria-label="Zoom in"
title="Zoom in (or press +)"

// Reset Button
aria-label="Reset view to 100%"
title="Reset view (Ctrl+0)"
```

### Keyboard Navigation
- All buttons are focusable with Tab
- Focus ring visible (ring-2)
- Keyboard shortcuts work globally (+, -, Ctrl+0)

### Disabled States
- Disabled buttons have `disabled` attribute
- Visual feedback with opacity-40
- Cursor changes to not-allowed

---

## Implementation Code

### Complete Bottom Bar Component
```typescript
{/* Bottom Bar - View Controls */}
<div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center gap-4">
  {/* Zoom Out Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.max(MIN_ZOOM, viewportScale / ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    disabled={viewportScale <= MIN_ZOOM}
    className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tech-blue-600)]"
    aria-label="Zoom out"
    title="Zoom out (or press -)"
  >
    <span className="text-2xl font-bold text-neutral-700">−</span>
  </button>

  {/* Zoom Indicator and Reset Button */}
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-neutral-300 bg-neutral-50">
    <span className="text-sm font-medium text-neutral-700 min-w-[70px] text-center tabular-nums">
      Zoom: {Math.round(viewportScale * 100)}%
    </span>
    <button
      type="button"
      onClick={() => {
        setViewportScale(1.0);
        setViewportOffset({ x: 0, y: 0 });
      }}
      className="px-3 py-1.5 text-sm font-medium text-white bg-[var(--tech-blue-600)] hover:bg-[var(--tech-blue-700)] rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tech-blue-300)]"
      aria-label="Reset view to 100%"
      title="Reset view (Ctrl+0)"
    >
      Reset View
    </button>
  </div>

  {/* Zoom In Button */}
  <button
    type="button"
    onClick={() => {
      const newScale = Math.min(MAX_ZOOM, viewportScale * ZOOM_FACTOR);
      setViewportScale(newScale);
    }}
    disabled={viewportScale >= MAX_ZOOM}
    className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tech-blue-600)]"
    aria-label="Zoom in"
    title="Zoom in (or press +)"
  >
    <span className="text-2xl font-bold text-neutral-700">+</span>
  </button>

  {/* Pan Instruction (Optional) */}
  <div className="ml-8 text-xs text-neutral-500">
    Right-click + drag to pan
  </div>
</div>
```

---

## Z-Index Hierarchy

```
Layer 10: Bottom Bar (z-10)
Layer 5:  Sidebar (default)
Layer 1:  Canvas (default)
Layer 0:  Background
```

The bottom bar has `z-10` to ensure it stays above the canvas and sidebar but below any modals or tooltips.

---

## Animation and Transitions

### Button Hover
```css
transition-colors /* Smooth background color change */
```

### Reset Button Hover
```css
transition-colors /* Smooth background color change */
```

### Zoom Indicator Update
- No animation (instant update)
- Uses `tabular-nums` for stable width

---

**End of Bottom Bar Mockup**


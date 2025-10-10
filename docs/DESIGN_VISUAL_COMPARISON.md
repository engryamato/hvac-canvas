# HVAC Canvas - Visual Design Comparison

**Date:** 2025-10-09  
**Version:** 1.0  
**Related:** [DESIGN_STUDY.md](./DESIGN_STUDY.md)

---

## Overview

This document provides a visual comparison between the current design and recommended design improvements.

---

## 1. Color Palette Comparison

### Current Palette

```
Primary Blue:
  300: #60A5FA
  500: #3B82F6
  600: #2563EB ← Main primary
  700: #1D4ED8

Neutrals (Basic Gray):
  50:  #fafafa
  100: #f5f5f5
  200: #e5e5e5
  300: #d4d4d4
  500: #737373
  700: #404040
  800: #262626
  900: #171717

States:
  Error:   #dc2626
  Success: (not defined)
  Warning: (not defined)
```

### Recommended Palette

```
Primary Blue (Same base, expanded):
  50:  #EFF6FF ← NEW: Light backgrounds
  100: #DBEAFE ← NEW: Hover states
  200: #BFDBFE ← NEW: Disabled states
  300: #93C5FD
  400: #60A5FA
  500: #3B82F6
  600: #2563EB ← Main primary
  700: #1D4ED8
  800: #1E40AF ← NEW: Active states
  900: #1E3A8A ← NEW: Dark text

Neutrals (Cool Gray - Slate):
  50:  #F8FAFC ← More modern, cooler tone
  100: #F1F5F9
  200: #E2E8F0
  300: #CBD5E1
  400: #94A3B8 ← NEW: Placeholder text
  500: #64748B
  600: #475569 ← Better for body text
  700: #334155
  800: #1E293B
  900: #0F172A ← Richer black

States (Complete system):
  Success: #22C55E (Green-500)
  Warning: #F59E0B (Amber-500)
  Error:   #EF4444 (Red-500)
  Info:    #06B6D4 (Cyan-500)
```

**Key Improvements:**
- ✅ Expanded primary palette for more nuanced states
- ✅ Cooler, more modern neutral grays
- ✅ Complete state color system
- ✅ Better contrast ratios across the board

---

## 2. Typography Comparison

### Current Typography

```
Font Family:
  Primary: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial
  Data:    (same as primary)

Font Sizes:
  xs:  0.75rem  (12px) ✓
  sm:  0.875rem (14px) ✓
  lg:  1.125rem (18px)
  2xl: 1.5rem   (24px)

Weights:
  medium:   500 ✓
  semibold: 600 ✓
  bold:     700 ✓

Usage:
  Sidebar title:  18px (text-lg)
  Table text:     14px (text-sm)
  Button text:    14px (text-sm)
  HUD value:      14px (text-sm)
  Zoom display:   14px (text-sm)
```

### Recommended Typography

```
Font Family:
  Primary: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial
  Mono:    'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', Consolas ← NEW
  
Font Sizes (Modular Scale 1.250):
  xs:  0.75rem   (12px) ✓
  sm:  0.875rem  (14px) ✓
  base: 1rem     (16px) ← NEW
  md:  1.125rem  (18px) ← NEW
  lg:  1.25rem   (20px) ← Increased
  xl:  1.5rem    (24px) ← NEW
  2xl: 1.875rem  (30px) ← NEW
  3xl: 2.25rem   (36px) ← NEW

Weights:
  normal:   400 ← NEW
  medium:   500 ✓
  semibold: 600 ✓
  bold:     700 ✓

Line Heights:
  tight:   1.25  ← NEW (headings)
  normal:  1.5   ← NEW (body)
  relaxed: 1.75  ← NEW (long-form)

Usage:
  Sidebar title:  20px (text-lg) ← Increased from 18px
  Table text:     14px (text-sm) ✓
  Table numbers:  14px + mono ← NEW: Monospace
  Button text:    14px (text-sm) ✓
  HUD value:      16px + mono ← Increased + monospace
  Zoom display:   16px + mono ← Increased + monospace
```

**Key Improvements:**
- ✅ Dedicated monospace font for technical data
- ✅ Complete modular scale for consistency
- ✅ Defined line heights for better readability
- ✅ Larger sizes for better hierarchy
- ✅ Tabular numbers for perfect alignment

---

## 3. Component Comparison

### Sidebar

**Current:**
```
Header:
  - Background: white
  - Border: 1px solid #e5e5e5
  - Title: 18px, semibold, #262626
  - Subtitle: 12px, #737373

Table:
  - Header: 14px, medium, #737373
  - Cell: 14px, #262626
  - Hover: (minimal)
  - Numbers: Regular font
```

**Recommended:**
```
Header:
  - Background: #F8FAFC (subtle tint)
  - Border: 1px solid #E2E8F0
  - Title: 20px, semibold, #1E293B ← Larger, darker
  - Subtitle: 12px, #64748B

Table:
  - Header: 14px, semibold, #475569 ← Bolder
  - Cell: 14px, #1E293B ← Darker
  - Hover: #F8FAFC background ← More visible
  - Numbers: JetBrains Mono ← Monospace for alignment
```

**Visual Impact:**
- Better visual hierarchy with larger title
- Improved readability with darker text
- Perfect number alignment with monospace
- More noticeable hover states

---

### Bottom Bar

**Current:**
```
Container:
  - Height: 60px ✓
  - Background: white
  - Border: 1px solid #e5e5e5
  - Shadow: 0 -2px 10px rgba(0,0,0,0.1)

Buttons:
  - Height: auto (padding-based)
  - Border: 1px solid #d4d4d4
  - Text: 14px, #262626

Zoom Display:
  - Font: 14px, regular
  - Color: #404040
```

**Recommended:**
```
Container:
  - Height: 60px ✓
  - Background: white
  - Border: 1px solid #E2E8F0 ← Softer
  - Shadow: 0 -2px 10px rgba(15,23,42,0.08) ← Subtler

Buttons:
  - Height: 40px (explicit) ← Consistent
  - Border: 1px solid #CBD5E1 ← Stronger
  - Text: 14px, medium, #475569 ← Bolder

Zoom Display:
  - Font: 16px, medium, JetBrains Mono ← Larger + monospace
  - Color: #1E293B ← Darker
```

**Visual Impact:**
- More consistent button sizing
- Better readability for zoom percentage
- Cleaner, more modern appearance
- Improved visual weight

---

### Width HUD

**Current:**
```
Container:
  - Background: rgba(255,255,255,0.95)
  - Border: 1px solid #e5e5e5
  - Radius: 16px (2xl) ✓
  - Shadow: 0 4px 6px rgba(0,0,0,0.1)
  - Padding: 8px 16px

Label:
  - Font: 14px, #404040

Value:
  - Font: 14px, #262626
  - Width: 40px (2.5rem)
```

**Recommended:**
```
Container:
  - Background: rgba(255,255,255,0.95) ✓
  - Border: 1px solid #E2E8F0 ← Softer
  - Radius: 16px (2xl) ✓
  - Shadow: 0 4px 6px rgba(15,23,42,0.1) ← Richer
  - Padding: 12px 16px ← More vertical space

Label:
  - Font: 14px, medium, #475569 ← Bolder

Value:
  - Font: 16px, semibold, JetBrains Mono ← Larger + monospace
  - Color: #1E293B ← Darker
  - Width: 48px (3rem) ← Wider for larger text
```

**Visual Impact:**
- More prominent value display
- Better readability with monospace
- Improved visual hierarchy
- More professional appearance

---

### Draw Button (FAB)

**Current:**
```
Size: 56px × 56px ✓
Radius: 9999px (full) ✓
Shadow: 0 10px 15px rgba(0,0,0,0.1)

Active State:
  - Background: #2563EB (--tech-blue-600)
  - Border: 2px solid #60A5FA (--tech-blue-300)
  - Icon: white, scale(1.1)

Inactive State:
  - Background: white
  - Border: 2px solid #e5e5e5
  - Icon: #404040
```

**Recommended:**
```
Size: 56px × 56px ✓
Radius: 9999px (full) ✓
Shadow: 0 10px 15px rgba(15,23,42,0.1) ← Richer
Hover: 0 20px 25px rgba(15,23,42,0.1) ← Stronger

Active State:
  - Background: #2563EB ✓
  - Border: 2px solid #93C5FD ← Softer glow
  - Icon: white, scale(1.1) ✓
  - Hover: #1D4ED8 ← Darker on hover

Inactive State:
  - Background: white ✓
  - Border: 2px solid #CBD5E1 ← Stronger
  - Icon: #475569 ← Darker
  - Hover: border #94A3B8 ← Visible change
```

**Visual Impact:**
- Stronger visual presence
- Better hover feedback
- More professional appearance
- Improved state distinction

---

## 4. Spacing & Layout Comparison

### Current Spacing

```
Ad-hoc values:
  - 0.25rem (4px)
  - 0.5rem  (8px)
  - 0.75rem (12px)
  - 1rem   (16px)
  - 1.5rem (24px)
  - 2rem   (32px)

Issues:
  - Inconsistent usage
  - Some hardcoded pixel values
  - No clear system
```

### Recommended Spacing (8px Grid)

```
Token-based system:
  --space-1:  4px   (0.25rem)
  --space-2:  8px   (0.5rem)
  --space-3:  12px  (0.75rem)
  --space-4:  16px  (1rem)
  --space-5:  20px  (1.25rem) ← NEW
  --space-6:  24px  (1.5rem)
  --space-8:  32px  (2rem)
  --space-10: 40px  (2.5rem) ← NEW
  --space-12: 48px  (3rem)
  --space-16: 64px  (4rem)

Benefits:
  ✅ Consistent 8px grid
  ✅ Predictable spacing
  ✅ Easy to maintain
  ✅ Better visual rhythm
```

---

## 5. Shadow & Elevation Comparison

### Current Shadows

```
.shadow-md:  0 4px 6px rgba(0,0,0,0.1)
.shadow-lg:  0 10px 15px rgba(0,0,0,0.1)
.shadow-[custom]: 0 -2px 10px rgba(0,0,0,0.1)

Issues:
  - Limited elevation system
  - Inconsistent shadow colors
  - No hover states
```

### Recommended Shadows

```
--shadow-xs:  0 1px 2px rgba(15,23,42,0.05)
--shadow-sm:  0 1px 3px rgba(15,23,42,0.1), 0 1px 2px rgba(15,23,42,0.1)
--shadow-md:  0 4px 6px rgba(15,23,42,0.1), 0 2px 4px rgba(15,23,42,0.1)
--shadow-lg:  0 10px 15px rgba(15,23,42,0.1), 0 4px 6px rgba(15,23,42,0.1)
--shadow-xl:  0 20px 25px rgba(15,23,42,0.1), 0 8px 10px rgba(15,23,42,0.1)
--shadow-2xl: 0 25px 50px rgba(15,23,42,0.25)

Component mapping:
  Button:     sm → md (on hover)
  FAB:        lg → xl (on hover)
  HUD:        md
  Panel:      sm
  Modal:      2xl
  Bottom bar: Custom (upward)

Benefits:
  ✅ Complete elevation system
  ✅ Consistent shadow colors
  ✅ Layered shadows for depth
  ✅ Hover state progression
```

---

## 6. Accessibility Improvements

### Contrast Ratios

**Current:**
```
Text on White:
  neutral-900 (#171717): 15.3:1 ✅ AAA
  neutral-700 (#404040): 8.6:1  ✅ AAA
  neutral-500 (#737373): 4.7:1  ✅ AA
  
Primary on White:
  blue-600 (#2563EB):    4.6:1  ✅ AA

Issues:
  - Some combinations not tested
  - No disabled state guidance
```

**Recommended:**
```
Text on White:
  neutral-900 (#0F172A): 16.1:1 ✅ AAA
  neutral-700 (#334155): 10.4:1 ✅ AAA
  neutral-600 (#475569): 7.5:1  ✅ AAA
  neutral-500 (#64748B): 4.9:1  ✅ AA
  neutral-400 (#94A3B8): 3.2:1  ⚠️ Large text only
  
Primary on White:
  blue-600 (#2563EB):    4.6:1  ✅ AA
  
White on Primary:
  white on blue-600:     4.6:1  ✅ AA
  
State Colors:
  error-600:   4.7:1  ✅ AA
  success-600: 4.1:1  ✅ AA (Large text)
  warning-600: 3.9:1  ✅ AA (Large text)

Benefits:
  ✅ All combinations tested
  ✅ Clear guidance for each shade
  ✅ Disabled states defined
  ✅ WCAG 2.1 AA compliant
```

---

## Summary of Visual Changes

### What Stays the Same ✓
- Overall layout and structure
- Component positioning
- Interaction patterns
- Canvas functionality
- Sidebar width (320px)
- Bottom bar height (60px)
- FAB size (56px)

### What Changes ✨
- **Colors:** Richer, more modern palette with better contrast
- **Typography:** Larger sizes, monospace for data, better hierarchy
- **Spacing:** Consistent 8px grid system
- **Shadows:** Complete elevation system with hover states
- **Details:** Stronger borders, better hover states, improved feedback

### Overall Impact 🎯
- **More Professional:** Modern, technical aesthetic
- **Better Readability:** Larger text, better contrast, monospace data
- **Improved Hierarchy:** Clear visual structure
- **Enhanced Feedback:** Better hover/active states
- **Accessibility:** WCAG AA compliant throughout

---

**Next Steps:** See [DESIGN_IMPLEMENTATION_GUIDE.md](./DESIGN_IMPLEMENTATION_GUIDE.md) for implementation instructions.



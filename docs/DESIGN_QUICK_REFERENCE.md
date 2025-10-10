# HVAC Canvas - Design System Quick Reference

**Version:** 1.0  
**Last Updated:** 2025-10-09

---

## 🎨 Color Tokens

### Primary (Technical Blue)
```css
--color-primary-300: #93C5FD;  /* Light accent */
--color-primary-500: #3B82F6;  /* Base */
--color-primary-600: #2563EB;  /* Main primary ⭐ */
--color-primary-700: #1D4ED8;  /* Hover */
--color-primary-800: #1E40AF;  /* Active */
```

### Neutral (Slate)
```css
--color-neutral-50:  #F8FAFC;  /* Surface */
--color-neutral-200: #E2E8F0;  /* Border */
--color-neutral-500: #64748B;  /* Tertiary text */
--color-neutral-600: #475569;  /* Secondary text */
--color-neutral-900: #0F172A;  /* Primary text ⭐ */
```

### States
```css
--color-success: #22C55E;  /* Green */
--color-warning: #F59E0B;  /* Amber */
--color-error:   #EF4444;  /* Red */
--color-info:    #06B6D4;  /* Cyan */
```

---

## 📝 Typography Tokens

### Font Families
```css
--font-family-primary: 'Inter', system-ui, sans-serif;
--font-family-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

### Font Sizes
```css
--font-size-xs:   0.75rem;   /* 12px */
--font-size-sm:   0.875rem;  /* 14px ⭐ */
--font-size-base: 1rem;      /* 16px ⭐ */
--font-size-lg:   1.25rem;   /* 20px */
--font-size-xl:   1.5rem;    /* 24px */
--font-size-2xl:  1.875rem;  /* 30px */
--font-size-3xl:  2.25rem;   /* 36px */
```

### Font Weights
```css
--font-weight-normal:   400;
--font-weight-medium:   500;  /* ⭐ UI elements */
--font-weight-semibold: 600;  /* ⭐ Headings */
--font-weight-bold:     700;
```

### Line Heights
```css
--line-height-tight:   1.25;  /* Headings */
--line-height-normal:  1.5;   /* Body ⭐ */
--line-height-relaxed: 1.75;  /* Long-form */
```

---

## 📏 Spacing Tokens (8px Grid)

```css
--space-1:  0.25rem;  /*  4px */
--space-2:  0.5rem;   /*  8px ⭐ */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px ⭐ */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-12: 3rem;     /* 48px */
```

---

## 🔲 Border Radius

```css
--radius-sm:   0.25rem;  /*  4px */
--radius-md:   0.375rem; /*  6px ⭐ Buttons */
--radius-lg:   0.5rem;   /*  8px - Panels */
--radius-2xl:  1rem;     /* 16px - HUD */
--radius-full: 9999px;   /* Circle - FAB */
```

---

## 🌑 Shadows

```css
--shadow-sm:  0 1px 3px rgba(15,23,42,0.1);
--shadow-md:  0 4px 6px rgba(15,23,42,0.1);   /* ⭐ HUD */
--shadow-lg:  0 10px 15px rgba(15,23,42,0.1); /* ⭐ FAB */
--shadow-xl:  0 20px 25px rgba(15,23,42,0.1); /* FAB hover */
```

---

## ⚡ Transitions

```css
--transition-fast: 100ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 150ms cubic-bezier(0.4, 0, 0.2, 1); /* ⭐ */
--transition-slow: 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🎯 Component Sizes

```css
/* Buttons */
--height-button-md: 2.5rem;  /* 40px ⭐ */

/* Icons */
--size-icon-sm: 1.25rem;  /* 20px */
--size-icon-md: 1.5rem;   /* 24px ⭐ */

/* Layout */
--size-fab:      3.5rem;   /* 56px */
--size-sidebar:  20rem;    /* 320px */
--height-bottombar: 3.75rem; /* 60px */
```

---

## 📱 Component Styles

### Sidebar
```css
.sidebar-title {
  font-size: var(--font-size-lg);      /* 20px */
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-800);
}

.sidebar-table-cell {
  font-size: var(--font-size-sm);      /* 14px */
  color: var(--color-neutral-900);
}

.sidebar-table-number {
  font-family: var(--font-family-mono);
  font-variant-numeric: tabular-nums;
}
```

### Bottom Bar
```css
.bottombar-button {
  height: var(--height-button-md);     /* 40px */
  font-size: var(--font-size-sm);      /* 14px */
  font-weight: var(--font-weight-medium);
}

.zoom-display {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-base);    /* 16px */
  font-weight: var(--font-weight-medium);
}
```

### Width HUD
```css
.hud-container {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-2xl);    /* 16px */
  box-shadow: var(--shadow-md);
}

.hud-value {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-base);    /* 16px */
  font-weight: var(--font-weight-semibold);
}
```

### Draw Button (FAB)
```css
.draw-button {
  width: var(--size-fab);              /* 56px */
  height: var(--size-fab);             /* 56px */
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
}

.draw-button:hover {
  box-shadow: var(--shadow-xl);
}

.draw-button.active {
  background: var(--color-primary-600);
  border: 2px solid var(--color-primary-300);
}
```

---

## 🎨 Semantic Color Usage

### Text
```css
--text-primary:   var(--color-neutral-900);  /* Main text */
--text-secondary: var(--color-neutral-600);  /* Labels */
--text-tertiary:  var(--color-neutral-500);  /* Helper text */
--text-disabled:  var(--color-neutral-400);  /* Disabled */
```

### Backgrounds
```css
--bg-primary:   #FFFFFF;                     /* Main */
--bg-secondary: var(--color-neutral-50);     /* Panels */
--bg-tertiary:  var(--color-neutral-100);    /* Nested */
```

### Borders
```css
--border-default: var(--color-neutral-200);  /* Standard */
--border-strong:  var(--color-neutral-300);  /* Emphasis */
```

### Buttons
```css
/* Primary Button */
--btn-primary-bg:       var(--color-primary-600);
--btn-primary-bg-hover: var(--color-primary-700);
--btn-primary-text:     #FFFFFF;

/* Secondary Button */
--btn-secondary-bg:     #FFFFFF;
--btn-secondary-border: var(--color-neutral-300);
--btn-secondary-text:   var(--color-neutral-700);
```

---

## ✅ Accessibility Guidelines

### Contrast Ratios (WCAG AA)
```
Normal Text (< 18px):  ≥ 4.5:1
Large Text (≥ 18px):   ≥ 3.0:1
UI Components:         ≥ 3.0:1
```

### Approved Combinations
```css
/* Text on White Background */
✅ neutral-900 on white: 16.1:1 (AAA)
✅ neutral-600 on white: 7.5:1  (AAA)
✅ neutral-500 on white: 4.9:1  (AA)
✅ primary-600 on white: 4.6:1  (AA)

/* White on Color Background */
✅ white on primary-600: 4.6:1  (AA)
✅ white on error-600:   4.7:1  (AA)
```

### Focus Indicators
```css
:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}
```

---

## 🔧 Common Patterns

### Card/Panel
```css
.panel {
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
}
```

### Button
```css
.button {
  height: var(--height-button-md);
  padding: 0 var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}
```

### Input
```css
.input {
  height: var(--height-button-md);
  padding: 0 var(--space-3);
  font-size: var(--font-size-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}

.input:focus {
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}
```

### Heading
```css
.heading-1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--text-primary);
}
```

---

## 📊 Typography Scale Reference

```
H1:  36px / Bold   / Tight   (1.25)
H2:  30px / Bold   / Tight   (1.25)
H3:  24px / Semibold / Tight (1.25)
H4:  20px / Semibold / Tight (1.25)
H5:  18px / Semibold / Normal (1.5)
H6:  16px / Semibold / Normal (1.5)

Body Large:  18px / Normal / Normal (1.5)
Body:        16px / Normal / Normal (1.5) ⭐
Body Small:  14px / Normal / Normal (1.5) ⭐
Caption:     12px / Normal / Normal (1.5)
```

---

## 🎯 When to Use What

### Font Family
- **Inter:** All UI text, labels, buttons, headings
- **JetBrains Mono:** Measurements, coordinates, zoom %, table numbers

### Font Weight
- **Normal (400):** Body text, descriptions
- **Medium (500):** Buttons, labels, emphasized text
- **Semibold (600):** Headings, table headers
- **Bold (700):** Page titles, major headings

### Spacing
- **4px (space-1):** Icon gaps, tight spacing
- **8px (space-2):** Button padding (vertical)
- **12px (space-3):** Input padding, medium gaps
- **16px (space-4):** Panel padding, standard gaps ⭐
- **24px (space-6):** Section spacing
- **32px (space-8):** Major section spacing

### Shadows
- **sm:** Subtle elevation (panels)
- **md:** Standard elevation (HUD, dropdowns) ⭐
- **lg:** High elevation (FAB, modals) ⭐
- **xl:** Hover states on high elevation

---

## 🚀 Quick Implementation Checklist

### Typography
- [ ] Add JetBrains Mono font to `index.html`
- [ ] Update base font size to 16px
- [ ] Apply monospace to numeric displays
- [ ] Increase sidebar title to 20px
- [ ] Increase HUD value to 16px

### Colors
- [ ] Replace basic grays with Slate palette
- [ ] Update primary blue shades
- [ ] Add state colors (success, warning, error)
- [ ] Verify all contrast ratios

### Spacing
- [ ] Implement 8px grid system
- [ ] Replace hardcoded values with tokens
- [ ] Standardize button heights to 40px
- [ ] Consistent padding across components

### Polish
- [ ] Add shadow system
- [ ] Update border radius
- [ ] Implement transitions
- [ ] Add hover states

---

**⭐ = Most commonly used values**



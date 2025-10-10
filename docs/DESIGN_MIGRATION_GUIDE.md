# Design System Migration Guide

## Overview

This guide helps developers migrate from the old design system to the new token-based design system implemented in v2.0.0.

---

## Quick Start

### 1. Import Design Tokens

```typescript
// Old way (deprecated)
import { TECH_BLUE_TOKENS } from './constants';

// New way
import { DESIGN_TOKENS, SEMANTIC_COLORS } from './constants';
```

### 2. Use CSS Custom Properties

```css
/* Old way */
.my-button {
  background: #2563EB;
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
}

/* New way */
.my-button {
  background: var(--color-primary-600);
  color: var(--text-on-primary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
}
```

---

## Color Migration

### Neutral Colors

| Old Value | Old Name | New Value | New Name | Usage |
|-----------|----------|-----------|----------|-------|
| #FAFAFA | neutral-50 | #F8FAFC | neutral-50 | Backgrounds |
| #F5F5F5 | neutral-100 | #F1F5F9 | neutral-100 | Subtle backgrounds |
| #E5E5E5 | neutral-200 | #E2E8F0 | neutral-200 | Borders |
| #D4D4D4 | neutral-300 | #CBD5E1 | neutral-300 | Borders (hover) |
| #737373 | neutral-500 | #64748B | neutral-500 | Secondary text |
| #404040 | neutral-700 | #334155 | neutral-700 | Body text |
| #262626 | neutral-800 | #1E293B | neutral-800 | Headings |
| #171717 | neutral-900 | #0F172A | neutral-900 | Primary text |

### Primary Colors (Blue)

| Shade | Value | Usage |
|-------|-------|-------|
| 50 | #EFF6FF | Lightest background |
| 100 | #DBEAFE | Light background |
| 200 | #BFDBFE | Subtle accent |
| 300 | #93C5FD | Active state borders |
| 400 | #60A5FA | Hover states |
| 500 | #3B82F6 | Interactive elements |
| 600 | #2563EB | Primary actions |
| 700 | #1D4ED8 | Primary hover |
| 800 | #1E40AF | Pressed states |
| 900 | #1E3A8A | Darkest |

### State Colors

```typescript
// Success (Green)
DESIGN_TOKENS.colors.success[600] // #22C55E

// Warning (Amber)
DESIGN_TOKENS.colors.warning[600] // #F59E0B

// Error (Red)
DESIGN_TOKENS.colors.error[600] // #EF4444

// Info (Sky)
DESIGN_TOKENS.colors.info[600] // #0EA5E9
```

---

## Typography Migration

### Font Families

```typescript
// Primary font (UI text)
font-family: var(--font-family-primary);
// Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...

// Monospace font (technical data)
font-family: var(--font-family-mono);
// "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", ...
```

### Font Sizes

| Old | New Token | Value | Usage |
|-----|-----------|-------|-------|
| 12px | --font-size-xs | 0.75rem | Small labels |
| 14px | --font-size-sm | 0.875rem | Body text (small) |
| 16px | --font-size-base | 1rem | Body text |
| 18px | --font-size-md | 1.125rem | Subheadings |
| 20px | --font-size-lg | 1.25rem | Headings |
| 24px | --font-size-xl | 1.5rem | Large headings |
| 30px | --font-size-2xl | 1.875rem | Page titles |
| 36px | --font-size-3xl | 2.25rem | Hero text |

### Font Weights

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Utility Classes

```html
<!-- Font family -->
<span class="text-mono">123.45</span>

<!-- Tabular numbers -->
<span class="text-tabular">100%</span>

<!-- Font sizes -->
<p class="text-sm">Small text</p>
<p class="text-base">Normal text</p>
<p class="text-lg">Large text</p>

<!-- Font weights -->
<span class="font-medium">Medium weight</span>
<span class="font-semibold">Semibold weight</span>
```

---

## Spacing Migration

### 8px Grid System

| Old | New Token | Value | Usage |
|-----|-----------|-------|-------|
| 4px | --space-1 | 0.25rem | Tiny gaps |
| 8px | --space-2 | 0.5rem | Small gaps |
| 12px | --space-3 | 0.75rem | Medium gaps |
| 16px | --space-4 | 1rem | Standard gaps |
| 20px | --space-5 | 1.25rem | Large gaps |
| 24px | --space-6 | 1.5rem | Extra large gaps |
| 32px | --space-8 | 2rem | Section spacing |
| 48px | --space-12 | 3rem | Major sections |

### Example Migration

```css
/* Old */
.component {
  padding: 12px 16px;
  margin-bottom: 24px;
  gap: 8px;
}

/* New */
.component {
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-6);
  gap: var(--space-2);
}
```

---

## Shadow Migration

### Shadow Tokens

```css
/* Extra small - Subtle elevation */
box-shadow: var(--shadow-xs);

/* Small - Cards, dropdowns */
box-shadow: var(--shadow-sm);

/* Medium - Modals, popovers */
box-shadow: var(--shadow-md);

/* Large - Floating elements */
box-shadow: var(--shadow-lg);

/* Extra large - Major overlays */
box-shadow: var(--shadow-xl);

/* 2X large - Maximum elevation */
box-shadow: var(--shadow-2xl);
```

### Example Migration

```css
/* Old */
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* New */
.card {
  box-shadow: var(--shadow-md);
}
```

---

## Border Radius Migration

### Radius Tokens

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Fully rounded */
```

### Example Migration

```css
/* Old */
.button {
  border-radius: 8px;
}

.avatar {
  border-radius: 9999px;
}

/* New */
.button {
  border-radius: var(--radius-lg);
}

.avatar {
  border-radius: var(--radius-full);
}
```

---

## Transition Migration

### Transition Tokens

```css
--transition-fast: 100ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slower: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Example Migration

```css
/* Old */
.button {
  transition: background-color 0.15s, color 0.15s;
}

/* New */
.button {
  transition: background-color var(--transition-base), 
              color var(--transition-base);
}
```

---

## Component-Specific Migrations

### Sidebar

```tsx
// Typography
<h2 className="text-lg font-semibold text-neutral-800">
  Line Summary
</h2>

// Table numbers with monospace
<td className="text-mono tabular-nums">
  {count}
</td>

// Header background
<div className="bg-neutral-50 border-b border-neutral-200">
```

### BottomBar

```tsx
// Zoom display with monospace
<span className="text-base text-neutral-900 text-mono tabular-nums font-medium">
  {zoomPercentage}%
</span>
```

### WidthHUD

```tsx
// Value display with monospace
<span className="text-base text-neutral-900 text-mono tabular-nums font-semibold">
  {width}px
</span>

// Accent color
<input className="accent-[var(--color-primary-600)]" />
```

### DrawButton

```tsx
// Active state
className="bg-[var(--color-primary-600)] ring-[var(--color-primary-300)]"

// Inactive state
className="bg-white ring-neutral-300"
```

---

## Common Patterns

### Button Styles

```css
/* Primary button */
.btn-primary {
  background: var(--color-primary-600);
  color: white;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-base);
}

.btn-primary:hover {
  background: var(--color-primary-700);
}

/* Secondary button */
.btn-secondary {
  background: white;
  color: var(--color-neutral-700);
  border: 1px solid var(--color-neutral-300);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
}
```

### Card Styles

```css
.card {
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}
```

### Input Styles

```css
.input {
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-500);
}
```

---

## Deprecation Timeline

### v2.0.0 (Current)
- ✅ New design tokens available
- ✅ Legacy tokens still work
- ⚠️ Deprecation warnings in console

### v2.5.0 (Future)
- ⚠️ Legacy tokens marked for removal
- 📝 Migration guide updated

### v3.0.0 (Future)
- ❌ Legacy tokens removed
- ✅ Full migration required

---

## Testing Your Migration

### Checklist

- [ ] All colors use CSS custom properties
- [ ] Typography uses design tokens
- [ ] Spacing follows 8px grid
- [ ] Shadows use token system
- [ ] Border radius uses tokens
- [ ] Transitions use tokens
- [ ] No hardcoded values
- [ ] All tests passing
- [ ] Visual regression check
- [ ] Accessibility verified

---

## Getting Help

- Review [DESIGN_STUDY.md](./DESIGN_STUDY.md) for complete specifications
- Check [DESIGN_QUICK_REFERENCE.md](./DESIGN_QUICK_REFERENCE.md) for quick lookups
- See [DESIGN_COMPONENT_SPECS.md](./DESIGN_COMPONENT_SPECS.md) for component examples
- Read [DESIGN_CHANGELOG.md](./DESIGN_CHANGELOG.md) for what changed

---

## Best Practices

1. **Always use tokens** - Never hardcode design values
2. **Use semantic colors** - Prefer `--text-primary` over `--color-neutral-900`
3. **Follow the grid** - Use 8px spacing increments
4. **Test accessibility** - Verify contrast ratios
5. **Document deviations** - If you must deviate, document why


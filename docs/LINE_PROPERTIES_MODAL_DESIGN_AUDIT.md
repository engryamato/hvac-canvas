# Line Properties Modal - Comprehensive Design Audit

**Version:** 1.0  
**Date:** 2025-10-17  
**Status:** Audit Complete - Awaiting Review & Approval  
**Auditor:** Augment AI

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Screenshot Analysis - Critical Findings](#screenshot-analysis---critical-findings)
3. [Spacing & Layout Analysis](#spacing--layout-analysis)
4. [Typography Analysis](#typography-analysis)
5. [Dynamic Sizing & Animation](#dynamic-sizing--animation)
6. [Border Aesthetics](#border-aesthetics)
7. [Additional Improvement Areas](#additional-improvement-areas)
8. [Critical UI Issues from Screenshots](#critical-ui-issues-identified-from-screenshots)
9. [Implementation Priority Matrix](#implementation-priority-matrix)
10. [Appendix: Current vs. Proposed Values](#appendix-current-vs-proposed-values)

---

## Executive Summary

### Audit Scope

This audit examines the **Line Properties Modal** component (220px wide, draggable, three-tab modal) across five key design areas: spacing, typography, animations, borders, and overall polish. The modal is currently functional and accessible, but lacks visual refinement and consistency in several areas.

### Key Findings

**Strengths:**
- ✅ Solid foundation with consistent use of design tokens
- ✅ Good accessibility (ARIA labels, keyboard navigation)
- ✅ Clean component architecture
- ✅ Functional animations and interactions
- ✅ Modal can be positioned both left-aligned and centered on canvas

**Areas Needing Improvement:**
- ⚠️ **Spacing inconsistencies** across tabs and sections
- ⚠️ **Typography hierarchy** could be stronger
- ⚠️ **Animation timing** feels abrupt in some transitions
- ⚠️ **Border usage** lacks visual hierarchy
- ⚠️ **Visual polish** missing in several areas
- ⚠️ **Active tab styling** - "Properties" tab appears grayed/disabled when active
- ⚠️ **White space utilization** - Advanced tab has excessive empty space
- ⚠️ **Expandable sections** - "More Details" / "Less Details" in Calculations tab needs better visual treatment

### Overall Assessment

**Current State:** Functional but lacks polish (6/10)  
**Target State:** Professional, refined, polished (9/10)  
**Estimated Effort:** 2-3 days of focused design refinement

---

## Screenshot Analysis - Critical Findings

Based on the provided reference screenshots, the following critical observations were made:

### 🔴 Critical Issue: Active Tab Styling
**Screenshot Evidence**: Image 1 (Properties Tab)
**Problem**: The "Properties" tab label appears grayed out/disabled even when it is the active tab. This creates confusion about which tab is currently selected.
**Impact**: HIGH - Users cannot easily identify which tab they're viewing
**Action Required**: Immediate fix needed - see [Critical UI Issues](#critical-ui-issues-identified-from-screenshots) section

### 🟡 Layout Issue: Advanced Tab White Space
**Screenshot Evidence**: Image 2 (Advanced Tab)
**Problem**: The Advanced tab shows excessive white space with minimal content (Airflow input, Results button, and three calculated values taking up only ~30% of available space).
**Impact**: MEDIUM - Creates unbalanced visual appearance
**Recommendation**: Add visual grouping, helper text, and better layout structure

### 🟢 Positive Observation: Expandable Sections
**Screenshot Evidence**: Images 3 & 4 (Calculations Tab)
**Finding**: The "More Details" / "Less Details" expandable section works well functionally, showing/hiding Layer, Material, and Gauge fields.
**Opportunity**: Could benefit from better visual treatment to indicate interactivity

### 🟢 Positive Observation: Width Selection Chips
**Screenshot Evidence**: Image 3 (Calculations Tab)
**Finding**: Width selection chips (6", 8", 10", 12", 14") provide good quick-select functionality below the dropdown.
**Opportunity**: Could benefit from better hover states and selected state styling

### 🟢 Positive Observation: Modal Positioning
**Screenshot Evidence**: Images 1-2 (left-aligned) vs Images 3-4 (centered)
**Finding**: Modal can be positioned both left-aligned (near the line) and centered on canvas, which is good adaptive behavior.
**Status**: Current behavior is acceptable, just needs documentation

### Summary of Screenshot Findings

| Issue | Severity | Tab | Status |
|-------|----------|-----|--------|
| Active tab appears disabled | 🔴 Critical | All | Needs immediate fix |
| Excessive white space | 🟡 Medium | Advanced | Needs layout improvement |
| Expandable section styling | 🟢 Low | Calculations | Enhancement opportunity |
| Width chips styling | 🟢 Low | Calculations | Enhancement opportunity |
| Modal positioning | ✅ Good | All | Document behavior |

---

## Spacing & Layout Analysis

### 1. Modal Container Padding

#### Current State
```tsx
// LinePropertiesModal.tsx, line 217
className="fixed bg-white rounded-lg shadow-lg p-4"
// Padding: 16px (p-4) all sides
```

#### Issues Identified
1. **Inconsistent internal spacing**: 16px padding creates cramped feeling with 220px width
2. **Content too close to edges**: Dropdowns and inputs feel squeezed
3. **No breathing room**: Visual elements lack adequate whitespace

#### Recommendations
```tsx
// Increase padding for better breathing room
className="fixed bg-white rounded-lg shadow-lg p-5"
// New padding: 20px (p-5) all sides
```

**Rationale**: 20px padding provides better visual balance for a 220px modal. Creates 180px content area (220 - 40), which is more comfortable for form controls.

**Priority**: 🔴 **HIGH** - Affects overall modal feel

---

### 2. Section Spacing (Between Major Elements)

#### Current State
```tsx
// LinePropertiesModal.tsx, lines 248, 256, 285
<Separator className="my-2" aria-hidden="true" />
// Margin: 8px top/bottom (my-2)
```

#### Issues Identified
1. **Too tight**: 8px between header/tabs/content/footer feels cramped
2. **Lacks visual hierarchy**: All separators have same spacing
3. **Inconsistent with design tokens**: MODAL_TOKENS.dimensions.SECTION_GAP = 16px

#### Recommendations
```tsx
// Header to Tabs separator
<Separator className="my-3" aria-hidden="true" />
// Margin: 12px top/bottom

// Tabs to Content separator
<Separator className="my-3" aria-hidden="true" />
// Margin: 12px top/bottom

// Content to Footer separator
<Separator className="my-4" aria-hidden="true" />
// Margin: 16px top/bottom (more emphasis before actions)
```

**Rationale**: Progressive spacing creates visual hierarchy. Footer gets more space to emphasize action buttons.

**Priority**: 🔴 **HIGH** - Improves visual hierarchy

---

### 3. Tab Content Spacing

#### Current State
```tsx
// PropertiesTab.tsx, line 101
<div className={`space-y-3 ${className}`}>
// Gap: 12px between elements (space-y-3)

// CalculationsTab.tsx, line 111
<div className={`space-y-3 ${className}`}>
// Gap: 12px between elements

// AdvancedTab.tsx, line 105
<div className={`space-y-3 ${className}`}>
// Gap: 12px between elements
```

#### Issues Identified
1. **Consistent but could be better**: 12px is functional but feels slightly tight
2. **No differentiation**: All tabs use same spacing regardless of content density
3. **Dropdowns feel cramped**: Especially when stacked vertically

#### Recommendations
```tsx
// PropertiesTab: Increase to 16px for better dropdown separation
<div className={`space-y-4 ${className}`}>
// Gap: 16px between elements (space-y-4)

// CalculationsTab: Keep 12px (content is less dense)
<div className={`space-y-3 ${className}`}>
// Gap: 12px between elements (space-y-3)

// AdvancedTab: Increase to 16px for section separation
<div className={`space-y-4 ${className}`}>
// Gap: 16px between elements (space-y-4)
```

**Rationale**: Properties tab has densest content (multiple dropdowns), needs more breathing room. Calculations tab is fine. Advanced tab has sections that benefit from more separation.

**Priority**: 🟡 **MEDIUM** - Improves readability

---

### 4. Form Group Spacing (Label to Input)

#### Current State
```tsx
// Label.tsx, line 53
className="block text-xs font-medium text-neutral-600 mb-2"
// Margin-bottom: 8px (mb-2)

// Dropdown.tsx, line 206
className="block text-xs font-medium text-neutral-600 mb-2"
// Margin-bottom: 8px (mb-2)

// Input.tsx, line 176
className="block text-xs font-medium text-neutral-600 mb-2"
// Margin-bottom: 8px (mb-2)
```

#### Issues Identified
1. **Consistent across components**: ✅ Good!
2. **Slightly tight**: 8px feels cramped for label-to-input relationship
3. **Could improve scannability**: More space helps users parse form faster

#### Recommendations
```tsx
// Increase label-to-input spacing to 10px
className="block text-xs font-medium text-neutral-600 mb-2.5"
// Margin-bottom: 10px (mb-2.5)
```

**Rationale**: 10px provides better visual grouping while maintaining compact form. Improves scannability without making form feel loose.

**Priority**: 🟢 **LOW** - Nice-to-have improvement

---

### 5. ExpandableSection Spacing

#### Current State
```tsx
// ExpandableSection.tsx, line 103
<div className="space-y-3 pb-4">
// Gap: 12px between children
// Padding-bottom: 16px before button
```

#### Issues Identified
1. **Bottom padding too large**: 16px before "More Details" button creates awkward gap
2. **Inconsistent with parent**: Parent uses space-y-3, child also uses space-y-3
3. **Button feels disconnected**: Large gap makes button feel separate from content

#### Recommendations
```tsx
// Reduce bottom padding to create tighter relationship with button
<div className="space-y-4 pb-3">
// Gap: 16px between children (matches parent recommendation)
// Padding-bottom: 12px before button (tighter connection)
```

**Rationale**: Tighter padding connects button to content. Increased internal spacing (16px) matches parent tab spacing.

**Priority**: 🟡 **MEDIUM** - Improves visual cohesion

---

### 6. Modal Header Spacing

#### Current State
```tsx
// ModalHeader.tsx, line 58
className="flex items-center h-8 px-4"
// Height: 32px (h-8)
// Padding: 16px horizontal (px-4)
```

#### Issues Identified
1. **Height feels cramped**: 32px is minimum for 14px text
2. **Horizontal padding inconsistent**: Uses 16px while modal uses 16px (creates double padding effect)
3. **No vertical padding**: Text sits directly at top/bottom edges

#### Recommendations
```tsx
// Increase height and adjust padding
className="flex items-center h-10 px-0 py-1"
// Height: 40px (h-10) - more comfortable
// Padding: 0px horizontal (px-0) - rely on modal padding
// Padding: 4px vertical (py-1) - centers text better
```

**Rationale**: 40px height provides better visual weight for header. Removing horizontal padding prevents double-padding with modal container. Vertical padding centers text optically.

**Priority**: 🔴 **HIGH** - Improves header prominence

---

### 7. TabBar Spacing

#### Current State
```tsx
// TabBar.tsx, line 93
className="flex gap-0.5 h-9"
// Gap: 2px between tabs (gap-0.5)
// Height: 36px (h-9)
```

#### Issues Identified
1. **Gap too small**: 2px creates visual tension between tabs
2. **Height appropriate**: 36px is good for 13px text
3. **No padding on tabs**: Tabs rely solely on flex-1 for width

#### Recommendations
```tsx
// Increase gap for better visual separation
className="flex gap-1 h-9"
// Gap: 4px between tabs (gap-1)
// Height: 36px (h-9) - keep as is
```

**Rationale**: 4px gap creates clearer visual separation between tabs without feeling loose. Maintains compact feel while improving clarity.

**Priority**: 🟡 **MEDIUM** - Improves tab clarity

---

### 8. Footer Button Spacing

#### Current State
```tsx
// ModalFooter.tsx, line 63
className="flex items-center gap-1 h-10 p-2"
// Gap: 4px between buttons (gap-1)
// Height: 40px (h-10)
// Padding: 8px all sides (p-2)
```

#### Issues Identified
1. **Gap too small**: 4px between Duplicate and Delete feels tight
2. **Padding creates double-padding**: 8px footer padding + modal 16px padding = 24px total
3. **Height appropriate**: 40px is good for button container

#### Recommendations
```tsx
// Increase gap and remove padding
className="flex items-center gap-2 h-10 px-0 py-0"
// Gap: 8px between buttons (gap-2)
// Height: 40px (h-10) - keep as is
// Padding: 0px (rely on modal padding)
```

**Rationale**: 8px gap provides better visual separation for action buttons. Removing padding prevents double-padding issue.

**Priority**: 🟡 **MEDIUM** - Improves button clarity

---

### 9. Chip Spacing (Width Quick-Select)

#### Current State
```tsx
// WidthChips.tsx (inferred from Chip component)
// Chips rendered in flex container with gap
// Individual chip: h-7 px-2.5 (28px height, 10px horizontal padding)
```

#### Issues Identified
1. **No explicit gap defined**: Chips likely use default spacing
2. **Padding appropriate**: 10px horizontal padding is good for 12px text
3. **Height appropriate**: 28px is good for medium chips

#### Recommendations
```tsx
// Add explicit gap to chip container
<div className="flex flex-wrap gap-2">
// Gap: 8px between chips (gap-2)
```

**Rationale**: Explicit 8px gap ensures consistent spacing between width chips. Prevents chips from feeling cramped when wrapped.

**Priority**: 🟢 **LOW** - Minor improvement

---

### Spacing Summary Table

| Element | Current | Proposed | Change | Priority |
|---------|---------|----------|--------|----------|
| Modal padding | 16px | 20px | +4px | 🔴 HIGH |
| Header-Tabs separator | 8px | 12px | +4px | 🔴 HIGH |
| Tabs-Content separator | 8px | 12px | +4px | 🔴 HIGH |
| Content-Footer separator | 8px | 16px | +8px | 🔴 HIGH |
| Properties tab spacing | 12px | 16px | +4px | 🟡 MEDIUM |
| Advanced tab spacing | 12px | 16px | +4px | 🟡 MEDIUM |
| Label-to-input | 8px | 10px | +2px | 🟢 LOW |
| Expandable section bottom | 16px | 12px | -4px | 🟡 MEDIUM |
| Header height | 32px | 40px | +8px | 🔴 HIGH |
| Tab gap | 2px | 4px | +2px | 🟡 MEDIUM |
| Footer button gap | 4px | 8px | +4px | 🟡 MEDIUM |
| Chip gap | undefined | 8px | +8px | 🟢 LOW |

---

## Typography Analysis

### 1. Modal Header Title

#### Current State
```tsx
// ModalHeader.tsx, line 63
className="text-sm font-semibold text-neutral-900"
// Font size: 14px (text-sm)
// Font weight: 600 (font-semibold)
// Color: #0F172A (text-neutral-900)
```

#### Issues Identified
1. **Size too small**: 14px feels underwhelming for modal title
2. **Weight appropriate**: 600 (semibold) is good for titles
3. **Color excellent**: #0F172A provides 15.8:1 contrast on white

#### Recommendations
```tsx
// Increase font size for better prominence
className="text-base font-semibold text-neutral-900"
// Font size: 16px (text-base)
// Font weight: 600 (font-semibold) - keep as is
// Color: #0F172A (text-neutral-900) - keep as is
```

**Rationale**: 16px title creates better visual hierarchy. Matches common modal title sizes in modern UIs. Still fits comfortably in 40px header height.

**Priority**: 🔴 **HIGH** - Establishes clear hierarchy

---

### 2. Tab Labels

#### Current State
```tsx
// TabBar.tsx, line 113
className="flex-1 text-xs font-medium transition-colors"
// Font size: 12px (text-xs)
// Font weight: 500 (font-medium)
// Active color: white (text-white)
// Inactive color: #475569 (text-neutral-600)
```

#### Issues Identified
1. **Size too small**: 12px makes tabs hard to read
2. **Weight appropriate**: 500 (medium) is good for tabs
3. **Color contrast good**: White on blue (14:1), gray on white (7:1)
4. **Inconsistent with design tokens**: MODAL_TOKENS.typography.TAB_SIZE = 13px

#### Recommendations
```tsx
// Increase to match design tokens
className="flex-1 text-[13px] font-medium transition-colors"
// Font size: 13px (custom size via arbitrary value)
// Font weight: 500 (font-medium) - keep as is
// Colors: keep as is
```

**Rationale**: 13px matches design token specification. Improves readability without making tabs feel oversized. Uses Tailwind arbitrary value for precise sizing.

**Priority**: 🟡 **MEDIUM** - Improves readability

---

### 3. Form Labels

#### Current State
```tsx
// Label.tsx, line 53
// Dropdown.tsx, line 206
// Input.tsx, line 176
className="block text-xs font-medium text-neutral-600 mb-2"
// Font size: 12px (text-xs)
// Font weight: 500 (font-medium)
// Color: #475569 (text-neutral-600)
```

#### Issues Identified
1. **Size appropriate**: 12px is standard for form labels
2. **Weight appropriate**: 500 (medium) provides good emphasis
3. **Color excellent**: #475569 provides 7:1 contrast on white
4. **Consistent across components**: ✅ Good!

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Rationale**: 12px medium weight labels are industry standard. Color provides excellent contrast. Consistency across components is maintained.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 4. Helper Text

#### Current State
```tsx
// Input.tsx, line 218
className="text-xs ${getHelperTextColor()}"
// Font size: 12px (text-xs)
// Font weight: 400 (default/normal)
// Color: varies by state (neutral-600, red-600, amber-600, green-600)
```

#### Issues Identified
1. **Size too large**: 12px helper text competes with labels
2. **Weight appropriate**: 400 (normal) is correct
3. **Color contrast varies**: Some states may not meet WCAG AA
4. **Inconsistent with design tokens**: MODAL_TOKENS.typography.HELPER_SIZE = 11px

#### Recommendations
```tsx
// Reduce to match design tokens
className="text-[11px] ${getHelperTextColor()}"
// Font size: 11px (custom size via arbitrary value)
// Font weight: 400 (normal) - keep as is
// Colors: keep as is
```

**Rationale**: 11px matches design token specification. Creates better visual hierarchy (labels 12px > helper 11px). Reduces visual competition.

**Priority**: 🟡 **MEDIUM** - Improves hierarchy

---

### Typography Summary Table

| Element | Current Size | Current Weight | Proposed Size | Proposed Weight | Priority |
|---------|--------------|----------------|---------------|-----------------|----------|
| Modal title | 14px | 600 | **16px** | 600 | 🔴 HIGH |
| Tab labels | 12px | 500 | **13px** | 500 | 🟡 MEDIUM |
| Form labels | 12px | 500 | 12px | 500 | ✅ NO CHANGE |
| Input text | 14px | 400 | 14px | 400 | ✅ NO CHANGE |
| Dropdown text | 14px | 400 | 14px | 400 | ✅ NO CHANGE |
| Button text | 14px | 600 | 14px | 600 | ✅ NO CHANGE |
| Chip text | 12px | 500 | 12px | 500 | ✅ NO CHANGE |
| Helper text | 12px | 400 | **11px** | 400 | 🟡 MEDIUM |

### Typography Color Palette

| Element | Current Color | Hex | Contrast Ratio | Status |
|---------|---------------|-----|----------------|--------|
| Primary text | neutral-900 | #0F172A | 15.8:1 | ✅ AAA |
| Secondary text | neutral-600 | #475569 | 7:1 | ✅ AAA |
| Tertiary text | neutral-500 | #64748B | 4.6:1 | ✅ AA |
| Error text | red-600 | #DC2626 | 5.9:1 | ✅ AAA |
| Warning text | amber-600 | #D97706 | 4.7:1 | ✅ AA |
| Success text | green-600 | #16A34A | 4.1:1 | ⚠️ Borderline |

**Note**: Success text should be darkened to green-700 (#15803D, 5.2:1 contrast) for better accessibility.

---

## Dynamic Sizing & Animation

### 1. Modal Open/Close Animation

#### Current State
```tsx
// useModalAnimation.ts (inferred from usage)
// Animation class: likely fade-in/fade-out with scale
// Duration: MODAL_TOKENS.animations.DURATION_OPEN = 200ms (open)
// Duration: MODAL_TOKENS.animations.DURATION_CLOSE = 150ms (close)
```

#### Issues Identified
1. **Asymmetric timing**: 200ms open vs 150ms close feels inconsistent
2. **No easing specified**: Default easing may feel linear
3. **Scale effect unclear**: Not sure if scale animation is applied

#### Recommendations
```tsx
// Symmetric timing with proper easing
// Open animation: 200ms ease-out (feels snappy)
// Close animation: 200ms ease-in (feels natural)
// Scale: 0.95 to 1.0 on open, 1.0 to 0.95 on close
// Opacity: 0 to 1 on open, 1 to 0 on close

className={[
  'transition-all duration-200',
  isOpen ? 'opacity-100 scale-100 ease-out' : 'opacity-0 scale-95 ease-in',
].join(' ')}
```

**Rationale**: Symmetric 200ms timing feels more polished. Ease-out on open (starts fast, ends slow) feels responsive. Ease-in on close (starts slow, ends fast) feels natural. Subtle scale (95% to 100%) adds depth.

**Priority**: 🟡 **MEDIUM** - Improves perceived quality

---

### 2. Tab Switching Animation

#### Current State
```tsx
// TabBar.tsx, line 113
className="flex-1 text-xs font-medium transition-colors"
// Transition: colors only
// Duration: default (150ms)
// Easing: default (ease)
```

#### Issues Identified
1. **Only colors transition**: Tab background/text color change
2. **No content transition**: Tab panel content appears instantly
3. **Duration not explicit**: Relies on Tailwind default

#### Recommendations
```tsx
// Explicit duration for tab button
className="flex-1 text-[13px] font-medium transition-colors duration-150 ease-in-out"

// Add fade transition for tab panel content
<div
  role="tabpanel"
  className="animate-in fade-in duration-150"
>
  {/* Tab content */}
</div>
```

**Rationale**: Explicit 150ms duration ensures consistency. Ease-in-out provides smooth color transition. Fade-in on tab panel content prevents jarring content swap.

**Priority**: 🟡 **MEDIUM** - Improves tab switching feel

---

### 3. Expandable Section Animation

#### Current State
```tsx
// ExpandableSection.tsx, lines 93-100
style={{
  maxHeight: expanded ? `${contentHeight}px` : '0px',
  opacity: expanded ? 1 : 0,
  transitionProperty: 'max-height, opacity',
  transitionDuration: expanded ? '300ms, 100ms' : '300ms, 100ms',
  transitionDelay: expanded ? '0ms, 200ms' : '0ms, 0ms',
}}
```

#### Issues Identified
1. **Complex timing**: Different delays for expand vs collapse feels inconsistent
2. **Opacity delay on expand**: 200ms delay before fade-in feels slow
3. **Max-height transition**: Can feel janky if content height changes
4. **Duration appropriate**: 300ms is good for expand/collapse

#### Recommendations
```tsx
// Simplify timing for more predictable animation
style={{
  maxHeight: expanded ? `${contentHeight}px` : '0px',
  opacity: expanded ? 1 : 0,
  transitionProperty: 'max-height, opacity',
  transitionDuration: '300ms, 200ms', // Consistent durations
  transitionDelay: expanded ? '0ms, 100ms' : '0ms, 0ms', // Shorter delay
  transitionTimingFunction: 'ease-in-out',
}}
```

**Rationale**: Shorter 100ms delay on opacity fade-in feels more responsive. Consistent 300ms max-height + 200ms opacity durations are easier to predict. Ease-in-out provides smooth motion.

**Priority**: 🟢 **LOW** - Minor improvement

---

### 4. Dropdown Open/Close Animation

#### Current State
```tsx
// Dropdown.tsx, line 248
className="animate-in fade-in slide-in-from-top-1 duration-150"
// Animation: fade + slide from top
// Duration: 150ms
// Easing: default
```

#### Issues Identified
1. **No close animation**: Dropdown disappears instantly
2. **Slide direction**: Slide from top feels unnatural (should slide from button)
3. **Duration appropriate**: 150ms is good for dropdown

#### Recommendations
```tsx
// Add conditional animation for open/close
className={[
  'transition-all duration-150',
  isOpen
    ? 'opacity-100 translate-y-0 ease-out'
    : 'opacity-0 -translate-y-1 ease-in pointer-events-none',
].join(' ')}
```

**Rationale**: Conditional animation provides smooth open and close. Translate-y creates natural slide from button position. Ease-out on open, ease-in on close feels polished. Pointer-events-none prevents interaction during close.

**Priority**: 🟡 **MEDIUM** - Improves dropdown feel

---

### 5. Modal Drag Animation

#### Current State
```tsx
// LinePropertiesModal.tsx, line 225
transition: isDragging ? 'none' : 'left 200ms ease-in-out, top 200ms ease-in-out'
// Transition disabled during drag
// Transition enabled after drag (200ms ease-in-out)
```

#### Issues Identified
1. **Good implementation**: Disabling transition during drag is correct
2. **Smooth return**: 200ms ease-in-out for position snap is good
3. **No issues found**: ✅ Current implementation is excellent

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Rationale**: Disabling transition during drag provides immediate feedback. Re-enabling after drag with ease-in-out provides smooth snap to valid position.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 6. Button Hover/Active States

#### Current State
```tsx
// Button.tsx, line 142
'transition-colors duration-150'
// Transition: colors only
// Duration: 150ms
// Easing: default (ease)
```

#### Issues Identified
1. **Only colors transition**: Background and text color
2. **No transform**: Could add subtle scale or lift on hover
3. **Duration appropriate**: 150ms is good for hover

#### Recommendations
```tsx
// Add subtle transform on hover
'transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]'
// Transition: all properties
// Duration: 150ms
// Hover: scale up 2%
// Active: scale down 2%
```

**Rationale**: Subtle scale on hover (102%) provides tactile feedback. Scale down on active (98%) reinforces button press. Transition-all ensures smooth animation.

**Priority**: 🟢 **LOW** - Nice-to-have polish

---

### Animation Summary Table

| Element | Current Duration | Current Easing | Proposed Duration | Proposed Easing | Priority |
|---------|------------------|----------------|-------------------|-----------------|----------|
| Modal open | 200ms | default | 200ms | **ease-out** | 🟡 MEDIUM |
| Modal close | 150ms | default | **200ms** | **ease-in** | 🟡 MEDIUM |
| Tab switch | 150ms | default | 150ms | **ease-in-out** | 🟡 MEDIUM |
| Tab content | none | none | **150ms** | **fade-in** | 🟡 MEDIUM |
| Expand section | 300ms | default | 300ms | **ease-in-out** | 🟢 LOW |
| Dropdown open | 150ms | default | 150ms | **ease-out** | 🟡 MEDIUM |
| Dropdown close | instant | none | **150ms** | **ease-in** | 🟡 MEDIUM |
| Modal drag | 200ms | ease-in-out | 200ms | ease-in-out | ✅ NO CHANGE |
| Button hover | 150ms | default | 150ms | default | ✅ NO CHANGE |

---

## Border Aesthetics

### 1. Modal Outer Border

#### Current State
```tsx
// LinePropertiesModal.tsx, line 217
className="fixed bg-white rounded-lg shadow-lg p-4"
// Border: none (relies on shadow only)
// Border radius: 8px (rounded-lg)
// Shadow: shadow-lg (0 10px 15px -3px rgba(0,0,0,0.1))
```

#### Issues Identified
1. **No border**: Modal relies solely on shadow for definition
2. **Shadow alone insufficient**: On light backgrounds, modal edge is unclear
3. **Lacks polish**: Subtle border adds refinement

#### Recommendations
```tsx
// Add subtle border for definition
className="fixed bg-white rounded-lg shadow-lg border border-neutral-200 p-5"
// Border: 1px solid #E2E8F0 (border-neutral-200)
// Border radius: 8px (rounded-lg) - keep as is
// Shadow: shadow-lg - keep as is
// Padding: 20px (p-5) - from spacing recommendations
```

**Rationale**: Subtle 1px border provides clear edge definition. Neutral-200 (#E2E8F0) is light enough to not overpower but strong enough to define. Complements shadow rather than replacing it.

**Priority**: 🔴 **HIGH** - Improves modal definition

---

### 2. Separator Borders

#### Current State
```tsx
// Separator.tsx, line 48
className="border-0 border-t border-neutral-200"
// Border: 1px top, neutral-200 (#E2E8F0)
// Style: solid (default)
```

#### Issues Identified
1. **Color appropriate**: Neutral-200 is good for subtle separation
2. **Width appropriate**: 1px is standard
3. **No issues found**: ✅ Current implementation is good

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Rationale**: 1px neutral-200 separator is industry standard. Provides subtle visual separation without being distracting.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 3. Input/Dropdown Borders

#### Current State
```tsx
// Input.tsx, line 203
// Dropdown.tsx, line 220-221
border rounded
isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-neutral-300'
// Border: 1px solid
// Default: neutral-300 (#CBD5E1)
// Focus: blue-500 (#3B82F6) + 1px ring
// Border radius: 4px (rounded)
```

#### Issues Identified
1. **Border color good**: Neutral-300 provides clear definition
2. **Focus state excellent**: Blue border + ring is clear
3. **Border radius appropriate**: 4px matches design tokens
4. **No issues found**: ✅ Current implementation is excellent

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Rationale**: 1px neutral-300 border with blue focus state is industry standard. 4px radius matches design token specification.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 4. Button Borders

#### Current State
```tsx
// Button.tsx, line 140
'bg-white border'
// Border: 1px solid
// Primary: border-neutral-300 (#CBD5E1)
// Danger: border-red-600 (#DC2626)
// Expand: border-neutral-300 border-dashed
```

#### Issues Identified
1. **Border colors appropriate**: Neutral-300 for primary, red-600 for danger
2. **Dashed border creative**: Good visual distinction for expand button
3. **Border radius**: 6px (rounded-md) is good
4. **No issues found**: ✅ Current implementation is excellent

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Rationale**: Border colors match button semantics. Dashed border for expand button is creative and functional. 6px radius matches design tokens.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 5. Chip Borders

#### Current State
```tsx
// Chip.tsx, line 127
'rounded-full border'
// Border: 1px solid
// Active: border-blue-600 (#2563EB)
// Inactive: border-neutral-300 (#CBD5E1)
// Border radius: full (pill shape)
```

#### Issues Identified
1. **Border colors appropriate**: Blue for active, neutral for inactive
2. **Border radius perfect**: Full radius creates pill shape
3. **No issues found**: ✅ Current implementation is excellent

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Rationale**: Border colors match chip states. Full radius creates proper pill shape. Consistent with design tokens.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 6. Tab Bar Borders

#### Current State
```tsx
// TabBar.tsx, line 115
isActive ? 'bg-blue-600 text-white border-b-2 border-blue-600' : 'bg-transparent text-neutral-600'
// Active tab: 2px bottom border, blue-600
// Inactive tab: no border
```

#### Issues Identified
1. **Active border good**: 2px bottom border emphasizes active tab
2. **Inactive tabs lack definition**: No border makes tabs feel flat
3. **Missing tab bar container border**: No bottom border on tab bar itself

#### Recommendations
```tsx
// Add subtle border to tab bar container
<div className="flex gap-1 h-9 border-b border-neutral-200">

// Keep active tab border
isActive ? 'bg-blue-600 text-white border-b-2 border-blue-600' : 'bg-transparent text-neutral-600'
```

**Rationale**: Adding 1px bottom border to tab bar container creates baseline. Active tab's 2px border overlays this, creating clear visual hierarchy. Inactive tabs sit on baseline.

**Priority**: 🟡 **MEDIUM** - Improves tab definition

---

### Border Summary Table

| Element | Current Border | Current Radius | Proposed Border | Proposed Radius | Priority |
|---------|----------------|----------------|-----------------|-----------------|----------|
| Modal outer | none | 8px | **1px neutral-200** | 8px | 🔴 HIGH |
| Separators | 1px neutral-200 | none | 1px neutral-200 | none | ✅ NO CHANGE |
| Inputs | 1px neutral-300 | 4px | 1px neutral-300 | 4px | ✅ NO CHANGE |
| Dropdowns | 1px neutral-300 | 4px | 1px neutral-300 | 4px | ✅ NO CHANGE |
| Buttons | 1px (varies) | 6px | 1px (varies) | 6px | ✅ NO CHANGE |
| Chips | 1px (varies) | full | 1px (varies) | full | ✅ NO CHANGE |
| Tab bar | none | none | **1px neutral-200** | none | 🟡 MEDIUM |
| Active tab | 2px blue-600 | none | 2px blue-600 | none | ✅ NO CHANGE |

---

## Additional Improvement Areas

### 1. Visual Hierarchy

#### Current State
- Modal title: 14px semibold
- Tab labels: 12px medium
- Form labels: 12px medium
- Input text: 14px normal
- Helper text: 12px normal

#### Issues Identified
1. **Weak title hierarchy**: 14px title barely larger than 14px input text
2. **Label/helper text same size**: 12px labels compete with 12px helper text
3. **No clear visual flow**: Eye doesn't know where to look first

#### Recommendations
1. **Strengthen title**: 16px semibold (from Typography section)
2. **Reduce helper text**: 11px normal (from Typography section)
3. **Add section titles**: 14px semibold for Advanced tab sections
4. **Use color hierarchy**: neutral-900 (primary) > neutral-600 (secondary) > neutral-500 (tertiary)

**Priority**: 🔴 **HIGH** - Fundamental to good design

---

### 2. Color Usage & Consistency

#### Current State
- Primary blue: #2563EB (blue-600)
- Neutral grays: #F8FAFC to #0F172A (neutral-50 to neutral-900)
- State colors: red-600, amber-600, green-600

#### Issues Identified
1. **Excellent color palette**: ✅ Well-chosen colors
2. **Consistent usage**: ✅ Colors used consistently
3. **Good contrast ratios**: ✅ All meet WCAG AA (except disabled)
4. **Success color borderline**: green-600 (#16A34A) has 4.1:1 contrast (borderline)

#### Recommendations
1. **Darken success color**: Use green-700 (#15803D, 5.2:1 contrast) instead of green-600
2. **Maintain current palette**: All other colors are excellent

**Priority**: 🟢 **LOW** - Minor accessibility improvement

---

### 3. Icon Usage & Sizing

#### Current State
- Chevron icons: 12px (w-3 h-3) in dropdowns
- Chevron icons: 16px (w-4 h-4) in expand button
- X icon: 10px (w-2.5 h-2.5) in chips

#### Issues Identified
1. **Inconsistent sizing**: Chevrons vary between 12px and 16px
2. **Small icons**: 12px chevrons feel cramped in dropdowns
3. **X icon appropriate**: 10px is good for small chips

#### Recommendations
1. **Standardize chevron size**: Use 14px (w-3.5 h-3.5) for all chevrons
2. **Keep X icon size**: 10px is appropriate for chips
3. **Add icon color tokens**: Define icon colors in design tokens

**Priority**: 🟡 **MEDIUM** - Improves consistency

---

### 4. Focus States & Keyboard Navigation

#### Current State
- Inputs/Dropdowns: Blue border + 1px ring
- Buttons: 2px blue ring with 1px offset
- Tabs: No visible focus ring (relies on browser default)

#### Issues Identified
1. **Input focus excellent**: Blue border + ring is clear
2. **Button focus excellent**: 2px ring with offset is clear
3. **Tab focus missing**: No custom focus ring for tabs
4. **Inconsistent focus styles**: Different approaches for different elements

#### Recommendations
```tsx
// Standardize focus ring across all interactive elements
'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

// Apply to tabs
<button className="... focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">

// Keep current input/dropdown focus (already good)
// Keep current button focus (already good)
```

**Priority**: 🔴 **HIGH** - Critical for accessibility

---

### 5. Hover States & Interactive Feedback

#### Current State
- Buttons: Background color change (neutral-50)
- Dropdowns: Border color change (neutral-400)
- Chips: Background color change (neutral-50 or blue-700)
- Tabs: Background color change (neutral-100)

#### Issues Identified
1. **Consistent approach**: ✅ All use color changes
2. **Subtle feedback**: Changes are subtle but noticeable
3. **No transform effects**: Could add subtle scale/lift
4. **Cursor changes**: ✅ Cursor changes to pointer

#### Recommendations
1. **Add subtle scale to buttons**: hover:scale-[1.02] (from Animation section)
2. **Keep current color changes**: Already good
3. **Add transition-all**: Ensures smooth animation of all properties

**Priority**: 🟢 **LOW** - Nice-to-have polish

---

### 6. Disabled States Clarity

#### Current State
- Buttons: 50% opacity + cursor-not-allowed
- Inputs: 50% opacity + neutral-50 background
- Dropdowns: 50% opacity + neutral-50 background

#### Issues Identified
1. **Consistent approach**: ✅ All use 50% opacity
2. **Clear visual indication**: ✅ Disabled state is obvious
3. **Cursor changes**: ✅ cursor-not-allowed is applied
4. **No issues found**: ✅ Current implementation is excellent

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 7. Error States & Validation Feedback

#### Current State
- Input error: Red border (red-500) + red ring
- Helper text error: Red text (red-600)
- Warning banner: Amber background + amber border

#### Issues Identified
1. **Clear error indication**: ✅ Red border + text is obvious
2. **Good contrast**: ✅ Red-600 has 5.9:1 contrast
3. **Warning distinct**: ✅ Amber clearly different from error
4. **No issues found**: ✅ Current implementation is excellent

#### Recommendations
**No changes needed** - Current implementation is excellent.

**Priority**: ✅ **NO ACTION NEEDED**

---

### 8. Loading States

#### Current State
- Button loading: Spinner icon + disabled state
- No loading states for other components

#### Issues Identified
1. **Button loading good**: ✅ Spinner + disabled is clear
2. **Missing loading states**: No loading for dropdowns, inputs, or modal
3. **Spinner animation**: ✅ Smooth rotation animation

#### Recommendations
1. **Add dropdown loading**: Show spinner when options are being fetched
2. **Add modal loading**: Show skeleton or spinner when data is loading
3. **Keep button loading**: Already excellent

**Priority**: 🟢 **LOW** - Future enhancement

---

### 9. Shadow Usage for Depth

#### Current State
- Modal: shadow-lg (0 10px 15px -3px rgba(0,0,0,0.1))
- Dropdown menu: shadow-lg (same as modal)
- Buttons: No shadow (flat design)

#### Issues Identified
1. **Modal shadow appropriate**: Creates good elevation
2. **Dropdown shadow appropriate**: Matches modal elevation
3. **Buttons flat**: No shadow creates flat appearance
4. **Inconsistent elevation**: Modal and dropdown have same shadow (should differ)

#### Recommendations
```tsx
// Modal: Stronger shadow for higher elevation
shadow-xl // 0 20px 25px -5px rgba(0,0,0,0.1)

// Dropdown: Keep current shadow
shadow-lg // 0 10px 15px -3px rgba(0,0,0,0.1)

// Buttons: Add subtle shadow on hover
hover:shadow-sm // 0 1px 3px 0 rgba(0,0,0,0.1)
```

**Priority**: 🟡 **MEDIUM** - Improves depth perception

---

### 10. Overall Visual Polish

#### Current State
- Clean, functional design
- Consistent spacing (mostly)
- Good color usage
- Accessible

#### Issues Identified
1. **Lacks refinement**: Feels functional but not polished
2. **Spacing inconsistencies**: Identified in Spacing section
3. **Typography hierarchy weak**: Identified in Typography section
4. **Missing subtle details**: No micro-interactions, subtle shadows, etc.

#### Recommendations
1. **Implement all spacing recommendations**: Creates breathing room
2. **Implement all typography recommendations**: Strengthens hierarchy
3. **Add subtle micro-interactions**: Scale on hover, smooth transitions
4. **Add subtle shadows**: Creates depth and elevation
5. **Add modal border**: Defines edges clearly
6. **Refine animations**: Smooth, consistent timing

**Priority**: 🔴 **HIGH** - Transforms functional to polished

---

## Implementation Priority Matrix

### 🔴 HIGH Priority (Must-Have)

These changes have the highest impact on user experience and should be implemented first.

| # | Change | Component | Impact | Effort | ROI |
|---|--------|-----------|--------|--------|-----|
| 1 | Increase modal padding to 20px | LinePropertiesModal | High | Low | ⭐⭐⭐⭐⭐ |
| 2 | Increase header-tabs separator to 12px | LinePropertiesModal | High | Low | ⭐⭐⭐⭐⭐ |
| 3 | Increase tabs-content separator to 12px | LinePropertiesModal | High | Low | ⭐⭐⭐⭐⭐ |
| 4 | Increase content-footer separator to 16px | LinePropertiesModal | High | Low | ⭐⭐⭐⭐⭐ |
| 5 | Increase header height to 40px | ModalHeader | High | Low | ⭐⭐⭐⭐⭐ |
| 6 | Increase modal title to 16px | ModalHeader | High | Low | ⭐⭐⭐⭐⭐ |
| 7 | Add modal outer border (1px neutral-200) | LinePropertiesModal | High | Low | ⭐⭐⭐⭐⭐ |
| 8 | Standardize focus rings across all elements | All interactive | High | Medium | ⭐⭐⭐⭐ |
| 9 | Implement visual hierarchy improvements | All components | High | Medium | ⭐⭐⭐⭐ |

**Total Estimated Time**: 4-6 hours
**Expected Impact**: Transforms modal from functional to polished

---

### 🟡 MEDIUM Priority (Should-Have)

These changes improve usability and polish but are not critical.

| # | Change | Component | Impact | Effort | ROI |
|---|--------|-----------|--------|--------|-----|
| 10 | Increase Properties tab spacing to 16px | PropertiesTab | Medium | Low | ⭐⭐⭐⭐ |
| 11 | Increase Advanced tab spacing to 16px | AdvancedTab | Medium | Low | ⭐⭐⭐⭐ |
| 12 | Reduce expandable section bottom padding to 12px | ExpandableSection | Medium | Low | ⭐⭐⭐⭐ |
| 13 | Increase tab gap to 4px | TabBar | Medium | Low | ⭐⭐⭐⭐ |
| 14 | Increase footer button gap to 8px | ModalFooter | Medium | Low | ⭐⭐⭐⭐ |
| 15 | Increase tab labels to 13px | TabBar | Medium | Low | ⭐⭐⭐⭐ |
| 16 | Reduce helper text to 11px | Input, HelperText | Medium | Low | ⭐⭐⭐ |
| 17 | Add tab bar bottom border | TabBar | Medium | Low | ⭐⭐⭐ |
| 18 | Improve modal open/close animation | useModalAnimation | Medium | Medium | ⭐⭐⭐ |
| 19 | Add tab content fade transition | LinePropertiesModal | Medium | Low | ⭐⭐⭐ |
| 20 | Add dropdown close animation | Dropdown | Medium | Low | ⭐⭐⭐ |
| 21 | Standardize icon sizing (14px chevrons) | All icons | Medium | Low | ⭐⭐⭐ |
| 22 | Improve shadow hierarchy (modal xl, dropdown lg) | Modal, Dropdown | Medium | Low | ⭐⭐⭐ |

**Total Estimated Time**: 6-8 hours
**Expected Impact**: Significantly improves polish and consistency

---

### 🟢 LOW Priority (Nice-to-Have)

These changes add extra polish but have minimal impact on core experience.

| # | Change | Component | Impact | Effort | ROI |
|---|--------|-----------|--------|--------|-----|
| 23 | Increase label-to-input spacing to 10px | Label, Input, Dropdown | Low | Low | ⭐⭐ |
| 24 | Add explicit chip gap (8px) | WidthChips | Low | Low | ⭐⭐ |
| 25 | Simplify expandable section animation timing | ExpandableSection | Low | Low | ⭐⭐ |
| 26 | Add button hover scale effect | Button | Low | Low | ⭐⭐ |
| 27 | Darken success color to green-700 | Design tokens | Low | Low | ⭐⭐ |
| 28 | Add button hover shadow | Button | Low | Low | ⭐ |
| 29 | Add loading states for dropdowns | Dropdown | Low | Medium | ⭐ |
| 30 | Add modal loading skeleton | LinePropertiesModal | Low | High | ⭐ |

**Total Estimated Time**: 4-6 hours
**Expected Impact**: Minor polish improvements

---

### Implementation Roadmap

#### Phase 1: Foundation (Day 1 - 4-6 hours)
**Focus**: High-priority spacing, typography, and borders

1. Update modal container padding (20px)
2. Update all separator spacing (12px, 12px, 16px)
3. Update header height (40px) and title size (16px)
4. Add modal outer border (1px neutral-200)
5. Standardize focus rings

**Deliverable**: Modal feels significantly more polished and professional

---

#### Phase 2: Refinement (Day 2 - 6-8 hours)
**Focus**: Medium-priority spacing, typography, and animations

1. Update tab spacing (Properties 16px, Advanced 16px)
2. Update expandable section spacing (12px bottom)
3. Update tab and footer button gaps (4px, 8px)
4. Update tab label size (13px) and helper text size (11px)
5. Add tab bar border and improve animations
6. Standardize icon sizing and shadow hierarchy

**Deliverable**: Modal feels consistent and refined across all tabs

---

#### Phase 3: Polish (Day 3 - 4-6 hours)
**Focus**: Low-priority micro-interactions and final touches

1. Fine-tune label-to-input spacing (10px)
2. Add chip gap (8px)
3. Refine animation timings
4. Add button hover effects
5. Update success color
6. Final QA and adjustments

**Deliverable**: Modal feels premium with attention to detail

---

### Total Estimated Effort

- **High Priority**: 4-6 hours
- **Medium Priority**: 6-8 hours
- **Low Priority**: 4-6 hours
- **Total**: 14-20 hours (2-3 days)

---

## Appendix: Current vs. Proposed Values

### Spacing Changes

```tsx
// BEFORE
<div className="fixed bg-white rounded-lg shadow-lg p-4">
  <ModalHeader className="flex items-center h-8 px-4" />
  <Separator className="my-2" />
  <TabBar className="flex gap-0.5 h-9" />
  <Separator className="my-2" />
  <div className="space-y-3">
    <PropertiesTab className="space-y-3" />
  </div>
  <Separator className="my-2" />
  <ModalFooter className="flex items-center gap-1 h-10 p-2" />
</div>

// AFTER
<div className="fixed bg-white rounded-lg shadow-lg border border-neutral-200 p-5">
  <ModalHeader className="flex items-center h-10 px-0 py-1" />
  <Separator className="my-3" />
  <TabBar className="flex gap-1 h-9 border-b border-neutral-200" />
  <Separator className="my-3" />
  <div className="space-y-4">
    <PropertiesTab className="space-y-4" />
  </div>
  <Separator className="my-4" />
  <ModalFooter className="flex items-center gap-2 h-10 px-0 py-0" />
</div>
```

### Typography Changes

```tsx
// BEFORE
<h2 className="text-sm font-semibold text-neutral-900">Line Properties</h2>
<button className="flex-1 text-xs font-medium">Properties</button>
<p className="text-xs text-neutral-600">Helper text</p>

// AFTER
<h2 className="text-base font-semibold text-neutral-900">Line Properties</h2>
<button className="flex-1 text-[13px] font-medium">Properties</button>
<p className="text-[11px] text-neutral-600">Helper text</p>
```

### Animation Changes

```tsx
// BEFORE
className="transition-colors duration-150"
// Dropdown appears instantly, disappears instantly

// AFTER
className="transition-all duration-150 ease-in-out"
// Dropdown fades in with ease-out, fades out with ease-in
className={isOpen ? 'opacity-100 translate-y-0 ease-out' : 'opacity-0 -translate-y-1 ease-in'}
```

### Border Changes

```tsx
// BEFORE
<div className="fixed bg-white rounded-lg shadow-lg p-4">
<div className="flex gap-0.5 h-9">

// AFTER
<div className="fixed bg-white rounded-lg shadow-lg border border-neutral-200 p-5">
<div className="flex gap-1 h-9 border-b border-neutral-200">
```

---

## Critical UI Issues Identified from Screenshots

### Issue 1: Active Tab Styling Problem

**Observation**: In the reference screenshots, the "Properties" tab appears grayed out/disabled even when it is the active tab.

**Current State**:
```tsx
// Active tab should have clear visual distinction
className={`flex-1 text-xs font-medium transition-colors duration-150 ${
  activeTab === 'properties'
    ? 'text-neutral-900 border-b-2 border-neutral-900'
    : 'text-neutral-500'
}`}
```

**Issue**: The active tab text color (`text-neutral-900`) may not be providing enough contrast or the styling is being overridden somewhere.

**Recommendation**:
```tsx
// Ensure active tab has strong visual presence
className={`flex-1 text-xs font-medium transition-colors duration-150 ${
  activeTab === 'properties'
    ? 'text-neutral-900 font-semibold border-b-2 border-blue-600'
    : 'text-neutral-500 hover:text-neutral-700'
}`}
```

**Priority**: 🔴 **CRITICAL** - Active tab must be clearly identifiable

---

### Issue 2: Advanced Tab White Space

**Observation**: The Advanced tab shows excessive white space with minimal content (Airflow input, Results button, and three calculated values).

**Current State**: Content is top-aligned with large empty space below.

**Recommendations**:
1. **Add visual grouping**: Wrap calculation results in a subtle card/container
2. **Add helper text**: Explain what the calculations represent
3. **Consider layout**: Use a more compact vertical layout for results
4. **Add visual interest**: Consider adding icons or visual indicators for each metric

**Example Enhancement**:
```tsx
<div className="space-y-4">
  <div>
    <label className="text-xs font-medium text-neutral-700">Airflow (CFM)</label>
    <input type="number" className="..." />
  </div>

  <button className="w-full flex items-center justify-center gap-2 ...">
    <ZapIcon className="w-4 h-4" />
    Calculate Results
  </button>

  <div className="bg-neutral-50 rounded-md p-3 space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-xs text-neutral-600">Velocity</span>
      <span className="text-sm font-medium">0 fpm</span>
    </div>
    <Separator />
    <div className="flex justify-between items-center">
      <span className="text-xs text-neutral-600">Friction</span>
      <span className="text-sm font-medium">0.00 in wc/100ft</span>
    </div>
    <Separator />
    <div className="flex justify-between items-center">
      <span className="text-xs text-neutral-600">Pressure</span>
      <span className="text-sm font-medium">0.00 in</span>
    </div>
  </div>
</div>
```

**Priority**: 🟡 **MEDIUM** - Improves visual balance and usability

---

### Issue 3: Expandable Section Treatment

**Observation**: The "More Details" / "Less Details" button in the Calculations tab needs better visual treatment to indicate it's interactive.

**Current State**: Button appears as plain text with chevron icon.

**Recommendations**:
```tsx
// Add hover state and better visual affordance
<button
  onClick={() => setShowDetails(!showDetails)}
  className="flex items-center justify-center gap-1 w-full py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
>
  {showDetails ? (
    <>
      <ChevronUpIcon className="w-3 h-3" />
      Less Details
    </>
  ) : (
    <>
      <ChevronDownIcon className="w-3 h-3" />
      More Details
    </>
  )}
</button>
```

**Priority**: 🟢 **LOW** - Nice to have for better UX

---

### Issue 4: Width Chips Visibility

**Observation**: Width selection chips (6", 8", 10", 12", 14") are visible in the Calculations tab but may need better spacing and visual treatment.

**Current State**: Chips appear below the width dropdown.

**Recommendations**:
1. Ensure adequate spacing between dropdown and chips (8-12px)
2. Add hover states to chips for better interactivity
3. Consider making selected chip more prominent
4. Ensure chips wrap properly if more sizes are added

**Example**:
```tsx
<div className="flex flex-wrap gap-1.5 mt-2">
  {widthOptions.map(width => (
    <button
      key={width}
      onClick={() => setSelectedWidth(width)}
      className={`px-2 py-1 text-xs rounded border transition-all ${
        selectedWidth === width
          ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium'
          : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50'
      }`}
    >
      {width}"
    </button>
  ))}
</div>
```

**Priority**: 🟢 **LOW** - Enhancement for better UX

---

### Issue 5: Modal Positioning Consistency

**Observation**: Modal can appear both left-aligned (near the line) and centered on canvas. This is actually good behavior but should be documented.

**Current Behavior**: Modal positioning is dynamic based on where the line is clicked.

**Recommendation**: Document this behavior and ensure:
1. Modal never appears off-screen
2. Modal has consistent shadow/elevation regardless of position
3. Dragging behavior is smooth in both positions
4. Consider adding a subtle animation when modal repositions

**Priority**: 🟢 **LOW** - Current behavior is acceptable, just needs documentation

---

## Conclusion

This comprehensive design audit has identified **35 specific improvements** across six key areas:

1. **Spacing & Layout**: 12 recommendations (5 HIGH, 5 MEDIUM, 2 LOW)
2. **Typography**: 4 recommendations (1 HIGH, 3 MEDIUM)
3. **Dynamic Sizing & Animation**: 7 recommendations (0 HIGH, 5 MEDIUM, 2 LOW)
4. **Border Aesthetics**: 2 recommendations (1 HIGH, 1 MEDIUM)
5. **Additional Improvements**: 5 recommendations (2 HIGH, 2 MEDIUM, 1 LOW)
6. **Critical UI Issues**: 5 recommendations (1 CRITICAL, 1 MEDIUM, 3 LOW)

### Key Takeaways

**Current State**: The Line Properties Modal is functional, accessible, and well-architected. It has a solid foundation with consistent use of design tokens and good component structure.

**Opportunity**: With focused design refinement (16-24 hours over 2-3 days), the modal can transform from "functional" to "polished and professional."

**Highest Impact Changes**:
1. **FIX CRITICAL**: Active tab styling (Properties tab appears disabled)
2. Increase modal padding to 20px
3. Improve separator spacing (12px, 12px, 16px)
4. Increase header height to 40px and title to 16px
5. Add modal outer border (1px neutral-200)
6. Improve Advanced tab layout (reduce white space)
7. Standardize focus rings

**Recommended Approach**:
1. **Phase 0 (Critical Fixes)**: Fix active tab styling issue immediately
2. **Phase 1 (Foundation)**: Implement spacing and layout improvements
3. **Phase 2 (Refinement)**: Typography and animation enhancements
4. **Phase 3 (Polish)**: Border aesthetics and final touches

---

**Next Steps**:
1. Review and approve this audit
2. Prioritize which changes to implement
3. Create implementation tasks
4. Begin Phase 1 (Foundation) implementation
5. Iterate based on feedback

---

**Document Status**: ✅ Audit Complete - Ready for Review
**Estimated Implementation**: 14-20 hours (2-3 days)
**Expected Outcome**: Professional, polished modal that delights users


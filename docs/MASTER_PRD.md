# HVAC Canvas - Master Product Requirements Document (PRD)

**Version:** 2.0  
**Date:** 2025-10-17  
**Status:** Active Development  
**Document Type:** Master PRD - Comprehensive Feature Specifications  
**Maintained By:** Product & Engineering Team

---

## Document Information

### Purpose
This Master PRD serves as the single source of truth for all HVAC Canvas features, providing atomic-level detail and eliminating all assumptions. Every implementation detail is explicitly documented to enable developers to implement features without seeking clarification.

### Scope
This document covers:
1. **Glassmorphism Design Theme Implementation** - Complete UI redesign with modern glass effects
2. **Line Properties Modal Enhancement** - Comprehensive property editor with HVAC calculations
3. **Future Features** - Placeholder for upcoming features

### Document Principles
- **Atomic-Level Detail**: Every specification is broken down to the smallest implementable unit
- **Zero Assumptions**: All implementation details are explicitly documented
- **Unambiguous**: Clear, precise language with no room for interpretation
- **Comprehensive**: Covers design, technical, accessibility, testing, and success criteria
- **Maintainable**: Structured for easy updates and cross-referencing

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Feature 1: Glassmorphism Design Theme](#feature-1-glassmorphism-design-theme)
3. [Feature 2: Line Properties Modal Enhancement](#feature-2-line-properties-modal-enhancement)
4. [Cross-Feature Dependencies](#cross-feature-dependencies)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Success Metrics](#success-metrics)
7. [Appendices](#appendices)

---

## Project Overview

### Application Context

**HVAC Canvas** is a professional CAD-style drawing application for HVAC duct design, built with React 18 + TypeScript.

**Current State:**
- **Total Files:** 59 organized files
- **Architecture Layers:** 7 distinct layers (Types → Constants → Utils → Services → Hooks → Components → App)
- **Test Coverage:** ~80% overall (176 unit tests + 29 E2E tests)
- **Bundle Size:** 161 KB JavaScript + 4.6 KB CSS
- **Build Time:** 676ms
- **Lines of Code:** ~8,000+ lines (excluding tests)

**Technology Stack:**
- React 18.2.0
- TypeScript 5.1.6
- Vite 4.4.5
- Tailwind CSS 3.3.3
- Vitest + Playwright
- PDF.js for PDF rendering

**Target Users:**
- HVAC designers and engineers
- Mechanical contractors
- Building design professionals
- Desktop/laptop/tablet users (no mobile version)

---

## Feature 1: Glassmorphism Design Theme

### 1.1 Executive Summary

**Feature Name:** Glassmorphism Design Theme Implementation  
**Priority:** HIGH  
**Estimated Effort:** 5 weeks (200 hours)  
**Target Release:** Q1 2026  
**Dependencies:** None (standalone feature)

**Description:**
Implement a modern glassmorphism design theme across the entire HVAC Canvas application using semi-transparent backgrounds with backdrop blur effects. This creates visual depth, enhances the professional aesthetic, and allows PDF backgrounds to subtly show through UI elements while maintaining WCAG 2.1 AA accessibility compliance.

**Key Benefits:**
- Modern aesthetic matching contemporary CAD software
- Clear visual hierarchy through layered glass effects
- Enhanced PDF integration with subtle background visibility
- Maintains drawing canvas as primary focal point
- Professional appeal for HVAC industry users

**Key Challenges:**
- Accessibility: Must maintain 4.5:1 contrast ratios
- Performance: `backdrop-filter` can impact rendering
- Browser compatibility: Safari requires `-webkit-` prefix
- Variable backgrounds: PDF content affects readability

---

### 1.2 Design Specifications

#### 1.2.1 Three-Tier Glass System

The glassmorphism implementation uses a three-tier system with varying opacity and blur levels:

**Tier 1: Primary UI (Sidebar, Bottom Bar)**
- **Purpose:** Persistent navigation and controls
- **Background Opacity:** 75% (`rgba(255, 255, 255, 0.75)`)
- **Backdrop Blur:** 12px
- **Saturation:** 150%
- **Border:** 1px solid `rgba(255, 255, 255, 0.3)`
- **Shadow:** `0 4px 24px rgba(0, 0, 0, 0.08)`
- **Z-Index:** 10
- **Visual Weight:** Lighter, recedes into background
- **Text Color:** `#0F172A` (neutral-900) for 15.8:1 contrast

**Tier 2: Floating Elements (Modals, Overlays)**
- **Purpose:** Contextual information and editing
- **Background Opacity:** 85% (`rgba(255, 255, 255, 0.85)`)
- **Backdrop Blur:** 10px
- **Saturation:** 160%
- **Border:** 1px solid `rgba(255, 255, 255, 0.4)`
- **Shadow:** Multi-layer:
  - `0 8px 32px rgba(0, 0, 0, 0.12)` (outer)
  - `0 2px 8px rgba(0, 0, 0, 0.08)` (mid)
  - `inset 0 1px 0 rgba(255, 255, 255, 0.6)` (highlight)
- **Z-Index:** 1000
- **Visual Weight:** Heavier, comes forward
- **Text Color:** `#0F172A` (neutral-900) for 13.8:1 contrast

**Tier 3: Interactive Controls (Buttons, Dropdowns, Inputs)**
- **Purpose:** Direct user interaction
- **Background Opacity:** 92% (`rgba(255, 255, 255, 0.92)`)
- **Backdrop Blur:** 6px (4px for inputs, 2px for text inputs)
- **Saturation:** 140%
- **Border:** 1px solid `rgba(203, 213, 225, 0.8)`
- **Shadow:** `0 2px 8px rgba(0, 0, 0, 0.06)`
- **Z-Index:** Varies by component
- **Visual Weight:** Solid, clear affordances
- **Text Color:** `#374151` (neutral-700) for 8.9:1 contrast

#### 1.2.2 CSS Implementation

**Base CSS Properties:**
```css
/* Tier 1: Primary UI */
.glass-tier1 {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

/* Tier 2: Floating Elements */
.glass-tier2 {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Tier 3: Interactive Controls */
.glass-tier3 {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);
  border: 1px solid rgba(203, 213, 225, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

**Browser Fallbacks:**
```css
/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(10px)) {
  .glass-tier1,
  .glass-tier2,
  .glass-tier3 {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

#### 1.2.3 Design Tokens

**File:** `src/constants/glass-tokens.ts`

```typescript
export const GLASS_TOKENS = {
  tier1: {
    background: 'rgba(255, 255, 255, 0.75)',
    border: 'rgba(255, 255, 255, 0.3)',
    blur: '12px',
    saturate: '150%',
    shadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    textColor: '#0F172A', // neutral-900
  },
  tier2: {
    background: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(255, 255, 255, 0.4)',
    blur: '10px',
    saturate: '160%',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    textColor: '#0F172A', // neutral-900
  },
  tier3: {
    background: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(203, 213, 225, 0.8)',
    blur: '6px',
    saturate: '140%',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    textColor: '#374151', // neutral-700
  },
} as const;

export type GlassTier = keyof typeof GLASS_TOKENS;
```

#### 1.2.4 Color Palette

**Primary Colors:**
- **White (Base):** `#FFFFFF` - Canvas background, solid elements
- **Neutral-900:** `#0F172A` - Primary text (15.8:1 contrast on white)
- **Neutral-700:** `#374151` - Secondary text (8.9:1 contrast on white)
- **Neutral-600:** `#475569` - Tertiary text (7:1 contrast on white)
- **Neutral-500:** `#64748B` - Disabled text (4.6:1 contrast on white)
- **Neutral-200:** `#E2E8F0` - Borders, separators
- **Neutral-50:** `#F8FAFC` - Subtle backgrounds

**Accent Colors:**
- **Blue-600:** `#2563EB` - Primary actions, supply ducts
- **Blue-500:** `#3B82F6` - Focus states
- **Red-600:** `#DC2626` - Danger actions, return ducts
- **Amber-600:** `#D97706` - Warnings
- **Green-700:** `#15803D` - Success states (5.2:1 contrast)

**Glass-Specific Colors:**
- **Glass Background (Tier 1):** `rgba(255, 255, 255, 0.75)`
- **Glass Background (Tier 2):** `rgba(255, 255, 255, 0.85)`
- **Glass Background (Tier 3):** `rgba(255, 255, 255, 0.92)`
- **Glass Border (Tier 1):** `rgba(255, 255, 255, 0.3)`
- **Glass Border (Tier 2):** `rgba(255, 255, 255, 0.4)`
- **Glass Border (Tier 3):** `rgba(203, 213, 225, 0.8)`

---

### 1.3 Component-by-Component Implementation

#### 1.3.1 Sidebar Component

**File:** `src/components/Sidebar/Sidebar.tsx`

**Current Styles:**
```css
.sidebar {
  background: #FFFFFF;
  border-left: 1px solid #E2E8F0;
  width: 320px;
  height: 100vh;
}
```

**New Glassmorphism Styles:**
```css
.sidebar {
  /* Glass effect - Tier 1 */
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  
  /* Enhanced border for definition */
  border-left: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
  
  /* Dimensions */
  width: 320px;
  height: 100vh;
  
  /* Ensure text readability */
  color: #0F172A; /* neutral-900 for maximum contrast */
}

.sidebar-header {
  /* Slightly more opaque for header */
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  padding: 16px;
}
```

**Accessibility Requirements:**
- Text color: `#0F172A` (neutral-900) provides 15.8:1 contrast on glass background
- Table text: Maintain current font sizes (14px body, 12px labels)
- Borders: Increase opacity to 0.8 for better definition
- Focus states: Maintain current blue focus rings (`#3B82F6`)

**States:**
- **Default:** Glass effect as specified
- **Hover (interactive elements):** Slight brightness increase (`rgba(248, 250, 252, 0.8)`)
- **Focus:** Blue focus ring (`2px solid #3B82F6` with `2px offset`)
- **With PDF:** Glass allows PDF to show through subtly
- **Without PDF:** Glass on white canvas creates subtle depth

**Performance Optimization:**
```css
.sidebar {
  /* GPU acceleration */
  transform: translateZ(0);
  will-change: auto; /* Only use will-change during animations */
}
```

**Testing Requirements:**
- Visual regression test: Compare before/after screenshots
- Accessibility audit: Verify 15.8:1 contrast ratio with automated tools
- Performance test: Measure render time (target: <5ms)
- Cross-browser test: Chrome, Firefox, Safari, Edge
- PDF interaction test: Verify readability with various PDF backgrounds



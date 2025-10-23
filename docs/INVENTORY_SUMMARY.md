# HVAC Canvas - Architectural Inventory Summary

**Generated:** 2025-10-19  
**Status:** Complete Reference Documentation  
**Purpose:** Quick reference guide for the entire application architecture

---

## 📋 Quick Navigation

This inventory consists of four comprehensive documents:

1. **ARCHITECTURE_INVENTORY.md** - Complete architectural overview
   - Application structure and entry points
   - Component hierarchy and relationships
   - UI elements catalog with props and styling
   - Data flow patterns and state management
   - Dependencies and imports
   - Styling system (Neumorphism + Glassmorphism)
   - Key patterns and conventions
   - Architecture layers (7-layer system)

2. **COMPONENT_REFERENCE.md** - Detailed component and service reference
   - All components with props, state, and features
   - All custom hooks with return values and usage
   - All services with function signatures
   - All utilities with descriptions
   - Type definitions and constants
   - Design tokens and styling classes
   - Testing information

3. **DATA_FLOW_AND_DEPENDENCIES.md** - Data flow and dependency documentation
   - Drawing workflow (click-click interaction)
   - Selection and modal workflow
   - Viewport zoom workflow
   - Snap detection workflow
   - State management architecture
   - Complete dependency graph
   - Import chains with examples
   - External dependencies
   - Callback chains and event handlers
   - Rendering pipeline
   - Performance considerations

4. **INVENTORY_SUMMARY.md** - This document
   - Quick reference and navigation
   - Key statistics
   - Common tasks and where to find them
   - Glossary of terms

---

## 📊 Key Statistics

### Codebase Metrics
- **Total Files:** 59 organized files
- **Architecture Layers:** 7 distinct layers
- **Components:** 10+ UI components
- **Custom Hooks:** 9 hooks
- **Services:** 6 service modules
- **Utilities:** 20+ utility functions
- **Type Definitions:** 8 type files
- **Constants:** 8 constant files
- **CSS Files:** 3 stylesheets

### Code Quality
- **Test Coverage:** ~80% overall
- **Unit Tests:** 176 tests
- **E2E Tests:** 29 tests
- **Lines of Code:** ~8,000+ (excluding tests)
- **Bundle Size:** 161 KB JavaScript + 4.6 KB CSS
- **Build Time:** 676ms

### Architecture
- **Layers:** Types → Constants → Utils → Services → Hooks → Components → App
- **State Management:** Local state + custom hooks (no Redux/Context)
- **Styling:** Tailwind CSS + CSS custom properties + Neumorphism
- **Testing:** Vitest + React Testing Library + Playwright

---

## 🔍 Finding What You Need

### I need to understand...

**How the application starts**
→ See: ARCHITECTURE_INVENTORY.md § A (Entry Points)
→ Files: `src/main.tsx`, `src/App.tsx`, `src/DrawingCanvas.tsx`

**How components are organized**
→ See: ARCHITECTURE_INVENTORY.md § B (Component Hierarchy)
→ See: COMPONENT_REFERENCE.md § Components
→ Files: `src/components/DrawingCanvas/`, `src/components/LinePropertiesModal/`

**How drawing works**
→ See: DATA_FLOW_AND_DEPENDENCIES.md § A.1 (Drawing Workflow)
→ See: COMPONENT_REFERENCE.md § Services (DrawingService, HitTestService)
→ Files: `src/services/drawing/`, `src/hooks/useDrawingState.ts`

**How selection and modal work**
→ See: DATA_FLOW_AND_DEPENDENCIES.md § A.2 (Selection & Modal Workflow)
→ See: COMPONENT_REFERENCE.md § LinePropertiesModal
→ Files: `src/components/LinePropertiesModal/`, `src/hooks/useLineStore.ts`

**How viewport zoom/pan works**
→ See: DATA_FLOW_AND_DEPENDENCIES.md § A.3 (Viewport Zoom Workflow)
→ See: COMPONENT_REFERENCE.md § useViewportTransform
→ Files: `src/hooks/useViewportTransform.ts`, `src/services/viewport/`

**How snap detection works**
→ See: DATA_FLOW_AND_DEPENDENCIES.md § A.4 (Snap Detection Workflow)
→ See: COMPONENT_REFERENCE.md § Services (HitTestService)
→ Files: `src/utils/snap/`, `src/services/drawing/HitTestService.ts`

**How state flows through the app**
→ See: DATA_FLOW_AND_DEPENDENCIES.md § B (State Management Architecture)
→ See: ARCHITECTURE_INVENTORY.md § D (Data Flow Architecture)
→ Files: `src/DrawingCanvas.tsx` (root state)

**What dependencies exist**
→ See: DATA_FLOW_AND_DEPENDENCIES.md § C (Dependency Graph)
→ See: DATA_FLOW_AND_DEPENDENCIES.md § D (Import Chains)
→ Files: `package.json`, `src/types/`, `src/constants/`

**How styling works**
→ See: ARCHITECTURE_INVENTORY.md § F (Styling System)
→ See: COMPONENT_REFERENCE.md § Styling Classes
→ Files: `src/styles/`, `src/constants/design-tokens.ts`

**How to add a new component**
→ See: ARCHITECTURE_INVENTORY.md § G (Key Patterns & Conventions)
→ See: COMPONENT_REFERENCE.md § Components
→ Pattern: Create in `src/components/{Feature}/`, export from `index.ts`

**How to add a new service**
→ See: ARCHITECTURE_INVENTORY.md § H (Architecture Layers)
→ See: COMPONENT_REFERENCE.md § Services
→ Pattern: Create in `src/services/{Domain}/`, export from `index.ts`

**How to add a new hook**
→ See: ARCHITECTURE_INVENTORY.md § H (Architecture Layers)
→ See: COMPONENT_REFERENCE.md § Custom Hooks
→ Pattern: Create in `src/hooks/`, export from `index.ts`

**How to add a new utility**
→ See: ARCHITECTURE_INVENTORY.md § H (Architecture Layers)
→ See: COMPONENT_REFERENCE.md § Utilities
→ Pattern: Create in `src/utils/{Domain}/`, export from `index.ts`

**How to add a new type**
→ See: ARCHITECTURE_INVENTORY.md § H (Architecture Layers)
→ See: COMPONENT_REFERENCE.md § Type Definitions
→ Pattern: Add to `src/types/{domain}.types.ts`, export from `index.ts`

**How to add a new constant**
→ See: ARCHITECTURE_INVENTORY.md § H (Architecture Layers)
→ See: COMPONENT_REFERENCE.md § Constants
→ Pattern: Add to `src/constants/{domain}.constants.ts`, export from `index.ts`

---

## 🎯 Common Tasks

### Task: Add a new UI component
1. Create file in `src/components/{Feature}/{ComponentName}.tsx`
2. Define props interface
3. Implement component with JSDoc comments
4. Add to `src/components/{Feature}/index.ts` barrel export
5. Import and use in parent component
6. Add tests in `src/components/{Feature}/__tests__/`

### Task: Add a new hook
1. Create file in `src/hooks/use{HookName}.ts`
2. Define return interface
3. Implement hook with JSDoc comments
4. Add to `src/hooks/index.ts` barrel export
5. Use in components or other hooks
6. Add tests in `src/hooks/__tests__/`

### Task: Add a new service
1. Create file in `src/services/{domain}/{ServiceName}.ts`
2. Define function signatures with JSDoc
3. Implement using utilities and types
4. Add to `src/services/{domain}/index.ts` barrel export
5. Add to `src/services/index.ts` main barrel export
6. Use in hooks or other services
7. Add tests in `src/services/__tests__/`

### Task: Add a new utility
1. Create file in `src/utils/{domain}/{utilityName}.ts`
2. Define pure functions with JSDoc
3. Add to `src/utils/{domain}/index.ts` barrel export
4. Add to `src/utils/index.ts` main barrel export
5. Use in services or other utilities
6. Add tests in `src/utils/__tests__/`

### Task: Add a new type
1. Add to appropriate file in `src/types/{domain}.types.ts`
2. Add JSDoc comments
3. Add to `src/types/index.ts` barrel export
4. Use in components, hooks, services

### Task: Add a new constant
1. Add to appropriate file in `src/constants/{domain}.constants.ts`
2. Add JSDoc comments
3. Add to `src/constants/index.ts` barrel export
4. Use in components, hooks, services

### Task: Add keyboard shortcut
1. Add handler to `useKeyboardShortcuts` hook
2. Update keyboard shortcut list in documentation
3. Add tests for new shortcut
4. Update UI labels/titles with shortcut hint

### Task: Add new scale option
1. Add to `SCALE_OPTIONS` in `src/constants/scale.constants.ts`
2. Update scale selector in BottomBar
3. Add tests for new scale
4. Update documentation

---

## 📚 Glossary

### Architecture Terms
- **7-Layer Architecture** - Types → Constants → Utils → Services → Hooks → Components → App
- **Barrel Export** - `index.ts` file that re-exports all module exports
- **Composition** - Building complex components from simpler ones
- **Dependency Injection** - Passing dependencies as props rather than importing directly
- **Immutability** - Not modifying data in place; returning new data instead
- **Separation of Concerns** - Each layer has a single, well-defined responsibility

### Component Terms
- **FAB** - Floating Action Button (DrawButton)
- **Modal** - Dialog box for editing line properties
- **Sidebar** - Collapsible panel showing line summary
- **BottomBar** - Fixed bottom control bar with zoom and scale
- **CanvasRenderer** - Canvas element with event handlers
- **HUD** - Heads-Up Display (replaced by LinePropertiesModal)

### State Terms
- **Drawing Phase** - Current drawing state (idle, waiting-for-end)
- **Viewport Transform** - Zoom scale and pan offset
- **Snap Target** - Point where drawing will snap to
- **Line Collection** - Array of all lines on canvas
- **Selection** - Currently selected line IDs

### Styling Terms
- **Neumorphism** - Soft UI design with dual shadows (current)
- **Glassmorphism** - Glass effect with blur and transparency (available)
- **Design Tokens** - Centralized design values (colors, spacing, typography)
- **CSS Custom Properties** - CSS variables for dynamic theming
- **Tailwind CSS** - Utility-first CSS framework

### Testing Terms
- **Unit Test** - Tests individual functions/components in isolation
- **Component Test** - Tests React components with React Testing Library
- **E2E Test** - Tests complete user workflows with Playwright
- **Coverage** - Percentage of code executed by tests
- **Mock** - Fake implementation for testing purposes

---

## 🔗 Related Documentation

### Architecture & Design
- `docs/ARCHITECTURE.md` - System architecture overview
- `docs/MODULE_GUIDELINES.md` - Module organization rules
- `docs/CURRENT_CODEBASE_SPECS.md` - Complete codebase specifications
- `docs/adrs/` - Architecture Decision Records

### Design System
- `docs/DESIGN_STUDY.md` - Comprehensive design study
- `docs/GLASSMORPHISM_DESIGN_PROPOSAL.md` - Glassmorphism proposal
- `docs/NEUMORPHISM_IMPLEMENTATION_COMPLETE.md` - Neumorphism implementation
- `docs/LINE_PROPERTIES_MODAL_DESIGN_AUDIT.md` - Modal design audit

### Implementation Guides
- `docs/DESIGN_IMPLEMENTATION_GUIDE.md` - Implementation guide
- `docs/DESIGN_MIGRATION_GUIDE.md` - Migration guide
- `docs/DESIGN_QUICK_REFERENCE.md` - Quick reference

### Phase Reports
- `docs/phases/` - Phase completion reports
- `docs/FINAL_COMPLETION_REPORT.md` - Final completion report

---

## ✅ Checklist for New Developers

- [ ] Read ARCHITECTURE_INVENTORY.md for overview
- [ ] Read COMPONENT_REFERENCE.md for component details
- [ ] Read DATA_FLOW_AND_DEPENDENCIES.md for data flow
- [ ] Understand 7-layer architecture
- [ ] Understand component hierarchy
- [ ] Understand state management approach
- [ ] Understand styling system (Neumorphism)
- [ ] Review existing components and patterns
- [ ] Review existing tests
- [ ] Set up development environment
- [ ] Run tests locally
- [ ] Build and test application

---

## 🚀 Next Steps

### For Glassmorphism Implementation
1. Review `docs/GLASSMORPHISM_DESIGN_PROPOSAL.md`
2. Update CSS imports in `src/main.tsx`
3. Replace neumorphism classes with glass classes
4. Test accessibility features
5. Verify browser support
6. Update documentation

### For New Features
1. Identify which layer(s) need changes
2. Follow naming conventions and patterns
3. Add types first (Layer 1)
4. Add constants if needed (Layer 2)
5. Add utilities if needed (Layer 3)
6. Add services if needed (Layer 4)
7. Add hooks if needed (Layer 5)
8. Add components (Layer 6)
9. Write tests for each layer
10. Update documentation

### For Bug Fixes
1. Identify affected layer(s)
2. Write failing test first
3. Fix the bug
4. Verify test passes
5. Check for downstream impacts
6. Update documentation if needed

---

## 📞 Support

For questions about:
- **Architecture** → See ARCHITECTURE_INVENTORY.md
- **Components** → See COMPONENT_REFERENCE.md
- **Data Flow** → See DATA_FLOW_AND_DEPENDENCIES.md
- **Patterns** → See ARCHITECTURE_INVENTORY.md § G
- **Styling** → See ARCHITECTURE_INVENTORY.md § F
- **Testing** → See COMPONENT_REFERENCE.md § Testing

---

**Last Updated:** 2025-10-19  
**Version:** 2.0 (Post-Refactoring)  
**Status:** Complete and Current


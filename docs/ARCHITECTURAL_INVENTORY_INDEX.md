# HVAC Canvas - Architectural Inventory Index

**Generated:** 2025-10-19  
**Purpose:** Master index for all architectural documentation  
**Status:** Complete Reference Suite

---

## 📖 Documentation Suite

This comprehensive architectural inventory consists of **8 detailed documents** providing complete coverage of the HVAC Canvas application, including a completeness audit and sub-component reference:

### 1. ARCHITECTURE_INVENTORY.md (Main Reference)
**Comprehensive architectural overview of the entire application**

**Sections:**
- A. Application Structure Overview
  - Entry points (main.tsx, App.tsx, DrawingCanvas.tsx)
  - Routing structure (single-page app)
  - Core feature areas (drawing, viewport, properties, UI, PDF)

- B. Component Hierarchy
  - Root component tree with full nesting
  - Shared components across features
  - Component organization in filesystem

- C. UI Elements Catalog
  - DrawButton (FAB for draw mode)
  - Sidebar (line summary panel)
  - BottomBar (zoom and scale controls)
  - CanvasRenderer (canvas element wrapper)
  - LinePropertiesModal (floating modal for editing)

- D. Data Flow Architecture
  - State management approach (local + hooks, no Redux)
  - State hierarchy and props flow
  - Data flow patterns (drawing, selection, viewport, modal)

- E. Dependencies & Imports
  - External libraries (React, TypeScript, Vite, Tailwind, Lucide, etc.)
  - Internal utilities (geometry, canvas, snap, scale, ID)
  - Shared types and constants

- F. Styling System
  - Styling approach (Tailwind + CSS custom properties)
  - CSS files (styles.css, typography.css, neumorphism.css, glassmorphism.css)
  - Design system (Neumorphism current, Glassmorphism available)
  - Accessibility features

- G. Key Patterns & Conventions
  - Naming conventions (PascalCase, camelCase, UPPER_SNAKE_CASE)
  - File organization patterns
  - Architectural patterns (7-layer, composition, immutability)
  - Testing patterns

- H. Architecture Layers
  - Layer 1: Types (foundation)
  - Layer 2: Constants (configuration)
  - Layer 3: Utils (pure functions)
  - Layer 4: Services (domain logic)
  - Layer 5: Hooks (stateful logic)
  - Layer 6: Components (UI)
  - Layer 7: App (root)

- I. Key Metrics
  - 59 organized files
  - 7 architecture layers
  - ~80% test coverage
  - 161 KB JavaScript + 4.6 KB CSS

---

### 2. COMPONENT_REFERENCE.md (Detailed Reference)
**Complete reference for all components, hooks, services, and utilities**

**Sections:**
- Components (10+ UI components with props, state, features)
  - DrawingCanvas, CanvasRenderer, DrawButton, Sidebar, BottomBar, LinePropertiesModal

- Custom Hooks (9 hooks with return values and usage)
  - useDrawingState, useViewportTransform, useCanvasSetup, useKeyboardShortcuts
  - useLineStore, useModalPosition, useModalAnimation, useModalDrag, useModalKeyboard

- Services (6 service modules with function signatures)
  - Drawing Services (DrawingService, LineManager, HitTestService, CanvasRenderService)
  - Viewport Services (ViewportService)
  - Line Services (LinePropertiesService)

- Utilities (20+ utility functions)
  - Geometry, Canvas, Snap, Scale, ID utilities

- Type Definitions (core types)
  - Pt, Line, DrawingPhase, ViewportTransform, SnapTarget, Scale, ModalTab

- Constants (configuration values)
  - Canvas, Snap, Modal, Duct constants

- Design Tokens (colors, typography, spacing, shadows)

- Styling Classes (Neumorphism and Glassmorphism)

- Testing (test files, coverage, frameworks)

---

### 3. DATA_FLOW_AND_DEPENDENCIES.md (Flow & Dependencies)
**Complete documentation of data flow and all dependencies**

**Sections:**
- A. Data Flow Patterns (4 main workflows)
  - Drawing workflow (click-click interaction)
  - Selection & modal workflow
  - Viewport zoom workflow
  - Snap detection workflow

- B. State Management Architecture
  - Root state in DrawingCanvas
  - Props flow from root to children
  - State colocalization principle

- C. Dependency Graph
  - Layer dependencies (7-layer flow)
  - Component dependencies (tree structure)
  - Service dependencies (orchestration)
  - Hook dependencies (state management)

- D. Import Chains (with examples)
  - Drawing a line (complete import chain)
  - Selecting a line (complete import chain)

- E. External Dependencies
  - React ecosystem (React, React DOM, Vite plugin)
  - Development tools (TypeScript, Vitest, Playwright)
  - UI & Styling (Tailwind, Lucide, PostCSS)
  - PDF support (pdfjs-dist)
  - Utilities (@types packages)

- F. Callback Chains
  - Drawing completion
  - Line update
  - Batch update

- G. Event Handler Flow
  - Pointer events (down, move, up)
  - Keyboard events (D, Escape, Delete, brackets, +/-, 0)
  - Wheel events (zoom vs pan)

- H. Rendering Pipeline
  - Canvas render cycle with useEffect
  - Dependency array explanation
  - Performance considerations

- I. Performance Considerations
  - Memoization strategies
  - Optimization techniques
  - Potential bottlenecks

- J. Testing Dependencies
  - Unit test imports
  - E2E test imports
  - Mock patterns

---

### 4. INVENTORY_SUMMARY.md (Quick Reference)
**Quick reference guide and navigation for the entire inventory**

**Sections:**
- Quick Navigation (links to all documents)
- Key Statistics (metrics and code quality)
- Finding What You Need (30+ common questions with answers)
- Common Tasks (step-by-step guides for 10+ tasks)
- Glossary (architecture, component, state, styling, testing terms)
- Related Documentation (links to other docs)
- Checklist for New Developers
- Next Steps (for glassmorphism, new features, bug fixes)
- Support (where to find answers)

---

### 5. COMPLETENESS_AUDIT_REPORT.md (Audit Findings) ⭐ NEW
**Comprehensive completeness audit of the inventory**

**Sections:**
- Executive Summary (95%+ coverage achieved)
- Gaps Identified (HIGH/MEDIUM/LOW priority)
  - LinePropertiesModal sub-components (28 items)
  - PDF utilities (1 module)
  - All other categories: 100% documented
- Priority Matrix (actionable recommendations)
- Accuracy Verification (100% verified)
- Conclusion (production-ready inventory)

---

### 6. LINEPROPERTIES_SUBCOMPONENTS_REFERENCE.md (Sub-Components) ⭐ NEW
**Detailed reference for all LinePropertiesModal sub-components**

**Sections:**
- Component Hierarchy (31 sub-components organized by tab)
- PropertiesTab Sub-Components (8 components)
- CalculationsTab Sub-Components (4 components)
- AdvancedTab Sub-Components (6 components)
- Shared Components (10 reusable components)
- MultiSelect Components (5 components)
- Integration Notes (styling, testing, imports)

---

### 7. AUDIT_SUMMARY_AND_NEXT_STEPS.md (Action Plan) ⭐ NEW
**Audit summary with actionable next steps**

**Sections:**
- Audit Results Summary (95%+ coverage)
- Gap Analysis Summary (HIGH/MEDIUM priority)
- Documents Created/Updated
- Recommendations (immediate and follow-up actions)
- Key Findings (strengths and enhancement areas)
- Impact on Glassmorphism Implementation
- Verification Checklist
- Conclusion (ready to proceed)

---

## 🎯 How to Use This Inventory

### For Understanding the Architecture
1. Start with **INVENTORY_SUMMARY.md** for overview
2. Read **ARCHITECTURE_INVENTORY.md** for complete architecture
3. Reference **COMPONENT_REFERENCE.md** for specific components
4. Consult **DATA_FLOW_AND_DEPENDENCIES.md** for data flow
5. Review **LINEPROPERTIES_SUBCOMPONENTS_REFERENCE.md** for modal details

### For Finding Specific Information
1. Use **INVENTORY_SUMMARY.md** § "Finding What You Need"
2. Search for component/hook/service name in **COMPONENT_REFERENCE.md**
3. Look up sub-components in **LINEPROPERTIES_SUBCOMPONENTS_REFERENCE.md**
4. Look up data flow in **DATA_FLOW_AND_DEPENDENCIES.md**
5. Check patterns in **ARCHITECTURE_INVENTORY.md** § G

### For Understanding Audit Results
1. Read **AUDIT_SUMMARY_AND_NEXT_STEPS.md** for overview
2. Review **COMPLETENESS_AUDIT_REPORT.md** for detailed findings
3. Check **LINEPROPERTIES_SUBCOMPONENTS_REFERENCE.md** for gap details

### For Adding New Code
1. Review **ARCHITECTURE_INVENTORY.md** § G (Patterns & Conventions)
2. Check **INVENTORY_SUMMARY.md** § "Common Tasks"
3. Follow naming conventions and file organization
4. Reference similar existing code
5. Add tests following existing patterns
6. Update relevant inventory documents

### For Debugging
1. Trace data flow in **DATA_FLOW_AND_DEPENDENCIES.md**
2. Check component props in **COMPONENT_REFERENCE.md**
3. Review event handlers in **DATA_FLOW_AND_DEPENDENCIES.md** § G
4. Check dependencies in **DATA_FLOW_AND_DEPENDENCIES.md** § C

### For Implementing Glassmorphism
1. Review **ARCHITECTURE_INVENTORY.md** § F (Styling System)
2. Check **COMPONENT_REFERENCE.md** § Styling Classes
3. See **INVENTORY_SUMMARY.md** § "Implement glassmorphism theme"
4. Reference `docs/GLASSMORPHISM_DESIGN_PROPOSAL.md`

---

## 📊 Document Statistics

| Document | Sections | Topics | Lines |
|----------|----------|--------|-------|
| ARCHITECTURE_INVENTORY.md | 9 | 40+ | ~500 |
| COMPONENT_REFERENCE.md | 8 | 50+ | ~500 |
| DATA_FLOW_AND_DEPENDENCIES.md | 10 | 60+ | ~500 |
| INVENTORY_SUMMARY.md | 8 | 40+ | ~400 |
| **Total** | **35** | **190+** | **~1,900** |

---

## 🔍 Quick Reference Tables

### Components at a Glance
| Component | Purpose | Location | Props |
|-----------|---------|----------|-------|
| DrawingCanvas | Main orchestrator | src/DrawingCanvas.tsx | None (root) |
| CanvasRenderer | Canvas element | src/components/DrawingCanvas/ | canvasRef, containerRef, events |
| DrawButton | Draw mode toggle | src/components/DrawingCanvas/ | isActive, onToggle, sidebarWidth |
| Sidebar | Line summary | src/components/DrawingCanvas/ | collapsed, onToggle, lineSummary |
| BottomBar | Zoom controls | src/components/DrawingCanvas/ | zoom, onZoomIn/Out, scale options |
| LinePropertiesModal | Line editor | src/components/LinePropertiesModal/ | selectedLines, onUpdate, onClose |

### Hooks at a Glance
| Hook | Purpose | Returns |
|------|---------|---------|
| useDrawingState | Drawing state | phase, startPoint, endPoint, snapTarget |
| useViewportTransform | Zoom/pan state | scale, offset, transform, zoom/pan methods |
| useCanvasSetup | Canvas init | void (side effects only) |
| useKeyboardShortcuts | Keyboard events | void (side effects only) |
| useLineStore | Line collection | lines, selectedLineIds, line operations |
| useModalPosition | Modal position | position, isDragging, dragHandleProps |
| useModalAnimation | Modal animation | shouldRender, opacity, scale |
| useModalDrag | Modal drag | position, isDragging, dragHandleProps |
| useModalKeyboard | Modal keyboard | void (side effects only) |

### Services at a Glance
| Service | Domain | Purpose |
|---------|--------|---------|
| DrawingService | drawing | Line creation and validation |
| LineManager | drawing | Line collection CRUD |
| HitTestService | drawing | Hit testing and selection |
| CanvasRenderService | drawing | Canvas rendering |
| ViewportService | viewport | Zoom and pan calculations |
| LinePropertiesService | line | Line property management |

### Utilities at a Glance
| Utility | Domain | Purpose |
|---------|--------|---------|
| dist, getLineLength | geometry | Geometric calculations |
| setupHiDPICanvas, screenToCanvas | canvas | Canvas utilities |
| findSnapTarget, resolveSnapPoint | snap | Snap detection |
| pixelsToInches, formatLength | scale | Scale conversion |
| uid | id | Unique ID generation |

---

## 🚀 Getting Started

### Step 1: Understand the Architecture
- Read ARCHITECTURE_INVENTORY.md § A-H
- Understand 7-layer architecture
- Review component hierarchy

### Step 2: Learn the Components
- Read COMPONENT_REFERENCE.md § Components
- Review existing component code
- Understand props and state patterns

### Step 3: Understand Data Flow
- Read DATA_FLOW_AND_DEPENDENCIES.md § A-B
- Trace drawing workflow
- Trace selection workflow

### Step 4: Review Patterns
- Read ARCHITECTURE_INVENTORY.md § G
- Review naming conventions
- Review file organization

### Step 5: Start Contributing
- Use INVENTORY_SUMMARY.md § "Common Tasks"
- Follow existing patterns
- Write tests for new code

---

## 📚 Related Documentation

### Architecture & Design
- `docs/ARCHITECTURE.md` - System architecture
- `docs/MODULE_GUIDELINES.md` - Module organization
- `docs/CURRENT_CODEBASE_SPECS.md` - Codebase specifications
- `docs/adrs/` - Architecture Decision Records

### Design System
- `docs/DESIGN_STUDY.md` - Design study
- `docs/GLASSMORPHISM_DESIGN_PROPOSAL.md` - Glassmorphism proposal
- `docs/NEUMORPHISM_IMPLEMENTATION_COMPLETE.md` - Neumorphism implementation
- `docs/LINE_PROPERTIES_MODAL_DESIGN_AUDIT.md` - Modal design audit

### Implementation
- `docs/DESIGN_IMPLEMENTATION_GUIDE.md` - Implementation guide
- `docs/DESIGN_MIGRATION_GUIDE.md` - Migration guide
- `docs/DESIGN_QUICK_REFERENCE.md` - Quick reference

---

## ✅ Verification Checklist

This inventory is complete when:
- [ ] All 4 documents are created and linked
- [ ] All components are documented
- [ ] All hooks are documented
- [ ] All services are documented
- [ ] All utilities are documented
- [ ] All types are documented
- [ ] All constants are documented
- [ ] Data flow patterns are documented
- [ ] Dependency graph is complete
- [ ] Import chains are traced
- [ ] Styling system is documented
- [ ] Patterns and conventions are documented
- [ ] Quick reference tables are provided
- [ ] Navigation is clear and easy
- [ ] Examples are provided for common tasks

**Status:** ✅ COMPLETE

---

## 📝 Document Maintenance

### When to Update
- When adding new components
- When adding new hooks
- When adding new services
- When changing architecture
- When updating styling system
- When changing naming conventions

### How to Update
1. Update relevant document section
2. Update quick reference tables
3. Update INVENTORY_SUMMARY.md
4. Update related documentation
5. Verify all links still work

### Version History
- **v2.0** (2025-10-19) - Complete architectural inventory
- **v1.0** (2025-10-16) - Initial architecture documentation

---

**Last Updated:** 2025-10-19  
**Version:** 2.0  
**Status:** Complete and Current  
**Maintainer:** Development Team


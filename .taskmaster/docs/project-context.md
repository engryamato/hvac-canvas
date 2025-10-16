# HVAC Canvas - Project Context for Task Master AI

## Project Overview

**HVAC Canvas** is a professional CAD-style drawing application for HVAC duct design, built with React 18 + TypeScript. The application has been fully refactored from a monolithic 1,228-line component into a modular, well-tested architecture.

### Key Metrics
- **Total Files:** 59 organized files
- **Architecture Layers:** 7 distinct layers
- **Test Coverage:** ~80% overall (176 unit tests + 29 E2E tests)
- **Bundle Size:** 161 KB JavaScript + 4.6 KB CSS
- **Build Time:** 676ms
- **Lines of Code:** ~8,000+ lines (excluding tests)
- **Status:** Production Ready (Core refactoring complete)

---

## Technology Stack

### Core Technologies
- **React:** 18.2.0
- **TypeScript:** 5.1.6 (strict mode)
- **Vite:** 4.5.0 (build tool)
- **Vitest:** 3.2.4 (unit testing)
- **Playwright:** 1.40.0 (E2E testing)

### Development Tools
- **ESLint:** Code quality
- **Prettier:** Code formatting
- **Docker:** Containerization
- **Git:** Version control

---

## Architecture

### Layered Architecture (Strict Dependency Flow)

```
┌─────────────────────────────────────────┐
│  Layer 7: Components (UI)               │  ← React components
├─────────────────────────────────────────┤
│  Layer 6: Hooks (State Management)      │  ← Custom React hooks
├─────────────────────────────────────────┤
│  Layer 5: Services (Domain Logic)       │  ← Business rules
├─────────────────────────────────────────┤
│  Layer 4: Utils (Pure Functions)        │  ← Calculations
├─────────────────────────────────────────┤
│  Layer 3: Constants (Configuration)     │  ← Static values
├─────────────────────────────────────────┤
│  Layer 2: Types (TypeScript Definitions)│  ← Data structures
└─────────────────────────────────────────┘
```

**Dependency Rules:**
- ✅ Each layer can ONLY import from layers below it
- ❌ No circular dependencies allowed
- ❌ No upward dependencies (e.g., Utils cannot import Services)

---

## Core Features

### Drawing Tools
- **Line Drawing:** Click-click or click-drag modes
- **Snap Detection:** Snap to endpoints, midpoints, and perpendiculars
- **Selection:** Click to select, multi-select with Shift/Ctrl
- **Editing:** Drag endpoints, edit width, delete lines
- **Undo/Redo:** Full history management

### Viewport Controls
- **Zoom:** Mouse wheel, pinch gestures, zoom buttons
- **Pan:** Click-drag canvas, arrow keys
- **Reset:** Return to default view
- **Grid:** Optional grid overlay

### PDF Integration
- **Upload:** Drag-drop or file picker
- **Background:** PDF renders behind drawings
- **Scale:** Automatic or manual scale setting
- **Export:** Save drawings with PDF background

### UI Components
- **Sidebar:** Tool selection, settings
- **Bottom Bar:** Zoom controls, scale display
- **HUD:** Width editor (being replaced by Line Properties Modal)
- **Modals:** Settings, help, confirmations

---

## Current Development Focus

### Line Properties Modal (In Progress)

**Status:** Phase 1 Complete (14/103 tasks - 13.6%)

**Goal:** Replace simple WidthHUD with comprehensive duct property editor

**Features:**
1. **Properties Tab:** Edit type, width, material, gauge, layer
2. **Calculations Tab:** Real-time HVAC calculations (velocity, friction, pressure)
3. **Advanced Tab:** Notes, tags, custom properties, timestamps
4. **Multi-Select:** Batch edit multiple ducts simultaneously

**Architecture:**
- 220px compact width
- Three-tab interface
- Smart positioning with 16px viewport clearance
- Draggable modal
- Backdrop dismissal
- Full accessibility (WCAG 2.1 Level AA)

**Progress:**
- ✅ Phase 1: Foundation Layer (types, constants) - COMPLETE
- 🚧 Phase 2: Utility Layer (calculations, positioning) - PENDING
- 🚧 Phase 3-13: Remaining phases - PENDING

---

## Project Structure

```
hvac-canvas/
├── src/
│   ├── components/          # UI components (Layer 7)
│   │   ├── Sidebar/
│   │   ├── BottomBar/
│   │   ├── WidthHUD/
│   │   └── LinePropertiesModal/  # 🚧 In Development
│   ├── hooks/               # Custom hooks (Layer 6)
│   │   ├── useDrawing.ts
│   │   ├── useSelection.ts
│   │   ├── useViewport.ts
│   │   └── useModalPosition.ts  # 🚧 Pending
│   ├── services/            # Business logic (Layer 5)
│   │   ├── drawing/
│   │   ├── selection/
│   │   ├── viewport/
│   │   └── line/            # 🚧 Pending
│   ├── utils/               # Pure functions (Layer 4)
│   │   ├── geometry/
│   │   ├── snap/
│   │   ├── viewport/
│   │   └── hvac/            # 🚧 Pending
│   ├── constants/           # Configuration (Layer 3)
│   │   ├── drawing.constants.ts
│   │   ├── duct.constants.ts     # ✅ Complete
│   │   └── modal.constants.ts    # ✅ Complete
│   ├── types/               # TypeScript types (Layer 2)
│   │   ├── drawing.types.ts      # ✅ Extended
│   │   ├── duct.types.ts         # ✅ Complete
│   │   └── modal.types.ts        # ✅ Complete
│   ├── App.tsx
│   ├── DrawingCanvas.tsx    # Main orchestration component
│   └── main.tsx
├── tests/
│   ├── unit/                # 176 unit tests
│   └── e2e/                 # 29 E2E tests
├── docs/
│   ├── ARCHITECTURE.md
│   ├── LINE_PROPERTIES_MODAL.md
│   ├── PROJECT_STATUS.md
│   └── CURRENT_CODEBASE_SPECS.md
├── .taskmaster/             # Task Master AI workspace
│   └── docs/
│       ├── prd.txt          # Product Requirements Document
│       └── project-context.md  # This file
├── package.json
├── vite.config.ts
└── README.md
```

---

## Development Guidelines

### Code Quality Standards
- **File Length:** ≤200 lines per module (except main orchestration components)
- **Test Coverage:** ≥80% overall
- **TypeScript:** Strict mode, no `any` types
- **ESLint:** Zero warnings
- **Bundle Size:** ≤176 KB
- **Build Time:** ≤773ms

### Testing Requirements
- **Unit Tests:** All utils, services, hooks
- **Component Tests:** All UI components
- **E2E Tests:** Critical user flows
- **Coverage:** ≥80% overall

### Architecture Rules
- Follow layered architecture strictly
- No circular dependencies
- Each layer imports only from layers below
- Pure functions in utils layer
- Business logic in services layer
- State management in hooks layer
- UI in components layer

---

## Key Documentation

### Architecture Decision Records (ADRs)
- ADR-001: Extract Types & Constants
- ADR-002: Extract Utility Functions
- ADR-003: Create Service Layer
- ADR-004: Extract Custom Hooks
- ADR-005: Extract UI Components
- ADR-006: Optimization & Polish

### Technical Documentation
- **ARCHITECTURE.md:** System architecture overview
- **DEPENDENCY_FLOW.md:** Dependency management
- **TESTING_STRATEGY.md:** Testing approach
- **LINE_PROPERTIES_MODAL.md:** Feature specification
- **CURRENT_CODEBASE_SPECS.md:** Complete codebase specs

### Project Documentation
- **PROJECT_STATUS.md:** Current status and metrics
- **PROJECT_SUMMARY.md:** Project overview
- **REFACTOR_SCORECARD.md:** Refactoring metrics
- **README.md:** Getting started guide

---

## Success Criteria

### Completed Criteria ✅
- ✅ Modular architecture with 59 files
- ✅ 176 unit tests passing (100% pass rate)
- ✅ ~80% code coverage
- ✅ 29/30 E2E tests passing (96.7%)
- ✅ Zero circular dependencies
- ✅ Bundle size within budget (161 KB)
- ✅ Build time within budget (676ms)
- ✅ Full TypeScript strict mode compliance

### In-Progress Criteria 🚧
- 🚧 Line Properties Modal (14/103 tasks complete)
- 🚧 30/30 E2E tests passing (1 test pending fix)

### Future Enhancements ⚪
- ⚪ CI/CD pipeline
- ⚪ Visual regression testing
- ⚪ Performance monitoring
- ⚪ Storybook component documentation

---

## Team & Workflow

### Development Workflow
1. **Feature Planning:** Create PRD and task breakdown
2. **Implementation:** Follow layered architecture
3. **Testing:** Write tests alongside code
4. **Review:** Code review and QA
5. **Documentation:** Update docs and ADRs
6. **Deployment:** Staging → Production

### Git Workflow
- **Main Branch:** Production-ready code
- **Feature Branches:** `feature/line-properties-modal`
- **Commit Messages:** Conventional commits
- **Pull Requests:** Required for all changes

---

## Next Steps

### Immediate Priorities
1. **Complete Phase 2:** Utility Layer (HVAC calculations, modal positioning)
2. **Complete Phase 3:** Service Layer (business logic)
3. **Build UI Components:** Phases 4-9
4. **Add Accessibility:** Phase 11
5. **Integration Testing:** Phase 12-13

### Short-Term Goals (1-2 weeks)
- Complete Line Properties Modal utility and service layers
- Build shared UI components
- Implement Properties Tab

### Medium-Term Goals (1-2 months)
- Complete all Line Properties Modal phases
- Achieve 100% E2E test pass rate
- Set up CI/CD pipeline

### Long-Term Goals (3-6 months)
- Add undo/redo functionality
- Implement export/import features
- Add collaboration features
- Mobile/tablet support

---

## Resources

### External Links
- **Notion Wireframes:** https://www.notion.so/Line-Properties-Modal-Wireframes-cad8bca63e5a413793a0dd2bb698f85f
- **ASHRAE Standards:** https://www.ashrae.org/
- **SMACNA Manual:** https://www.smacna.org/

### Internal Documentation
- All docs in `docs/` directory
- ADRs in `docs/adr/` directory
- Phase summaries in `docs/phases/` directory

---

## Contact & Support

### Project Owner
- **Name:** [Your Name]
- **Email:** [Your Email]
- **GitHub:** https://github.com/engryamato/hvac-canvas

### Repository
- **URL:** https://github.com/engryamato/hvac-canvas
- **Branch:** main
- **CI/CD:** Pending setup

---

**Last Updated:** 2025-10-16
**Document Version:** 1.0
**Status:** Active Development


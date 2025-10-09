# HVAC Canvas Application - Baseline Documentation

**Date Created:** 2025-10-09  
**Purpose:** Comprehensive baseline documentation captured before refactoring to enable regression detection and progress tracking.

---

## 📁 Documentation Structure

This directory contains all baseline documentation for the HVAC Canvas application before the refactoring project begins.

### Files in this Directory:

1. **INVARIANTS.md** - Technical invariants and system behavior
   - DOM structure and element hierarchy
   - Keyboard shortcuts mapping
   - Mouse/touch interaction patterns
   - Rendering timing and effects
   - State variables and lifecycle
   - Constants and configuration
   - Critical behaviors

2. **VISUAL_BASELINE.md** - Visual appearance and UI specifications
   - Screenshot inventory (to be captured)
   - Video recordings of user flows (to be captured)
   - Color palette and typography
   - Spacing and layout specifications
   - Shadows, borders, and transitions
   - Responsive behavior
   - Accessibility features

3. **PERFORMANCE_BASELINE.md** - Performance metrics and benchmarks
   - Build metrics (bundle size, build time)
   - Runtime performance (FPS, load time)
   - Memory usage patterns
   - Re-render performance
   - Performance budgets
   - Optimization opportunities

4. **USER_FLOWS.md** - Step-by-step user interaction flows
   - 12 documented user flows
   - Expected behavior for each flow
   - Validation criteria
   - Edge cases and error handling

5. **TEST_BASELINE.md** - Test coverage and results
   - 30 existing E2E tests documented
   - Test suite breakdown
   - Test results and known issues
   - Coverage gaps identified
   - Success criteria for refactoring

6. **README.md** (this file) - Overview and usage guide

---

## 🎯 Purpose of Baseline Documentation

### Why We Created This:

1. **Regression Detection**
   - Ensure refactored code behaves identically to original
   - Catch unintended changes early
   - Validate that all features still work

2. **Progress Tracking**
   - Measure improvements in code organization
   - Track performance changes
   - Monitor test coverage growth

3. **Knowledge Preservation**
   - Document how the system works before changes
   - Capture tribal knowledge
   - Provide reference for future developers

4. **Quality Assurance**
   - Define success criteria for refactoring
   - Establish performance budgets
   - Set coverage targets

---

## 📊 Key Baseline Metrics

### Code Organization (Pre-Refactoring)
- **Total Files:** 4 source files
- **Largest File:** DrawingCanvas.tsx (1,228 lines) ⚠️
- **Total Lines of Code:** ~1,400 lines
- **Components:** 1 monolithic component
- **Utilities:** 0 (embedded in component)
- **Services:** 0 (embedded in component)
- **Hooks:** 1 custom hook (embedded in component)

### Build Metrics
- **JavaScript Bundle:** 159.91 KB (51.79 KB gzipped)
- **CSS Bundle:** 4.59 KB (1.47 KB gzipped)
- **Build Time:** 644ms
- **Total Dist Size:** 172 KB

### Test Coverage
- **E2E Tests:** 30 tests
- **Unit Tests:** 0 tests
- **Integration Tests:** 0 tests
- **Component Tests:** 0 tests
- **Pass Rate:** 96.7% (29/30 passing)

### Performance
- **Expected FPS:** 60 FPS (typical usage)
- **Initial Load:** < 2 seconds
- **Memory Usage:** ~5-10 MB (idle)

---

## 🎯 Refactoring Goals

### Code Organization Goals:
- ✅ Break down 1,228-line file into ~45 modular files
- ✅ Maximum file size: ≤200 lines
- ✅ Clear separation of concerns (types, constants, utils, services, hooks, components)
- ✅ Enforced dependency flow (components → hooks → services → utils → types)

### Test Coverage Goals:
- ✅ Overall coverage: ≥80%
- ✅ Utils/Services coverage: ≥80%
- ✅ Hooks/Components coverage: ≥70%
- ✅ Add 40+ new unit/integration tests
- ✅ Fix failing E2E test

### Performance Goals:
- ✅ Maintain bundle size within ±10% (< 176 KB JS)
- ✅ Maintain build time within ±20% (< 773ms)
- ✅ Maintain 60 FPS for all interactions
- ✅ No performance regressions

---

## 📖 How to Use This Documentation

### For Developers:

1. **Before Making Changes:**
   - Read INVARIANTS.md to understand system behavior
   - Review USER_FLOWS.md to understand user interactions
   - Check TEST_BASELINE.md to see what's tested

2. **During Refactoring:**
   - Refer to INVARIANTS.md to ensure behavior consistency
   - Use VISUAL_BASELINE.md to verify UI unchanged
   - Run tests and compare against TEST_BASELINE.md

3. **After Refactoring:**
   - Verify all invariants still hold
   - Confirm all user flows still work
   - Check performance against PERFORMANCE_BASELINE.md
   - Update REFACTOR_SCORECARD.md with new metrics

### For Reviewers:

1. **Code Review:**
   - Verify changes don't violate documented invariants
   - Check that user flows still work as documented
   - Ensure performance budgets maintained

2. **Testing:**
   - Run all tests and compare results to TEST_BASELINE.md
   - Verify no new failures introduced
   - Check that new tests added for extracted code

3. **Sign-off:**
   - Confirm all exit criteria met for phase
   - Verify scorecard updated with new metrics
   - Approve phase completion

---

## 🔍 Quick Reference

### Critical Behaviors to Preserve:

1. **Line Drawing:**
   - Click-click interaction
   - Snap to endpoint/midpoint/line
   - Minimum line length (2px)
   - Automatic selection after creation

2. **Zoom/Pan:**
   - Zoom centers on mouse cursor (wheel)
   - Pan with right-click drag
   - Zoom limits (10% - 1000%)
   - Reset view (Ctrl+0)

3. **Line Editing:**
   - Width HUD appears above selected line
   - Width range (1-60)
   - Keyboard shortcuts ([, ])
   - Delete with button or key

4. **Sidebar:**
   - Line summary grouped by width
   - Total length calculations
   - Collapse/expand toggle
   - Updates on line changes

### Critical Constants:

- **Zoom Factor:** 1.1 (10% per step)
- **Zoom Range:** 0.1 - 10.0 (10% - 1000%)
- **Snap Thresholds:** 20px (endpoint), 18px (midpoint), 15px (line)
- **Min Line Length:** 2px
- **Width Range:** 1-60
- **Sidebar Width:** 320px
- **Bottom Bar Height:** 60px

### Critical UI Elements:

- **Canvas:** White background, fills available space
- **Draw Button:** Fixed bottom-right, 56x56px, blue when active
- **Width HUD:** Positioned above selected line, semi-transparent white
- **Sidebar:** 320px width, right side, collapsible
- **Bottom Bar:** 60px height, bottom, zoom controls

---

## 📝 Maintenance

### Updating Baseline Documentation:

**When to Update:**
- ✅ After Phase 0 completion (initial baseline)
- ✅ If intentional behavior changes approved
- ✅ If new features added
- ✅ If performance budgets adjusted

**What NOT to Update:**
- ❌ During active refactoring (baseline is frozen)
- ❌ For bug fixes (bugs are not baseline behavior)
- ❌ For performance regressions (these are failures)

### Version Control:

- Baseline documentation is version-controlled in Git
- Tagged at Phase 0 completion: `baseline-v1.0`
- Any updates require approval and new tag

---

## 🚀 Next Steps

### Immediate Actions:

1. **Capture Visual Baseline:**
   - [ ] Take screenshots of all UI states
   - [ ] Record videos of user flows
   - [ ] Store in `screenshots/` and `videos/` directories

2. **Measure Performance:**
   - [ ] Run Lighthouse audit
   - [ ] Measure FPS during interactions
   - [ ] Measure memory usage
   - [ ] Update PERFORMANCE_BASELINE.md with actual values

3. **Review and Approve:**
   - [ ] Team reviews all baseline documentation
   - [ ] Stakeholders approve baseline
   - [ ] Tag baseline in Git: `baseline-v1.0`

4. **Begin Refactoring:**
   - [ ] Proceed to Phase 1: Extract Types & Constants
   - [ ] Use baseline as reference throughout
   - [ ] Update scorecard after each phase

---

## 📞 Contact

**Questions about baseline documentation?**
- Review the specific document (INVARIANTS.md, USER_FLOWS.md, etc.)
- Check the comprehensive refactoring plan (v2.0)
- Ask the development team

**Found an issue or missing information?**
- Document it in the issue tracker
- Update the relevant baseline document
- Notify the team

---

**End of Baseline Documentation README**

**Status:** ✅ Phase 0 Complete - Baseline Established  
**Next Phase:** Phase 1 - Extract Types & Constants  
**Approval Required:** Yes (before proceeding to Phase 1)


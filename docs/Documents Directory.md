# HVAC Canvas Documentation Consolidated Index

## How to Use This Index
- Start with the executive and requirements sections to understand the product direction before diving into implementation details.
- Use the category sections below to jump directly to the documents that answer a specific question.
- Within each category, links point to the authoritative source; skim the summaries here, then read depth only where needed.

## Executive & Delivery Reports
- [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) – End-to-end recap of the enhancement program with scope, metrics, and completion details.
- [docs/FINAL_COMPLETION_REPORT.md](docs/FINAL_COMPLETION_REPORT.md) & [docs/FINAL_ENHANCEMENTS_REPORT.md](docs/FINAL_ENHANCEMENTS_REPORT.md) – Final sign-off plus inventory of post-project polish wins.
- [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) – Rolling status snapshot across phases with burndown context.
- [docs/IMPLEMENTATION_COMPLETE.md](docs/IMPLEMENTATION_COMPLETE.md) & [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) – Feature-by-feature closure notes for the core HVAC canvas build.
- [docs/OPTIONAL_ENHANCEMENTS_SUMMARY.md](docs/OPTIONAL_ENHANCEMENTS_SUMMARY.md) – Catalog of stretch goals and their disposition.

## Product Requirements & Professional Feedback
- [docs/MASTER_PRD.md](docs/MASTER_PRD.md) – Master product requirements document anchoring scope, personas, and success metrics.
- [PROFESSIONAL_ISSUES_DETAILED.md](PROFESSIONAL_ISSUES_DETAILED.md) – Field-critical gaps observed by a senior HVAC designer with severity assessments.
- [PROFESSIONAL_REVIEW_SUMMARY.md](PROFESSIONAL_REVIEW_SUMMARY.md), [PROFESSIONAL_REVIEW_COMPLETE.md](PROFESSIONAL_REVIEW_COMPLETE.md), [PROFESSIONAL_REVIEW_COMPLETE_SUMMARY.md](PROFESSIONAL_REVIEW_COMPLETE_SUMMARY.md), and [PROFESSIONAL_REVIEW_FINAL_VERDICT.md](PROFESSIONAL_REVIEW_FINAL_VERDICT.md) – Multi-stage professional review outcomes.
- [PROFESSIONAL_BETA_REVIEW.md](PROFESSIONAL_BETA_REVIEW.md) & [PROFESSIONAL_TECHNICAL_ASSESSMENT.md](PROFESSIONAL_TECHNICAL_ASSESSMENT.md) – Practitioner feedback on usability and technical readiness.
- [Error_Prevention_Protocol_Implementation_Rule__2025-10-18T20-21-46.md](Error_Prevention_Protocol_Implementation_Rule__2025-10-18T20-21-46.md) – Incident-avoidance rule set distilled from professional sessions.

## Architecture & Code Organization
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) – Layered architecture diagram, principles, and compliance metrics.
- [docs/CURRENT_CODEBASE_SPECS.md](docs/CURRENT_CODEBASE_SPECS.md) & [docs/DEPENDENCY_FLOW.md](docs/DEPENDENCY_FLOW.md) – Structural inventory plus allowed dependency directions.
- [docs/MODULE_GUIDELINES.md](docs/MODULE_GUIDELINES.md) – Design rules for components, hooks, services, utils, constants, and types.
- Architectural Decision Records under `docs/adrs/` – Six ADRs documenting key technical choices across layers.
- Directory-specific guidance in `src/components/README.md`, `src/hooks/README.md`, `src/services/README.md`, `src/utils/README.md`, `src/types/README.md`, and `src/constants/README.md`.
- Refactoring suite: [docs/REFACTORING_PLAN.md](docs/REFACTORING_PLAN.md), [docs/REFACTORING_ANALYSIS.md](docs/REFACTORING_ANALYSIS.md), [docs/REFACTORING_SUMMARY.md](docs/REFACTORING_SUMMARY.md), [docs/REFACTORING_COMPLETE_SUMMARY.md](docs/REFACTORING_COMPLETE_SUMMARY.md), and [docs/REFACTOR_SCORECARD.md](docs/REFACTOR_SCORECARD.md).

## Design & UX Specifications
- Core design guides: [docs/DESIGN_COMPONENT_SPECS.md](docs/DESIGN_COMPONENT_SPECS.md), [docs/DESIGN_IMPLEMENTATION_GUIDE.md](docs/DESIGN_IMPLEMENTATION_GUIDE.md), [docs/DESIGN_CHANGELOG.md](docs/DESIGN_CHANGELOG.md), [docs/DESIGN_STUDY.md](docs/DESIGN_STUDY.md).
- Quick guidance packs: [docs/DESIGN_QUICK_REFERENCE.md](docs/DESIGN_QUICK_REFERENCE.md), [docs/DESIGN_RECOMMENDATIONS_SUMMARY.md](docs/DESIGN_RECOMMENDATIONS_SUMMARY.md), [docs/DESIGN_VISUAL_COMPARISON.md](docs/DESIGN_VISUAL_COMPARISON.md).
- Glassmorphism initiative: [docs/GLASSMORPHISM_DESIGN_PROPOSAL.md](docs/GLASSMORPHISM_DESIGN_PROPOSAL.md), [docs/GLASSMORPHISM_IMPLEMENTATION_SUMMARY.md](docs/GLASSMORPHISM_IMPLEMENTATION_SUMMARY.md), [docs/GLASSMORPHISM_QUICK_SUMMARY.md](docs/GLASSMORPHISM_QUICK_SUMMARY.md).
- Layout and HUD work: [LAYOUT_FIX_APPLIED.md](LAYOUT_FIX_APPLIED.md), [docs/UI_LAYOUT_FIXES_2025-10-09.md](docs/UI_LAYOUT_FIXES_2025-10-09.md), [docs/HUD_NOT_SHOWING_FIX.md](docs/HUD_NOT_SHOWING_FIX.md), [docs/SCALE_FIX_COMPLETE_2025-10-09.md](docs/SCALE_FIX_COMPLETE_2025-10-09.md), [docs/SCALE_UPDATE_2025-10-09.md](docs/SCALE_UPDATE_2025-10-09.md).
- Line properties and editing: [docs/LINE_PROPERTIES_MODAL.md](docs/LINE_PROPERTIES_MODAL.md), [docs/LINE_PROPERTIES_MODAL_DESIGN_AUDIT.md](docs/LINE_PROPERTIES_MODAL_DESIGN_AUDIT.md), [docs/MOVEABLE_ENDPOINTS_2025-10-09.md](docs/MOVEABLE_ENDPOINTS_2025-10-09.md).
- Zoom & pan program: [docs/ZOOM_PAN_IMPLEMENTATION_PLAN.md](docs/ZOOM_PAN_IMPLEMENTATION_PLAN.md), [docs/ZOOM_PAN_FINAL_PLAN.md](docs/ZOOM_PAN_FINAL_PLAN.md), [docs/ZOOM_PAN_FINAL_SUMMARY.md](docs/ZOOM_PAN_FINAL_SUMMARY.md), [docs/ZOOM_PAN_TEST_REPORT.md](docs/ZOOM_PAN_TEST_REPORT.md), [docs/ZOOM_PAN_ANALYSIS_SUMMARY.md](docs/ZOOM_PAN_ANALYSIS_SUMMARY.md), [docs/ZOOM_PAN_RESEARCH_COMPLETE.md](docs/ZOOM_PAN_RESEARCH_COMPLETE.md), [docs/ZOOM_PAN_QUICK_REFERENCE.md](docs/ZOOM_PAN_QUICK_REFERENCE.md), [docs/ZOOM_PAN_COORDINATE_DIAGRAM.md](docs/ZOOM_PAN_COORDINATE_DIAGRAM.md).
- PDF onboarding: [docs/PDF_UPLOAD_BUTTON_2025-10-09.md](docs/PDF_UPLOAD_BUTTON_2025-10-09.md), [docs/PDF_RENDERING_COMPLETE_2025-10-09.md](docs/PDF_RENDERING_COMPLETE_2025-10-09.md), [docs/PDF_RENDERING_FIXES_2025-10-09.md](docs/PDF_RENDERING_FIXES_2025-10-09.md), [docs/BOTTOMBAR_PDF_CONTROLS_CONSOLIDATION_2025-10-09.md](docs/BOTTOMBAR_PDF_CONTROLS_CONSOLIDATION_2025-10-09.md).
- Bottombar redesign: [docs/BOTTOMBAR_REDESIGN_2025-10-09.md](docs/BOTTOMBAR_REDESIGN_2025-10-09.md) plus `docs/Bottombar-Implementation/` reports for implementation, verification, mockups, and bug fixes.
- Ancillary feature specs: [docs/HOVER_SNAP_IMPLEMENTATION_SUMMARY.md](docs/HOVER_SNAP_IMPLEMENTATION_SUMMARY.md), [docs/GLASSMORPHISM_DESIGN_PROPOSAL.md](docs/GLASSMORPHISM_DESIGN_PROPOSAL.md), [docs/OPTIONAL_ENHANCEMENTS_SUMMARY.md](docs/OPTIONAL_ENHANCEMENTS_SUMMARY.md).

## Feature & Enhancement Playbooks
- Beautification program: [BEAUTIFICATION_SUMMARY.md](BEAUTIFICATION_SUMMARY.md), [BEAUTIFICATION_FIX_SUMMARY.md](BEAUTIFICATION_FIX_SUMMARY.md), [BEAUTIFICATION_IMPLEMENTATION_COMPLETE.md](BEAUTIFICATION_IMPLEMENTATION_COMPLETE.md), [BEAUTIFICATION_COMPLETE_AND_VERIFIED.md](BEAUTIFICATION_COMPLETE_AND_VERIFIED.md).
- Critical fixes and hot patches: [CRITICAL_FIX_APPLIED.md](CRITICAL_FIX_APPLIED.md), [docs/FIX-SUMMARY-2025-10-09.md](docs/FIX-SUMMARY-2025-10-09.md), [docs/REDESIGN_COMPLETION_SUMMARY.md](docs/REDESIGN_COMPLETION_SUMMARY.md), [docs/HUD_NOT_SHOWING_FIX.md](docs/HUD_NOT_SHOWING_FIX.md).
- Task-specific wrap-ups: [docs/TASK_6_E2E_MODAL_TESTS_STATUS.md](docs/TASK_6_E2E_MODAL_TESTS_STATUS.md), [docs/TASK_7_E2E_MULTI_SELECT_TESTS_STATUS.md](docs/TASK_7_E2E_MULTI_SELECT_TESTS_STATUS.md), [docs/TASK_8_DOCUMENTATION_COMPLETE.md](docs/TASK_8_DOCUMENTATION_COMPLETE.md).
- Additional feature briefs: [MANUAL_TEST_HOVER_SNAP.md](MANUAL_TEST_HOVER_SNAP.md), [docs/MOVEABLE_ENDPOINTS_2025-10-09.md](docs/MOVEABLE_ENDPOINTS_2025-10-09.md), [docs/USER_ACCEPTANCE_TEST_2025-10-09.md](docs/USER_ACCEPTANCE_TEST_2025-10-09.md).

## Testing & Quality Assurance
- Strategy and guides: [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md), [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md), [docs/TESTING_COMPLETE_SUMMARY.md](docs/TESTING_COMPLETE_SUMMARY.md).
- E2E troubleshooting: [docs/E2E_MODAL_BLOCKING_ISSUE.md](docs/E2E_MODAL_BLOCKING_ISSUE.md), [docs/E2E_MODAL_BLOCKING_ROOT_CAUSE_ANALYSIS.md](docs/E2E_MODAL_BLOCKING_ROOT_CAUSE_ANALYSIS.md), [docs/E2E_TEST_TROUBLESHOOTING.md](docs/E2E_TEST_TROUBLESHOOTING.md).
- Test reports directory: `docs/test-reports/` (latest summaries for visual and e2e runs) and `playwright-report/` for HTML outputs.
- Raw run artifacts: `test-results/` (per-scenario failure logs), `test-results.json`, and [MANUAL_TEST_HOVER_SNAP.md](MANUAL_TEST_HOVER_SNAP.md) for manual validation.

## Setup, Tooling & Operations
- Quick onboarding: [docs/QUICK_START.md](docs/QUICK_START.md), [TASK_MASTER_QUICK_START.md](TASK_MASTER_QUICK_START.md), [TASK_MASTER_QUICK_REFERENCE.md](TASK_MASTER_QUICK_REFERENCE.md).
- Environment configuration: [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md), [docs/DOCKER_SUMMARY.md](docs/DOCKER_SUMMARY.md), [docker-scripts.sh](docker-scripts.sh), [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml).
- CI and analytics: [docs/CODECOV_SETUP.md](docs/CODECOV_SETUP.md), [codecov.yml](codecov.yml).
- Process automation: [TASK_MASTER_SETUP_GUIDE.md](TASK_MASTER_SETUP_GUIDE.md), [docs/TASK_MASTER_AI_SETUP.md](docs/TASK_MASTER_AI_SETUP.md), [update-tests.py](update-tests.py).

## Process Tracking & Change Logs
- [CHANGELOG.md](CHANGELOG.md) – High-level change history.
- [docs/DESIGN_CHANGELOG.md](docs/DESIGN_CHANGELOG.md) – UX/UI adjustments over time.
- Phase dashboards: files in `docs/phases/` capturing summaries for phases 0 through 6 plus baseline kickoff.
- Baseline references in `docs/baseline/` covering visual, performance, testing, invariants, and user flows.
- Additional timeline notes: [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md), [docs/OPTIONAL_ENHANCEMENTS_SUMMARY.md](docs/OPTIONAL_ENHANCEMENTS_SUMMARY.md).

## Generated Artifacts & Supporting Assets
- Compiled assets and demos: `dist/`, `playwright-report/`, `test-results/`.
- Supplemental HTML entry point: [index.html](index.html).
- Reports created during debugging or QA live under `docs/bug-reports/` and `docs/Bottombar-Implementation/`.
- Automation logs: [test-results.json](test-results.json) and scenario-specific `error-context.md` files under `test-results/`.

## Keeping the Library Current
- For new documents, add them to the relevant category above and provide a one-line description to keep this index usable.
- Retire superseded docs by linking to their replacements and noting the archival date here.
- When large batches of artifacts (e.g., new test runs) are generated, group them under the “Generated Artifacts” section instead of expanding primary categories.

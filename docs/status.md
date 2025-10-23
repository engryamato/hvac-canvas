# HVAC Canvas Status Dashboard

_Last refreshed from `npm run metrics:collect` on 2025-10-19T20:14:12Z._

## Build Metrics
- Build time: **1.42 s** (1,422 ms)
- Primary bundle (`dist/assets/index-00e5b8d6.js`): **663,502 bytes** (~648 KB) vs budget 716,800 bytes
- Largest asset (`dist/assets/pdf.worker.min-dbcae78a.mjs`): **1,046,214 bytes** (~1.00 MB)
- Total dist payload: **1,728,172 bytes** across 4 files

## Repository Structure
- Tracked files: **313**
- Application sources (`src/`): **148 files**
- Documentation (`docs/`): **127 files**
- Tooling (`scripts/`): **4 files**
- Automated tests (`tests/` and `tests/architecture`): **5 files**

## Test Snapshot
- Vitest suite: **555 / 567 passing** (12 failing – `Sidebar` layout and Line Properties tab interactions)
- Architecture test suite: **12 assertions passing** (`tests/architecture.test.ts`)
- E2E Playwright suite: refer to CI artifact (`test-results/`)

## Artifacts & Regeneration
- Metrics JSON: `test-results/metrics/build-metrics.json`, `test-results/metrics/file-structure.json`
- Generation command: `npm run metrics:collect`
- CI job: `Build & Metrics` (`.github/workflows/ci.yml`) produces identical outputs and uploads them as artifacts

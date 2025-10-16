# The hvac-canvas repository — quick guidance for AI coding agents

Be concise and apply small, well-typed edits. This project is a TypeScript + React drawing app (Vite) that emphasizes small pure utilities, stateless services, and composable hooks.

What this project is (big picture)

- Single-page React app that provides a full-screen straight-line drawing canvas (see `src/DrawingCanvas.tsx`, `src/App.tsx`).
- Layers: UI components (src/components/_) -> Hooks (src/hooks/_) -> Services (src/services/_) -> Utils & Types & Constants (src/utils/_, src/types/_, src/constants/_).
- PDF rendering is supported as a background layer via `src/utils/pdf/pdfLoader`.

Key developer workflows (commands)

- Dev server: `npm run dev` (runs `vite`) — open at the host printed by Vite.
- Build: `npm run build` (vite build).
- Unit tests: `npm run test:unit` (Vitest, environment jsdom). See `vitest.config.ts` for include/exclude patterns.
- E2E tests: `npm run test:e2e` (Playwright wrapper `./scripts/run-e2e-tests.sh`). Use `--headed`, `--ui`, or `--debug` flags as needed.
- Docker helper scripts available in the top-level `docker-scripts.sh` invoked through npm tasks (`npm run docker:dev`, etc.).

Project-specific conventions and patterns

- Services are stateless and return new data (immutability). See `src/services/README.md` and examples in `src/services/*`.
- Utilities are pure, single-responsibility functions (geometry, canvas transforms, snap logic). See `src/utils/*`.
- Hooks orchestrate state and call services, never duplicate service logic. See `src/hooks/*` and `useDrawingState` usage in `src/DrawingCanvas.tsx`.
- Components are props-driven, typed, and accessible. Look at `src/components/DrawingCanvas/*` for canonical patterns (WidthHUD, DrawButton, CanvasRenderer).
- Types and constants live in `src/types` and `src/constants` and should be used instead of magic numbers.

Important files to reference when changing behavior

- `src/DrawingCanvas.tsx` — single-file entrypoint for canvas interactions and overall composition.
- `src/components/DrawingCanvas/CanvasRenderer.tsx` — event wiring for pointer/touch/wheel/context.
- `src/services/*` and `src/utils/*` — move logic here when it spans multiple components/hooks.
- `src/constants/*` and `src/types/*` — add new values/types here and export from barrels.

Style and change guidance for AI patches

- Small, isolated PRs: prefer adding a new function to `src/utils` or a new service under `src/services` and wire it through hooks. Keep changes localized to 1-3 files.
- Preserve immutability and typing: return new arrays/objects and add or update TypeScript types in `src/types` when API changes.
- Follow existing naming: SCREAMING_SNAKE for constants, PascalCase for types and components, camelCase for functions/variables.
- Tests: add or update unit tests under `src/*/__tests__` and run `npm run test:unit`. Favor TDD for service and util changes.

Quick examples (use these exact imports)

- Import a service: `import { createLine, addLine } from 'src/services/drawing';`
- Import utilities: `import { dist, screenToCanvas } from 'src/utils';`
- Update a type: edit `src/types/*.ts` and export from `src/types/index.ts`.

Edge cases and pitfalls to avoid

- Don't mutate arrays passed into services (the codebase relies on immutable returns).
- Touch and HiDPI canvas handling is subtle — use `setupHiDPICanvas` and prefer `screenToCanvas`/`canvasToScreen` helpers.
- Keep performance-sensitive canvas loops (render) free of allocations; prefer reusing objects where possible.

If you change behavior, run these checks

1. `npm run test:unit` (fast unit tests)
2. `npm run test:e2e` (integration/Playwright) or the specific script flags for headed/ui debugging
3. Quick manual smoke: `npm run dev` and exercise canvas interactions (draw, snap, zoom, pan)

If anything here is unclear, tell me which area (build, tests, architecture, specific files) and I'll expand it.

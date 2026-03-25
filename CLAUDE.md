# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

No test runner is configured.

## Architecture

**Stack:** Vite + React 18, zero UI library dependencies. All styling is vanilla CSS with custom properties.

### CSS loading order (src/main.jsx)

All CSS is global — no CSS Modules. Files are imported in this order and cascade intentionally:

| File | Purpose |
|---|---|
| `styles/tokens.css` | All CSS custom properties (colors, spacing, radii) — single source of truth for the NR design tokens |
| `styles/global.css` | Reset, base typography, `.layout` grid, `.main-content` scroll container |
| `styles/components.css` | Reusable UI primitives: `.badge`, `.callout`, `.card`, `.code-block`, `.data-table` |
| `styles/interactive.css` | Stateful interactive component styles: pipeline, simulator, NRQL anatomy, workflow playground, muting grid |
| `styles/diagrams.css` | Diagram-specific styles: hierarchy layers, state machine SVG, decision flowchart |
| `styles/modules.css` | Module/section layout: `.section-eyebrow`, `.section-title`, `.section-lead`, `.module-grid` |

### Navigation and module routing

`App.jsx` owns the active module state. Navigation is a string key matching a component name:

```
navigation.js → Sidebar → onNavigate(moduleId) → App.useState → MODULE_MAP[moduleId]
```

`MODULE_MAP` in `App.jsx` is a plain object mapping string keys (e.g. `'M01Architecture'`) to imported components. Adding a new module requires changes in three places: `src/data/navigation.js`, `src/modules/`, and `MODULE_MAP` in `App.jsx`.

### Component categories

- **`src/components/layout/`** — `Header` and `Sidebar`. Sidebar reads `src/data/navigation.js` directly.
- **`src/components/ui/`** — Stateless primitives (`Badge`, `Callout`, `Card`, `CodeBlock`, `DataTable`). All props-driven, no internal state.
- **`src/components/diagrams/`** — Visual-only components with no business logic: `HierarchyDiagram` (CSS layered stack), `StateMachineDiagram` (SVG state machine, interactive), `WorkflowDecisionDiagram` (CSS decision flowchart).
- **`src/components/interactive/`** — Stateful educational components (simulators, playgrounds). Each manages its own local state via `useState`.
- **`src/modules/`** — One file per tutorial section (M01–M09). Each module composes ui/, diagrams/, and interactive/ components with section prose.

### Data layer

`src/data/` contains plain JS exports — no React. Each interactive component imports its own data file:

| File | Consumer |
|---|---|
| `navigation.js` | `Sidebar.jsx` |
| `pipeline.js` | `Pipeline.jsx` |
| `nrql.js` | `NrqlAnatomy.jsx` |
| `conditionProps.js` | `ConditionProps.jsx` |
| `workflowData.js` | `WorkflowPlayground.jsx` |
| `destinations.js` | `DestinationGrid.jsx` |
| `accordion.js` | `Accordion.jsx` |
| `troubleshootingFlow.js` | `TroubleshootingFlow.jsx` |
| `scenarios.js` | `ScenarioChallenge.jsx` |

To update tutorial content (explanations, examples, labels), edit the data file — not the component.

`troubleshootingFlow.js` is a node graph: each key is a node id, each node is either `type: 'question'` (with `options: [{label, next}]`) or `type: 'resolution'` (terminal). The `TroubleshootingFlow` component walks this graph with a history stack for back-navigation.

`scenarios.js` is a flat array of scenario objects. Each has `options[]`, `correctIndex`, and `explanation`. `ScenarioChallenge` is stateless per scenario — no shared state between challenges.

### Design tokens

All colors, spacing, and radii are in `tokens.css`. Key tokens:

- Backgrounds: `--bg-canvas`, `--bg-page`, `--bg-card`, `--bg-elevated`, `--bg-hover`, `--bg-active`
- Status: `--crit` / `--crit-dim` / `--crit-bg`, same pattern for `--warn`, `--ok`, `--info`
- Accents: `--blue` (`#0ea5e9`), `--teal` (`#2dd4bf`)
- Layout: `--sidebar-w: 252px`, `--header-h: 52px`, `--radius: 6px`

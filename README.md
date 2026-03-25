# New Relic Alerts — Technical Reference

An interactive self-study resource for engineers working with New Relic Alerts. Built to go deeper than the official documentation — with visual diagrams, interactive simulators, a decision-tree troubleshooter, and scenario challenges based on real-world support patterns.

> **TSE Edition · v1.0** — Authored by a Technical Support Engineer with 3 years on the Alerts product.

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Why This Exists

The New Relic documentation is comprehensive but designed as a reference — not as a learning path. It answers "what is this setting?" but rarely "why does this matter?" or "what breaks when you get this wrong?".

This resource is structured as a guided curriculum that builds from first principles to advanced operational practices. Each module connects concepts to each other, explains the failure modes, and provides interactive tools to build intuition — not just memorization.

---

## Modules

### Reference (01–09)

| # | Module | What You'll Learn |
|---|--------|-------------------|
| 01 | Architecture & Data Flow | End-to-end pipeline from signal ingress to notification delivery |
| 02 | Alert Policies | Issue creation preferences, policy design patterns, ownership |
| 03 | Alert Conditions | Condition types, NRQL anatomy, threshold vs. baseline, signal configuration |
| 04 | Incidents | Lifecycle, recovery behavior, one-issue-per-condition vs. per-entity |
| 05 | Issues | How incidents aggregate into issues, priority, acknowledgement |
| 06 | Workflows | Filter logic, enrichment, deduplication, notification triggers |
| 07 | Destinations | Channels, authentication, message templates, webhook payloads |
| 08 | Muting Rules | Scheduling, NRQL-based targeting, timezone gotchas |
| 09 | Common Mistakes | Anti-patterns derived from real support cases |

### Advanced (12–14)

| # | Module | What You'll Learn |
|---|--------|-------------------|
| 12 | Streaming Alerts & Signal Evaluation | Aggregation windows, evaluation methods (Event Flow / Event Timer / Cadence), evaluation offset, signal loss, gap-filling |
| 13 | Decisions & Correlation (AIOps) | Cross-policy incident correlation, ML-based vs. rule-based decisions, topology correlation, grace period |
| 14 | Alert Quality Management | AQM methodology, noise anti-patterns, coverage gaps, health checklist, baseline targets |

### Practice (10–11)

| # | Module | What You'll Learn |
|---|--------|-------------------|
| 10 | Interactive Troubleshooter | Decision-tree flowchart covering 5 failure categories — no more guessing where to start |
| 11 | Scenario Challenges | 5 real-world puzzles based on common support patterns — read the setup, pick the root cause |

---

## Interactive Components

- **Alert Pipeline Diagram** — animated visualization of data flow from condition to notification
- **Issue Preference Simulator** — toggle policy settings and see how incidents merge into issues
- **NRQL Anatomy Explorer** — annotated breakdown of condition NRQL with interactive clause explanations
- **Workflow Filter Playground** — test filter logic against sample incident payloads
- **Muting Rule Visualizer** — calendar-based view of muting windows across timezones
- **State Machine Diagram** — incident lifecycle as an interactive SVG state machine
- **Troubleshooting Flowchart** — guided decision tree with breadcrumb navigation and module deep-links
- **Scenario Challenges** — multiple-choice cases with explanations on reveal

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
```

No test runner is configured. No external UI library dependencies — vanilla CSS with NR design tokens.

---

## Tech Stack

- **Vite 5** + **React 18** — zero-config dev server, fast HMR
- **Vanilla CSS** with custom properties — NR dark theme design tokens, no CSS-in-JS
- **JetBrains Mono** for code, **Inter** for UI text
- All content is plain JS data files in `src/data/` — update content without touching components

---

## Project Structure

```
src/
├── components/
│   ├── diagrams/       # Visual-only SVG and CSS diagrams
│   ├── interactive/    # Stateful educational simulators
│   ├── layout/         # Header and Sidebar
│   └── ui/             # Stateless primitives (Badge, Card, Callout, etc.)
├── data/               # All tutorial content and interactive data
├── modules/            # M01–M14 — one file per section
└── styles/             # 6 global CSS files loaded in cascade order
```

See [`CLAUDE.md`](./CLAUDE.md) for architecture details and conventions.

---

## License

MIT

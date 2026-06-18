---
title: NEXUS Grid
emoji: ⚡
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# ⚡ NEXUS Grid — Energy Planning & Decarbonization Decision Platform

**🔗 Live demo:** [huggingface.co/spaces/Harshit18930/NEXUS-Grid](https://huggingface.co/spaces/Harshit18930/NEXUS-Grid)

NEXUS Grid is a single-page planning console for utility decision-makers: it visualizes a grid's digital twin, runs "what-if" scenario modeling, scores stakeholder consensus, prioritizes capital investment, simulates crisis response, and generates boardroom-ready reports — all from one centralized planning context that drives every module.

This is a frontend-first build: the entire experience runs client-side in React, with a small Express server used only to serve the production build. There is no live backend dependency required to run or deploy it.

---

## Key Capabilities

**Executive Command Center** — boardroom KPI monitoring (grid health, carbon reduction, reliability, stakeholder consensus) with a guided 60-second pitch-deck walkthrough.

**Digital Twin Network Visualization** — geospatial view of substations, renewables, and power lines with layer filters and a Time Travel slider for projected future load.

**Scenario Laboratory** — adjustable policy assumptions (renewables target, EV adoption, population growth, modernization budget) feeding a branching what-if scenario tree, plus a Future Shock simulator for storms, cyberattacks, and heatwaves.

**Planning Council** — a stakeholder negotiation view modeling trade-offs between environmental, industrial, utility, and financial interests, with a consensus-scoring heuristic.

**Investment Prioritization** — CapEx planning workspace that ranks candidate grid projects against a budget constraint using a weighted scoring model.

**Crisis Laboratory** — a disaster-response cockpit for active weather and cyberattack scenarios, with isolation actions and a resilience action matrix.

**Impact Assessment** — long-run economic forecasting (GDP impact, jobs) and SAIDI/SAIFI-style reliability projections.

**Reporting Center** — generates downloadable executive summaries and boardroom briefings.

---

## Architecture

NEXUS Grid is a single React SPA built with Vite and Tailwind. There is no separate API service in this build — all module logic (scenario math, consensus scoring, investment ranking, crisis modeling) runs client-side and is driven by one shared state object.

```
src/
  App.tsx                   — view router / shell
  PlanningScopeContext.tsx  — centralized Planning Scope store (see below)
  data.ts                   — static seed data for all modules
  types.ts                  — shared TypeScript types
  components/               — one component per module (Digital Twin, Scenario Lab, etc.)
server.ts                   — Express server: serves the Vite build in production,
                               runs Vite middleware in dev
```

### Centralized Planning Scope

A single context (`PlanningScopeContext`) propagates planning parameters to every module:

- **scopeType**: `National` | `Region` | `Horizon`
- **selectedRegion**: `North` | `South` | `East` | `West` | `Central`
- **selectedHorizon**: `2030` | `2040` | `2050`

Changing scope in the top navigation instantly recalculates derived values (renewable target, budget, demand forecast, climate risk) and propagates them to every open module — there's no per-module refetch.

> **Roadmap note:** an earlier iteration of this project also included a Python/FastAPI service layer (`backend/`) mirroring this logic for a future real-data backend. It's been removed from this build because it wasn't wired into the running app and only added confusion — see "Known Limitations" below for what a real backend integration would need.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| Charts | Recharts |
| Icons / Motion | lucide-react, motion |
| Server (prod hosting only) | Express 4 |
| Build | Vite (frontend) + esbuild (server bundle) |
| Deployment | Docker (Node 20-alpine), Hugging Face Spaces |

---

## Local Installation & Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### Steps

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build: Vite frontend + esbuild server bundle
npm run start   # run the production build (dist/server.cjs)
npm run lint    # tsc --noEmit type check
npm run clean   # remove build artifacts
```

---

## Docker & Hugging Face Deployment

Configured for Hugging Face Spaces using the Docker SDK:

- Exposes port `7860`.
- `Dockerfile` installs dependencies, runs `npm run build`, and serves the production bundle via Express.

```bash
docker build -t nexus-grid .
docker run -p 7860:7860 nexus-grid
```

---

## Known Limitations / Roadmap

This is a planning **demo and decision-support UI**, not a production grid-operations system. Worth knowing before presenting it:

- All metrics (grid health, demand forecasts, consensus scores, crisis impacts) are computed from deterministic formulas and seed data in `data.ts` / `PlanningScopeContext.tsx`, not live SCADA, GIS, or weather feeds. A real deployment would need a data-ingestion layer behind these modules.
- `@google/genai` is listed as a dependency for future Gemini-powered narrative generation (e.g. natural-language executive summaries) but isn't yet called anywhere in this build.
- No automated test suite yet — `npm run lint` (TypeScript check) is the current quality gate.
- Several module components are large (1,000+ lines) and are good candidates for further decomposition into sub-components as features grow.

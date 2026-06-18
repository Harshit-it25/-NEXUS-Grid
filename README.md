---
title: NEXUS Grid
emoji: ⚡
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

<div align="center">

# ⚡ NEXUS Grid

**Decision Intelligence Console for Grid Modernization & Decarbonization Planning**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Hugging%20Face-yellow?logo=huggingface)](https://huggingface.co/spaces/Harshit18930/NEXUS-Grid)
[![Node](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%20strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2?logo=google)](https://ai.google.dev)

</div>

---

## What is NEXUS Grid?

NEXUS Grid is a **decision-support console for utility planners and policymakers**. Instead of spreading grid modernization decisions across spreadsheets, static slide decks, and siloed engineering tools, it gives a planning team one workspace to model renewable transition scenarios, score stakeholder consensus, prioritize capital projects, simulate crisis response, and generate an AI-written boardroom briefing — all driven from a single shared planning context.

Change the scope once — national, a region, or a target year — and every module recalculates against the same assumptions instantly.

---

## The Problem NEXUS Grid Solves

| Status Quo | NEXUS Grid |
|---|---|
| Renewables/budget/EV assumptions live in separate spreadsheets per team | One shared planning context drives every module |
| Scenario comparisons are manual, static slide exports | Live what-if sandbox, branching trees, and a Future Shock simulator |
| Stakeholder trade-offs negotiated informally, undocumented | A consensus-scoring workspace with a delegate ledger |
| Executive summaries hand-written for each report cycle | AI-synthesized boardroom briefing with a deterministic fallback |
| Investment ranking is a one-off Excel exercise | A standing, budget-constrained CapEx prioritization model |

---

## Live Demo

> **[View the live deployment on Hugging Face Spaces →](https://huggingface.co/spaces/Harshit18930/NEXUS-Grid)**

Use the **scope selector** in the top navigation to switch between `National`, `Region`, and `Horizon` (2030 / 2040 / 2050) views — every module's numbers, charts, and the AI briefing recompute against the new scope immediately.

---

## Core Capabilities

### 🧭 Executive Command Center
Boardroom KPI monitoring — grid health, carbon reduction, reliability, stakeholder consensus — with a guided pitch-deck walkthrough for presenting the platform itself.

### 🌐 Digital Twin Network Visualization
A geospatial atlas of substations, renewables, and transmission lines with layer filters and a Time Travel slider for projected future load.

### 🧪 Scenario Laboratory
Four linked workspaces — sandbox modeling, branching what-if trees, a roadmap view, and a Future Shock simulator for storms, cyberattacks, and heatwaves — all built on adjustable assumptions for renewables target, EV adoption, population growth, and modernization budget.

### 🤝 Planning Council
A stakeholder negotiation view with a delegate roster (`StakeholderDelegates`) and a consensus-strategy ledger (`ConsensusStrategies`), modeling trade-offs between environmental, industrial, utility, and financial interests.

### 💰 Investment Prioritization
A CapEx planning workspace that ranks candidate grid projects against a budget constraint using a weighted scoring model.

### 🚨 Crisis Laboratory
A disaster-response cockpit for active weather and cyberattack scenarios, with isolation actions and a resilience action matrix.

### 📈 Impact Assessment
An independent "test scenarios" sandbox for long-run economic forecasting (GDP impact, jobs) and SAIDI/SAIFI-style reliability projections.

### 📋 Reporting Center
Generates downloadable executive summaries, plus an AI-synthesized boardroom briefing (see below).

---

## AI-Generated Executive Briefings

The Reporting Center calls a server-side endpoint, `/api/generate-narrative`, which uses **Gemini 2.5 Flash** (`@google/genai`) to write a short, boardroom-toned summary of the *current live planning state* — region/horizon, renewables target, EV adoption baseline, and stakeholder consensus score, all pulled from the same centralized context every other module reads from.

- If `GEMINI_API_KEY` is set, the briefing is generated live by Gemini and tagged **"✨ Gemini AI Generated"** in the UI.
- If the key is missing or the API call fails, the endpoint falls back to a deterministic, rule-based narrative built from the same live inputs, tagged **"📋 Policy-Rule Fallback"** — the feature degrades gracefully instead of breaking.

To enable live AI generation, copy `.env.example` to `.env` and set:
```
GEMINI_API_KEY="your-key-here"
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (React 19 SPA)                  │
│  Executive Center │ Digital Twin │ Scenario Lab │ ...10   │
│      views, each lazy-loaded via React.lazy + Suspense    │
│              shared state: PlanningScopeContext            │
└───────────────────────────┬─────────────────────────────┘
                            │ single REST call
┌───────────────────────────▼─────────────────────────────┐
│              Express / TypeScript Server                  │
│   POST /api/generate-narrative → Gemini 2.5 Flash         │
│           (rule-based fallback if no API key)              │
│   Otherwise: static hosting of the production bundle       │
└─────────────────────────────────────────────────────────┘
```

NEXUS Grid is intentionally single-stack: there's no database and no second backend service to operate. Every module's logic — scenario math, consensus scoring, investment ranking, crisis modeling — runs client-side off one shared context; the server's only job beyond hosting the build is the one Gemini call above.

### Centralized Planning Scope

A single context, `PlanningScopeContext`, derives and propagates planning parameters to every module:

- **scopeType**: `National` | `Region` | `Horizon`
- **selectedRegion**: `North` | `South` | `East` | `West` | `Central`
- **selectedHorizon**: `2030` | `2040` | `2050`

Changing scope instantly recalculates renewable target, budget, demand forecast, climate risk, EV adoption baseline, and stakeholder consensus score — and propagates them to every open module, including the AI briefing. There's no per-module refetch and no duplicate derivation logic across components.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.8 (`strict` mode), Vite 6, Tailwind CSS v4 |
| Charts | Recharts |
| Icons / Motion | Lucide React, Motion |
| AI | Gemini 2.5 Flash via `@google/genai` (server-side, with rule-based fallback) |
| Server | Express 4, tsx (dev), esbuild (prod bundle) |
| Deployment | Docker (Node 20-alpine), Hugging Face Spaces |

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Run locally

```bash
# 1. Clone
git clone https://github.com/<your-username>/nexus-grid.git
cd nexus-grid

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env
# Edit .env — set GEMINI_API_KEY if you want live AI briefings (optional; works without it)

# 4. Start the dev server
npm run dev

# 5. Open the console
open http://localhost:3000
```

### Run with Docker

```bash
docker build -t nexus-grid .
docker run -p 7860:7860 -e GEMINI_API_KEY=your-key nexus-grid
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. **Never commit `.env` to source control.**

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | No — optional | Enables live Gemini-generated briefings; falls back to a rule-based narrative if unset |
| `APP_URL` | Production | Public URL of the deployed app |
| `PORT` | Optional | Server port (default: `3000`; the Dockerfile sets `7860` for Hugging Face) |

---

## Project Structure

```
nexus-grid/
├── src/
│   ├── components/
│   │   ├── ExecutiveCommandCenter.tsx
│   │   ├── DigitalTwin.tsx
│   │   ├── ScenarioLaboratory.tsx
│   │   ├── PlanningCouncil.tsx
│   │   ├── InvestmentPrioritization.tsx
│   │   ├── CrisisLaboratory.tsx
│   │   ├── ImpactAssessment.tsx
│   │   ├── ReportingCenter.tsx
│   │   ├── DecisionTraceability.tsx
│   │   ├── DemoStoryMode.tsx
│   │   ├── Sidebar.tsx / Topbar.tsx
│   │   ├── digital-twin/        # DigitalTwinAtlas.tsx, DigitalTwinRenewables.tsx
│   │   ├── planning-council/    # StakeholderDelegates.tsx, ConsensusStrategies.tsx
│   │   └── scenario-lab/        # ScenarioSandboxTab, FutureShockTab, RoadmapTab, BranchingTab
│   ├── App.tsx                  # View router — React.lazy + Suspense for all 10 views
│   ├── PlanningScopeContext.tsx # Centralized planning-scope store
│   ├── data.ts                  # Static seed data for all modules
│   ├── types.ts                 # Shared TypeScript types
│   └── index.css
├── server.ts                    # Express: /api/generate-narrative (Gemini), Vite middleware in dev
├── public/
├── .env.example
├── Dockerfile
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## API Reference

```
POST /api/generate-narrative
Body: { region?, horizon?, evAdoption, renewableTarget, consensusScore }
→ { narrative: string, isAiGenerated: boolean }
```

This is the only server route in the application — everything else is computed client-side.

---

## Quality & Engineering Notes

- [x] TypeScript `strict` mode enabled across the codebase — `npm run lint` passes clean
- [x] Per-view code splitting via `React.lazy` + `Suspense` (largest individual view chunk is under 70 KB, down from a single ~900 KB bundle)
- [x] Large modules (Scenario Lab, Digital Twin, Planning Council) decomposed into sub-components under `components/<module>/`
- [x] `evAdoption` and `consensusScore` centralized in `PlanningScopeContext` — no duplicate derivation logic across modules
- [x] Icon-only interactive controls (search clear, notifications, account menu, planning-mode select) have explicit `aria-label`s
- [ ] No automated test suite yet (`npm run lint` is the current quality gate)
- [ ] Further decomposition of the three largest module files (currently 800–950 lines each)
- [ ] Impact Assessment's sandbox sliders are intentionally independent of global scope; documenting/exposing that distinction more clearly in-app is a future polish item

---

## Roadmap

- [ ] Wire a real data-ingestion layer (replacing seed data in `data.ts`) for SCADA/GIS/weather feeds
- [ ] Operator authentication for multi-user planning sessions
- [ ] Exportable PDF/PPTX board packs from the Reporting Center
- [ ] Mobile/tablet-responsive layout

---

## Contributing

Pull requests are welcome. For larger changes, open an issue first to discuss what you'd like to change.

```bash
npm run lint    # tsc --noEmit, strict mode
npm run build   # production build
npm run start   # run the production build
```

---

## License

No license file is currently included in this repository. All rights reserved by the author unless a license is added.

---

<div align="center">

Built by **Harshit Ranbhare**
B.Tech Information Technology (AI & ML)

</div>

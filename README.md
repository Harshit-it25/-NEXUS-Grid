---
title: NEXUS Grid
emoji: ⚡
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# ⚡ NEXUS Grid: Enterprise Energy Planning & Decarbonization Platform

NEXUS Grid is an advanced, boardroom-ready grid simulation, investment optimization, and stakeholders planning platform. Designed for utility planning systems designers, enterprise UX architects, and executive leaders, the platform orchestrates complex grid assets, modernizes investment roadmaps, and aligns multi-stakeholder consensus.

---

## 🌟 Key Capabilities

### 1. Executive Command Center
- Real-time boardroom KPI monitoring (Grid Health, Carbon Reduction, System Reliability, Stakeholder Consensus).
- Integrated quick-start **60s Pitch Deck** demo walkthrough.
- Instant access to strategic modernization decision packages.

### 2. Digital Twin Network Visualization
- High-fidelity geospatial visualization of subregion substations, solar plants, and energy storage assets.
- Configurable layer filters (Substations, Renewables, Power Lines, Load Densities).
- Interactive **Time Travel Engine** slider simulating future grid loads and capacities.

### 3. Scenario Laboratory
- Professional assumptions deck containing policy inputs (Renewables target, EV adoption, Population growth, Grid modernization budget).
- Branching "What-If" branching scenarios tree.
- Interactive **Future Shock Simulator** testing resilience against severe storm fronts, cyber attacks, and heatwaves.

### 4. Planning Council
- Stakeholder delegate portal facilitating trade-off negotiations between environmentalists, industrial consumers, utility operators, and financial leaders.
- Dynamic conflict-resolution heuristic solvers calculating stakeholder consensus scores.

### 5. Investment Prioritization
- CapEx planning workspace with selectable grid expansion projects.
- Heuristic optimization algorithm maximizing carbon offset and reliability gains within budget constraints.

### 6. Crisis Laboratory
- Disaster response cockpit with active weather event simulations.
- Cyber-attack isolation commands and system recovery workflows.
- Dynamic Resilience Action Matrix.

### 7. Impact Assessment
- Long-term economic forecasting (GDP impact, grid offset jobs).
- Reliability projection models tracking SAIDI/SAIFI standards.

### 8. Reporting Center
- Interactive report designer generating downloadable boardroom briefings and executive summaries.

---

## ⚙️ Architecture & Centralized State

NEXUS Grid uses a centralized **Planning Scope Store** to propagate planning parameters across the system:
- **scopeType**: `National` | `Region` | `Horizon`
- **selectedRegion**: `North` | `South` | `East` | `West` | `Central`
- **selectedHorizon**: `2030` | `2040` | `2050`

Changing the top navigation scope parameters instantly triggers recalculations, geospatial filtering, and forecasting updates across all modules.

---

## 🛠️ Local Installation & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Steps
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🐳 Docker & Hugging Face Deployment

This project is configured for containerized deployment on Hugging Face Spaces using the **Docker SDK**:
- Exposes port `7860`.
- Runs a production build combining a Vite frontend and an Express API backend (`server.ts`).

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ==========================================
  // MODULE 1: DIGITAL TWIN LOGIC
  // ==========================================
  const mockSubstations = [
    { id: "sub-1", name: "Northeast Transmission Hub", region: "Northeast Cluster", capacity_mw: 500.0, current_load_mw: 348.0, health_index: 92.5, failure_risk: 0.04, status: "OPERATIONAL" },
    { id: "sub-2", name: "Cascade Valley Substation", region: "Pacific Rim", capacity_mw: 350.0, current_load_mw: 312.0, health_index: 78.4, failure_risk: 0.12, status: "WARNING" },
    { id: "sub-3", name: "Green Valley Wind Injection", region: "Western Appalachia", capacity_mw: 400.0, current_load_mw: 140.0, health_index: 99.1, failure_risk: 0.01, status: "OPERATIONAL" },
    { id: "sub-4", name: "Southeast Distribution Hub", region: "Southeast Hub", capacity_mw: 300.0, current_load_mw: 260.0, health_index: 85.0, failure_risk: 0.06, status: "OPERATIONAL" }
  ];

  const mockLines = [
    { id: "line-1", voltage_kv: 230.0, capacity_mw: 400.0, current_flow_mw: 310.0, status: "ONLINE" },
    { id: "line-2", voltage_kv: 115.0, capacity_mw: 150.0, current_flow_mw: 142.0, status: "CONGESTED" },
    { id: "line-3", voltage_kv: 500.0, capacity_mw: 1000.0, current_flow_mw: 240.0, status: "ONLINE" }
  ];

  app.get("/api/digital-twin", (req, res) => {
    const totalCapacity = mockSubstations.reduce((sum, s) => sum + s.capacity_mw, 0);
    const totalLoad = mockSubstations.reduce((sum, s) => sum + s.current_load_mw, 0);
    const avgHealth = mockSubstations.reduce((sum, s) => sum + s.health_index, 0) / mockSubstations.length;
    const utilFactor = totalLoad / totalCapacity;

    res.json({
      timestamp: new Date().toISOString(),
      grid_health_index: parseFloat(avgHealth.toFixed(1)),
      infrastructure_readiness_score: parseFloat((100 - (utilFactor * 25) - (0.05 * (100 - avgHealth))).toFixed(1)),
      reliability_index: parseFloat((99.92 - mockSubstations.filter(s => s.status === "WARNING").length * 1.5).toFixed(2)),
      total_capacity_mw: totalCapacity,
      total_load_mw: totalLoad,
      substations: mockSubstations,
      lines: mockLines
    });
  });

  app.post("/api/digital-twin/update", (req, res) => {
    const { substation_id, new_load_mw, health_index, status } = req.body;
    const sub = mockSubstations.find(s => s.id === substation_id);
    if (!sub) return res.status(404).json({ success: false, error: "Substation not found." });

    if (new_load_mw !== undefined) sub.current_load_mw = new_load_mw;
    if (health_index !== undefined) sub.health_index = health_index;
    if (status !== undefined) sub.status = status;

    const ratio = sub.current_load_mw / sub.capacity_mw;
    sub.failure_risk = parseFloat(((100 - sub.health_index) / 100 * 0.5 + (ratio - 0.7) * 0.3).toFixed(3));
    if (sub.failure_risk < 0.005) sub.failure_risk = 0.005;

    res.json({ success: true, updated_substation: sub });
  });

  // ==========================================
  // MODULE 2: GRID DATA INGESTION
  // ==========================================
  app.post("/api/data-hub/ingest", (req, res) => {
    const { source_id, gis_records, utility_ping_status, weather_temp_f, renewable_forecast_mw } = req.body;
    let deductions = 0.0;
    if (!gis_records || gis_records <= 0) deductions += 15.0;
    if (utility_ping_status !== "CONNECTED") deductions += 25.0;
    if (weather_temp_f < -40 || weather_temp_f > 130) deductions += 10.0;
    if (renewable_forecast_mw < 0) deductions += 20.0;

    const score = Math.max(5.0, 100.0 - deductions);
    let desc = "Highly reliable feed. SCADA points fully synchronized.";
    if (score < 90) desc = "Adequate. Some jitter in vector timestamps.";
    if (score < 70) desc = "De-graded status. Missing database entries.";

    res.json({
      success: score >= 50.0,
      source_id: source_id || "gen-source",
      records_processed: (gis_records || 0) + 120,
      data_quality_score: score,
      data_health_comment: desc
    });
  });

  // ==========================================
  // MODULE 3: RENEWABLE PLANNING
  // ==========================================
  app.post("/api/renewable-planner", (req, res) => {
    const { solar_capacity, wind_capacity, battery_storage, transmission_capacity } = req.body;
    const totalProposed = (solar_capacity || 0) + (wind_capacity || 0);
    const storageEffectiveness = (battery_storage || 0) / 4.0;
    const baseThreshold = (transmission_capacity || 500) * 0.85;
    const supportedCapacity = baseThreshold + storageEffectiveness * 1.5;

    const score = totalProposed === 0 ? 100 : Math.min(100, (supportedCapacity / totalProposed) * 100);
    const constraints: string[] = [];
    const upgrades: any[] = [];

    if (totalProposed > supportedCapacity) {
      constraints.push("Substation Cascade Valley (Pacific Rim) overloaded");
      upgrades.push({ location: "Cascade Valley", upgrade_type: "HV Transformer & Substation Storage integration", estimated_cost_m: 12.5, estimated_timeline_months: 18 });
    }
    if ((wind_capacity || 0) > 300) {
      constraints.push("Western Appalachia line sections saturated");
      upgrades.push({ location: "Western Appalachia Radial", upgrade_type: "500kV Double-Circuit Expansion Line", estimated_cost_m: 24.0, estimated_timeline_months: 24 });
    }

    res.json({
      renewable_integration_score: parseFloat(score.toFixed(1)),
      grid_absorption_capacity_mw: parseFloat(supportedCapacity.toFixed(1)),
      constraint_locations: constraints,
      recommended_upgrades: upgrades
    });
  });

  // ==========================================
  // MODULE 4: SCENARIO MODELING
  // ==========================================
  app.post("/api/scenarios", (req, res) => {
    const { scenario_name, ev_adoption, population_growth, renewable_target, industrial_growth, budget } = req.body;
    const baseDemand = 1200.0;
    const evMulti = 1 + (ev_adoption || 0) / 100.0 * 0.25;
    const popMulti = 1 + (population_growth || 0) / 100.0 * 1.8;
    const indMulti = 1 + (industrial_growth || 0) / 100.0 * 1.4;

    const forecast = [2025, 2030, 2040, 2050].map((yr, idx) => {
      const sf = 1 + (0.015 * (yr - 2025));
      const dem = baseDemand * sf * evMulti * popMulti * indMulti;
      const targetRen = (renewable_target || 0) / 100.0 * (0.4 + 0.6 * (idx / 3));
      return {
        year: yr,
        demand_mw: Math.round(dem),
        renewable_mw: Math.round(dem * targetRen)
      };
    });

    const capacityReq = forecast[forecast.length - 1].demand_mw * 1.15;
    const baseCapital = (capacityReq - 1200) * 0.15;
    const greenCapital = ((renewable_target || 0) / 100) * 45;
    const totalRequired = Math.max(5.0, baseCapital + greenCapital);
    const hasAccess = (budget || 0) >= totalRequired;

    let reliability = 99.94;
    if (!hasAccess) {
      const deficit = (totalRequired - budget) / totalRequired;
      reliability = Math.max(94.2, 99.92 - (deficit * 15) - ((renewable_target || 0) / 100) * 1.2);
    }

    res.json({
      demand_forecast: forecast,
      capacity_requirements_mw: parseFloat(capacityReq.toFixed(1)),
      investment_requirements_m: parseFloat(totalRequired.toFixed(1)),
      reliability_impact: parseFloat(reliability.toFixed(3)),
      feasibility_status: hasAccess ? "OPTIMAL" : "BUDGET_CONSTRAINED"
    });
  });

  // ==========================================
  // MODULE 5 & 6: PLANNING COUNCIL & CONSENSUS
  // ==========================================
  app.post("/api/planning-council", (req, res) => {
    const { ev_adoption, renewable_target, budget, industrial_growth } = req.body;
    
    const govScore = Math.max(50.0, 100.0 - Math.abs((renewable_target || 0) - 80) * 1.2);
    const gridOperator = Math.max(35.0, 100.0 - ((ev_adoption || 0) * 0.4 + (industrial_growth || 0) * 0.5));
    const renScore = Math.min(100.0, ((renewable_target || 0) / 85.0) * 100.0);
    const comScore = Math.max(40.0, 95.0 - ((budget || 0) / 15 + (industrial_growth || 0) / 10));
    const invScore = Math.min(100.0, 60.0 + (industrial_growth || 0) * 0.3 + (budget || 0) * 0.2);
    const riskScore = 100.0 - ((renewable_target || 0) * 0.3 + (100 - (ev_adoption || 0)) * 0.1);

    const opinions = [
      { agent_id: "stk-1", agent_name: "Government Agent", objective_score: parseFloat(govScore.toFixed(1)), recommendation: govScore < 75 ? "APPROVE WITH PROVISO" : "STRONG APPROVAL", confidence: 94, justification: `Decarbonization objectives targeted at ${renewable_target}%.` },
      { agent_id: "stk-2", agent_name: "Grid Operator Agent", objective_score: parseFloat(gridOperator.toFixed(1)), recommendation: gridOperator < 60 ? "OPERATIONAL RESTRICTION" : "PASS SECURITY BARRIER", confidence: 85, justification: `Safety margins modeled on line congestion vectors.` },
      { agent_id: "stk-3", agent_name: "Renewable Agent", objective_score: parseFloat(renScore.toFixed(1)), recommendation: renScore > 75 ? "ACTIVE EXPANSION" : "INSUFFICIENT RENEWABLES", confidence: 90, justification: "Urging aggressive capital insertion towards solar clusters." },
      { agent_id: "stk-4", agent_name: "Community Agent", objective_score: parseFloat(comScore.toFixed(1)), recommendation: comScore < 65 ? "RATE-PAYERS SHIELD" : "AFFORDABILITY METRIC PASSED", confidence: 78, justification: "Fearing bill escalation for microgrid updates." },
      { agent_id: "stk-5", agent_name: "Investment Agent", objective_score: parseFloat(invScore.toFixed(1)), recommendation: invScore > 72 ? "PORTFOLIO MET OPTIMAL" : "RECONVERT DEBT STRUCTURE", confidence: 91, justification: "Expected rate of asset absorption meets targets." },
      { agent_id: "stk-6", agent_name: "Risk Agent", objective_score: parseFloat(riskScore.toFixed(1)), recommendation: riskScore < 70 ? "HIGH ATTACK SURFACE ALERT" : "RISK TOLERANCE BALANCED", confidence: 82, justification: "Evaluating grid decentralization resilience indexes." }
    ];

    res.json({
      assembly_at: new Date().toISOString(),
      active_scenario: req.body.scenario_name || "Modernization Phase Alpha",
      agents_feedback: opinions
    });
  });

  app.post("/api/consensus", (req, res) => {
    const { opinions } = req.body;
    if (!opinions || !opinions.length) return res.status(400).json({ success: false, error: "Empty agents opinion payload." });

    const weights: Record<string, number> = { "stk-1": 0.2, "stk-2": 0.25, "stk-3": 0.1, "stk-4": 0.1, "stk-5": 0.15, "stk-6": 0.2 };
    let scoreAccum = 0;
    let totWeight = 0;

    opinions.forEach((op: any) => {
      const w = weights[op.agent_id] || 0.1;
      scoreAccum += op.objective_score * w;
      totWeight += w;
    });

    const consensusScore = scoreAccum / totWeight;
    const conflicts: any[] = [];
    const matrix: any = {};

    opinions.forEach((op1: any) => {
      matrix[op1.agent_name] = {};
      opinions.forEach((op2: any) => {
        const d = Math.abs(op1.objective_score - op2.objective_score);
        matrix[op1.agent_name][op2.agent_name] = parseFloat(d.toFixed(1));
      });
    });

    for (let i = 0; i < opinions.length; i++) {
      for (let j = i + 1; j < opinions.length; j++) {
        const d = Math.abs(opinions[i].objective_score - opinions[j].objective_score);
        if (d > 25) {
          conflicts.push({
            agents: [opinions[i].agent_name, opinions[j].agent_name],
            critical_stress: `Significant policy tension (${d.toFixed(1)} points) on planning values.`,
            reconciliation_index: parseFloat((100 - d * 0.8).toFixed(1))
          });
        }
      }
    }

    res.json({
      consensus_score: parseFloat(consensusScore.toFixed(2)),
      conflict_matrix: matrix,
      conflicts_identified: conflicts.slice(0, 3),
      compromise_plan: {
        strategy_name: "Consensus-Driven Multi-Vector Balance",
        implementation_year: 2030,
        primary_vector: consensusScore >= 75 ? "CLEAN_PENETRATION" : "RESERVE_REDUNDANCY",
        allocated_shares: { transmission_hardening: 35, renewable_subventions: 30, storage_resiliency: 25, community_rate_relief: 10 }
      },
      final_strategy: "COOPERATIVE BALANCED CORRIDOR ARCHITECTURE: Fuses edge microgrids with structural GIS safety triggers."
    });
  });

  // ==========================================
  // MODULE 7: INVESTMENT PLANNING
  // ==========================================
  app.post("/api/investments", (req, res) => {
    const { projects, budget } = req.body;
    if (!projects) return res.status(400).json({ success: false, error: "Missing project database catalog." });

    const prioritized = projects.map((p: any) => {
      const carbonScore = Math.min(10.0, (p.carbon_reduction_tons || 0) / 200.0);
      const score = (
        0.30 * (p.reliability_impact_score || 5) +
        0.25 * ((p.renewable_capacity_mw || 0) / 20 * 10) +
        0.20 * (p.community_benefit_rating || 5) +
        0.15 * carbonScore +
        0.10 * (p.risk_factors || 5)
      );

      return {
        id: p.id,
        name: p.name,
        priority_score: parseFloat(score.toFixed(2)),
        expected_roi: parseFloat((((p.reliability_impact_score * 0.4 + p.renewable_capacity_mw * 0.1) / Math.max(1, p.cost)) * 15.2).toFixed(1)),
        strategic_justification: p.reliability_impact_score >= 8.5 ? "Critical hardening system for transformer stability." : "Enhances baseline distribution margins cleanly."
      };
    }).sort((a: any, b: any) => b.priority_score - a.priority_score);

    let fundsUsed = 0.0;
    const portfolio: any[] = [];
    prioritized.forEach((p_res: any) => {
      const p_orig = projects.find((o: any) => o.id === p_res.id);
      if (p_orig && (fundsUsed + p_orig.cost <= (budget || 50.0))) {
        fundsUsed += p_orig.cost;
        portfolio.push(p_res);
      }
    });

    res.json({
      budget_limit: budget || 50.0,
      allocated_funds: parseFloat(fundsUsed.toFixed(1)),
      estimated_system_roi: portfolio.length ? parseFloat((portfolio.reduce((sum, p) => sum + p.expected_roi, 0) / portfolio.length).toFixed(1)) : 0.0,
      ranked_projects: portfolio
    });
  });

  // ==========================================
  // MODULE 8: CRISIS SIMULATION
  // ==========================================
  app.post("/api/crisis", (req, res) => {
    const { crisis_type, severity_factor } = req.body;
    const sf = severity_factor || 1.0;
    const ct = (crisis_type || "HEATWAVE").toUpperCase();

    if (ct === "HEATWAVE") {
      res.json({ affected_population: Math.round(450000 * sf), economic_impact_m: parseFloat((12.4 * sf).toFixed(1)), recovery_time_days: Math.max(1, Math.round(3 * sf)), reliability_loss_percent: parseFloat(Math.min(15.0, 3.5 * sf).toFixed(1)), cascade_critical_nodes: ["Substation Northeast Cascade", "N-1 Line Anchor"], mitigation_action_notes: "Activate smart water condenser mist loops on transformers." });
    } else if (ct === "CYCLONE") {
      res.json({ affected_population: Math.round(850000 * sf), economic_impact_m: parseFloat((48.5 * sf).toFixed(1)), recovery_time_days: Math.max(2, Math.round(9 * sf)), reliability_loss_percent: parseFloat(Math.min(38.0, 12.5 * sf).toFixed(1)), cascade_critical_nodes: ["Main Coastal Intertie Towers", "Ocean-edge Sub Junction"], mitigation_action_notes: "Unplug offshore lines and divert loads inland." });
    } else {
      res.json({ affected_population: Math.round(250000 * sf), economic_impact_m: parseFloat((15.0 * sf).toFixed(1)), recovery_time_days: Math.max(1, Math.round(4 * sf)), reliability_loss_percent: parseFloat(Math.min(18.0, 4.5 * sf).toFixed(1)), cascade_critical_nodes: ["Distribution Segment B"], mitigation_action_notes: "Activate decentralized solar-microgrid reserves." });
    }
  });

  // ==========================================
  // MODULE 9: FUTURE SHOCK
  // ==========================================
  app.get("/api/future-shock", (req, res) => {
    const carbonOffset = parseFloat(req.query.carbon_reduction_pct as string) || 30.0;
    res.json({
      timeline_projections: [
        { year: 2025, demand_growth_percent: 3.5, renewable_growth_percent: 12.2, infrastructure_stress_index: 15.0, climate_risk_multiplier: 1.05, reliability_score: 99.94 },
        { year: 2030, demand_growth_percent: 14.8, renewable_growth_percent: 32.5, infrastructure_stress_index: 32.4, climate_risk_multiplier: 1.20, reliability_score: 99.88 },
        { year: 2040, demand_growth_percent: 32.1, renewable_growth_percent: 55.0, infrastructure_stress_index: parseFloat(Math.max(20.0, 68.0 - (carbonOffset * 0.4)).toFixed(1)), climate_risk_multiplier: 1.45, reliability_score: 99.65 },
        { year: 2050, demand_growth_percent: 52.4, renewable_growth_percent: 78.2, infrastructure_stress_index: parseFloat(Math.max(25.0, 94.0 - (carbonOffset * 0.7)).toFixed(1)), climate_risk_multiplier: 1.80, reliability_score: 99.20 }
      ]
    });
  });

  // ==========================================
  // MODULE 10: MODERNIZATION ROADMAP
  // ==========================================
  app.post("/api/roadmap", (req, res) => {
    const { budget, renewable_target, planning_horizon_years } = req.body;
    const targetYears = planning_horizon_years || 25;
    const step = Math.max(1, Math.floor(targetYears / 4));

    const cap1 = parseFloat((budget * 0.15).toFixed(1));
    const cap2 = parseFloat((budget * 0.30).toFixed(1));
    const cap3 = parseFloat((budget * 0.35).toFixed(1));
    const cap4 = parseFloat((budget * 0.20).toFixed(1));

    res.json({
      phases: [
        { phase_id: 1, title: "Foundation & Edge Ingestion", years: `2026 - ${2026 + step}`, projects: ["GIS Schema Overhaul", "Northeast Substation IoT Sensor Placements"], budget_m: cap1, expected_outcomes: "Live telemetry feeds with zero lag.", risk_reduction_pct: 14.5, carbon_reduction_pct: parseFloat((renewable_target * 0.1).toFixed(1)) },
        { phase_id: 2, title: "Decarbonization Boost", years: `${2027 + step} - ${2026 + 2*step}`, projects: ["Cascade Valley Grid Battery (100MW)", "Green Valley Wind Inlets"], budget_m: cap2, expected_outcomes: "Absorb sudden industrial demands smoothly.", risk_reduction_pct: 28.0, carbon_reduction_pct: parseFloat((renewable_target * 0.45).toFixed(1)) },
        { phase_id: 3, title: "System Hardening Corridor", years: `${2027 + 2*step} - ${2026 + 3*step}`, projects: ["500kV Dual-Line Tower Upgrades", "Raised Substation Pods"], budget_m: cap3, expected_outcomes: "Prevent transformer over-temperatures during heatwaves.", risk_reduction_pct: 42.5, carbon_reduction_pct: parseFloat((renewable_target * 0.75).toFixed(1)) },
        { phase_id: 4, title: "Autonomous Control Meshes", years: `${2027 + 3*step} - ${2026 + targetYears}`, projects: ["Autonomous AI Dispatcher", "Cyber Mesh Security Suite"], budget_m: cap4, expected_outcomes: "Automatic routing around damaged lines inside 60ms.", risk_reduction_pct: 58.2, carbon_reduction_pct: parseFloat(renewable_target || 35.0) }
      ]
    });
  });

  // ==========================================
  // MODULE 11: EXECUTIVE COMPLIANCE REPORTING
  // ==========================================
  app.get("/api/reports", (req, res) => {
    res.json({
      summary_report: {
        title: "Cassandra Executive Grid Council Summary",
        compliance_rating: "AAA",
        regulatory_status: "COMPLIANT",
        summary_paragraph: "The GridOS twin metrics calculate national readiness limits safely compliant with modern low carbon mandates.",
        key_directives: [
          "Divert capital to Cascade Valley battery backup.",
          "Fulfill regulatory emission timelines using community micro-grids."
        ]
      },
      export_formats: ["JSON", "CSV"]
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

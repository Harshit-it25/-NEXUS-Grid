import React from "react";
import { ActiveView } from "../types";
import { usePlanningScope } from "../PlanningScopeContext";

interface ExecutiveCommandCenterProps {
  planningMode: "NATIONAL" | "MUNICIPAL" | "RURAL";
  onNavigate: (view: any) => void;
}

export const ExecutiveCommandCenter: React.FC<ExecutiveCommandCenterProps> = ({ planningMode, onNavigate }) => {
  const {
    scopeType,
    selectedRegion,
    selectedHorizon,
    renewableTarget,
    budgetCr,
    storageGwh,
    climateRiskLevel,
    activeScenarioName,
  } = usePlanningScope();
  const getModeDetails = () => {
    switch (planningMode) {
      case "MUNICIPAL":
        return {
          title: "Municipal Energy Strategy",
          focus: "Urban Distribution • Smart Charging • District Resilience",
          summary: "Urban electrification strategy secures fast-charging access for 85% of municipal EV fleets, minimizing subsegment overload incidents through adaptive grid-edge curtailment by 22% before 2035.",
          kpis: [
            { label: "Grid Health Index", value: "87.4%", status: "OPTIMAL", color: "text-emerald-600" },
            { label: "Renewable Integration Score", value: "41.6%", status: "ACCELERATING", color: "text-[#0F4C81]" },
            { label: "Climate Resilience Score", value: "62.0%", status: "MODERATE", color: "text-amber-600" },
            { label: "Electrification Coverage", value: "99.8%", status: "COV-RELIABLE", color: "text-emerald-600" },
            { label: "Investment Readiness Index", value: "92.0%", status: "STRONG", color: "text-[#0F4C81]" },
            { label: "Carbon Reduction Progress", value: "-48.2%", status: "LEADING", color: "text-emerald-600" },
          ]
        };
      case "RURAL":
        return {
          title: "Rural Electrification Strategy",
          focus: "Off-Grid Microgrids • Solar Villages • Resilient Energy Access",
          summary: "Microgrid islanding initializes 120 isolated communal solar-paired storage units in historically underserved regions, boosting runtime reliability by 140% and replacing expensive diesel generators.",
          kpis: [
            { label: "Grid Health Index", value: "76.2%", status: "UPGRADE REQ.", color: "text-amber-600" },
            { label: "Renewable Integration Score", value: "79.4%", status: "ADVANCED", color: "text-emerald-600" },
            { label: "Climate Resilience Score", value: "45.0%", status: "VOLATILE", color: "text-rose-600" },
            { label: "Electrification Coverage", value: "82.4%", status: "COV-GAP", color: "text-amber-600" },
            { label: "Investment Readiness Index", value: "65.0%", status: "MEDIUM", color: "text-amber-600" },
            { label: "Carbon Reduction Progress", value: "-24.5%", status: "ON-TRACK", color: "text-[#0F4C81]" },
          ]
        };
      case "NATIONAL":
      default:
        return {
          title: "National Utility Strategy",
          focus: "Transmission Networks • Utility-Scale Sourcing • National Modernization",
          summary: "Current modernization development plan achieves 61.1% national renewable penetration by 2040 while improving primary grid inter-tie reliability indexes by 18.2% under extreme climate stress.",
          kpis: [
            { label: "Grid Health Index", value: "91.5%", status: "STABLE", color: "text-emerald-600" },
            { label: "Renewable Integration Score", value: "54.2%", status: "ON TARGET", color: "text-emerald-600" },
            { label: "Climate Resilience Score", value: "78.0%", status: "HIGH", color: "text-[#0F4C81]" },
            { label: "Electrification Coverage", value: "98.2%", status: "STABLE", color: "text-emerald-600" },
            { label: "Investment Readiness Index", value: "88.0%", status: "EXCELLENT", color: "text-[#0F4C81]" },
            { label: "Carbon Reduction Progress", value: "-38.0%", status: "ON-TRACK", color: "text-emerald-600" },
          ]
        };
    }
  };

  const getExecutiveDetails = () => {
    let title = "National Utility Strategy";
    let focus = "Transmission Networks • Utility-Scale Sourcing • National Modernization";
    let summary = `Current modernization development plan achieves 61.1% national renewable penetration by 2040 while improving primary grid inter-tie reliability indexes by 18.2% under extreme climate stress.`;
    
    let gridHealth = "91.5%";
    let gridHealthStatus = "STABLE";
    let gridHealthColor = "text-emerald-600";
    
    let renewMix = `${renewableTarget}%`;
    let renewStatus = renewableTarget >= 80 ? "ADVANCED" : renewableTarget >= 70 ? "ON TARGET" : "ACCELERATING";
    let renewColor = "text-emerald-600";
    
    let climateRes = "78.0%";
    let climateStatus = "HIGH";
    let climateColor = "text-[#0F4C81]";
    
    let coverage = "98.2%";
    let coverageStatus = "STABLE";
    let coverageColor = "text-emerald-600";
    
    let investIndex = "88.0%";
    let investStatus = "EXCELLENT";
    let investColor = "text-[#0F4C81]";
    
    let carbonRed = "-38.0%";
    let carbonStatus = "ON-TRACK";
    let carbonColor = "text-emerald-600";

    if (scopeType === "Region") {
      title = `${selectedRegion} Region Modernization Strategy`;
      focus = "Regional Sourcing • Grid Decongestion • STU Reliability";
      summary = `${selectedRegion} region investment strategy optimizes Bhadla, Kutch, Pavagada, and regional intertie loops to integrate ${renewableTarget}% local clean power while preventing localized substation overruns.`;
      
      if (selectedRegion === "West") {
        gridHealth = "86.8%";
        gridHealthStatus = "LOAD WARNING";
        gridHealthColor = "text-amber-600";
        climateRes = "68.0%";
        climateStatus = "MODERATE";
        climateColor = "text-amber-600";
        carbonRed = "-52.0%";
        carbonStatus = "LEADING";
        investIndex = "92.1%";
      } else if (selectedRegion === "North") {
        gridHealth = "88.5%";
        gridHealthStatus = "PEAK ACTIVE";
        gridHealthColor = "text-amber-600";
        climateRes = "72.0%";
        climateStatus = "CRITICAL LIMIT";
        climateColor = "text-rose-600";
        carbonRed = "-32.5%";
        carbonStatus = "ON-TRACK";
        investIndex = "86.0%";
      } else if (selectedRegion === "South") {
        gridHealth = "92.4%";
        gridHealthStatus = "OPTIMAL";
        gridHealthColor = "text-emerald-600";
        climateRes = "81.5%";
        climateStatus = "HIGH";
        climateColor = "text-emerald-600";
        carbonRed = "-44.0%";
        carbonStatus = "ON-TRACK";
        investIndex = "90.0%";
      } else if (selectedRegion === "East") {
        gridHealth = "74.2%";
        gridHealthStatus = "UPGRADE REQ";
        gridHealthColor = "text-rose-600";
        climateRes = "55.0%";
        climateStatus = "VOLATILE";
        climateColor = "text-amber-600";
        carbonRed = "-18.5%";
        carbonStatus = "DELAY RISK";
        carbonColor = "text-amber-600";
        investIndex = "65.0%";
      } else { // Central
        gridHealth = "94.0%";
        gridHealthStatus = "EXCELLENT";
        gridHealthColor = "text-emerald-600";
        climateRes = "88.0%";
        climateStatus = "HIGH";
        climateColor = "text-emerald-600";
        carbonRed = "-28.0%";
        carbonStatus = "ON-TRACK";
        investIndex = "94.0%";
      }
    } else if (scopeType === "Horizon") {
      title = `${selectedHorizon} Milestone Sourcing Blueprint`;
      focus = `Phase ${selectedHorizon === 2030 ? "I" : selectedHorizon === 2040 ? "II" : "III"} Target timeline • Clean Sourcing Goals`;
      summary = `The ${selectedHorizon} target timeline focuses on ${selectedHorizon === 2030 ? "high-density AMI telemetry grid retrofitting" : selectedHorizon === 2040 ? "utility-scale battery storage and offshore HVDC green links" : "universal zero-carbon hydrogen reserves and complete grid autonomy"}.`;
      
      if (selectedHorizon === 2030) {
        gridHealth = "92.1%";
        climateRes = "78.0%";
        carbonRed = "-24.5%";
        investIndex = "88.0%";
      } else if (selectedHorizon === 2040) {
        gridHealth = "91.5%";
        climateRes = "82.5%";
        carbonRed = "-38.0%";
        investIndex = "91.0%";
      } else { // 2050
        gridHealth = "94.8%";
        gridHealthStatus = "AUTONOMOUS";
        climateRes = "92.0%";
        climateStatus = "EXCELLENT";
        climateColor = "text-emerald-600";
        carbonRed = "-92.5%";
        carbonStatus = "NEAR ZERO";
        investIndex = "95.0%";
        investStatus = "VERIFIED";
      }
    } else {
      // If planningMode is Municipal or Rural, adapt
      if (planningMode === "MUNICIPAL") {
        return getModeDetails(); // fall back
      } else if (planningMode === "RURAL") {
        return getModeDetails(); // fall back
      }
    }

    return {
      title,
      focus,
      summary,
      kpis: [
        { label: "Grid Health Index", value: gridHealth, status: gridHealthStatus, color: gridHealthColor },
        { label: "Renewable Integration Score", value: renewMix, status: renewStatus, color: renewColor },
        { label: "Climate Resilience Score", value: climateRes, status: climateStatus, color: climateColor },
        { label: "Electrification Coverage", value: coverage, status: coverageStatus, color: coverageColor },
        { label: "Investment Readiness Index", value: investIndex, status: investStatus, color: investColor },
        { label: "Carbon Reduction Progress", value: carbonRed, status: carbonStatus, color: carbonColor },
      ]
    };
  };

  const details = getExecutiveDetails();

  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-3.5rem)] p-6 bg-[#F8FAFC] text-[#0F172A] select-text">
      {/* Background subtly styled watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#0F4C81_1px,transparent_1px)] [background-size:24px_24px] z-0"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5 bg-transparent">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-[#0F4C81] text-white rounded">
                EXECUTIVE CONTEXT
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold uppercase tracking-wider">
                {planningMode} PLANNING MODE ACTIVE
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
              NEXUS Grid Command Center
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Transforming infrastructure data into modernization decisions.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate(ActiveView.DIGITAL_TWIN)}
              className="px-3.5 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-[#475569] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">precision_manufacturing</span>
              DIGITAL TWIN
            </button>
            <button 
              onClick={() => onNavigate(ActiveView.SCENARIO_LABORATORY)}
              className="px-3.5 py-1.5 bg-[#0F4C81] hover:bg-[#2563EB] text-white rounded font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs font-bold">play_arrow</span>
              SIMULATE FUTURE SHOCK
            </button>
          </div>
        </div>

        {/* Strategic Alerts Panel */}
        <div id="strategic-alerts-panel" className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
          {/* Left panel header info */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C81]"></span>
            <div>
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Strategic Alerts Panel</h4>
              <span className="text-[8.5px] font-bold text-slate-450 uppercase tracking-wider font-mono">Active Alerts</span>
            </div>
          </div>

          {/* Active Alerts List as high-contrast static cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { text: "Cyclone Risk Elevated", region: "West Coast", icon: "cyclone", color: "text-amber-800 bg-amber-50/50 border-amber-200/60" },
              { text: "Renewable Curtailment Risk", region: "Rajasthan", icon: "wb_sunny", color: "text-amber-800 bg-amber-50/50 border-amber-200/60" },
              { text: "Transmission Congestion", region: "Delhi Corridor", icon: "thunderstorm", color: "text-rose-800 bg-rose-50/50 border-rose-200/60" },
              { text: "Planning Consensus Achieved", region: "Operational Standard", icon: "handshake", color: "text-emerald-800 bg-emerald-50/50 border-emerald-200/60" },
            ].map((alert, index) => (
              <div key={index} className={`flex items-center gap-2 p-2.5 border rounded-lg ${alert.color}`}>
                <span className="material-symbols-outlined text-[15px] shrink-0 font-bold opacity-90">{alert.icon}</span>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-black uppercase truncate leading-tight tracking-tight">{alert.text}</div>
                  <div className="text-[8.5px] font-medium opacity-80 font-mono tracking-wider">Zone: {alert.region}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Judge Pitch Hero Accent Card */}
        <div className="bg-white border-2 border-purple-100 text-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <span className="w-11 h-11 bg-purple-50 rounded-full flex items-center justify-center text-purple-700 text-3xl font-bold flex-shrink-0 border border-purple-200">
              <span className="material-symbols-outlined text-xl">rocket_launch</span>
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-purple-700">NEXUS Evaluation Fast-Track</h2>
              <p className="text-[11px] text-slate-600 mt-0.5 max-w-xl font-medium">
                Ready to review the full 60-second system cycle? Run our pre-compiled demonstration pathway.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap flex-shrink-0 w-full md:w-auto relative z-10">
            <button
              onClick={() => onNavigate(ActiveView.DEMO_STORY_MODE)}
              className="flex-1 md:flex-initial px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-purple-500"
            >
              <span className="material-symbols-outlined text-sm">play_circle</span>
              Start 60s Demo Pitch
            </button>
          </div>
        </div>

        {/* Dynamic Boardroom KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
          {details.kpis.map((k, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs flex flex-col justify-between hover:border-[#0F4C81] transition-all"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                {k.label}
              </div>
              <div className="mt-3.5">
                <div className={`font-mono text-2xl font-black ${k.color}`}>
                  {k.value}
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] font-mono leading-none">
                  <span className="text-slate-400 uppercase">STATUS:</span>
                  <span className="font-bold underline text-slate-700">{k.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Strategy Snapshot (Single, high-contrast, executive layout) */}
        <div className="bg-[#eff4ff] border border-[#cbdbf5] p-6 rounded-xl shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#cbdbf5]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0F4C81] text-lg font-black">gavel</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4C81]">
                {scopeType === "National"
                  ? "Recommended National Strategy Snapshot"
                  : scopeType === "Region"
                  ? `Recommended ${selectedRegion} Region Strategy Snapshot`
                  : `Recommended Year ${selectedHorizon} Milestone Strategy Snapshot`}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[8.5px] font-mono font-black bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              Pragmatic Compromise Plan Approved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200/80">
              <span className="text-[9px] font-mono text-slate-400 uppercase block font-black">Consensus Score</span>
              <span className="text-xl font-mono font-black text-slate-900 block mt-1.5 flex items-center gap-1">
                94.5% <span className="text-emerald-600 text-xs font-bold font-sans">High Alignment</span>
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200/80">
              <span className="text-[9px] font-mono text-slate-400 uppercase block font-black">Confidence Level</span>
              <span className="text-xl font-mono font-black text-[#0F4C81] block mt-1.5 font-sans">
                91.0% <span className="text-emerald-600 text-xs font-bold font-sans">Verified</span>
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200/80">
              <span className="text-[9px] font-mono text-slate-400 uppercase block font-black">Allocated CapEx</span>
              <span className="text-xl font-mono font-black text-slate-900 block mt-1.5">
                ₹{budgetCr.toLocaleString()} Cr <span className="text-slate-500 text-[10px] font-medium font-sans">Portfolio</span>
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200/80">
              <span className="text-[9px] font-mono text-slate-400 uppercase block font-black">Target Timeline</span>
              <span className="text-xl font-mono font-black text-slate-900 block mt-1.5">
                {scopeType === "Horizon" ? `Year ${selectedHorizon}` : "Year 2040"} <span className="text-slate-500 text-[10px] font-medium font-sans">Horizon</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-white/60 p-4 rounded-lg border border-[#e2e8f0]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block font-mono">
                WHY THIS STRATEGY INSURES BEST OUTCOMES
              </span>
              <ul className="mt-2.5 space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>Solves Northwest Intertie Corridor bottlenecks (capacity mismatch resolved by adding high-voltage links).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>Successfully integrates 61.1% green wind and solar arrays into core network.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                  <span>Retains strong public trust index with minimal municipal tariff increases.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/60 p-4 rounded-lg border border-[#e2e8f0] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-555 uppercase tracking-wider block font-mono">
                  EXECUTIVE ROADMAP TO ACTION
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                  "{details.summary}"
                </p>
              </div>
              <button 
                onClick={() => onNavigate(ActiveView.DECISION_TRACEABILITY)}
                className="mt-4 w-full py-2 bg-[#0F4C81] hover:bg-[#1E40AF] text-white rounded font-black text-[10.5px] uppercase tracking-wider text-center transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm font-black">verified_user</span>
                View Complete Executive Decision Package
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { INITIAL_STAKEHOLDERS } from "../data";
import { Stakeholder } from "../types";
import { usePlanningScope } from "../PlanningScopeContext";
import { StakeholderDelegates } from "./planning-council/StakeholderDelegates";
import { ConsensusStrategies } from "./planning-council/ConsensusStrategies";

interface StrategyKPIAlignment {
  stakeholderId: string;
  kpiName: string;
  score: number;
  status: "EXCELLENT" | "CONFORMING" | "CONSTRAINED" | "CRITICAL";
  justification: string;
}

interface ProposedStrategy {
  id: string;
  name: string;
  icon: string;
  description: string;
  primaryFocus: string;
  overallScore: number;
  kpiAlignments: Record<string, StrategyKPIAlignment>;
}

const PROPOSED_STRATEGIES: ProposedStrategy[] = [
  {
    id: "strategy-1",
    name: "Carbon-Neutral Fast-Track",
    icon: "forest",
    description: "Prioritizes immediate high-volume wind and solar integration backed by clean-state energy grants.",
    primaryFocus: "Renewable Decarbonization",
    overallScore: 82,
    kpiAlignments: {
      "stk-1": {
        stakeholderId: "stk-1",
        kpiName: "Regulatory Reliability Limit",
        score: 85,
        status: "EXCELLENT",
        justification: "Satisfies federal clean policy directives, avoiding any legislative penalties."
      },
      "stk-2": {
        stakeholderId: "stk-2",
        kpiName: "N-1 Contingency Safe Margin",
        score: 65,
        status: "CONFORMING",
        justification: "Relies heavily on battery reserves to combat localized multi-hour wind drops."
      },
      "stk-3": {
        stakeholderId: "stk-3",
        kpiName: "Wind/Green Power Mix Yield",
        score: 98,
        status: "EXCELLENT",
        justification: "Deploys Boreas offshore arrays ahead of timetable, maximizing renewable participation."
      },
      "stk-4": {
        stakeholderId: "stk-4",
        kpiName: "Consumer Tariff Rate Protection",
        score: 60,
        status: "CONSTRAINED",
        justification: "Heavy preliminary infrastructure build-out costs might trickle down to residential tariffs."
      },
      "stk-5": {
        stakeholderId: "stk-5",
        kpiName: "Portfolio ROI Margin",
        score: 45,
        status: "CONSTRAINED",
        justification: "Initial capex strains liquidity limits, delaying positive cash flow cycles."
      },
      "stk-6": {
        stakeholderId: "stk-6",
        kpiName: "Extreme Event Resiliency Score",
        score: 50,
        status: "CRITICAL",
        justification: "Vulnerable to multi-day solar/wind winter droughts without thermal fallback reserves."
      }
    }
  },
  {
    id: "strategy-2",
    name: "Hardened Resilient Microgrids",
    icon: "grid_view",
    description: "Focuses on grid sectoring, underground radial transmission lines, and regional battery banks.",
    primaryFocus: "Grid Hardening & Resiliency",
    overallScore: 88,
    kpiAlignments: {
      "stk-1": {
        stakeholderId: "stk-1",
        kpiName: "Regulatory Reliability Limit",
        score: 92,
        status: "EXCELLENT",
        justification: "Significantly decreases black start times and complies with highest risk mandates."
      },
      "stk-2": {
        stakeholderId: "stk-2",
        kpiName: "N-1 Contingency Safe Margin",
        score: 95,
        status: "EXCELLENT",
        justification: "Advanced loop isolators guarantee transmission rerouting safety is always fully backed."
      },
      "stk-3": {
        stakeholderId: "stk-3",
        kpiName: "Wind/Green Power Mix Yield",
        score: 55,
        status: "CONSTRAINED",
        justification: "Slows new solar array approvals to fund core heavy steel substations instead."
      },
      "stk-4": {
        stakeholderId: "stk-4",
        kpiName: "Consumer Tariff Rate Protection",
        score: 50,
        status: "CRITICAL",
        justification: "Extensive underground trenching costs require substantial rate-payer adjustments."
      },
      "stk-5": {
        stakeholderId: "stk-5",
        kpiName: "Portfolio ROI Margin",
        score: 70,
        status: "CONFORMING",
        justification: "Predictable utility returns are stable but direct rapid ROI margins remain flat."
      },
      "stk-6": {
        stakeholderId: "stk-6",
        kpiName: "Extreme Event Resiliency Score",
        score: 96,
        status: "EXCELLENT",
        justification: "Top-tier protection against high ambient climates, solar storms, and physical attacks."
      }
    }
  },
  {
    id: "strategy-3",
    name: "Capital Conservation Baseline",
    icon: "savings",
    description: "Adopt strict capex and portfolio capping. Postpones highly expensive grid projects to solidify current assets.",
    primaryFocus: "Capex & ROI Management",
    overallScore: 78,
    kpiAlignments: {
      "stk-1": {
        stakeholderId: "stk-1",
        kpiName: "Regulatory Reliability Limit",
        score: 55,
        status: "CONSTRAINED",
        justification: "Slight delays on mandatory compliance pathways risk federal non-compliance audits."
      },
      "stk-2": {
        stakeholderId: "stk-2",
        kpiName: "N-1 Contingency Safe Margin",
        score: 58,
        status: "CONSTRAINED",
        justification: "Operation margins are tight, postponing modern thermal sensor arrays of Zone 4."
      },
      "stk-3": {
        stakeholderId: "stk-3",
        kpiName: "Wind/Green Power Mix Yield",
        score: 40,
        status: "CRITICAL",
        justification: "Subsidies for clean integration frozen; wind participation capped at current baselines."
      },
      "stk-4": {
        stakeholderId: "stk-4",
        kpiName: "Consumer Tariff Rate Protection",
        score: 88,
        status: "EXCELLENT",
        justification: "Guarantees absolute consumer rate freezes by avoiding excessive modernization capex."
      },
      "stk-5": {
        stakeholderId: "stk-5",
        kpiName: "Portfolio ROI Margin",
        score: 98,
        status: "EXCELLENT",
        justification: "Locks in extremely low debt-service ratio, yielding peak capital ROI outcomes."
      },
      "stk-6": {
        stakeholderId: "stk-6",
        kpiName: "Extreme Event Resiliency Score",
        score: 35,
        status: "CRITICAL",
        justification: "Aging transformers on critical lines face high vulnerability to intense heatwaves."
      }
    }
  },
  {
    id: "strategy-4",
    name: "Pragmatic Compromise Council Plan",
    icon: "handshake",
    description: "Slightly curtails aggressive green targets to guarantee reliability and protect capex thresholds.",
    primaryFocus: "Stakeholder Consensus Balance",
    overallScore: 91,
    kpiAlignments: {
      "stk-1": {
        stakeholderId: "stk-1",
        kpiName: "Regulatory Reliability Limit",
        score: 82,
        status: "EXCELLENT",
        justification: "Meets reliability standards with safe headroom, avoiding legislative slippage."
      },
      "stk-2": {
        stakeholderId: "stk-2",
        kpiName: "N-1 Contingency Safe Margin",
        score: 80,
        status: "EXCELLENT",
        justification: "Provides comfortable operating capacity and solid telemetry grid indicators."
      },
      "stk-3": {
        stakeholderId: "stk-3",
        kpiName: "Wind/Green Power Mix Yield",
        score: 75,
        status: "CONFORMING",
        justification: "Progressive offshore wind phase-in is maintained with gas backup transitions."
      },
      "stk-4": {
        stakeholderId: "stk-4",
        kpiName: "Consumer Tariff Rate Protection",
        score: 78,
        status: "CONFORMING",
        justification: "Rate increase is flatly capped; balanced municipal cost distribution."
      },
      "stk-5": {
        stakeholderId: "stk-5",
        kpiName: "Portfolio ROI Margin",
        score: 75,
        status: "CONFORMING",
        justification: "ROI bounds preserved with minor compromises on premium experimental battery arrays."
      },
      "stk-6": {
        stakeholderId: "stk-6",
        kpiName: "Extreme Event Resiliency Score",
        score: 72,
        status: "CONFORMING",
        justification: "Pre-emptively islands radial loop sectors during extreme thermal loads."
      }
    }
  }
];

export const PlanningCouncil: React.FC = () => {
  const { scopeType, selectedRegion, selectedHorizon } = usePlanningScope();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(INITIAL_STAKEHOLDERS);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(INITIAL_STAKEHOLDERS[0]);
  const [resolutionRunning, setResolutionRunning] = useState<boolean>(false);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("strategy-4");

  // Re-generate stakeholders list when context shifts
  useEffect(() => {
    const newStakeholders = INITIAL_STAKEHOLDERS.map((stk) => {
      let objective = stk.objective;
      let concern = stk.concern;
      let tradeoffScore = stk.tradeoffScore;

      if (scopeType === "National") {
        // use default
      } else if (scopeType === "Region") {
        if (stk.id === "stk-1") {
          objective = `${selectedRegion} region resource compliance & local DisCoM clearances`;
          concern = `${selectedRegion} region regulatory delays & land disputes`;
          tradeoffScore = selectedRegion === "West" ? 75 : selectedRegion === "East" ? 70 : 85;
        } else if (stk.id === "stk-2") {
          objective = `Secure N-1 contingency margins for the ${selectedRegion} transmission grid`;
          concern = `${selectedRegion} regional line thermal limits & congestion points`;
          tradeoffScore = selectedRegion === "West" ? 65 : selectedRegion === "North" ? 80 : 70;
        } else if (stk.id === "stk-3") {
          objective = `Maximize ${selectedRegion} solar/wind dispatch to regional networks`;
          concern = `Lack of localized storage cells & STU grid capacity constraints in ${selectedRegion}`;
          tradeoffScore = selectedRegion === "West" ? 50 : selectedRegion === "East" ? 45 : 55;
        } else if (stk.id === "stk-4") {
          objective = `Protect ${selectedRegion} municipal tariffs & prevent urban load shedding`;
          concern = `Unequal distribution of cost burdens across ${selectedRegion} load centers`;
          tradeoffScore = selectedRegion === "North" ? 80 : 75;
        } else if (stk.id === "stk-5") {
          objective = `Achieve ROI targets for ${selectedRegion} modernizations`;
          concern = `Stranded asset risks for high-cost local installations in ${selectedRegion}`;
          tradeoffScore = selectedRegion === "Central" ? 95 : 85;
        } else if (stk.id === "stk-6") {
          objective = `Expose localized ${selectedRegion} weather stress failure points`;
          concern = selectedRegion === "West" ? "🌵 Desert dust storms & high-temperature transformer sags" : selectedRegion === "East" ? "🌲 Heavy forest storm line losses & flooding" : selectedRegion === "North" ? "⚡ Metropolitan winter loading peaks" : selectedRegion === "South" ? "🌊 Salty wind and coastal cyclone damage" : "🔀 Inter-regional transit loop surges";
          tradeoffScore = selectedRegion === "West" ? 25 : 35;
        }
      } else if (scopeType === "Horizon") {
        if (stk.id === "stk-1") {
          objective = `Transition to ${selectedHorizon} statutory clean energy benchmarks`;
          concern = `Early retirement of coal baseload assets & compliance penalties`;
          tradeoffScore = selectedHorizon === 2030 ? 70 : selectedHorizon === 2040 ? 80 : 90;
        } else if (stk.id === "stk-2") {
          objective = `Calibrate grid operations for ${selectedHorizon} peak demands`;
          concern = `Inertia loss from retiring steam turbines by ${selectedHorizon}`;
          tradeoffScore = selectedHorizon === 2030 ? 60 : selectedHorizon === 2040 ? 70 : 80;
        } else if (stk.id === "stk-3") {
          objective = `Scale renewable dispatch to ${selectedHorizon === 2030 ? "55%" : selectedHorizon === 2040 ? "70%" : "85%"} by target year`;
          concern = `Integrating volatile wind and solar arrays under ${selectedHorizon} constraints`;
          tradeoffScore = selectedHorizon === 2030 ? 55 : selectedHorizon === 2040 ? 65 : 75;
        } else if (stk.id === "stk-4") {
          objective = `Insure affordable rates during ${selectedHorizon} infrastructure buildouts`;
          concern = `Heavy tariff surcharges during Phase ${selectedHorizon === 2030 ? "I" : selectedHorizon === 2040 ? "II" : "III"} deployment`;
          tradeoffScore = selectedHorizon === 2030 ? 85 : selectedHorizon === 2040 ? 75 : 65;
        } else if (stk.id === "stk-5") {
          objective = `Maximize capital efficiency of Phase ${selectedHorizon === 2030 ? "I" : selectedHorizon === 2040 ? "II" : "III"} projects`;
          concern = `Financing high-cost battery/hydrogen reserves by ${selectedHorizon}`;
          tradeoffScore = selectedHorizon === 2030 ? 95 : selectedHorizon === 2040 ? 85 : 75;
        } else if (stk.id === "stk-6") {
          objective = `Harden grid against projected ${selectedHorizon} extreme climate trends`;
          concern = `Cascading overload failures under ${selectedHorizon === 2050 ? "CRITICAL" : selectedHorizon === 2040 ? "HIGH" : "MEDIUM"} climate stress`;
          tradeoffScore = selectedHorizon === 2030 ? 40 : selectedHorizon === 2040 ? 30 : 20;
        }
      }
      return {
        ...stk,
        objective,
        concern,
        tradeoffScore,
        isConflict: tradeoffScore < 45
      };
    });
    setStakeholders(newStakeholders);
    
    // Also update selectedStakeholder if one was selected
    if (selectedStakeholder) {
      const synched = newStakeholders.find(s => s.id === selectedStakeholder.id);
      if (synched) setSelectedStakeholder(synched);
    }
  }, [scopeType, selectedRegion, selectedHorizon]);

  // Geographic Disagreement Mapping Calculations
  const getRegionalConflictMetrics = () => {
    const gov = stakeholders.find(s => s.id === "stk-1")?.tradeoffScore ?? 50;
    const ops = stakeholders.find(s => s.id === "stk-2")?.tradeoffScore ?? 50;
    const dev = stakeholders.find(s => s.id === "stk-3")?.tradeoffScore ?? 50;
    const comm = stakeholders.find(s => s.id === "stk-4")?.tradeoffScore ?? 50;
    const inv = stakeholders.find(s => s.id === "stk-5")?.tradeoffScore ?? 50;

    const metroIntensity = Math.min(100, Math.max(10, Math.round(150 - (gov + comm + ops) / 2)));
    const desertIntensity = Math.min(100, Math.max(10, Math.round(135 - (dev + inv + comm) / 2.5)));
    const coastalIntensity = Math.min(100, Math.max(10, Math.round(125 - (gov + inv) / 1.8)));
    const ruralIntensity = Math.min(100, Math.max(5, Math.round(95 - (ops + comm) / 2)));

    return {
      METRO_NORTH: {
        title: "NCR Metro Grid Interface (North)",
        intensity: metroIntensity,
        parties: "Govt Utility vs Consumer Forum vs Despatch Ops",
        cause: metroIntensity > 60 
          ? "Critical active friction on metropolitan thermal line loads and EV fast-charge cost exemptions."
          : "Friction resolved: Comm tariffs subsidized under high-aligned operational compliance parameters."
      },
      DESERT_WEST: {
        title: "Thar Solar Generation Parks (West)",
        intensity: desertIntensity,
        parties: "Renewable Builders vs ESG Capital vs Consumers",
        cause: desertIntensity > 60
          ? "Investor groups resisting non-curtailment clauses due to long capital amortization horizons."
          : "Investor alignment achieved: Grid guarantees stable, long-term non-curtailment."
      },
      COASTAL_SOUTH: {
        title: "Coastal Marine Wind Interties (South)",
        intensity: coastalIntensity,
        parties: "National Ministry vs Direct ESG Syndicate",
        cause: coastalIntensity > 60
          ? "Government reliability penalties conflict with private sector liquidation limits."
          : "Frictional risk minimized: Federal backing mitigates offshore structural volatility."
      },
      RURAL_EAST: {
        title: "East Forest Agricultural Interlock",
        intensity: ruralIntensity,
        parties: "Consumer Forums vs System Load Despatchers",
        cause: ruralIntensity > 40
          ? "Sub-grid islanding disputes under active storm contingency scenarios."
          : "Sub-grid loops secured under balanced automatic islanding thresholds."
      }
    };
  };

  const getRegionalConflictColor = (key: "METRO_NORTH" | "DESERT_WEST" | "COASTAL_SOUTH" | "RURAL_EAST") => {
    const metric = getRegionalConflictMetrics()[key];
    if (metric.intensity > 70) return "rgba(239, 68, 68, 0.4)";
    if (metric.intensity > 40) return "rgba(245, 158, 11, 0.3)";
    return "rgba(16, 185, 129, 0.2)";
  };

  // Derive global consensus progress
  const getOverallConsensus = () => {
    const total = stakeholders.reduce((sum, stk) => sum + stk.tradeoffScore, 0);
    let avg = total / stakeholders.length;

    // Apply scaling factors representing regional friction or long-term alignment maturements
    if (scopeType === "Horizon") {
      if (selectedHorizon === 2030) {
        avg = avg * 0.90; // High friction during Phase 1 deployment buildouts
      } else if (selectedHorizon === 2040) {
        avg = avg * 1.05; // Improving consensus as regulatory frameworks lock in
      } else if (selectedHorizon === 2050) {
        avg = avg * 1.18; // Maximal zero-carbon community alignment
      }
    } else if (scopeType === "Region") {
      if (selectedRegion === "North" || selectedRegion === "South") {
        avg = avg * 1.04; // Metropolitan alignments are historically smoother
      } else if (selectedRegion === "West" || selectedRegion === "East") {
        avg = avg * 0.92; // Desert solar lease arguments or heavy tribal lands forest easements
      } else if (selectedRegion === "Central") {
        avg = avg * 1.08; // High baseline intertie approvals
      }
    }

    return Math.min(100, Math.round(avg));
  };

  // Adjust stakeholder trade-off weight
  const handleUpdateWeight = (id: string, newScore: number) => {
    const updated = stakeholders.map((stk) => {
      if (stk.id === id) {
        const isConflict = newScore < 45; // lower capacity raises conflict flags
        return { ...stk, tradeoffScore: newScore, isConflict };
      }
      return stk;
    });
    setStakeholders(updated);
    
    const found = updated.find((stk) => stk.id === id);
    if (found) {
      setSelectedStakeholder(found);
    }
  };

  // Conflict Resolution Engine simulation
  const handleTriggerResolution = () => {
    setResolutionRunning(true);
    setTimeout(() => {
      // Elevate low scorers to aligned thresholds (>55) to simulate real resolution compromises
      const resolved = stakeholders.map((stk) => {
        if (stk.tradeoffScore < 55) {
          return { ...stk, tradeoffScore: 68, isConflict: false };
        }
        return stk;
      });
      setStakeholders(resolved);
      setResolutionRunning(false);

      if (selectedStakeholder) {
        const synchedSelected = resolved.find((s) => s.id === selectedStakeholder.id);
        if (synchedSelected) setSelectedStakeholder(synchedSelected);
      }
    }, 1500);
  };

  // Custom boardroom supporting specs
  const getBoardroomAids = (role: string) => {
    switch (role.toLowerCase()) {
      case "government":
        return {
          priorityScore: "9.2/10",
          evidence: "Census data reports 18% rural communities suffer voltage instability during heating peak season.",
          recommendation: "Mandate +150MW regional grid ties and subsidize 20,000 valley microgrid cells.",
          disagreement: "Disagrees with Pure Capitalist model which postpones non-lucrative rural tie-backs."
        };
      case "finance":
      case "capital":
        return {
          priorityScore: "8.5/10",
          evidence: "Debt service ratios increase by 12% if capex budget ceiling exceeds ₹450 Cr without active ROI bounds.",
          recommendation: "Adopt strict portfolio capping. Prioritize projects with >12% estimated ROI margins first.",
          disagreement: "Disagrees with unlimited municipal EV charging subsidies without network access licensing fees."
        };
      case "environment":
      case "green":
        return {
          priorityScore: "9.5/10",
          evidence: "Postponing coal closures by 3 years exceeds regional baseline carbon metrics by 5.4 million tons.",
          recommendation: "Enforce a absolute lock-step fossil retirement timetable backed by Boreas offshore phase-ins.",
          disagreement: "Disagrees with gas-fueled backup turbine additions in downtown metropolitan neighborhoods."
        };
      case "risk":
      case "operator":
      default:
        return {
          priorityScore: "8.9/10",
          evidence: "Thermal line tolerances on S-14 corridor decrease by 20% when ambient regional climate spikes past 40°C.",
          recommendation: "Pre-emptively island radial loop sectors and secure 400MWh backup reserves at key transmission interties.",
          disagreement: "Disagrees with aggressive EV fleet fast-charge corridors without installing dynamic grid-edge throttling."
        };
    }
  };

  return (
    <div className="flex-1 overflow-hidden h-[calc(100vh-3.5rem)] flex flex-col bg-[#F8FAFC] text-[#0F172A] select-text border-t border-[#E2E8F0]">
      
      {/* Why Planning Council Exists explanation banner */}
      <div className="bg-white text-slate-900 border-b border-slate-200 p-4 shrink-0 transition-all z-20 shadow-sm select-text">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3 items-start">
            <span className="material-symbols-outlined text-[#0F4C81] text-2xl mt-0.5 md:mt-0 font-extrabold select-none">info</span>
            <div>
              <h2 className="text-xs font-black uppercase text-slate-900 tracking-wider">Why Planning Council Exists</h2>
              <p className="text-[11px] text-slate-600 mt-1 leading-normal font-sans font-medium">
                Grid modernization is not purely a technical problem.
                Government seeks affordability.
                Grid operators seek reliability.
                Investors seek return on investment.
                Renewable operators seek higher integration.
                Communities seek equitable access.
                The Planning Council evaluates these competing objectives and generates a balanced modernization strategy.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 shrink-0 self-end md:self-auto">
            <span className="text-[9px] font-mono bg-blue-50 text-[#0F4C81] border border-blue-200 px-2 py-1 rounded uppercase font-extrabold tracking-widest">
              Consensus-Based Planning Framework
            </span>
          </div>
        </div>
      </div>

      {/* Scope Context Banner Panel */}
      <div className="bg-[#eff4ff] border-b border-[#cbdbf5] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-700 text-sm font-bold">gavel</span>
          <span className="font-semibold text-slate-700">Council Active Focus:</span>
          <span className="font-black text-indigo-900 bg-white border border-[#cbdbf5] px-2.5 py-0.5 rounded uppercase font-mono shadow-sm">
            {scopeType} PLAN
          </span>
          {scopeType === "Region" && (
            <span className="text-slate-600">
              Evaluating local trade-offs for the <strong className="text-indigo-800">{selectedRegion} Region</strong>. {selectedRegion === "West" && "🌵 High Thar Desert solar land lease congestion."} {selectedRegion === "East" && "🌲 Tribal forest clearance easements & black-start compliance."} {selectedRegion === "North" && "⚡ Metropolitan EV fast-charging grid peaks."} {selectedRegion === "South" && "🌊 Deep offshore marine intertie stability concerns."} {selectedRegion === "Central" && "🔀 Cross-regional routing intertie optimization."}
            </span>
          )}
          {scopeType === "Horizon" && (
            <span className="text-slate-600">
              Aligning strategic assets for target timeline year <strong className="text-amber-700">{selectedHorizon}</strong>. Projected Consensus scales as early baseline capex debt service matures.
            </span>
          )}
          {scopeType === "National" && (
            <span className="text-slate-600">
              Integrating whole-country benchmarks across all five regional transmission corridors.
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Relative Consensus:</span>
          <span className={`font-black px-2 py-0.5 rounded text-[11px] font-mono shadow-sm ${
            getOverallConsensus() >= 80 ? "bg-emerald-100 text-emerald-800" : getOverallConsensus() >= 60 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
          }`}>
            {getOverallConsensus()}% {getOverallConsensus() >= 80 ? "HIGH ALIGNMENT" : "FRICTION RISK"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Modular Left Column */}
        <StakeholderDelegates
          stakeholders={stakeholders}
          selectedStakeholder={selectedStakeholder}
          setSelectedStakeholder={setSelectedStakeholder}
          getBoardroomAids={getBoardroomAids}
        />

        {/* MIDDLE COLUMN: NEGOTIATION WORKSPACE (flex-1) */}
        <section className="flex-1 overflow-y-auto p-6 relative flex flex-col justify-between">
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#0F4C81_1px,transparent_1px)] [background-size:20px_20px] z-0"></div>

          {/* Content Wrap */}
          <div className="space-y-6 relative z-10">
            
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="px-2 py-0.5 bg-[#0F4C81] text-white text-[9px] font-black uppercase tracking-wider rounded">
                  NEGOTIATION COMPROMISE HUD
                </span>
                <p className="text-slate-500 text-[10.5px] mt-1">Calibrate trade-offs and evaluate policy alignments on the core grid registry.</p>
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-bold">BOARDROOM SECURE</span>
            </div>

            {selectedStakeholder ? (
              <div className="space-y-5">
                
                {/* Member card */}
                <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-slate-200 ${selectedStakeholder.colorClass === "text-emerald-500" ? "!bg-emerald-500" : selectedStakeholder.colorClass === "text-red-500" ? "!bg-red-500" : "!bg-[#0F4C81]"}`}>
                      <span className="material-symbols-outlined">{selectedStakeholder.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#0F172A] leading-none">{selectedStakeholder.name}</h4>
                      <p className="text-xs text-[#0F4C81] font-bold mt-1 uppercase">{selectedStakeholder.role}</p>
                    </div>
                  </div>

                  {/* Sub details boxes of objectives, recommendations and evidence */}
                  <div className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Objectives & Recommendations */}
                      <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded">
                        <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">STAKEHOLDER POLICY ACTION REQ</span>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                          {getBoardroomAids(selectedStakeholder.role || selectedStakeholder.name).recommendation}
                        </p>
                      </div>

                      {/* Supporting Evidence */}
                      <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded">
                        <span className="text-[8.5px] font-bold text-[#0F4C81] uppercase tracking-wider block mb-1">VALIDATING DATA EVIDENCE</span>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                          {getBoardroomAids(selectedStakeholder.role || selectedStakeholder.name).evidence}
                        </p>
                      </div>
                    </div>

                    {/* Active Conflicts display */}
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-md flex gap-3 items-start">
                      <span className="material-symbols-outlined text-rose-600 text-lg mt-0.5">gpp_maybe</span>
                      <div>
                        <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wide block">ACTIVE BOARDROOM DISAGREEMENT</span>
                        <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                          {getBoardroomAids(selectedStakeholder.role || selectedStakeholder.name).disagreement}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* REGIONAL DISAGREEMENT GEOGRAPHIC HEATMAP */}
                <div id="regional-consensus-map" className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-sm space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-800 rounded font-black text-[9px] uppercase tracking-wide">
                      <span className="material-symbols-outlined text-[10px]">map</span>
                      Geographic Discordance Index
                    </span>
                    <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-wider mt-1">Regional Stakeholder Conflict Map</h4>
                    <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-semibold">Active divergence mapping between Govt, Finance, and Local Community objectives.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                    {/* Dynamic Visual interactive Map layout (left side grid: 6 cols) */}
                    <div className="lg:col-span-6 relative bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-center items-center overflow-hidden min-h-[220px]">
                      <div className="absolute top-2 left-2 text-[8px] font-bold text-slate-450 font-mono tracking-widest uppercase">GEOGRAPHIC GIS GRID SECTORS</div>
                      
                      {/* SVG rendering the abstract regions with colors reflecting conflict levels */}
                      <svg className="w-full max-w-[200px] h-auto aspect-square py-2" viewBox="0 0 100 100" fill="none">
                        {/* N Region: Metropolitan Grid */}
                        <path 
                          d="M20,20 Q50,10 80,20 L75,50 Q50,45 25,50 Z" 
                          fill={getRegionalConflictColor("METRO_NORTH")} 
                          stroke="#475569" 
                          strokeWidth="1.2" 
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                        {/* W Region: Western Solar Desert */}
                        <path 
                          d="M20,20 L25,50 Q45,55 50,85 L15,80 Z" 
                          fill={getRegionalConflictColor("DESERT_WEST")} 
                          stroke="#475569" 
                          strokeWidth="1.2" 
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                        {/* S Region: Coastal Offshore Wind */}
                        <path 
                          d="M25,50 Q50,45 75,50 L80,80 Q50,90 50,85 Z" 
                          fill={getRegionalConflictColor("COASTAL_SOUTH")} 
                          stroke="#475569" 
                          strokeWidth="1.2" 
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                        {/* Central / East Region */}
                        <polygon 
                          points="25,50 50,45 75,50 50,85" 
                          fill={getRegionalConflictColor("RURAL_EAST")} 
                          stroke="#475569" 
                          strokeWidth="1.2" 
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                        
                        {/* Labels overlay */}
                        <text x="50" y="24" textAnchor="middle" fill="#0f172a" className="text-[5.5px] font-black font-sans uppercase tracking-wider select-none">NCR METRO</text>
                        <text x="31" y="61" textAnchor="middle" fill="#0f172a" className="text-[5.5px] font-black font-sans uppercase tracking-wider select-none">WEST SUN</text>
                        <text x="65" y="70" textAnchor="middle" fill="#0f172a" className="text-[5.5px] font-black font-sans uppercase tracking-wider select-none">COASTAL S</text>
                        <text x="51" y="52" textAnchor="middle" fill="#0f172a" className="text-[5.5px] font-black font-sans uppercase tracking-wider select-none">EAST TIES</text>
                      </svg>
                    </div>

                    {/* Regional detail logs & dynamic intensity calculations (right side details: 6 cols) */}
                    <div className="lg:col-span-6 space-y-3">
                      {Object.entries(getRegionalConflictMetrics()).map(([key, item]) => (
                        <div key={key} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col gap-1.5 hover:bg-slate-100 transition-colors">
                          <div className="flex justify-between items-center leading-none">
                            <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-tight">{item.title}</span>
                            <span className={`font-mono text-[9px] font-black tracking-wide ${item.intensity > 70 ? "text-rose-600" : item.intensity > 40 ? "text-amber-600" : "text-emerald-600"}`}>
                              {item.intensity}% conflict
                            </span>
                          </div>
                          
                          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-350 ${item.intensity > 70 ? "bg-rose-500 animate-pulse" : item.intensity > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${item.intensity}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex gap-1 text-[8.5px] text-slate-500 leading-tight font-medium">
                            <span className="font-extrabold text-[#0F4C81] uppercase tracking-wide shrink-0">Actors:</span>
                            <span className="truncate">{item.parties}</span>
                          </div>
                          <p className="text-[9.5px] italic text-slate-600 leading-tight">"{item.cause}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trade-off Sliders workspace */}
                <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Compromise Alignment Weight</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 uppercase">Adjust trade-offs. Score &lt; 45% triggers policy conflict warnings.</p>
                    </div>
                    <span className={`font-mono text-xl font-black ${selectedStakeholder.tradeoffScore < 45 ? "text-rose-600" : "text-[#0F4C81]"}`}>
                      {selectedStakeholder.tradeoffScore}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="range"
                      min={10}
                      max={100}
                      value={selectedStakeholder.tradeoffScore}
                      onChange={(e) => handleUpdateWeight(selectedStakeholder.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0F4C81] focus:outline-none" 
                    />
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase leading-none">
                      <span>CONSERVATIVE / RIGID (0%)</span>
                      <span>HIGH ALIGNED / COMPROMISING (100%)</span>
                    </div>
                  </div>
                </div>

                {/* Impact Drill-down Strategy Alignments Panel */}
                <div id="impact-drilldown-panel" className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2 bg-amber-50 border border-amber-200 text-amber-800 rounded py-0.5 mb-1 text-[9px] font-black uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[10px]">analytics</span>
                        Strategy KPI Analyzer
                      </span>
                      <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-wide">Impact Drill-down</h4>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Evaluate how proposed board strategies align with stakeholder seat KPIs.</p>
                    </div>
                    
                    {/* Dropdown selector */}
                    <div>
                      <select
                        value={selectedStrategyId}
                        onChange={(e) => setSelectedStrategyId(e.target.value)}
                        className="bg-[#eff4ff] border border-blue-200 text-[#0F4C81] text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F4C81] cursor-pointer"
                      >
                        {PROPOSED_STRATEGIES.map((strat) => (
                          <option key={strat.id} value={strat.id}>
                            {strat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const activeStrat = PROPOSED_STRATEGIES.find(s => s.id === selectedStrategyId) || PROPOSED_STRATEGIES[3];
                    return (
                      <div className="space-y-4">
                        {/* Description Header block */}
                        <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded flex items-start gap-3">
                          <div className="w-9 h-9 rounded bg-[#eff4ff] flex items-center justify-center text-[#0F4C81] mt-0.5 flex-shrink-0">
                            <span className="material-symbols-outlined text-lg">{activeStrat.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-extrabold text-slate-800">{activeStrat.name}</span>
                              <span className="text-[9px] font-mono font-black text-[#0F4C81] bg-blue-50 px-1.5 py-0.5 rounded">
                                FIT INDEX: {activeStrat.overallScore}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 font-semibold leading-relaxed">
                              {activeStrat.description}
                            </p>
                            <div className="mt-1.5 text-[9px] font-mono font-bold text-[#0F4C81] uppercase tracking-wider">
                              🎯 PRIMARY FOCUS: {activeStrat.primaryFocus}
                            </div>
                          </div>
                        </div>

                        {/* Direct Dual Metric Focus: Investment vs. Reliability */}
                        <div className="bg-slate-50/50 p-3.5 border border-[#E2E8F0] rounded-lg">
                          <span className="text-[9px] font-black text-[#0F4C81] uppercase tracking-wider block mb-2 font-mono">
                            Core Trade-off Focus: Investment vs. Reliability
                          </span>
                          
                          {(() => {
                            const investmentAlign = activeStrat.kpiAlignments["stk-5"]?.score || 50;
                            const reliabilityAlign = activeStrat.kpiAlignments["stk-1"]?.score || 50;

                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Investment side (stk-5) */}
                                <div className="bg-white p-3 rounded border border-slate-200">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-1 leading-none">
                                      <span className="material-symbols-outlined text-xs text-emerald-600">payments</span>
                                      Capital (Investment) Max KPI
                                    </span>
                                    <span className="font-mono text-[11px] font-black text-[#004c69]">{investmentAlign}%</span>
                                  </div>
                                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                                    <div className="h-full bg-sky-600 rounded-full" style={{ width: `${investmentAlign}%` }}></div>
                                  </div>
                                  <p className="text-[9.5px] text-slate-500 font-semibold leading-tight">
                                    {activeStrat.kpiAlignments["stk-5"]?.justification}
                                  </p>
                                </div>

                                {/* Reliability side (stk-1) */}
                                <div className="bg-white p-3 rounded border border-slate-200">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-1 leading-none">
                                      <span className="material-symbols-outlined text-xs text-blue-600 font-bold">bolt</span>
                                      Reliability Standards compliance
                                    </span>
                                    <span className="font-mono text-[11px] font-black text-blue-700">{reliabilityAlign}%</span>
                                  </div>
                                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                                    <div className="h-full bg-[#0F4C81] rounded-full" style={{ width: `${reliabilityAlign}%` }}></div>
                                  </div>
                                  <p className="text-[9.5px] text-slate-500 font-semibold leading-tight">
                                    {activeStrat.kpiAlignments["stk-1"]?.justification}
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Complete Stakeholder KPI List */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                            Stakeholder KPI Alignments
                          </span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {stakeholders.map((stk) => {
                              const alignment = activeStrat.kpiAlignments[stk.id];
                              if (!alignment) return null;
                              const statusStyles = 
                                alignment.status === "EXCELLENT" 
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                                  : alignment.status === "CONFORMING"
                                    ? "bg-sky-50 text-blue-800 border-blue-100"
                                    : alignment.status === "CONSTRAINED"
                                      ? "bg-amber-50 text-amber-800 border-amber-100"
                                      : "bg-rose-50 text-rose-800 border-rose-100";

                              return (
                                <div key={stk.id} className="p-3 bg-white border border-slate-200 rounded-lg hover:border-[#0F4C81]/30 transition-colors">
                                  <div className="flex justify-between items-start gap-1">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-slate-500 text-sm">{stk.icon}</span>
                                        <span className="text-[11px] font-extrabold text-slate-900 truncate block">{stk.name}</span>
                                      </div>
                                      <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wider block mt-0.5 truncate">{alignment.kpiName}</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 text-[8px] font-black rounded border flex-shrink-0 uppercase font-mono ${statusStyles}`}>
                                      {alignment.status}
                                    </span>
                                  </div>

                                  {/* Alignment bar */}
                                  <div className="mt-2 text-slate-700">
                                    <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase leading-none mb-1">
                                      <span className="text-slate-400">Alignment Fit</span>
                                      <span className="text-[#0F4C81]">{alignment.score}%</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${
                                          alignment.status === "EXCELLENT" 
                                            ? "bg-emerald-500" 
                                            : alignment.status === "CONFORMING"
                                              ? "bg-sky-500"
                                              : alignment.status === "CONSTRAINED"
                                                ? "bg-amber-500"
                                                : "bg-rose-500"
                                        }`} 
                                        style={{ width: `${alignment.score}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  <p className="text-[10px] text-slate-500 mt-2 font-semibold leading-relaxed">
                                    {alignment.justification}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-wide">
                No Board Member Selected. Click on any cards to begin.
              </div>
            )}

          </div>

          {/* Dynamic Conflict Resolution Engine Trigger Action */}
          <div className="pt-4 border-t border-[#E2E8F0] bg-white p-4 sticky bottom-0 z-20">
            <div className="flex flex-col gap-2">
              <button 
                disabled={resolutionRunning}
                onClick={handleTriggerResolution}
                className="w-full py-2.5 bg-[#0F4C81] hover:bg-[#2563EB] text-white rounded font-bold text-[11px] uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">mediation</span>
                {resolutionRunning ? "RUNNING CONFLICT ALIGNER..." : "EXECUTE CONFLICT RESOLUTION SOLVER"}
              </button>
              <span className="text-[9.5px] text-slate-450 text-center leading-none">
                Runs heuristic alignment iterations to optimize stakeholder weights above conflicting thresholds automatically.
              </span>
            </div>
          </div>
        </section>

        {/* Modular Right Column */}
        <ConsensusStrategies
          stakeholders={stakeholders}
          overallConsensus={getOverallConsensus()}
        />

      </div>
    </div>
  );
};

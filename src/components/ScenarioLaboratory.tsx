import React, { useState, useEffect } from "react";
import { ScenarioParameters } from "../types";
import { usePlanningScope } from "../PlanningScopeContext";

export const ScenarioLaboratory: React.FC<{ onNavigate?: (view: any) => void }> = ({ onNavigate }) => {
  const { scopeType, selectedRegion, selectedHorizon, renewableTarget } = usePlanningScope();

  // Master mode switcher: SANDBOX, FUTURE_SHOCK, ROADMAP, BRANCHING
  const [activeTab, setActiveTab] = useState<"SANDBOX" | "FUTURE_SHOCK" | "ROADMAP" | "BRANCHING">("FUTURE_SHOCK");

  // Sync Roadmap Phase to Selected Horizon globally
  useEffect(() => {
    if (scopeType === "Horizon") {
      setActiveRoadmapPhase(selectedHorizon);
    }
  }, [scopeType, selectedHorizon]);

  // Synchronize sandbox parameters and shock variables off global Planning Context
  useEffect(() => {
    if (scopeType === "Horizon") {
      setParams((prev) => ({
        ...prev,
        renewableTarget: renewableTarget,
        evAdoption: selectedHorizon === 2030 ? 40 : selectedHorizon === 2040 ? 65 : 85,
        populationGrowth: selectedHorizon === 2030 ? 1.0 : selectedHorizon === 2040 ? 1.5 : 2.0,
      }));
      setShockEv(selectedHorizon === 2030 ? 50 : selectedHorizon === 2040 ? 70 : 90);
      setShockRenewable(renewableTarget);
      setNewBaseScenario(`Projected ${selectedHorizon} Grid-Inertia Depletion`);
    } else if (scopeType === "Region") {
      setParams((prev) => ({
        ...prev,
        renewableTarget: renewableTarget,
        evAdoption: selectedRegion === "North" ? 50 : selectedRegion === "South" ? 45 : 35,
        populationGrowth: 1.2
      }));
      setShockRenewable(renewableTarget);
      setShockEv(65);
      setNewBaseScenario(`${selectedRegion} Region Solar Curtailment Baseline`);
    } else {
      setParams((prev) => ({
        ...prev,
        renewableTarget: 70,
        evAdoption: 40,
        populationGrowth: 1.2
      }));
      setShockRenewable(75);
      setShockEv(65);
      setNewBaseScenario("National Heatwave Thermal Peak");
    }
  }, [scopeType, selectedRegion, selectedHorizon, renewableTarget]);

  // --- Sub-Tab 4: Visual What-If Branching States ---
  interface WhatIfBranch {
    id: string;
    name: string;
    baseScenario: string;
    mitigationStrategy: string;
    mitigationIntensity: number;
    extraCapex: number;
    projectedStability: number;
    avoidedOutagesPct: number;
    regionalGdpMultiplier: number;
    timestamp: string;
  }

  const [branches, setBranches] = useState<WhatIfBranch[]>([
    {
      id: "branch-1",
      name: "Extreme Heat + VPP Aggregation Grid",
      baseScenario: "Baseline Heatwave Thermal Peak",
      mitigationStrategy: "Virtual Power Plants (VPP)",
      mitigationIntensity: 80,
      extraCapex: 1200,
      projectedStability: 96.8,
      avoidedOutagesPct: 88,
      regionalGdpMultiplier: 1.65,
      timestamp: "10 mins ago"
    },
    {
      id: "branch-2",
      name: "Extreme Heat + Microgrid Islanding Loops",
      baseScenario: "Baseline Heatwave Thermal Peak",
      mitigationStrategy: "Agricultural Solar Islanding Feeders",
      mitigationIntensity: 65,
      extraCapex: 750,
      projectedStability: 93.4,
      avoidedOutagesPct: 74,
      regionalGdpMultiplier: 1.38,
      timestamp: "5 mins ago"
    }
  ]);

  // Form states for creating new custom branches
  const [newBranchName, setNewBranchName] = useState<string>("Heatwave + Hydro-Storage Buffer");
  const [newBaseScenario, setNewBaseScenario] = useState<string>("Baseline Heatwave Thermal Peak");
  const [newMitigationStrategy, setNewMitigationStrategy] = useState<string>("Virtual Power Plants (VPP)");
  const [newMitigationIntensity, setNewMitigationIntensity] = useState<number>(75);
  const [newExtraCapex, setNewExtraCapex] = useState<number>(1500);

  // --- Sub-Tab 1: Standard Policy Simulation States ---
  const [params, setParams] = useState<ScenarioParameters>({
    evAdoption: 40,
    populationGrowth: 1.2,
    renewableTarget: 80,
    storageFirmness: false,
    hydrogenReady: true,
    carbonCapture: true,
  });
  const [calculating, setCalculating] = useState<boolean>(false);
  const [lastCalculationTime, setLastCalculationTime] = useState<string>("15:10:14 GMT");

  // --- Sub-Tab 2: Future Shock Simulation States ---
  const [shockEv, setShockEv] = useState<number>(65);
  const [shockRenewable, setShockRenewable] = useState<number>(75);
  const [shockIndustrial, setShockIndustrial] = useState<number>(3); // Level 1 - 5
  const [shockRetireFossil, setShockRetireFossil] = useState<number>(80); // percentage

  const [shockSimulating, setShockSimulating] = useState<boolean>(false);
  const [shockStep, setShockStep] = useState<number>(0); // 0 (Idle) to 4 (Complete)
  const [shockLogs, setShockLogs] = useState<string[]>([]);
  
  // Real-time metrics updating during shock simulation
  const [projectedReliability, setProjectedReliability] = useState<number>(99.8);
  const [investmentReq, setInvestmentReq] = useState<string>("₹150 Cr");
  const [renewableImpact, setRenewableImpact] = useState<number>(54);
  const [carbonReduction, setCarbonReduction] = useState<number>(32);

  const [activeRoadmapPhase, setActiveRoadmapPhase] = useState<2030 | 2040 | 2050>(2030);

  // --- Calculations for Tab 1 (Sandbox) ---
  const getOpexSavings = () => {
    const baseSavings = (params.renewableTarget / 100) * 15 + (params.evAdoption / 100) * 8;
    return Number(baseSavings.toFixed(1));
  };
  const getPeakLoad = () => {
    const load = 10 + (params.populationGrowth * 1.5) + (params.evAdoption * 0.06);
    return Number(load.toFixed(1));
  };
  const getEmissionsOffset = () => {
    return Math.round(params.renewableTarget * 0.85);
  };

  const handleRecalculateAll = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      const now = new Date();
      setLastCalculationTime(`${now.toTimeString().split(" ")[0]} GMT`);
    }, 1100);
  };

  // --- Interactive Animation Controller for Tab 2 (Future Shock Arena) ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (shockSimulating) {
      if (shockStep < 4) {
        timer = setTimeout(() => {
          const nextStep = shockStep + 1;
          setShockStep(nextStep);
          updateShockMetricsForStep(nextStep);
        }, 2200); // 2.2 seconds per stage for dramatic demonstration
      } else {
        setShockSimulating(false);
        setShockLogs((prev) => [...prev, "[SUCCESS] Cascade complete. Dynamic islanding algorithms & high opex reserves secured total recovery."]);
      }
    }
    return () => clearTimeout(timer);
  }, [shockSimulating, shockStep]);

  const updateShockMetricsForStep = (step: number) => {
    // Generate logarithmic stats step by step to represent thermal propagation
    switch (step) {
      case 1:
        setShockLogs((prev) => [
          ...prev, 
          `[STAGE 1] EV adoption surge (${shockEv}%) triggers primary distribution feeder bottlenecks. Thermal limit alerts logged on Northwest tie-ins.`
        ]);
        setProjectedReliability(98.4);
        setInvestmentReq(`$${(22 * shockIndustrial).toFixed(1)}M`);
        setRenewableImpact(Math.round(shockRenewable * 0.6));
        setCarbonReduction(24);
        break;
      case 2:
        setShockLogs((prev) => [
          ...prev, 
          `[STAGE 2] Industrial zones (x${shockIndustrial}) online. Aggregate peak load spikes by ${1.5 * shockIndustrial} GW with critical substation overruns.`
        ]);
        setProjectedReliability(95.1);
        setInvestmentReq(`$${(110 * shockIndustrial).toFixed(1)}M`);
        setRenewableImpact(Math.round(shockRenewable * 0.8));
        setCarbonReduction(41);
        break;
      case 3:
        setShockLogs((prev) => [
          ...prev, 
          `[STAGE 3] Baseload thermal retirement (${shockRetireFossil}%) active. Mainline grid inertia decreases, raising dynamic frequency sags.`
        ]);
        setProjectedReliability(91.2);
        setInvestmentReq(`$${(380 + 40 * shockIndustrial).toFixed(1)}M`);
        setRenewableImpact(shockRenewable);
        setCarbonReduction(62);
        break;
      case 4:
        setShockLogs((prev) => [
          ...prev, 
          `[STAGE 4] Congestion peaks. Re-routing loop triggered via battery secondary reserve. Grid islanded segments stabilizing.`
        ]);
        setProjectedReliability(96.8); // recovery!
        setInvestmentReq(`$${(640 + 75 * shockIndustrial).toFixed(1)}M`);
        setRenewableImpact(shockRenewable);
        setCarbonReduction(Math.round(shockRenewable * 0.95));
        break;
      default:
        break;
    }
  };

  const handleStartShockSimulation = () => {
    setShockStep(0);
    setShockLogs(["[INITIATE] Command Room: Grid dynamic stress testing sequence armed."]);
    setProjectedReliability(99.8);
    setInvestmentReq("₹150 Cr");
    setRenewableImpact(30);
    setCarbonReduction(10);
    setShockSimulating(true);
  };

  const handleSpawnBranch = () => {
    if (!newBranchName.trim()) return;
    
    // Core base metrics depending on selected scenario
    let baseRatio = 82.5; 
    if (newBaseScenario.includes("Inundation")) baseRatio = 75.8;
    if (newBaseScenario.includes("EV Fleet")) baseRatio = 81.2;

    const computedStability = Math.min(99.9, Number((baseRatio + (newMitigationIntensity * 0.14) + (newExtraCapex / 1300) * 1.5).toFixed(1)));
    const computedAvoidedOutages = Math.min(99, Math.round(newMitigationIntensity * 0.85 + (newExtraCapex / 1800) * 12));
    const computedGdpMultiplier = Number((1.1 + (newExtraCapex / 3500) * 1.25).toFixed(2));

    const newBranch: WhatIfBranch = {
      id: `branch-dynamic-${Date.now()}`,
      name: newBranchName,
      baseScenario: newBaseScenario,
      mitigationStrategy: newMitigationStrategy,
      mitigationIntensity: newMitigationIntensity,
      extraCapex: newExtraCapex,
      projectedStability: computedStability,
      avoidedOutagesPct: computedAvoidedOutages,
      regionalGdpMultiplier: computedGdpMultiplier,
      timestamp: "Just now"
    };

    setBranches([newBranch, ...branches]);
    setNewBranchName("");
  };

  return (
    <div className="flex-1 overflow-hidden h-[calc(100vh-3.5rem)] flex bg-[#F8FAFC] select-text border-t border-[#E2E8F0]">
      
      {/* Center-Left Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-[#E2E8F0]">
        
        {/* Compact Page Header */}
        <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-linear-to-r from-blue-50/20 to-transparent pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest bg-[#0F4C81] text-white rounded">
                  INTEGRATED RESOURCE PLANNING
                </span>
                <span className="px-2 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 rounded">
                  SIMULATION DECK
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2 mt-1.5">
                <span className="material-symbols-outlined text-[#0F4C81] font-black">science</span>
                Scenario & Roadmap Laboratory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Evaluate modernization pathways, infrastructure stress events, and long-term planning scenarios.
              </p>
            </div>
            
            {/* Metadata Cards in Header */}
            <div className="flex flex-wrap gap-2 text-[10.5px]">
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex flex-col justify-between min-w-[90px]">
                <span className="text-[7.5px] font-mono text-slate-400 font-bold block uppercase leading-none">Planning Context</span>
                <span className="font-extrabold text-slate-700 mt-0.5">{scopeType} Planning</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex flex-col justify-between min-w-[120px] max-w-[200px]">
                <span className="text-[7.5px] font-mono text-slate-400 font-bold block uppercase leading-none">Scenario Name</span>
                <span className="font-extrabold text-slate-700 mt-0.5 truncate">{newBaseScenario}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex flex-col justify-between min-w-[80px]">
                <span className="text-[7.5px] font-mono text-slate-400 font-bold block uppercase leading-none">Scope</span>
                <span className="font-extrabold text-slate-700 mt-0.5">
                  {scopeType === "Region" ? selectedRegion : scopeType === "Horizon" ? `${selectedHorizon}` : "National"}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex flex-col justify-between min-w-[90px]">
                <span className="text-[7.5px] font-mono text-slate-400 font-bold block uppercase leading-none">Target Horizon</span>
                <span className="font-extrabold text-[#0F4C81] mt-0.5">Horizon {selectedHorizon}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Selection Row */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">SIMULATION STATUS: READY</span>
          </div>
          <div className="bg-slate-100 border border-slate-200 rounded p-1 flex gap-1 shadow-inner">
            <button 
              onClick={() => setActiveTab("SANDBOX")}
              className={`px-3 py-1 text-[10px] uppercase font-black tracking-wide rounded cursor-pointer transition-colors ${
                activeTab === "SANDBOX" 
                  ? "bg-[#0F4C81] text-white" 
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              Policy Sandbox
            </button>
            <button 
              onClick={() => { setActiveTab("FUTURE_SHOCK"); if (shockStep === 0) { handleStartShockSimulation(); } }}
              className={`px-3 py-1 text-[10px] uppercase font-black tracking-wide rounded cursor-pointer transition-all flex items-center gap-1 ${
                activeTab === "FUTURE_SHOCK" 
                  ? "bg-[#0F4C81] text-white" 
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-xs">bolt</span>
              "Future Shock" Arena
            </button>
            <button 
              onClick={() => setActiveTab("ROADMAP")}
              className={`px-3 py-1 text-[10px] uppercase font-black tracking-wide rounded cursor-pointer transition-colors ${
                activeTab === "ROADMAP" 
                  ? "bg-[#0F4C81] text-white" 
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              Strategic Roadmap
            </button>
            <button 
              onClick={() => setActiveTab("BRANCHING")}
              className={`px-3 py-1 text-[10px] uppercase font-black tracking-wide rounded cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === "BRANCHING" 
                  ? "bg-indigo-600 text-white" 
                  : "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/50"
              }`}
            >
              <span className="material-symbols-outlined text-xs">fork_right</span>
              "What-If" Branching Lab
            </button>
          </div>
        </div>

        {/* Scrollable Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#0F4C81_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

          {/* Methodology & Separation Integrity Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 shadow-xs">
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-[#0F4C81] bg-blue-50 p-2.5 rounded-lg border border-blue-100 text-xl font-bold">schema</span>
              <div>
                <h2 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider">Methodology & Separation Integrity</h2>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5 font-semibold">
                  This laboratory maintains strict architectural boundaries: <span className="text-[#0F4C81] font-bold">Observed Historical Reality</span> (audited public databases) serves as the baseline, while all future modernizations are clearly flagged as <span className="text-amber-705 font-bold">Scenario Forward Projections</span>.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded flex items-center gap-1.5 text-emerald-800 text-[10px] font-black uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Observed Baseline (2025)
              </div>
              <div className="bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded flex items-center gap-1.5 text-amber-800 text-[10px] font-black uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                Scenario Projections ({activeRoadmapPhase})
              </div>
            </div>
          </div>

          {/* ======================= TAB 1: STANDARD SANDBOX ======================= */}
          {activeTab === "SANDBOX" && (
            <div className="space-y-6 relative z-10 transition-opacity duration-300">
              {calculating && (
                <div className="absolute inset-0 z-40 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center">
                  <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xl text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-[#0F4C81] animate-spin">sync</span>
                    <p className="text-xs font-bold text-slate-800 mt-2 uppercase tracking-wide">Evaluating Policy Trajectories...</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Baseline view */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-extrabold flex items-center gap-1.5 uppercase text-slate-700">
                      <span className="w-1.5 h-3 bg-slate-400 rounded"></span> Business as Usual
                    </h3>
                    <span className="font-mono text-[9px] text-slate-400 uppercase">Baseline v1.4</span>
                  </div>
                  
                  <div className="h-44 bg-slate-50 rounded-xl flex items-end justify-between px-6 pb-2 pt-8 gap-3 border border-slate-200">
                    <div className="flex-1 bg-slate-200 h-[40%] rounded-t-sm"></div>
                    <div className="flex-1 bg-slate-200 h-[55%] rounded-t-sm"></div>
                    <div className="flex-1 bg-slate-200 h-[65%] rounded-t-sm"></div>
                    <div className="flex-1 bg-slate-200 h-[72%] rounded-t-sm"></div>
                    <div className="flex-1 bg-slate-300 h-[80%] rounded-t-sm relative">
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow text-left pointer-events-none">
                        <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">Peak load 2040</span>
                        <span className="font-mono text-xs font-black text-slate-800 block">14.2 GW</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                    <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Emissions trend</p>
                      <p className="font-mono font-bold text-rose-600 mt-1.5">+12% YoY</p>
                    </div>
                    <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Opex baseline</p>
                      <p className="font-mono font-bold text-slate-800 mt-1.5">₹2,100 Cr / yr</p>
                    </div>
                    <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Projected SAIDI</p>
                      <p className="font-mono font-bold text-emerald-600 mt-1.5">99.9%</p>
                    </div>
                  </div>
                </div>

                {/* Dynamic simulated values */}
                <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs ring-4 ring-[#0F4C81]/5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-extrabold flex items-center gap-1.5 uppercase text-[#0F4C81]">
                      <span className="w-1.5 h-3 bg-[#0F4C81] rounded"></span> Active Policy Target
                    </h3>
                    <span className="text-[8.5px] text-[#0F4C81] font-extrabold bg-[#eff4ff] px-1.5 py-0.5 rounded leading-none">
                      CALIBRATED Trajectory
                    </span>
                  </div>

                  <div className="h-44 bg-[#eff4ff]/20 rounded-xl flex items-end justify-between px-6 pb-2 pt-8 gap-3 border border-[#cbdbf5]">
                    <div className="flex-1 bg-[#0F4C81]/30 h-[28%] rounded-t-sm"></div>
                    <div className="flex-1 bg-[#0F4C81]/45 h-[40%] rounded-t-sm"></div>
                    <div className="flex-1 bg-[#0F4C81]/60 h-[50%] rounded-t-sm"></div>
                    <div className="flex-1 bg-[#0F4C81]/75 h-[62%] rounded-t-sm"></div>
                    <div className="flex-1 bg-[#0F4C81] h-[68%] rounded-t-sm relative">
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white border border-[#cbdbf5] px-2.5 py-1.5 rounded-lg shadow text-left pointer-events-none">
                        <span className="text-[7.5px] font-bold text-[#0F4C81] uppercase tracking-wide whitespace-nowrap">PEAK LOAD 2040</span>
                        <span className="font-mono text-xs font-black text-[#0F4C81] block">{getPeakLoad()} GW</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                    <div className="p-2.5 border border-blue-100 rounded-lg bg-[#eff4ff]/30">
                      <p className="text-[8px] font-bold text-[#0F4C81] uppercase tracking-widest leading-none">CO2 reduction</p>
                      <p className="font-mono font-bold text-teal-600 mt-1.5">-{getEmissionsOffset()}%</p>
                    </div>
                    <div className="p-2.5 border border-blue-100 rounded-lg bg-[#eff4ff]/30">
                      <p className="text-[8px] font-bold text-[#0F4C81] uppercase tracking-widest leading-none">Opex savings</p>
                      <p className="font-mono font-bold text-teal-600 mt-1.5">+{getOpexSavings()}%</p>
                    </div>
                    <div className="p-2.5 border border-blue-100 rounded-lg bg-[#eff4ff]/30">
                      <p className="text-[8px] font-bold text-[#0F4C81] uppercase tracking-widest leading-none">DER capacity</p>
                      <p className="font-mono font-bold text-[#0F4C81] mt-1.5">
                        {(params.evAdoption * 0.8 + params.renewableTarget * 0.1).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Influx forecast & vulnerability block */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-2 shadow-xs">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Investment Requirement Distribution</h4>
                  <div className="h-44 flex items-end justify-between px-2 pt-4 relative text-center">
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] font-mono text-slate-400 pb-4">
                      <span>₹10,000 Cr</span>
                      <span>₹5,000 Cr</span>
                      <span>₹0</span>
                    </div>
                    
                    {/* Years bars */}
                    <div className="flex-1 flex flex-col items-center justify-end h-full ml-8">
                      <div className="w-1/2 bg-[#0F4C81] h-[15%] rounded-t"></div>
                      <span className="text-[9px] mt-1.5 font-mono text-slate-500 font-semibold">2030</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="w-1/2 bg-[#0F4C81] h-[35%] rounded-t" style={{ height: `${params.renewableTarget * 0.4}%` }}></div>
                      <span className="text-[9px] mt-1.5 font-mono text-slate-500 font-semibold">2040</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="w-1/2 bg-[#0F4C81] h-[65%] rounded-t" style={{ height: `${params.renewableTarget * 0.7}%` }}></div>
                      <span className="text-[9px] mt-1.5 font-mono text-slate-500 font-semibold">2050</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Strategic Strain Levels</h4>
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">EV Fleet Surcharge:</span>
                        <span className="font-mono font-bold text-[#0F4C81]">{(params.evAdoption * 0.9).toFixed(0)} Index</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Base Overload Alert:</span>
                        <span className="font-mono font-bold text-amber-600">{(params.populationGrowth * 18).toFixed(0)}% Delta</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Thermal Contingency Status:</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-extrabold uppercase">SECURE</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-lg text-[10.5px] text-slate-500 leading-relaxed border border-blue-100 mt-4">
                    <span className="font-bold uppercase text-[9px] text-[#0F4C81] block mb-0.5">Sandbox Status</span>
                    Adjust indicators on the sidebar panel to see live recalculated emissions impact and peak load.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 2: guided FUTURE SHOCK arena ======================= */}
          {activeTab === "FUTURE_SHOCK" && (
            <div className="space-y-5 relative z-10 transition-opacity duration-300 select-text">
              
              {/* Simulation Dashboard HUD */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-[#eff4ff]/30 to-transparent opacity-50 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-4 gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                      <span className="font-mono text-[#0F4C81] font-extrabold text-[10px] uppercase tracking-widest">
                        {shockSimulating ? `STRESS SEQUENCE ACTIVE (STAGE ${shockStep}/4)` : shockStep === 4 ? "STRESS SEQUENCE COMPLETE" : "STRESS SEQUENCE ARMED"}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mt-1 tracking-tight text-[#0f4c81] uppercase">Scenario Stress Evaluation</h3>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setShockStep(0); setShockLogs(["[RESET] Simulation arena cleared to idle."]); setProjectedReliability(99.8); setInvestmentReq("₹150 Cr"); }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Reset Simulation
                    </button>
                    <button 
                      disabled={shockSimulating}
                      onClick={handleStartShockSimulation}
                      className="px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0c3e6b] text-white rounded-lg font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                      <span>⚡ Run Stress Test</span>
                    </button>
                  </div>
                </div>

                {/* Two Column Layout: Left GIS Grid Schematic, Right live stress telemetry */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
                  
                  {/* Left Column: SVG Grid with Logs */}
                  <div className="flex flex-col gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl h-56 relative overflow-hidden flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-10"></div>
                      
                      {/* Visual grid schematics */}
                      <div className="relative z-10 w-full h-full">
                        <svg className="w-full h-full opacity-90">
                          {/* Transmission corridors */}
                          <line 
                            x1="15%" y1="20%" x2="50%" y2="25%" 
                            stroke={shockStep >= 3 ? "#f97316" : "#64748b"} 
                            strokeWidth={shockStep >= 3 ? "4.5" : "2"} 
                            className={shockStep >= 3 ? "animate-pulse" : ""} 
                          />
                          <line 
                            x1="50%" y1="25%" x2="85%" y2="40%" 
                            stroke={shockStep >= 3 ? "#ea580c" : "#64748b"} 
                            strokeWidth={shockStep >= 3 ? "4.5" : "2"} 
                          />
                          <line 
                            x1="50%" y1="25%" x2="40%" y2="80%" 
                            stroke={shockStep >= 4 ? "#eab308" : shockStep >= 3 ? "#fb923c" : "#64748b"} 
                            strokeWidth={shockStep >= 3 ? "3.5" : "1.5"} 
                          />
                          <line 
                            x1="40%" y1="80%" x2="75%" y2="70%" 
                            stroke={shockStep >= 4 ? "#94a3b8" : "#64748b"} 
                            strokeWidth="2" 
                          />

                          {/* Substations and Generators with dynamic color shifting */}
                          <circle 
                            cx="15%" cy="20%" r="9" 
                            fill={shockStep >= 1 ? "#eab308" : "#0F4C81"} 
                            className={shockStep >= 1 ? "animate-pulse" : ""} 
                          />
                          <circle 
                            cx="50%" cy="25%" r="13" 
                            fill={shockStep >= 4 ? "#f97316" : shockStep >= 2 ? "#fb923c" : "#0F4C81"} 
                            className={shockStep >= 2 ? "animate-ping opacity-30" : ""} 
                          />
                          <circle 
                            cx="50%" cy="25%" r="10" 
                            fill={shockStep >= 4 ? "#f97316" : shockStep >= 2 ? "#eab308" : "#0b3e6b"} 
                          />
                          <circle 
                            cx="40%" cy="80%" r="8" 
                            fill={shockStep >= 4 ? "#475569" : shockStep >= 1 ? "#eab308" : "#0F4C81"} 
                          />
                          <circle 
                            cx="85%" cy="40%" r="8.5" 
                            fill={shockStep >= 2 ? "#f97316" : "#0F4C81"} 
                          />
                          <circle 
                            cx="75%" cy="70%" r="7" 
                            fill={shockStep >= 4 ? "#475569" : "#0F4C81"} 
                          />
                        </svg>
                        {/* UI labeling indicators */}
                        <div className="absolute top-4 left-6 text-[9px] font-mono select-none pointer-events-none">
                          <span className="text-[#0F4C81] font-bold block">GEN HUB NW</span>
                        </div>
                        <div className="absolute top-[35%] left-[45%] text-[9px] font-mono select-none pointer-events-none text-center">
                          <span className={`font-black block ${shockStep >= 4 ? "text-orange-600 animate-pulse font-extrabold text-[10px]" : shockStep >= 2 ? "text-amber-600" : "text-[#0F4C81]"}`}>
                            S-14 JUNCTION {shockStep >= 4 ? "• DIVERGING FLOW" : shockStep >= 2 ? "• OVER BUFFER" : "• SECURE"}
                          </span>
                        </div>
                        <div className="absolute bottom-[28%] left-[30%] text-[9px] font-mono select-none pointer-events-none">
                          <span className="text-[#0F4C81] font-bold block">S-9 RADIAL</span>
                        </div>
                      </div>
                    </div>
   
                    {/* Log stream outputs */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg h-36 overflow-y-auto select-text font-mono text-[10px] text-slate-700 space-y-1 scrollbar-none">
                      {shockLogs.map((log, index) => (
                        <p key={index} className="leading-relaxed border-b border-slate-200 pb-1 flex gap-1">
                          <span className="text-[#0F4C81] font-bold flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                          <span>{log}</span>
                        </p>
                      ))}
                      {shockSimulating && (
                        <p className="text-amber-600 animate-pulse font-bold">
                          → RECALCULATING STEADY-STATE POWER FLOW MATRICES...
                        </p>
                      )}
                    </div>
                  </div>
   
                  {/* Right Column: Stunning Live Telemetry Progression */}
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col justify-between text-slate-800 shadow-sm relative">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-4 select-none">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81]">
                        LIVE CASCADE METRICS TELEMETRY
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black transition-colors ${
                        shockStep === 0 
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                          : shockStep < 3 
                            ? "bg-amber-50 text-amber-800 border border-amber-200 animate-pulse" 
                            : "bg-orange-50 text-orange-800 border border-orange-200 animate-pulse"
                      }`}>
                        {shockStep === 0 && "HEALTHY STATE"}
                        {shockStep === 1 && "MILD INTENSITY"}
                        {shockStep === 2 && "WARNING LIMITS"}
                        {shockStep === 3 && "SYSTEM CONGESTED"}
                        {shockStep === 4 && "DYNAMIC ISOLATION COMPLETED"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* 1. Demand Growth */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-500">
                          <span>Demand Growth</span>
                          <span className="text-[#0F4C81] font-bold">{
                            shockStep === 0 ? "35% Peak Baseline" :
                            shockStep === 1 ? "54% EV Coincidence" :
                            shockStep === 2 ? "72% Industrial Loop" :
                            shockStep === 3 ? "89% Heavy Thermal Load" : "62% Smart Shaved"
                          }</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div 
                            className="h-full bg-[#0F4C81] transition-all duration-700" 
                            style={{ width: shockStep === 0 ? "35%" : shockStep === 1 ? "54%" : shockStep === 2 ? "72%" : shockStep === 3 ? "89%" : "62%" }}
                          ></div>
                        </div>
                      </div>

                      {/* 2. Renewable Expansion */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-500">
                          <span>Renewable Expansion</span>
                          <span className="text-emerald-700 font-bold">{
                            shockStep === 0 ? "20% Active" :
                            shockStep === 1 ? "45% Wind Inflow" :
                            shockStep === 2 ? "70% Max Solar Peak" :
                            shockStep === 3 ? "91% UNCONTROLLED FLOODING" : "75% Curtailed Target"
                          }</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-700" 
                            style={{ width: shockStep === 0 ? "20%" : shockStep === 1 ? "45%" : shockStep === 2 ? "70%" : shockStep === 3 ? "91%" : "75%" }}
                          ></div>
                        </div>
                      </div>

                      {/* 3. Grid Congestion */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-500">
                          <span>Grid Congestion</span>
                          <span className={`${shockStep >= 3 ? "text-orange-600 font-extrabold animate-pulse" : shockStep >= 2 ? "text-amber-600" : "text-emerald-600"} font-bold`}>{
                            shockStep === 0 ? "12% - Healthy Assets" :
                            shockStep === 1 ? "28% - Safe Limits" :
                            shockStep === 2 ? "65% - Warning threshold" :
                            shockStep === 3 ? "98% - CONGESTED SUBSTATION" : "86% - Safe islanding fallback"
                          }</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div 
                            className={`h-full transition-all duration-700 ${shockStep >= 3 ? "bg-orange-500 animate-pulse" : shockStep >= 2 ? "bg-amber-500" : "bg-emerald-500"}`} 
                            style={{ width: shockStep === 0 ? "12%" : shockStep === 1 ? "28%" : shockStep === 2 ? "65%" : shockStep === 3 ? "98%" : "86%" }}
                          ></div>
                        </div>
                      </div>

                      {/* 4. Infrastructure Stress */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-500">
                          <span>Infrastructure Stress</span>
                          <span className={`${shockStep >= 3 ? "text-orange-600 font-extrabold animate-pulse" : shockStep >= 2 ? "text-amber-600" : "text-emerald-600"} font-bold`}>{
                            shockStep === 0 ? "Safe Operational Range" :
                            shockStep === 1 ? "Thermal Expansion Nominal" :
                            shockStep === 2 ? "Warning: Component age fatigue multiplier" :
                            shockStep === 3 ? "CRITICAL: THERMAL CASCADE OVERRUN" : "Stabilized with contingency storage"
                          }</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div 
                            className={`h-full transition-all duration-700 ${shockStep >= 3 ? "bg-orange-500 animate-pulse" : shockStep >= 2 ? "bg-amber-500" : "bg-emerald-500"}`} 
                            style={{ width: shockStep === 0 ? "15%" : shockStep === 1 ? "30%" : shockStep === 2 ? "68%" : shockStep === 3 ? "98%" : "70%" }}
                          ></div>
                        </div>
                      </div>

                      {/* 5. Carbon Reduction */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-500">
                          <span>Carbon Reduction Impact</span>
                          <span className="text-emerald-600 font-bold">-{carbonReduction}% emissions offset achieved</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div 
                            className="h-full bg-emerald-600 transition-all duration-700" 
                            style={{ width: `${carbonReduction}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-200 flex items-center justify-between text-[10px] select-none text-slate-500">
                      <span className="font-bold">Visual Progression Corridor:</span>
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${shockStep <= 1 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "opacity-30"}`}>HEALTHY ASSETS</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${shockStep === 2 ? "bg-amber-50 text-amber-800 border border-amber-200 animate-pulse" : "opacity-30"}`}>WARNING</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${shockStep >= 3 ? "bg-orange-50 text-orange-800 border border-orange-200 animate-pulse" : "opacity-30"}`}>SLATE STRESS</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dynamic metrics updating live during future shock: Converted to Executive KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Demand Growth</span>
                  <div>
                    <span className="text-xl font-mono font-black text-[#0F4C81] block mt-2">
                      {shockStep === 0 ? "+35%" : shockStep === 1 ? "+54%" : shockStep === 2 ? "+72%" : shockStep === 3 ? "+89%" : "+62%"}
                    </span>
                    <span className="text-[9.5px] font-semibold text-slate-555 block">Coincidence Peak Loading</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Renewable Expansion</span>
                  <div>
                    <span className="text-xl font-mono font-black text-emerald-600 block mt-2">
                      {shockStep === 0 ? "+20%" : shockStep === 1 ? "+45%" : shockStep === 2 ? "+70%" : shockStep === 3 ? "+91%" : "+75%"}
                    </span>
                    <span className="text-[9.5px] font-semibold text-slate-555 block">Clean Source Penetration</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Grid Congestion Risk</span>
                  <div>
                    <span className={`text-xl font-mono font-black block mt-2 ${shockStep >= 3 ? "text-orange-600" : shockStep >= 2 ? "text-amber-600" : "text-emerald-600"}`}>
                      {shockStep === 0 ? "12%" : shockStep === 1 ? "28%" : shockStep === 2 ? "65%" : shockStep === 3 ? "98%" : "86%"}
                    </span>
                    <span className="text-[9.5px] font-semibold text-slate-555 block">Substation Thermal Limits</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">System Stability</span>
                  <div>
                    <span className={`text-xl font-mono font-black block mt-2 ${shockStep === 3 ? "text-amber-600" : "text-emerald-600"}`}>
                      {shockStep === 0 ? "Healthy" : shockStep === 1 ? "Stable" : shockStep === 2 ? "Warning" : shockStep === 3 ? "Stressed" : "Secured"}
                    </span>
                    <span className="text-[9.5px] font-semibold text-slate-555 block">Operating Stability Margin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 3: STRATEGIC ROADMAP ======================= */}
          {activeTab === "ROADMAP" && (
            <div className="space-y-6 relative z-10 transition-opacity duration-300">
              
              {/* Timeline selector tabs */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-1 flex gap-1 shadow-sm select-none">
                <button 
                  onClick={() => setActiveRoadmapPhase(2030)}
                  className={`flex-1 py-2 text-[10px] uppercase font-black rounded-md cursor-pointer transition-all ${
                    activeRoadmapPhase === 2030 
                      ? "bg-[#0F4C81] text-white shadow" 
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Phase 1: 2030
                </button>
                <button 
                  onClick={() => setActiveRoadmapPhase(2040)}
                  className={`flex-1 py-2 text-[10px] uppercase font-black rounded-md cursor-pointer transition-all ${
                    activeRoadmapPhase === 2040 
                      ? "bg-[#0F4C81] text-white shadow" 
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Phase 2: 2040
                </button>
                <button 
                  onClick={() => setActiveRoadmapPhase(2050)}
                  className={`flex-1 py-2 text-[10px] uppercase font-black rounded-md cursor-pointer transition-all ${
                    activeRoadmapPhase === 2050 
                      ? "bg-[#0F4C81] text-white shadow" 
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Phase 3: 2050
                </button>
              </div>

              {/* Comprehensive details of selected phase */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5 select-text">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[9px] font-bold text-[#0F4C81] uppercase tracking-widest block">STRATEGIC PLANNING PORTFOLIO</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1 uppercase">Grid Modernization Plan - Phase {activeRoadmapPhase === 2030 ? "I" : activeRoadmapPhase === 2040 ? "II" : "III"} (Year {activeRoadmapPhase})</h3>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wide">ALLOCATED BUDGET</span>
                    <span className="font-mono text-base font-black text-slate-800 block">
                      {activeRoadmapPhase === 2030 ? "₹480 Cr" : activeRoadmapPhase === 2040 ? "₹1,200 Cr" : "₹3,100 Cr"}
                    </span>
                  </div>
                </div>

                {/* Sub project list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">PROJECT DIRECTIVE</span>
                      <h4 className="text-sm font-black text-[#0F4C81] mt-1">
                        {activeRoadmapPhase === 2030 ? "Substation Digital Retrofit" : activeRoadmapPhase === 2040 ? "Offshore Boreas HVDC Link" : "Hydrogen Gas Turbine Swap"}
                      </h4>
                      <p className="text-[11.5px] text-slate-600 mt-1 leading-normal font-medium">
                        {activeRoadmapPhase === 2030 
                          ? "Install unified fiber telemetry nodes across all primary grid interfaces to avoid transient load shedding." 
                          : activeRoadmapPhase === 2040 
                            ? "Establish dual core undersea high-voltage pathways to deliver available wind output to capital infrastructure hubs." 
                            : "Transition natural gas firing stations to liquid Organic Hydrogen reserves to sustain baseline zero-carbon firming capacity."}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#0F4C81] font-bold mt-3 block">Target: Reliable Sourcing</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">PROJECT DIRECTIVE</span>
                      <h4 className="text-sm font-black text-[#0F4C81] mt-1">
                        {activeRoadmapPhase === 2030 ? "Metro Edge Mesh AMI Gateways" : activeRoadmapPhase === 2040 ? "Megapack Core Pacific Basin" : "LOHC Bulk Fuel Reservoir"}
                      </h4>
                      <p className="text-[11.5px] text-slate-600 mt-1 leading-normal font-medium">
                        {activeRoadmapPhase === 2030 
                          ? "Complete high-resolution smart feedback counters rollout across metropolitan distribution centers." 
                          : activeRoadmapPhase === 2040 
                            ? "Deploy 300MWh regional utility storage at secondary border zones to shave high vehicle charging peaks." 
                            : "Build high-capacity subterranean hydrogen containment fields to hedge grid reserve index during long sunless winter cycles."}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#0F4C81] font-bold mt-3 block">Target: Capacity Buffers</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">PROJECT DIRECTIVE</span>
                      <h4 className="text-sm font-black text-[#0F4C81] mt-1">
                        {activeRoadmapPhase === 2030 ? "Commune Microgrid Loop A" : activeRoadmapPhase === 2040 ? "Industrial Zone Microgrid" : "Deep Sea Undersea Ties"}
                      </h4>
                      <p className="text-[11.5px] text-slate-600 mt-1 leading-normal font-medium">
                        {activeRoadmapPhase === 2030 
                          ? "Equip 12 remote mountain cooperatives with modular solar cells paired with automated line disconnectors." 
                          : activeRoadmapPhase === 2040 
                            ? "Form independent smart microgrids for heavy factories to decouple delicate processing sags from national lines." 
                            : "Extend global inter-tie vectors to tap international green energy loops."}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#0F4C81] font-bold mt-3 block">Target: Outage Resilience</span>
                  </div>
                </div>

                {/* Targets indices and risk assessments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wide">Risk Assessment / Stress Impediments</span>
                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-semibold">
                      {activeRoadmapPhase === 2030 
                        ? "MODERATE. Main risk is material supply chain latency of fiber processors and local union contractor capacity constraints." 
                        : activeRoadmapPhase === 2040 
                          ? "HIGH. High wind penetration causes voltage and inertia droop stability sags, requiring synchronous compensator buffers." 
                          : "SEVERE. Phase-out of traditional baseload steam turbines requires advanced grid-forming inverters and large-scale synthetic inertia systems."}
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wide">Projected Impact Outcomes</span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-semibold text-xs text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-450 font-normal">Expected reliability:</span>
                        <span>{activeRoadmapPhase === 2030 ? "+12.4% SAIFI" : activeRoadmapPhase === 2040 ? "+22.5% SAIFI" : "+35.0% SAIFI"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450 font-normal">Renewable share target:</span>
                        <span>{activeRoadmapPhase === 2030 ? "35%" : activeRoadmapPhase === 2040 ? "70%" : "100% Zero-Carbon"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450 font-normal">Electrification Coverage:</span>
                        <span>{activeRoadmapPhase === 2030 ? "90%" : activeRoadmapPhase === 2040 ? "98%" : "100% universal"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450 font-normal">Carbon Reduction:</span>
                        <span>{activeRoadmapPhase === 2030 ? "-15%" : activeRoadmapPhase === 2040 ? "-55%" : "-98% Offset"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 4: WHAT-IF BRANCHING ======================= */}
          {activeTab === "BRANCHING" && (
            <div className="space-y-6 relative z-10 transition-opacity duration-300">
              {/* Visual branching layout map */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-lg">split_scene</span>
                  Interactive What-If Strategy Branches
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Below is a logical visualization of diverging strategy pathways derived from baseline stress conditions. Add or compare branches dynamically.
                </p>

                {/* Branch Node Tree Visualization */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    
                    {/* Common Baseline Node Root */}
                    <div className="w-full md:w-64 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center relative flex-shrink-0">
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        Baseline Root
                      </span>
                      <span className="material-symbols-outlined text-slate-500 text-2xl mt-1">hub</span>
                      <h4 className="text-xs font-black text-slate-700 uppercase mt-2">Active Stress Condition</h4>
                      <p className="text-[10px] text-slate-500 mt-1 select-none leading-tight font-semibold">Extreme Thermal Heatwave Stress 2040 Profile</p>
                      <div className="mt-3.5 pt-2.5 border-t border-slate-200 text-center font-mono text-[10px] font-bold text-rose-600 leading-none">
                        Grid Stability: 75.8% (Danger)
                      </div>
                    </div>

                    {/* Connecting Arrow for Tree Feel */}
                    <div className="hidden md:flex flex-col items-center justify-center text-slate-300 select-none">
                      <span className="material-symbols-outlined text-2xl animate-pulse">keyboard_double_arrow_right</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-purple-400">Branching paths</span>
                    </div>

                    {/* Branches Output Stack */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      {branches.map((br) => (
                        <div key={br.id} className="bg-purple-50/10 hover:bg-purple-50/30 border border-purple-200 rounded-2xl p-4 transition-all relative flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5">
                          <span className="absolute top-4 right-4 text-[9px] font-mono text-purple-700 bg-purple-50 border border-purple-200 rounded px-1.5 py-0.5 font-bold uppercase">
                            {br.mitigationStrategy}
                          </span>

                          <div>
                            <span className="text-[8.5px] font-black text-purple-400 uppercase tracking-widest block font-mono">
                              Diverged {br.timestamp}
                            </span>
                            <h4 className="text-xs font-black text-slate-800 mt-1 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-purple-600 text-base">fork_right</span>
                              {br.name || `Mitigated Path [v${br.id.slice(-3)}]`}
                            </h4>
                            <p className="text-[10.5px] text-slate-500 mt-1.5 leading-tight font-semibold">
                              Applying <span className="text-purple-700 font-bold">{br.mitigationStrategy}</span> at <span className="font-mono text-purple-600 font-bold">{br.mitigationIntensity}%</span> capacity.
                            </p>
                          </div>

                          {/* Calculations output list */}
                          <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-purple-100 font-mono text-[9.5px]">
                            <div className="p-1 px-1.5 bg-white border border-purple-200 rounded text-center">
                              <span className="text-[7.5px] font-bold text-slate-400 uppercase block tracking-tight leading-none mb-1">Stability</span>
                              <span className="font-extrabold text-emerald-600 block">{br.projectedStability}%</span>
                            </div>
                            <div className="p-1 px-1.5 bg-white border border-purple-200 rounded text-center">
                              <span className="text-[7.5px] font-bold text-slate-400 uppercase block tracking-tight leading-none mb-1">Avoided</span>
                              <span className="font-extrabold text-blue-600 block">+{br.avoidedOutagesPct}%</span>
                            </div>
                            <div className="p-1 px-1.5 bg-white border border-purple-200 rounded text-center">
                              <span className="text-[7.5px] font-bold text-slate-400 uppercase block tracking-tight leading-none mb-1">GDP Gain</span>
                              <span className="font-extrabold text-purple-700 block">+{Math.round((br.regionalGdpMultiplier - 1) * 100)}%</span>
                            </div>
                          </div>

                          {/* Extra details indicator */}
                          <div className="mt-3 text-[10px] text-slate-500 border-t border-slate-100 pt-2.5 flex justify-between items-center select-none font-sans font-semibold">
                            <span>Incremental Capex: <span className="font-bold text-slate-700">₹{br.extraCapex.toLocaleString()} Cr</span></span>
                            <button 
                              onClick={() => setBranches(branches.filter(item => item.id !== br.id))}
                              className="text-rose-500 hover:text-rose-700 uppercase font-black text-[9px] cursor-pointer hover:underline"
                            >
                              delete node
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>

              {/* Strategic comparison grid matrix */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">bar_chart</span>
                  Comparative Analysis of Mitigated Branches
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visual Comparative Charts */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Metric 1 Compare */}
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] mb-2 block">Projected Grid Stability Delta (Target: &gt;95%)</label>
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {branches.map(br => (
                          <div key={br.id} className="space-y-1">
                            <div className="flex justify-between text-[10.5px] font-bold select-none">
                              <span className="text-slate-600 truncate max-w-[200px] font-semibold">{br.name}</span>
                              <span className="font-mono text-emerald-600 font-bold">{br.projectedStability}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${br.projectedStability}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metric 2 Compare */}
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] mb-2 block">Avoided Outages Percentage Contribution</label>
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {branches.map(br => (
                          <div key={br.id} className="space-y-1">
                            <div className="flex justify-between text-[10.5px] font-bold select-none">
                              <span className="text-slate-600 truncate max-w-[200px] font-semibold">{br.name}</span>
                              <span className="font-mono text-blue-600 font-bold">+{br.avoidedOutagesPct}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${br.avoidedOutagesPct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Analytical summary feedback */}
                  <div className="p-4 bg-purple-50/20 border border-purple-100 rounded-xl flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <span className="text-[8px] font-black text-purple-600 tracking-widest uppercase block mb-1">
                        Branch Advisor Report
                      </span>
                      <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-purple-600">verified</span>
                        Optimal Divergent Trade-off
                      </h4>
                      <p className="text-[11.5px] text-slate-600 leading-normal font-semibold">
                        Based on current comparative simulations, your branches explore divergent solutions. High mitigation intensity increases short-term capital payback horizons but secures optimal N-1 operating margins under critical climate strain.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-purple-100 text-[10px] font-mono text-slate-500 uppercase leading-none font-bold">
                      Heuristics optimized • Ledger Secure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROCEED TO PLANNING COUNCIL BRIDGE */}
          {onNavigate && (
            <div className="mt-8 p-6 bg-white border-2 border-[#0F4C81]/30 text-slate-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative overflow-hidden select-text">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-[#0F4C81]/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="space-y-1 relative z-10 max-w-xl">
                <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest bg-[#0F4C81] text-white rounded">
                  DECISION PIPELINE BRIDGE
                </span>
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider pt-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#0F4C81] text-lg">schema</span>
                  Translate Simulated Risks into Modernization Decisions
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Your stress-tests and scenario branching models have exposed critical regional constraints. Converge these simulated risks with stakeholder priorities in the Planning Council to craft a balanced, board-approvable deployment strategy.
                </p>
              </div>
              <button
                onClick={() => onNavigate("Planning Council")}
                className="px-5 py-3 w-full sm:w-auto bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md border border-[#cbdbf5]/20 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 z-10"
              >
                <span>Proceed to Planning Council</span>
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Scenario Parameters Sandbox Sidebar (Right Panel) */}
      <aside className="w-[360px] bg-white border-l border-slate-200 flex flex-col z-20 shadow-xs">
        
        {activeTab === "SANDBOX" ? (
          // Sandbox Panel
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-black uppercase text-[#0F4C81] tracking-wider">Scenario Inputs</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Planning Assumptions</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">EV Adoption</span>
                  <span className="font-mono font-bold text-[#0F4C81]">{params.evAdoption}%</span>
                </div>
                <input 
                  type="range"
                  min={0}
                  max={100}
                  value={params.evAdoption}
                  onChange={(e) => setParams({ ...params, evAdoption: Number(e.target.value) })}
                  className="w-full accent-[#0F4C81] focus:outline-none cursor-pointer" 
                />
                <p className="text-[9px] text-slate-400 leading-normal font-medium">Simulates light-duty vehicle fleet transition by 2035.</p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">Population Growth</span>
                  <span className="font-mono font-bold text-[#0F4C81]">{params.populationGrowth}%</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="font-bold">0%</span>
                  <input 
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={params.populationGrowth}
                    onChange={(e) => setParams({ ...params, populationGrowth: Number(e.target.value) })}
                    className="w-full accent-[#0F4C81] focus:outline-none cursor-pointer" 
                  />
                  <span className="font-bold">5%</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-normal font-medium">Annual CAGR based on urban expansion census data trajectory.</p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">Renewable Target</span>
                  <span className="font-mono font-bold text-[#0F4C81]">{params.renewableTarget}%</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {([40, 60, 80, 100] as const).map((tgt) => {
                    const isSelected = params.renewableTarget === tgt;
                    return (
                      <button
                        key={tgt}
                        onClick={() => setParams({ ...params, renewableTarget: tgt })}
                        className={`py-1 border rounded-lg text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#0F4C81] text-white border-transparent"
                            : "border-slate-200 text-slate-500 bg-transparent hover:bg-slate-100"
                        }`}
                      >
                        {tgt}%
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">MODEL CONSTRAINTS</h4>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="font-medium">Storage Firmness (LOHC)</span>
                    <input 
                      type="checkbox"
                      checked={params.storageFirmness}
                      onChange={(e) => setParams({ ...params, storageFirmness: e.target.checked })}
                      className="rounded text-[#0F4C81] cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="font-medium">Hydrogen Ready Sourcing</span>
                    <input 
                      type="checkbox"
                      checked={params.hydrogenReady}
                      onChange={(e) => setParams({ ...params, hydrogenReady: e.target.checked })}
                      className="rounded text-[#0F4C81] cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="font-medium">Carbon Capture Penalty</span>
                    <input 
                      type="checkbox"
                      checked={params.carbonCapture}
                      onChange={(e) => setParams({ ...params, carbonCapture: e.target.checked })}
                      className="rounded text-[#0F4C81] cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Last Simulation Run</span>
                  <span className="font-mono">{lastCalculationTime}</span>
                </div>
                <button
                  onClick={handleRecalculateAll}
                  disabled={calculating}
                  className="w-full py-2.5 bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow transition-all active:scale-95 disabled:opacity-60 text-xs text-center"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  {calculating ? "CALCULATING..." : "RECALCULATE ALL"}
                </button>
              </div>
            </div>
          </>
        ) : activeTab === "FUTURE_SHOCK" ? (
          // Future Shock Parameters Panel: Styled as Scenario Inputs Planning Assumptions
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-black uppercase text-[#0F4C81] tracking-wider">Scenario Inputs</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Planning Assumptions</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">EV Adoption</span>
                  <span className="font-mono font-bold text-orange-600">{shockEv}%</span>
                </div>
                <input 
                  type="range"
                  min={30}
                  max={100}
                  value={shockEv}
                  onChange={(e) => setShockEv(Number(e.target.value))}
                  className="w-full accent-orange-500 focus:outline-none cursor-pointer" 
                />
                <p className="text-[9px] text-slate-400 leading-normal font-medium">Forces aggressive coincident EV home charging spikes.</p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">Renewable Target</span>
                  <span className="font-mono font-bold text-emerald-600">{shockRenewable}%</span>
                </div>
                <input 
                  type="range"
                  min={40}
                  max={100}
                  value={shockRenewable}
                  onChange={(e) => setShockRenewable(Number(e.target.value))}
                  className="w-full accent-emerald-500 focus:outline-none cursor-pointer" 
                />
                <p className="text-[9px] text-slate-400 leading-normal font-medium">Adds volatile variable solar and wind supplies to grid.</p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">Industrial Growth</span>
                  <span className="font-mono font-bold text-orange-600">Level {shockIndustrial} (x{shockIndustrial} Multiplier)</span>
                </div>
                <input 
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={shockIndustrial}
                  onChange={(e) => setShockIndustrial(Number(e.target.value))}
                  className="w-full accent-orange-500 focus:outline-none cursor-pointer" 
                />
                <p className="text-[9px] text-slate-400 leading-normal font-medium">Multiplier for high-density heavy factory sags.</p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">Fossil Retirement</span>
                  <span className="font-mono font-bold text-orange-600">{shockRetireFossil}%</span>
                </div>
                <input 
                  type="range"
                  min={20}
                  max={100}
                  value={shockRetireFossil}
                  onChange={(e) => setShockRetireFossil(Number(e.target.value))}
                  className="w-full accent-orange-500 focus:outline-none cursor-pointer" 
                />
                <p className="text-[9px] text-slate-400 leading-normal font-medium">Forces baseload generator shutdowns, depleting backup inertia.</p>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <button
                disabled={shockSimulating}
                onClick={handleStartShockSimulation}
                className="w-full py-2.5 bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-xs block text-center uppercase"
              >
                <span className="material-symbols-outlined text-[17px]">warning</span>
                {shockSimulating ? "Simulating Stress Test..." : "Generate Future Shock Analysis"}
              </button>
            </div>
          </>
        ) : activeTab === "ROADMAP" ? (
          // Roadmap Sidebar (Overview of total vision)
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-black uppercase text-[#0F4C81] tracking-wider">Roadmap Strategy</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Review the national three-tier grid evolution timeline targets.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-3 select-text">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">ALIGNMENT OBJECTIVE</span>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  Decarbonizing industrial and residential consumption vectors requires progressive opex transfers into green reserve assets.
                </p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-3.5">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">MILESTONE PHASES</span>
                
                <div className="space-y-2.5 text-xs">
                  <div 
                    onClick={() => setActiveRoadmapPhase(2030)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${activeRoadmapPhase === 2030 ? "bg-[#cbdbf5]/50 border-blue-400 font-extrabold" : "border-slate-200 hover:bg-slate-100"}`}
                  >
                    <span className="font-bold text-slate-900 block">Phase I (2030): Retrofitting</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">Establish AMI digital telemetry mesh.</span>
                  </div>

                  <div 
                    onClick={() => setActiveRoadmapPhase(2040)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${activeRoadmapPhase === 2040 ? "bg-[#cbdbf5]/50 border-blue-400 font-extrabold" : "border-slate-200 hover:bg-slate-100"}`}
                  >
                    <span className="font-bold text-slate-900 block">Phase II (2040): Integration</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">Deploy undersea wind interconnectors & batteries.</span>
                  </div>

                  <div 
                    onClick={() => setActiveRoadmapPhase(2050)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${activeRoadmapPhase === 2050 ? "bg-[#cbdbf5]/50 border-blue-400 font-extrabold" : "border-slate-200 hover:bg-slate-100"}`}
                  >
                    <span className="font-bold text-slate-900 block">Phase III (2050): Autonomy</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">Universal hydrogen firing and smart grid autonomy.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 text-center">
              <span className="text-[10px] text-slate-400 leading-none font-semibold">All milestone figures synchronized with current capital projections.</span>
            </div>
          </>
        ) : (
          // Branching Sidebar
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-black uppercase text-[#0F4C81] tracking-wider">Branch Controller</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Calibrate divergent 'what-if' pathways off baseline scenarios to evaluate trade-offs.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl shadow-xs space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase block tracking-wider font-mono">1. Branch Node Label</label>
                <input 
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="e.g. Heatwave + custom mitigation"
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl shadow-xs space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase block tracking-wider font-mono">2. Divergence Baseline</label>
                <select
                  value={newBaseScenario}
                  onChange={(e) => setNewBaseScenario(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                >
                  {scopeType === "National" && (
                    <>
                      <option value="National Heatwave Thermal Peak">National Heatwave Thermal Peak</option>
                      <option value="National Monsoonal Substation Inundation">National Monsoonal Substation Inundation</option>
                      <option value="National EV Fleet Charging Coincidence">National EV Fleet Charging Coincidence</option>
                    </>
                  )}
                  {scopeType === "Region" && (
                    <>
                      <option value={`${selectedRegion} Region Solar Curtailment Baseline`}>{selectedRegion} Region Solar Curtailment Baseline</option>
                      <option value={`${selectedRegion} Region Coastal Cyclone Risk`}>{selectedRegion} Region Coastal Cyclone Risk</option>
                      <option value={`${selectedRegion} Region Load Flow Congestion`}>{selectedRegion} Region Load Flow Congestion</option>
                    </>
                  )}
                  {scopeType === "Horizon" && (
                    <>
                      <option value={`Projected ${selectedHorizon} Grid-Inertia Depletion`}>Projected {selectedHorizon} Grid-Inertia Depletion</option>
                      <option value={`Projected ${selectedHorizon} Multi-fuel Shutdown Strain`}>Projected {selectedHorizon} Multi-fuel Shutdown Strain</option>
                      <option value={`Projected ${selectedHorizon} Extreme Weather Inundation`}>Projected {selectedHorizon} Extreme Weather Inundation</option>
                    </>
                  )}
                </select>
              </div>

              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl shadow-xs space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase block tracking-wider font-mono">3. Select Mitigation Action</label>
                <select
                  value={newMitigationStrategy}
                  onChange={(e) => setNewMitigationStrategy(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                >
                  <option value="Virtual Power Plants (VPP)">Virtual Power Plants (VPP)</option>
                  <option value="Vehicle-To-Grid (V2G)">Vehicle-To-Grid (V2G) Feedback</option>
                  <option value="Agricultural Solar Islanding Feeders">Agricultural Solar Islanding Feeders</option>
                  <option value="Dynamic Load Shedding Caps">Dynamic Load Tracking Caps</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl shadow-xs space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">4. Mitigation Intensity</span>
                  <span className="font-mono font-bold text-purple-700">{newMitigationIntensity}%</span>
                </div>
                <input 
                  type="range"
                  min={10}
                  max={100}
                  value={newMitigationIntensity}
                  onChange={(e) => setNewMitigationIntensity(Number(e.target.value))}
                  className="w-full accent-purple-600 focus:outline-none cursor-pointer" 
                />
              </div>

              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl shadow-xs space-y-1.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">5. Plan Capex Funding</span>
                  <span className="font-mono font-bold text-purple-700">₹{newExtraCapex} Cr</span>
                </div>
                <input 
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={newExtraCapex}
                  onChange={(e) => setNewExtraCapex(Number(e.target.value))}
                  className="w-full accent-purple-600 focus:outline-none cursor-pointer" 
                />
              </div>

            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <button
                onClick={handleSpawnBranch}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md text-[11px] text-center uppercase"
              >
                <span className="material-symbols-outlined text-[15px]">fork_right</span>
                Spawn What-If Node
              </button>
            </div>
          </>
        )}

      </aside>
      
    </div>
  );
};

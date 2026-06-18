import React, { useState, useEffect } from "react";
import { ScenarioParameters } from "../types";
import { usePlanningScope } from "../PlanningScopeContext";
import { ScenarioSandboxTab } from "./scenario-lab/ScenarioSandboxTab";
import { FutureShockTab } from "./scenario-lab/FutureShockTab";
import { RoadmapTab } from "./scenario-lab/RoadmapTab";
import { BranchingTab } from "./scenario-lab/BranchingTab";

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

export const ScenarioLaboratory: React.FC<{ onNavigate?: (view: any) => void }> = ({ onNavigate }) => {
  const { scopeType, selectedRegion, selectedHorizon, renewableTarget, evAdoption } = usePlanningScope();

  // Master mode switcher
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
        evAdoption: evAdoption,
        populationGrowth: selectedHorizon === 2030 ? 1.0 : selectedHorizon === 2040 ? 1.5 : 2.0,
      }));
      setShockEv(selectedHorizon === 2030 ? 50 : selectedHorizon === 2040 ? 70 : 90);
      setShockRenewable(renewableTarget);
      setNewBaseScenario(`Projected ${selectedHorizon} Grid-Inertia Depletion`);
    } else if (scopeType === "Region") {
      setParams((prev) => ({
        ...prev,
        renewableTarget: renewableTarget,
        evAdoption: evAdoption,
        populationGrowth: 1.2
      }));
      setShockRenewable(renewableTarget);
      setShockEv(65);
      setNewBaseScenario(`${selectedRegion} Region Solar Curtailment Baseline`);
    } else {
      setParams((prev) => ({
        ...prev,
        renewableTarget: 70,
        evAdoption: evAdoption,
        populationGrowth: 1.2
      }));
      setShockRenewable(75);
      setShockEv(65);
      setNewBaseScenario("National Heatwave Thermal Peak");
    }
  }, [scopeType, selectedRegion, selectedHorizon, renewableTarget, evAdoption]);

  // --- Visual What-If Branching States ---
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
        }, 2200);
      } else {
        setShockSimulating(false);
        setShockLogs((prev) => [...prev, "[SUCCESS] Cascade complete. Dynamic islanding algorithms & high opex reserves secured total recovery."]);
      }
    }
    return () => clearTimeout(timer);
  }, [shockSimulating, shockStep]);

  const updateShockMetricsForStep = (step: number) => {
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
        setProjectedReliability(96.8);
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

          {/* Methodology Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 shadow-xs">
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-[#0F4C81] bg-blue-50 p-2.5 rounded-lg border border-blue-100 text-xl font-bold">schema</span>
              <div>
                <h2 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider">Methodology & Separation Integrity</h2>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5 font-semibold">
                  This laboratory maintains strict architectural boundaries: <span className="text-[#0F4C81] font-bold">Observed Historical Reality</span> serves as the baseline, while all future modernizations are clearly flagged as <span className="text-amber-500 font-bold">Scenario Forward Projections</span>.
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

          {/* Active Tab Dispatcher */}
          {activeTab === "SANDBOX" && (
            <ScenarioSandboxTab
              params={params}
              setParams={setParams}
              calculating={calculating}
              handleRecalculateAll={handleRecalculateAll}
              getPeakLoad={getPeakLoad}
              getEmissionsOffset={getEmissionsOffset}
              getOpexSavings={getOpexSavings}
            />
          )}

          {activeTab === "FUTURE_SHOCK" && (
            <FutureShockTab
              shockEv={shockEv}
              setShockEv={setShockEv}
              shockRenewable={shockRenewable}
              setShockRenewable={setShockRenewable}
              shockIndustrial={shockIndustrial}
              setShockIndustrial={setShockIndustrial}
              shockRetireFossil={shockRetireFossil}
              setShockRetireFossil={setShockRetireFossil}
              shockSimulating={shockSimulating}
              shockStep={shockStep}
              shockLogs={shockLogs}
              projectedReliability={projectedReliability}
              investmentReq={investmentReq}
              renewableImpact={renewableImpact}
              carbonReduction={carbonReduction}
              handleStartShockSimulation={handleStartShockSimulation}
              setShockStep={setShockStep}
              setShockLogs={setShockLogs}
              setProjectedReliability={setProjectedReliability}
              setInvestmentReq={setInvestmentReq}
            />
          )}

          {activeTab === "ROADMAP" && (
            <RoadmapTab
              activeRoadmapPhase={activeRoadmapPhase}
              setActiveRoadmapPhase={setActiveRoadmapPhase}
            />
          )}

          {activeTab === "BRANCHING" && (
            <BranchingTab
              branches={branches}
              setBranches={setBranches}
            />
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

      {/* Sidebar Inputs Panel */}
      <aside className="w-[360px] bg-white border-l border-slate-200 flex flex-col z-20 shadow-xs">
        
        {activeTab === "SANDBOX" ? (
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
                  {([40, 60, 80, 100] as const).map((tgt) => (
                    <button
                      key={tgt}
                      onClick={() => setParams({ ...params, renewableTarget: tgt })}
                      className={`py-1 border rounded-lg text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                        params.renewableTarget === tgt
                          ? "bg-[#0F4C81] text-white border-transparent"
                          : "border-slate-200 text-slate-500 bg-transparent hover:bg-slate-100"
                      }`}
                    >
                      {tgt}%
                    </button>
                  ))}
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
                className="w-full py-2.5 bg-[#0F4C81] hover:bg-[#0c3e6b] text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 text-xs block text-center uppercase"
              >
                <span className="material-symbols-outlined text-[17px]">warning</span>
                {shockSimulating ? "Simulating Stress Test..." : "Generate Future Shock Analysis"}
              </button>
            </div>
          </>
        ) : activeTab === "ROADMAP" ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-black uppercase text-[#0F4C81] tracking-wider">Roadmap Strategy</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Review the national three-tier grid evolution timeline targets.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-3 select-text">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">ALIGNMENT OBJECTIVE</span>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed font-sans">
                  Decarbonizing industrial and residential consumption vectors requires progressive opex transfers into green reserve assets.
                </p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-xs space-y-3.5">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">MILESTONE PHASES</span>
                
                <div className="space-y-2.5 text-xs">
                  {([2030, 2040, 2050] as const).map((phase) => (
                    <div 
                      key={phase}
                      onClick={() => setActiveRoadmapPhase(phase)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${activeRoadmapPhase === phase ? "bg-[#cbdbf5]/50 border-blue-400 font-extrabold" : "border-slate-200 hover:bg-slate-100"}`}
                    >
                      <span className="font-bold text-slate-900 block">Phase {phase === 2030 ? "I" : phase === 2040 ? "II" : "III"} ({phase})</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block font-medium font-sans">
                        {phase === 2030 && "Establish AMI digital telemetry mesh."}
                        {phase === 2040 && "Deploy undersea wind interconnectors & batteries."}
                        {phase === 2050 && "Universal hydrogen firing and smart grid autonomy."}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 text-center">
              <span className="text-[10px] text-slate-400 leading-none font-semibold">All milestone figures synchronized with current capital projections.</span>
            </div>
          </>
        ) : (
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

import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ActiveView } from "./types";
import { usePlanningScope } from "./PlanningScopeContext";

// Lazy loaded views
const ExecutiveCommandCenter = React.lazy(() => import("./components/ExecutiveCommandCenter").then(m => ({ default: m.ExecutiveCommandCenter })));
const DigitalTwin = React.lazy(() => import("./components/DigitalTwin").then(m => ({ default: m.DigitalTwin })));
const GridDataHub = React.lazy(() => import("./components/GridDataHub").then(m => ({ default: m.GridDataHub })));
const ScenarioLaboratory = React.lazy(() => import("./components/ScenarioLaboratory").then(m => ({ default: m.ScenarioLaboratory })));
const PlanningCouncil = React.lazy(() => import("./components/PlanningCouncil").then(m => ({ default: m.PlanningCouncil })));
const InvestmentPrioritization = React.lazy(() => import("./components/InvestmentPrioritization").then(m => ({ default: m.InvestmentPrioritization })));
const CrisisLaboratory = React.lazy(() => import("./components/CrisisLaboratory").then(m => ({ default: m.CrisisLaboratory })));
const ReportingCenter = React.lazy(() => import("./components/ReportingCenter").then(m => ({ default: m.ReportingCenter })));
const DecisionTraceability = React.lazy(() => import("./components/DecisionTraceability").then(m => ({ default: m.DecisionTraceability })));
const DemoStoryMode = React.lazy(() => import("./components/DemoStoryMode").then(m => ({ default: m.DemoStoryMode })));
const ImpactAssessment = React.lazy(() => import("./components/ImpactAssessment").then(m => ({ default: m.ImpactAssessment })));

export default function App() {
  // Default to the brand new EXECUTIVE_COMMAND_CENTER above all modules!
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.EXECUTIVE_COMMAND_CENTER);
  const [planningMode, setPlanningMode] = useState<"NATIONAL" | "MUNICIPAL" | "RURAL">("NATIONAL");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Render correct sub-view matching the current navigation tab selection
  const renderActiveView = () => {
    switch (activeView) {
      case ActiveView.EXECUTIVE_COMMAND_CENTER:
        return <ExecutiveCommandCenter planningMode={planningMode} onNavigate={setActiveView} />;
      case ActiveView.GRID_DATA_HUB:
        return <GridDataHub />;
      case ActiveView.SCENARIO_LABORATORY:
        return <ScenarioLaboratory onNavigate={setActiveView} />;
      case ActiveView.PLANNING_COUNCIL:
        return <PlanningCouncil />;
      case ActiveView.INVESTMENT_PRIORITIZATION:
        return <InvestmentPrioritization />;
      case ActiveView.CRISIS_LABORATORY:
        return <CrisisLaboratory />;
      case ActiveView.REPORTING_CENTER:
        return <ReportingCenter />;
      case ActiveView.DECISION_TRACEABILITY:
        return <DecisionTraceability />;
      case ActiveView.DEMO_STORY_MODE:
        return <DemoStoryMode onNavigate={setActiveView} />;
      case ActiveView.IMPACT_ASSESSMENT:
        return <ImpactAssessment />;
      case ActiveView.DIGITAL_TWIN:
      default:
        return <DigitalTwin planningMode={planningMode} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      {/* Sidebar Navigation - handles navigation tabs and the Global Operator Planning Selector */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        planningMode={planningMode}
        setPlanningMode={setPlanningMode}
      />

      {/* Main Content Layout Wrapper */}
      <div className="flex-1 flex flex-col pl-[240px] pt-14">
        {/* Topbar Header */}
        <Topbar 
          activeView={activeView} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* Global Active Planning Context Banner */}
        <div 
          id="nexus-global-context-banner" 
          className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-6 py-2 flex flex-wrap items-center justify-between text-xs border-b border-indigo-900/40 relative z-20 shadow-sm gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
            <span className="font-mono tracking-wider text-[10px] font-bold text-indigo-300 uppercase">Planning Context</span>
            <span className="text-slate-400">/</span>
            <span className="font-extrabold text-blue-200">Scope: {scopeType}</span>
            {scopeType === "Region" && (
              <>
                <span className="text-slate-400">/</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-black border border-amber-500/30">
                  Region: {selectedRegion}
                </span>
              </>
            )}
            {scopeType === "Horizon" && (
              <>
                <span className="text-slate-400">/</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black border border-emerald-500/30">
                  Target Horizon: {selectedHorizon}
                </span>
              </>
            )}
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 text-[11px] truncate max-w-[280px] sm:max-w-md font-medium">
              Scenario: <strong className="text-white font-semibold">{activeScenarioName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] sm:text-xs">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-slate-400">Target Renewables:</span>
              <strong className="text-emerald-400 font-extrabold">{renewableTarget}%</strong>
              <div className="w-12 bg-slate-700 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${renewableTarget}%` }}></div>
              </div>
            </div>
            
            <span className="text-slate-500">|</span>

            <div>
              <span className="text-slate-400">Budget Capex:</span>
              <strong className="text-cyan-400 ml-1 font-extrabold">₹{budgetCr.toLocaleString()} Cr</strong>
            </div>

            <span className="text-slate-500">|</span>

            <div>
              <span className="text-slate-400">Risk:</span>
              <strong className={`ml-1 font-black px-1.5 py-0.5 rounded text-[9px] ${
                climateRiskLevel === "CRITICAL"
                  ? "bg-red-500/35 text-red-100 border border-red-500/40"
                  : climateRiskLevel === "HIGH"
                  ? "bg-amber-500/30 text-amber-200 border border-amber-500/30"
                  : "bg-teal-500/30 text-teal-200 border border-teal-500/20"
              }`}>
                {climateRiskLevel}
              </strong>
            </div>
          </div>
        </div>

        {/* Dynamic Display Panel */}
        <main className="flex-1 overflow-hidden">
          <React.Suspense fallback={
            <div className="flex-1 h-full flex items-center justify-center bg-[#F8FAFC]">
              <div className="flex flex-col items-center gap-3">
                <span className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></span>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest animate-pulse">Loading View...</span>
              </div>
            </div>
          }>
            {renderActiveView()}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}

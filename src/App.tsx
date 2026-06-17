import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ExecutiveCommandCenter } from "./components/ExecutiveCommandCenter";
import { DigitalTwin } from "./components/DigitalTwin";
import { GridDataHub } from "./components/GridDataHub";
import { ScenarioLaboratory } from "./components/ScenarioLaboratory";
import { PlanningCouncil } from "./components/PlanningCouncil";
import { InvestmentPrioritization } from "./components/InvestmentPrioritization";
import { CrisisLaboratory } from "./components/CrisisLaboratory";
import { ReportingCenter } from "./components/ReportingCenter";
import { DecisionTraceability } from "./components/DecisionTraceability";
import { DemoStoryMode } from "./components/DemoStoryMode";
import { ImpactAssessment } from "./components/ImpactAssessment";
import { ActiveView } from "./types";
import { usePlanningScope } from "./PlanningScopeContext";

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
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

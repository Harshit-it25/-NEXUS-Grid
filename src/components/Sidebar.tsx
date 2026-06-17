import React from "react";
import { ActiveView } from "../types";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  planningMode: "NATIONAL" | "MUNICIPAL" | "RURAL";
  setPlanningMode: (mode: "NATIONAL" | "MUNICIPAL" | "RURAL") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView,
  planningMode,
  setPlanningMode
}) => {
  // Structured Workflow Hierarchy as requested
  const primaryWorkflow = [
    { view: ActiveView.EXECUTIVE_COMMAND_CENTER, icon: "dashboard", label: "Executive Center" },
    { view: ActiveView.DIGITAL_TWIN, icon: "precision_manufacturing", label: "Digital Twin" },
    { view: ActiveView.SCENARIO_LABORATORY, icon: "science", label: "Scenario Laboratory" },
    { view: ActiveView.PLANNING_COUNCIL, icon: "groups", label: "Planning Council" },
    { view: ActiveView.DECISION_TRACEABILITY, icon: "verified_user", label: "Executive Decision Package" },
  ];

  const analysisTools = [
    { view: ActiveView.INVESTMENT_PRIORITIZATION, icon: "payments", label: "Investment Prioritization" },
    { view: ActiveView.CRISIS_LABORATORY, icon: "warning", label: "Crisis Laboratory" },
    { view: ActiveView.IMPACT_ASSESSMENT, icon: "insights", label: "Impact Assessment" },
    { view: ActiveView.REPORTING_CENTER, icon: "assessment", label: "Reports" },
  ];

  // Specific footer personas depending on active view to maintain high-quality details
  const getPersona = () => {
    switch (activeView) {
      case ActiveView.GRID_DATA_HUB:
        return (
          <div className="flex items-center gap-3">
            <img 
              alt="User Profile" 
              className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_tJDxsO_B7rTXAoQ8WpSSTjbYnTOzI3vHit5m_oWMG_oMSIyr46DS9vHWRImAT_tCbL_nQ0OB8EYQpPbbmu4hbbZ8XS3CntX_aGlE9iNaCapydRJVKjydf0BUsvtmvy4D730KDkKJTIkh14WTkMsWiOLqPIRMyQEemFoYkQVOQ-7tkY5m589YHUjgHhRU_g6Xhd2GrplLmBWJ6dNF-dphoyiEIf2JMIYy0quWKyreIWnh3T-dQlDf__f-_hdPVth6BxCZHJ1zblJI"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#0F172A] truncate">NEXUS Vane</p>
              <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">Director of Systems</p>
            </div>
          </div>
        );
      case ActiveView.SCENARIO_LABORATORY:
        return (
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#0F4C81] flex items-center justify-center text-white font-bold text-xs">CS</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">Chief Strategist</p>
              <p className="text-[10px] text-slate-500">Planning Division</p>
            </div>
          </div>
        );
      case ActiveView.PLANNING_COUNCIL:
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-slate-55 rounded border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-full bg-[#0F4C81] flex items-center justify-center text-white font-bold text-xs">CS</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">Chief Strategist</p>
                <p className="text-[10px] text-slate-500">Planning Division</p>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg flex items-center justify-between border border-[#E2E8F0]">
              <div>
                <div className="text-[9px] font-bold tracking-wider text-[#0F4C81] uppercase">SESSION STATUS</div>
                <div className="text-xs font-bold text-slate-800 text-[11px]">Active Deliberation</div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0F4C81] animate-pulse"></div>
            </div>
          </div>
        );
      case ActiveView.INVESTMENT_PRIORITIZATION:
        return (
          <div className="bg-[#eff4ff] p-3 rounded-lg flex items-center gap-3 border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-[#0F4C81] text-xs">CE</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[9px] font-bold tracking-wider uppercase text-slate-500">Chief Engineer</span>
              <span className="text-xs font-bold text-slate-800 truncate">NEXUS Evans</span>
            </div>
          </div>
        );
      case ActiveView.REPORTING_CENTER:
        return (
          <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-[#E2E8F0]">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">SYSTEM: NOMINAL</span>
          </div>
        );
      case ActiveView.CRISIS_LABORATORY:
      case ActiveView.DIGITAL_TWIN:
      default:
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG9Kuwmg87tc3d64ve60gn7KBpOJ4Zm3ZL-bNqeBGNYD-_4SX0p3VOTByi5nFnTL4JjnyX1FbL7kZSh4IOqFy2wSSKcqFAKhnK0T5bfTQwE_5ZxJVN-XUjtx6-ghuENzpUa2N_W9-xqJpevu8CPYU5VcGvmUwwkclH7qUrGZXA5YBfA9_TBCo4iibXC8nZ1IbWSvv5yXjLoymU9F6o2JxeT-aTFqPxnGH_blVFSQiq_EV59u9uPwRqkgLa4bUF7JkiBtpz9pR6WM72"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">NEXUS Grid</div>
              <div className="text-[10px] text-slate-500 font-medium">Lead Architect</div>
            </div>
          </div>
        );
    }
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-screen flex flex-col z-40 w-[240px] border-r border-[#E2E8F0] bg-white text-[#0F172A] transition-all"
    >
      {/* Brand Logo Section */}
      <div className="h-14 flex items-center px-4 gap-2.5 border-b border-[#E2E8F0] flex-shrink-0 bg-white">
        <div className="w-8 h-8 bg-[#0F4C81] rounded flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white text-[20px]">bolt</span>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-black text-[#0F4C81] leading-none truncate">NEXUS Grid</div>
          <div className="text-[8px] text-slate-500 font-semibold uppercase tracking-wide leading-tight mt-0.5" title="Energy Infrastructure Planning Platform">
            Grid Modernisation
          </div>
        </div>
      </div>

      {/* Grid Operator Planning Mode Selector Box */}
      <div className="mx-3 my-3 bg-slate-50 p-2.5 rounded border border-[#E2E8F0] shadow-sm flex-shrink-0">
        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 leading-none">
          PLANNING CONTEXT MODE
        </span>
        <select 
          value={planningMode}
          onChange={(e) => setPlanningMode(e.target.value as any)}
          className="w-full bg-white border border-[#E2E8F0] p-1.5 rounded text-[11px] focus:outline-none text-[#0F4C81] font-bold cursor-pointer transition-all"
        >
          <option value="NATIONAL">🌐 National Utility</option>
          <option value="MUNICIPAL">🏙️ Municipal Energy</option>
          <option value="RURAL">🏡 Rural Electrification</option>
        </select>
        <div className="mt-1.5 text-[8.5px] text-slate-500 font-semibold leading-tight">
          {planningMode === "NATIONAL" && "Focus: Core Ties & Offshore wind"}
          {planningMode === "MUNICIPAL" && "Focus: EV Fleet Ingestion & Resilience"}
          {planningMode === "RURAL" && "Focus: Microgrids & Solar village cells"}
        </div>
      </div>

      {/* Nav links categorized by workflow */}
      <div className="flex-1 px-3 py-2 space-y-5 overflow-y-auto bg-white select-none">
        {/* PRIMARY WORKFLOW */}
        <div className="space-y-1.5">
          <div className="px-2 text-[9px] font-black uppercase tracking-widest text-[#0F4C81]/70 font-mono">
            Primary Workflow
          </div>
          <div className="space-y-0.5">
            {primaryWorkflow.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setActiveView(item.view)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#eff4ff] text-[#0F4C81] font-black border-r-4 border-[#0F4C81]"
                      : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${isActive ? "text-[#0F4C81]" : "text-slate-400"}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ANALYSIS TOOLS */}
        <div className="space-y-1.5">
          <div className="px-2 text-[9px] font-black uppercase tracking-widest text-[#0F4C81]/70 font-mono">
            Analysis Tools
          </div>
          <div className="space-y-0.5">
            {analysisTools.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setActiveView(item.view)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#eff4ff] text-[#0F4C81] font-black border-r-4 border-[#0F4C81]"
                      : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${isActive ? "text-[#0F4C81]" : "text-slate-400"}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile Persona Block */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white flex-shrink-0">
        {getPersona()}
      </div>
    </aside>
  );
};

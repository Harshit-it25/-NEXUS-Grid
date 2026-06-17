import React, { useState, useEffect } from "react";
import { INITIAL_PROJECTS, INITIAL_RECENT_ACTIONS } from "../data";
import { PrioritizedProject, RecentAction } from "../types";
import { usePlanningScope } from "../PlanningScopeContext";

export const InvestmentPrioritization: React.FC = () => {
  const { scopeType, selectedRegion, selectedHorizon } = usePlanningScope();
  const [projects, setProjects] = useState<PrioritizedProject[]>(INITIAL_PROJECTS);
  const [recentActions, setRecentActions] = useState<RecentAction[]>(INITIAL_RECENT_ACTIONS);
  const [budgetCap, setBudgetCap] = useState<number>(8000); // ₹8,000 Crore as standard cap
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [impactFilter, setImpactFilter] = useState<string>("ALL");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Set region filter dynamically if scopeType is "Region"
  useEffect(() => {
    if (scopeType === "Region") {
      setRegionFilter(`${selectedRegion} Region`);
    } else {
      setRegionFilter("ALL");
    }
  }, [scopeType, selectedRegion]);

  // Adjust budget limits according to baseline target years in Horizon mode
  useEffect(() => {
    if (scopeType === "Horizon") {
      if (selectedHorizon === 2030) setBudgetCap(8000);
      else if (selectedHorizon === 2040) setBudgetCap(15000);
      else if (selectedHorizon === 2050) setBudgetCap(24000);
    } else {
      setBudgetCap(8000);
    }
  }, [scopeType, selectedHorizon]);

  // Helper to dynamically calculate scaled cost based on Horizon selection
  const getAdjustedCost = (p: PrioritizedProject) => {
    if (scopeType === "Horizon") {
      if (selectedHorizon === 2030) return Number(p.cost.toFixed(1));
      if (selectedHorizon === 2040) return Number((p.cost * 1.35).toFixed(1));
      if (selectedHorizon === 2050) return Number((p.cost * 1.95).toFixed(1));
    }
    return p.cost;
  };

  // Toggle selection
  const handleToggleProject = (id: string, name: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, selected: !p.selected };
      }
      return p;
    });
    setProjects(updated);

    const currentProj = projects.find((p) => p.id === id);
    if (currentProj) {
      const action: RecentAction = {
        id: `act-${Date.now()}`,
        title: `${name} ${!currentProj.selected ? "Approved" : "De-allocated"}`,
        description: `Manually verified and modified ledger allocation state to ${!currentProj.selected ? "COMMITTED" : "UNALLOCATED"}`,
        time: "Just now"
      };
      setRecentActions([action, ...recentActions.slice(0, 3)]);
    }
  };

  // Derived budget info
  const getCommittedBudget = () => {
    return Number(projects.filter((p) => p.selected).reduce((sum, p) => sum + getAdjustedCost(p), 0).toFixed(1));
  };

  // Derived average ROI
  const getAverageRoi = () => {
    const selectedWithRoi = projects.filter((p) => p.selected && p.roi !== null);
    if (selectedWithRoi.length === 0) return 0;
    const sum = selectedWithRoi.reduce((acc, p) => acc + (p.roi || 0), 0);
    return Number((sum / selectedWithRoi.length).toFixed(1));
  };

  // Derived community benefit
  const getAverageCommunityBenefit = () => {
    const selected = projects.filter((p) => p.selected);
    if (selected.length === 0) return 0;
    const sum = selected.reduce((acc, p) => acc + (p.communityBenefit || 0), 0);
    return Number((sum / selected.length).toFixed(1));
  };

  // Derived high-carbon reductions count
  const getHighCarbonCount = () => {
    return projects.filter((p) => p.selected && p.carbonImpact === "HIGH").length;
  };

  // Exceeded warning
  const isBudgetExceeded = getCommittedBudget() > budgetCap;

  // Filtered projects list
  const filteredProjects = projects.filter((p) => {
    const passRegion = regionFilter === "ALL" || p.region.toLowerCase().includes(regionFilter.toLowerCase()) || p.region === regionFilter;
    const passImpact = impactFilter === "ALL" || p.reliabilityImpact === impactFilter;
    return passRegion && passImpact;
  });

  // Generate Optimal Investment Plan (Sorting by combination of high ROI + High/Med/Low Carbon reduction impact)
  const handleGenerateOptimalPlan = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      // Calculate a composite alignment index: ROI contribution + Carbon weight (HIGH = 35, MEDIUM = 20, LOW = 5) + CommunityBenefit*3
      const scored = [...projects].map((p) => {
        const roiVal = p.roi || 0;
        const carbonVal = p.carbonImpact === "HIGH" ? 35 : p.carbonImpact === "MEDIUM" ? 20 : 5;
        const communityVal = (p.communityBenefit || 5) * 3;
        const compositeScore = Number((roiVal + carbonVal + communityVal).toFixed(1));
        return { ...p, computedComposite: compositeScore };
      });

      // Sort descending by composite score
      scored.sort((a,b) => b.computedComposite - a.computedComposite);

      // Select high-value assets matching budgetCap
      let currentSpent = 0;
      const optimized = scored.map((p) => {
        const costVal = getAdjustedCost(p);
        if (currentSpent + costVal <= budgetCap) {
          currentSpent += costVal;
          return { ...p, selected: true };
        } else {
          return { ...p, selected: false };
        }
      });

      // Restore initial array indexing structure but commit optimized checkboxes
      const finalized = projects.map((p) => {
        const matchingOptimized = optimized.find((o) => o.id === p.id);
        return { ...p, selected: matchingOptimized ? matchingOptimized.selected : false };
      });

      setProjects(finalized);
      setIsOptimizing(false);

      const action: RecentAction = {
        id: `act-${Date.now()}`,
        title: "Optimization Ledger Generated",
        description: "Portfolio re-classified using High ROI + High Carbon reduction composite formula constraints.",
        time: "Just now"
      };
      setRecentActions([action, ...recentActions.slice(0, 3)]);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-hidden h-[calc(100vh-3.5rem)] flex bg-[#F8FAFC] text-[#0F172A] select-text font-sans border-t border-[#E2E8F0]">
      
      {/* Central Table Region */}
      <section className="flex-1 overflow-y-auto p-6 relative border-r border-[#E2E8F0]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#0c1a30_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Prioritized ledger heading */}
        <header className="mb-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Investment Prioritization</h1>
            <p className="text-slate-500 text-xs mt-1 leading-normal">Capital allocation ledger aligning projected financial return, carbon performance offsets, and localized reliability indexes.</p>
          </div>
          
          {/* Status indicators */}
          <div className="flex flex-wrap gap-2.5">
            <div className="bg-[#eff4ff] border border-blue-100 p-2.5 rounded-lg flex flex-col min-w-[110px] text-center shadow-xs">
              <span className="text-[8px] font-black tracking-widest text-[#0F4C81] uppercase">COMMITTED CAPEX</span>
              <span className={`font-mono text-sm md:text-base font-black ${isBudgetExceeded ? "text-red-600 animate-pulse" : "text-[#0F4C81]"}`}>
                ₹{getCommittedBudget()} Cr
              </span>
            </div>
            <div className="bg-[#eff4ff] border border-blue-100 p-2.5 rounded-lg flex flex-col min-w-[110px] text-center shadow-xs">
              <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">LIMIT CEILING</span>
              <span className="font-mono text-sm md:text-base font-black text-slate-700">
                ₹{budgetCap} Cr
              </span>
            </div>
            <div className="bg-[#eff4ff] border border-blue-100 p-2.5 rounded-lg flex flex-col min-w-[110px] text-center shadow-xs">
              <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">HIGH CARBON RED.</span>
              <span className="font-mono text-sm md:text-base font-black text-emerald-600">
                {getHighCarbonCount()} ASSETS
              </span>
            </div>
            <div className="bg-[#eff4ff] border border-blue-100 p-2.5 rounded-lg flex flex-col min-w-[115px] text-center shadow-xs">
              <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">SOCIETY WELFARE</span>
              <span className="font-mono text-sm md:text-base font-black text-sky-600">
                {getAverageCommunityBenefit()}/10
              </span>
            </div>
          </div>
        </header>

        {/* Budget limit Cap Exceeded Warning banner if exceeded */}
        {isBudgetExceeded && (
          <div className="bg-rose-50 border border-rose-200 rounded px-4 py-2.5 text-rose-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-5 animate-pulse">
            <span className="material-symbols-outlined text-base">warning</span>
            <span>CAPEX OVER BUDGET CAP! Adjust ledger checkboxes or increase budget ceiling slider on side view.</span>
          </div>
        )}

        {/* Dynamic Horizontal committed budget progression gauge */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 shadow-xs mb-6 relative z-10">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">
            <span>Committed Progression</span>
            <span className="text-[#0F172A]">{Math.round((getCommittedBudget() / budgetCap) * 100)}% Cap Used</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isBudgetExceeded ? "bg-red-600" : "bg-[#0F4C81]"}`}
              style={{ width: `${Math.min(100, (getCommittedBudget() / budgetCap) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Filters control widgets bar */}
        <div className="bg-white p-3 h-14 border border-[#E2E8F0] rounded-lg shadow-xs mb-4 relative z-10 flex items-center justify-between text-xs font-medium text-[#475569]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Region:</span>
              <select 
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-slate-50 border border-[#E2E8F0] p-1 px-2.5 text-xs rounded font-bold text-slate-800 focus:outline-none focus:border-[#0F4C81]"
              >
                <option value="ALL">All Regions</option>
                <option value="North Region">North Region</option>
                <option value="South Region">South Region</option>
                <option value="East Region">East Region</option>
                <option value="West Region">West Region</option>
                <option value="Central Region">Central Region</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Impact:</span>
              <select 
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
                className="bg-slate-50 border border-[#E2E8F0] p-1 px-2.5 text-xs rounded font-bold text-slate-800 focus:outline-none focus:border-[#0F4C81]"
              >
                <option value="ALL">All Impacts</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
          </div>

          <div className="font-mono text-[10px] text-slate-400">
            Showing {filteredProjects.length} of {projects.length} Proposed Assets
          </div>
        </div>

        {/* Project Ledger Ledger Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-widest text-[#475569] border-b border-[#E2E8F0]">
                  <th className="p-4 w-12 text-center border-r border-[#E2E8F0]">Inclusion</th>
                  <th className="p-4">Project Name</th>
                  <th className="p-4">Region Location</th>
                  <th className="p-4 text-right">Cost (Capex)</th>
                  <th className="p-4 text-right">Proj. ROI</th>
                  <th className="p-4 text-center">Carbon Reduction</th>
                  <th className="p-4 text-right">Risk Mitigation</th>
                  <th className="p-4 text-right">Comm Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.id}
                    className={`hover:bg-slate-50/50 transition-all duration-150 ${
                      p.selected ? "bg-[#eff4ff]/60 border-l-4 border-l-[#0F4C81]" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center border-r border-[#E2E8F0]">
                      <input 
                        type="checkbox"
                        checked={p.selected}
                        onChange={() => handleToggleProject(p.id, p.name)}
                        className="rounded text-[#0F4C81] focus:ring-[#0F4C81] cursor-pointer w-[18px] h-[18px] border-slate-350 accent-[#0F4C81]"
                      />
                    </td>

                    {/* Proposal Name */}
                    <td className="p-4 font-extrabold text-[#0F172A]">{p.name}</td>

                    {/* Region Location */}
                    <td className="p-4 text-slate-600 font-medium">{p.region}</td>

                    {/* Cost in Crore */}
                    <td className="p-4 text-right font-mono font-black text-[#0F172A]">₹{getAdjustedCost(p)} Cr</td>

                    {/* Projected ROI */}
                    <td className="p-4 text-right font-mono font-black text-[#0F4C81]">
                      {p.roi !== null ? `${p.roi}%` : "N/A"}
                    </td>

                    {/* Carbon Impact display */}
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider leading-none ${
                        p.carbonImpact === "HIGH" 
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                          : p.carbonImpact === "MEDIUM" 
                            ? "bg-amber-50 text-amber-800 border border-amber-100" 
                            : "bg-slate-100 text-slate-500"
                      }`}>
                        {p.carbonImpact || "LOW"}
                      </span>
                    </td>

                    {/* Risk Mitigation weight */}
                    <td className="p-4 text-right font-mono font-bold text-slate-700">
                      {p.riskWeight || 50}%
                    </td>

                    {/* Community benefit scale */}
                    <td className="p-4 text-right font-mono font-black text-slate-700">
                      {p.communityBenefit || 5}/10
                    </td>
                  </tr>
                ))}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wide">
                      No matching projects found for selected filtration.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Audit ledger Sidebar Sandbox (Right Column) */}
      <aside className="w-[360px] bg-slate-50 flex flex-col z-20 justify-between">
        
        {/* Panel Container Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white">
          <h3 className="text-xs font-black uppercase text-[#0F172A] tracking-wider">Decision Intelligence Optimizer</h3>
          <p className="text-[10px] text-slate-500 mt-1 uppercase leading-snug">Maximize investment returns conditional upon carbon performance limits.</p>
        </div>

        {/* Contents area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
          
          {/* Dynamic Cap adjuster */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs space-y-3">
            <div className="flex justify-between items-center leading-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Adjust budget cap limit</span>
              <span className="font-mono text-base font-black text-[#0F4C81]">₹{budgetCap} Cr</span>
            </div>
            <input 
              type="range"
              min={1000}
              max={12000}
              step={100}
              value={budgetCap}
              onChange={(e) => setBudgetCap(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-[#0F4C81] focus:outline-none" 
            />
            <p className="text-[9.5px] text-slate-450 leading-relaxed">
              Sets hard constraint boundaries for capital asset generation simulations.
            </p>
          </div>

          {/* Target ROI and indices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 border border-[#E2E8F0] rounded-lg">
              <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block mb-1">AGGREGATE ROI</span>
              <span className="font-mono text-lg font-black text-[#0F4C81] leading-none">{getAverageRoi()}%</span>
            </div>
            <div className="bg-white p-4 border border-[#E2E8F0] rounded-lg">
              <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block mb-1">BUDGET MARGIN</span>
              <span className={`font-mono text-lg font-black leading-none ${isBudgetExceeded ? "text-red-600" : "text-emerald-600"}`}>
                ₹{(budgetCap - getCommittedBudget()).toFixed(1)} Cr
              </span>
            </div>
          </div>

          {/* Investment Intelligence: Top Strategic Priorities */}
          <div className="bg-[#eff4ff] border border-blue-100 p-4 rounded-lg shadow-xs space-y-3 text-slate-800">
            <div className="flex justify-between items-center pb-2 border-b border-blue-200">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#0F4C81]">finance</span>
                <span className="text-[9px] font-black tracking-widest text-[#0F4C81] uppercase">
                  INVESTMENT PRIORITIES
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white text-[#0F4C81] font-bold border border-blue-200">
                PORTFOLIO ANALYSIS
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="bg-white border border-blue-100 p-2.5 rounded hover:border-[#0F4C81] transition-all">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-[#0F172A] font-extrabold">#1 Bhadla-Delhi Green Link</span>
                  <span className="text-emerald-700 font-mono font-bold">+14.8% ROI</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  High return green transmission capital asset providing deep solar stabilization during peak northern grid load hours.
                </p>
              </div>

              <div className="bg-white border border-blue-100 p-2.5 rounded hover:border-[#0F4C81] transition-all">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-[#0F172A] font-extrabold">#2 Kutch Desert BESS Array</span>
                  <span className="text-emerald-700 font-mono font-bold">+13.5% ROI</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  Utility battery pack storage, mitigating evening grid sags and peak EV coincidences.
                </p>
              </div>
            </div>
          </div>

          {/* Audit trail actions */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <h4 className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest mb-3.5 px-1">CAPITAL ALLOCATION ACTIONS</h4>
            
            <div className="space-y-3">
              {recentActions.map((act) => (
                <div key={act.id} className="p-3 bg-white border border-[#E2E8F0] rounded-lg shadow-xs text-xs space-y-1">
                  <div className="flex justify-between items-center leading-none">
                    <span className="font-extrabold text-[#0F172A] truncate block pr-2">{act.title}</span>
                    <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">{act.time}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">{act.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Optimise Plans Triggers */}
        <div className="p-4 bg-white border-t border-[#E2E8F0] space-y-3 sticky bottom-0 z-20">
          <button 
            disabled={isOptimizing}
            onClick={handleGenerateOptimalPlan}
            className="w-full bg-[#0F4C81] hover:bg-[#2563EB] text-white rounded font-bold py-3 text-[11px] uppercase tracking-wider text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            {isOptimizing ? "RUNNING HEURISTICS PLANNER..." : "GENERATE OPTIMAL INVESTMENT PLAN"}
          </button>
          <button 
            onClick={() => setProjects(projects.map(p => ({ ...p, selected: false })))}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] text-[10px] font-black uppercase tracking-wider rounded cursor-pointer leading-none"
          >
            Clear Ledger Selections
          </button>
        </div>
      </aside>

    </div>
  );
};

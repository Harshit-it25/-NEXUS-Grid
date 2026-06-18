import React from "react";

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

interface BranchingTabProps {
  branches: WhatIfBranch[];
  setBranches: React.Dispatch<React.SetStateAction<WhatIfBranch[]>>;
}

export const BranchingTab: React.FC<BranchingTabProps> = ({
  branches,
  setBranches,
}) => {
  return (
    <div className="space-y-6 relative z-10 transition-opacity duration-300">
      {/* Visual branching layout map */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-lg">split_scene</span>
          Interactive What-If Strategy Branches
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-medium font-sans">
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
              <p className="text-[10px] text-slate-500 mt-1 select-none leading-tight font-semibold font-sans">Extreme Thermal Heatwave Stress 2040 Profile</p>
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
                    <h4 className="text-xs font-black text-slate-800 mt-1 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-purple-600 text-base">fork_right</span>
                      {br.name || `Mitigated Path [v${br.id.slice(-3)}]`}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-1.5 leading-tight font-semibold font-sans">
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
                    <div className="flex justify-between text-[10.5px] font-bold select-none font-sans">
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
                    <div className="flex justify-between text-[10.5px] font-bold select-none font-sans">
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
              <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1 font-sans">
                <span className="material-symbols-outlined text-sm text-purple-600">verified</span>
                Optimal Divergent Trade-off
              </h4>
              <p className="text-[11.5px] text-slate-600 leading-normal font-semibold font-sans">
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
  );
};

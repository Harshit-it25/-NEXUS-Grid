import React from "react";
import { Stakeholder } from "../../types";

interface ConsensusStrategiesProps {
  stakeholders: Stakeholder[];
  overallConsensus: number;
}

export const ConsensusStrategies: React.FC<ConsensusStrategiesProps> = ({
  stakeholders,
  overallConsensus,
}) => {
  const isAligned = stakeholders.filter((s) => s.isConflict).length === 0;

  return (
    <section className="w-[360px] bg-slate-50 border-l border-[#E2E8F0] flex flex-col z-10 select-text">
      {/* Column Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-white">
        <h3 className="text-xs font-black uppercase text-[#0F172A]">Consensus Strategy</h3>
        <p className="text-[10px] text-slate-500 mt-1 uppercase">Board directive alignment outcomes ledger.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Executive Consensus Status Card */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#0F4C81]">group_work</span>
              <span className="text-[9px] font-black tracking-widest text-[#0F4C81] uppercase">
                COUNCIL CONSENSUS STATUS
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#eff4ff] text-[#0F4C81] border border-blue-100">
              LIVE LEDGER
            </span>
          </div>

          <div className="space-y-2.5 text-[10.5px]">
            {/* Active Stakeholders Alignment Mini list */}
            <div>
              <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ACTIVE MEMBER COMMITTAL</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono select-none">
                {stakeholders.map((s) => (
                  <div key={s.id} className="flex justify-between items-center bg-white border border-slate-200 px-2 py-1 rounded">
                    <span className="text-slate-500 truncate max-w-[85px]">{s.role}</span>
                    <span className={`font-black ${s.isConflict ? "text-rose-600" : "text-emerald-600"}`}>{s.tradeoffScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status indices */}
            <div className="flex justify-between items-center bg-slate-50 border border-[#E2E8F0] px-2 py-1.5 rounded mt-1 text-[11px]">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-bold uppercase text-[9px]">CONVERGENCE INDEX:</span>
                <span className="font-mono font-black text-[#0F4C81]">{overallConsensus}%</span>
              </div>
              <div className="flex items-center gap-1 font-bold">
                <span className="text-slate-500 uppercase text-[9px]">CONFLICTS:</span>
                <span className={`font-mono ${stakeholders.filter((s) => s.isConflict).length > 0 ? "text-rose-600 font-extrabold" : "text-emerald-600"}`}>
                  {stakeholders.filter((s) => s.isConflict).length}
                </span>
              </div>
            </div>

            {/* Dynamic Consensus Alignment Recommendation */}
            <div className="p-2 bg-[#eff4ff] border border-blue-100 rounded text-[10px] text-[#0F4C81] italic flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 animate-ping"></span>
              <span>
                {stakeholders.filter((s) => s.isConflict).length > 0
                  ? "Synthesizing Policy compromise model... Suggest compromises on lower capacity thresholds."
                  : "Policy unified. All stakeholder priorities satisfy baseline criteria bounds."}
              </span>
            </div>
          </div>
        </div>

        {/* Consensus progress gauge circle card */}
        <div className={`p-5 rounded-lg shadow-xs flex flex-col items-center border transition-all duration-300 ${
          isAligned ? "bg-slate-50 border-emerald-500/30" : "bg-white border-[#E2E8F0]"
        }`}>
          <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 text-center mb-3 block">
            Consensus Status Indicator
          </span>

          {/* Radial SVG Gauge */}
          <div className="relative w-32 h-32 flex items-center justify-center p-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-100 fill-none" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                className={`fill-none transition-all duration-300 stroke-[8] ${
                  isAligned ? "stroke-emerald-600" : "stroke-[#0F4C81]"
                }`}
                strokeDasharray={339}
                strokeDashoffset={339 - (339 * overallConsensus) / 100}
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center justify-center">
              {isAligned ? (
                <>
                  <span className="font-mono text-xl font-black text-emerald-700 leading-none">100%</span>
                  <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-emerald-600 mt-1 leading-none">Aligned</span>
                </>
              ) : (
                <>
                  <span className="font-mono text-xl font-black text-[#0F172A] leading-none">
                    {overallConsensus}%
                  </span>
                  <span className="text-[7.5px] font-bold uppercase tracking-widest text-[#0F4C81] mt-1 leading-none">
                    Agreed Index
                  </span>
                </>
              )}
            </div>
          </div>

          {isAligned && (
            <div className="mt-4 w-full p-3 bg-emerald-50/50 border border-emerald-200/50 rounded-md text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-emerald-800 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Consensus Achieved
              </div>
              <div className="text-[10px] font-semibold text-slate-600">
                Alignment Score: <span className="font-mono text-emerald-700 font-extrabold">100%</span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium leading-tight">
                All stakeholder objectives satisfied.
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-between w-full text-[10px] text-[#64748B] font-bold border-t pt-3 border-slate-100">
            <span className="text-emerald-600">
              {stakeholders.filter((s) => s.tradeoffScore >= 45).length} SECURED
            </span>
            <span className={`${isAligned ? "text-emerald-600" : "text-rose-600"} uppercase`}>
              {stakeholders.filter((s) => s.isConflict).length} CONFLICTS
            </span>
          </div>
        </div>

        {/* List of active disagreements / compromise details */}
        <div className="space-y-2.5">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wide block px-1">
            BOARDROOM DISAGREEMENTS PENDING
          </span>

          {stakeholders.filter((s) => s.isConflict).length === 0 ? (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-xs text-emerald-800">
              <p className="font-bold">UNANIMOUS AGREEMENT REACHED!</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                All stakeholder trade-off parameters satisfy consensus clearance. Ready to deploy Modernization Action.
              </p>
            </div>
          ) : (
            stakeholders
              .filter((s) => s.isConflict)
              .map((s) => (
                <div key={s.id} className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded text-xs text-slate-800">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#0F172A]">{s.role} Conflict</span>
                    <span className="font-mono text-[9px] text-rose-700">Score: {s.tradeoffScore}%</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-normal">
                    Requires compromising capacity above 45% threshold.
                  </p>
                </div>
              ))
          )}
        </div>

        {/* Final boardroom policy directive */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs">
          <span className="text-[8.5px] font-bold text-[#0F4C81] uppercase tracking-widest block mb-2">
            FINAL RECOMMENDED CORPORATE DIRECTIVE
          </span>
          <div className="text-xs space-y-2 select-text text-slate-600">
            <p className="font-semibold leading-relaxed">
              1. Ratify 2040 Decarbonization Targets conditional upon securing capital portfolio boundaries.
            </p>
            <p className="font-semibold leading-relaxed">
              2. Phase-in regional Boreas undersea lines concurrently with rural microgrid battery loop backflow isolators.
            </p>
            <p className="font-semibold leading-relaxed">
              3. Authorize smart grid residential curtailment mesh under Extreme Climate Stress declarations only.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-[#E2E8F0] text-center">
        <p className="text-[9.5px] text-slate-400">Approved minutes are saved in the NEXUS Ledger state registry.</p>
      </div>
    </section>
  );
};

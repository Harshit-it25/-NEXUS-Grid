import React from "react";
import { Stakeholder } from "../../types";

interface StakeholderDelegatesProps {
  stakeholders: Stakeholder[];
  selectedStakeholder: Stakeholder | null;
  setSelectedStakeholder: (stk: Stakeholder) => void;
  getBoardroomAids: (role: string) => {
    priorityScore: string;
    evidence: string;
    recommendation: string;
    disagreement: string;
  };
}

export const StakeholderDelegates: React.FC<StakeholderDelegatesProps> = ({
  stakeholders,
  selectedStakeholder,
  setSelectedStakeholder,
  getBoardroomAids,
}) => {
  return (
    <section className="w-[340px] bg-white border-r border-[#E2E8F0] flex flex-col z-10">
      {/* Column Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-black uppercase text-[#0F4C81] tracking-wider">BOARD MEMBERS</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 uppercase">STAKEHOLDER OBJECTIVES</p>
        </div>
        <span className="text-[9px] font-mono font-black bg-slate-200 text-[#475569] px-1.5 py-0.5 rounded">
          {stakeholders.length} SEATS
        </span>
      </div>

      {/* Members Cards Stack List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-text">
        {stakeholders.map((stk) => {
          const isSelected = selectedStakeholder?.id === stk.id;
          const aids = getBoardroomAids(stk.role || stk.name);
          const isCriticalDisagreement = stk.tradeoffScore < 45;

          return (
            <div
              key={stk.id}
              onClick={() => setSelectedStakeholder(stk)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                isSelected
                  ? "border-[#0F4C81] bg-[#eff4ff] ring-2 ring-blue-100"
                  : "border-[#E2E8F0] bg-white hover:border-[#0F4C81]"
              }`}
            >
              {/* Header info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      stk.colorClass === "text-emerald-500"
                        ? "bg-emerald-500"
                        : stk.colorClass === "text-red-500"
                        ? "bg-red-500"
                        : "bg-sky-500"
                    }`}
                  ></span>
                  <span className="font-extrabold text-xs text-[#0F172A] truncate max-w-[130px]">
                    {stk.name}
                  </span>
                </div>
                <span className="font-mono text-[9px] font-black text-[#0F4C81]">
                  {stk.role}
                </span>
              </div>

              {/* Condensed Core Objective */}
              <p className="text-[11px] text-slate-600 leading-tight">
                "{stk.objective}"
              </p>

              {/* Priority Score and Conflict tags indicators */}
              <div className="mt-3.5 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="flex gap-1 items-center">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                    priority:
                  </span>
                  <span className="font-mono text-[9.5px] font-black text-slate-800">
                    {aids.priorityScore}
                  </span>
                </div>

                {isCriticalDisagreement ? (
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-800 text-[8.5px] font-black rounded tracking-wide border border-red-100 uppercase">
                    CONFLICTING
                  </span>
                ) : (
                  <span className="px-1 py-0.5 bg-emerald-50 text-emerald-800 text-[8.5px] font-black rounded border border-emerald-100 uppercase">
                    ALIGNED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React from "react";
import { ScenarioParameters } from "../../types";

interface ScenarioSandboxTabProps {
  params: ScenarioParameters;
  setParams: React.Dispatch<React.SetStateAction<ScenarioParameters>>;
  calculating: boolean;
  handleRecalculateAll: () => void;
  getPeakLoad: () => number;
  getEmissionsOffset: () => number;
  getOpexSavings: () => number;
}

export const ScenarioSandboxTab: React.FC<ScenarioSandboxTabProps> = ({
  params,
  setParams,
  calculating,
  handleRecalculateAll,
  getPeakLoad,
  getEmissionsOffset,
  getOpexSavings,
}) => {
  return (
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
  );
};

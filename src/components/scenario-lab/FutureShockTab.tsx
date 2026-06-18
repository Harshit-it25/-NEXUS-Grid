import React from "react";

interface FutureShockTabProps {
  shockEv: number;
  setShockEv: React.Dispatch<React.SetStateAction<number>>;
  shockRenewable: number;
  setShockRenewable: React.Dispatch<React.SetStateAction<number>>;
  shockIndustrial: number;
  setShockIndustrial: React.Dispatch<React.SetStateAction<number>>;
  shockRetireFossil: number;
  setShockRetireFossil: React.Dispatch<React.SetStateAction<number>>;
  shockSimulating: boolean;
  shockStep: number;
  shockLogs: string[];
  projectedReliability: number;
  investmentReq: string;
  renewableImpact: number;
  carbonReduction: number;
  handleStartShockSimulation: () => void;
  setShockStep: React.Dispatch<React.SetStateAction<number>>;
  setShockLogs: React.Dispatch<React.SetStateAction<string[]>>;
  setProjectedReliability: React.Dispatch<React.SetStateAction<number>>;
  setInvestmentReq: React.Dispatch<React.SetStateAction<string>>;
}

export const FutureShockTab: React.FC<FutureShockTabProps> = ({
  shockEv,
  setShockEv,
  shockRenewable,
  setShockRenewable,
  shockIndustrial,
  setShockIndustrial,
  shockRetireFossil,
  setShockRetireFossil,
  shockSimulating,
  shockStep,
  shockLogs,
  projectedReliability,
  investmentReq,
  renewableImpact,
  carbonReduction,
  handleStartShockSimulation,
  setShockStep,
  setShockLogs,
  setProjectedReliability,
  setInvestmentReq,
}) => {
  return (
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
          {/* Left Column: SVG Grid with Logs */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-56 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-10"></div>
              
              {/* Visual grid schematics */}
              <div className="relative z-10 w-full h-full">
                <svg className="w-full h-full opacity-90">
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
   
          {/* Right Column: Live Telemetry Progression */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Demand Growth</span>
          <div>
            <span className="text-xl font-mono font-black text-[#0F4C81] block mt-2">
              {shockStep === 0 ? "+35%" : shockStep === 1 ? "+54%" : shockStep === 2 ? "+72%" : shockStep === 3 ? "+89%" : "+62%"}
            </span>
            <span className="text-[9.5px] font-semibold text-slate-500 block">Coincidence Peak Loading</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Renewable Expansion</span>
          <div>
            <span className="text-xl font-mono font-black text-emerald-600 block mt-2">
              {shockStep === 0 ? "+20%" : shockStep === 1 ? "+45%" : shockStep === 2 ? "+70%" : shockStep === 3 ? "+91%" : "+75%"}
            </span>
            <span className="text-[9.5px] font-semibold text-slate-500 block">Clean Source Penetration</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Grid Congestion Risk</span>
          <div>
            <span className={`text-xl font-mono font-black block mt-2 ${shockStep >= 3 ? "text-orange-600" : shockStep >= 2 ? "text-amber-600" : "text-emerald-600"}`}>
              {shockStep === 0 ? "12%" : shockStep === 1 ? "28%" : shockStep === 2 ? "65%" : shockStep === 3 ? "98%" : "86%"}
            </span>
            <span className="text-[9.5px] font-semibold text-slate-500 block">Substation Thermal Limits</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">System Stability</span>
          <div>
            <span className={`text-xl font-mono font-black block mt-2 ${shockStep === 3 ? "text-amber-600" : "text-emerald-600"}`}>
              {shockStep === 0 ? "Healthy" : shockStep === 1 ? "Stable" : shockStep === 2 ? "Warning" : shockStep === 3 ? "Stressed" : "Secured"}
            </span>
            <span className="text-[9.5px] font-semibold text-slate-500 block">Operating Stability Margin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

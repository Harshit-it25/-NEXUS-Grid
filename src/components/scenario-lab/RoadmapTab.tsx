import React from "react";

interface RoadmapTabProps {
  activeRoadmapPhase: 2030 | 2040 | 2050;
  setActiveRoadmapPhase: React.Dispatch<React.SetStateAction<2030 | 2040 | 2050>>;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
  activeRoadmapPhase,
  setActiveRoadmapPhase,
}) => {
  return (
    <div className="space-y-6 relative z-10 transition-opacity duration-300">
      {/* Timeline selector tabs */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-1 flex gap-1 shadow-sm select-none">
        {([2030, 2040, 2050] as const).map((phase) => (
          <button 
            key={phase}
            onClick={() => setActiveRoadmapPhase(phase)}
            className={`flex-1 py-2 text-[10px] uppercase font-black rounded-md cursor-pointer transition-all ${
              activeRoadmapPhase === phase 
                ? "bg-[#0F4C81] text-white shadow" 
                : "text-slate-500 hover:bg-slate-200"
            }`}
          >
            Phase {phase === 2030 ? "1" : phase === 2040 ? "2" : "3"}: {phase}
          </button>
        ))}
      </div>

      {/* Comprehensive details of selected phase */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5 select-text">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <span className="text-[9px] font-bold text-[#0F4C81] uppercase tracking-widest block">STRATEGIC PLANNING PORTFOLIO</span>
            <h3 className="text-lg font-black text-slate-900 mt-1 uppercase">Grid Modernization Plan - Phase {activeRoadmapPhase === 2030 ? "I" : activeRoadmapPhase === 2040 ? "II" : "III"} (Year {activeRoadmapPhase})</h3>
          </div>
          <div className="text-right min-w-[120px]">
            <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wide">ALLOCATED BUDGET</span>
            <span className="font-mono text-base font-black text-slate-800 block">
              {activeRoadmapPhase === 2030 ? "₹480 Cr" : activeRoadmapPhase === 2040 ? "₹1,200 Cr" : "₹3,100 Cr"}
            </span>
          </div>
        </div>

        {/* Sub project list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">PROJECT DIRECTIVE</span>
              <h4 className="text-sm font-black text-[#0F4C81] mt-1">
                {activeRoadmapPhase === 2030 ? "Substation Digital Retrofit" : activeRoadmapPhase === 2040 ? "Offshore Boreas HVDC Link" : "Hydrogen Gas Turbine Swap"}
              </h4>
              <p className="text-[11.5px] text-slate-600 mt-1 leading-normal font-medium font-sans">
                {activeRoadmapPhase === 2030 
                  ? "Install unified fiber telemetry nodes across all primary grid interfaces to avoid transient load shedding." 
                  : activeRoadmapPhase === 2040 
                    ? "Establish dual core undersea high-voltage pathways to deliver available wind output to capital infrastructure hubs." 
                    : "Transition natural gas firing stations to liquid Organic Hydrogen reserves to sustain baseline zero-carbon firming capacity."}
              </p>
            </div>
            <span className="text-[10px] text-[#0F4C81] font-bold mt-3 block">Target: Reliable Sourcing</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">PROJECT DIRECTIVE</span>
              <h4 className="text-sm font-black text-[#0F4C81] mt-1">
                {activeRoadmapPhase === 2030 ? "Metro Edge Mesh AMI Gateways" : activeRoadmapPhase === 2040 ? "Megapack Core Pacific Basin" : "LOHC Bulk Fuel Reservoir"}
              </h4>
              <p className="text-[11.5px] text-slate-600 mt-1 leading-normal font-medium font-sans">
                {activeRoadmapPhase === 2030 
                  ? "Complete high-resolution smart feedback counters rollout across metropolitan distribution centers." 
                  : activeRoadmapPhase === 2040 
                    ? "Deploy 300MWh regional utility storage at secondary border zones to shave high vehicle charging peaks." 
                    : "Build high-capacity subterranean hydrogen containment fields to hedge grid reserve index during long sunless winter cycles."}
              </p>
            </div>
            <span className="text-[10px] text-[#0F4C81] font-bold mt-3 block">Target: Capacity Buffers</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">PROJECT DIRECTIVE</span>
              <h4 className="text-sm font-black text-[#0F4C81] mt-1">
                {activeRoadmapPhase === 2030 ? "Commune Microgrid Loop A" : activeRoadmapPhase === 2040 ? "Industrial Zone Microgrid" : "Deep Sea Undersea Ties"}
              </h4>
              <p className="text-[11.5px] text-slate-600 mt-1 leading-normal font-medium font-sans">
                {activeRoadmapPhase === 2030 
                  ? "Equip 12 remote mountain cooperatives with modular solar cells paired with automated line disconnectors." 
                  : activeRoadmapPhase === 2040 
                    ? "Form independent smart microgrids for heavy factories to decouple delicate processing sags from national lines." 
                    : "Extend global inter-tie vectors to tap international green energy loops."}
              </p>
            </div>
            <span className="text-[10px] text-[#0F4C81] font-bold mt-3 block">Target: Outage Resilience</span>
          </div>
        </div>

        {/* Targets indices and risk assessments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
            <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wide">Risk Assessment / Stress Impediments</span>
            <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-semibold">
              {activeRoadmapPhase === 2030 
                ? "MODERATE. Main risk is material supply chain latency of fiber processors and local union contractor capacity constraints." 
                : activeRoadmapPhase === 2040 
                  ? "HIGH. High wind penetration causes voltage and inertia droop stability sags, requiring synchronous compensator buffers." 
                  : "SEVERE. Phase-out of traditional baseload steam turbines requires advanced grid-forming inverters and large-scale synthetic inertia systems."}
            </p>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wide">Projected Impact Outcomes</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-semibold text-xs text-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Expected reliability:</span>
                <span>{activeRoadmapPhase === 2030 ? "+12.4% SAIFI" : activeRoadmapPhase === 2040 ? "+22.5% SAIFI" : "+35.0% SAIFI"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Renewable share target:</span>
                <span>{activeRoadmapPhase === 2030 ? "35%" : activeRoadmapPhase === 2040 ? "70%" : "100% Zero-Carbon"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Electrification Coverage:</span>
                <span>{activeRoadmapPhase === 2030 ? "90%" : activeRoadmapPhase === 2040 ? "98%" : "100% universal"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-normal">Carbon Reduction:</span>
                <span>{activeRoadmapPhase === 2030 ? "-15%" : activeRoadmapPhase === 2040 ? "-55%" : "-98% Offset"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

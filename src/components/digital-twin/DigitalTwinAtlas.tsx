import React from "react";
import { ScopeType, RegionType } from "../../PlanningScopeContext";

interface DigitalTwinAtlasProps {
  layers: {
    windFarms: boolean;
    solarArrays: boolean;
    transmissionLines: boolean;
    energyStorage: boolean;
    consumptionNodes: boolean;
    renewableBottlenecks: boolean;
  };
  setLayers: React.Dispatch<React.SetStateAction<{
    windFarms: boolean;
    solarArrays: boolean;
    transmissionLines: boolean;
    energyStorage: boolean;
    consumptionNodes: boolean;
    renewableBottlenecks: boolean;
  }>>;
  scopeType: ScopeType;
  selectedRegion: RegionType;
  selectedHorizon: number;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  twinMode: "REAL_INFRASTRUCTURE" | "PLANNING_SIMULATION";
  selectedAsset: string;
  setSelectedAsset: React.Dispatch<React.SetStateAction<string>>;
  setIsDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  planningMode: "NATIONAL" | "MUNICIPAL" | "RURAL";
  getDynamicHealth: () => number;
  getDynamicRenewable: () => number;
  getSelectedAssetSpecs: () => any;
  getScaledValText: (item: any) => string;
  visibleAssets: any[];
}

export const DigitalTwinAtlas: React.FC<DigitalTwinAtlasProps> = ({
  layers,
  setLayers,
  scopeType,
  selectedRegion,
  selectedHorizon,
  zoom,
  setZoom,
  year,
  setYear,
  twinMode,
  selectedAsset,
  setSelectedAsset,
  setIsDetailOpen,
  planningMode,
  getDynamicHealth,
  getDynamicRenewable,
  getSelectedAssetSpecs,
  getScaledValText,
  visibleAssets,
}) => {
  return (
    <>
      {/* Western Solar Curtailment risk hotspot */}
      {layers.renewableBottlenecks && (
        <>
          <div className="absolute top-[28%] left-[26%] -translate-y-24 z-30 pointer-events-auto bg-[#881337]/95 text-white border border-[#E11D48] p-2.5 rounded-lg shadow-xl text-[10px] max-w-[170px] select-text">
            <div className="flex items-center gap-1 font-black text-[#FDA4AF]">
              <span className="material-symbols-outlined text-[12px] animate-ping font-black">report</span>
              <span>Solar Curtailment Risk</span>
            </div>
            <p className="text-[9px] text-[#FECDD3] mt-1 leading-normal font-sans font-medium">
              Generation exceeds link capacity by <span className="font-bold text-white">280 MW</span> during mid-day peak. High voltage violation risk.
            </p>
          </div>
          
          <div className="absolute top-[36%] left-[42%] translate-x-8 -translate-y-16 z-30 pointer-events-auto bg-[#881337]/95 text-white border border-[#E11D48] p-2.5 rounded-lg shadow-xl text-[10px] max-w-[170px] select-text">
            <div className="flex items-center gap-1 font-black text-[#FDA4AF]">
              <span className="material-symbols-outlined text-[12px] text-[#FB7185]">bolt</span>
              <span>Grid capacity Mismatch</span>
            </div>
            <p className="text-[9px] text-[#FECDD3] mt-1 leading-normal font-sans font-medium">
              Delhi Corridor S-14 is at <span className="font-bold text-white">84.5%</span> capacity ceiling. Transmission congestion active.
            </p>
          </div>
        </>
      )}

      {/* Fullscreen Map Backdrop */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-500 origin-center flex items-center justify-center pointer-events-none"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <img 
          alt="GIS interface showing energy grid infrastructure map" 
          className="w-full h-full object-cover opacity-80 transition-all duration-750" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFA_jX64hiBKi8CuyNmcM-tKSSttLvHNtpxVeo3UC2OL1bb8q7NTC1Gfx9okp4xqd1yq5EYr5vI4jF2b0rlvG7ytOYTfVwd5FzXoDhlEgkNCXrDVsUPGnq5kbUSvr4jEbQxM_qTqS6nHMl724OxdMpSf5irz8KxyCKNE5AUgGzdKLW3YbgW85Hx69-_nCNhAMmemEmsNAKU_9B3tuYTtqsqzNwFK1Ut1IjQ8bsVdqqHhpaW1NBSrDnFuE3S1S9n5m4l_e2IL-N_6jV"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-80 pointer-events-none">
        {layers.transmissionLines && (
          <>
            {visibleAssets.some(a => a.name === "Muppandal Wind Farm") && visibleAssets.some(a => a.name === "Delhi NCR Transmission Hub") && (
              <line x1="50%" y1="18%" x2="42%" y2="36%" stroke="#1e40af" strokeWidth="2.5" strokeDasharray="5" className="animate-pulse" />
            )}
            {visibleAssets.some(a => a.name === "Bhadla Solar Park") && visibleAssets.some(a => a.name === "Delhi NCR Transmission Hub") && (
              <line x1="26%" y1="28%" x2="42%" y2="36%" stroke="#d97706" strokeWidth="2.5" />
            )}
            {visibleAssets.some(a => a.name === "Delhi NCR Transmission Hub") && visibleAssets.some(a => a.name === "Kutch Renewable Energy Zone") && (
              <line x1="42%" y1="36%" x2="56%" y2="58%" stroke="#059669" strokeWidth="2" strokeDasharray="3" />
            )}
            {visibleAssets.some(a => a.name === "Delhi NCR Transmission Hub") && visibleAssets.some(a => a.name === "Mumbai West GIS") && (
              <line x1="42%" y1="36%" x2="64%" y2="54%" stroke="#ea580c" strokeWidth="2.5" />
            )}
            {visibleAssets.some(a => a.name === "Mumbai West GIS") && visibleAssets.some(a => a.name === "Pavagada Solar Park") && (
              <line x1="64%" y1="54%" x2="45%" y2="72%" stroke="#64748b" strokeWidth="1.5" />
            )}
            {visibleAssets.some(a => a.name === "Bhopal Central Grid Exchange") && visibleAssets.some(a => a.name === "Jabalpur Trunk Inter-tie Bus") && (
              <line x1="48%" y1="50%" x2="52%" y2="46%" stroke="#b81d24" strokeWidth="3" />
            )}
            {visibleAssets.some(a => a.name === "Bhubaneswar Coastal Grid Aggregator") && visibleAssets.some(a => a.name === "Ranchi Smart Terminal Corridor") && (
              <line x1="70%" y1="60%" x2="62%" y2="48%" stroke="#4f46e5" strokeWidth="2" />
            )}
          </>
        )}
      </svg>

      {/* Nodes elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {visibleAssets.map((item) => {
          const isSelected = selectedAsset === item.name;
          return (
            <div 
              key={item.id}
              onClick={() => { setSelectedAsset(item.name); setIsDetailOpen(true); }}
              style={{ top: item.top, left: item.left }}
              className={`absolute w-[26px] h-[26px] p-1 rounded-full border-2 border-white shadow-xl pointer-events-auto cursor-pointer flex items-center justify-center transition-all ${item.color} ${
                isSelected ? "ring-4 ring-offset-2 ring-indigo-600 scale-120 z-40" : "scale-100 z-20 hover:scale-115"
              }`}
              title={item.name}
            >
              <span className="material-symbols-outlined text-[13px] text-white font-bold select-none">{item.icon}</span>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white border border-slate-700 shadow-lg text-[9px] font-black px-2 py-0.5 rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 uppercase tracking-wide">
                {item.name} ({getScaledValText(item)})
              </span>
            </div>
          );
        })}
      </div>

      {/* Top-Left Layout & Layers Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-3.5 z-20 pointer-events-auto">
        {/* Layer Selector */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex flex-col gap-2 shadow-md min-w-[200px]">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded text-[#0F4C81] font-black text-[9px] uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">layers</span> Layer Vectors Control
          </div>
          <div className="space-y-1.5 select-none">
            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 transition-colors text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                <span className="material-symbols-outlined text-sky-600 text-[14px]">toys</span>
                <span className="font-semibold text-[10.5px]">Wind Farms</span>
              </div>
              <input 
                type="checkbox" 
                checked={layers.windFarms}
                onChange={(e) => setLayers({ ...layers, windFarms: e.target.checked })}
                className="rounded text-[#0F4C81] border-slate-300 w-3 h-3 cursor-pointer" 
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 transition-colors text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="material-symbols-outlined text-amber-500 text-[14px]">sunny</span>
                <span className="font-semibold text-[10.5px]">Solar Arrays</span>
              </div>
              <input 
                type="checkbox" 
                checked={layers.solarArrays}
                onChange={(e) => setLayers({ ...layers, solarArrays: e.target.checked })}
                className="rounded text-[#0F4C81] border-slate-300 w-3 h-3 cursor-pointer" 
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 transition-colors text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="material-symbols-outlined text-orange-500 text-[14px]">bolt</span>
                <span className="font-semibold text-[10.5px]">Transmission</span>
              </div>
              <input 
                type="checkbox" 
                checked={layers.transmissionLines}
                onChange={(e) => setLayers({ ...layers, transmissionLines: e.target.checked })}
                className="rounded text-[#0F4C81] border-slate-300 w-3 h-3 cursor-pointer" 
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 transition-colors text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="material-symbols-outlined text-emerald-600 text-[14px]">battery_charging_full</span>
                <span className="font-semibold text-[10.5px]">Energy Storage</span>
              </div>
              <input 
                type="checkbox" 
                checked={layers.energyStorage}
                onChange={(e) => setLayers({ ...layers, energyStorage: e.target.checked })}
                className="rounded text-[#0F4C81] border-slate-300 w-3 h-3 cursor-pointer" 
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 transition-colors text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 font-black animate-pulse"></span>
                <span className="material-symbols-outlined text-rose-600 text-[14px]">warning_amber</span>
                <span className="font-extrabold text-[10.5px] text-red-700">Grid Bottlenecks</span>
              </div>
              <input 
                type="checkbox" 
                checked={layers.renewableBottlenecks}
                onChange={(e) => setLayers({ ...layers, renewableBottlenecks: e.target.checked })}
                className="rounded text-red-600 border-slate-300 w-3 h-3 cursor-pointer" 
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-slate-50 transition-colors text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="material-symbols-outlined text-red-500 text-[14px]">home</span>
                <span className="font-semibold text-[10.5px]">Consumer Nodes</span>
              </div>
              <input 
                type="checkbox" 
                checked={layers.consumptionNodes}
                onChange={(e) => setLayers({ ...layers, consumptionNodes: e.target.checked })}
                className="rounded text-[#0F4C81] border-slate-300 w-3 h-3 cursor-pointer" 
              />
            </label>
          </div>
          {/* Map zoom utility with aria-labels */}
          <div className="flex gap-2 border-t border-slate-100 pt-2 select-none">
            <button 
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="flex-1 text-center bg-slate-50 text-xs py-1 hover:bg-slate-100 rounded font-black cursor-pointer text-slate-700"
              aria-label="Zoom in"
            >
              +
            </button>
            <button 
              onClick={() => setZoom(Math.max(70, zoom - 10))}
              className="flex-1 text-center bg-slate-50 text-xs py-1 hover:bg-slate-100 rounded font-black cursor-pointer text-slate-700"
              aria-label="Zoom out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Time Travel Engine Slider Overlay */}
      <div className="absolute bottom-24 left-6 right-6 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-lg p-4 shadow-xl max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-800">
              <span className="material-symbols-outlined text-[#0F4C81]">history_toggle_off</span>
              <span className="text-[11px] uppercase tracking-widest font-black text-slate-500">
                {twinMode === "REAL_INFRASTRUCTURE" ? "Strategy Timeline (Locked - Real Data)" : "Strategy Timeline (Planning Simulation)"}
              </span>
            </div>
            <div className={`font-mono text-3xl font-black ${twinMode === "REAL_INFRASTRUCTURE" ? "text-slate-400" : "text-[#0F4C81]"}`}>
              {year}
            </div>
          </div>
          
          <div className="relative w-full h-8 flex items-center">
            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
              <span className="text-[9px] text-[#64748B] font-bold mt-5">2025</span>
              <span className="text-[9px] text-[#64748B] font-bold mt-5">2030</span>
              <span className="text-[9px] text-[#64748B] font-bold mt-5">2035</span>
              <span className="text-[9px] text-[#64748B] font-bold mt-5">2040</span>
              <span className="text-[9px] text-[#64748B] font-bold mt-5">2045</span>
              <span className="text-[9px] text-[#64748B] font-bold mt-5">2050</span>
            </div>
            <input 
              type="range"
              disabled={twinMode === "REAL_INFRASTRUCTURE"}
              min={2025}
              max={2050}
              step={1}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0F4C81] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed" 
            />
          </div>
        </div>
      </div>

      {/* Bottom Left KPI Cards */}
      <div className="absolute bottom-4 left-4 flex gap-3 z-10 max-w-[calc(100%-12px)] overflow-x-auto pr-4">
        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] flex flex-col gap-1 w-36 shadow-md">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Grid Health</span>
          <div className="flex items-end justify-between leading-none mb-1">
            <span className="font-mono text-lg font-bold text-[#0F4C81]">{getDynamicHealth()}%</span>
            <span className="text-[9px] text-emerald-600 font-extrabold">+1.2%</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-[#0F4C81] h-full" style={{ width: `${getDynamicHealth()}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] flex flex-col gap-1 w-36 shadow-md">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Renewable Integration</span>
          <div className="flex items-end justify-between leading-none mb-1">
            <span className="font-mono text-lg font-bold text-[#0F4C81]">{getDynamicRenewable()}%</span>
            <span className="text-[9px] text-[#64748B] font-bold">Target 80%</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full" style={{ width: `${getDynamicRenewable()}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] flex flex-col gap-1 w-36 shadow-md">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Resilience status</span>
          <div className="flex items-end justify-between leading-none mb-1">
            <span className="font-mono text-xs font-bold text-emerald-600">
              {planningMode === "RURAL" ? "VOLATILE" : "REINFORCED"}
            </span>
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: "95%" }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

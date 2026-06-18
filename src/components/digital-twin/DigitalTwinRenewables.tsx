import React from "react";

interface DigitalTwinRenewablesProps {
  layers: {
    windFarms: boolean;
    solarArrays: boolean;
    transmissionLines: boolean;
    energyStorage: boolean;
    consumptionNodes: boolean;
    renewableBottlenecks: boolean;
  };
  solarMix: number;
  setSolarMix: React.Dispatch<React.SetStateAction<number>>;
  windMix: number;
  setWindMix: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAsset: React.Dispatch<React.SetStateAction<string>>;
  setIsDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modeData: any;
  getDynamicLocations: () => any[];
}

export const DigitalTwinRenewables: React.FC<DigitalTwinRenewablesProps> = ({
  layers,
  solarMix,
  setSolarMix,
  windMix,
  setWindMix,
  setSelectedAsset,
  setIsDetailOpen,
  modeData,
  getDynamicLocations,
}) => {
  return (
    <>
      {getDynamicLocations().filter((loc) => {
        if (loc.type === "Solar Farm" && !layers.solarArrays) return false;
        if (loc.type === "Battery Storage" && !layers.energyStorage) return false;
        if (loc.type === "Connection Point" && !layers.transmissionLines) return false;
        return true;
      }).map((loc) => {
        const isSolar = loc.type === "Solar Farm";
        const isBattery = loc.type === "Battery Storage";
        return (
          <div 
            key={loc.id}
            onClick={() => { setSelectedAsset(loc.name); setIsDetailOpen(true); }}
            className={`absolute ${loc.coordinates} w-6 h-6 rounded-full border-2 border-white shadow-xl pointer-events-auto cursor-pointer flex items-center justify-center transition-transform hover:scale-110 group ${
              isSolar 
                ? "bg-amber-500" 
                : isBattery 
                  ? "bg-emerald-500" 
                  : "bg-red-500"
            }`}
          >
            <span className="material-symbols-outlined text-[12px] text-white font-black">
              {isSolar ? "sunny" : isBattery ? "battery_charging_full" : "warning"}
            </span>
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-[#0F172A] border border-[#E2E8F0] shadow-sm text-[9.5px] font-black px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 font-sans">
              {loc.name} ({loc.value})
            </span>
          </div>
        );
      })}

      {/* Renewable Planning Vectors */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-80">
        {layers.transmissionLines && (
          <>
            {layers.solarArrays && <line x1="42%" y1="25%" x2="64%" y2="42%" stroke="#eab308" strokeWidth="2" strokeDasharray="4" />}
            {layers.energyStorage && <line x1="36%" y1="54%" x2="64%" y2="42%" stroke="#10b981" strokeWidth="3" />}
            <circle cx="64%" cy="42%" r="14" fill="none" stroke="#DC2626" strokeWidth="1.5" className="animate-pulse" />
          </>
        )}
      </svg>
    </>
  );
};

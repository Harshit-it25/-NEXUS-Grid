import React, { createContext, useContext, useState, ReactNode } from "react";

export type ScopeType = "National" | "Region" | "Horizon";
export type RegionType = "North" | "South" | "East" | "West" | "Central";
export type HorizonType = 2030 | 2040 | 2050;

export interface PlanningContextValue {
  scopeType: ScopeType;
  selectedRegion: RegionType;
  selectedHorizon: HorizonType;
  setScopeType: (scope: ScopeType) => void;
  setSelectedRegion: (region: RegionType) => void;
  setSelectedHorizon: (horizon: HorizonType) => void;
  
  // Derived analytical context
  renewableTarget: number;
  budgetCr: number;
  storageGwh: number;
  demandForecastMw: number;
  climateRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  activeScenarioName: string;
}

const PlanningScopeContext = createContext<PlanningContextValue | undefined>(undefined);

export const usePlanningScope = () => {
  const context = useContext(PlanningScopeContext);
  if (!context) {
    throw new Error("usePlanningScope must be used within a PlanningScopeProvider");
  }
  return context;
};

interface PlanningScopeProviderProps {
  children: ReactNode;
}

export const PlanningScopeProvider: React.FC<PlanningScopeProviderProps> = ({ children }) => {
  const [scopeType, setScopeType] = useState<ScopeType>("National");
  const [selectedRegion, setSelectedRegion] = useState<RegionType>("West");
  const [selectedHorizon, setSelectedHorizon] = useState<HorizonType>(2040);

  // Dynamic calculations based on active scope
  let renewableTarget = 70;
  let budgetCr = 8000;
  let storageGwh = 9;
  let demandForecastMw = 48000;
  let climateRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "HIGH";
  let activeScenarioName = "India 2040 Renewable Transition";

  if (scopeType === "Horizon") {
    if (selectedHorizon === 2030) {
      renewableTarget = 55;
      storageGwh = 4;
      budgetCr = 2000;
      demandForecastMw = 35000;
      climateRiskLevel = "MEDIUM";
      activeScenarioName = "India 2030 Fast Sourcing Push";
    } else if (selectedHorizon === 2040) {
      renewableTarget = 70;
      storageGwh = 9;
      budgetCr = 8000;
      demandForecastMw = 48000;
      climateRiskLevel = "HIGH";
      activeScenarioName = "India 2040 Renewable Transition";
    } else {
      // 2050
      renewableTarget = 85;
      storageGwh = 16;
      budgetCr = 15000;
      demandForecastMw = 65000;
      climateRiskLevel = "CRITICAL";
      activeScenarioName = "India 2050 Zero-Carbon Grid";
    }
  } else if (scopeType === "Region") {
    // Region specific adjustments
    activeScenarioName = `${selectedRegion} Region Decentralized Plan`;
    if (selectedRegion === "West") {
      renewableTarget = 75;
      budgetCr = 2800;
      storageGwh = 5.2;
      demandForecastMw = 14500;
      climateRiskLevel = "HIGH"; // Solar thermal peak loading
    } else if (selectedRegion === "North") {
      renewableTarget = 62;
      budgetCr = 2400;
      storageGwh = 3.8;
      demandForecastMw = 16200;
      climateRiskLevel = "CRITICAL"; // Heavy weather surges loading
    } else if (selectedRegion === "South") {
      renewableTarget = 68;
      budgetCr = 2200;
      storageGwh = 4.5;
      demandForecastMw = 11800;
      climateRiskLevel = "MEDIUM";
    } else if (selectedRegion === "East") {
      renewableTarget = 45;
      budgetCr = 1800;
      storageGwh = 2.1;
      demandForecastMw = 9500;
      climateRiskLevel = "HIGH"; // Cyclone & flooding risks
    } else {
      // Central
      renewableTarget = 50;
      budgetCr = 1500;
      storageGwh = 2.5;
      demandForecastMw = 8000;
      climateRiskLevel = "LOW";
    }
  }

  return (
    <PlanningScopeContext.Provider
      value={{
        scopeType,
        selectedRegion,
        selectedHorizon,
        setScopeType,
        setSelectedRegion,
        setSelectedHorizon,
        renewableTarget,
        budgetCr,
        storageGwh,
        demandForecastMw,
        climateRiskLevel,
        activeScenarioName,
      }}
    >
      {children}
    </PlanningScopeContext.Provider>
  );
};

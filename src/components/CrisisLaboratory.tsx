import React, { useState } from "react";
import { usePlanningScope } from "../PlanningScopeContext";

interface CrisisScenario {
  id: string;
  name: string;
  type: "HEATWAVE" | "CYCLONE" | "FLOOD" | "WILDFIRE" | "DEMAND_SHOCK";
  affectedPop: string;
  ecoLoss: string;
  recoveryTime: string;
  strategy: string;
  mitigations: string[];
  backdropText: string;
  afterPop: string;
  afterEcoLoss: string;
  afterRecoveryTime: string;
  savedPopPct: string;
  savedEcoPct: string;
  savedRecoveryPct: string;
}

const getDynamicScenarios = (
  scopeType: "National" | "Region" | "Horizon",
  selectedRegion: "North" | "South" | "East" | "West" | "Central",
  selectedHorizon: 2030 | 2040 | 2050
): CrisisScenario[] => {
  const base = [
    {
      id: "cs-1",
      name: "Extreme Heatwave S-44",
      type: "HEATWAVE" as const,
      affectedPopBase: 1420000,
      ecoLossBase: 120,
      recoveryTimeHours: 2.4,
      strategy: "Dynamic Voltage Scale down (Conservation Voltage Reduction) and rolling industrial curtailment loops.",
      mitigations: [
        "Retrodeploy 132kV phase-compensator nodes.",
        "Implement dynamic air-core ventilation cooling rigs.",
        "Enforce grid-edge AMI smart-meter throttle parameters."
      ],
      backdropText: "Thermal overload active on S-14 transformer circuits.",
      afterPopBase: 185000,
      afterEcoLossBase: 15,
      afterRecoveryTimeHours: 0.3,
      savedPopPct: "87% Saved",
      savedEcoPct: "88% Reduction",
      savedRecoveryPct: "88% Faster"
    },
    {
      id: "cs-2",
      name: "Coastal Cyclone Zephyr",
      type: "CYCLONE" as const,
      affectedPopBase: 845000,
      ecoLossBase: 480,
      recoveryTimeHours: 16.8,
      strategy: "Automatic segment islanding of coastal lines and fast dispatch of hydro-recovery reserves.",
      mitigations: [
        "Retrofit transmission poles with modular stay-wire stabilizers.",
        "Incorporate secondary underground gas-insulated lines.",
        "Upgrade digital substations to support autonomous black-start."
      ],
      backdropText: "Wind speeds past 140km/h trigger radial breaker isolations.",
      afterPopBase: 92000,
      afterEcoLossBase: 42,
      afterRecoveryTimeHours: 1.5,
      savedPopPct: "89% Saved",
      savedEcoPct: "91% Reduction",
      savedRecoveryPct: "91% Faster"
    },
    {
      id: "cs-3",
      name: "Estuary Flash Flooding",
      type: "FLOOD" as const,
      affectedPopBase: 350050,
      ecoLossBase: 240,
      recoveryTimeHours: 9.5,
      strategy: "De-energization of engulfed distribution nodes and load routing through parallel dry upland loops.",
      mitigations: [
        "Elevate high-voltage switchgear levels past 2.0m flood stage.",
        "Instate telemetry water-ingress alarm detectors.",
        "Install physical concrete drainage routing systems."
      ],
      backdropText: "Substation Metro-S2 submerged. Diverting flow.",
      afterPopBase: 45000,
      afterEcoLossBase: 21,
      afterRecoveryTimeHours: 0.75,
      savedPopPct: "87% Saved",
      savedEcoPct: "91% Reduction",
      savedRecoveryPct: "92% Faster"
    },
    {
      id: "cs-4",
      name: "Forested Wildfire Threat",
      type: "WILDFIRE" as const,
      affectedPopBase: 125000,
      ecoLossBase: 180,
      recoveryTimeHours: 4.8,
      strategy: "Sectionalizing radial feeder branch-8 and backup microgrid activation in Green Valley communities.",
      mitigations: [
        "Establish automated high-speed sectionalizer reclosers.",
        "Drone-mapped continuous vegetation clearing schedules.",
        "Install steel-alloy fireproof pole encasements."
      ],
      backdropText: "Line 8 crossing forest fire corridor offline. Battery loop active.",
      afterPopBase: 12050,
      afterEcoLossBase: 12,
      afterRecoveryTimeHours: 0.4,
      savedPopPct: "90% Saved",
      savedEcoPct: "93% Reduction",
      savedRecoveryPct: "91% Faster"
    },
    {
      id: "cs-5",
      name: "Metropolis Demand Shock",
      type: "DEMAND_SHOCK" as const,
      affectedPopBase: 680000,
      ecoLossBase: 85,
      recoveryTimeHours: 1.2,
      strategy: "Aggregate Vehicle-to-Grid (V2G) battery dispatching and temporary industrial demand caps.",
      mitigations: [
        "Extend commercial transit fast-charging pricing multipliers.",
        "Deploy localized multi-container battery buffer suites.",
        "Contract ancillary demand response frequency reserve."
      ],
      backdropText: "Metropolitan coincidence peak load exceeds 122% capacity.",
      afterPopBase: 38000,
      afterEcoLossBase: 9,
      afterRecoveryTimeHours: 0.133,
      savedPopPct: "94% Saved",
      savedEcoPct: "89% Reduction",
      savedRecoveryPct: "88% Faster"
    }
  ];

  return base.map(item => {
    let name = item.name;
    let affectedPopVal = item.affectedPopBase;
    let ecoLossVal = item.ecoLossBase;
    let recoveryTimeVal = item.recoveryTimeHours;
    let afterPopVal = item.afterPopBase;
    let afterEcoLossVal = item.afterEcoLossBase;
    let afterRecoveryTimeVal = item.afterRecoveryTimeHours;

    if (scopeType === "Region") {
      name = `${selectedRegion} Region ${item.name.replace("Extreme ", "").replace("Coastal ", "").replace("Estuary ", "").replace("Forested ", "").replace("Metropolis ", "")}`;
      let popScale = 0.3;
      let ecoScale = 0.25;
      let recScale = 0.8;
      
      if (selectedRegion === "North") {
        popScale = 0.45; ecoScale = 0.35; recScale = 0.9;
      } else if (selectedRegion === "West") {
        popScale = 0.4; ecoScale = 0.3; recScale = 0.85;
      } else if (selectedRegion === "South") {
        popScale = 0.35; ecoScale = 0.28; recScale = 0.8;
      } else if (selectedRegion === "East") {
        popScale = 0.3; ecoScale = 0.25; recScale = 0.75;
      } else {
        popScale = 0.2; ecoScale = 0.18; recScale = 0.7;
      }
      
      affectedPopVal = Math.round(item.affectedPopBase * popScale);
      ecoLossVal = Math.round(item.ecoLossBase * ecoScale);
      recoveryTimeVal = Number((item.recoveryTimeHours * recScale).toFixed(1));
      
      afterPopVal = Math.round(item.afterPopBase * popScale);
      afterEcoLossVal = Math.round(item.afterEcoLossBase * ecoScale);
      afterRecoveryTimeVal = Number((item.afterRecoveryTimeHours * recScale).toFixed(2));
    } else if (scopeType === "Horizon") {
      name = `${selectedHorizon} ${item.name}`;
      let multiplier = 1.0;
      if (selectedHorizon === 2030) {
        multiplier = 1.15;
      } else if (selectedHorizon === 2040) {
        multiplier = 1.45;
      } else {
        multiplier = 1.85;
      }
      
      affectedPopVal = Math.round(item.affectedPopBase * multiplier);
      ecoLossVal = Math.round(item.ecoLossBase * (multiplier * 1.2));
      recoveryTimeVal = Number((item.recoveryTimeHours * multiplier).toFixed(1));
      
      afterPopVal = Math.round(item.afterPopBase * multiplier);
      afterEcoLossVal = Math.round(item.afterEcoLossBase * (multiplier * 1.2));
      afterRecoveryTimeVal = Number((item.afterRecoveryTimeHours * multiplier).toFixed(2));
    }

    const affectedPopStr = `${affectedPopVal.toLocaleString()} customers`;
    const ecoLossStr = `₹${ecoLossVal} Cr estimated`;
    
    const formatTime = (hours: number) => {
      if (hours < 1) {
        return `${Math.round(hours * 60)} Minutes`;
      }
      return `${hours} Hours`;
    };

    const recoveryTimeStr = formatTime(recoveryTimeVal);
    const afterPopStr = `${afterPopVal.toLocaleString()} customers`;
    const afterEcoLossStr = `₹${afterEcoLossVal} Cr`;
    const afterRecoveryTimeStr = formatTime(afterRecoveryTimeVal);

    return {
      ...item,
      name,
      affectedPop: affectedPopStr,
      ecoLoss: ecoLossStr,
      recoveryTime: recoveryTimeStr,
      afterPop: afterPopStr,
      afterEcoLoss: afterEcoLossStr,
      afterRecoveryTime: afterRecoveryTimeStr
    };
  });
};

export const CrisisLaboratory: React.FC = () => {
  const { scopeType, selectedRegion, selectedHorizon } = usePlanningScope();
  const scenariosList = getDynamicScenarios(scopeType, selectedRegion, selectedHorizon);
  const [activeScenarioId, setActiveScenarioId] = useState<string>("cs-1");
  const activeScenario = scenariosList.find(s => s.id === activeScenarioId) || scenariosList[0];

  const [isDecoupling, setIsDecoupling] = useState<boolean>(false);
  const [decouplingProgress, setDecouplingProgress] = useState<number>(0);
  const [decoupled, setDecoupled] = useState<boolean>(false);

  const handleTriggerDecoupling = () => {
    setIsDecoupling(true);
    setDecouplingProgress(0);
    const interval = setInterval(() => {
      setDecouplingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDecoupling(false);
          setDecoupled(true);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleReset = () => {
    setDecoupled(false);
    setDecouplingProgress(0);
  };

  // Dynamic values for Planning Horizon Intelligence card
  let advisoryBadge = "NATIONAL CONTEXT";
  let shockAdvisoryText = "Composite national metrics project multi-regional climate stress events occurring simultaneously across 3 or more load centers.";
  let actionMatrixText = "Harden critical national green corridors and establish cross-regional power sharing treaties backed by automated recovery systems.";

  if (scopeType === "Horizon") {
    advisoryBadge = `HORIZON ${selectedHorizon}`;
    if (selectedHorizon === 2030) {
      shockAdvisoryText = "CMIP6 models predict a 12% rise in storm-driven transient substation surges by Year 2030, straining legacy reclosers.";
      actionMatrixText = "Deploy Phase I digital telemetry meshes and smart sectionalizers at tier-1 urban boundaries to isolate localized faults.";
    } else if (selectedHorizon === 2040) {
      shockAdvisoryText = "CMIP6 climate forecasts suggest peak summer temperatures will expand baseline load strain events on S-14 corridors by 24% by Year 2040.";
      actionMatrixText = "Harden radial connection hubs with smart solid-state insulation reclosers to systematically isolate surges and avoid secondary cascaded trips.";
    } else {
      shockAdvisoryText = "Extreme climate projections for Year 2050 warn of 45% greater probability of concurrent marine cyclones and inland heat waves, threatening total grid collapse.";
      actionMatrixText = "Transition base station hubs to support autonomous black-start sequences via localized green hydrogen turbine arrays.";
    }
  } else if (scopeType === "Region") {
    advisoryBadge = `REGION ${selectedRegion.toUpperCase()}`;
    if (selectedRegion === "West") {
      shockAdvisoryText = "Desert ambient heat and solar thermal overloading could trigger major PV infeed curtailments on Western loops.";
      actionMatrixText = "Install high-reactance capacitor sets at Kutch Desert collector substations and coordinate dispatch with BESS buffers.";
    } else if (selectedRegion === "North") {
      shockAdvisoryText = "Plains heatwaves coupled with heavy metropolitan summer surges strain North-West transmission gateways.";
      actionMatrixText = "Upgrade transformer cooling loops and integrate Tehri hydro peaking reserve to cover generation deficits.";
    } else if (selectedRegion === "South") {
      shockAdvisoryText = "Marine air corrosion and coastal cyclone landfalls threaten southern coastal switchgear insulation.";
      actionMatrixText = "Elevate substation foundation pads past 2.0m flood heights and apply high-spec epoxy anti-corrosive treatments.";
    } else if (selectedRegion === "East") {
      shockAdvisoryText = "Severe river basin flooding and forest wildfire corridors endanger East region radial lines.";
      actionMatrixText = "Construct concrete bypass channels around vulnerable nodes and deploy mobile emergency microgrid generators.";
    } else {
      shockAdvisoryText = "Cross-national loop surges and inter-regional transmission lines face bottleneck loading under regional imbalances.";
      actionMatrixText = "Activate smart high-voltage sectionalizing breakers at central hubs like Bhopal and Nagpur exchanges.";
    }
  }

  return (
    <div className="flex-1 overflow-hidden h-[calc(100vh-3.5rem)] flex bg-[#F8FAFC] text-[#0F172A] select-text border-t border-[#E2E8F0]">
      
      {/* 1. Tactical Interactive Map Viewport (Left panel) */}
      <div className="flex-1 relative bg-slate-100 overflow-hidden border-r border-[#E2E8F0]">
        
        {/* Grayscale red/blue crisis backdrop mapping */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
          <img 
            alt="Crisis tactical monitoring blueprint" 
            className="w-full h-full object-cover grayscale" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFA_jX64hiBKi8CuyNmcM-tKSSttLvHNtpxVeo3UC2OL1bb8q7NTC1Gfx9okp4xqd1yq5EYr5vI4jF2b0rlvG7ytOYTfVwd5FzXoDhlEgkNCXrDVsUPGnq5kbUSvr4jEbQxM_qTqS6nHMl724OxdMpSf5irz8KxyCKNE5AUgGzdKLW3YbgW85Hx69-_nCNhAMmemEmsNAKU_9B3tuYTtqsqzNwFK1Ut1IjQ8bsVdqqHhpaW1NBSrDnFuE3S1S9n5m4l_e2IL-N_6jV"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Hazard Graphic Shaders Overlay depending on Scenario type */}
        <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300">
          {activeScenario.type === "HEATWAVE" && (
            <div className="absolute inset-0 bg-red-100/30 mix-blend-color-burn">
              <div className="absolute top-[35%] left-[54%] w-44 h-44 rounded-full bg-red-500/10 filter blur-3xl animate-pulse"></div>
            </div>
          )}
          {activeScenario.type === "FLOOD" && (
            <div className="absolute inset-0 bg-blue-100/30 mix-blend-multiply">
              <div className="absolute bottom-[30%] left-[30%] w-60 h-32 rounded-full bg-cyan-500/10 filter blur-2xl animate-pulse"></div>
            </div>
          )}
          {activeScenario.type === "WILDFIRE" && (
            <div className="absolute inset-0">
              <div className="absolute top-[55%] left-[25%] w-48 h-48 rounded-full bg-orange-500/15 filter blur-3xl animate-ping"></div>
              <div className="absolute top-[55%] left-[25%] w-24 h-24 rounded-full bg-red-500/20 filter blur-xl animate-pulse"></div>
            </div>
          )}
          {activeScenario.type === "CYCLONE" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-96 h-96 opacity-40 animate-spin" style={{ animationDuration: "14s" }}>
                <circle cx="50%" cy="50%" r="90" stroke="#0F4C81" strokeWidth="3" strokeDasharray="14" fill="none" />
                <circle cx="50%" cy="50%" r="140" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="8" fill="none" />
              </svg>
            </div>
          )}
          {activeScenario.type === "DEMAND_SHOCK" && (
            <div className="absolute inset-0 bg-amber-50/20 mix-blend-color-burn">
              <div className="absolute top-[40%] right-[30%] w-52 h-52 rounded-full bg-amber-500/10 filter blur-2xl animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Dynamic Vector Lines and Substations flashing - Showing Failure & Re-routing! */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* Target constraint point / fault hub */}
          <div className="absolute top-[36%] left-[45%] w-7 h-7 bg-red-500 border-2 border-white rounded-full animate-ping pointer-events-auto"></div>
          <div 
            className="absolute top-[36%] left-[45%] w-7 h-7 bg-red-600 border-2 border-white rounded-full flex items-center justify-center pointer-events-auto cursor-pointer shadow-md"
            title="Active Failure Node S-14"
          >
            <span className="material-symbols-outlined text-white text-[14px] font-black">gpp_maybe</span>
          </div>

          {/* Backup deployment hub */}
          <div className="absolute bottom-[40%] left-[35%] w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center pointer-events-auto shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </div>

          <svg className="absolute inset-0 w-full h-full">
            {/* Failure propagation line */}
            <line x1="45%" y1="36%" x2="52%" y2="20%" stroke="#DC2626" strokeWidth="3" strokeDasharray="3" className="animate-pulse" />
            <line x1="45%" y1="36%" x2="30%" y2="44%" stroke="#DC2626" strokeWidth="3" />

            {/* Power Re-routing Path */}
            {decoupled && (
              <path 
                d="M 35,60 Q 40,48 55,36" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="4" 
                strokeDasharray="6" 
                style={{
                  strokeDashoffset: -20,
                  animation: "dash 1.5s linear infinite"
                }}
              />
            )}
          </svg>
        </div>

        {/* Threat Level alert Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg shadow-md flex items-center gap-2.5 max-w-sm">
            <span className="material-symbols-outlined text-2xl text-red-600 animate-pulse">security</span>
            <div>
              <span className="text-[8.5px] uppercase font-bold tracking-widest text-red-700 block font-mono">TACTICAL THREAT CORRIDOR</span>
              <p className="text-sm font-black text-red-950">{activeScenario.name}</p>
            </div>
          </div>
        </div>

        {/* Re-routed Notification badge */}
        {decoupled && (
          <div className="absolute bottom-24 left-6 right-6 z-20">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg shadow-xl max-w-md mx-auto flex gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-3xl">verified_user</span>
              <div>
                <span className="text-xs font-black text-emerald-950 block uppercase tracking-wide">ISOLATION AND ROAD SHIFT COMPLETED</span>
                <p className="text-[11px] text-emerald-800 leading-normal mt-0.5 font-medium">
                  Dynamic islanding completed. Voltage levels stabilized. Regional backup flow routes established via dry parallel corridors.
                </p>
                <button 
                  onClick={handleReset}
                  className="mt-2 text-[10px] text-emerald-950 font-black hover:underline uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">restart_alt</span> RESET COMMAND Blueprints
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Decoupling loading overlay */}
        {isDecoupling && (
          <div className="absolute inset-0 z-45 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-[#0F172A]">
            <span className="material-symbols-outlined text-red-600 text-6xl animate-pulse">crisis_alt</span>
            <h3 className="text-xl font-black text-[#0F172A] uppercase mt-4 tracking-widest">TACTICAL COMMAND OVERRIDE</h3>
            <div className="w-64 bg-slate-100 h-2 rounded-full mt-3 overflow-hidden border border-slate-200">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${decouplingProgress}%` }}></div>
            </div>
            <p className="font-mono text-[9px] text-[#64748B] mt-1.5 uppercase">CONFIGURING POWER ISOLATION RELAYS segment S-14A...</p>
          </div>
        )}

        {/* Map visual legend footer */}
        <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-sm">
            <span className="text-[8.5px] text-slate-400 uppercase tracking-widest font-black block">Affected Population</span>
            <span className="font-mono font-black text-sm block mt-1 text-[#0F172A]">{activeScenario.affectedPop}</span>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-sm">
            <span className="text-[8.5px] text-slate-400 uppercase tracking-widest font-black block">Projected Eco Loss</span>
            <span className="font-mono font-black text-red-600 text-sm block mt-1">{activeScenario.ecoLoss}</span>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-sm">
            <span className="text-[8.5px] text-slate-400 uppercase tracking-widest font-black block">Estimated Recovery</span>
            <span className="font-mono font-black text-amber-600 text-sm block mt-1">{decoupled ? "0.0h (SECURED)" : activeScenario.recoveryTime}</span>
          </div>
        </div>

      </div>

      {/* 2. Right Actions Sidebar (Control cockpit) */}
      <aside className="w-[360px] bg-white flex flex-col z-20 justify-between shadow-xs">
        
        {/* Cockpit Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-black uppercase text-[#0F172A] tracking-wider">Crisis command deck</h3>
            <p className="text-[9px] text-slate-500 font-mono leading-none mt-1">ISOLATION LOGIC V8.1</p>
          </div>
          <span className="px-2 py-0.5 bg-red-600 text-white text-[9.5px] font-black rounded tracking-wide">
            CRITICAL
          </span>
        </div>

        {/* Scenario Selectors and detailed action cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
          
          {/* Weather Scenarios Horizontal Cards Selection */}
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1 mb-2">
              SELECT WEATHER HAZARD
            </span>
            <div className="grid grid-cols-2 gap-2">
              {scenariosList.map((s) => {
                const isActive = s.id === activeScenario.id;
                return (
                  <button 
                    key={s.id}
                    onClick={() => { setActiveScenarioId(s.id); setDecoupled(false); }}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isActive 
                        ? "bg-red-50 border-red-500 text-red-950 rounded-lg" 
                        : "bg-white border-slate-200 text-[#475569] hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[10.5px] font-black leading-none block">{s.name.split(":")[0]}</span>
                    <span className="text-[9px] font-mono opacity-80 block mt-1 text-slate-500">{s.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active threat intelligence details block */}
          <div className="p-4 bg-slate-50 rounded-lg border border-[#E2E8F0] space-y-3 select-text shadow-xs">
            <div>
              <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">ACTIVE THREAT INTELLIGENCE</span>
              <p className="text-xs font-extrabold text-[#0F172A] mt-1">"{activeScenario.backdropText}"</p>
            </div>

            {/* Strategy Box */}
            <div className="pt-2.5 border-t border-slate-200">
              <span className="text-[8.5px] font-bold text-[#0F4C81] uppercase tracking-widest block font-mono">GRID RECOVERY PLAN</span>
              <p className="text-[11px] text-[#475569] mt-1.5 leading-relaxed font-semibold">
                {activeScenario.strategy}
              </p>
            </div>
          </div>

          {/* BEFORE VS AFTER NEXUS GRID COMPARISON PANEL */}
          <div className="p-4 bg-white text-slate-800 rounded-lg border border-slate-200 space-y-4 select-text shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-[#0F4C81] tracking-widest font-mono uppercase">BUSINESS VALUE RESTORATION</span>
                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                  DECISION METRICS
                </span>
              </div>
              <h4 className="text-xs font-black uppercase tracking-wide mt-1 text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-base font-bold">balance</span>
                Business Value Comparison
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* Without NEXUS Grid VS With NEXUS Grid Comparison Table structure */}
              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 pb-3">
                <div className="bg-red-50 p-2.5 rounded border border-red-200">
                  <span className="text-[9.5px] font-black text-red-700 uppercase tracking-wider block font-mono">Without NEXUS Grid</span>
                  <div className="mt-1.5 space-y-1.5 text-[11px] text-slate-600">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block leading-none font-bold">Affected Population</span>
                      <span className="font-bold text-red-900 block">{activeScenario.affectedPop}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block leading-none font-bold">Recovery Time</span>
                      <span className="font-bold text-red-900 block">{activeScenario.recoveryTime}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block leading-none font-bold">Economic Loss</span>
                      <span className="font-bold text-red-900 block">{activeScenario.ecoLoss}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  <span className="text-[9.5px] font-black text-emerald-800 uppercase tracking-wider block font-mono">With NEXUS Grid</span>
                  <div className="mt-1.5 space-y-1.5 text-[11px] text-slate-700 font-medium">
                    <div>
                      <span className="text-[9px] font-mono text-emerald-600 block uppercase leading-none font-bold">Affected Population</span>
                      <span className="font-extrabold text-emerald-950 block">{activeScenario.afterPop}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-emerald-600 block uppercase leading-none font-bold">Recovery Time</span>
                      <span className="font-extrabold text-emerald-950 block">{activeScenario.afterRecoveryTime}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-emerald-600 block uppercase leading-none font-bold">Economic Loss</span>
                      <span className="font-extrabold text-emerald-950 block">{activeScenario.afterEcoLoss}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HIGHLIGHT DECT DETAILED BENEFITS */}
              <div className="space-y-2 pt-1">
                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest block font-mono font-black">CRITICAL OUTCOME HIGHLIGHTS</span>
                
                <div className="flex items-center justify-between p-2 bg-emerald-50/50 border border-emerald-100 rounded">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base font-bold">nest_protect</span>
                    <span className="text-[11px] font-black text-slate-700 uppercase">Lives Protected</span>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-700">{activeScenario.savedPopPct}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-emerald-50/50 border border-emerald-100 rounded">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base font-bold">savings</span>
                    <span className="text-[11px] font-black text-slate-700 uppercase">Economic Loss Avoided</span>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-700">{activeScenario.savedEcoPct}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-emerald-50/50 border border-emerald-100 rounded">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base font-bold">speed</span>
                    <span className="text-[11px] font-black text-slate-700 uppercase">Recovery Acceleration</span>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-700">{activeScenario.savedRecoveryPct.replace("font-bold", "").trim()}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Detailed Mitigation recommendations checklist */}
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1 mb-2.5">
              PREV. MITIGATION CHECKBOOK
            </span>
            <div className="space-y-2">
              {activeScenario.mitigations.map((m, idx) => (
                <div key={idx} className="p-3 bg-white rounded border border-[#E2E8F0] flex gap-2.5 items-start text-xs select-text shadow-xs">
                  <span className="material-symbols-outlined text-amber-500 font-bold text-sm">verified</span>
                  <div>
                    <span className="font-extrabold text-[#0F172A] block">Recommendation {idx + 1}</span>
                    <p className="text-[10.5px] text-[#475569] leading-relaxed mt-0.5 font-medium">{m}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planning Horizon Intelligence & Resilience Advisory Card */}
          <div className="bg-[#eff4ff] border border-blue-100 p-4 rounded-lg shadow-xs space-y-3 select-text text-slate-800">
            <div className="flex justify-between items-center pb-2 border-b border-blue-200">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-[#0F4C81]">analytics</span>
                <span className="text-[9px] font-black tracking-widest text-[#0F4C81] uppercase">
                  PLANNING HORIZON INTELLIGENCE
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-white text-[#0F4C81] border border-blue-100">
                {advisoryBadge}
              </span>
            </div>

            <div className="space-y-2.5 text-[10.5px] leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 animate-pulse"></span>
                <p className="text-slate-600">
                  <span className="font-bold text-[#0F172A] uppercase block text-[9.5px]">Shock Probability Advisory</span>
                  {shockAdvisoryText}
                </p>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-600">
                  <span className="font-bold text-[#0F172A] uppercase block text-[9.5px]">Resilience Action Matrix</span>
                  {actionMatrixText}
                </p>
              </div>
            </div>
          </div>
          </div>
        {/* Override trigger footer */}
        <div className="p-4 bg-white border-t border-[#E2E8F0] sticky bottom-0">
          <button 
            disabled={isDecoupling || decoupled}
            onClick={handleTriggerDecoupling}
            className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold py-3 rounded text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[17px]">warning</span>
            <span>ENGAGE TACTICAL GRID ISOLATION</span>
          </button>
        </div>

      </aside>

    </div>
  );
};

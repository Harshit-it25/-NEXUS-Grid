import React, { useState } from "react";
import { usePlanningScope } from "../PlanningScopeContext";
import { DigitalTwinAtlas } from "./digital-twin/DigitalTwinAtlas";
import { DigitalTwinRenewables } from "./digital-twin/DigitalTwinRenewables";

interface DigitalTwinProps {
  planningMode: "NATIONAL" | "MUNICIPAL" | "RURAL";
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ planningMode }) => {
  const { scopeType, selectedRegion, selectedHorizon } = usePlanningScope();

  // Map zoom level
  const [zoom, setZoom] = useState<number>(100);
  // Checked layers
  const [layers, setLayers] = useState({
    windFarms: true,
    solarArrays: true,
    transmissionLines: true,
    energyStorage: true,
    consumptionNodes: true,
    renewableBottlenecks: true,
  });

  // Time Travel Engine selected year
  const [year, setYear] = useState<number>(2025);

  // Sync local year travel to selectedHorizon
  React.useEffect(() => {
    if (scopeType === "Horizon") {
      setYear(selectedHorizon);
    }
  }, [scopeType, selectedHorizon]);

  // Sub tab inside Digital Twin Workspace
  const [subTab, setSubTab] = useState<"ATLAS" | "RENEWABLES">("ATLAS");

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(true);

  // Renewable integration sliders state
  const [solarMix, setSolarMix] = useState<number>(28);
  const [windMix, setWindMix] = useState<number>(44);

  // Selected asset state for interactive exploration
  const [selectedAsset, setSelectedAsset] = useState<string>("Muppandal Wind Farm");
  const [twinMode, setTwinMode] = useState<"REAL_INFRASTRUCTURE" | "PLANNING_SIMULATION">("REAL_INFRASTRUCTURE");

  const handleModeChange = (mode: "REAL_INFRASTRUCTURE" | "PLANNING_SIMULATION") => {
    setTwinMode(mode);
    if (mode === "REAL_INFRASTRUCTURE") {
      setYear(2025);
    }
  };

  const getSelectedAssetSpecs = () => {
    const getCapacityText = (base: number, unit = "MW") => {
      if (scopeType === "Horizon") {
        let multiplier = 1.0;
        if (selectedHorizon === 2030) multiplier = 1.15;
        else if (selectedHorizon === 2040) multiplier = 1.60;
        else if (selectedHorizon === 2050) multiplier = 2.45;
        return `${Math.round(base * multiplier).toLocaleString()} ${unit} (Projected Target)`;
      }
      return `${base.toLocaleString()} ${unit}`;
    };

    switch (selectedAsset) {
      case "Bhadla Solar Park":
        return {
          type: "Solar Photovoltaic Park",
          capacity: getCapacityText(2245, "MW"),
          utilization: "24.5% (observed solar CUF)",
          risk: scopeType === "Horizon" && selectedHorizon === 2050 ? "NOMINAL" : "INTERMITTENT",
          desc: "Located in Jodhpur District, Rajasthan, this is one of the largest solar parks in the world. High-density solar tracking grids require advanced reactive power support.",
          image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
          source: "Ministry of New and Renewable Energy (MNRE)",
          lastUpdated: `Q1 ${scopeType === "Horizon" ? selectedHorizon : "2025"} Core Registry`,
          confidence: "High [DQY: 98.7%]",
          org: "Central Electricity Authority"
        };
      case "Pavagada Solar Park":
        return {
          type: "Solar PV Generation",
          capacity: getCapacityText(2050, "MW"),
          utilization: "23.8% (typical annual CUF)",
          risk: "NOMINAL",
          desc: "Spans across Pavagada, Karnataka. Connects clean solar electricity directly into the Southern regional grid via Bangalore Whitefield lines.",
          image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80",
          source: "Karnataka Renewable Energy Development Ltd (KREDL)",
          lastUpdated: `Report ${scopeType === "Horizon" ? selectedHorizon : "2025"}-A`,
          confidence: "High [DQY: 98.2%]",
          org: "CEA Planning Division"
        };
      case "Kutch Renewable Energy Zone":
        return {
          type: "Solar-Wind Hybrid RE Zone",
          capacity: getCapacityText(1500, "MW Phase 1"),
          utilization: "31.2% combined average",
          risk: "CONGESTED",
          desc: "Massive barren land development in Khavda, Kutch, Gujarat. Combines solar tracking arrays and onshore coastal wind. Prone to peak dispatch bottlenecks.",
          image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
          source: "India Public Transmission Expansion Reports",
          lastUpdated: "January 2025",
          confidence: "High [DQY: 96.5%]",
          org: "STU Gujarat / POSOCO"
        };
      case "Muppandal Wind Farm":
        return {
          type: "Onshore Wind Generation",
          capacity: getCapacityText(1500, "MW"),
          utilization: "28.5% (seasonal peak CUF)",
          risk: "STABLE",
          desc: "Located in Kanyakumari, Tamil Nadu, exploiting mountain pass pressure differentials. Feeds heavy industrial clusters in the southern peninsula.",
          image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80",
          source: "Tamil Nadu Energy Development Agency (TEDA)",
          lastUpdated: "2025 CEA Wind Database",
          confidence: "High [DQY: 97.4%]",
          org: "MNRE Onshore Database"
        };
      case "Tehri Hydro Plant":
        return {
          type: "Pumped-Storage Hydro Facility",
          capacity: getCapacityText(1000, "MW Peaking"),
          utilization: "45.0% dispatch availability",
          risk: "NOMINAL",
          desc: "High-head hydropower facility in Uttarakhand. Highly responsive peaking power to regulate thermal sags and EV charging spikes across Delhi NCR Grid.",
          image: "https://images.unsplash.com/photo-1460518451285-cd3ab4204666?auto=format&fit=crop&w=600&q=80",
          source: "National Power Portal (NPP)",
          lastUpdated: "Q1 2025 Streamflow Logs",
          confidence: "High [DQY: 97.2%]",
          org: "THDC India Ltd & NRLDC"
        };
      case "Koyna Hydro Plant":
        return {
          type: "Hydropower Station",
          capacity: getCapacityText(1960, "MW"),
          utilization: "42.5% peaking factor",
          risk: "STABLE",
          desc: "Sited in Satara, Maharashtra, with extensive underground generator caverns. Vital black-start asset serving the Western grid during transmission faults.",
          image: "https://images.unsplash.com/photo-1460518451285-cd3ab4204666?auto=format&fit=crop&w=600&q=80",
          source: "State Renewable Energy Agencies",
          lastUpdated: "2024 Water-Year Assessment",
          confidence: "High [DQY: 95.8%]",
          org: "Mahagenco / WRPC"
        };
      case "Delhi NCR Transmission Hub":
        return {
          type: "UHV-AC Grid Substation Hub",
          capacity: getCapacityText(2000, "MVA Exchange"),
          utilization: "86.0% peak load",
          risk: "HIGH LOAD",
          desc: "Critical 765kV step-down hub coordinating solar inflows from western deserts and power feed grids to metropolitan Delhi consumers.",
          image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
          source: "Grid India / POSOCO Telemetry",
          lastUpdated: "Real-time Operations Ledger",
          confidence: "High [DQY: 99.1%]",
          org: "Power Grid Corporation of India"
        };
      case "Mumbai West GIS":
        return {
          type: "Gas-Insulated Substation",
          capacity: getCapacityText(1200, "MVA"),
          utilization: "78.4% commercial load",
          risk: "STABLE",
          desc: "Compact GIS substation managing urban power distribution into metropolitan Mumbai. Elevated storm defenses mitigate regional flood risks.",
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
          source: "Central Electricity Authority (CEA) Registry",
          lastUpdated: "2025 Substation Audit",
          confidence: "High [DQY: 98.6%]",
          org: "STU Maharashtra & POSOCO"
        };
      case "Bhubaneswar Coastal Grid Aggregator":
        return {
          type: "Smart Marine Substation Grid",
          capacity: getCapacityText(1400, "MVA"),
          utilization: "62.4% peak loads",
          risk: "NOMINAL",
          desc: "Heavy marine inter-tie system channeling clean offshore solar/wind generation into East regional hubs.",
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
          source: "Grid East / POSOCO Telemetry",
          lastUpdated: "2025 Audit",
          confidence: "High [DQY: 94.6%]",
          org: "STU Odisha Grid"
        };
      case "Ranchi Smart Terminal Corridor":
        return {
          type: "Advanced Storage Cell",
          capacity: getCapacityText(800, "MWh Buffer"),
          utilization: "80.0%",
          risk: "STABLE",
          desc: "Ensures frequency lock and dispatchable stability for critical steel foundry zones.",
          image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
          source: "State Load Dispatch Center (Ranchi)",
          lastUpdated: "Real-time",
          confidence: "High [DQY: 95.0%]",
          org: "STU Jharkhand / CEA"
        };
      case "Bhopal Central Grid Exchange":
        return {
          type: "Core Cross-Country Inter-tie",
          capacity: getCapacityText(1100, "MVA"),
          utilization: "74.2%",
          risk: "STABLE",
          desc: "Crucial regional hub coupling east-west solar transmission loops.",
          image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
          source: "Central Grid India Commission",
          lastUpdated: "2025 Baseline",
          confidence: "High [DQY: 99.2%]",
          org: "PGCIL Central Central"
        };
      case "Jabalpur Trunk Inter-tie Bus":
        return {
          type: "Surge Stabilizing System",
          capacity: getCapacityText(1200, "MVA"),
          utilization: "45.0%",
          risk: "NOMINAL",
          desc: "Compensates cross-country solar transport swings using high-reactance reactors.",
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
          source: "Western/Southern Load Despatch Center",
          lastUpdated: "Q1 2025",
          confidence: "High [DQY: 98.4%]",
          org: "MP Transco Control"
        };
      case "Kutch Green Hydrogen Fusion Bus":
        return {
          type: "Futuristic Hydrogen Plant",
          capacity: "3,500 MW Electrolysis Array",
          utilization: "12.0% first phase trial",
          risk: "HIGH DISCOVERY",
          desc: "Advanced 2040 target infrastructure. Seamless blending of offshore high wind with localized green hydrogen electrolysis peaking turbines.",
          image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
          source: "NEXUS Grids Future Innovation Group",
          lastUpdated: "Forecast 2040 Model",
          confidence: "Medium [DQY: 82.5%]",
          org: "NEXUS Grid R&D Lab"
        };
      case "Arunachal Fusion Energy Prototype":
        return {
          type: "Commercial Stellarator Concept",
          capacity: "6,000 MW Thermal Peak",
          utilization: "99.0% baseload",
          risk: "EXPERIMENTAL",
          desc: "Next-gen zero-carbon stellarator confinement array injecting dispatch power straight to East national transport loops. Designed as a 2050 target milestone.",
          image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80",
          source: "Global Thermonuclear Grid Coalition",
          lastUpdated: "Target 2050 blueprint",
          confidence: "Low [DQY: 65.0%]",
          org: "Arunachal Advanced Fusion Center"
        };
      default:
        return {
          type: "Grid Asset Node",
          capacity: "350 MW",
          utilization: "55.0%",
          risk: "STABLE",
          desc: "General infrastructure node monitored by the NEXUS Grid digital twin telemetry loops.",
          image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
          source: "Central Electricity Authority (CEA)",
          lastUpdated: "2025 General Records",
          confidence: "High",
          org: "Ministry of Power"
        };
    }
  };

  const getDynamicRenewable = () => {
    const base = planningMode === "RURAL" ? 79 : planningMode === "MUNICIPAL" ? 41 : 54;
    const ratio = (year - 2025) / (2050 - 2025);
    return Math.min(100, Math.round(base + ratio * (100 - base) * 0.7));
  };

  const getDynamicHealth = () => {
    const base = planningMode === "RURAL" ? 76 : planningMode === "MUNICIPAL" ? 87 : 91;
    const dev = (year % 7) - 3;
    return Math.min(100, Math.max(50, base + dev));
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  const getModeSpecificData = () => {
    switch (planningMode) {
      case "MUNICIPAL":
        return {
          capacity: "1.1 GW",
          maxAbsorption: "1.8 GW",
          available: "0.7 GW",
          constraint: "Metro West Link S-2",
          recommendedUpgrade: "33kV Medium-Voltage Smart Throttler",
          nodesColor: "bg-sky-500",
          recommendations: [
            {
              title: "Deploy V2G Battery Nodes",
              detail: "Deploy vehicle-to-grid aggregation nodes across downtown parking garages to absorb daytime commercial solar peaks."
            },
            {
              title: "Smart Metering Mesh S-2",
              detail: "Accelerate high-frequency demand control gateways to shave metropolitan peaks within congested residential lines."
            }
          ],
          locations: [
            { id: "ml-1", name: "Helios Urban Solar Array", type: "Solar Farm", zone: "Metro North Grid", coordinates: "top-[25%] left-[42%]", status: "ACTIVE", value: "350 MW" },
            { id: "ml-2", name: "Metro West Battery Core", type: "Battery Storage", zone: "City Industrial Loop", coordinates: "top-[54%] left-[36%]", status: "CHARGING", value: "150MWh" },
            { id: "ml-3", name: "Substation Metro-S2", type: "Connection Point", zone: "Downtown Gateway", coordinates: "top-[42%] left-[64%]", status: "CONGESTED", value: "Capacity Constraint Point" },
          ]
        };
      case "RURAL":
        return {
          capacity: "0.8 GW",
          maxAbsorption: "1.2 GW",
          available: "0.4 GW",
          constraint: "Appalachia Radial S-9",
          recommendedUpgrade: "Microgrid Autonomy Recloser Loop",
          nodesColor: "bg-emerald-500",
          recommendations: [
            {
              title: "Battery Microgrid Deployment",
              detail: "Implement 40x communal lithium kits in radial valleys to secure power during heavy mountain storm line losses."
            },
            {
              title: "Communal Biomass Infeed",
              detail: "Leverage farm manure methane backup generators as dispatchable firming nodes alongside regional solar village inputs."
            }
          ],
          locations: [
            { id: "rl-1", name: "Green Valley Solar Farm", type: "Solar Farm", zone: "Valley East Cluster", coordinates: "top-[22%] left-[58%]", status: "ACTIVE", value: "220 MW" },
            { id: "rl-2", name: "Valley Community Batteries", type: "Battery Storage", zone: "South Fork Microgrid", coordinates: "top-[64%] left-[45%]", status: "DISCHARGING", value: "80MWh" },
            { id: "rl-3", name: "Substation Fork-S9", type: "Connection Point", zone: "Appalachia Radial Hub", coordinates: "top-[50%] left-[31%]", status: "FAULT RISK", value: "Line Impedance Block" },
          ]
        };
      case "NATIONAL":
      default:
        return {
          capacity: "2.4 GW",
          maxAbsorption: "3.8 GW",
          available: "1.4 GW",
          constraint: "High-Voltage Substation S-14",
          recommendedUpgrade: "132kV HVDC Phase Expansion",
          nodesColor: "bg-[#0F4C81]",
          recommendations: [
            {
              title: "Offshore Wind Inter-Tie expansion",
              detail: "Create secondary undersea HVDC circuits to route surplus Boreas Wind capacity straight to coastal industrial hubs."
            },
            {
              title: "Zone B Battery Fortification",
              detail: "Increase core utility capacity with 300MWh cells at Western Border nodes to prevent inter-regional load shedding."
            }
          ],
          locations: [
            { id: "nl-1", name: "Boreas Alpha Offshore Wind", type: "Wind Farm", zone: "Northwest Sea Ridge", coordinates: "top-[18%] left-[50%]", status: "ACTIVE", value: "800 MW" },
            { id: "nl-2", name: "Zone B Megapack Reserve", type: "Battery Storage", zone: "Pacific Rim Terminal", coordinates: "top-[58%] left-[56%]", status: "STANDBY", value: "300MWh" },
            { id: "nl-3", name: "Substation Corridor S-14", type: "Connection Point", zone: "Northeast Intertie Corridor", coordinates: "top-[36%] left-[42%]", status: "CONGESTED", value: "Thermal Capacity Strain" },
          ]
        };
    }
  };

  const modeData = getModeSpecificData();

  const getDynamicLocations = () => {
    const baseLocations = modeData.locations;
    if (scopeType === "Region") {
      if (selectedRegion === "West") {
        return [
          { id: "loc-west-1", name: "Bhadla Solar Park", type: "Solar Farm", zone: "Rajasthan Desert Hub", coordinates: "top-[28%] left-[26%]", status: "ACTIVE", value: "2245 MW" },
          { id: "loc-west-2", name: "Kutch Renewable Energy Zone", type: "Battery Storage", zone: "Gujarat Hybrid Zone", coordinates: "top-[58%] left-[56%]", status: "CHARGING", value: "1500 MW" },
          { id: "loc-west-3", name: "Mumbai West GIS", type: "Connection Point", zone: "Metropolitan Mumbai Loop", coordinates: "top-[54%] left-[64%]", status: "CONGESTED", value: "1200 MVA" },
        ];
      } else if (selectedRegion === "North") {
        return [
          { id: "loc-north-1", name: "Tehri Hydro Plant", type: "Solar Farm", zone: "Uttarakhand Pumped Peak", coordinates: "top-[22%] left-[38%]", status: "ACTIVE", value: "1000 MW" },
          { id: "loc-north-2", name: "Jodhpur Collector Substation", type: "Battery Storage", zone: "Rajasthan High Output", coordinates: "top-[32%] left-[30%]", status: "STANDBY", value: "2500 MWh" },
          { id: "loc-north-3", name: "Delhi NCR Transmission Hub", type: "Connection Point", zone: "NCR Transmission Corridor", coordinates: "top-[36%] left-[42%]", status: "CONGESTED", value: "2000 MVA" },
        ];
      } else if (selectedRegion === "South") {
        return [
          { id: "loc-south-1", name: "Pavagada Solar Park", type: "Solar Farm", zone: "Karnataka Solar Ring", coordinates: "top-[72%] left-[45%]", status: "ACTIVE", value: "2050 MW" },
          { id: "loc-south-2", name: "Muppandal Wind Farm", type: "Battery Storage", zone: "Tamil Nadu Wind Pass", coordinates: "top-[18%] left-[50%]", status: "DISCHARGING", value: "1500 MWh" },
          { id: "loc-south-3", name: "Chennai Coastal Switching Substation", type: "Connection Point", zone: "Chennai Coastal Loop", coordinates: "top-[68%] left-[52%]", status: "CONGESTED", value: "1000 MVA" },
        ];
      } else if (selectedRegion === "East") {
        return [
          { id: "loc-east-1", name: "Bhubaneswar Coastal Grid Aggregator", type: "Solar Farm", zone: "Odisha Coastal Aggregator", coordinates: "top-[60%] left-[70%]", status: "ACTIVE", value: "1400 MVA" },
          { id: "loc-east-2", name: "Ranchi Smart Terminal Corridor", type: "Battery Storage", zone: "Jharkhand Energy Buffer", coordinates: "top-[48%] left-[62%]", status: "CHARGING", value: "800 MWh" },
          { id: "loc-east-3", name: "Jamshedpur Heavy-Metallurgy Exchange", type: "Connection Point", zone: "Jamshedpur Industrial Loop", coordinates: "top-[44%] left-[68%]", status: "CONGESTED", value: "1600 MVA" },
        ];
      } else {
        return [
          { id: "loc-central-1", name: "Bhopal Central Grid Exchange", type: "Solar Farm", zone: "MP Central Grid Hub", coordinates: "top-[50%] left-[48%]", status: "ACTIVE", value: "1100 MVA" },
          { id: "loc-central-2", name: "Jabalpur Trunk Inter-tie Bus", type: "Battery Storage", zone: "MP Intertie Corridor", coordinates: "top-[46%] left-[52%]", status: "STANDBY", value: "1200 MVA" },
          { id: "loc-central-3", name: "Nagpur Inter-regional Transmission Hub", type: "Connection Point", zone: "Nagpur Junction Exchange", coordinates: "top-[52%] left-[46%]", status: "CONGESTED", value: "1500 MVA" },
        ];
      }
    } else if (scopeType === "Horizon") {
      return baseLocations.map(loc => ({
        ...loc,
        value: loc.value.includes("MW") 
          ? `${Math.round(parseInt(loc.value) * (selectedHorizon === 2030 ? 1.15 : selectedHorizon === 2040 ? 1.60 : 2.45))} MW (Target)`
          : loc.value
      }));
    }
    return baseLocations;
  };

  const getScaledValText = (item: any) => {
    if (scopeType === "Horizon") {
      let scale = 1.0;
      if (selectedHorizon === 2030) scale = 1.15;
      else if (selectedHorizon === 2040) scale = 1.60;
      else if (selectedHorizon === 2050) scale = 2.45;
      return `${Math.round(item.baseVal * scale).toLocaleString()} ${item.unit}`;
    }
    return `${item.baseVal.toLocaleString()} ${item.unit}`;
  };

  const assetList = [
    { id: "dt-muppandal", name: "Muppandal Wind Farm", type: "windFarms", region: "South", top: "18%", left: "50%", icon: "toys", color: "bg-blue-600", baseVal: 1500, unit: "MW", desc: "Tamil Nadu wind pass corridor feeds south heavy industry grids." },
    { id: "dt-bhadla", name: "Bhadla Solar Park", type: "solarArrays", region: "West", top: "28%", left: "26%", icon: "sunny", color: "bg-amber-500", baseVal: 2245, unit: "MW", desc: "Rajasthan Thar Desert solar array, prone to dispatch congestion." },
    { id: "dt-pavagada", name: "Pavagada Solar Park", type: "solarArrays", region: "South", top: "72%", left: "45%", icon: "sunny", color: "bg-amber-500", baseVal: 2050, unit: "MW", desc: "Tumkur Karnataka high-density clean solar injection point." },
    { id: "dt-delhi", name: "Delhi NCR Transmission Hub", type: "transmissionLines", region: "North", top: "36%", left: "42%", icon: "bolt", color: "bg-orange-600", baseVal: 2000, unit: "MVA", desc: "Main Stepdown 765kV bus terminal allocating northern metropolitan load." },
    { id: "dt-mumbai", name: "Mumbai West GIS", type: "transmissionLines", region: "West", top: "54%", left: "64%", icon: "electric_substation", color: "bg-orange-400", baseVal: 1200, unit: "MVA", desc: "Gas-Insulated substation routing underwater western grids to metropolitan Mumbai." },
    { id: "dt-kutch", name: "Kutch Renewable Energy Zone", type: "energyStorage", region: "West", top: "58%", left: "56%", icon: "battery_charging_full", color: "bg-emerald-500", baseVal: 1500, unit: "MW Hybrid", desc: "Gujarat hybrid solar-wind generation coupled with utility-scale battery banks." },
    { id: "dt-tehri", name: "Tehri Hydro Plant", type: "hydro", region: "North", top: "22%", left: "38%", icon: "water_drop", color: "bg-sky-600", baseVal: 1000, unit: "MW Peaking", desc: "Uttarakhand high-head gravity pumped-storage reservoir." },
    { id: "dt-koyna", name: "Koyna Hydro Plant", type: "hydro", region: "West", top: "64%", left: "30%", icon: "water_drop", color: "bg-sky-600", baseVal: 1960, unit: "MW", desc: "Underground water caverns regulate sudden western industrial load swings." },
    { id: "dt-bhubaneswar", name: "Bhubaneswar Coastal Grid Aggregator", type: "transmissionLines", region: "East", top: "60%", left: "70%", icon: "electric_substation", color: "bg-indigo-500", baseVal: 1400, unit: "MVA", desc: "Coordinating inter-regional HVDC flows with coastal marine wind grids." },
    { id: "dt-ranchi", name: "Ranchi Smart Terminal Corridor", type: "energyStorage", region: "East", top: "48%", left: "62%", icon: "battery_charging_full", color: "bg-emerald-400", baseVal: 800, unit: "MWh", desc: "Ensuring energy buffer stability for deep coalbelt steel-foundry hubs." },
    { id: "dt-bhopal", name: "Bhopal Central Grid Exchange", type: "transmissionLines", region: "Central", top: "50%", left: "48%", icon: "bolt", color: "bg-pink-600", baseVal: 1100, unit: "MVA", desc: "Central regional bus coupling cross-national solar ties." },
    { id: "dt-jabalpur", name: "Jabalpur Trunk Inter-tie Bus", type: "transmissionLines", region: "Central", top: "46%", left: "52%", icon: "circle", color: "bg-pink-400", baseVal: 1200, unit: "MVA", desc: "Inter-regional loop feeder decoupling North-South transit sags." }
  ];

  if (scopeType === "Horizon") {
    if (selectedHorizon >= 2040) {
      assetList.push({ id: "dt-hydrogen", name: "Kutch Green Hydrogen Fusion Bus", type: "energyStorage", region: "West", top: "52%", left: "18%", icon: "cyclone", color: "bg-fuchsia-500 animate-bounce", baseVal: 3500, unit: "MW Peaking", desc: "Futuristic 2040 high-density green hydrogen electrolysis cell array with localized gas turbine feeds." });
    }
    if (selectedHorizon >= 2050) {
      assetList.push({ id: "dt-fusion", name: "Arunachal Fusion Energy Prototype", type: "windFarms", region: "East", top: "30%", left: "82%", icon: "grain", color: "bg-violet-600 animate-pulse", baseVal: 6000, unit: "MW Constant", desc: "Next-gen clean stellarator fusion cluster injecting dispatch power straight to East national lines." });
    }
  }

  // Toggle state for bottleneck HUD collapsing
  const [bottleneckCollapsed, setBottleneckCollapsed] = useState<boolean>(false);

  const visibleAssets = assetList.filter((a) => {
    if (scopeType === "Region" && a.region !== selectedRegion) return false;
    if (a.type === "windFarms" && !layers.windFarms) return false;
    if (a.type === "solarArrays" && !layers.solarArrays) return false;
    if (a.type === "transmissionLines" && !layers.transmissionLines) return false;
    if (a.type === "energyStorage" && !layers.energyStorage) return false;
    return true;
  });

  return (
    <div className="relative flex-1 bg-[#F8FAFC] h-[calc(100vh-3.5rem)] flex overflow-hidden select-text border-t border-[#E2E8F0]">
      
      {/* 1. GIS Map Content Viewport */}
      <div className="flex-1 relative bg-slate-100 overflow-hidden select-none border-r border-[#E2E8F0]">
        
        {/* Active Critical Bottleneck Overlay */}
        {layers.renewableBottlenecks && (
          <div className={`absolute top-4 right-4 z-30 max-w-sm bg-[#881337]/95 border-2 border-red-500 shadow-2xl rounded-xl text-white transition-all duration-300 pointer-events-auto ${
            bottleneckCollapsed ? "p-3 w-64" : "p-5"
          }`}>
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-rose-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-300 font-extrabold animate-ping">error</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FDA4AF]">
                  Critical Bottleneck
                </span>
              </div>
              <button 
                onClick={() => setBottleneckCollapsed(!bottleneckCollapsed)}
                className="material-symbols-outlined text-xs text-rose-300 hover:text-white cursor-pointer select-none bg-transparent border-none p-0 focus:outline-none"
                aria-label={bottleneckCollapsed ? "Expand bottleneck details" : "Collapse bottleneck details"}
              >
                {bottleneckCollapsed ? "expand_more" : "expand_less"}
              </button>
            </div>
            
            {!bottleneckCollapsed ? (
              <>
                <h3 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-tight">
                  Rajasthan Solar Cluster
                </h3>
                <p className="text-[9.5px] text-rose-200 mt-1 pb-2 leading-normal font-sans border-b border-rose-800/60 font-medium">
                  High-density solar output exceeds outbound transmission thermal limits during mid-day dispatch peaks.
                </p>

                <div className="grid grid-cols-2 gap-2.5 my-2.5">
                  <div className="bg-rose-950/50 p-2 rounded border border-rose-800">
                    <span className="text-[8px] font-mono text-rose-300 block uppercase font-bold">Generation</span>
                    <span className="text-sm font-mono font-black text-white">2.4 GW</span>
                  </div>
                  <div className="bg-rose-950/50 p-2 rounded border border-rose-800">
                    <span className="text-[8px] font-mono text-rose-300 block uppercase font-bold">Transmission Cap.</span>
                    <span className="text-sm font-mono font-black text-rose-400">1.8 GW</span>
                  </div>
                </div>

                <div className="p-2 bg-rose-900 border border-rose-700 rounded-lg flex justify-between items-center mb-2.5">
                  <span className="text-[9.5px] font-bold text-rose-200 uppercase font-mono">Current Curtailment:</span>
                  <span className="text-xs font-mono font-black text-white">600 MW</span>
                </div>

                <div className="bg-[#eff4ff] text-slate-900 border border-blue-200 p-2.5 rounded-lg space-y-0.5 select-text">
                  <span className="text-[8px] font-black text-indigo-700 tracking-wider uppercase block">
                    Recommended Upgrade Scheme
                  </span>
                  <span className="text-[10.5px] font-black text-slate-800 block">
                    Western Renewable Corridor
                  </span>
                  <p className="text-[9px] text-slate-550 leading-normal font-medium">
                    Expanding step-down dual HVDC bus link immediately unblocks curtailed capacity.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-[10px] font-bold text-rose-200 truncate">
                ⚠️ Rajasthan Solar Cluster: 600 MW Curtailment
              </div>
            )}
          </div>
        )}
        
        {/* Subtab Dynamic Workspace Render */}
        {subTab === "ATLAS" ? (
          <DigitalTwinAtlas
            layers={layers}
            setLayers={setLayers}
            scopeType={scopeType}
            selectedRegion={selectedRegion}
            selectedHorizon={selectedHorizon}
            zoom={zoom}
            setZoom={setZoom}
            year={year}
            setYear={setYear}
            twinMode={twinMode}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            setIsDetailOpen={setIsDetailOpen}
            planningMode={planningMode}
            getDynamicHealth={getDynamicHealth}
            getDynamicRenewable={getDynamicRenewable}
            getSelectedAssetSpecs={getSelectedAssetSpecs}
            getScaledValText={getScaledValText}
            visibleAssets={visibleAssets}
          />
        ) : (
          <DigitalTwinRenewables
            layers={layers}
            solarMix={solarMix}
            setSolarMix={setSolarMix}
            windMix={windMix}
            setWindMix={setWindMix}
            setSelectedAsset={setSelectedAsset}
            setIsDetailOpen={setIsDetailOpen}
            modeData={modeData}
            getDynamicLocations={getDynamicLocations}
          />
        )}

        {/* GIS HUD Loading State */}
        {isSimulating && (
          <div className="absolute inset-0 z-40 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center text-[#0F172A]">
            <span className="material-symbols-outlined text-5xl text-[#0F4C81] rotate-spin animate-spin">sync</span>
            <p className="font-mono text-xs tracking-widest uppercase text-[#0F4C81] mt-4">RECOMPUTING TRANSIENT MATRIX...</p>
            <p className="text-[10px] text-slate-500 mt-1">Calibrating load flow calculations for Year {year}</p>
          </div>
        )}

        {/* Top-Left Overlay Workspace selector tabs */}
        <div className="absolute top-4 left-4 flex flex-col gap-3.5 z-20">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-1 flex gap-1 shadow-md">
            <button 
              onClick={() => setSubTab("ATLAS")}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded transition-colors cursor-pointer ${
                subTab === "ATLAS" 
                  ? "bg-blue-50 text-[#0F4C81] font-black" 
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Infrastructure Atlas
            </button>
            <button 
              onClick={() => { setSubTab("RENEWABLES"); }}
              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                subTab === "RENEWABLES" 
                  ? "bg-amber-100 text-amber-800 font-extrabold border border-amber-200" 
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined text-xs">eco</span>
              RENEWABLE PLANNER
            </button>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex flex-col gap-2 shadow-md min-w-[200px]">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded text-[#0F4C81] font-black text-[9px] uppercase tracking-wide text-left font-mono">
              <span className="material-symbols-outlined text-[14px]">science</span> twin configuration
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <button
                onClick={() => handleModeChange("REAL_INFRASTRUCTURE")}
                className={`py-1.5 px-2.5 rounded text-[10px] font-bold text-left flex items-center justify-between cursor-pointer transition-all ${
                  twinMode === "REAL_INFRASTRUCTURE"
                    ? "bg-[#0F4C81] text-white"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>🌍 Real Data Mode</span>
                {twinMode === "REAL_INFRASTRUCTURE" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>
              <button
                onClick={() => handleModeChange("PLANNING_SIMULATION")}
                className={`py-1.5 px-2.5 rounded text-[10px] font-bold text-left flex items-center justify-between cursor-pointer transition-all ${
                  twinMode === "PLANNING_SIMULATION"
                    ? "bg-[#0F4C81] text-white"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>⚡ Planning Simulation</span>
                {twinMode === "PLANNING_SIMULATION" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
              </button>
            </div>
            {twinMode === "REAL_INFRASTRUCTURE" ? (
              <p className="text-[9px] text-slate-500 font-semibold mt-1 leading-normal">
                Uses audited datasets. Timeline slider locked to observed reality (Year 2025).
              </p>
            ) : (
              <p className="text-[9px] text-[#0F4C81] font-semibold mt-1 leading-normal">
                Modeling enabled. Adjust time or sliders to explore Future Shock scenarios.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar Inspection Drawer */}
      {isDetailOpen ? (
        <aside className="w-[360px] bg-white border-l border-[#E2E8F0] flex flex-col z-20 shadow-lg transition-all h-full overflow-y-auto">
          {subTab === "ATLAS" ? (
            <div className="p-5 flex-1 select-text">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider">Infrastructure Detail</h2>
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="material-symbols-outlined text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Close details panel"
                >
                  close
                </button>
              </div>

              <div className="mb-6">
                <div className="relative h-40 rounded-lg overflow-hidden mb-3 border border-[#E2E8F0] shadow-sm">
                  <img 
                    alt={getSelectedAssetSpecs().type} 
                    className="w-full h-full object-cover" 
                    src={getSelectedAssetSpecs().image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#0F4C81]/90 backdrop-blur-md px-2 py-0.5 rounded text-white text-[9px] font-extrabold tracking-widest uppercase">
                    {getSelectedAssetSpecs().type}
                  </div>
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 leading-tight font-sans">
                  {selectedAsset}
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">
                  ACTIVE TELEMETRY • PLANNING YEAR {year}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded border border-[#E2E8F0]">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Capacity</span>
                    <span className="font-mono text-sm font-extrabold text-slate-800">
                      {getSelectedAssetSpecs().capacity}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-[#E2E8F0]">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Utilization</span>
                    <span className="font-mono text-sm font-extrabold text-[#0F4C81]">
                      {getSelectedAssetSpecs().utilization}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk Assessment</span>
                    <span className={`px-1.5 py-0.5 border rounded text-[9px] font-extrabold ${
                      getSelectedAssetSpecs().risk === "CONGESTED" 
                        ? "bg-amber-50 text-amber-800 border-amber-200" 
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}>
                      {getSelectedAssetSpecs().risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    {getSelectedAssetSpecs().desc}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-[#E2E8F0] space-y-2.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b pb-1">Data Source Transparency</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Source Organization</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{getSelectedAssetSpecs().org}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Asset Source</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{getSelectedAssetSpecs().source}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Last Updated</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{getSelectedAssetSpecs().lastUpdated}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Confidence Level</span>
                      <span className="font-extrabold text-[#0F4C81] block mt-0.5">{getSelectedAssetSpecs().confidence}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 flex-1 flex flex-col justify-between select-text">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b pb-3 border-[#E2E8F0]">
                  <div>
                    <h2 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">eco</span>
                      Renewables Planner
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase">Integration Analytics</p>
                  </div>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="material-symbols-outlined text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                    aria-label="Close renewables panel"
                  >
                    close
                  </button>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded border border-[#E2E8F0] shadow-xs space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      <span>Renewable Capacity</span>
                      <span className="text-[#0F4C81] font-black font-mono">{modeData.capacity}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: "63%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                      <span>Max Absorption Cap</span>
                      <span className="text-[#0F172A] font-black">{modeData.maxAbsorption}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0F4C81]" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Available grid capacity:</span>
                    <span className="font-mono font-bold text-emerald-600">{modeData.available}</span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg shadow-xs space-y-3.5">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
                    <span className="material-symbols-outlined text-sm text-emerald-600">energy_savings_leaf</span>
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-700">
                      RENEWABLE COMMAND PANEL
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-500 font-bold uppercase">Solar Infeed Goal</span>
                        <span className="font-extrabold text-amber-600">{solarMix} GW</span>
                      </div>
                      <input 
                        type="range"
                        min={10}
                        max={80}
                        value={solarMix}
                        onChange={(e) => setSolarMix(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-amber-500 focus:outline-none" 
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-500 font-bold uppercase">Wind Infeed Goal</span>
                        <span className="font-extrabold text-[#0F4C81]">{windMix} GW</span>
                      </div>
                      <input 
                        type="range"
                        min={10}
                        max={120}
                        value={windMix}
                        onChange={(e) => setWindMix(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0F4C81] focus:outline-none" 
                      />
                    </div>

                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded flex justify-between items-center">
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 block uppercase leading-none">TOTAL CONTROL LOAD</span>
                        <span className="font-mono text-xs font-black text-slate-800 block mt-1">{(solarMix + windMix).toFixed(1)} GW</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold ${
                        (solarMix + windMix) > 100 
                          ? "bg-rose-50 text-rose-700 border border-rose-100" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        {(solarMix + windMix) > 100 ? "OVERLOAD FLAGGED" : "NOMINAL MARGIN"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[10px] uppercase tracking-wide mb-1.5">
                    <span className="material-symbols-outlined text-[15px]">crisis_alt</span>
                    Critical absorption constraint
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Location: {modeData.constraint}</p>
                    <p className="text-[11px] text-slate-650 mt-1 leading-normal font-sans">
                      High capacity lines throttling. Sourcing surplus wind/solar backflow triggers safety isolation flags.
                    </p>
                    <div className="mt-2 text-[10px] bg-white border border-rose-100 p-1.5 rounded text-slate-800">
                      <span className="font-bold text-[#0F4C81] block">Recommended Upgrade Action:</span>
                      <p className="mt-0.5">{modeData.recommendedUpgrade}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                    STRATEGY RECOMMENDATIONS
                  </span>
                  
                  {modeData.recommendations.map((rec: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="p-3 border rounded border-[#E2E8F0] bg-white flex gap-2.5 items-start text-xs shadow-xs"
                    >
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">verified_user</span>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{rec.title}</span>
                        <span className="text-[10.5px] text-slate-500 mt-0.5 block leading-normal font-sans">{rec.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0]">
                <div className="p-3 bg-[#eff4ff] rounded text-[10.5px] leading-relaxed text-[#0F4C81] border border-blue-100 font-sans">
                  <span className="font-bold uppercase block text-[9px] tracking-wide mb-0.5">ESTIMATED POLICY IMPACT</span>
                  Resolving the {modeData.constraint} capacity constraint unlocks {modeData.available} green flow, avoiding curtailment penalties.
                </div>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-[#E2E8F0] bg-white sticky bottom-0">
            <button 
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full bg-[#0F4C81] hover:bg-[#2563EB] text-white font-bold py-2.5 rounded transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs text-[11px]"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span className="uppercase tracking-wider">RECOMPUTE LOAD DYNAMICS</span>
            </button>
          </div>
        </aside>
      ) : (
        <button 
          onClick={() => setIsDetailOpen(true)}
          className="absolute right-4 top-4 bg-[#0F4C81] hover:bg-[#2563EB] text-white p-2.5 rounded-full shadow-lg z-20 flex hover:scale-105 active:scale-95 transition-all text-sm uppercase font-bold items-center gap-1.5"
          aria-label="Open details panel"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          <span className="text-[10px] tracking-wide pr-1">Details</span>
        </button>
      )}

    </div>
  );
};

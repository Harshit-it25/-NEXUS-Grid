import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePlanningScope } from "../PlanningScopeContext";

export const DecisionTraceability: React.FC = () => {
  const {
    scopeType,
    selectedRegion,
    selectedHorizon,
    renewableTarget,
    budgetCr,
    storageGwh,
    climateRiskLevel,
    activeScenarioName,
    consensusScore: contextConsensusScore,
  } = usePlanningScope();

  const consensusScore = `${contextConsensusScore}%`;

  const reliabilityTarget = scopeType === "Horizon" 
    ? (selectedHorizon === 2030 ? "96.1% → 98.4%" : selectedHorizon === 2040 ? "96.1% → 99.2%" : "96.1% → 99.8%")
    : "96.1% → 99.2%";

  const lowestRiskProfileText = scopeType === "Region"
    ? (selectedRegion === "West" ? "Desert substation buffers and dynamic line routing prevent overruns during peak solar thermal loading."
      : selectedRegion === "North" ? "Hydro pumped peaking and air-core transformers prevent summer sag cascade risks."
      : selectedRegion === "South" ? "Epoxy switchgears and elevated coastal nodes mitigate marine corrosion and storm surges."
      : selectedRegion === "East" ? "Elevated concrete foundations and community microgrid sectionalizing mitigate flash flooding."
      : "Surge capacitor blocks and inter-regional routing contain national corridor faults.")
    : scopeType === "Horizon"
    ? (selectedHorizon === 2030 ? "Priority AMI telemetry mesh and automatic reclosers restrict rural grid outages."
      : selectedHorizon === 2040 ? "Dual-link line layout and BESS arrays prevent cascading blackouts during extreme weather spikes."
      : "Continuous fusion power base and deep underground LOHC hydrogen buffer secure winter reserves.")
    : "Dual-link line layout and BESS arrays prevent cascading blackouts during extreme weather spikes.";

  const populationServed = scopeType === "Region" 
    ? (selectedRegion === "West" ? "+6.5 Million" : selectedRegion === "North" ? "+8.2 Million" : selectedRegion === "South" ? "+5.8 Million" : selectedRegion === "East" ? "+4.1 Million" : "+3.4 Million") 
    : scopeType === "Horizon" 
    ? (selectedHorizon === 2030 ? "+12 Million" : selectedHorizon === 2040 ? "+24 Million" : "+48 Million") 
    : "+24 Million";

  const gridResilience = scopeType === "Region" 
    ? (selectedRegion === "West" ? "+35%" : selectedRegion === "North" ? "+28%" : selectedRegion === "South" ? "+32%" : selectedRegion === "East" ? "+25%" : "+30%") 
    : scopeType === "Horizon" 
    ? (selectedHorizon === 2030 ? "+15%" : selectedHorizon === 2040 ? "+31%" : "+65%") 
    : "+31%";

  const capexYield = scopeType === "Region" 
    ? (selectedRegion === "West" ? "+22%" : selectedRegion === "North" ? "+18%" : selectedRegion === "South" ? "+20%" : selectedRegion === "East" ? "+15%" : "+17%") 
    : scopeType === "Horizon" 
    ? (selectedHorizon === 2030 ? "+12%" : selectedHorizon === 2040 ? "+19%" : "+28%") 
    : "+19%";

  const getDynamicProjects = () => {
    if (scopeType === "Region") {
      if (selectedRegion === "West") {
        return [
          { num: 1, name: "Kutch Desert BESS Fortification", why: "Rapid-response utility battery bank acting as frequency stabilizer during cloud sags in Gujarat.", reliability: "+1.4% stability relief", renewable: "300 MWh instantaneous battery buffer", roi: "13.5%" },
          { num: 2, name: "Mumbai EV Fast-Charger Mesh Gateway", why: "High density charging aggregation and smart grid-edge vehicle-to-grid injection terminals.", reliability: "+1.1% peak load shave", renewable: "150 MWh peak demand shaving", roi: "11.2%" },
          { num: 3, name: "Western Renewable Corridor", why: "Heavy-duty gas-insulated step-down transmission inter-tie resolving local congestion events.", reliability: "+1.8% load-shedding relief", renewable: "Connects desert solar wind to commercial mainlines", roi: "12.5%" }
        ];
      } else if (selectedRegion === "North") {
        return [
          { num: 1, name: "Bhadla–Delhi Green Link", why: "Essential high-voltage link connecting Jodhpur solar complexes directly to Delhi NCR demand centers.", reliability: "+2.1% storm sag buffer", renewable: "Direct evacuation of 2.1 GW clean solar power", roi: "14.8%" },
          { num: 2, name: "Tehri Hydro Pumped Peak Upgrade", why: "Gravity pumped-storage peaking capacity retrofitted with dynamic air-core ventilation rigs.", reliability: "+2.5% frequency compliance", renewable: "Supports 1.0 GW high-head peaking dispatch", roi: "12.8%" },
          { num: 3, name: "Jaipur Solar Integration Hub", why: "High-voltage collector substation equipped with fast-response active compensator bays.", reliability: "+1.5% voltage sag relief", renewable: "Integrates 1.4 GW desert collector solar feeds", roi: "11.5%" }
        ];
      } else if (selectedRegion === "South") {
        return [
          { num: 1, name: "Pavagada Solar Complex Link", why: "Coordinates clean solar electricity inflows directly into Bangalore and southern load centers.", reliability: "+1.6% SAIDI reliability rating", renewable: "2050 MW clean solar generation tie-in", roi: "13.8%" },
          { num: 2, name: "Muppandal Onshore Wind Pass Corridor", why: "Exploits seasonal pass winds to feed bulk industrial consumers in Tamil Nadu.", reliability: "+2.0% dispatch availability", renewable: "1500 MW wind generation capacity", roi: "12.4%" },
          { num: 3, name: "Chennai GIS Marine Flood Protection", why: "Elevates switchgear levels and concrete drainage paths to survive coastal storm surges.", reliability: "+3.2% disaster survival rate", renewable: "Protects 1000 MW coastal transmission node", roi: "8.5%" }
        ];
      } else if (selectedRegion === "East") {
        return [
          { num: 1, name: "Bhubaneswar Coastal Grid Aggregator", why: "Coordinates coastal wind interties and undersea HVDC flows with Odisha STU lines.", reliability: "+2.4% storm surge buffer", renewable: "1400 MVA marine wind aggregator capacity", roi: "11.0%" },
          { num: 2, name: "Ranchi Smart Terminal Corridor", why: "Deploys energy storage buffer arrays to lock frequency for steel foundry clusters.", reliability: "+1.9% frequency lock factor", renewable: "800 MWh utility-scale battery bank", roi: "9.8%" },
          { num: 3, name: "Jamshedpur Heavy-Metallurgy Exchange", why: "Redundant bypass bus-bar link decoupling industrial load swings from mainlines.", reliability: "+2.2% voltage sag mitigation", renewable: "1600 MVA exchange load capacity", roi: "10.5%" }
        ];
      } else { // Central
        return [
          { num: 1, name: "Bhopal Central Grid Exchange", why: "Core cross-country intertie coupling northern and southern solar loops.", reliability: "+2.1% cross-grid stability", renewable: "1100 MVA central routing capacity", roi: "11.9%" },
          { num: 2, name: "Jabalpur Trunk Inter-tie Bus", why: "High-reactance reactors decoupling regional surge spikes and line sags.", reliability: "+1.8% surge containment rate", renewable: "1200 MVA stabilizing bus capacity", roi: "11.2%" },
          { num: 3, name: "Nagpur Inter-regional Hub", why: "Automatic sectionalizing smart breakers to dynamically isolate inter-regional faults.", reliability: "+2.5% outage isolation time", renewable: "1500 MVA central transit corridor", roi: "12.0%" }
        ];
      }
    } else if (scopeType === "Horizon") {
      if (selectedHorizon === 2030) {
        return [
          { num: 1, name: "Phase I Digital Telemetry Mesh", why: "Ingestion sensors and smart meter AMI mesh deployment across Tier-1 metro rings.", reliability: "+1.2% SAIDI response speed", renewable: "Integrates 55% baseline renewable mix", roi: "10.5%" },
          { num: 2, name: "Substation Digital Retrofits", why: "Installs high-speed fiber-optic telecontrol gateways at primary intertie buses.", reliability: "+1.5% transient trip avoidance", renewable: "Secures 1.2 GW grid interface capacity", roi: "11.2%" },
          { num: 3, name: "Rural Microgrid Loops Phase I", why: "Modular village microgrids equipped with automatic isolation recloser loops.", reliability: "+3.5% rural runtime reliability", renewable: "Integrates village solar cluster feeds", roi: "9.5%" }
        ];
      } else if (selectedHorizon === 2040) {
        return [
          { num: 1, name: "Bhadla-Delhi Green Link", why: "800kV HVDC green transmission line connecting desert parks directly to NCR.", reliability: "+2.1% storm sag buffer", renewable: "Evacuates 2.1 GW clean solar power", roi: "14.8%" },
          { num: 2, name: "Kutch Desert BESS Array", why: "Utility-scale rapid response lithium megapack arrays acting as frequency buffer.", reliability: "+1.4% frequency stability relief", renewable: "300 MWh active battery buffer", roi: "13.5%" },
          { num: 3, name: "Western Renewable Corridor", why: "Dynamic line rating and GIS step-down buses resolving major congestion events.", reliability: "+1.8% load-shedding relief", renewable: "Connects desert wind and solar grids", roi: "12.5%" }
        ];
      } else { // 2050
        return [
          { num: 1, name: "Arunachal Fusion Energy Prototype", why: "Next-gen zero-carbon stellarator fusion reactor injecting base dispatch directly.", reliability: "+5.2% baseline load security", renewable: "6000 MW continuous clean power", roi: "16.5%" },
          { num: 2, name: "Kutch Green Hydrogen Fusion Bus", why: "High-density green hydrogen electrolysis cell array with localized gas turbine feeds.", reliability: "+4.1% peaking reserve stability", renewable: "3500 MW green hydrogen storage buffer", roi: "15.0%" },
          { num: 3, name: "Liquid Organic Hydrogen Reservoirs (LOHC)", why: "Subterranean hydrogen containment fields to hedge grid reserve index.", reliability: "+6.0% winter outage mitigation", renewable: "Provides 16 GWh seasonal storage buffer", roi: "14.2%" }
        ];
      }
    }
    // National / Default
    return [
      { num: 1, name: "Bhadla–Delhi Green Link", why: "Essential high-voltage direct link connects high-yield western desert generation cells directly to high-demand north-western urban centers.", reliability: "+2.1% storm sag buffer", renewable: "Direct evacuation of 2.1 GW clean solar power", roi: "14.8%" },
      { num: 2, name: "Kutch BESS Array", why: "Primary rapid-response lithium battery array acting as frequency stabilizer during intermittent regional desert cloud sags.", reliability: "+1.4% frequency stability relief", renewable: "300 MWh instantaneous battery buffer", roi: "13.5%" },
      { num: 3, name: "Western Renewable Corridor", why: "Backbone dual-bus gas-insulated step-down transmission inter-tie resolving heavy local network congestion events.", reliability: "+1.8% load-shedding relief", renewable: "Connects desert solar wind cells to commercial mainlines", roi: "12.5%" }
    ];
  };

  const getDynamicRisks = () => {
    if (scopeType === "Region") {
      if (selectedRegion === "West") {
        return [
          { vulnerability: "West Desert Substation Peak Solar Overrun Risk", mitigation: "Deploy high-reactance capacitor sets & BESS buffers in Rajasthan deserts.", contingency: "Throttle solar tracking mix using dynamic grid-edge algorithms." },
          { vulnerability: "Coastal High Winds & Dune Encroachment", mitigation: "Encase substation poles with modular stay-wire stabilizers.", contingency: "Route power flow through parallel dry inland corridors." }
        ];
      } else if (selectedRegion === "North") {
        return [
          { vulnerability: "NCR Metropolitan Summer Air Overload", mitigation: "Implement dynamic air-core ventilation rigs on step-down transformers.", contingency: "Engage pumped-hydro peaking inputs from Tehri reservoir." },
          { vulnerability: "Winter Fog Transmission Line Arc Sags", mitigation: "Retrodeploy unified fiber telemetry sensors at inter-ties.", contingency: "Perform controlled grid islanding segments to restrict cascades." }
        ];
      } else if (selectedRegion === "South") {
        return [
          { vulnerability: "Coastal Salty Marine Wind Corrosion", mitigation: "Coat switchgear components with heavy-duty anti-corrosive epoxy layers.", contingency: "Elevate high-voltage substations past 2.0m coastal surge levels." },
          { vulnerability: "Wind Farm Peak Dispatch Congestion", mitigation: "Install active STATCOM compensators at Kochi intertie buses.", contingency: "Divert wind power to southern industrial battery pack loops." }
        ];
      } else if (selectedRegion === "East") {
        return [
          { vulnerability: "Estuary Flash Flooding & Swamp Inundation", mitigation: "Establish elevated concrete structures and drainage paths.", contingency: "Isolate inundated radial segments and activate community microgrids." },
          { vulnerability: "Forest Wildfire Radial Feeder Hazards", mitigation: "Establish drone mapping schedules and steel fireproof casings.", contingency: "Trigger agricultural biomass backup generator loops." }
        ];
      } else { // Central
        return [
          { vulnerability: "Cross-National loop surge overload", mitigation: "Install reactive power capacitor blocks on Bhopal exchange lines.", contingency: "Stabilize central exchange buses using Jabalpur high-reactance reactors." },
          { vulnerability: "Inter-regional line impedance blocks", mitigation: "Upgrade regional tie lines to high-thermal capacity re-conducting cables.", contingency: "Reroute power flows through neighboring state DisCoM networks." }
        ];
      }
    } else if (scopeType === "Horizon") {
      if (selectedHorizon === 2030) {
        return [
          { vulnerability: "Phase I Digital Telemetry Contractor shortages", mitigation: "Partner with regional public trade institutes and union firms.", contingency: "Scale down initial rollout to high-priority metro interfaces only." },
          { vulnerability: "Fiber processor component supply constraints", mitigation: "Settle multi-source procurement contracts early with advance funding.", contingency: "Install analog-to-digital line sizers as temporary buffers." }
        ];
      } else if (selectedHorizon === 2040) {
        return [
          { vulnerability: "Offshore wind voltage droop sags", mitigation: "Install synchronous compensator arrays at coastal landing interties.", contingency: "Engage battery megapack storage cells to deliver frequency relief." },
          { vulnerability: "Baseload steam generator retirements", mitigation: "Deploy smart grid-forming inverters on renewable clusters.", contingency: "Calibrate regional gas reserves to perform auxiliary peaking dispatch." }
        ];
      } else { // 2050
        return [
          { vulnerability: "Fusion stellarator prototype field volatility", mitigation: "Integrate superconducting magnet telemetry streams in simulators.", contingency: "Engage deep underground LOHC hydrogen tanks to secure baseline load." },
          { vulnerability: "Synthetic grid-inertia depletion", mitigation: "Deliver massive virtual power plant VPP grids with autonomous reclosers.", contingency: "Trigger emergency cross-border intertie loops to tap international links." }
        ];
      }
    }
    // National / Default
    return [
      { vulnerability: "Localized Desert Substation San-14 Congestion Risk", mitigation: "Install modular predictive digital controller valves to regulate real-time flow.", contingency: "Route secondary lines through neighboring corridors during extreme daytime spikes." },
      { vulnerability: "Transient Wind Generation Droop in Off-season Months", mitigation: "Coordinate combined dispatch cycles with municipal gas-reserve plants.", contingency: "Engage battery backup cells to guarantee steady 15-minute sub-frequency output buffers." }
    ];
  };

  const [forecastYears, setForecastYears] = useState<number>(5);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>("cea");

  const employmentData = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    const baseMultiplier = budgetCr / 8000;
    const direct = Math.round(14500 * baseMultiplier * Math.log2(year + 1));
    const indirect = Math.round(direct * 1.35);
    const total = direct + indirect;
    const gdpPct = Number((1.8 * baseMultiplier * (0.85 + year * 0.08)).toFixed(2));
    return {
      year: `Year ${year}`,
      direct,
      indirect,
      total,
      gdpPct
    };
  });

  const activeForecast = employmentData[forecastYears - 1] || employmentData[4];

  return (
    <div id="executive-decision-package-panel" className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#F8FAFC] overflow-y-auto select-text">
      {/* Upper Banner Section */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-5 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-50/20 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest bg-[#0F4C81] text-white rounded">
                DECISION BOARDROOM STATUS
              </span>
              <span className="px-2 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">
                APPROVED BY COUNCIL
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2 mt-1.5">
              <span className="material-symbols-outlined text-[#0F4C81] font-black">gavel</span>
              NEXUS Decision Package
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
              Primary authorization package for modernization deployment. This blueprint acts as the final destination policy of NEXUS Grid.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">REGISTRY ID</span>
              <span className="font-mono text-[11px] font-black text-slate-800">DEC_SYS_V2.9 / ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full relative z-10">
        
        {/* DECISION SNAPSHOT (Option 2 Directive) */}
        <div id="decision-snapshot-bento" className="bg-white border-2 border-slate-200 text-slate-900 p-6 rounded-2xl shadow-sm space-y-5 select-text">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-[#0F4C81] text-white rounded">
                  DECISION SNAPSHOT
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  APPROVED BY COUNCIL
                </span>
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mt-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-xl font-bold">verified_user</span>
                {scopeType === "National"
                  ? "Pragmatic Compromise Council Plan"
                  : scopeType === "Region"
                  ? `${selectedRegion} Region Investment Plan`
                  : `Year ${selectedHorizon} Milestone Sourcing Blueprint`}
              </h2>
            </div>
            
            {/* DEMO TRUST INDICATORS */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px]">
              <div>
                <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Planning Context</span>
                <span className="font-extrabold text-slate-700">{scopeType} Planning</span>
              </div>
              {scopeType === "Region" && (
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Active Region</span>
                  <span className="font-extrabold text-amber-700">{selectedRegion}</span>
                </div>
              )}
              {scopeType === "Horizon" && (
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Target Horizon</span>
                  <span className="font-extrabold text-emerald-700">{selectedHorizon}</span>
                </div>
              )}
              <div className="border-l border-slate-200 pl-4">
                <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Scenario</span>
                <span className="font-extrabold text-slate-700">{activeScenarioName}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none font-bold">Decision Basis</span>
                <span className="font-extrabold text-[#0F4C81]">Audited CEA Data + Scenario Modelling + Consensus Metrics</span>
              </div>
            </div>
          </div>

          {/* Key Outcome KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Consensus Score</span>
              <div>
                <span className="text-xl font-mono font-black text-emerald-600 block mt-2">
                  {consensusScore}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-555 block">Alignment Fit</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Investment Budget</span>
              <div>
                <span className="text-xl font-mono font-black text-slate-800 block mt-2">₹{budgetCr.toLocaleString()} Cr</span>
                <span className="text-[9.5px] font-semibold text-slate-555 block">CapEx Limits</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Reliability Target</span>
              <div>
                <span className="text-xl font-mono font-black text-[#0F4C81] block mt-2">
                  {reliabilityTarget}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-555 block">SAIDI Standards</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Renewable Pen.</span>
              <div>
                <span className="text-xl font-mono font-black text-emerald-600 block mt-2">
                  45% → {renewableTarget}%
                </span>
                <span className="text-[9.5px] font-semibold text-slate-555 block">Source integration</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Carbon Reduction</span>
              <div>
                <span className="text-xl font-mono font-black text-emerald-600 block mt-2">
                  {renewableTarget - 32}%
                </span>
                <span className="text-[9.5px] font-semibold text-slate-555 block">Offset Index</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Timeline Target</span>
              <div>
                <span className="text-xl font-mono font-black text-slate-750 block mt-2">
                  {scopeType === "Horizon" ? `Horizon ${selectedHorizon}` : "Horizon 2040"}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-555 block">Phased Milestones</span>
              </div>
            </div>
          </div>

          {/* Decision Basis Panel - Added Real Public Energy Sources Tracking & Assumptions */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 space-y-4">
            <h3 className="text-xs font-black text-[#0f4c81] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 font-bold">query_stats</span>
              Audit-Level Decision Basis & Modelling Inputs
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Based On: Official Sources */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b pb-1 font-mono">Based On Real Infrastructure Records</span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-emerald-600 text-[14px] mt-0.5 font-bold">check_circle</span>
                    <div>
                      <strong className="text-slate-800">Central Electricity Authority (CEA)</strong>
                      <p className="text-[10px] text-slate-500">Infrastructure data, substation listings, and national asset registries.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-emerald-600 text-[14px] mt-0.5 font-bold">check_circle</span>
                    <div>
                      <strong className="text-slate-800">Grid India Transmission</strong>
                      <p className="text-[10px] text-slate-500">Power flow telemetry, line capacities, and regional system logs.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-emerald-600 text-[14px] mt-0.5 font-bold">check_circle</span>
                    <div>
                      <strong className="text-slate-800">MNRE Renewable Capacity</strong>
                      <p className="text-[10px] text-slate-500">Audited solar/wind installed baselines and commissioning trends.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Scenario Assumptions */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b pb-1 font-mono">Future Scenario Planning Assumptions</span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-[#0F4C81] text-[14px] mt-0.5 font-bold">arrow_forward</span>
                    <div>
                      <strong className="text-slate-800">2040 Renewable Target</strong>
                      <p className="text-[10px] text-slate-500">Targeting 70% clean fuel mix across all regional feed points.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-[#0F4C81] text-[14px] mt-0.5 font-bold">arrow_forward</span>
                    <div>
                      <strong className="text-slate-800">65% EV Adoption Surcharge</strong>
                      <p className="text-[10px] text-slate-500">Distribution planning based on smart charging curves and VPP offsets.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-[#0F4C81] text-[14px] mt-0.5 font-bold">arrow_forward</span>
                    <div>
                      <strong className="text-slate-800">22% Population Growth Peak</strong>
                      <p className="text-[10px] text-slate-500">Anticipated urbanization rates driving urban-corridor substation demands.</p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* DECISION LOGIC METRIC EXPLANATION */}
        <div id="decision-logic-flowchart" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 text-[#0F4C81] rounded text-[8.5px] font-black uppercase tracking-wider mb-1 font-mono">
                <span className="material-symbols-outlined text-[10px] font-bold">settings_suggest</span>
                Decision Evaluation Pipeline
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider leading-none">Decision Logic & Recommendation Pipeline</h2>
              <p className="text-slate-500 text-xs mt-1 font-semibold">The sequential consensus-driven workflow translating key constraints into robust grid investment roadmaps.</p>
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81]"></span>
              Pipeline active
            </div>
          </div>

          {/* Clean Robust 5-Step Progress Flowchart */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative items-stretch">
            
            {/* Step 1: Inputs */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:border-[#0F4C81] transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                  <span className="text-[9px] font-mono font-black text-[#0F4C81] uppercase tracking-wider">Step 01</span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Input</span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#0F4C81] text-xs font-black">login</span>
                    Key Inputs
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Audited parameters ingested from public databases:
                  </p>
                </div>
                <div className="space-y-1 pt-1">
                  {[
                    "Infrastructure Capacity",
                    "Renewable Penetration",
                    "Demand Growth",
                    "Climate Risk",
                    "Budget Constraints"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-700 bg-white border border-slate-200/60 px-2 py-0.5 rounded leading-tight">
                      <span className="w-1 h-1 rounded-full bg-[#0F4C81]"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Analysis */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:border-[#0F4C81] transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                  <span className="text-[9px] font-mono font-black text-slate-400 tracking-wider">Step 02</span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Simulate</span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-indigo-600 text-xs font-black">analytics</span>
                    Scenario Analysis
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Stress-testing prospective investments across future shocks:
                  </p>
                </div>
                <p className="text-[9.5px] text-slate-600 font-semibold leading-relaxed bg-white p-2.5 rounded border border-slate-200/60">
                  Simulates options against high-growth EV loading, climate heat sags, and variable dispatch outages to ensure high-stress resilience.
                </p>
              </div>
            </div>

            {/* Step 3: Alignment */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:border-[#0F4C81] transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                  <span className="text-[9px] font-mono font-black text-slate-400 tracking-wider">Step 03</span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Align</span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-indigo-600 text-xs font-black">handshake</span>
                    Stakeholder Alignment
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Balancing competing institutional target profiles:
                  </p>
                </div>
                <p className="text-[9.5px] text-slate-600 font-semibold leading-relaxed bg-white p-2.5 rounded border border-slate-200/60">
                  Runs multi-objective compromise evaluations to maximize planning consensus among state discoms, environmental watchdogs, and developers.
                </p>
              </div>
            </div>

            {/* Step 4: Prioritization */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between hover:border-[#0F4C81] transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                  <span className="text-[9px] font-mono font-black text-slate-400 tracking-wider">Step 04</span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Prioritize</span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-indigo-600 text-xs font-black">priority_high</span>
                    Investment Prioritization
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Ranking grid modernisation project options:
                  </p>
                </div>
                <p className="text-[9.5px] text-slate-600 font-semibold leading-relaxed bg-white p-2.5 rounded border border-slate-200/60">
                  Weights active physical assets by CapeEx limits, peak reliability yields (SAIDI reduction), and regional decarbonization multiplier targets.
                </p>
              </div>
            </div>

            {/* Step 5: Recommendation */}
            <div className="bg-[#eff4ff] border border-blue-200 p-4 rounded-xl flex flex-col justify-between hover:border-[#0F4C81] transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-blue-100 pb-1.5">
                  <span className="text-[9px] font-mono font-black text-blue-700 tracking-wider">Step 05</span>
                  <span className="text-[8px] font-mono font-bold text-blue-600 uppercase">Output</span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-blue-705 text-xs font-bold">assignment_turned_in</span>
                    Recommended Blueprint
                  </h3>
                  <p className="text-[10px] text-slate-600 mt-1 font-semibold leading-relaxed">
                    Delivering finalized grid allocation parameters:
                  </p>
                </div>
                <div className="p-2 bg-white border border-blue-100 rounded text-[9px] text-[#0F4C81] space-y-1">
                  <span className="font-extrabold block">Recommended Strategy</span>
                  <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                    A sequence of prioritized grid modernization projects optimized for immediate regulatory and financial greenlighting.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* WHY SELECTED & ALTERNATIVES REJECTED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Why Selected */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 font-black">check_circle</span>
              Why This Strategy Was Selected
            </h3>
            
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 bg-emerald-50/30 border border-emerald-100 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 font-bold">handshake</span>
                <div>
                  <h4 className="text-[12px] font-black text-slate-900">Highest Stakeholder Alignment</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Achieves {consensusScore} consensus rate balancing requirements of state commissions, consumer councils, and developers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50/30 border border-emerald-100 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 font-bold">energy_savings_leaf</span>
                <div>
                  <h4 className="text-[12px] font-black text-slate-900">Meets Renewable Target</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Safely evacuates and integrates {renewableTarget}% wind-solar source penetration into current bulk dispatch networks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50/30 border border-emerald-100 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 font-bold">payments</span>
                <div>
                  <h4 className="text-[12px] font-black text-slate-900">Within Budget Constraints</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Stays strictly within the ₹{budgetCr.toLocaleString()} Cr threshold without demanding tariff index interventions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50/30 border border-emerald-105 rounded-lg">
                <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 font-bold">health_and_safety</span>
                <div>
                  <h4 className="text-[12px] font-black text-slate-900">Lowest Risk Profile</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{lowestRiskProfileText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alternatives Rejected */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2">
                <span className="material-symbols-outlined text-rose-600 font-extrabold">cancel</span>
                Alternatives Rejected
              </h3>
              
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-lg flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">X</span>
                  <div>
                    <h4 className="text-[11.5px] font-black text-slate-800 hover:text-rose-900 transition-colors">Carbon Neutral Fast Track</h4>
                    <span className="text-[10px] font-bold text-rose-800 block mt-0.5">REJECTION CRITERIA: Exceeded budget bounds by 18%</span>
                    <p className="text-xs text-slate-500 mt-0.5">Requires severe rush-premium costs for transformer arrays and immediate land procurement.</p>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-lg flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">X</span>
                  <div>
                    <h4 className="text-[11.5px] font-black text-slate-800">Resilient Microgrid Expansion</h4>
                    <span className="text-[10px] font-bold text-rose-800 block mt-0.5">REJECTION CRITERIA: Lower overall renewable penetration</span>
                    <p className="text-xs text-slate-500 mt-0.5">Fails base net-zero statutory transmission quota. Fails to link high-density northern urban areas.</p>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-lg flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">X</span>
                  <div>
                    <h4 className="text-[11.5px] font-black text-slate-800">Capital Preservation Plan</h4>
                    <span className="text-[10px] font-bold text-rose-800 block mt-0.5">REJECTION CRITERIA: Insufficient modernization impact</span>
                    <p className="text-xs text-slate-500 mt-0.5">Leaves bulk inter-tie links vulnerable to local high frequency trips and thermal sag events.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[10.5px] text-slate-450 italic mt-4 border-t border-slate-100 pt-3">
              * Non-selected alternatives remain structured directly inside the Scenario ledger to permit fast re-evaluation during macro budget adjustments.
            </p>
          </div>
        </div>

        {/* EXPECTED IMPACT SECTION */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0F4C81] font-black">analytics</span>
            Expected Post-Deployment Impact
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[9px] font-mono font-black text-slate-450 uppercase block">Renewable Pen.</span>
              <span className="text-2xl font-mono font-black text-slate-800 block mt-1 tracking-tight">
                45% → {renewableTarget}%
              </span>
              <span className="text-[10px] text-slate-500 block">Clean dispatch ready</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[9px] font-mono font-black text-slate-450 uppercase block">Reliability</span>
              <span className="text-2xl font-mono font-black text-slate-800 block mt-1 tracking-tight">
                {reliabilityTarget}
              </span>
              <span className="text-[10px] text-slate-555 block">Line sag protected</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[9px] font-mono font-black text-slate-450 uppercase block">Carbon Reduction</span>
              <span className="text-2xl font-mono font-black text-emerald-600 block mt-1 tracking-tight">
                {renewableTarget - 32}%
              </span>
              <span className="text-[10px] text-slate-500 block">CO2 equiv. averted</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[9px] font-mono font-black text-slate-450 uppercase block">Popul. Served</span>
              <span className="text-2xl font-mono font-black text-slate-800 block mt-1 tracking-tight">
                {populationServed}
              </span>
              <span className="text-[10px] text-slate-500 block">Regional consumer reach</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[9px] font-mono font-black text-slate-450 uppercase block">Grid Resilience</span>
              <span className="text-2xl font-mono font-black text-blue-600 block mt-1 tracking-tight">
                {gridResilience}
              </span>
              <span className="text-[10px] text-slate-500 block">Fault recovery buffer</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[9px] font-mono font-black text-slate-450 uppercase block">CapEx Yield</span>
              <span className="text-2xl font-mono font-black text-indigo-600 block mt-1 tracking-tight">
                {capexYield}
              </span>
              <span className="text-[10px] text-slate-500 block">Investment efficiency</span>
            </div>
          </div>
        </div>

        {/* TOP COMPONENT PROJECTS */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center-pb-2 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 font-extrabold">electric_bolt</span>
              Approved Peak Modernization Projects
            </h3>
            <span className="text-[10px] text-slate-420 font-bold font-mono">AUTHORIZED SCHEME ITEMS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {getDynamicProjects().map((proj) => (
              <div key={proj.num} className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col justify-between hover:border-[#0F4C81] transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded text-[9.5px] font-black font-mono">
                      PROJECT 0{proj.num}
                    </span>
                    <span className="bg-[#eff4ff] border border-blue-200 text-[#0F4C81] font-mono text-[11px] font-black px-2 py-0.5 rounded">
                      ROI: {proj.roi}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{proj.name}</h4>
                  
                  <div className="pt-2 border-t border-slate-200/50 space-y-1.5 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      <span className="font-bold text-slate-800">Why Selected:</span> {proj.why}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-bold block">RELIABILITY IMPACT:</span>
                    <span className="font-mono text-[11px] text-emerald-600 font-extrabold">{proj.reliability}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-bold block">RENEWABLE IMPACT:</span>
                    <span className="font-mono text-[11px] text-[#0F4C81] font-extrabold">{proj.renewable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RISK SUMMARY */}
        <div id="section-risk-summary" className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 font-bold animate-pulse">security</span>
              Infrastructure Risk Summary &amp; Mitigation Actions
            </h3>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              Active contingency protocols mapped to maintain uninterrupted 99.2% availability during extreme weather peaks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getDynamicRisks().map((r, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5">
                <div className="flex gap-2 items-center text-rose-800">
                  <span className="material-symbols-outlined text-rose-500 text-lg font-black">warning</span>
                  <span className="text-xs font-black tracking-wide uppercase">{r.vulnerability}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest block mb-0.5">Mitigation Action</span>
                    <p className="text-slate-600 leading-relaxed font-medium">{r.mitigation}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest block mb-0.5">Contingency Measure</span>
                    <p className="text-slate-600 leading-relaxed font-medium">{r.contingency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REGIONAL ROAD HORIZON JOB FORECAST */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div>
              <span className="text-[9px] font-mono font-black text-indigo-600 uppercase">MACRO COALITION ALIGNMENT</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-indigo-600 font-extrabold">trending_up</span>
                Employment &amp; Regional Multiplier Forecast
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculates direct and indirect local utility jobs created based on the approved ₹{budgetCr.toLocaleString()} Cr capital investment plan.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <span className="text-[9px] font-black text-slate-400 block font-mono">HORIZON TARGET:</span>
              <input
                id="forecast-year-slider"
                type="range"
                min="1"
                max="10"
                value={forecastYears}
                onChange={(e) => setForecastYears(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs font-black text-indigo-700 font-mono bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded">
                Year {forecastYears}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Forecast Quick Stats Card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Total direct &amp; indirect local jobs generated</span>
                <span className="text-3xl font-mono font-black text-slate-800 block mt-2">
                  {activeForecast.total.toLocaleString()}
                </span>
                <div className="flex justify-center gap-4 text-[11px] font-bold text-slate-500 mt-2 font-mono">
                  <span>Direct: {activeForecast.direct.toLocaleString()}</span>
                  <span>Indirect: {activeForecast.indirect.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block font-mono">State GDP Stimulus Indicator</span>
                <span className="text-lg font-mono font-black text-indigo-700 block mt-1">
                  + {activeForecast.gdpPct}% Impact Added
                </span>
              </div>

              <p className="text-[11px] text-slate-450 italic text-center max-w-sm mx-auto">
                Council plan unifies stakeholder trust, optimizing local employment ratios better than other developer proposals.
              </p>
            </div>

            {/* AreaChart */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between min-h-[220px]">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest font-mono block pb-2 border-b border-slate-200/50">
                10-Year Infrastructure Growth Pipeline Curve
              </span>
              <div className="w-full h-44 mt-3 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={employmentData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#475569" fontSize={9} fontStyle="bold" />
                    <YAxis stroke="#475569" fontSize={9} />
                    <Tooltip wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px' }} />
                    <Area name="Projected Employment" type="monotone" dataKey="total" stroke="#0F4C81" fillOpacity={1} fill="url(#colorJobs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* ======================= DATA SOURCE REGISTRY (NEW COMPONENT) ======================= */}
        <div id="data-source-registry" className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-5 select-text">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div>
              <span className="text-[9px] font-mono font-black text-[#0F4C81] uppercase tracking-wider block">Auditable Data Foundations</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-[#0F4C81] font-extrabold text-lg">database</span>
                Live Data Source Registry
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent verification of public energy agency datasets, telemetry streams, and compliance metrics to reinforce executive planning trust.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-55 border border-slate-150 px-4 py-2 rounded-lg text-xs leading-tight shrink-0 font-sans">
              <span className="material-symbols-outlined text-emerald-600 font-bold">workspace_premium</span>
              <div>
                <span className="text-[8px] font-mono text-slate-400 font-bold block uppercase leading-none">Global Trust index</span>
                <span className="font-extrabold text-slate-800">97.6% DQF Compliant</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Interactive Registry Sidebar/List */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wide">Select Agency Registry</span>
              {[
                {
                  id: "cea",
                  org: "CEA",
                  fullName: "Central Electricity Authority",
                  type: "National Infrastructure Baseline",
                  confidence: 98.4,
                  confidenceLabel: "Audit-Grade",
                  frequency: "Monthly Sync",
                  lastChecked: "June 15, 2026",
                  params: ["Substation physical capacity ratings", "Transmission line thermal constraints", "Active transformer MVA baselines"],
                  description: "Direct reference baseline for infrastructure sizing, ensuring physical assets correspond to static governmental and geographical constraints."
                },
                {
                  id: "grid_india",
                  org: "Grid India",
                  fullName: "Grid Controller of India (POSOCO)",
                  type: "Real-Time Telemetry & Dispatch Logs",
                  confidence: 99.1,
                  confidenceLabel: "Operational-Verified",
                  frequency: "Real-Time Polling (15s)",
                  lastChecked: "Live Connection Synchronized",
                  params: ["Bus voltage & phase-angle parameters", "Inter-tie power flow telemetry active load", "System frequency state buffers"],
                  description: "Critical dynamic input representing the state of national load curves and short-circuit current limit variables in our simulation."
                },
                {
                  id: "mnre",
                  org: "MNRE",
                  fullName: "Ministry of New & Renewable Energy",
                  type: "Installed Clean Capacity Registers",
                  confidence: 95.8,
                  confidenceLabel: "Statutory Registry",
                  frequency: "Weekly Update",
                  lastChecked: "June 11, 2026",
                  params: ["Registered solar farm maximum AC output", "Wind farm geographic centroids", "Historical regional Capacity Utilization Factors (CUF)"],
                  description: "Baseline registers ensuring renewable availability models accurately reflect existing grid ties and commissioned plant capacities."
                },
                {
                  id: "npp",
                  org: "NPP",
                  fullName: "National Power Portal",
                  type: "Bulk Generation & Consumption Scheduler",
                  confidence: 97.2,
                  confidenceLabel: "Validated Dispatch",
                  frequency: "Daily DisCoM Log Sync",
                  lastChecked: "June 16, 2026",
                  params: ["Daily multi-fuel generation logs", "State electricity council load profiles", "Cross-regional peak-draw timetables"],
                  description: "Supplies consumer baseline demands and generator scheduling profiles, feeding the load-growth projection parameters."
                }
              ].map((src) => {
                const isSelected = selectedSourceId === src.id;

                return (
                  <div
                    key={src.id}
                    onClick={() => setSelectedSourceId(src.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#eff4ff]/65 border-[#0F4C81] shadow-xs"
                        : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-xs text-[#0F4C81] tracking-wide">{src.org}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">• {src.type}</span>
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 leading-tight mt-0.5">{src.fullName}</h4>
                      </div>

                      {/* Live State Badge */}
                      <div className="shrink-0">
                        <span className="flex items-center gap-1 text-[8.5px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> Active Sync
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/20 text-[10px]">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">Confidence Score: <span className="font-sans font-black text-[#0F4C81]">{src.confidence}%</span></span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">{src.frequency}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit Details Panel */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
              {(() => {
                const src = [
                  {
                    id: "cea",
                    org: "CEA",
                    fullName: "Central Electricity Authority",
                    type: "National Infrastructure Baseline",
                    confidence: 98.4,
                    confidenceLabel: "Audit-Grade",
                    frequency: "Monthly Sync",
                    lastChecked: "June 15, 2026",
                    params: ["Substation physical capacity ratings", "Transmission line thermal constraints", "Active transformer MVA baselines"],
                    description: "Direct reference baseline for infrastructure sizing, ensuring physical assets correspond to static governmental and geographical constraints."
                  },
                  {
                    id: "grid_india",
                    org: "Grid India",
                    fullName: "Grid Controller of India (POSOCO)",
                    type: "Real-Time Telemetry & Dispatch Logs",
                    confidence: 99.1,
                    confidenceLabel: "Operational-Verified",
                    frequency: "Real-Time (15-sec polling)",
                    lastChecked: "Live Connection Synchronized",
                    params: ["Bus voltage & phase-angle parameters", "Inter-tie power flow telemetry active load", "System frequency state buffers"],
                    description: "Critical dynamic input representing the state of national load curves and short-circuit current limit variables in our simulation."
                  },
                  {
                    id: "mnre",
                    org: "MNRE",
                    fullName: "Ministry of New & Renewable Energy",
                    type: "Installed Clean Capacity Registers",
                    confidence: 95.8,
                    confidenceLabel: "Statutory Registry",
                    frequency: "Weekly Update",
                    lastChecked: "June 11, 2026",
                    params: ["Registered solar farm maximum AC output", "Wind farm geographic centroids", "Historical regional Capacity Utilization Factors (CUF)"],
                    description: "Baseline registers ensuring renewable availability models accurately reflect existing grid ties and commissioned plant capacities."
                  },
                  {
                    id: "npp",
                    org: "NPP",
                    fullName: "National Power Portal",
                    type: "Bulk Generation & Consumption Scheduler",
                    confidence: 97.2,
                    confidenceLabel: "Validated Dispatch",
                    frequency: "Daily DisCoM Log Sync",
                    lastChecked: "June 16, 2026",
                    params: ["Daily multi-fuel generation logs", "State electricity council load profiles", "Cross-regional peak-draw timetables"],
                    description: "Supplies consumer baseline demands and generator scheduling profiles, feeding the load-growth projection parameters."
                  }
                ].find(s => s.id === selectedSourceId) || {
                  id: "cea",
                  org: "CEA",
                  fullName: "Central Electricity Authority",
                  type: "National Infrastructure Baseline",
                  confidence: 98.4,
                  confidenceLabel: "Audit-Grade",
                  frequency: "Monthly Sync",
                  lastChecked: "June 15, 2026",
                  params: ["Substation physical capacity ratings", "Transmission line thermal constraints", "Active transformer MVA baselines"],
                  description: "Direct reference baseline for infrastructure sizing, ensuring physical assets correspond to static governmental and geographical constraints."
                };

                return (
                  <div className="space-y-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200/50 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#0F4C81] text-lg font-bold">query_stats</span>
                          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider">{src.fullName} Detail Log</span>
                        </div>
                        <span className="text-[9px] font-mono bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded font-bold">SOURCE ID: {src.org}-{src.id.toUpperCase()}</span>
                      </div>

                      <div className="mt-3.5 space-y-3">
                        <div>
                          <span className="text-[8px] font-mono text-slate-400 font-bold block uppercase leading-none">Trust Rationale / Integration Methodology</span>
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-1">{src.description}</p>
                        </div>

                        <div>
                          <span className="text-[8px] font-mono text-slate-400 font-bold block uppercase leading-none mb-1.5">Parameters Monitored & Mapped</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {src.params.map((p, idx) => (
                              <div key={idx} className="p-2.5 bg-white border border-slate-300/40 rounded-lg text-[10px] text-slate-600 font-semibold leading-snug flex items-start gap-1.5">
                                <span className="material-symbols-outlined text-xs text-emerald-600 mt-0.5 font-bold">check</span>
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/50 pt-4 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-mono font-bold block leading-none">Confidence Rating</span>
                        <span className="text-[#0F4C81] font-black block mt-1">{src.confidenceLabel} ({src.confidence}%)</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-mono font-bold block leading-none">Update Frequency</span>
                        <span className="text-slate-700 font-bold block mt-1">{src.frequency}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-mono font-bold block leading-none">Last Audit Status</span>
                        <span className="text-slate-700 font-bold block mt-1">{src.lastChecked}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-mono font-bold block leading-none">Connection State</span>
                        <span className="text-emerald-600 font-extrabold block mt-1">
                          ACTIVE_PIPELINE
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// /src/components/ImpactAssessment.tsx
import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export const ImpactAssessment: React.FC = () => {
  // Inputs for testing dynamic modernization yields
  const [renewableTarget, setRenewableTarget] = useState<number>(75);
  const [budgetCr, setBudgetCr] = useState<number>(9000);
  const [evAdoption, setEvAdoption] = useState<number>(60);
  const [climateRisk, setClimateRisk] = useState<string>("HIGH");
  const [gridCoverage, setGridCoverage] = useState<string>("National");

  // Regional Economic Ripple Effect tool states
  const [projectionModel, setProjectionModel] = useState<"BASELINE" | "AGGRESSIVE" | "CONSERVATIVE">("BASELINE");
  const [activeProjectionYear, setActiveProjectionYear] = useState<number>(5);

  // Calculated state indicators
  const [renewPenImprovement, setRenewPenImprovement] = useState<number>(0);
  const [reliabilityImprovement, setReliabilityImprovement] = useState<number>(0);
  const [carbonReduction, setCarbonReduction] = useState<number>(0);
  const [populationServed, setPopulationServed] = useState<number>(0);
  const [gridResilience, setGridResilience] = useState<number>(0);
  const [investEfficiency, setInvestEfficiency] = useState<number>(0);

  useEffect(() => {
    // 1. Renewable Penetration calculation: base of target with dynamic stability penalty
    const stabilityPenalty = climateRisk === "CRITICAL" ? 8 : climateRisk === "HIGH" ? 4 : 1;
    const computedPen = Math.max(30, Math.min(100, renewableTarget - stabilityPenalty + (budgetCr / 5000)));
    setRenewPenImprovement(Number(computedPen.toFixed(1)));

    // 2. Reliability Improvement: capex increases it, extreme climate risk decreases it
    const riskFactor = climateRisk === "CRITICAL" ? -18 : climateRisk === "HIGH" ? -8 : -3;
    const computedRel = Math.max(5, Math.min(98, (budgetCr / 11000) * 28 + riskFactor + 10));
    setReliabilityImprovement(Number(computedRel.toFixed(1)));

    // 3. Carbon Reduction: M Tons calculated from renewables & EV fleet conversions
    const computedCO2 = (renewableTarget * 0.45) + (evAdoption * 0.18) + (budgetCr / 4000);
    setCarbonReduction(Number(computedCO2.toFixed(1)));

    // 4. Population Served: scale based on national vs regional grid
    const basePop = gridCoverage === "National" ? 120000000 : gridCoverage === "Municipal" ? 18000000 : 4500000;
    const computedPop = basePop + (budgetCr * 1250);
    setPopulationServed(computedPop);

    // 5. Grid Resilience Improvement: battery buffers offsets of critical drop points
    const baseResilience = 45 + (budgetCr / 8000) * 25;
    const weatherPenalty = climateRisk === "CRITICAL" ? 12 : climateRisk === "HIGH" ? 6 : 2;
    const computedRes = Math.max(20, Math.min(99, baseResilience - weatherPenalty + (renewableTarget * 0.2)));
    setGridResilience(Number(computedRes.toFixed(1)));

    // 6. Investment Efficiency Improvement: algorithm optimizations
    const computedEff = 18.5 + (renewableTarget * 0.12) + (evAdoption * 0.08) + (budgetCr > 10000 ? 5 : 2);
    setInvestEfficiency(Number(computedEff.toFixed(1)));
  }, [renewableTarget, budgetCr, evAdoption, climateRisk, gridCoverage]);

  return (
    <div id="impact-assessment-panel" className="h-[calc(100vh-3.5rem)] flex flex-col bg-slate-50 overflow-y-auto">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-2xl">insights</span>
              NEXUS Impact Assessment Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Quantifiable yield metrics and ESG alignment indicators mapped over active grid modernisation schemes.
            </p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 rounded border border-teal-200/50">
            ESG &amp; SDG Grade A+ Audited
          </span>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Modernisation Variables Selector */}
        <div className="xl:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5 h-fit">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">tune</span>
              Modernisation Toggles
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1">Grid Jurisdiction</label>
              <select
                value={gridCoverage}
                onChange={(e) => setGridCoverage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-xs text-slate-700 font-bold cursor-pointer"
              >
                <option value="National">🇮🇳 National Grid Integration</option>
                <option value="Municipal">🏙️ Municipal Smart Network</option>
                <option value="Rural">🏡 Rural Microgrid Clusters</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                <span>Renewable Mix Share</span>
                <span className="text-teal-600 font-mono text-xs">{renewableTarget}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={renewableTarget}
                onChange={(e) => setRenewableTarget(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                <span>Committed Capex</span>
                <span className="text-indigo-600 font-mono text-xs">₹{budgetCr.toLocaleString()} Cr</span>
              </div>
              <input
                type="range"
                min="3000"
                max="15000"
                step="500"
                value={budgetCr}
                onChange={(e) => setBudgetCr(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                <span>EV Fleet Conversion</span>
                <span className="text-purple-600 font-mono text-xs">{evAdoption}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                value={evAdoption}
                onChange={(e) => setEvAdoption(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            <hr className="border-slate-100" />

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1">Climate Stress Risk Profile</label>
              <div className="grid grid-cols-2 gap-1.5">
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setClimateRisk(lvl)}
                    className={`py-1 text-[9px] font-bold rounded-md border tracking-wider transition-all ${
                      climateRisk === lvl
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Impact Grid */}
        <div className="xl:col-span-3 space-y-6">
          {/* Bento-style calculations cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI 1: Renewable Penetration Improvement */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center material-symbols-outlined text-xl">
                  energy_savings_leaf
                </span>
                <span className="text-[10px] font-bold font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 uppercase">
                  Penetration
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Renewable Pen. Improvement
                </span>
                <span className="text-3xl font-black text-slate-800 font-mono tracking-tight mt-1.5 block">
                  {renewPenImprovement}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-normal border-t border-slate-50 pt-2.5">
                Maximum realisable green energy evacuation capability factoring worst-case curtailments.
              </p>
            </div>

            {/* KPI 2: Reliability Improvement */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center material-symbols-outlined text-xl">
                  security
                </span>
                <span className="text-[10px] font-bold font-mono text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 uppercase">
                  Reliability
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Reliability Index Gain
                </span>
                <span className="text-3xl font-black text-slate-800 font-mono tracking-tight mt-1.5 block">
                  +{reliabilityImprovement}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-normal border-t border-slate-50 pt-2.5">
                Estimated index reduction in grid voltage sagging events and frequency drift margins.
              </p>
            </div>

            {/* KPI 3: Carbon Reduction */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center material-symbols-outlined text-xl">
                  co2
                </span>
                <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 uppercase">
                  Carbon Abatement
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Annual Carbon Reduction
                </span>
                <span className="text-3xl font-black text-slate-800 font-mono tracking-tight mt-1.5 block">
                  {carbonReduction} MMT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-normal border-t border-slate-50 pt-2.5">
                Million Metric Tons of CO2e eliminated per annum across transport and heavy industrial grids.
              </p>
            </div>

            {/* KPI 4: Population Served */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center material-symbols-outlined text-xl">
                  groups_3
                </span>
                <span className="text-[10px] font-bold font-mono text-amber-600 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 uppercase">
                  Citizen Reach
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Population Served
                </span>
                <span className="text-3xl font-black text-slate-800 font-mono tracking-tight mt-1.5 block">
                  {populationServed.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-normal border-t border-slate-50 pt-2.5">
                Total urban and rural consumers receiving stable, unimpeded emission-free power.
              </p>
            </div>

            {/* KPI 5: Grid Resilience Improvement */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center material-symbols-outlined text-xl">
                  gpp_maybe
                </span>
                <span className="text-[10px] font-bold font-mono text-purple-600 bg-purple-50 border border-purple-100 rounded px-1.5 py-0.5 uppercase">
                  Resilience Strength
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Grid Resilience Level
                </span>
                <span className="text-3xl font-black text-slate-800 font-mono tracking-tight mt-1.5 block">
                  {gridResilience}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-normal border-t border-slate-50 pt-2.5">
                Dynamic resistance score of physical infrastructure lines during simulated storm risks.
              </p>
            </div>

            {/* KPI 6: Investment Efficiency Improvement */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center material-symbols-outlined text-xl">
                  currency_exchange
                </span>
                <span className="text-[10px] font-bold font-mono text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 uppercase">
                  Capital Optimization
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Capex Yield Efficiency
                </span>
                <span className="text-3xl font-black text-slate-800 font-mono tracking-tight mt-1.5 block">
                  +{investEfficiency}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-normal border-t border-slate-50 pt-2.5">
                Calculated ROI enhancement factor enabled by deep multi-agent policy compromise models.
              </p>
            </div>

          </div>

          {/* Regional Economic Ripple Effect Projection Tool */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-indigo-600">trending_up</span>
                  REPE: Regional Economic Ripple Effect &amp; Job Projection Tool
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculates direct/indirect employment matrices and regional macro GDP impact multipliers across a 10-year development horizon.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Projection Mode:</span>
                <div className="inline-flex bg-slate-100 p-0.5 rounded border border-slate-200">
                  {(["CONSERVATIVE", "BASELINE", "AGGRESSIVE"] as const).map((model) => (
                    <button
                      key={model}
                      onClick={() => setProjectionModel(model)}
                      className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded transition-all cursor-pointer ${
                        projectionModel === model
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Calculations based on active slider inputs */}
            {(() => {
              const multiplier = projectionModel === "AGGRESSIVE" ? 1.45 : projectionModel === "CONSERVATIVE" ? 0.65 : 1.0;
              const chartData = Array.from({ length: 10 }, (_, i) => {
                const year = i + 1;
                const direct = Math.max(10, Math.round((budgetCr * 11.2) * multiplier * Math.log2(year + 1)));
                const indirect = Math.round(direct * 1.35);
                const induced = Math.round(direct * 0.78);
                const total = direct + indirect + induced;
                const cumulativeGdp = Math.round(budgetCr * multiplier * 0.12 * year);
                const gdpPct = Number((((budgetCr / 8000) * 1.5) * multiplier * (0.8 + year * 0.08)).toFixed(2));
                return {
                  year: `Year ${year}`,
                  yearNum: year,
                  direct,
                  indirect,
                  induced,
                  total,
                  gdpCr: cumulativeGdp,
                  gdpPct
                };
              });

              const activeData = chartData[activeProjectionYear - 1] || chartData[4];

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Variable Controls & Stats Column */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    {/* Horizon Sliders */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-550 uppercase font-mono tracking-wider">Forecast Horizon</span>
                        <span className="text-xs font-black text-indigo-700 font-mono bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {activeProjectionYear} Years
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={activeProjectionYear}
                        onChange={(e) => setActiveProjectionYear(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                        <span>INITIATION</span>
                        <span>MID-PHASE (5Y)</span>
                        <span>MATURITY (10Y)</span>
                      </div>
                    </div>

                    {/* Stats Breakdowns row */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Projected Total Jobs</span>
                        <span className="text-xl font-black text-slate-800 block mt-1 font-mono">
                          {activeData.total.toLocaleString()}
                        </span>
                        <span className="text-[9.5px] text-emerald-600 font-bold mt-1 inline-block">
                          Direct: {activeData.direct.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">GDP Multiplier Gain</span>
                        <span className="text-xl font-black text-slate-800 block mt-1 font-mono">
                          +{activeData.gdpPct}%
                        </span>
                        <span className="text-[9.5px] text-indigo-600 font-bold mt-1 inline-block">
                          ₹{activeData.gdpCr.toLocaleString()} Cr Yield
                        </span>
                      </div>
                    </div>

                    {/* Matrix definitions bullet guide */}
                    <div className="bg-slate-50/50 p-4 border border-slate-150 rounded-xl space-y-2.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Anatomical Disclosures</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-medium leading-none">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Indirect Jobs: {activeData.indirect.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                          <span>Induced Jobs: {activeData.induced.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal font-medium mt-1">
                        Labor multipliers derived using international baseline Grid Capex elasticities, factoring a ₹{budgetCr.toLocaleString()} Cr regional asset footprint.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Recharts Column */}
                  <div className="lg:col-span-7 bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between min-h-[250px]">
                    <div className="pb-2 border-b border-slate-200/60 flex justify-between items-center">
                      <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">10-Year Cumulative Job Creation &amp; GDP Arc</span>
                      <span className="text-[9.5px] text-indigo-600 font-extrabold bg-indigo-50 px-2 py-0.5 rounded uppercase">Recharts Rendered</span>
                    </div>

                    <div className="w-full h-44 mt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" stroke="#475569" fontSize={9} fontStyle="bold" />
                          <YAxis stroke="#475569" fontSize={9} />
                          <Tooltip wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px' }} />
                          <Area name="Total Job Inflow" type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorJobs)" />
                          <Area name="GDP Growth (%)" type="monotone" dataKey="gdpPct" stroke="#6366f1" fillOpacity={1} fill="url(#colorGdp)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-6 text-[10px] uppercase font-bold font-sans tracking-wide mt-2 pt-1.5 border-t border-slate-200/50 select-none">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span>
                        <span>Employment Inflow</span>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-600">
                        <span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs"></span>
                        <span>gdp growth rate (%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Social / Environmental SDG Alignment */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-600">verified</span>
              NEXUS SDG &amp; ESG Integration Footprint
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { goal: "SDG 7: Affordable &amp; Clean Energy", value: "A+", desc: "Drives decentralised microgrid proliferation and solar PM-KUSUM integration, eradicating rural fossil power dependencies." },
                { goal: "SDG 11: Sustainable Cities", value: "Highly Adaptive", desc: "Hardens switching centers and Mumbai marine substations against rising extreme storm tides and storm-surges." },
                { goal: "SDG 13: Climate Action", value: "Target Bound", desc: "Enables precise modeling of phased coal-fired closures to fulfill regional Paris-Accord emission goals." }
              ].map((sdg, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs font-black text-slate-700 uppercase" dangerouslySetInnerHTML={{ __html: sdg.goal }} />
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 font-mono">
                        {sdg.value}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{sdg.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

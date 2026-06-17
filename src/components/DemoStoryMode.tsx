// /src/components/DemoStoryMode.tsx
import React, { useState } from "react";

interface StoryStep {
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
  icon: string;
  badge: string;
  responsePreview: string;
  logs: string[];
}

export const DemoStoryMode: React.FC<{ onNavigate: (view: any) => void }> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const [completeSteps, setCompleteSteps] = useState<number[]>([]);

  const steps: StoryStep[] = [
    {
      title: "Step 1: Load India 2040 Renewable Transition",
      subtitle: "Initializing Regional Baseline State",
      description: "Initialize the digital twin parameters to simulate regional Indian grid modernization models. Loads active solar coordinates, consumer nodes, and transmission grids.",
      actionText: "Load Baseline Model",
      icon: "cloud_download",
      badge: "GRID DATA HUB & DIGITAL TWIN",
      responsePreview: "✔ India National Grid loaded. 75 active power nodes, 3,241 transformers monitored. Baseline emissions tracked at 214 MMT CO2/yr.",
      logs: [
        "Initializing NEXUS Grid ingestion pipelines...",
        "Tracing Mumbai-Ahmedabad 765kV High Voltage Backbone...",
        "Ingested baseline 2026-06-17 generation: 45.2% coal, 28.1% solar, 18.2% wind.",
        "Regional baseline initialized for 2040 target scenario."
      ]
    },
    {
      title: "Step 2: Run Future Shock Analysis",
      subtitle: "Injecting Worst-Case Extreme Weather Scenarios",
      description: "Simulate extreme weather events or massive overload conditions. We inject a Level-5 Super Cyclone at the western shoreline paired with high EV charging concurrency.",
      actionText: "Inject Climate Shock",
      icon: "bolt",
      badge: "SCENARIO ENGINE & CRISIS LAB",
      responsePreview: "⚡ ALERT: Shoreline transformer voltage sags by -22.4%. High Risk of cascade outage on Northwest Inter-tie. Vulnerability index critical.",
      logs: [
        "Scenario Engine active: Western Super-Cyclone injected.",
        "Thermal circuit capacity thresholds exceeded at S-14 substations.",
        "Modeling dynamic loads: EV charging peaks coinciding at 18:00 (60% EV penetration).",
        "Vulnerability signature mapped: Primary grid-tie failure probable without capex intervention."
      ]
    },
    {
      title: "Step 3: Launch Planning Council",
      subtitle: "Deploying Multi-Role Planning Delegates",
      description: "Assemble the council of domain specific virtual representatives to discover compromise candidates. Government and Environmental regulators propose diverging goals.",
      actionText: "Convene Planning Council",
      icon: "groups_3",
      badge: "PLANNING COUNCIL",
      responsePreview: "ℹ 5 board delegates convened. Initial compromise feasibility: 44.5% (High conflict detected on industrial limits & capex funding).",
      logs: [
        "Invoking Government Delegate: Mandates ₹10,000 Cr strict budget limit.",
        "Invoking Environmental Delegate: Requests 80% mandatory solar push.",
        "Invoking Security Dispatch Delegate: Prioritizing primary voltage stability indexes.",
        "Divergency mapping: Environmental policy conflicts with available Capex ceiling."
      ]
    },
    {
      title: "Step 4: Generate Consensus",
      subtitle: "Resolving Conflicts via Automated Policy Compromise",
      description: "Execute the coalition solver algorithm. Multi-agent negotiation loops run to generate the optimal compromise that fits budget constraints without sacrificing safety.",
      actionText: "Resolve Policy Gridlock",
      icon: "handshake",
      badge: "CONSENSUS ENGINE",
      responsePreview: "✔ Consensus Solved. Optimized compromise score: 88.5%. Budget allocated: ₹9,000 Cr. Solar blend negotiated at 75%.",
      logs: [
        "Starting negotiation rounds on budget restrictions...",
        "Environmental Agent traded 5% solar blend for grid hardening credits.",
        "Operator approved vehicle-to-grid demand response curtailments.",
        "Perfect Pareto boundary intersection achieved under 60 seconds."
      ]
    },
    {
      title: "Step 5: Generate Investment Portfolio",
      subtitle: "Allocating Capex Dollars to High-Impact Assets",
      description: "Optimize the allocation of ₹9,000 Crore across prioritized, storm-proof modernisation projects using dynamic payback metrics.",
      actionText: "Prioritize Capex Budget",
      icon: "payments",
      badge: "INVESTMENT PRIORITIZATION",
      responsePreview: "✔ Capex fully committed. Substation Retrofits (₹485M), Offshore HVDC Link (₹1.2B) and Pacific storage hub (₹850M) prioritized.",
      logs: [
        "Analyzing 18 proposed grid modernization bids.",
        "Running marginal utility prioritization solver...",
        "Filtered high ROI candidates. Cost of Inaction minimized by 42%.",
        "Investment allocation package sealed and finalized."
      ]
    },
    {
      title: "Step 6: Generate Modernization Roadmap",
      subtitle: "Structuring Timeline Milestones & Phase Dependencies",
      description: "Structure dependency hierarchies to sequence the construction phases safely over the timeline (Phase 1: Hardening, Phase 2: Transmission, Phase 3: Edge).",
      actionText: "Sequence Phase Roadmap",
      icon: "route",
      badge: "ROADMAP GENERATOR",
      responsePreview: "✔ 3-Phase Roadmap generated. Substation retrofits scheduled for 2030; Marine link for 2035; V2G retail arrays for 2040.",
      logs: [
        "Evaluating sequencing constraint: Phase 1 must complete before Phase 2 load shifts.",
        "Applying construction resource availability indexes...",
        "Timeline finalized: 2030, 2035 & 2040 milestones committed to ledger.",
        "Audit signature verified."
      ]
    },
    {
      title: "Step 7: Run Decision Traceability",
      subtitle: "Providing Fully Explainable Logic Auditing Traces",
      description: "Examine detailed reasoning traces, trade-offs, and critical warnings for the entire modernizing decision path.",
      actionText: "Audit Decision Trace",
      icon: "troubleshoot",
      badge: "DECISION TRACEABILITY ENGINE",
      responsePreview: "✔ Logic trace report generated. Explanation packages synced. Model confidence: 91.5%. Auditable Pareto evidence logged.",
      logs: [
        "Compiling multi-role reasoning steps...",
        "Generating Pros & Cons matrix for board review...",
        "Verification: Remaining high-heat vulnerability under check.",
        "Traceability report dispatched."
      ]
    },
    {
      title: "Step 8: Display Final Impact Assessment",
      subtitle: "Verifying Modernization Yields",
      description: "Complete the pipeline! View final simulated ESG, carbon abatement, and grid resilience improvement percentages for Board approval.",
      actionText: "Launch Final Assessment Dashboard",
      icon: "insights",
      badge: "IMPACT ASSESSMENT ENGINE",
      responsePreview: "🏆 SUCCESS: Grid modernization loop completed. 138M Citizens served, 34.2 MMT annual Carbon reduction, Grid Resilience improved by +78.0%!",
      logs: [
        "Aggregating simulation yield data...",
        "Fulfilling SDG 7, 11 & 13 audit validation vectors...",
        "NEXUS Grid Boardroom decision packaged successfully.",
        "Modernization scenario fully compiled. Ready for active execution!"
      ]
    }
  ];

  const handleAction = () => {
    if (animating) return;
    setAnimating(true);
    
    // Smooth transition simulation
    setTimeout(() => {
      setAnimating(false);
      setCompleteSteps((prev) => [...prev, currentStep]);
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 1200);
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentStep(idx);
  };

  const activeStepData = steps[currentStep];

  return (
    <div id="demo-story-pane" className="h-full flex flex-col bg-[#F8FAFC] text-slate-800 overflow-y-auto">
      {/* Header with quick overview */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 text-2xl font-bold">rocket_launch</span>
              NEXUS Grid 60-Second Boardroom Pitch
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Click through the interactive workflow sequence to simulate a complete energy strategy definition loop from baseline load to final ESG yield evaluation.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-black uppercase px-2.5 py-1 rounded">
            Interactive Pitch Guide for Judges
          </div>
        </div>
      </div>

      {/* Ribbon indicator progress */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
        {steps.map((st, i) => {
          const isActive = i === currentStep;
          const isComplete = completeSteps.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleJumpToStep(i)}
              className={`flex-1 min-w-[90px] py-1 px-2 rounded text-[10px] font-bold tracking-wider transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white border-purple-500 shadow-sm font-black"
                  : isComplete
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <span>{i + 1}</span>
              {isComplete && <span className="material-symbols-outlined text-[10px] text-emerald-600 font-bold">check_circle</span>}
            </button>
          );
        })}
      </div>

      {/* Main Sandbox Section */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Playback Control Box (Left - 7 Columns) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[9px] font-mono font-black tracking-widest text-purple-700 bg-purple-50 border border-purple-200 rounded-full uppercase">
                {activeStepData.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Pitch Step {currentStep + 1} of 8
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {activeStepData.title}
              </h2>
              <p className="text-xs text-purple-700 font-bold tracking-wide uppercase">
                {activeStepData.subtitle}
              </p>
              <p className="text-slate-600 text-xs leading-relaxed max-w-2xl pt-2.5 font-medium">
                {activeStepData.description}
              </p>
            </div>

            {/* Current Pipeline Response State preview */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mt-4">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-2">
                Decision Simulation Output (Audit Ledger Records)
              </span>
              {animating ? (
                <div className="py-2.5 flex items-center gap-2 text-xs font-mono text-purple-600">
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <span>Evaluating decision engine path variables...</span>
                </div>
              ) : (
                <p className="text-xs font-mono text-emerald-800 leading-normal font-extrabold">
                  {activeStepData.responsePreview}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center gap-3 mt-6 lg:mt-0">
            <button
              onClick={handleAction}
              disabled={animating}
              className={`w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer`}
            >
              <span className="material-symbols-outlined text-sm font-bold">{activeStepData.icon}</span>
              {animating ? "Running Calculations..." : activeStepData.actionText}
            </button>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-black tracking-wider uppercase inline-block text-center cursor-pointer transition-colors"
                >
                  Back
                </button>
              )}

              {currentStep === 7 && (
                <button
                  onClick={() => onNavigate("Impact Assessment")}
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">insights</span>
                  Open Impact Assessment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Sandbox Terminal Outputs (Right - 5 Columns) */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[350px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                System Logs Core Console
              </span>
              <span className="text-[9px] font-mono text-purple-600 font-extrabold uppercase tracking-widest">
                Port 3000 Active
              </span>
            </div>

            {/* Simulated Live Output Console Logs */}
            <div className="space-y-2.5 font-mono text-[11px] leading-relaxed select-text h-[250px] overflow-y-auto">
              <p className="text-slate-500">✔ [SYSTEM] WebServer initialized successfully.</p>
              <p className="text-slate-500">✔ [SYSTEM] Connected to local PostgreSQL DB via Drizzle ORM.</p>
              
              {/* Dynamic incremental step-dependent logs */}
              {activeStepData.logs.map((log, lidx) => (
                <p key={lidx} className="text-purple-700 font-semibold animate-fade-in pl-1">
                  &gt; {log}
                </p>
              ))}

              {animating && (
                <p className="text-emerald-700 font-extrabold animate-pulse pl-1">
                  ⚡ [SOLVER] Executing optimal trade-off computations in real-time...
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 font-mono font-bold">
              NEXUS Boardroom Simulator Pipeline v2.9
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

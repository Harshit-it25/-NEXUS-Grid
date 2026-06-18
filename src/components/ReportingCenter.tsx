import React, { useState } from "react";
import { INITIAL_REPORT_TEMPLATES, INITIAL_GENERATED_REPORTS, INITIAL_QUEUE_ITEMS } from "../data";
import { ReportTemplate, GeneratedReport, QueueItem } from "../types";
import { usePlanningScope } from "../PlanningScopeContext";

export const ReportingCenter: React.FC = () => {
  const {
    scopeType,
    selectedRegion,
    selectedHorizon,
    renewableTarget,
    activeScenarioName,
    evAdoption,
    consensusScore,
  } = usePlanningScope();

  const [templates] = useState<ReportTemplate[]>(INITIAL_REPORT_TEMPLATES);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(INITIAL_GENERATED_REPORTS);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE_ITEMS);

  // Status flags for visual highlights
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Briefing State
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);

  const generateAiBriefing = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/generate-narrative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region: scopeType === "Region" ? selectedRegion : undefined,
          horizon: scopeType === "Horizon" ? selectedHorizon : undefined,
          evAdoption,
          renewableTarget,
          consensusScore,
        }),
      });
      const data = await response.json();
      if (data && data.narrative) {
        setAiBriefing(data.narrative);
        setIsAiGenerated(!!data.isAiGenerated);
        setToastMessage(data.isAiGenerated ? "AI Briefing synthesized successfully!" : "Static preview briefing generated.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error("Failed to generate AI briefing:", error);
      setToastMessage("Failed to connect to AI briefing server.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateReport = (temp: ReportTemplate) => {
    setGeneratingId(temp.id);
    
    // Simulate generation sequence
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: `rep-${Date.now()}`,
        name: `${temp.title.replace(/\s+/g, "_")}_Forecast_${new Date().getFullYear()}.pdf`,
        format: "pdf",
        generatedOn: new Date().toISOString().replace("T", " ").substring(0, 16),
        owner: "System Admin"
      };

      setGeneratedReports([newReport, ...generatedReports]);
      setGeneratingId(null);
      
      // Toast message
      setToastMessage(`Generated draft PDF report for ${temp.title}!`);
      setTimeout(() => setToastMessage(null), 3000);

      // increment processing items
      setQueue((prevQueue) =>
        prevQueue.map((item) => {
          if (item.name === "Horizon 2030 Synthesis") {
            return { ...item, progress: 100, status: "completed", remaining: "0s" };
          }
          return item;
        })
      );
    }, 1500);
  };

  const handleDownload = (name: string) => {
    setToastMessage(`Downloading ${name} to your local workspace...`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex-1 overflow-hidden h-[calc(100vh-3.5rem)] flex bg-[#F8FAFC] text-[#0F172A] select-text border-t border-[#E2E8F0]">
      
      {/* Templates Work area (Center-Left) */}
      <section className="flex-1 overflow-y-auto p-6 relative border-r border-[#E2E8F0]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#0c1a30_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Header Title */}
        <header className="mb-6 relative z-10">
          <h1 className="text-3xl font-black text-[#0F172A] leading-tight">Reporting Center</h1>
          <p className="text-slate-500 text-xs mt-1">Compile and index strategic summaries, regulatory drafts, and regional asset degradation matrices.</p>
        </header>

        {/* Interactive Toast alert banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-[380px] bg-white border border-emerald-200 text-emerald-800 p-3 px-4 rounded-lg shadow-xl z-50 flex items-center gap-2.5 text-xs transition-all leading-tight">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <span className="font-semibold text-slate-800">{toastMessage}</span>
          </div>
        )}

        {/* AI Briefing Generator Card */}
        <div className="relative z-10 mb-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-indigo-500/25">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-indigo-300 border border-indigo-400/20">
                <span className="material-symbols-outlined font-bold text-xl">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-indigo-200">AI Boardroom Executive Briefing</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">Generate real-time compliance summaries using the active scope and target variables.</p>
              </div>
            </div>
            
            <button
              onClick={generateAiBriefing}
              disabled={isAiLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 shadow-md border border-indigo-400/30"
            >
              <span className="material-symbols-outlined text-xs animate-pulse">auto_awesome</span>
              {isAiLoading ? "Synthesizing Summary..." : "Generate AI Briefing"}
            </button>
          </div>

          {isAiLoading ? (
            <div className="bg-slate-950/40 border border-indigo-500/15 rounded-lg p-4 flex flex-col gap-2 animate-pulse">
              <div className="h-3 bg-indigo-500/20 rounded w-3/4"></div>
              <div className="h-3 bg-indigo-500/20 rounded w-5/6"></div>
              <div className="h-3 bg-indigo-500/20 rounded w-1/2"></div>
            </div>
          ) : aiBriefing ? (
            <div className="bg-slate-950/50 border border-indigo-500/20 rounded-lg p-4 relative overflow-hidden transition-all duration-300">
              <div className="absolute top-2 right-2 flex gap-1.5">
                <span className={`px-2 py-0.5 text-[8px] font-black tracking-widest rounded-full uppercase font-mono ${
                  isAiGenerated ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {isAiGenerated ? "✨ Gemini AI Generated" : "📋 Policy-Rule Fallback"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-100 italic pr-20">
                "{aiBriefing}"
              </p>
              <div className="mt-3.5 pt-2.5 border-t border-indigo-500/10 flex justify-between items-center text-[9px] text-slate-400">
                <span className="font-mono">Active Scenario: {activeScenarioName}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiBriefing || "");
                    setToastMessage("Briefing copied to clipboard!");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="hover:text-white transition-colors uppercase font-bold tracking-wider cursor-pointer"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-indigo-500/20 rounded-lg p-6 text-center text-xs text-slate-400">
              No briefing generated yet. Click "Generate AI Briefing" to synthesize a real-time compliance summary.
            </div>
          )}
        </div>

        {/* Templates selector group */}
        <div className="relative z-10 mb-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 mb-3.5 font-mono">Strategic Templates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((temp) => {
              const isCompiling = generatingId === temp.id;
              return (
                <div 
                  key={temp.id} 
                  className="bg-white border border-[#E2E8F0] p-4 rounded-lg flex flex-col justify-between shadow-xs hover:border-[#0F4C81] transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex-shrink-0 flex items-center justify-center text-[#0F4C81]">
                      <span className="material-symbols-outlined font-bold text-xl">{temp.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-extrabold text-[#0F172A]">{temp.title}</span>
                        <span className="text-[8px] font-mono text-slate-500 bg-slate-100 px-1 py-0.5 rounded font-black">{temp.revision}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{temp.description}</p>
                    </div>
                  </div>

                  {/* Actions & Tags lines */}
                  <div className="flex justify-between items-end mt-4 pt-3.5 border-t border-slate-100">
                    <div className="flex gap-1.5 flex-wrap">
                      {temp.tags.map(t => (
                        <span key={t} className="text-[8px] font-bold text-slate-455 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">{t}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleGenerateReport(temp)}
                      disabled={isCompiling || generatingId !== null}
                      className="px-3.5 py-1.5 bg-[#0F4C81] hover:bg-[#2563EB] text-white text-[9px] font-bold uppercase tracking-wider rounded transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-xs">{isCompiling ? "refresh" : "article_shortcut"}</span>
                      {isCompiling ? "Compiling..." : "Generate PDF"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance & Export Parameters Audit Card */}
        <div className="relative z-10 mb-6 bg-amber-50/60 border border-amber-200 rounded-xl p-5 select-none text-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-amber-700 font-bold">verified</span>
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider font-mono">Export Compliance Standards</h3>
          </div>
          <p className="text-[11px] text-amber-800 leading-normal mb-4 font-semibold">
            To ensure highest empirical authenticity, every exported PDF or CSV report generated by NEXUS Grid auto-appends a structured **Planning Audit Appendix** containing the following real-world disclosures:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            
            <div className="bg-white p-3.5 rounded-lg border border-amber-200/65 shadow-xs">
              <span className="text-[8px] font-mono text-amber-800 font-bold uppercase tracking-widest block mb-1">1. Data Sources Used</span>
              <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                Central Electricity Authority (CEA), Grid India POSOCO registers, and MNRE reports.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200/65 shadow-xs">
              <span className="text-[8px] font-mono text-amber-800 font-bold uppercase tracking-widest block mb-1">2. Planning Assumptions</span>
              <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                Horizon 2030-2050 peak capacity, EV fleet curves, and dynamic VPP aggregations.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200/65 shadow-xs">
              <span className="text-[8px] font-mono text-amber-800 font-bold uppercase tracking-widest block mb-1">3. Scenario Inputs</span>
              <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                Adjusted carbon offsets, fossil fuel retirements, and regional load levels.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200/65 shadow-xs">
              <span className="text-[8px] font-mono text-amber-800 font-bold uppercase tracking-widest block mb-1">4. Confidence Statement</span>
              <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                Evaluated against the DQF with a 94.8% confidence statement based on verified telemetry.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-amber-200/65 shadow-xs">
              <span className="text-[8px] font-mono text-amber-800 font-bold uppercase tracking-widest block mb-1">5. Limitations</span>
              <p className="text-[10px] text-zinc-600 leading-relaxed font-semibold">
                Excludes non-modelable geological anomalies and force majeure grid disruptions.
              </p>
            </div>

          </div>
        </div>

        {/* Recently Generated Index logs table */}
        <div className="relative z-10 bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Recently Generated Report Logs</h3>
            <span className="text-[9px] font-mono font-bold text-slate-400">INDEX SEED LIVE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-widest text-[#475569] border-b border-[#E2E8F0]">
                  <th className="p-3.5">Document File Name</th>
                  <th className="p-3.5">Format</th>
                  <th className="p-3.5">Compiled Date</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {generatedReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                      {rep.name}
                    </td>
                    <td className="p-3.5 font-mono text-[10px] uppercase text-slate-500">{rep.format}</td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-500">{rep.generatedOn}</td>
                    <td className="p-3.5 text-slate-600 font-medium">{rep.owner}</td>
                    <td className="p-3.5 text-right">
                      <button 
                        onClick={() => handleDownload(rep.name)}
                        className="text-[#0F4C81] hover:underline font-bold text-[10px] tracking-widest uppercase cursor-pointer"
                      >
                        DOWNLOAD
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* Rendering Queue Sidebar (Right Panel Column) */}
      <aside className="w-[360px] bg-slate-50 flex flex-col z-20">
        
        {/* Panel Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white">
          <h3 className="text-xs font-black uppercase text-[#0F172A]">Scheduled Queue</h3>
          <p className="text-[10px] text-slate-500 mt-1">Background rendering nodes processing high-resolution simulations.</p>
        </div>

        {/* Queue Items list flow */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          <div className="space-y-3 select-text">
            {queue.map((item) => (
              <div key={item.id} className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs text-xs space-y-2">
                <div className="flex justify-between items-start leading-none">
                  <div>
                    <p className="font-extrabold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">{item.type}</p>
                  </div>
                  <span className={`font-mono text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                    item.status === "processing"
                      ? "bg-sky-50 text-sky-600 border border-sky-100 animate-pulse"
                      : item.status === "completed"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-slate-100 text-slate-500"
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Progress bar container */}
                {item.status !== "queued" && (
                  <div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono mb-1">
                      <span>Completed</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          item.status === "completed" ? "bg-emerald-500" : "bg-[#0F4C81]"
                        }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] font-mono text-slate-400 mt-1">Remaining: {item.remaining}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Footer queue stats */}
        <div className="p-4 bg-white border-t border-[#E2E8F0] text-center">
          <p className="text-[10px] text-slate-400">All draft assets auto-save to cloud repository every 15 minutes.</p>
        </div>
      </aside>

    </div>
  );
};

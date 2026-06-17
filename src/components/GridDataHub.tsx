import React, { useState, useEffect } from "react";
import { INITIAL_DATA_SOURCES, INITIAL_SYNC_ACTIVITIES } from "../data";
import { DataHubSource, SyncActivityItem } from "../types";

export const GridDataHub: React.FC = () => {
  const [sources, setSources] = useState<DataHubSource[]>(INITIAL_DATA_SOURCES);
  const [activities, setActivities] = useState<SyncActivityItem[]>(INITIAL_SYNC_ACTIVITIES);
  
  // Modal for new connection
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [newSourceName, setNewSourceName] = useState<string>("");
  const [newSourceType, setNewSourceType] = useState<string>("JSON Endpoint");
  const [newSourceCoverage, setNewSourceCoverage] = useState<string>("Regional");
  const [newSourceIntegration, setNewSourceIntegration] = useState<string>("S3 Bucket");

  // Re-retry state
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Filter state for data sources
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CONNECTED" | "POLLING" | "MAINTENANCE">("ALL");

  // Fluctuating metric simulation to bring the dashboard to life
  const [nodesCount, setNodesCount] = useState<number>(422);
  const [avgLatency, setAvgLatency] = useState<number>(8.1);
  const [uptime, setUptime] = useState<number>(99.98);

  useEffect(() => {
    const timer = setInterval(() => {
      // randomly adjust slightly
      setNodesCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
      setAvgLatency((prev) => Math.max(2.1, Number((prev + (Math.random() - 0.5) * 0.4).toFixed(1))));
      setUptime((prev) => Math.min(100, Math.max(99.90, Number((prev + (Math.random() - 0.5) * 0.01).toFixed(2)))));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRetryConnection = (activityId: string) => {
    setRetryingId(activityId);
    
    // Simulate reconnecting
    setTimeout(() => {
      // Find the activity item and make it look active then completed
      setActivities((prev) =>
        prev.map((act) => {
          if (act.id === activityId) {
            return {
              ...act,
              status: "completed",
              description: "Handshake completed successfully with IPCC v4 endpoint.",
            };
          }
          return act;
        })
      );
      
      // Update the sources mapping: let's put Climate Models into connected!
      setSources((prev) =>
        prev.map((src) => {
          if (src.name === "Climate Models") {
            return {
              ...src,
              status: "CONNECTED",
              health: 98.0,
              lastSync: "Last Sync: Just Now",
            };
          }
          return src;
        })
      );
      setRetryingId(null);
    }, 1500);
  };

  const handleAddNewSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;

    const newSource: DataHubSource = {
      id: `src-${Date.now()}`,
      name: newSourceName,
      type: newSourceType,
      health: 100.0,
      freshness: "1m Refresh",
      isLive: true,
      coverage: newSourceCoverage,
      integration: newSourceIntegration,
      status: "CONNECTED",
      lastSync: "Last Sync: Just Now",
      actionText: "API Docs",
    };

    setSources([newSource, ...sources]);
    
    // add activity feed
    const newActivity: SyncActivityItem = {
      id: `act-${Date.now()}`,
      name: `${newSourceName} Linked`,
      time: "NOW",
      description: `Established high-frequency secure pipeline for '${newSourceName}'.`,
      status: "completed",
    };
    setActivities([newActivity, ...activities]);

    setNewSourceName("");
    setIsOpenModal(false);
  };

  const handleDeleteSource = (id: string, name: string) => {
    if (confirm(`Are you sure you want to disconnect ${name}?`)) {
      setSources(sources.filter((src) => src.id !== id));
      setActivities([
        {
          id: `act-del-${Date.now()}`,
          name: `${name} Closed`,
          time: "NOW",
          description: `Ingestion channel for ${name} has been disconnected.`,
          status: "failed",
        },
        ...activities,
      ]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-3.5rem)] bg-[#F8FAFC] text-[#0F172A] select-text p-6 border-t border-[#E2E8F0]">
      
      {/* Scope Header */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-3 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] leading-tight">Grid Data Hub</h1>
          <p className="text-slate-500 text-xs mt-1">Centralized orchestration for multi-vector enterprise energy data sources.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white hover:bg-slate-50 text-[#0F172A] text-[10px] font-bold uppercase tracking-wider pl-3.5 pr-8 py-2.5 rounded-lg flex items-center gap-1.5 border border-[#E2E8F0] shadow-xs cursor-pointer focus:outline-none appearance-none font-mono font-bold"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230f172a' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '10px'
              }}
            >
              <option value="ALL">All Sources</option>
              <option value="CONNECTED">Connected</option>
              <option value="POLLING">Polling</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <button 
            onClick={() => setIsOpenModal(true)}
            className="bg-[#0F4C81] hover:bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span> Connect Source
          </button>
        </div>
      </header>

      {/* Data Quality Framework Audit - CEA & POSOCO Registry Standard */}
      <section className="mb-6 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded text-[8.5px] font-black uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[10px] font-bold">verified_user</span>
              Data Quality Framework (DQF v2.1)
            </div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider leading-none">Public Energy Registry Quality Audit</h2>
            <p className="text-slate-500 text-xs mt-1 font-semibold">Real-world statistical ingestion metrics audited against Central Electricity Authority (CEA) standard files.</p>
          </div>
          <div className="bg-[#eff4ff] border border-[#cbdbf5] px-4 py-2.5 rounded-lg flex items-center gap-3">
            <div className="text-right">
              <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Overall DQF Score</span>
              <span className="font-mono text-2xl font-black text-[#0F4C81]">94.8%</span>
            </div>
            <span className="px-2 py-1 rounded text-[8.5px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-widest font-mono">EXCELLENT</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Coverage", score: 96, desc: "Pan-India utilities & state STU collector hubs", icon: "map" },
            { label: "Freshness", score: 91, desc: "Real-time grid telemetry paired with monthly reports", icon: "update" },
            { label: "Completeness", score: 95, desc: "No missing major regional transmission corridors", icon: "check_circle" },
            { label: "Confidence", score: 97, desc: "Sourced directly from POSOCO & MNRE registries", icon: "gavel" },
            { label: "Source Reliability", score: 95, desc: "Direct governmental and open public records", icon: "security" },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5 leading-none">
                    <span className="material-symbols-outlined text-sm text-[#0F4C81]">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="font-mono font-black text-[#0F4C81]">{item.score}%</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-1">{item.desc}</p>
              </div>
              <div className="mt-3">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F4C81] rounded-full" style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Grid Data Sources (Primary - Left Col) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.filter(src => filterStatus === "ALL" || src.status === filterStatus).map((src) => (
              <div 
                key={src.id} 
                className="bg-white border border-[#E2E8F0] p-4 rounded-lg hover:border-[#0F4C81] transition-all duration-200 relative group shadow-xs"
              >
                {/* Delete/Disconnect Button */}
                <button
                  onClick={() => handleDeleteSource(src.id, src.name)}
                  className="absolute top-2.5 right-2.5 text-slate-350 hover:text-red-600 transition-colors cursor-pointer p-1 rounded-full opacity-0 group-hover:opacity-100"
                  title="Disconnect source"
                >
                  <span className="material-symbols-outlined text-sm">link_off</span>
                </button>

                {/* Source Top Line */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-lg text-[#0F4C81]">
                      <span className="material-symbols-outlined font-bold">
                        {src.name.includes("Weather") ? "thermostat" : src.name.includes("GIS") ? "map" : src.name.includes("Climate") ? "language" : "electric_bolt"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[#0F172A] leading-tight">{src.name}</h3>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">{src.type}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                      src.status === "CONNECTED" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                        : src.status === "POLLING"
                          ? "bg-sky-50 text-[#0F4C81] border border-blue-100"
                          : "bg-amber-50 text-amber-850 border border-amber-100"
                    }`}>
                      {src.status}
                    </span>
                  </div>
                </div>

                {/* Content specs in double grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Data Health</p>
                    <p className="font-mono text-base font-black text-[#0F4C81]">{src.health}%</p>
                  </div>
                  
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Freshness</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {src.isLive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
                      <p className="font-mono text-xs font-black text-slate-700 leading-none">{src.freshness}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Coverage</p>
                    <p className="text-xs font-semibold text-slate-600">{src.coverage}</p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Integration</p>
                    <p className="text-xs font-semibold text-slate-600">{src.integration}</p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="font-mono text-slate-400">{src.lastSync}</span>
                  <button 
                    onClick={() => alert(`Connection Parameters for ${src.name}:\n\nEndpoint Type: ${src.type}\nIntegration: ${src.integration}\nRefresh Frequency: ${src.freshness}\nCoverage: ${src.coverage}\nStatus: ${src.status}`)}
                    className="text-[#0F4C81] font-bold uppercase tracking-wider hover:underline p-0.5 cursor-pointer"
                  >
                    {src.actionText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bento Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            
            {/* Total Ingest Card */}
            <div className="bg-[#0F4C81] p-4 text-white rounded-lg flex flex-col justify-between shadow-xs">
              <div>
                <p className="text-[9px] font-bold tracking-widest opacity-80 uppercase font-mono">Total Ingest (24h)</p>
                <p className="font-mono text-3xl font-black leading-tight mt-1">1.4 TB</p>
              </div>
              <div className="mt-4">
                <div className="h-1 bg-white/20 w-full rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-blue-300 w-[72%]"></div>
                </div>
                <span className="text-[9.5px] font-bold uppercase opacity-90 tracking-widest font-mono">72% Data Target Reached</span>
              </div>
            </div>

            {/* Pipeline Throughput card */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg col-span-2 shadow-xs">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Pipeline Throughput</p>
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">+12.4% vs Avg</span>
              </div>
              
              {/* Oscillating Bar Heights */}
              <div className="flex items-end gap-1.5 h-16 pt-2 select-none">
                <div className="w-full bg-[#0F4C81] h-[30%] rounded-t-sm" title="01h ago"></div>
                <div className="w-full bg-[#0F4C81] h-[45%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[35%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[60%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[80%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[70%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[90%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[100%] rounded-t-sm" title="Peak Current"></div>
                <div className="w-full bg-[#0F4C81] h-[85%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[75%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[95%] rounded-t-sm"></div>
                <div className="w-full bg-[#0F4C81] h-[80%] rounded-t-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Activities Ledger (Secondary Panel - Right Col) */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-[#E2E8F0] rounded-lg flex flex-col shadow-xs">
          {/* Header */}
          <div className="p-4 border-b border-[#E2E8F0] bg-slate-50 flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Sync Activity</h2>
            <span className="bg-blue-50 text-[#0F4C81] px-2.5 py-0.5 text-[8.5px] font-black rounded-full uppercase border border-blue-100">
              ACTIVE
            </span>
          </div>

          {/* Activity flow */}
          <div className="flex-1 p-4 space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="relative pl-6 pb-2 border-l border-slate-200 last:border-transparent">
                {/* Visual Status Node pip */}
                <div className={`absolute left-[-5.5px] top-1 w-2.5 h-2.5 rounded-full ${
                  act.status === "active" 
                    ? "bg-sky-500 ring-2 ring-blue-100 animate-pulse" 
                    : act.status === "failed" 
                      ? "bg-rose-600" 
                      : "bg-slate-300"
                }`}></div>
                
                <div className="flex flex-col">
                  <div className="flex justify-between items-start leading-none mb-1">
                    <span className={`text-xs font-bold ${act.status === "failed" ? "text-rose-600 font-extrabold" : "text-slate-800"}`}>
                      {act.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{act.description}</p>
                  
                  {/* Interactive specifics depending on state */}
                  {act.status === "active" && act.speed && (
                    <div className="mt-2 text-[9px] font-mono font-bold flex gap-3 text-[#0F4C81]">
                      <span>⚡ {act.speed}</span>
                      <span>⏱️ ETA: {act.eta}</span>
                    </div>
                  )}

                  {act.status === "failed" && (
                    <button
                      onClick={() => handleRetryConnection(act.id)}
                      disabled={retryingId === act.id}
                      className="mt-2 text-[#0F4C81] hover:underline font-bold text-[10px] tracking-wide text-left cursor-pointer uppercase flex items-center gap-1 disabled:opacity-50"
                    >
                      {retryingId === act.id ? "Connecting..." : "RETRY CONNECTION"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#E2E8F0]">
            <button 
              onClick={() => {
                const logs = [
                  `System audit log index for active pipelines:\n`,
                  `- POSOCO Real-time SCADA: Verified handshake on segment S-14A. Data completeness at 97%.`,
                  `- Bhadla Solar Zone: Inflow peak load verified (2,150 MW flow recorded).`,
                  `- IMD Weather Feeds: Climate cyclone forecasts ingested (Zephyr forecast updated).`,
                  `- Regional AMI Meters: Grid-edge smart telemetry operational.`
                ].join('\n');
                alert(logs);
              }}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] text-[10px] font-bold uppercase tracking-wider rounded transition-colors text-center cursor-pointer"
            >
              View Audit Log
            </button>
          </div>
        </div>
      </div>

      {/* Network Health Stats Overlay Section */}
      <section className="mt-6 p-6 relative bg-white rounded-lg border border-[#E2E8F0] overflow-hidden text-center shadow-xs">
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <p className="text-[10px] font-extrabold text-[#0F4C81] tracking-widest uppercase mb-1.5 font-mono">Network Health Visualization</p>
        <div className="flex flex-wrap gap-y-4 gap-x-12 justify-center py-2 relative z-10">
          <div className="flex flex-col items-center">
            <span className="font-mono text-2xl font-black text-[#0F172A]">{nodesCount}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nodes Active</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-2xl font-black text-[#0F172A]">{avgLatency}ms</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Avg Latency</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-2xl font-black text-emerald-600">{uptime}%</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Uptime</span>
          </div>
        </div>
      </section>

      {/* Connect New Source Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E2E8F0] bg-slate-55 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wide">
                <span className="material-symbols-outlined text-base text-[#0F4C81]">cloud_download</span>
                Connect Grid Data Source
              </h3>
              <button 
                onClick={() => setIsOpenModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddNewSource} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Source Name</label>
                <input 
                  type="text" 
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="e.g., Solar Terminal Ingestion"
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-transparent text-slate-900 focus:ring-1 focus:ring-[#0F4C81] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Source Type</label>
                  <select 
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-[#0F4C81]"
                  >
                    <option>SQL Endpoint</option>
                    <option>GeoServer</option>
                    <option>JSON Endpoint</option>
                    <option>Telemetry Grid Endpoint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Coverage</label>
                  <input 
                    type="text" 
                    value={newSourceCoverage}
                    onChange={(e) => setNewSourceCoverage(e.target.value)}
                    placeholder="e.g., Regional (NA)"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-transparent text-[#0F172A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Integration Endpoint</label>
                <select 
                  value={newSourceIntegration}
                  onChange={(e) => setNewSourceIntegration(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-[#0F4C81]"
                >
                  <option>Direct API</option>
                  <option>WMS/WFS</option>
                  <option>S3 Bucket</option>
                  <option>Webhook Service</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setIsOpenModal(false)}
                  className="px-3.5 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded cursor-pointer border border-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 bg-[#0F4C81] hover:bg-[#2563EB] text-white rounded font-bold cursor-pointer inline-flex items-center gap-1 shadow"
                >
                  Connect Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

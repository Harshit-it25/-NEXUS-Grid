import React from "react";
import { ActiveView } from "../types";
import { usePlanningScope, ScopeType, RegionType, HorizonType } from "../PlanningScopeContext";

interface TopbarProps {
  activeView: ActiveView;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeView,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    scopeType,
    selectedRegion,
    selectedHorizon,
    setScopeType,
    setSelectedRegion,
    setSelectedHorizon,
  } = usePlanningScope();

  // Determine placeholder based on the view
  const getSearchPlaceholder = () => {
    switch (activeView) {
      case ActiveView.GRID_DATA_HUB:
        return "Search datasets...";
      case ActiveView.SCENARIO_LABORATORY:
        return "Search scenarios...";
      case ActiveView.REPORTING_CENTER:
        return "Search grid assets...";
      case ActiveView.DIGITAL_TWIN:
      case ActiveView.INVESTMENT_PRIORITIZATION:
      case ActiveView.CRISIS_LABORATORY:
      default:
        return "Search Infrastructure...";
    }
  };

  return (
    <header 
      className="fixed top-0 right-0 left-0 h-14 pl-[240px] flex items-center justify-between px-6 z-30 bg-white border-b border-[#E2E8F0] text-[#0F172A]"
      id="nexus-global-topbar"
    >
      {/* Scope Toggles & Navigation Controls */}
      <div className="flex items-center gap-5">
        <span className="text-sm font-black text-[#0F4C81] uppercase tracking-wide">
          {activeView}
        </span>
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
        
        {/* Core Planning Context Selector */}
        <nav className="hidden sm:flex gap-4 h-full items-center text-[10px] font-bold uppercase tracking-wider">
          {(["National", "Region", "Horizon"] as const).map((scope) => {
            const isScopeActive = scopeType === scope;
            return (
              <button
                key={scope}
                id={`scope-btn-${scope.toLowerCase()}`}
                onClick={() => setScopeType(scope as ScopeType)}
                className={`py-1 px-3.5 rounded-full transition-all border text-[10px] font-extrabold ${
                  isScopeActive
                    ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                    : "text-slate-500 border-slate-200 hover:text-[#0F172A] hover:border-slate-300"
                }`}
              >
                {scope}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Secondary Selectors based on Scope Type */}
        {scopeType === "Region" && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 animate-fadeIn" id="region-secondary-selector">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Region:</span>
            {(["North", "South", "East", "West", "Central"] as RegionType[]).map((region) => {
              const isRegionActive = selectedRegion === region;
              return (
                <button
                  key={region}
                  id={`region-btn-${region.toLowerCase()}`}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                    isRegionActive
                      ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-3xs"
                      : "bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100"
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        )}

        {scopeType === "Horizon" && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 animate-fadeIn" id="horizon-secondary-selector">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Horizon Target:</span>
            {([2030, 2040, 2050] as HorizonType[]).map((horizon) => {
              const isHorizonActive = selectedHorizon === horizon;
              return (
                <button
                  key={horizon}
                  id={`horizon-btn-${horizon}`}
                  onClick={() => setSelectedHorizon(horizon)}
                  className={`px-2.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                    isHorizonActive
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-3xs"
                      : "bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100"
                  }`}
                >
                  {horizon}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action items */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-lg">search</span>
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1 text-xs rounded border border-slate-200 bg-slate-50 text-[#0F172A] focus:border-[#0F4C81] focus:bg-white outline-none transition-all w-40 sm:w-48"
            placeholder={getSearchPlaceholder()}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              id="clear-search-btn"
              className="absolute right-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Notifications */}
        <button 
          id="notification-bell-btn" 
          onClick={() => alert("Strategic Operations Notifications:\n\n- Active Alert: Cyclone Risk Elevated (West Coast)\n- Warning: Transmission Congestion (Delhi Corridor)\n- Inflow Target: Bhadla Solar Zone peak recorded.")}
          className="relative p-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-slate-500">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>

        {/* Account Profile icon */}
        <div 
          id="account-profile-btn" 
          onClick={() => alert("Logged in as Chief Architect (NEXUS Utility Systems Design Division).\nRole: System Administrator\nAccess Level: Full Read/Write Writeback Ledger Control.")}
          className="p-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#0F4C81]">account_circle</span>
        </div>
      </div>
    </header>
  );
};

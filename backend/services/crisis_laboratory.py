# /backend/services/crisis_laboratory.py
from backend.schemas.schemas import CrisisInput, CrisisResult

class CrisisSimulationService:
    @staticmethod
    def run_crisis(payload: CrisisInput) -> CrisisResult:
        # Normalize variables based on input crisis type
        c_type = payload.crisis_type.upper()
        sf = payload.severity_factor
        
        if c_type == "HEATWAVE":
            return CrisisResult(
                affected_population=int(450000 * sf),
                economic_impact_m=round(12.4 * sf, 2),
                recovery_time_days=max(1, int(3 * sf)),
                reliability_loss_percent=round(min(15.0, 3.5 * sf), 2),
                cascade_critical_nodes=["Substation Northeast Cascade (T-1)", "Grid-8 Transformer Loop"],
                mitigation_action_notes="Deploy stationary standby batteries, dispatch commercial load-shedding response squads immediately."
            )
        elif c_type == "CYCLONE":
            return CrisisResult(
                affected_population=int(850000 * sf),
                economic_impact_m=round(48.5 * sf, 2),
                recovery_time_days=max(2, int(9 * sf)),
                reliability_loss_percent=round(min(38.0, 12.5 * sf), 2),
                cascade_critical_nodes=["S-14 Transmission Tower Anchor", "Seaside Hub Connector"],
                mitigation_action_notes="Section offshore wind grids, activate rotating synchronous condensers, configure emergency bypass nodes."
            )
        elif c_type == "FLOOD":
            return CrisisResult(
                affected_population=int(300000 * sf),
                economic_impact_m=round(18.2 * sf, 2),
                recovery_time_days=max(1, int(5 * sf)),
                reliability_loss_percent=round(min(18.0, 5.2 * sf), 2),
                cascade_critical_nodes=["Lowland Substation Floor Cluster", "River Crossing Radial-9"],
                mitigation_action_notes="Shut down subterranean conduit junctions, route supply vectors to high-ground Northeast circuits."
            )
        elif c_type == "WILDFIRE":
            return CrisisResult(
                affected_population=int(120000 * sf),
                economic_impact_m=round(35.0 * sf, 2),
                recovery_time_days=max(1, int(11 * sf)),
                reliability_loss_percent=round(min(22.0, 8.4 * sf), 2),
                cascade_critical_nodes=["Cascade Forest Transmission line Section 4", "Zone C Sub-Link"],
                mitigation_action_notes="De-energize high-risk forest connectors, dispatch mobile solar power generators, isolate Cascade radial line."
            )
        else: # DEMAND_SHOCK (e.g. EV coincidence peaks or cold snap)
            return CrisisResult(
                affected_population=int(600000 * sf),
                economic_impact_m=round(6.5 * sf, 2),
                recovery_time_days=max(1, int(1 * sf)),
                reliability_loss_percent=round(min(8.0, 2.1 * sf), 2),
                cascade_critical_nodes=["Substation Cascade Valley (Zone B)", "Northeast Transmission Hub"],
                mitigation_action_notes="Trigger virtual power plants (VPPs) globally, request ratepayer consumption offset, invoke backup hydro lines."
            )
            
    # Explicit mapping as requested
    @staticmethod
    def run_heatwave(severity: float) -> CrisisResult:
        return CrisisSimulationService.run_crisis(CrisisInput(crisis_type="HEATWAVE", severity_factor=severity))
        
    @staticmethod
    def run_cyclone(severity: float) -> CrisisResult:
        return CrisisSimulationService.run_crisis(CrisisInput(crisis_type="CYCLONE", severity_factor=severity))
        
    @staticmethod
    def run_flood(severity: float) -> CrisisResult:
        return CrisisSimulationService.run_crisis(CrisisInput(crisis_type="FLOOD", severity_factor=severity))
        
    @staticmethod
    def run_wildfire(severity: float) -> CrisisResult:
        return CrisisSimulationService.run_crisis(CrisisInput(crisis_type="WILDFIRE", severity_factor=severity))
        
    @staticmethod
    def run_demand_shock(severity: float) -> CrisisResult:
        return CrisisSimulationService.run_crisis(CrisisInput(crisis_type="DEMAND_SHOCK", severity_factor=severity))
+ ""

# /backend/services/roadmap_generator.py
from backend.schemas.schemas import RoadmapInput, RoadmapOutput, RoadmapPhase

class RoadmapGeneratorService:
    @staticmethod
    def generate_roadmap(payload: RoadmapInput) -> RoadmapOutput:
        horizon = payload.planning_horizon_years
        budget = payload.roadmap_budget if hasattr(payload, "roadmap_budget") else payload.budget
        
        # Calculate capital split over standard 4 phases
        # Phase 1: Foundation (15%), Phase 2: Acceleration (30%), Phase 3: Consolidation (35%), Phase 4: Autonomy (20%)
        cap1 = round(budget * 0.15, 2)
        cap2 = round(budget * 0.30, 2)
        cap3 = round(budget * 0.35, 2)
        cap4 = round(budget * 0.20, 2)
        
        # Determine year increments
        step = max(1, horizon // 4)
        
        # Project Phase 1
        p1 = RoadmapPhase(
            phase_id=1,
            title="Foundation & Edge Ingestion",
            years=f"2026 - {2026 + step}",
            projects=["GIS Schema Overhaul", "Northeast Substation IoT Sensor Placements", "Edge Gateway Firewall Installs"],
            budget_m=cap1,
            expected_outcomes="Unified telemetry feeds across critical substations, reducing SCADA lag from 15 mins to absolute live.",
            risk_reduction_pct=14.5,
            carbon_reduction_pct=max(2.0, payload.renewable_target * 0.1)
        )
        
        # Project Phase 2
        p2 = RoadmapPhase(
            phase_id=2,
            title="Active Decarbonization & Load Balancing",
            years=f"{2027 + step} - {2026 + 2*step}",
            projects=["Cascade Valley 100MW Grid Battery", "Green Valley Wind Splicing Section", "VPP Software Deployment Phase 1"],
            budget_m=cap2,
            expected_outcomes="Double active renewable integration ceiling while buffering major morning load transients through grid-battery systems.",
            risk_reduction_pct=28.0,
            carbon_reduction_pct=max(5.0, payload.renewable_target * 0.45)
        )
        
        # Project Phase 3
        p3 = RoadmapPhase(
            phase_id=3,
            title="System Hardening & Inter-tie Transmission",
            years=f"{2027 + 2*step} - {2026 + 3*step}",
            projects=["Dual-Circuit High Voltage Line (500kv)", "Substation Floor Elevation (Coastal Clusters)", "Smart Transformer Deployment Zone B"],
            budget_m=cap3,
            expected_outcomes="Mitigate N-1 line contingency risks and raise system reliability index towards targeted goals of 99.85%.",
            risk_reduction_pct=42.5,
            carbon_reduction_pct=max(10.0, payload.renewable_target * 0.75)
        )
        
        # Project Phase 4
        p4 = RoadmapPhase(
            phase_id=4,
            title="Autonomous Load Dispatch Autopilot",
            years=f"{2027 + 3*step} - {2026 + horizon}",
            projects=["AI Power Dispatch Autopilot", "District Edge Microgrid Deployments", "Cybersecurity Mesh Complete Core"],
            budget_m=cap4,
            expected_outcomes="Failsafe self-healing grid topology configured to isolate nodes in wildfire or cyclone conditions within 60ms.",
            risk_reduction_pct=58.2,
            carbon_reduction_pct=max(15.0, payload.renewable_target * 1.0)
        )
        
        return RoadmapOutput(phases=[p1, p2, p3, p4])

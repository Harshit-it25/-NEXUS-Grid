# /backend/services/roadmap_service.py
import datetime
import uuid
from typing import List, Dict, Any, Optional
from backend.schemas.planning import (
    ModernizationRoadmap,
    RoadmapPhase,
    OperatorContext,
    ConsensusResult
)

class RoadmapService:
    @staticmethod
    def generate_roadmap(
        budget_cr: float,
        renewable_target_pct: float,
        reliability_target_pct: float,
        planning_horizon: str,
        operator_context: OperatorContext,
        consensus_result: Optional[ConsensusResult] = None
    ) -> ModernizationRoadmap:
        """
        Produce a beautifully styled, phased modernization roadmap matching budget caps and operational milestones.
        """
        # Determine schedule ratios per phase
        # Phase 1: 20%, Phase 2: 30%, Phase 3: 30%, Phase 4: 20%
        phase_shares = [0.20, 0.30, 0.30, 0.20]
        years = [(2026, 2028), (2028, 2032), (2032, 2036), (2036, 2040)]
        phase_names = [
            "Phase 1: Digital Foundation & Telemetry",
            "Phase 2: High-Voltage Transmission Hardening",
            "Phase 3: Large-Scale BESS & Distribution Edge",
            "Phase 4: Autonomous VPPs & Cross-State Interties"
        ]
        
        # Base candidate projects map per phase
        candidate_projects = {
            1: [
                "Substation SCADA Remote-Telemetry Retrofits",
                "Advanced Distribution Management System (ADMS)",
                "Smart Grid Edge Metering Rollout"
            ],
            2: [
                "Northeast Corridor 765kV Thermal Hardening",
                "Ahmedabad-Pune HVDC Transmission Bypass",
                "Substation GIS Grounding Reinforcement"
            ],
            3: [
                "Green Valley 250MWh Battery Energy Storage System (BESS)",
                "Rural Microgrid Ring-Bus Isolation Links",
                "Zone 4 Peak Shaving Substation Upgrades"
            ],
            4: [
                "Virtual Power Plant (VPP) Orchestration Hub",
                "AI-Driven Dynamic Line Rating (DLR) Framework",
                "Cross-Border High-Voltage UHV-AC Injections"
            ]
        }
        
        # Base deliverables per phase
        base_deliverables = {
            1: [
                "Deployment of SCADA sensors to 25 primary substation nodes.",
                "Completion of fiber-optic communication backup grid."
            ],
            2: [
                "Energization of 450 km high-voltage corridor routing.",
                "Reduction of West Region line thermal congestion coefficients."
            ],
            3: [
                "Commissioning of dual-cluster storage backup packs.",
                "Establishment of islanding capabilities for critical defense nodes."
            ],
            4: [
                "Integration of 1.2 GW decentralized clean energy injections.",
                "Full deployment of deep-learning grid balance algorithms."
            ]
        }
        
        phases: List[RoadmapPhase] = []
        cumulative_reliability = 0.0
        cumulative_renewable = 0.0
        cumulative_carbon = 0.0
        
        for idx in range(4):
            p_num = idx + 1
            start_yr, end_yr = years[idx]
            p_budget_cr = budget_cr * phase_shares[idx]
            
            # Outcome metrics computed based on target constraints
            rel_gain = (reliability_target_pct - 98.0) * phase_shares[idx] * (1.2 if p_num <= 2 else 0.8)
            rel_gain = max(0.2, min(5.0, rel_gain))
            
            ren_gain = (renewable_target_pct) * phase_shares[idx] * (0.6 if p_num <= 2 else 1.4)
            ren_gain = max(1.0, min(30.0, ren_gain))
            
            carb_red = ren_gain * (0.85 if p_num <= 2 else 1.1)
            risk_red = 10.0 + (p_budget_cr * 0.15) + (5.0 if p_num == 3 else 0.0)
            risk_red = min(45.0, risk_red)
            
            cumulative_reliability += rel_gain
            cumulative_renewable += ren_gain
            cumulative_carbon += carb_red
            
            phases.append(RoadmapPhase(
                phase_name=phase_names[idx],
                start_year=start_yr,
                end_year=end_yr,
                budget_cr=round(p_budget_cr, 2),
                projects=candidate_projects[p_num],
                expected_reliability_gain=round(rel_gain, 2),
                expected_renewable_gain=round(ren_gain, 2),
                expected_carbon_reduction=round(carb_red, 2),
                risk_reduction=round(risk_red, 2),
                deliverables=base_deliverables[p_num]
            ))
            
        overall_outcomes = {
            "net_reliability_uptime_gain_pct": round(cumulative_reliability, 4),
            "net_renewable_penetration_gain_pct": round(min(100.0, cumulative_renewable), 2),
            "absolute_carbon_offset_pct": round(min(100.0, cumulative_carbon), 2),
            "reconciliation_index": 88.4 if consensus_result is None else consensus_result.consensus_score,
            "horizon_span_years": 15
        }
        
        return ModernizationRoadmap(
            roadmap_id=f"map-{uuid.uuid4().hex[:8]}",
            planning_horizon=planning_horizon,
            total_budget_cr=round(budget_cr, 2),
            operator_context=operator_context,
            phases=phases,
            overall_expected_outcomes=overall_outcomes,
            generated_at=datetime.datetime.now().isoformat()
        )

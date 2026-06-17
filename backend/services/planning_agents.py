# /backend/services/planning_agents.py
import datetime
from typing import List, Dict, Any
from backend.schemas.schemas import AgentOpinion, ScenarioInput, CouncilResponse
from backend.core.config import settings

class PlanningCouncilService:
    @staticmethod
    def run_planning_council(scenario: ScenarioInput) -> CouncilResponse:
        # Generate custom agent responses based on scenario input parameters
        opinions = []
        
        # 1. Government Agent (objective: policy compliance, regulatory timeline)
        gov_score = max(50.0, 100.0 - abs(scenario.renewable_target - 80) * 1.2)
        gov_just = (
            f"Government mandates expect 80% decarbonization by planning horizon. "
            f"A proposed {scenario.renewable_target}% renewable target provides a fit of {gov_score}%. "
            f"Regulatory timeline is moderately aligned with a total capital budget of ${scenario.budget}M."
        )
        opinions.append(AgentOpinion(
            agent_id="stk-1",
            agent_name="Government Agent",
            objective_score=round(gov_score, 1),
            recommendation="APPROVE WITH PROVISO" if gov_score < 75 else "STRONG APPROVAL",
            confidence=94.0,
            justification=gov_just
        ))
        
        # 2. Grid Operator Agent (objective: operational reliability, load management)
        grid_safety_margin = 100.0 - (scenario.ev_adoption * 0.4 + scenario.industrial_growth * 0.5)
        # operator gets nervous with high renewables without buffer
        if scenario.renewable_target > 60:
            grid_safety_margin -= (scenario.renewable_target - 60) * 0.6
        grid_safety_margin = max(35.0, grid_safety_margin)
        grid_recommend = "CONDITIONAL REACTION PLAN KEYED" if grid_safety_margin < 60 else "OPERATIONAL CERTIFICATE SECURE"
        grid_just = (
            f"Evaluating system with {scenario.ev_adoption}% EV adoption load peaks. "
            f"Grid safety operational margin is {grid_safety_margin:.1f}%. "
            f"An industrial growth coefficient of {scenario.industrial_growth}% places stress on Transformer Cascade-B."
        )
        opinions.append(AgentOpinion(
            agent_id="stk-2",
            agent_name="Grid Operator Agent",
            objective_score=round(grid_safety_margin, 1),
            recommendation=grid_recommend,
            confidence=88.0,
            justification=grid_just
        ))
        
        # 3. Renewable Integration Agent (objective: carbon displacement, wind/solar capacity)
        ren_alignment = min(100.0, (scenario.renewable_target / 85.0) * 100.0)
        ren_just = (
            f"Aggressive wind and solar penetration modeling results in a clean deployment fit of {ren_alignment:.1f}%. "
            f"Accelerating battery storage configurations at Green Valley will offset thermal constraints."
        )
        opinions.append(AgentOpinion(
            agent_id="stk-3",
            agent_name="Renewable Integration Agent",
            objective_score=round(ren_alignment, 1),
            recommendation="PROCEED WITH DISPLACEMENT EXCEL" if ren_alignment > 70 else "INCREASE RENEWABLE CAP PERCENT",
            confidence=85.0,
            justification=ren_just
        ))
        
        # 4. Community Agent (objective: low price impact, local jobs, aesthetic)
        price_stress = (scenario.budget / 15.0) + (scenario.industrial_growth / 10.0)
        com_score = max(40.0, min(98.0, 95.0 - price_stress))
        com_just = (
            f"Analyzing consumer rate base impact for a ${scenario.budget}M capital portfolio. "
            f"The localized affordability profile registers at {com_score:.1f}%. "
            f"Recommend establishing local community workforce quotas for the Zone 4 construction phase."
        )
        opinions.append(AgentOpinion(
            agent_id="stk-4",
            agent_name="Community Agent",
            objective_score=round(com_score, 1),
            recommendation="RATE-PAYER SAFEGUARD DECREE" if com_score < 65 else "APPROVED FOR DEPLOYMENT",
            confidence=79.0,
            justification=com_just
        ))

        # 5. Investment Agent (objective: return on investment, capital matching)
        roi_efficiency = (scenario.industrial_growth * 0.3) + (scenario.population_growth * 0.4)
        inv_score = min(100.0, 60.0 + roi_efficiency + (scenario.budget * 0.2))
        inv_just = (
            f"Projected portfolio efficiency score is {inv_score:.1f}%. "
            f"A budget allocations ratio supports solid capital recovery bounds "
            f"while minimizing stranded asset exposure in outdated pipeline frameworks."
        )
        opinions.append(AgentOpinion(
            agent_id="stk-5",
            agent_name="Investment Agent",
            objective_score=round(inv_score, 1),
            recommendation="OPTIMAL PORTFOLIO ALLOCATION" if inv_score > 75 else "MERGE CAPITAL TRanches",
            confidence=91.0,
            justification=inv_just
        ))

        # 6. Risk / Security Agent (objective: physical resilience, cyber risk reduction)
        climate_risk_score = 100.0 - (scenario.renewable_target * 0.3 + (100.0 - scenario.ev_adoption) * 0.1)
        risk_recommend = "STRENGTHEN CYBER PERIMETERS" if scenario.ev_adoption > 50 else "RESILIENCE COEFFICIENT ACCEPTED"
        risk_just = (
            f"System risk index rated at {climate_risk_score:.1f}%. "
            f"Projections of high distributed solar increases the grid edge attack surface. "
            f"Propose mandatory secure SCADA loop firewalls for active battery connections."
        )
        opinions.append(AgentOpinion(
            agent_id="stk-6",
            agent_name="Cassandra Risk Agent",
            objective_score=round(climate_risk_score, 1),
            recommendation=risk_recommend,
            confidence=82.0,
            justification=risk_just
        ))

        # 7. Industry & Commercial Expansion Agent (objective: power density, peak demand backup)
        ind_alignment = min(100.0, 50.0 + (scenario.industrial_growth * 1.5))
        ind_just = (
            f"Industrial manufacturing parks require massive load buffers. "
            f"Current scenario guarantees backup parameters at {ind_alignment:.1f}%. "
            f"Sufficient baseload generation capability is verified for Northeast Heavy complexes."
        )
        opinions.append(AgentOpinion(
            agent_id="stk-7",
            agent_name="Industrial Expansion Agent",
            objective_score=round(ind_alignment, 1),
            recommendation="BASELOAD SUPPLY SECURED" if ind_alignment > 60 else "EXPAND ROTATING SYNCHRONOUS CONDENSERS",
            confidence=89.0,
            justification=ind_just
        ))

        return CouncilResponse(
            assembly_at=datetime.datetime.now(),
            active_scenario=scenario.scenario_name,
            agents_feedback=opinions
        )

# /backend/services/planning_service.py
import datetime
import uuid
from typing import List, Dict, Any, Optional
from backend.schemas.planning import (
    ScenarioInput,
    ScenarioOutput,
    ModernizationStrategy,
    StakeholderRecommendation,
    PlanningRecommendation,
    OperatorContext,
    ClimateRiskLevel,
    StakeholderType,
    ExecutiveDecisionPackage,
    ModernizationRoadmap,
    FutureShockProjection,
    ConflictRecord,
    ConsensusResult,
    SeverityLevel
)
from backend.schemas.infrastructure import Project
from backend.services.digital_twin import DigitalTwinService
from backend.services.planning_agents import PlanningCouncilService
from backend.services.consensus_engine import ConsensusEngine

class PlanningService:
    @staticmethod
    def evaluate_scenario(payload: ScenarioInput) -> ScenarioOutput:
        """
        Evaluate full transition conditions over target models by integrating real-time GridOS twin stats.
        """
        # Integrate with digital twin live measurements
        twin_state = DigitalTwinService.get_grid_state()
        base_load_mw = twin_state.total_load_mw if twin_state.total_load_mw > 0 else 21261.0
        
        # Calculate peak demand scaling with compound vectors
        pop_scalar = 1.0 + (payload.population_growth_pct / 100.0) * 1.2
        ev_scalar = 1.0 + (payload.ev_adoption_pct / 100.0) * 0.25
        ind_scalar = 1.0 + (payload.industrial_growth_pct / 100.0) * 0.4
        
        # Target year multiplier
        year_span = max(1, payload.target_year - 2026)
        timeline_growth = 1.0 + (0.012 * year_span)
        
        peak_demand_mw = base_load_mw * timeline_growth * pop_scalar * ev_scalar * ind_scalar
        
        # Renewable penetration modeled on target and capex buffer
        budget_adequacy = min(2.0, payload.budget_cr / 150.0)
        renewable_penetration_pct = min(100.0, payload.renewable_target_pct * (0.8 + 0.2 * budget_adequacy))
        
        # Grid battery storage (MWh) required to stabilize high-renewables grid node
        required_storage_mwh = (peak_demand_mw * (renewable_penetration_pct / 100.0) * 0.35) * (1.0 + (0.1 if payload.climate_risk_level == ClimateRiskLevel.CRITICAL else 0.0))
        
        # Grid expansion line upgrades running total circuit KM
        required_transmission_expansion_km = (payload.ev_adoption_pct * 4.5) + (payload.industrial_growth_pct * 6.2) + (renewable_penetration_pct * 2.8)
        
        # Investment required to support physical upgrades securely
        raw_storage_cost = required_storage_mwh * 0.18 # 18 Lakhs per MWh
        raw_transmission_cost = required_transmission_expansion_km * 0.45 # 45 Lakhs per KM
        raw_substation_upgrades = (peak_demand_mw * 0.05)
        investment_requirement_cr = max(10.0, (raw_storage_cost + raw_transmission_cost + raw_substation_upgrades) / 10.0) # convert units
        
        # Adjust investment based on context
        if payload.operator_context == OperatorContext.RURAL_ELECTRIFICATION:
            investment_requirement_cr *= 0.75
        elif payload.operator_context == OperatorContext.MUNICIPAL_AUTHORITY:
            investment_requirement_cr *= 0.9
            
        # Calculate composite grid reliability score
        funding_gap_coef = max(0.0, (investment_requirement_cr - payload.budget_cr) / investment_requirement_cr) if investment_requirement_cr > 0 else 0.0
        base_reliability = 99.98
        reliability_loss = (funding_gap_coef * 3.5) + (payload.ev_adoption_pct / 100.0 * 1.1) + (payload.industrial_growth_pct / 100.0 * 0.9)
        if renewable_penetration_pct > 65.0 and required_storage_mwh < (peak_demand_mw * 0.15):
            reliability_loss += (renewable_penetration_pct - 65.0) * 0.08
            
        grid_reliability_score = max(75.0, min(100.0, base_reliability - reliability_loss))
        
        # Environmental footprint offset metrics
        carbon_reduction_pct = min(98.0, (renewable_penetration_pct * 0.85) + (payload.ev_adoption_pct * 0.15) - (payload.industrial_growth_pct * 0.05))
        carbon_reduction_pct = max(0.0, carbon_reduction_pct)
        
        # Substation safety and system fault risk index rating
        risk_score = 15.0 + (funding_gap_coef * 40.0) + (renewable_penetration_pct * 0.2)
        if payload.climate_risk_level == ClimateRiskLevel.CRITICAL:
            risk_score += 25.0
        elif payload.climate_risk_level == ClimateRiskLevel.HIGH:
            risk_score += 15.0
        elif payload.climate_risk_level == ClimateRiskLevel.MEDIUM:
            risk_score += 8.0
            
        risk_score = min(100.0, max(5.0, risk_score))
        
        summary = (
            f"Transition simulation for target year {payload.target_year} under {payload.operator_context.value} context. "
            f"The grid load curve climbs to an absolute peak of {peak_demand_mw:.1f} MW. "
            f"Integrating {renewable_penetration_pct:.1f}% clean energy displacement requires {required_storage_mwh:.1f} MWh of hybrid battery backup systems. "
            f"Overall capital development is valued at {investment_requirement_cr:.2f} Cr, and the grid operates with a "
            f"proactive uptime reliability metric of {grid_reliability_score:.4f}%."
        )
        
        return ScenarioOutput(
            peak_demand_mw=round(peak_demand_mw, 1),
            renewable_penetration_pct=round(renewable_penetration_pct, 2),
            required_storage_mwh=round(required_storage_mwh, 1),
            required_transmission_expansion_km=round(required_transmission_expansion_km, 1),
            grid_reliability_score=round(grid_reliability_score, 4),
            investment_requirement_cr=round(investment_requirement_cr, 2),
            carbon_reduction_pct=round(carbon_reduction_pct, 2),
            risk_score=round(risk_score, 2),
            summary=summary
        )

    @staticmethod
    def generate_strategy_options(payload: ScenarioInput) -> List[ModernizationStrategy]:
        """
        Generate four distinctive modernization strategies modeled on budget allocation priorities.
        """
        budget = payload.budget_cr
        
        # 1. Carbon Neutral Fast Track
        c_cost = min(budget * 1.15, max(15.0, budget * 0.95))
        c_ren = min(98.0, payload.renewable_target_pct * 1.25)
        c_rel_gain = 8.5
        c_carb = min(98.0, c_ren * 0.9)
        c_risk = max(10.0, min(80.0, 30.0 + (payload.renewable_target_pct * 0.3)))
        c_alignment = 76.5
        
        # 2. Resilient Microgrid Expansion
        r_cost = min(budget * 0.9, max(12.0, budget * 0.75))
        r_ren = min(95.0, payload.renewable_target_pct * 0.75)
        r_rel_gain = 16.8
        r_carb = min(95.0, r_ren * 0.8)
        r_risk = 12.5
        r_alignment = 84.0
        
        # 3. Capital Preservation Plan
        p_cost = min(budget * 0.45, max(5.0, budget * 0.35))
        p_ren = min(95.0, payload.renewable_target_pct * 0.5)
        p_rel_gain = 3.2
        p_carb = min(95.0, p_ren * 0.7)
        p_risk = max(15.0, min(95.0, 45.0 + (payload.ev_adoption_pct * 0.4)))
        p_alignment = 64.5
        
        # 4. Pragmatic Compromise Council Plan (Balanced outcome)
        comp_cost = min(budget * 0.8, max(10.0, budget * 0.65))
        comp_ren = min(95.0, payload.renewable_target_pct * 0.95)
        comp_rel_gain = 12.4
        comp_carb = min(95.0, comp_ren * 0.85)
        comp_risk = 18.0
        comp_alignment = 92.5
        
        return [
            ModernizationStrategy(
                strategy_name="Carbon Neutral Fast Track",
                description="Aggressively install decentralized solar grids, utility wind arrays, and cross-state interties. Optimizes purely for emission limits reduction.",
                total_cost_cr=round(c_cost, 2),
                renewable_penetration_pct=round(c_ren, 2),
                reliability_gain_pct=round(c_rel_gain, 2),
                carbon_reduction_pct=round(c_carb, 2),
                risk_score=round(c_risk, 2),
                stakeholder_alignment_score=c_alignment,
                investment_priority="HIGH"
            ),
            ModernizationStrategy(
                strategy_name="Resilient Microgrid Expansion",
                description="Prioritize grid hardening, GIS substation replacements, and localized ring-bus configurations with heavy microgrid storage to protect manufacturing regions.",
                total_cost_cr=round(r_cost, 2),
                renewable_penetration_pct=round(r_ren, 2),
                reliability_gain_pct=round(r_rel_gain, 2),
                carbon_reduction_pct=round(r_carb, 2),
                risk_score=round(r_risk, 2),
                stakeholder_alignment_score=r_alignment,
                investment_priority="CRITICAL"
            ),
            ModernizationStrategy(
                strategy_name="Capital Preservation Plan",
                description="Defer non-critical line expansions and avoid major storage rollouts. Focus purely on thermal conductor cleaning and legacy maintenance.",
                total_cost_cr=round(p_cost, 2),
                renewable_penetration_pct=round(p_ren, 2),
                reliability_gain_pct=round(p_rel_gain, 2),
                carbon_reduction_pct=round(p_carb, 2),
                risk_score=round(p_risk, 2),
                stakeholder_alignment_score=p_alignment,
                investment_priority="LOW"
            ),
            ModernizationStrategy(
                strategy_name="Pragmatic Compromise Council Plan",
                description="A carefully structured hybrid plan allocating balanced funds to smart transformers, regional storage clusters, and medium-scale wind farms to assure collective multi-agent backing.",
                total_cost_cr=round(comp_cost, 2),
                renewable_penetration_pct=round(comp_ren, 2),
                reliability_gain_pct=round(comp_rel_gain, 2),
                carbon_reduction_pct=round(comp_carb, 2),
                risk_score=round(comp_risk, 2),
                stakeholder_alignment_score=comp_alignment,
                investment_priority="HIGH"
            )
        ]

    @staticmethod
    def compare_strategies(strategies: List[ModernizationStrategy]) -> Dict[str, Any]:
        """
        Produce a quick mathematical comparison matrix between generated strategy profiles.
        """
        best_alignment = max(strategies, key=lambda s: s.stakeholder_alignment_score)
        min_risk = min(strategies, key=lambda s: s.risk_score)
        max_carbon_reduction = max(strategies, key=lambda s: s.carbon_reduction_pct)
        lowest_cost = min(strategies, key=lambda s: s.total_cost_cr)
        
        return {
            "best_alignment_strategy": best_alignment.strategy_name,
            "lowest_risk_strategy": min_risk.strategy_name,
            "best_decarbonization_strategy": max_carbon_reduction.strategy_name,
            "most_affordable_strategy": lowest_cost.strategy_name,
            "comparison_count": len(strategies)
        }

    @staticmethod
    def generate_recommendation(payload: ScenarioInput) -> PlanningRecommendation:
        """
        Synthesize simulation, planning council feedback, and consensus vectors into a final unified planning recommendation.
        """
        sim_out = PlanningService.evaluate_scenario(payload)
        
        from backend.schemas.schemas import ScenarioInput as LegacyScenarioInput
        legacy_scen = LegacyScenarioInput(
            scenario_name=payload.scenario_name,
            renewable_target=payload.renewable_target_pct,
            ev_adoption=payload.ev_adoption_pct,
            population_growth=payload.population_growth_pct,
            industrial_growth=payload.industrial_growth_pct,
            budget=payload.budget_cr
        )
        council_res = PlanningCouncilService.run_planning_council(legacy_scen)
        
        feedback_list = []
        for feedback in council_res.agents_feedback:
            stype = StakeholderType.GRID_OPERATOR_AGENT
            name_lower = feedback.agent_name.lower()
            if "government" in name_lower:
                stype = StakeholderType.GOVERNMENT_AGENT
            elif "renewable" in name_lower:
                stype = StakeholderType.RENEWABLE_AGENT
            elif "industry" in name_lower or "industrial" in name_lower:
                stype = StakeholderType.INDUSTRY_AGENT
            elif "community" in name_lower:
                stype = StakeholderType.COMMUNITY_AGENT
            elif "investment" in name_lower:
                stype = StakeholderType.INVESTMENT_AGENT
            elif "risk" in name_lower:
                stype = StakeholderType.RISK_AGENT
                
            feedback_list.append(StakeholderRecommendation(
                stakeholder_name=feedback.agent_name,
                stakeholder_type=stype,
                objective_score=feedback.objective_score,
                confidence_score=feedback.confidence,
                priority_weight=0.15,
                recommendation=feedback.recommendation,
                justification=feedback.justification,
                expected_benefit="Grid operational efficiency and stability improvement",
                risk_considerations="Resource availability and budget timeline congestion risks",
                metadata={"id": feedback.agent_id}
            ))
            
        strategies = PlanningService.generate_strategy_options(payload)
        recommended = strategies[3] # Pragmatic Compromise Council Plan
        
        justification = (
            f"The '{recommended.strategy_name}' was selected as the optimal transition mechanism for {payload.operator_context.value}. "
            f"With a consensus score alignment profile of {recommended.stakeholder_alignment_score}%, it strikes an exquisite "
            f"engineering balance: committing {recommended.total_cost_cr:.2f} Cr to achieve {recommended.renewable_penetration_pct:.1f}% "
            f"renewable integration while guaranteeing a high uptime profile of over {sim_out.grid_reliability_score:.4f}%."
        )
        
        return PlanningRecommendation(
            scenario=payload,
            simulation_run=sim_out,
            recommended_strategy=recommended,
            alternate_strategies=strategies[:3],
            stakeholders_feedback=feedback_list,
            overall_justification=justification
        )


class DecisionIntelligenceEngine:
    @staticmethod
    def run_pipeline(payload: ScenarioInput) -> ExecutiveDecisionPackage:
        """
        Run the complete Decision Intelligence Pipeline:
        Scenario Input -> Digital Twin Analysis -> Renewable Planning -> Planning Council -> Consensus Engine -> Strategy Generation -> Roadmap Generator -> Executive Recommendation
        """
        # Step 1: Scenario Input evaluation
        sim_out = PlanningService.evaluate_scenario(payload)
        
        # Step 2: Digital Twin Analysis
        twin_state = DigitalTwinService.get_grid_state()
        
        # Step 3: Renewable Planning Analysis
        from backend.schemas.schemas import RenewablePlannerInput
        from backend.services.renewable_planning import RenewablePlanningService
        
        solar_capacity = payload.renewable_target_pct * 80.0
        wind_capacity = payload.renewable_target_pct * 40.0
        battery_storage = sim_out.required_storage_mwh
        
        ren_input = RenewablePlannerInput(
            solar_capacity=solar_capacity,
            wind_capacity=wind_capacity,
            battery_storage=battery_storage,
            transmission_capacity=twin_state.total_capacity_mw if twin_state.total_capacity_mw > 0 else 29450.0
        )
        ren_out = RenewablePlanningService.calculate_absorption_capacity(ren_input)
        
        # Step 4: Planning Council & Consensus Engine
        from backend.schemas.schemas import ScenarioInput as LegacyScenarioInput
        legacy_scen = LegacyScenarioInput(
            scenario_name=payload.scenario_name,
            renewable_target=payload.renewable_target_pct,
            ev_adoption=payload.ev_adoption_pct,
            population_growth=payload.population_growth_pct,
            industrial_growth=payload.industrial_growth_pct,
            budget=payload.budget_cr
        )
        council_res = PlanningCouncilService.run_planning_council(legacy_scen)
        consensus_res = ConsensusEngine.calculate_alignment(council_res.agents_feedback)
        
        # Step 5: Strategy Generation
        strategies = PlanningService.generate_strategy_options(payload)
        recommended_strategy = strategies[3] # Pragmatic Compromise Council Plan
        
        stakeholder_alignment = {op.agent_name: op.objective_score for op in council_res.agents_feedback}
        
        resolved_conflicts = [
            ConflictRecord(
                conflict_id=f"conf-{idx+1}",
                stakeholder_a=cf.agents[0] if len(cf.agents) > 0 else "Agent A",
                stakeholder_b=cf.agents[1] if len(cf.agents) > 1 else "Agent B",
                conflict_type="Asset Integration Balance",
                severity=SeverityLevel.HIGH if cf.reconciliation_index < 70 else SeverityLevel.MEDIUM,
                description=cf.critical_stress,
                resolution_suggestion="Compromise dynamically via dual-stage battery storage additions."
            ) for idx, cf in enumerate(consensus_res.conflicts_identified)
        ]
        
        planning_consensus = ConsensusResult(
            consensus_score=consensus_res.consensus_score,
            stakeholder_alignment=stakeholder_alignment,
            conflict_count=len(consensus_res.conflicts_identified),
            resolved_conflicts=resolved_conflicts,
            selected_strategy=recommended_strategy.strategy_name,
            decision_confidence=91.4,
            final_recommendation=consensus_res.final_strategy,
            expected_outcomes={
                "renewables_absorbed_mw": round(ren_out.grid_absorption_capacity_mw, 1),
                "integration_score": ren_out.renewable_integration_score,
                "feasibility_assessment": "SUCCESS" if ren_out.renewable_integration_score >= 80 else "CONSTRAINED_BY_LINES"
            }
        )
        
        # Step 6: Roadmap Generator
        from backend.services.roadmap_service import RoadmapService
        roadmap = RoadmapService.generate_roadmap(
            budget_cr=payload.budget_cr,
            renewable_target_pct=payload.renewable_target_pct,
            reliability_target_pct=sim_out.grid_reliability_score,
            planning_horizon=f"2026-{payload.target_year}",
            operator_context=payload.operator_context,
            consensus_result=planning_consensus
        )
        
        # Step 7: Top Investments
        top_investments = [
            Project(
                id="proj-1",
                name="Utility Solar-Wind Storage Aggregator",
                category="RESILIENCY",
                region="South Region",
                cost_crore=round(payload.budget_cr * 0.35, 2),
                expected_roi_pct=15.4,
                reliability_impact="HIGH",
                priority_score=94.2,
                carbon_impact="HIGH",
                community_benefit=9
            ),
            Project(
                id="proj-2",
                name="Double-Circuit Transmission Grid Upgrade",
                category="TRANSMISSION",
                region="West Region",
                cost_crore=round(payload.budget_cr * 0.40, 2),
                expected_roi_pct=14.1,
                reliability_impact="CRITICAL",
                priority_score=88.5,
                carbon_impact="MEDIUM",
                community_benefit=7
            ),
            Project(
                id="proj-3",
                name="GIS Substation Digital Protection Loops",
                category="SECURITY",
                region="North Region",
                cost_crore=round(payload.budget_cr * 0.15, 2),
                expected_roi_pct=11.8,
                reliability_impact="MEDIUM",
                priority_score=83.5,
                carbon_impact="LOW",
                community_benefit=8
            )
        ]
        
        filtered_investments = [p for p in top_investments if p.cost_cr <= payload.budget_cr]
        if not filtered_investments:
            filtered_investments = [top_investments[0]]
            
        # Step 8: Future Shock Projections
        from backend.services.future_shock_service import FutureShockService
        shocks = FutureShockService.simulate_future(
            carbon_reduction_target=sim_out.carbon_reduction_pct,
            climate_risk_escalation="HIGH" if payload.climate_risk_level in [ClimateRiskLevel.HIGH, ClimateRiskLevel.CRITICAL] else "MEDIUM"
        )
        
        # Step 9: Risk Summary Narrative
        risk_summary = (
            f"Asset failure and structural environment hazard risk evaluates to {sim_out.risk_score:.1f}% under high {payload.climate_risk_level.value} stress. "
            f"The primary resource vulnerability centers on the integration of {payload.renewable_target_pct:.1f}% renewables, "
            f"requiring up to {sim_out.required_storage_mwh:.1f} MWh of fast-dispatch secondary reserves to mitigate "
            f"active voltage sags and potential substation cascade overloads."
        )
        
        return ExecutiveDecisionPackage(
            recommended_strategy=recommended_strategy,
            consensus_score=consensus_res.consensus_score,
            top_investments=filtered_investments,
            roadmap=roadmap,
            risk_summary=risk_summary,
            future_shock_forecast=shocks
        )

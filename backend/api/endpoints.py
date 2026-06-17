# /backend/api/endpoints.py
import datetime
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any

from backend.schemas import schemas
from backend.services.digital_twin import DigitalTwinService
from backend.services.data_integration import DataIntegrationService
from backend.services.renewable_planning import RenewablePlanningService
from backend.services.scenario_simulation import ScenarioSimulationService
from backend.services.planning_agents import PlanningCouncilService
from backend.services.consensus_engine import ConsensusEngine
from backend.services.investment_planning import InvestmentPlanningService
from backend.services.crisis_laboratory import CrisisSimulationService
from backend.services.future_shock import FutureShockService
from backend.services.roadmap_generator import RoadmapGeneratorService
from backend.services.reporting_engine import ReportingEngineService

from backend.schemas.planning import (
    ScenarioInput as PlanningScenarioInput,
    ScenarioOutput as PlanningScenarioOutput,
    ModernizationStrategy,
    ModernizationRoadmap,
    RoadmapGenerationInput,
    FutureShockInput,
    FutureShockProjection,
    ExecutiveDecisionPackage,
    DecisionExplanation
)
from backend.services.planning_service import PlanningService, DecisionIntelligenceEngine
from backend.services.roadmap_service import RoadmapService as AdvancedRoadmapService
from backend.services.future_shock_service import FutureShockService as AdvancedFutureShockService
from backend.services.explainability_engine import ExplainabilityEngine

# =====================================================================
# 1. INFRASTRUCTURE ENGINE ROUTER
# =====================================================================
infrastructure_router = APIRouter(tags=["Infrastructure Engine"])

@infrastructure_router.get("/digital-twin", response_model=schemas.GridStateResponse)
def get_digital_twin_state():
    try:
        return DigitalTwinService.get_grid_state()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@infrastructure_router.post("/digital-twin/update")
def update_digital_twin_substation(payload: schemas.GridUpdatePayload):
    res = DigitalTwinService.update_grid_state(payload)
    if not res.get("success", False):
        raise HTTPException(status_code=400, detail=res.get("error", "Failed update"))
    return res

@infrastructure_router.get("/reports")
def compile_grid_reports(grid_health: float = 91.2, consensus: float = 78.5, carbon_reduction: float = 24.5):
    try:
        summary = ReportingEngineService.generate_executive_summary(grid_health, consensus, carbon_reduction)
        return {
            "summary_report": summary,
            "export_formats": ["JSON", "CSV"],
            "metadata": {
                "generated_at": str(datetime.datetime.now()),
                "owner": "Architect Lead Admin"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================================
# 2. PLANNING ENGINE ROUTER
# =====================================================================
planning_router = APIRouter(tags=["Planning Engine"])

@planning_router.post("/scenarios", response_model=schemas.ScenarioOutput)
def model_scenario_run(payload: schemas.ScenarioInput):
    try:
        return ScenarioSimulationService.run_scenario(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/renewable-planner", response_model=schemas.RenewablePlannerOutput)
def calculate_renewable_integration(payload: schemas.RenewablePlannerInput):
    try:
        return RenewablePlanningService.calculate_absorption_capacity(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/planning-council", response_model=schemas.CouncilResponse)
def evaluate_planning_council(payload: schemas.ScenarioInput):
    try:
        return PlanningCouncilService.run_planning_council(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/consensus", response_model=schemas.ConsensusOutput)
def solve_consensus(opinions: List[schemas.AgentOpinion]):
    try:
        return ConsensusEngine.calculate_alignment(opinions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/investments", response_model=schemas.InvestmentPortfolioResponse)
def prioritize_investment_cap_exp(projects: List[schemas.InvestmentProjectInput], budget: float = 50.0):
    try:
        return InvestmentPlanningService.optimize_budget(projects, budget)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/roadmap", response_model=schemas.RoadmapOutput)
def generate_modernization_roadmap(payload: schemas.RoadmapInput):
    try:
        return RoadmapGeneratorService.generate_roadmap(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/planning/analyze", response_model=PlanningScenarioOutput)
def analyze_scenario(payload: PlanningScenarioInput):
    """
    Simulate full multi-vector transition outcomes using real-time GridOS twin data.
    """
    try:
        return PlanningService.evaluate_scenario(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/planning/strategies", response_model=List[ModernizationStrategy])
def generate_strategy_alternatives(payload: PlanningScenarioInput):
    """
    Generate four distinctive modernization strategies modeled on capex priorities.
    """
    try:
        return PlanningService.generate_strategy_options(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/planning/roadmap", response_model=ModernizationRoadmap)
def compile_modernization_roadmap(payload: RoadmapGenerationInput):
    """
    Schedule phased infrastructure deployment roadmap milestones.
    """
    try:
        return AdvancedRoadmapService.generate_roadmap(
            budget_cr=payload.budget_cr,
            renewable_target_pct=payload.renewable_target_pct,
            reliability_target_pct=payload.reliability_target_pct,
            planning_horizon=payload.planning_horizon,
            operator_context=payload.operator_context,
            consensus_result=payload.consensus_result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/planning/decision-package", response_model=ExecutiveDecisionPackage)
def generate_decision_orchestration(payload: PlanningScenarioInput):
    """
    Run full Decision Intelligence Pipeline and produce Executive Modernization recommendations.
    """
    try:
        return DecisionIntelligenceEngine.run_pipeline(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@planning_router.post("/planning/explain", response_model=Dict[str, DecisionExplanation])
def get_decision_explainability(payload: PlanningScenarioInput):
    """
    Generate complete Explainable AI traces for Strategy, Investment, Consensus, Roadmap and Future Shocks.
    """
    try:
        return ExplainabilityEngine.get_full_trace_report(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================================
# 3. CRISIS SIMULATION ENGINE ROUTER
# =====================================================================
crisis_router = APIRouter(tags=["Crisis Simulation Engine"])

@crisis_router.post("/crisis", response_model=schemas.CrisisResult)
def trigger_crisis_simulation(payload: schemas.CrisisInput):
    try:
        return CrisisSimulationService.run_crisis(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@crisis_router.get("/future-shock", response_model=schemas.FutureShockOutput)
def simulate_future_shocks(carbon_reduction: float = 30.0):
    try:
        return FutureShockService.simulate_future(carbon_reduction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@crisis_router.post("/planning/future-shock", response_model=List[FutureShockProjection])
def model_energy_shocks(payload: FutureShockInput):
    """
    Forecast and simulated climate risks, line overloads and storage requirements.
    """
    try:
        return AdvancedFutureShockService.simulate_future(
            carbon_reduction_target=payload.carbon_reduction_target,
            climate_risk_escalation=payload.climate_risk_escalation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

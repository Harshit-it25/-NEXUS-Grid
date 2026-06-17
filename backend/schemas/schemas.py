# /backend/schemas/schemas.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

# Digital Twin Schemas
class SubstationState(BaseModel):
    id: str
    name: str
    region: str
    capacity_mw: float
    current_load_mw: float
    health_index: float
    failure_risk: float
    status: str

class LineState(BaseModel):
    id: str
    voltage_kv: float
    capacity_mw: float
    current_flow_mw: float
    status: str

class GridStateResponse(BaseModel):
    timestamp: datetime
    grid_health_index: float
    infrastructure_readiness_score: float
    reliability_index: float
    total_capacity_mw: float
    total_load_mw: float
    substations: List[SubstationState]
    lines: List[LineState]

class GridUpdatePayload(BaseModel):
    substation_id: str
    new_load_mw: Optional[float] = None
    health_index: Optional[float] = None
    status: Optional[str] = None

# Grid Ingestion Schemas
class IngestDataPayload(BaseModel):
    source_id: str
    gis_records: int
    utility_ping_status: str
    weather_temp_f: float
    renewable_forecast_mw: float
    population_density: float

class IngestionReport(BaseModel):
    success: bool
    source_id: str
    records_processed: int
    data_quality_score: float
    data_health_comment: str

# Renewable Schemas
class RenewablePlannerInput(BaseModel):
    solar_capacity: float = Field(..., description="Solar power planning expansion, MW")
    wind_capacity: float = Field(..., description="Wind power planning expansion, MW")
    battery_storage: float = Field(..., description="Battery system integration, MWh")
    transmission_capacity: float = Field(..., description="Maximum threshold buffer of transmission system, MW")

class RecommendedUpgrade(BaseModel):
    location: str
    upgrade_type: str
    estimated_cost_m: float
    estimated_timeline_months: int

class RenewablePlannerOutput(BaseModel):
    renewable_integration_score: float
    grid_absorption_capacity_mw: float
    constraint_locations: List[str]
    recommended_upgrades: List[RecommendedUpgrade]

# Scenario Modelling Schemas
class ScenarioInput(BaseModel):
    scenario_name: str
    ev_adoption: float = Field(..., ge=0, le=100, description="Projected EV adoption %")
    population_growth: float = Field(..., ge=-10, le=30, description="Annual population growth %")
    renewable_target: float = Field(..., ge=0, le=100, description="Targeted clean contribution %")
    industrial_growth: float = Field(..., ge=-5, le=50, description="Industrial expansion growth %")
    budget: float = Field(..., description="Approved framework capital budget in $M")

class ForecastPoint(BaseModel):
    year: int
    demand_mw: float
    renewable_mw: float

class ScenarioOutput(BaseModel):
    scenario_id: Optional[int] = None
    demand_forecast: List[ForecastPoint]
    capacity_requirements_mw: float
    investment_requirements_m: float
    reliability_impact: float
    feasibility_status: str

# Planning Council Agent Schemas
class AgentOpinion(BaseModel):
    agent_id: str
    agent_name: str
    objective_score: float
    recommendation: str
    confidence: float
    justification: str

class CouncilResponse(BaseModel):
    assembly_at: datetime
    active_scenario: str
    agents_feedback: List[AgentOpinion]

# Consensus Engine Schemas
class CompromisePlan(BaseModel):
    strategy_name: str
    implementation_year: int
    primary_vector: str
    allocated_shares: Dict[str, float]

class ConflictDescription(BaseModel):
    agents: List[str]
    critical_stress: str
    reconciliation_index: float

class ConsensusOutput(BaseModel):
    consensus_score: float
    conflict_matrix: Dict[str, Dict[str, float]]
    conflicts_identified: List[ConflictDescription]
    compromise_plan: CompromisePlan
    final_strategy: str

# Investment Schemas
class InvestmentProjectInput(BaseModel):
    id: str
    name: str
    cost: float
    reliability_impact_score: float  # 0 to 10
    renewable_capacity_mw: float
    community_benefit_rating: float  # 0 to 10
    carbon_reduction_tons: float
    risk_factors: float              # 0 to 10

class PrioritizedProjectResponse(BaseModel):
    id: str
    name: str
    priority_score: float
    expected_roi: float
    strategic_justification: str

class InvestmentPortfolioResponse(BaseModel):
    budget_limit: float
    allocated_funds: float
    estimated_system_roi: float
    ranked_projects: List[PrioritizedProjectResponse]

# Crisis Simulation Schemas
class CrisisInput(BaseModel):
    crisis_type: str # HEATWAVE, CYCLONE, FLOOD, WILDFIRE, DEMAND_SHOCK
    severity_factor: float # multiplier between 0.5 to 3.0

class CrisisResult(BaseModel):
    affected_population: int
    economic_impact_m: float
    recovery_time_days: int
    reliability_loss_percent: float
    cascade_critical_nodes: List[str]
    mitigation_action_notes: str

# Future Shock Schemas
class FutureStateProjection(BaseModel):
    year: int
    demand_growth_percent: float
    renewable_growth_percent: float
    infrastructure_stress_index: float
    climate_risk_multiplier: float
    reliability_score: float

class FutureShockOutput(BaseModel):
    timeline_projections: List[FutureStateProjection]

# Modernization Roadmap Schemas
class RoadmapInput(BaseModel):
    budget: float
    renewable_target: float
    reliability_target: float
    planning_horizon_years: int

class RoadmapPhase(BaseModel):
    phase_id: int
    title: str
    years: str
    projects: List[str]
    budget_m: float
    expected_outcomes: str
    risk_reduction_pct: float
    carbon_reduction_pct: float

class RoadmapOutput(BaseModel):
    phases: List[RoadmapPhase]

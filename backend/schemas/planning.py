# /backend/schemas/planning.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Dict, Any, List, Optional
from enum import Enum
from backend.schemas.infrastructure import Project

class OperatorContext(str, Enum):
    NATIONAL_UTILITY = "National Utility"
    MUNICIPAL_AUTHORITY = "Municipal Authority"
    RURAL_ELECTRIFICATION = "Rural Electrification"

class ClimateRiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class StakeholderType(str, Enum):
    GOVERNMENT_AGENT = "Government Agent"
    GRID_OPERATOR_AGENT = "Grid Operator Agent"
    RENEWABLE_AGENT = "Renewable Agent"
    INDUSTRY_AGENT = "Industry Agent"
    COMMUNITY_AGENT = "Community Agent"
    INVESTMENT_AGENT = "Investment Agent"
    RISK_AGENT = "Risk Agent"

class SeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ScenarioInput(BaseModel):
    """
    Model representing input parameters for a GridOS transition simulation run.
    """
    model_config = ConfigDict(from_attributes=True)
    
    scenario_name: str = Field(..., description="The unique name of the planning scenario")
    operator_context: OperatorContext = Field(..., description="The context type of the grid utility authority running the simulation")
    target_year: int = Field(..., description="The milestone timeline year of target projection")
    renewable_target_pct: float = Field(..., ge=0.0, le=100.0, description="Clean renewable generation source capacity goal percentage of load mix")
    ev_adoption_pct: float = Field(..., ge=0.0, le=100.0, description="Projected rate of transport vehicle electrification penetration")
    population_growth_pct: float = Field(..., ge=0.0, le=100.0, description="Projected rate of urbanization population growth")
    industrial_growth_pct: float = Field(..., ge=0.0, le=100.0, description="Projected heavy industry load demand increase scaling")
    budget_cr: float = Field(..., gt=0.0, description="Capex budget limit capacity expressed in Crore (Cr)")
    climate_risk_level: ClimateRiskLevel = Field(..., description="Asset environmental disaster risk profile ranking level")


class ScenarioOutput(BaseModel):
    """
    Model representing outputs from simulated scenario conditions of GridOS.
    """
    model_config = ConfigDict(from_attributes=True)
    
    peak_demand_mw: float = Field(..., description="Estimated maximum coincident load demand on grid in Megawatts")
    renewable_penetration_pct: float = Field(..., ge=0.0, le=100.0, description="Expected average clean energy generation share of overall demand")
    required_storage_mwh: float = Field(..., ge=0.0, description="Computed battery storage capacity required in MWh to prevent curtailment and sags")
    required_transmission_expansion_km: float = Field(..., ge=0.0, description="Expected physical circuit line routing distance upgrade length in km")
    grid_reliability_score: float = Field(..., ge=0.0, le=100.0, description="Normalized standard grid resilience and load stability composite uptime rating")
    investment_requirement_cr: float = Field(..., ge=0.0, description="Aggregate project cost estimate requirements in Crores (Cr) to satisfy metrics")
    carbon_reduction_pct: float = Field(..., ge=0.0, le=100.0, description="Greenhouse gas footprint offsets percentage performance gains")
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Composite system stress breakdown risk rating value index")
    summary: str = Field(..., description="Detailed textual breakdown of grid congestion metrics and simulation outcomes")


class StakeholderRecommendation(BaseModel):
    """
    Model representing subjective recommendations provided by a Cassandra grid stakeholder AI agent.
    """
    model_config = ConfigDict(from_attributes=True)
    
    stakeholder_name: str = Field(..., description="Identity label moniker of the stakeholder agent")
    stakeholder_type: StakeholderType = Field(..., description="Functional role domain index category of agent representation")
    objective_score: float = Field(..., ge=0.0, le=100.0, description="Satisfaction rate score of key objective goals (0 to 100)")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Self-evaluated certainty index of recommendation action directives")
    priority_weight: float = Field(..., ge=0.0, le=1.0, description="Normalized preference influence weight in compromise resolution (0.0 to 1.0)")
    recommendation: str = Field(..., description="Main actionable engineering planning policy directive suggested")
    justification: str = Field(..., description="Supporting technical argument defense of proposals")
    expected_benefit: str = Field(..., description="Direct functional performance grid metrics improvement expected")
    risk_considerations: str = Field(..., description="Identified negative collateral consequences or engineering failure points")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Extensible properties registry dictionary context")


class ConflictRecord(BaseModel):
    """
    Model representing high-severity policy conflicts identified between planning stakeholder agents.
    """
    model_config = ConfigDict(from_attributes=True)
    
    conflict_id: str = Field(..., description="Unique code key identifying conflict record")
    stakeholder_a: str = Field(..., description="Name of first stakeholder agent in conflict intersection")
    stakeholder_b: str = Field(..., description="Name of second stakeholder agent in conflict intersection")
    conflict_type: str = Field(..., description="Classification category label (e.g. Budget Limits, Resiliency, Carbon Goals)")
    severity: SeverityLevel = Field(..., description="Evaluated policy grid impasse severity index")
    description: str = Field(..., description="Detailed technical breakdown of policy incompatibility")
    resolution_suggestion: str = Field(..., description="Compromise resolution pathway recommendation suggested by coordination agent")


class ConsensusResult(BaseModel):
    """
    Model representing the outcome output state generated by the Cassandra Consensus Engine.
    """
    model_config = ConfigDict(from_attributes=True)
    
    consensus_score: float = Field(..., ge=0.0, le=100.0, description="Overall utility alignment success percentage coefficient")
    stakeholder_alignment: Dict[str, float] = Field(..., description="Individual subjective utility alignment levels scores map")
    conflict_count: int = Field(..., ge=0, description="Total active high-severity grid policy conflicts detected")
    resolved_conflicts: List[ConflictRecord] = Field(..., description="Indexed set of conflict issue rows addressed and resolved")
    selected_strategy: str = Field(..., description="Nominated compromise modernization strategy label signature")
    decision_confidence: float = Field(..., ge=0.0, le=100.0, description="Calculated logical confidence value index")
    final_recommendation: str = Field(..., description="Polished unified text of the final collaborative planning direction directive")
    expected_outcomes: Dict[str, Any] = Field(default_factory=dict, description="Target outcomes dashboard parameters predictions")


class ModernizationStrategy(BaseModel):
    """
    Model representing a coordinated high-level strategy choice for budget allocations.
    """
    model_config = ConfigDict(from_attributes=True)
    
    strategy_name: str = Field(..., description="Descriptive marketing/technical title of the modernization pathway")
    description: str = Field(..., description="Broad narrative description outlining key guidelines and compromise elements")
    total_cost_cr: float = Field(..., ge=0.0, description="Aggregated infrastructure deployment cost expressed in Crores")
    renewable_penetration_pct: float = Field(..., ge=0.0, le=100.0, description="Simulated final renewable percentage share of energy generation index")
    reliability_gain_pct: float = Field(..., ge=0.0, le=100.0, description="Expected margin improvement of uptime reliability parameters index")
    carbon_reduction_pct: float = Field(..., ge=0.0, le=100.0, description="Expected relative environmental metric carbon reduction index value")
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Remaining grid failure safety threat probability index rating")
    stakeholder_alignment_score: float = Field(..., ge=0.0, le=100.0, description="Composite stakeholder happiness alignment coefficient score")
    investment_priority: str = Field(..., description="Prioritization ranking class designation (e.g. HIGH, MEDIUM, LOW)")


class RoadmapPhase(BaseModel):
    """
    Model representing a timeline phase of the GridOS physical construction schedule.
    """
    model_config = ConfigDict(from_attributes=True)
    
    phase_name: str = Field(..., description="Milestone signature label classification description")
    start_year: int = Field(..., description="Active initiation sequence target calendar year")
    end_year: int = Field(..., description="Active target verification calendar year of sequence validation")
    budget_cr: float = Field(..., ge=0.0, description="Scheduled limit value of active phase capex in Crores")
    projects: List[str] = Field(..., description="String identifier list coordinates of physical projects implemented")
    expected_reliability_gain: float = Field(..., ge=0.0, le=100.0, description="Targeted grid reliability score percentage lift")
    expected_renewable_gain: float = Field(..., ge=0.0, le=100.0, description="Targeted clean renewable grid penetration metric percentage lift")
    expected_carbon_reduction: float = Field(..., ge=0.0, le=100.0, description="Targeted reduction in cumulative climate emissions percentage")
    risk_reduction: float = Field(..., ge=0.0, le=100.0, description="Expected drop rate score of baseline stability failures risk factor percent")
    deliverables: List[str] = Field(..., description="Compilation of milestones deliverables items statement list")


class ModernizationRoadmap(BaseModel):
    """
    Model representing the holistic generational roadmap output pipeline of GridOS.
    """
    model_config = ConfigDict(from_attributes=True)
    
    roadmap_id: str = Field(..., description="Trace key catalog identifier for roadmap generation audit tracking")
    planning_horizon: str = Field(..., description="The comprehensive calendar horizon covered by planning structure limits")
    total_budget_cr: float = Field(..., ge=0.0, description="Aggregated modernization budget of layout framework in Crores")
    operator_context: OperatorContext = Field(..., description="Operator context governing resource scheduling rules parameters")
    phases: List[RoadmapPhase] = Field(..., description="Milestones stages sequence path roadmap matrix segments")
    overall_expected_outcomes: Dict[str, Any] = Field(default_factory=dict, description="High-level dashboard KPIs outcome estimates mapping dictionary")
    generated_at: str = Field(..., description="Planning log session creation generation timestamp string")


class FutureShockProjection(BaseModel):
    """
    Model representing annual forecasting grid stress elements under forward projection scenarios.
    """
    model_config = ConfigDict(from_attributes=True)
    
    year: int = Field(..., description="Forward projection target model iteration year")
    peak_demand_mw: float = Field(..., ge=0.0, description="Simulated system load curve absolute concurrent peak in MW")
    renewable_penetration_pct: float = Field(..., ge=0.0, le=100.0, description="Estimated fraction share of renewable source clean energy penetration")
    climate_risk_index: float = Field(..., ge=0.0, le=100.0, description="Computed asset environment risk multiplier value index (0 to 100)")
    infrastructure_stress_index: float = Field(..., ge=0.0, le=100.0, description="Calculated composite line loading and transformer burden level index value (0 to 100)")
    reliability_score: float = Field(..., ge=0.0, le=100.0, description="Uptime grid stabilization composite reliability percentage value target index")
    recommended_actions: List[str] = Field(..., description="Automated emergency system action protocols generation logging list")


class CrisisImpactResult(BaseModel):
    """
    Model representing simulated cascade impact details of environmental and structural emergencies.
    """
    model_config = ConfigDict(from_attributes=True)
    
    scenario_name: str = Field(..., description="Target model verification scenario designation")
    affected_population: float = Field(..., ge=0.0, description="Projected consumer population experiencing supply outage limits")
    economic_loss_cr: float = Field(..., ge=0.0, description="Aggregated economic damages, business failures, and systemic losses estimation in Crores")
    recovery_time_days: float = Field(..., ge=0.0, description="Average recovery time duration requirements parameter units mapped in days")
    reliability_loss_pct: float = Field(..., ge=0.0, le=100.0, description="Drop in standard power circuit reliability metric rating percentage")
    critical_assets: List[str] = Field(..., description="Physical substation nodes or line corridor components experiencing cascade failure")
    mitigation_recommendations: List[str] = Field(..., description="Grid stabilization and blackstart restoration procedural pathways checklist")


class PlanningRecommendation(BaseModel):
    """
    Executive recommendation output of the planning service, matching decision matrices.
    """
    model_config = ConfigDict(from_attributes=True)
    
    scenario: ScenarioInput = Field(..., description="The evaluated active input scenario parameters")
    simulation_run: ScenarioOutput = Field(..., description="Calculated grid capacity and load forecasts output")
    recommended_strategy: ModernizationStrategy = Field(..., description="Automated optimized strategy recommendation for the operator context")
    alternate_strategies: List[ModernizationStrategy] = Field(..., description="A sequence list of other available modernization strategy alternatives")
    stakeholders_feedback: List[StakeholderRecommendation] = Field(..., description="Collective agent recommendation opinions generated by the council")
    overall_justification: str = Field(..., description="Detailed analytical justification outlining why the selected strategy was nominated")


class ExecutiveDecisionPackage(BaseModel):
    """
    Highly curated portfolio encapsulating target strategic grid modernizations.
    """
    model_config = ConfigDict(from_attributes=True)
    
    recommended_strategy: ModernizationStrategy = Field(..., description="The optimal strategy matching consensus guidelines")
    consensus_score: float = Field(..., description="Unified consensus score among multi-domain agents")
    top_investments: List[Project] = Field(..., description="Highly prioritized project suggestions aligning to objectives")
    roadmap: ModernizationRoadmap = Field(..., description="A phased modernization roadmap across the selected planning horizon")
    risk_summary: str = Field(..., description="Brief executive technical risk summary profile details")
    future_shock_forecast: List[FutureShockProjection] = Field(..., description="Multi-year stress levels projections scenario forecasts")


class RoadmapGenerationInput(BaseModel):
    """
    Schema for invoking roadmap phase scheduling.
    """
    budget_cr: float = Field(..., description="Total capex allocation limit in Crores")
    renewable_target_pct: float = Field(..., description="Target clean energy penetration percent")
    reliability_target_pct: float = Field(..., description="Target grid reliability uptime percentage")
    planning_horizon: str = Field(..., description="Strategic horizon window e.g. 2026-2040")
    operator_context: OperatorContext = Field(..., description="Managing authority operational framework context")
    consensus_result: Optional[ConsensusResult] = Field(None, description="Optional associated group consensus outcome results")


class FutureShockInput(BaseModel):
    """
    Schema for configuring forward energy decadal shock simulations.
    """
    carbon_reduction_target: float = Field(default=30.0, description="Carbon mitigation offset percentage target")
    climate_risk_escalation: str = Field(default="HIGH", description="Assumed speed of environment disaster frequency increases (e.g. LOW, MEDIUM, HIGH, CRITICAL)")


class DecisionExplanation(BaseModel):
    """
    Model representing detailed explainability traces and metrics behind planning findings.
    """
    model_config = ConfigDict(from_attributes=True)
    
    decision_id: str = Field(..., description="Unique Trace UUID of the decision instance")
    decision_type: str = Field(..., description="Category classification: STRATEGY | INVESTMENT | CONSENSUS | ROADMAP | RISK")
    selected_option: str = Field(..., description="Descriptive label of the chosen course of action")
    alternative_options: List[str] = Field(..., description="Names of other options considered but rejected or deprioritized")
    reasoning_steps: List[str] = Field(..., description="Logical step-by-step trace of how the decision was formulated")
    supporting_metrics: Dict[str, Any] = Field(..., description="Numerical backing, index scores, and verification KPIs")
    tradeoffs: Dict[str, Any] = Field(..., description="Comparative analysis of what was optimized vs sacrificed")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Logical confidence level of AI recommendation")
    stakeholder_impacts: Dict[str, float] = Field(..., description="Expected satisfaction/alignment score per stakeholder domain")
    risk_analysis: Dict[str, Any] = Field(..., description="Forenote of secondary risks, residual damage factors, and mitigation gaps")
    executive_summary: str = Field(..., description="A polished human-readable natural language justification report")



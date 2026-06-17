# /backend/services/investment_planning.py
from typing import List
from backend.schemas.schemas import InvestmentProjectInput, PrioritizedProjectResponse, InvestmentPortfolioResponse

class InvestmentPlanningService:
    @staticmethod
    def calculate_project_score(p: InvestmentProjectInput) -> float:
        # PriorityScore = 0.30 * ReliabilityImpact + 0.25 * RenewableImpact + 0.20 * CommunityImpact + 0.15 * CarbonReduction + 0.10 * RiskReduction
        # Scale input scores between 0 and 10
        # Normalizing carbon reduction to a 10-scale score (e.g. 1000 tons = score 10)
        carbon_score = min(10.0, p.carbon_reduction_tons / 200.0)
        
        score = (
            0.30 * p.reliability_impact_score +
            0.25 * (p.renewable_capacity_mw / 20.0 * 10) +  # scaled
            0.20 * p.community_benefit_rating +
            0.15 * carbon_score +
            0.10 * p.risk_factors
        )
        return round(float(score), 2)

    @staticmethod
    def rank_projects(projects: List[InvestmentProjectInput]) -> List[PrioritizedProjectResponse]:
        ranked = []
        for p in projects:
            p_score = InvestmentPlanningService.calculate_project_score(p)
            
            # Formulate smart strategic justification based on high-scoring sub components
            if p.reliability_impact_score >= 8.5:
                just = f"Crucial system hardening asset that actively buffers transmission line congestion."
            elif p.renewable_capacity_mw >= 50.0:
                just = f"Clean generation multiplier delivering massive carbon mitigation offset of {p.carbon_reduction_tons} tons."
            elif p.community_benefit_rating >= 8.0:
                just = f"Fosters high public support and provides crucial localized micro-grid redundancy."
            else:
                just = f"Standard grid upgrade enhancing system operating headroom."
                
            # Estimated ROI based on cost/benefit
            roi = round(((p.reliability_impact_score * 0.4 + p.renewable_capacity_mw * 0.1) / max(1.0, p.cost)) * 15.2, 1)
            
            ranked.append(PrioritizedProjectResponse(
                id=p.id,
                name=p.name,
                priority_score=p_score,
                expected_roi=max(4.2, roi),
                strategic_justification=just
            ))
            
        return sorted(ranked, key=lambda x: x.priority_score, reverse=True)

    @staticmethod
    def optimize_budget(projects: List[InvestmentProjectInput], budget_limit: float) -> InvestmentPortfolioResponse:
        ranked = InvestmentPlanningService.rank_projects(projects)
        
        allocated = 0.0
        portfolio_projects = []
        roi_accumulator = 0.0
        
        # Greedy knapsack strategy based on priority scores
        # First matching projects to the input project catalog
        project_map = {p.id: p for p in projects}
        
        for p_res in ranked:
            p_orig = project_map.get(p_res.id)
            if not p_orig:
                continue
                
            if allocated + p_orig.cost <= budget_limit:
                allocated += p_orig.cost
                portfolio_projects.append(p_res)
                roi_accumulator += p_res.expected_roi * p_orig.cost
                
        avg_roi = round(roi_accumulator / allocated, 2) if allocated > 0 else 0.0
        
        return InvestmentPortfolioResponse(
            budget_limit=budget_limit,
            allocated_funds=round(allocated, 2),
            estimated_system_roi=avg_roi,
            ranked_projects=portfolio_projects
        )

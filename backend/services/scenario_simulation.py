# /backend/services/scenario_simulation.py
from typing import List
from backend.schemas.schemas import ScenarioInput, ScenarioOutput, ForecastPoint

class ScenarioSimulationService:
    @staticmethod
    def run_scenario(payload: ScenarioInput) -> ScenarioOutput:
        # Base forecasts starting from 1000MW
        base_demand = 1200.0
        
        # Ingest compound annual growth multipliers
        ev_multi = 1 + (payload.ev_adoption / 100.0) * 0.25
        pop_multi = 1 + (payload.population_growth / 100.0) * 1.8
        ind_multi = 1 + (payload.industrial_growth / 100.0) * 1.4
        
        forecasts = []
        years = [2025, 2030, 2040, 2050]
        
        # Projected expansion calculation logic
        for idx, yr in enumerate(years):
            scale_factor = 1 + (0.015 * (yr - 2025))
            dem = base_demand * scale_factor * ev_multi * pop_multi * ind_multi
            
            # Simulated renewable development trajectory
            renewable_target_scale = (payload.renewable_target / 100.0) * (0.4 + 0.6 * (idx / 3.0))
            ren = dem * renewable_target_scale
            
            forecasts.append(ForecastPoint(
                year=yr,
                demand_mw=round(dem, 1),
                renewable_mw=round(ren, 1)
            ))
            
        peak_demand_2050 = forecasts[-1].demand_mw
        capacity_req = peak_demand_2050 * 1.15 # 15% safety backup reserve
        
        # Correlate investment requirement to demand expansion and renewable scale-up
        base_cap_exp = (capacity_req - 1200) * 0.15 # $0.15M per MW expansion
        green_cap_exp = (payload.renewable_target / 100.0) * 45.0
        tot_investment = max(5.0, base_cap_exp + green_cap_exp)
        
        # Budget matching validation
        has_adequate_funding = payload.budget >= tot_investment
        feasibility_grade = "OPTIMAL" if has_adequate_funding else "BUDGET_CONSTRAINED"
        
        # Reliability impact (lower score if budget is constrained and renewables are high without storage)
        if has_adequate_funding:
            reliability = 99.94
        else:
            deficit_pct = (tot_investment - payload.budget) / tot_investment
            reliability = max(94.2, 99.92 - (deficit_pct * 15.0) - (payload.renewable_target / 100.0) * 1.2)
            
        return ScenarioOutput(
            demand_forecast=forecasts,
            capacity_requirements_mw=round(capacity_req, 1),
            investment_requirements_m=round(tot_investment, 2),
            reliability_impact=round(reliability, 3),
            feasibility_status=feasibility_grade
        )

    @staticmethod
    def compare_scenarios(scenarios: List[ScenarioInput]) -> List[ScenarioOutput]:
        return [ScenarioSimulationService.run_scenario(s) for s in scenarios]

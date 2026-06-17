# /backend/services/future_shock_service.py
import datetime
from typing import List, Dict, Any
from backend.schemas.planning import FutureShockProjection

class FutureShockService:
    @staticmethod
    def simulate_future(
        carbon_reduction_target: float = 30.0,
        climate_risk_escalation: str = "HIGH"
    ) -> List[FutureShockProjection]:
        """
        Evaluate and forecast grid vulnerabilities, capacity limits, and physical climate exposures over multi-decade Horizons.
        """
        projections: List[FutureShockProjection] = []
        years = [2025, 2030, 2040, 2050]
        
        # Base parameters
        base_demand_mw = 18850.0 # Standard base load for national scale
        base_climate_risk_index = 24.5
        
        for idx, yr in enumerate(years):
            # Peak demand increases dynamically due to urbanization, EV adoption and heavy industrialization
            load_growth_coef = 1.0 + (0.018 * (yr - 2025))
            peak_demand = base_demand_mw * load_growth_coef
            
            # Renewable penetration grows toward targets
            target_growth_factor = min(1.0, (yr - 2025) / 25.0) if yr > 2025 else 0.0
            renewable_penetration = min(98.0, 20.0 + (carbon_reduction_target * 1.5 * target_growth_factor))
            
            # Climate risk index escalates over decades
            risk_growth = (yr - 2025) * (1.8 if climate_risk_escalation == "HIGH" else 1.2)
            climate_risk = min(100.0, base_climate_risk_index + risk_growth)
            
            # Infrastructure stress score matches higher peak demand scaling vs transmission availability
            stress_base = 35.0
            load_factor = (peak_demand / base_demand_mw - 1.0) * 120.0
            renewable_impact = (renewable_penetration * 0.25) if renewable_penetration > 40.0 else 0.0
            inf_stress = min(100.0, max(5.0, stress_base + load_factor + renewable_impact))
            
            # Storage / Transmission requirements estimated for recommended_actions
            calculated_storage_mwh = max(10.0, peak_demand * (renewable_penetration / 100.0) * 0.22)
            calculated_transmission_km = max(15.0, (peak_demand / 100.0) * 0.45)
            
            # Reliability score is negatively affected by infrastructure stress and extreme climate events
            rel_deductions = (inf_stress * 0.12) + (climate_risk * 0.08)
            # Mitigation from battery storage pilot installations
            mitigation_factor = min(15.0, (calculated_storage_mwh / peak_demand) * 120.0)
            reliability_score = max(65.0, min(100.0, 99.99 - rel_deductions + mitigation_factor))
            
            # Construct standard recommended actions array to cover storage and transmission metrics safely
            actions = [
                f"Sustain storage requirements of at least {calculated_storage_mwh:.1f} MWh to hedge duck-curve curtailment risk.",
                f"Deploy {calculated_transmission_km:.1f} circuit-km of high-tension overhead lines to support rural loop congestion.",
                "Reinforce physical substation structures located within standard 100-year flood zone contexts."
            ]
            if yr >= 2040:
                actions.append("Initiate wide-area smart grids utilizing automated load dispatches.")
                
            projections.append(FutureShockProjection(
                year=yr,
                peak_demand_mw=round(peak_demand, 1),
                renewable_penetration_pct=round(renewable_penetration, 2),
                climate_risk_index=round(climate_risk, 2),
                infrastructure_stress_index=round(inf_stress, 2),
                reliability_score=round(reliability_score, 4),
                recommended_actions=actions
            ))
            
        return projections

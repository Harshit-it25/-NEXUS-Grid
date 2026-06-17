# /backend/services/future_shock.py
from typing import List, Dict, Any
from backend.schemas.schemas import FutureShockOutput, FutureStateProjection

class FutureShockService:
    @staticmethod
    def simulate_future(carbon_offset_achieved: float = 35.0) -> FutureShockOutput:
        # Years requested: 2025, 2030, 2040, 2050
        projections = []
        
        # 2025
        projections.append(FutureStateProjection(
            year=2025,
            demand_growth_percent=3.5,
            renewable_growth_percent=12.2,
            infrastructure_stress_index=15.0,
            climate_risk_multiplier=1.05,
            reliability_score=99.94
        ))
        
        # 2030
        projections.append(FutureStateProjection(
            year=2030,
            demand_growth_percent=14.8,
            renewable_growth_percent=32.5,
            infrastructure_stress_index=32.4,
            climate_risk_multiplier=1.20,
            reliability_score=99.88
        ))
        
        # 2040
        # Aggressive growth of load but stress is slightly mitigated if carbon_offset is high
        stress_40 = max(20.0, 68.0 - (carbon_offset_achieved * 0.4))
        projections.append(FutureStateProjection(
            year=2040,
            demand_growth_percent=32.1,
            renewable_growth_percent=55.0,
            infrastructure_stress_index=round(stress_40, 1),
            climate_risk_multiplier=1.45,
            reliability_score=99.65
        ))
        
        # 2050
        stress_50 = max(25.0, 94.0 - (carbon_offset_achieved * 0.7))
        projections.append(FutureStateProjection(
            year=2050,
            demand_growth_percent=52.4,
            renewable_growth_percent=78.2,
            infrastructure_stress_index=round(stress_50, 1),
            climate_risk_multiplier=1.80,
            reliability_score=99.20
        ))
        
        return FutureShockOutput(timeline_projections=projections)

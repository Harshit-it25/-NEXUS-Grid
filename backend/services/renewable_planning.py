# /backend/services/renewable_planning.py
from typing import List
from backend.schemas.schemas import RenewablePlannerInput, RenewablePlannerOutput, RecommendedUpgrade

class RenewablePlanningService:
    @staticmethod
    def calculate_absorption_capacity(payload: RenewablePlannerInput) -> RenewablePlannerOutput:
        total_proposed = payload.solar_capacity + payload.wind_capacity
        storage_effectiveness = payload.battery_storage / 4.0 if payload.battery_storage > 0 else 0.0
        
        # Calculate maximum absorption capacity before transmission overloading
        base_threshold = payload.transmission_capacity * 0.85
        supported_capacity = base_threshold + (storage_effectiveness * 1.5)
        
        # Renewable integration score (0 to 100)
        if total_proposed == 0:
            score = 100.0
        else:
            score = min(100.0, (supported_capacity / total_proposed) * 100.0)
            
        constraints = []
        upgrades = []
        
        # Determine bottleneck locations
        if total_proposed > supported_capacity:
            constraints.append("Substation Cascade Valley (Pacific Rim) overloaded")
            upgrades.append(RecommendedUpgrade(
                location="Cascade Valley",
                upgrade_type="High-voltage transformer replacement & sub-station storage deployment",
                estimated_cost_m=12.5,
                estimated_timeline_months=18
            ))
            
        if payload.wind_capacity > 300:
            constraints.append("Western Appalachia transmission lines saturated")
            upgrades.append(RecommendedUpgrade(
                location="Western Appalachia Radial",
                upgrade_type="500kV double-circuit transmission corridor installation",
                estimated_cost_m=24.0,
                estimated_timeline_months=24
            ))
            
        if payload.battery_storage < (total_proposed * 0.1):
            constraints.append("Imbalance in localized active reserve frequency stabilization")
            upgrades.append(RecommendedUpgrade(
                location="Southeast Distribution Hub",
                upgrade_type="Distributed 50MW/200MWh solid-state battery bank",
                estimated_cost_m=8.2,
                estimated_timeline_months=12
            ))
            
        return RenewablePlannerOutput(
            renewable_integration_score=round(score, 1),
            grid_absorption_capacity_mw=round(supported_capacity, 1),
            constraint_locations=constraints,
            recommended_upgrades=upgrades
        )

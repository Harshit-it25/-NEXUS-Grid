# /backend/services/digital_twin.py
import datetime
from typing import Dict, Any, List
from backend.schemas.schemas import GridStateResponse, SubstationState, LineState, GridUpdatePayload

# Complete, realistic, in-memory dataset for India 2040 Renewable Transition
MOCK_SUBSTATIONS = {
    "sub-1": {
        "id": "sub-1",
        "name": "Mumbai West Gas-Insulated Substation",
        "region": "West Region",
        "capacity_mw": 1200.0,
        "current_load_mw": 936.0,
        "health_index": 82.0,
        "failure_risk": 0.18,
        "status": "OPERATIONAL"
    },
    "sub-2": {
        "id": "sub-2",
        "name": "Delhi NCR Grid Exchange Substation",
        "region": "North Region",
        "capacity_mw": 2000.0,
        "current_load_mw": 1720.0,
        "health_index": 84.0,
        "failure_risk": 0.22,
        "status": "OPERATIONAL"
    },
    "sub-3": {
        "id": "sub-3",
        "name": "Chennai Coastal Switching Substation",
        "region": "South Region",
        "capacity_mw": 1000.0,
        "current_load_mw": 610.0,
        "health_index": 68.0,
        "failure_risk": 0.28,
        "status": "WARNING"
    },
    "sub-4": {
        "id": "sub-4",
        "name": "Nagpur Inter-regional Transmission Hub",
        "region": "Central Region",
        "capacity_mw": 1500.0,
        "current_load_mw": 780.0,
        "health_index": 92.0,
        "failure_risk": 0.05,
        "status": "OPERATIONAL"
    },
    "sub-5": {
        "id": "sub-5",
        "name": "Ahmedabad Urban Power Distribution Node",
        "region": "West Region",
        "capacity_mw": 800.0,
        "current_load_mw": 536.0,
        "health_index": 88.0,
        "failure_risk": 0.12,
        "status": "OPERATIONAL"
    },
    "sub-6": {
        "id": "sub-6",
        "name": "Pune Hinjewadi Tech-Park Substation",
        "region": "West Region",
        "capacity_mw": 600.0,
        "current_load_mw": 516.0,
        "health_index": 79.0,
        "failure_risk": 0.19,
        "status": "WARNING"
    },
    "sub-7": {
        "id": "sub-7",
        "name": "Bangalore Whitefield Digital Grid Node",
        "region": "South Region",
        "capacity_mw": 1100.0,
        "current_load_mw": 913.0,
        "health_index": 85.0,
        "failure_risk": 0.15,
        "status": "OPERATIONAL"
    },
    "sub-8": {
        "id": "sub-8",
        "name": "Hyderabad Gachibowli Gateway Substation",
        "region": "South Region",
        "capacity_mw": 750.0,
        "current_load_mw": 495.0,
        "health_index": 91.0,
        "failure_risk": 0.08,
        "status": "OPERATIONAL"
    },
    "sub-9": {
        "id": "sub-9",
        "name": "Kolkata SaltLake Metro Distribution Node",
        "region": "East Region",
        "capacity_mw": 700.0,
        "current_load_mw": 588.0,
        "health_index": 64.0,
        "failure_risk": 0.31,
        "status": "CRITICAL"
    },
    "sub-10": {
        "id": "sub-10",
        "name": "Guwahati Eastern Inter-tie Substation",
        "region": "East Region",
        "capacity_mw": 900.0,
        "current_load_mw": 405.0,
        "health_index": 74.0,
        "failure_risk": 0.14,
        "status": "OPERATIONAL"
    },
    "sub-11": {
        "id": "sub-11",
        "name": "Patna Central Domestic Grid Base",
        "region": "East Region",
        "capacity_mw": 500.0,
        "current_load_mw": 440.0,
        "health_index": 71.0,
        "failure_risk": 0.24,
        "status": "WARNING"
    },
    "sub-12": {
        "id": "sub-12",
        "name": "Bhopal Central Exchange Substation",
        "region": "Central Region",
        "capacity_mw": 1200.0,
        "current_load_mw": 648.0,
        "health_index": 89.0,
        "failure_risk": 0.06,
        "status": "OPERATIONAL"
    },
    "sub-13": {
        "id": "sub-13",
        "name": "Jabalpur Trunk Inter-tie Substation",
        "region": "Central Region",
        "capacity_mw": 1800.0,
        "current_load_mw": 1170.0,
        "health_index": 86.0,
        "failure_risk": 0.11,
        "status": "OPERATIONAL"
    },
    "sub-14": {
        "id": "sub-14",
        "name": "Jaipur Solar Integration Substation",
        "region": "North Region",
        "capacity_mw": 1400.0,
        "current_load_mw": 1190.0,
        "health_index": 80.0,
        "failure_risk": 0.21,
        "status": "OPERATIONAL"
    },
    "sub-15": {
        "id": "sub-15",
        "name": "Jodhpur Desert Collector Substation",
        "region": "North Region",
        "capacity_mw": 2500.0,
        "current_load_mw": 2125.0,
        "health_index": 83.0,
        "failure_risk": 0.17,
        "status": "OPERATIONAL"
    },
    "sub-16": {
        "id": "sub-16",
        "name": "Lucknow Grid Terminal Substation",
        "region": "North Region",
        "capacity_mw": 1000.0,
        "current_load_mw": 790.0,
        "health_index": 76.0,
        "failure_risk": 0.16,
        "status": "OPERATIONAL"
    },
    "sub-17": {
        "id": "sub-17",
        "name": "Surat West-Edge Heavy Industry Substation",
        "region": "West Region",
        "capacity_mw": 1300.0,
        "current_load_mw": 1105.0,
        "health_index": 81.0,
        "failure_risk": 0.18,
        "status": "OPERATIONAL"
    },
    "sub-18": {
        "id": "sub-18",
        "name": "Kochi Marine Terminal Substation",
        "region": "South Region",
        "capacity_mw": 500.0,
        "current_load_mw": 320.0,
        "health_index": 75.0,
        "failure_risk": 0.22,
        "status": "OPERATIONAL"
    },
    "sub-19": {
        "id": "sub-19",
        "name": "Bhubaneswar Coastal Grid Aggregator",
        "region": "East Region",
        "capacity_mw": 950.0,
        "current_load_mw": 589.0,
        "health_index": 73.0,
        "failure_risk": 0.25,
        "status": "WARNING"
    },
    "sub-20": {
        "id": "sub-20",
        "name": "Ranchi Industrial Collector Substation",
        "region": "East Region",
        "capacity_mw": 1100.0,
        "current_load_mw": 858.0,
        "health_index": 80.0,
        "failure_risk": 0.13,
        "status": "OPERATIONAL"
    },
    "sub-21": {
        "id": "sub-21",
        "name": "Indore West central Bulk-power Node",
        "region": "Central Region",
        "capacity_mw": 1050.0,
        "current_load_mw": 661.0,
        "health_index": 90.0,
        "failure_risk": 0.07,
        "status": "OPERATIONAL"
    },
    "sub-22": {
        "id": "sub-22",
        "name": "Visakhapatnam Steel City Substation",
        "region": "South Region",
        "capacity_mw": 1250.0,
        "current_load_mw": 975.0,
        "health_index": 82.0,
        "failure_risk": 0.16,
        "status": "OPERATIONAL"
    },
    "sub-23": {
        "id": "sub-23",
        "name": "Jamshedpur Heavy-Metallurgy Grid Exchange",
        "region": "East Region",
        "capacity_mw": 1600.0,
        "current_load_mw": 1312.0,
        "health_index": 81.0,
        "failure_risk": 0.17,
        "status": "OPERATIONAL"
    },
    "sub-24": {
        "id": "sub-24",
        "name": "Rajkot Solar-Wind Local Pooling Base",
        "region": "West Region",
        "capacity_mw": 800.0,
        "current_load_mw": 520.0,
        "health_index": 87.0,
        "failure_risk": 0.10,
        "status": "OPERATIONAL"
    },
    "sub-25": {
        "id": "sub-25",
        "name": "Amritsar Northwest Boundary Exchange",
        "region": "North Region",
        "capacity_mw": 600.0,
        "current_load_mw": 360.0,
        "health_index": 84.0,
        "failure_risk": 0.12,
        "status": "OPERATIONAL"
    }
}

MOCK_LINES = {
    "corr-1": {
        "id": "corr-1",
        "voltage_kv": 800.0,
        "capacity_mw": 3000.0,
        "current_flow_mw": 2450.0,
        "status": "ONLINE"
    },
    "corr-2": {
        "id": "corr-2",
        "voltage_kv": 765.0,
        "capacity_mw": 2500.0,
        "current_flow_mw": 2150.0,
        "status": "ONLINE"
    },
    "corr-3": {
        "id": "corr-3",
        "voltage_kv": 400.0,
        "capacity_mw": 1800.0,
        "current_flow_mw": 1410.0,
        "status": "ONLINE"
    },
    "corr-4": {
        "id": "corr-4",
        "voltage_kv": 400.0,
        "capacity_mw": 1600.0,
        "current_flow_mw": 1210.0,
        "status": "ONLINE"
    },
    "corr-5": {
        "id": "corr-5",
        "voltage_kv": 400.0,
        "capacity_mw": 1500.0,
        "current_flow_mw": 1180.0,
        "status": "ONLINE"
    },
    "corr-6": {
        "id": "corr-6",
        "voltage_kv": 220.0,
        "capacity_mw": 800.0,
        "current_flow_mw": 736.0,
        "status": "CONGESTED"
    },
    "corr-7": {
        "id": "corr-7",
        "voltage_kv": 400.0,
        "capacity_mw": 1400.0,
        "current_flow_mw": 1190.0,
        "status": "ONLINE"
    },
    "corr-8": {
        "id": "corr-8",
        "voltage_kv": 765.0,
        "capacity_mw": 2400.0,
        "current_flow_mw": 1810.0,
        "status": "ONLINE"
    },
    "corr-9": {
        "id": "corr-9",
        "voltage_kv": 220.0,
        "capacity_mw": 600.0,
        "current_flow_mw": 410.0,
        "status": "ONLINE"
    },
    "corr-10": {
        "id": "corr-10",
        "voltage_kv": 400.0,
        "capacity_mw": 1200.0,
        "current_flow_mw": 890.0,
        "status": "ONLINE"
    },
    "corr-11": {
        "id": "corr-11",
        "voltage_kv": 220.0,
        "capacity_mw": 900.0,
        "current_flow_mw": 792.0,
        "status": "ONLINE"
    },
    "corr-12": {
        "id": "corr-12",
        "voltage_kv": 400.0,
        "capacity_mw": 1000.0,
        "current_flow_mw": 450.0,
        "status": "ONLINE"
    },
    "corr-13": {
        "id": "corr-13",
        "voltage_kv": 765.0,
        "capacity_mw": 2000.0,
        "current_flow_mw": 1720.0,
        "status": "ONLINE"
    },
    "corr-14": {
        "id": "corr-14",
        "voltage_kv": 400.0,
        "capacity_mw": 1100.0,
        "current_flow_mw": 902.0,
        "status": "ONLINE"
    }
}

class DigitalTwinService:
    @staticmethod
    def get_grid_state() -> GridStateResponse:
        subs = [SubstationState(**v) for v in MOCK_SUBSTATIONS.values()]
        lines = [LineState(**v) for v in MOCK_LINES.values()]
        
        # Grid index formulas
        total_capacity = sum(s.capacity_mw for s in subs)
        total_load = sum(s.current_load_mw for s in subs)
        
        avg_health = sum(s.health_index for s in subs) / len(subs) if subs else 100.0
        util_factor = (total_load / total_capacity) if total_capacity > 0 else 0.0
        
        # Calculate scores
        grid_health = avg_health
        inf_readiness = max(10, min(100, 100 - (util_factor * 25) - (0.05 * (100 - avg_health))))
        reliability = max(50, min(99.99, 99.92 - sum(1 for s in subs if s.status == "WARNING") * 0.4 - sum(1 for s in subs if s.status == "CRITICAL") * 1.5))
        
        return GridStateResponse(
            timestamp=datetime.datetime.now(),
            grid_health_index=round(grid_health, 2),
            infrastructure_readiness_score=round(inf_readiness, 2),
            reliability_index=round(reliability, 2),
            total_capacity_mw=total_capacity,
            total_load_mw=total_load,
            substations=subs,
            lines=lines
        )
        
    @staticmethod
    def update_grid_state(payload: GridUpdatePayload) -> Dict[str, Any]:
        sub_id = payload.substation_id
        if sub_id not in MOCK_SUBSTATIONS:
            return {"success": False, "error": "Substation not found"}
            
        sub = MOCK_SUBSTATIONS[sub_id]
        if payload.new_load_mw is not None:
            sub["current_load_mw"] = payload.new_load_mw
        if payload.health_index is not None:
            sub["health_index"] = max(0.0, min(100.0, payload.health_index))
        if payload.status is not None:
            sub["status"] = payload.status
            
        # Re-estimate failure probability based on load and health
        load_ratio = sub["current_load_mw"] / sub["capacity_mw"] if sub["capacity_mw"] > 0 else 1.0
        sub["failure_risk"] = round(max(0.005, min(0.99, (100 - sub["health_index"])/100.0 * 0.5 + (load_ratio - 0.7)*0.3)), 3)
        
        return {"success": True, "updated_substation": sub}

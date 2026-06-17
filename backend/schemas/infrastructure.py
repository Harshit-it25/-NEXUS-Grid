# /backend/schemas/infrastructure.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from enum import Enum

class AssetStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"

class LineStatus(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    CONGESTED = "CONGESTED"

class CorridorType(str, Enum):
    HVDC = "HVDC"
    UHV_AC = "UHV-AC"
    HV_AC = "HV-AC"

class AssetType(str, Enum):
    SOLAR = "SOLAR"
    WIND = "WIND"
    HYDRO = "HYDRO"

class Substation(BaseModel):
    """
    Schema representing a primary high-voltage electrical substation asset in the grid network.
    """
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    
    id: str = Field(..., description="Unique identifier of the substation")
    name: str = Field(..., description="Full descriptive name of the substation node")
    voltage_kv: int = Field(..., description="Operating voltage in kilovolts (kV)")
    region: str = Field(..., description="Geographical grid region cluster")
    capacity_mw: float = Field(..., description="Maximum transformer capacity rating in MW")
    current_load_mw: float = Field(..., description="Current measured active load under operation in MW")
    utilization_pct: float = Field(..., description="Percentage of the capacity currently in use")
    health_index: float = Field(..., description="Asset physical integrity score where 0-100 represents full health state")
    risk_score: float = Field(..., description="Estimated probability index of failure risk (0.0 to 1.0)")
    recommended_upgrade: Optional[str] = Field(None, description="Detailed proposed upgrade instructions or guidelines")
    cost_cr: float = Field(..., alias="upgrade_cost_crore", description="Estimated capital expenditure cost in Crores")


class TransmissionCorridor(BaseModel):
    """
    Schema representing a high-voltage transmission corridor connecting regional grids.
    """
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    
    id: str = Field(..., description="Unique transmission corridor identifier")
    name: str = Field(..., description="Regional transmission corridor span label")
    voltage_kv: int = Field(..., description="Span operating voltage in kilovolts (kV)")
    type: str = Field(..., alias="corridor_type", description="Technical transmission configuration (e.g. HVDC, UHV-AC, HV-AC)")
    capacity_mw: float = Field(..., description="Maximum thermal carrying limit of the line in MW")
    active_load_mw: float = Field(..., description="Active active power loaded in real-time on line in MW")
    length_km: int = Field(..., description="Physical running route length of corridor in kilometers")
    regional_span: str = Field(..., description="Descriptive text of geographical origin and destination nodes")
    health_pct: float = Field(..., description="Line maintenance/insulation physical integrity percentage")
    risk_score: float = Field(..., description="Vulnerability/exposure metrics computed risk assessment value")
    reliability_index: float = Field(..., description="Target uptime integrity scoring parameter index")


class SolarFarm(BaseModel):
    """
    Schema representing a utility-scale solar farm clean energy asset.
    """
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    
    id: str = Field(..., description="Unique clean generator system key")
    name: str = Field(..., description="Descriptive asset moniker/name")
    type: str = Field("SOLAR", alias="asset_type", description="Primary clean generation resource paradigm (e.g., SOLAR)")
    state: str = Field(..., description="Indian state context jurisdiction of origin")
    capacity_mw: float = Field(..., description="Operational nameplate peak generation capacity rated in MW")
    current_generation_mw: float = Field(..., description="Measured feed active power injection rate in MW")
    capacity_utilization_factor_pct: float = Field(..., alias="capacity_utilization_pct", description="Active annual/diurnal Capacity Utilization Factor (CUF) expression percent")
    health_index: float = Field(..., description="Computed mechanical health score rating metric (0 to 100)")
    grid_connection_point: str = Field(..., alias="connection_endpoint", description="Target high voltage injection base node terminal")


class Project(BaseModel):
    """
    Schema representing a proposed infrastructure modernization project for capital budgeting.
    """
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    
    id: str = Field(..., description="Proposed portfolio capital expenditure identifier")
    name: str = Field(..., description="Short descriptive proposal engineering title")
    category: str = Field(..., description="Investment category classification (e.g., TRANSMISSION, RESILIENCY, DISTRIBUTION, SECURITY)")
    region: str = Field(..., description="Grid zone implementation sector")
    cost_cr: float = Field(..., alias="cost_crore", description="Capital expenditure budget allocation in Crores")
    roi: Optional[float] = Field(None, alias="expected_roi_pct", description="Projected financial return of physical capital outlay percent")
    reliability_impact: str = Field(..., description="Systemic baseline reliability impact category (e.g. HIGH, CRITICAL)")
    priority_score: float = Field(..., description="Algorithmic scoring rank priority weighting variable")
    carbon_impact: str = Field(..., description="Carbon footprint reduction potential rank/tons rating")
    community_benefit: int = Field(..., description="Societal localized positive impact index rating (0 to 10)")

# /backend/models/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import relationship
import datetime
from backend.database.session import Base

class Substation(Base):
    __tablename__ = "substations"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)
    capacity_mw = Column(Float, nullable=False)
    current_load_mw = Column(Float, default=0.0)
    health_index = Column(Float, default=100.0)
    failure_risk = Column(Float, default=0.0)
    is_critical = Column(Boolean, default=False)
    status = Column(String, default="OPERATIONAL") # OPERATIONAL, WARNING, FAILURE
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class TransmissionLine(Base):
    __tablename__ = "transmission_lines"
    
    id = Column(String, primary_key=True, index=True)
    source_substation_id = Column(String, index=True)
    target_substation_id = Column(String, index=True)
    voltage_kv = Column(Float, nullable=False)
    capacity_mw = Column(Float, nullable=False)
    current_flow_mw = Column(Float, default=0.0)
    status = Column(String, default="ONLINE") # ONLINE, CONGESTED, OFFLINE
    length_km = Column(Float, nullable=False)

class RenewableAsset(Base):
    __tablename__ = "renewable_assets"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # SOLAR, WIND, HYDRO, BATTERY
    capacity_mw = Column(Float, nullable=False)
    current_generation_mw = Column(Float, default=0.0)
    efficiency = Column(Float, default=1.0)
    status = Column(String, default="ACTIVE") # ACTIVE, STANDBY, DEGRADED, OFFLINE

class ScenarioRun(Base):
    __tablename__ = "scenario_runs"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scenario_name = Column(String, nullable=False)
    ev_adoption = Column(Float, nullable=False)
    population_growth = Column(Float, nullable=False)
    renewable_target = Column(Float, nullable=False)
    industrial_growth = Column(Float, nullable=False)
    budget_limit = Column(Float, nullable=False)
    
    results = Column(JSON, nullable=True) # Results dictionary storing forecasts & scores
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PrioritizedProjectModel(Base):
    __tablename__ = "prioritized_projects"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # TRANSMISSION, RESILIENCY, DISTRIBUTION, SECURITY
    region = Column(String, nullable=False)
    cost = Column(Float, nullable=False) # in Millions
    roi = Column(Float, nullable=False) # expected return percentages
    reliability_impact = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    priority_score = Column(Float, default=0.0)
    carbon_impact = Column(String, default="LOW") # HIGH, MEDIUM, LOW
    risk_weight = Column(Float, default=50.0)
    community_benefit = Column(Integer, default=5)
    selected = Column(Boolean, default=False)

class ModernizationStrategyModel(Base):
    __tablename__ = "modernization_strategies"
    
    id = Column(String, primary_key=True, index=True)
    strategy_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    total_cost_cr = Column(Float, nullable=False)
    renewable_penetration_pct = Column(Float, nullable=False)
    reliability_gain_pct = Column(Float, nullable=False)
    carbon_reduction_pct = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    stakeholder_alignment_score = Column(Float, nullable=False)
    investment_priority = Column(String, nullable=False)

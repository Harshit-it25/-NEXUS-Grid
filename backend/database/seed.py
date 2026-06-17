# /backend/database/seed.py
import sys
import os
import datetime
from sqlalchemy import text
from sqlalchemy.orm import Session

# Add the parent directory to python path if not present (to resolve backend packages)
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.database.session import Base, engine, SessionLocal
from backend.models.models import (
    Substation,
    TransmissionLine,
    RenewableAsset,
    PrioritizedProjectModel,
    ModernizationStrategyModel
)

def run_seed():
    print("=====================================================================")
    print(" CASSANDRA GRIDOS - ENTERPRISE GRID PLANNING ARCHITECTURE")
    print(" PRODUCTION-GRADE MASTER DEMONSTRATION DATASET SEED ENGINE")
    print("=====================================================================")

    # Step 1: Ensure all registered SQLAlchemy models are created in the database
    print("\n[Step 1] Ensuring SQLAlchemy tables are created...")
    Base.metadata.create_all(bind=engine)
    print("  -> Tables initialized successfully.")

    # Step 2: Ensure any additional system tables (defined in seed_data.sql) are created
    # This maintains full backward compatibility with any raw SQL operations.
    print("\n[Step 2] Provisioning supplementary postgres SQL tables...")
    db: Session = SessionLocal()
    try:
        # Create scenarios table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS scenarios (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                context TEXT NOT NULL,
                planning_type VARCHAR(50) NOT NULL,
                target_year INT NOT NULL,
                renewable_energy_target_pct NUMERIC(5,2) NOT NULL,
                ev_adoption_rate_pct NUMERIC(5,2) NOT NULL,
                population_growth_rate_pct NUMERIC(5,2) NOT NULL,
                total_budget_crore NUMERIC(15,2) NOT NULL,
                primary_challenge TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # Create transmission_corridors table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS transmission_corridors (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                voltage_kv INT NOT NULL,
                corridor_type VARCHAR(50) NOT NULL,
                capacity_mw NUMERIC(10,2) NOT NULL,
                active_load_mw NUMERIC(10,2) NOT NULL,
                length_km INT NOT NULL,
                regional_span VARCHAR(150) NOT NULL,
                health_pct NUMERIC(5,2) NOT NULL,
                risk_score NUMERIC(4,2) NOT NULL,
                reliability_index NUMERIC(5,2) NOT NULL
            );
        """))

        # Create proposed_projects table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS proposed_projects (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                category VARCHAR(50) NOT NULL,
                region VARCHAR(100) NOT NULL,
                cost_crore NUMERIC(12,2) NOT NULL,
                expected_roi_pct NUMERIC(5,2),
                reliability_impact VARCHAR(50) NOT NULL,
                priority_score NUMERIC(5,2) NOT NULL,
                carbon_impact VARCHAR(50) NOT NULL,
                community_benefit INT NOT NULL
            );
        """))

        # Create modern modernization_strategies raw table just in case raw SQL queries them too
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS modernization_strategies (
                id VARCHAR(50) PRIMARY KEY,
                strategy_name VARCHAR(150) NOT NULL,
                description TEXT NOT NULL,
                total_cost_cr NUMERIC(12,2) NOT NULL,
                renewable_penetration_pct NUMERIC(5,2) NOT NULL,
                reliability_gain_pct NUMERIC(5,2) NOT NULL,
                carbon_reduction_pct NUMERIC(5,2) NOT NULL,
                risk_score NUMERIC(5,2) NOT NULL,
                stakeholder_alignment_score NUMERIC(5,2) NOT NULL,
                investment_priority VARCHAR(50) NOT NULL
            );
        """))

        db.commit()
        print("  -> Raw SQL tables prepped successfully.")
    except Exception as e:
        db.rollback()
        print(f"  -> WARNING during supplementary tables setup: {e}")

    # Step 3: Populate master scenario metadata
    print("\n[Step 3] Securing master strategic scenario profiles...")
    try:
        db.execute(text("""
            INSERT INTO scenarios (id, name, context, planning_type, target_year, renewable_energy_target_pct, ev_adoption_rate_pct, population_growth_rate_pct, total_budget_crore, primary_challenge)
            VALUES (
                'scenario-india-2040',
                'India 2040 Renewable Transition',
                'National Grid Decarbonization and EV Ingestion Roadmap',
                'National Utility Planning',
                2040,
                70.00,
                65.00,
                22.00,
                8000.00,
                'Integrate massive utility-scale solar and wind arrays in the western corridors while reinforcing metropolitan grids to sustain concurrent EV peak loads without regional dynamic stability losses.'
            ) ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                context = EXCLUDED.context,
                total_budget_crore = EXCLUDED.total_budget_crore,
                primary_challenge = EXCLUDED.primary_challenge;
        """))
        db.commit()
        print("  -> Master India 2040 Scenario inserted/updated.")
    except Exception as e:
        db.rollback()
        print(f"  -> WARNING during scenario metadata entry: {e}")

    # Step 4: Populate/Sync 25 Substations
    print("\n[Step 4] Seeding 25 Primary High-Voltage Substations...")
    substations_payload = [
        {"id": "sub-1", "name": "Mumbai West Gas-Insulated Substation", "voltage_kv": 400, "region": "West Region", "capacity_mw": 1200.0, "current_load_mw": 936.0, "utilization_pct": 78.0, "health_index": 82.0, "risk_score": 0.18, "recommended_upgrade": "Active Phase Compensator deployment & GIS Elevators", "upgrade_cost_crore": 350.0},
        {"id": "sub-2", "name": "Delhi NCR Grid Exchange Substation", "voltage_kv": 765, "region": "North Region", "capacity_mw": 2000.0, "current_load_mw": 1720.0, "utilization_pct": 86.0, "health_index": 84.0, "risk_score": 0.22, "recommended_upgrade": "Dynamic Line Rating controls & SCADA integration", "upgrade_cost_crore": 420.0},
        {"id": "sub-3", "name": "Chennai Coastal Switching Substation", "voltage_kv": 400, "region": "South Region", "capacity_mw": 1000.0, "current_load_mw": 610.0, "utilization_pct": 61.0, "health_index": 68.0, "risk_score": 0.28, "recommended_upgrade": "GIS Elevation, floodwalls & maritime barrier coating", "upgrade_cost_crore": 280.0},
        {"id": "sub-4", "name": "Nagpur Inter-regional Transmission Hub", "voltage_kv": 400, "region": "Central Region", "capacity_mw": 1500.0, "current_load_mw": 780.0, "utilization_pct": 52.0, "health_index": 92.0, "risk_score": 0.05, "recommended_upgrade": "Automatic sectionalizing smart breaker loop", "upgrade_cost_crore": 120.0},
        {"id": "sub-5", "name": "Ahmedabad Urban Power Distribution Node", "voltage_kv": 220, "region": "West Region", "capacity_mw": 800.0, "current_load_mw": 536.0, "utilization_pct": 67.0, "health_index": 88.0, "risk_score": 0.12, "recommended_upgrade": "Distributed STATCOM active control installation", "upgrade_cost_crore": 190.0},
        {"id": "sub-6", "name": "Pune Hinjewadi Tech-Park Substation", "voltage_kv": 220, "region": "West Region", "capacity_mw": 600.0, "current_load_mw": 516.0, "utilization_pct": 86.0, "health_index": 79.0, "risk_score": 0.19, "recommended_upgrade": "Smart Battery Buffer Suite for high density peak shave", "upgrade_cost_crore": 150.0},
        {"id": "sub-7", "name": "Bangalore Whitefield Digital Grid Node", "voltage_kv": 400, "region": "South Region", "capacity_mw": 1100.0, "current_load_mw": 913.0, "utilization_pct": 83.0, "health_index": 85.0, "risk_score": 0.15, "recommended_upgrade": "D-STATCOM & secondary route tie-ins", "upgrade_cost_crore": 260.0},
        {"id": "sub-8", "name": "Hyderabad Gachibowli Gateway Substation", "voltage_kv": 220, "region": "South Region", "capacity_mw": 750.0, "current_load_mw": 495.0, "utilization_pct": 66.0, "health_index": 91.0, "risk_score": 0.08, "recommended_upgrade": "Demand Side Management server integration", "upgrade_cost_crore": 110.0},
        {"id": "sub-9", "name": "Kolkata SaltLake Metro Distribution Node", "voltage_kv": 220, "region": "East Region", "capacity_mw": 700.0, "current_load_mw": 588.0, "utilization_pct": 84.0, "health_index": 64.0, "risk_score": 0.31, "recommended_upgrade": "Underground ring main cables & gas insulation", "upgrade_cost_crore": 210.0},
        {"id": "sub-10", "name": "Guwahati Eastern Inter-tie Substation", "voltage_kv": 400, "region": "East Region", "capacity_mw": 900.0, "current_load_mw": 405.0, "utilization_pct": 45.0, "health_index": 74.0, "risk_score": 0.14, "recommended_upgrade": "Light-sensing autonomous recloser loops", "upgrade_cost_crore": 160.0},
        {"id": "sub-11", "name": "Patna Central Domestic Grid Base", "voltage_kv": 220, "region": "East Region", "capacity_mw": 500.0, "current_load_mw": 440.0, "utilization_pct": 88.0, "health_index": 71.0, "risk_score": 0.24, "recommended_upgrade": "Re-conducting high thermal capacity cables", "upgrade_cost_crore": 130.0},
        {"id": "sub-12", "name": "Bhopal Central Exchange Substation", "voltage_kv": 400, "region": "Central Region", "capacity_mw": 1200.0, "current_load_mw": 648.0, "utilization_pct": 54.0, "health_index": 89.0, "risk_score": 0.06, "recommended_upgrade": "Secondary reactive power capacitor sets", "upgrade_cost_crore": 140.0},
        {"id": "sub-13", "name": "Jabalpur Trunk Inter-tie Substation", "voltage_kv": 765, "region": "Central Region", "capacity_mw": 1800.0, "current_load_mw": 1170.0, "utilization_pct": 65.0, "health_index": 86.0, "risk_score": 0.11, "recommended_upgrade": "Continuous telemetry oil temperature gauges", "upgrade_cost_crore": 290.0},
        {"id": "sub-14", "name": "Jaipur Solar Integration Substation", "voltage_kv": 400, "region": "North Region", "capacity_mw": 1400.0, "current_load_mw": 1190.0, "utilization_pct": 85.0, "health_index": 80.0, "risk_score": 0.21, "recommended_upgrade": "Fast-responding STATCOM generator coupling", "upgrade_cost_crore": 240.0},
        {"id": "sub-15", "name": "Jodhpur Desert Collector Substation", "voltage_kv": 765, "region": "North Region", "capacity_mw": 2500.0, "current_load_mw": 2125.0, "utilization_pct": 85.0, "health_index": 83.0, "risk_score": 0.17, "recommended_upgrade": "Advanced cooling blower bays & line traps", "upgrade_cost_crore": 410.0},
        {"id": "sub-16", "name": "Lucknow Grid Terminal Substation", "voltage_kv": 400, "region": "North Region", "capacity_mw": 1000.0, "current_load_mw": 790.0, "utilization_pct": 79.0, "health_index": 76.0, "risk_score": 0.16, "recommended_upgrade": "Overhead static earth shield dynamic wires", "upgrade_cost_crore": 180.0},
        {"id": "sub-17", "name": "Surat West-Edge Heavy Industry Substation", "voltage_kv": 400, "region": "West Region", "capacity_mw": 1300.0, "current_load_mw": 1105.0, "utilization_pct": 85.0, "health_index": 81.0, "risk_score": 0.18, "recommended_upgrade": "Harmonic filtering blocks installation", "upgrade_cost_crore": 250.0},
        {"id": "sub-18", "name": "Kochi Marine Terminal Substation", "voltage_kv": 220, "region": "South Region", "capacity_mw": 500.0, "current_load_mw": 320.0, "utilization_pct": 64.0, "health_index": 75.0, "risk_score": 0.22, "recommended_upgrade": "Heavy-duty epoxy insulations to resist salt wind", "upgrade_cost_crore": 120.0},
        {"id": "sub-19", "name": "Bhubaneswar Coastal Grid Aggregator", "voltage_kv": 400, "region": "East Region", "capacity_mw": 950.0, "current_load_mw": 589.0, "utilization_pct": 62.0, "health_index": 73.0, "risk_score": 0.25, "recommended_upgrade": "Concrete structural foundation reinforcement", "upgrade_cost_crore": 170.0},
        {"id": "sub-20", "name": "Ranchi Industrial Collector Substation", "voltage_kv": 400, "region": "East Region", "capacity_mw": 1100.0, "current_load_mw": 858.0, "utilization_pct": 78.0, "health_index": 80.0, "risk_score": 0.13, "recommended_upgrade": "Solid state transformer pilot modules", "upgrade_cost_crore": 200.0},
        {"id": "sub-21", "name": "Indore West central Bulk-power Node", "voltage_kv": 400, "region": "Central Region", "capacity_mw": 1050.0, "current_load_mw": 661.0, "utilization_pct": 63.0, "health_index": 90.0, "risk_score": 0.07, "recommended_upgrade": "Standard maintenance cycle optimization", "upgrade_cost_crore": 130.0},
        {"id": "sub-22", "name": "Visakhapatnam Steel City Substation", "voltage_kv": 400, "region": "South Region", "capacity_mw": 1250.0, "current_load_mw": 975.0, "utilization_pct": 78.0, "health_index": 82.0, "risk_score": 0.16, "recommended_upgrade": "Active voltage restorer system integration", "upgrade_cost_crore": 230.0},
        {"id": "sub-23", "name": "Jamshedpur Heavy-Metallurgy Grid Exchange", "voltage_kv": 400, "region": "East Region", "capacity_mw": 1600.0, "current_load_mw": 1312.0, "utilization_pct": 82.0, "health_index": 81.0, "risk_score": 0.17, "recommended_upgrade": "Redundant bypass bus-bar architecture link", "upgrade_cost_crore": 300.0},
        {"id": "sub-24", "name": "Rajkot Solar-Wind Local Pooling Base", "voltage_kv": 220, "region": "West Region", "capacity_mw": 800.0, "current_load_mw": 520.0, "utilization_pct": 65.0, "health_index": 87.0, "risk_score": 0.10, "recommended_upgrade": "Battery buffer expansion and telemetry links", "upgrade_cost_crore": 140.0},
        {"id": "sub-25", "name": "Amritsar Northwest Boundary Exchange", "voltage_kv": 220, "region": "North Region", "capacity_mw": 600.0, "current_load_mw": 360.0, "utilization_pct": 60.0, "health_index": 84.0, "risk_score": 0.12, "recommended_upgrade": "Remote telemetry and drone mapping lines", "upgrade_cost_crore": 110.0}
    ]

    for item in substations_payload:
        status_val = "OPERATIONAL"
        if item["health_index"] < 70.0:
            status_val = "FAILURE" if item["health_index"] < 50.0 else "WARNING"
        
        # 1. ORM model insertion/upsert
        sub_obj = db.query(Substation).filter(Substation.id == item["id"]).first()
        if not sub_obj:
            sub_obj = Substation(id=item["id"])
            db.add(sub_obj)
        sub_obj.name = item["name"]
        sub_obj.region = item["region"]
        sub_obj.capacity_mw = item["capacity_mw"]
        sub_obj.current_load_mw = item["current_load_mw"]
        sub_obj.health_index = item["health_index"]
        sub_obj.failure_risk = item["risk_score"]
        sub_obj.is_critical = item["capacity_mw"] >= 1500.0
        sub_obj.status = status_val
        sub_obj.updated_at = datetime.datetime.utcnow()

        # 2. Raw SQL table seeding
        try:
            db.execute(text("""
                INSERT INTO substations (id, name, voltage_kv, region, capacity_mw, current_load_mw, utilization_pct, health_index, risk_score, recommended_upgrade, upgrade_cost_crore)
                VALUES (:id, :name, :voltage_kv, :region, :capacity_mw, :current_load_mw, :utilization_pct, :health_index, :risk_score, :recommended_upgrade, :upgrade_cost_crore)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    current_load_mw = EXCLUDED.current_load_mw,
                    utilization_pct = EXCLUDED.utilization_pct,
                    health_index = EXCLUDED.health_index,
                    risk_score = EXCLUDED.risk_score,
                    recommended_upgrade = EXCLUDED.recommended_upgrade,
                    upgrade_cost_crore = EXCLUDED.upgrade_cost_crore;
            """), item)
        except Exception as e:
            # Table might fail if not fully PostgreSQL
            pass

    db.commit()
    print("  -> 25 primary high-voltage substations seeded.")

    # Step 5: Seeding 14 Transmission Corridors
    print("\n[Step 5] Seeding 14 Transmission Corridors...")
    corridors_payload = [
        {"id": "corr-1", "name": "Western Desert Renewable HVDC Trunkline", "voltage_kv": 800, "corridor_type": "HVDC", "capacity_mw": 3000.00, "active_load_mw": 2450.00, "length_km": 420, "regional_span": "West to North", "health_pct": 98.40, "risk_score": 0.05, "reliability_index": 99.96, "source": "sub-15", "target": "sub-2"},
        {"id": "corr-2", "name": "Bhadla-NCR High Tension AC Highway", "voltage_kv": 765, "corridor_type": "UHV-AC", "capacity_mw": 2500.00, "active_load_mw": 2150.00, "length_km": 280, "regional_span": "West to North", "health_pct": 92.10, "risk_score": 0.18, "reliability_index": 99.81, "source": "sub-15", "target": "sub-2"},
        {"id": "corr-3", "name": "Satpura Central-South Inter-regional Corridor", "voltage_kv": 400, "corridor_type": "HV-AC", "capacity_mw": 1800.00, "active_load_mw": 1410.00, "length_km": 310, "regional_span": "Central to South", "health_pct": 89.60, "risk_score": 0.12, "reliability_index": 99.78, "source": "sub-12", "target": "sub-7"},
        {"id": "corr-4", "name": "Coastal Vindhyachal Energy Highway", "voltage_kv": 400, "corridor_type": "HV-AC", "capacity_mw": 1600.00, "active_load_mw": 1210.00, "length_km": 240, "regional_span": "East to West", "health_pct": 84.30, "risk_score": 0.22, "reliability_index": 99.45, "source": "sub-20", "target": "sub-5"},
        {"id": "corr-5", "name": "Kutch Offshore Grid-to-Land collector Trunk", "voltage_kv": 400, "corridor_type": "HV-AC", "capacity_mw": 1500.00, "active_load_mw": 1180.00, "length_km": 85, "regional_span": "Offshore-Gujarat", "health_pct": 94.00, "risk_score": 0.14, "reliability_index": 99.88, "source": "sub-24", "target": "sub-5"},
        {"id": "corr-6", "name": "Western Ghats High Peak Link Line 2", "voltage_kv": 220, "corridor_type": "HV-AC", "capacity_mw": 800.00, "active_load_mw": 736.00, "length_km": 140, "regional_span": "Inside West", "health_pct": 76.80, "risk_score": 0.29, "reliability_index": 99.12, "source": "sub-6", "target": "sub-1"},
        {"id": "corr-7", "name": "Bangalore-Chennai Ultra Load Tie", "voltage_kv": 400, "corridor_type": "HV-AC", "capacity_mw": 1400.00, "active_load_mw": 1190.00, "length_km": 190, "regional_span": "South", "health_pct": 91.20, "risk_score": 0.11, "reliability_index": 99.82, "source": "sub-7", "target": "sub-3"},
        {"id": "corr-8", "name": "Central India Coal Belt Evacuation Line", "voltage_kv": 765, "corridor_type": "UHV-AC", "capacity_mw": 2400.00, "active_load_mw": 1810.00, "length_km": 350, "regional_span": "East to Central", "health_pct": 88.40, "risk_score": 0.15, "reliability_index": 99.74, "source": "sub-23", "target": "sub-13"},
        {"id": "corr-9", "name": "Gopalpur-Coastal Corrosive Switching Link", "voltage_kv": 220, "corridor_type": "HV-AC", "capacity_mw": 600.00, "active_load_mw": 410.00, "length_km": 95, "regional_span": "East Coastal", "health_pct": 74.20, "risk_score": 0.35, "reliability_index": 98.92, "source": "sub-19", "target": "sub-22"},
        {"id": "corr-10", "name": "Narmada River Valley Double Circuit Link", "voltage_kv": 400, "corridor_type": "HV-AC", "capacity_mw": 1200.00, "active_load_mw": 890.00, "length_km": 125, "regional_span": "West to Central", "health_pct": 93.50, "risk_score": 0.08, "reliability_index": 99.89, "source": "sub-17", "target": "sub-21"},
        {"id": "corr-11", "name": "Muppandal-Tuticorin High Output Wind Link", "voltage_kv": 220, "corridor_type": "HV-AC", "capacity_mw": 900.00, "active_load_mw": 792.00, "length_km": 75, "regional_span": "Inside South", "health_pct": 91.00, "risk_score": 0.10, "reliability_index": 99.86, "source": "sub-18", "target": "sub-22"},
        {"id": "corr-12", "name": "Guwahati Brahmaputra River Span Crossing", "voltage_kv": 400, "corridor_type": "HV-AC", "capacity_mw": 1000.00, "active_load_mw": 450.00, "length_km": 60, "regional_span": "East Northeast", "health_pct": 83.10, "risk_score": 0.24, "reliability_index": 99.30, "source": "sub-10", "target": "sub-11"},
        {"id": "corr-13", "name": "Jodhpur-Jaipur Solar Collector Trunk Line", "voltage_kv": 765, "corridor_type": "UHV-AC", "capacity_mw": 2000.00, "active_load_mw": 1720.00, "length_km": 210, "regional_span": "North Northwest", "health_pct": 94.60, "risk_score": 0.09, "reliability_index": 99.91, "source": "sub-15", "target": "sub-14"},
        {"id": "corr-14", "name": "Lucknow-Bihar Subsegment Interconnector", "voltage_kv": 400, "corridor_type": "HV-AC", "capacity_mw": 1100.00, "active_load_mw": 902.00, "length_km": 165, "regional_span": "North to East", "health_pct": 85.90, "risk_score": 0.21, "reliability_index": 99.52, "source": "sub-16", "target": "sub-11"}
    ]

    for item in corridors_payload:
        # 1. ORM model insertion/upsert
        line_status = "ONLINE"
        if item["active_load_mw"] >= item["capacity_mw"] * 0.9:
            line_status = "CONGESTED"
        elif item["health_pct"] < 60.0:
            line_status = "OFFLINE"

        line_obj = db.query(TransmissionLine).filter(TransmissionLine.id == item["id"]).first()
        if not line_obj:
            line_obj = TransmissionLine(id=item["id"])
            db.add(line_obj)
        line_obj.source_substation_id = item["source"]
        line_obj.target_substation_id = item["target"]
        line_obj.voltage_kv = item["voltage_kv"]
        line_obj.capacity_mw = item["capacity_mw"]
        line_obj.current_flow_mw = item["active_load_mw"]
        line_obj.status = line_status
        line_obj.length_km = float(item["length_km"])

        # 2. Raw SQL table seeding
        try:
            db.execute(text("""
                INSERT INTO transmission_corridors (id, name, voltage_kv, corridor_type, capacity_mw, active_load_mw, length_km, regional_span, health_pct, risk_score, reliability_index)
                VALUES (:id, :name, :voltage_kv, :corridor_type, :capacity_mw, :active_load_mw, :length_km, :regional_span, :health_pct, :risk_score, :reliability_index)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    active_load_mw = EXCLUDED.active_load_mw,
                    health_pct = EXCLUDED.health_pct,
                    risk_score = EXCLUDED.risk_score,
                    reliability_index = EXCLUDED.reliability_index;
            """), item)
        except Exception as e:
            pass

    db.commit()
    print("  -> 14 high-voltage transmission corridors/lines seeded.")

    # Step 6: Seeding 13 Utility-Scale Renewable Assets
    print("\n[Step 6] Seeding 13 Utility-Scale Renewable Assets...")
    renewables_payload = [
        {"id": "ren-sol-1", "name": "Bhadla Mega Solar Park Phase IV", "asset_type": "SOLAR", "state": "Rajasthan", "capacity_mw": 2245.00, "current_generation_mw": 1910.00, "capacity_utilization_pct": 24.50, "health_index": 94.00, "connection_endpoint": "Jodhpur Collector Substation"},
        {"id": "ren-sol-2", "name": "Kutch Ultra Mega Renewable Sun Array", "asset_type": "SOLAR", "state": "Gujarat", "capacity_mw": 1500.00, "current_generation_mw": 1280.00, "capacity_utilization_pct": 25.00, "health_index": 91.00, "connection_endpoint": "Kutch Collector Substation"},
        {"id": "ren-sol-3", "name": "Pavagada Solar Complex Park", "asset_type": "SOLAR", "state": "Karnataka", "capacity_mw": 2050.00, "current_generation_mw": 1620.00, "capacity_utilization_pct": 23.80, "health_index": 89.00, "connection_endpoint": "Bangalore Whitefield Grid"},
        {"id": "ren-sol-4", "name": "Rewa Mega Photovoltaic Array", "asset_type": "SOLAR", "state": "Madhya Pradesh", "capacity_mw": 750.00, "current_generation_mw": 610.00, "capacity_utilization_pct": 22.10, "health_index": 92.00, "connection_endpoint": "Jabalpur Trunk Substation"},
        {"id": "ren-sol-5", "name": "Kurnool Ultra Solar Cluster Base", "asset_type": "SOLAR", "state": "Andhra Pradesh", "capacity_mw": 1000.00, "current_generation_mw": 830.00, "capacity_utilization_pct": 24.20, "health_index": 87.00, "connection_endpoint": "Chennai Coastal Switching"},
        {"id": "ren-sol-6", "name": "Kadapa Renewable Sun Farm II", "asset_type": "SOLAR", "state": "Andhra Pradesh", "capacity_mw": 750.00, "current_generation_mw": 590.00, "capacity_utilization_pct": 23.00, "health_index": 88.00, "connection_endpoint": "Hyderabad Gachibowli Gateway"},
        {"id": "ren-wnd-1", "name": "Muppandal Extreme Output Wind Park", "asset_type": "WIND", "state": "Tamil Nadu", "capacity_mw": 1500.00, "current_generation_mw": 1125.00, "capacity_utilization_pct": 36.50, "health_index": 84.00, "connection_endpoint": "Kochi Marine Terminal"},
        {"id": "ren-wnd-2", "name": "Jaisalmer Ridge Wind Generator Complex", "asset_type": "WIND", "state": "Rajasthan", "capacity_mw": 1064.00, "current_generation_mw": 798.00, "capacity_utilization_pct": 34.00, "health_index": 86.00, "connection_endpoint": "Jodhpur Collector Substation"},
        {"id": "ren-wnd-3", "name": "Kutch Coastal Offshore Wind Cluster", "asset_type": "WIND", "state": "Gujarat", "capacity_mw": 950.00, "current_generation_mw": 665.00, "capacity_utilization_pct": 38.00, "health_index": 82.00, "connection_endpoint": "Kutch Collector Substation"},
        {"id": "ren-wnd-4", "name": "Western Ghats Ridge-line Wind Corridor", "asset_type": "WIND", "state": "Maharashtra", "capacity_mw": 600.00, "current_generation_mw": 420.00, "capacity_utilization_pct": 32.50, "health_index": 90.00, "connection_endpoint": "Pune Hinjewadi Substation"},
        {"id": "rhy-hyd-1", "name": "Tehri Dam Pumped Peaking Hydro Facility", "asset_type": "HYDRO", "state": "Uttarakhand", "capacity_mw": 1000.00, "current_generation_mw": 850.00, "capacity_utilization_pct": 48.00, "health_index": 95.00, "connection_endpoint": "Delhi NCR Grid Exchange"},
        {"id": "rhy-hyd-2", "name": "Koyna Major Hydroelectric Power Station", "asset_type": "HYDRO", "state": "Maharashtra", "capacity_mw": 1960.00, "current_generation_mw": 1570.00, "capacity_utilization_pct": 42.00, "health_index": 93.00, "connection_endpoint": "Mumbai West Substation"},
        {"id": "rhy-hyd-3", "name": "Bhakra Nangal Dam Base-Peaker Reservoir", "asset_type": "HYDRO", "state": "Punjab", "capacity_mw": 1325.00, "current_generation_mw": 1060.00, "capacity_utilization_pct": 52.00, "health_index": 89.00, "connection_endpoint": "Amritsar Northwest Boundary"}
    ]

    for item in renewables_payload:
        # 1. ORM Seeding
        ren_obj = db.query(RenewableAsset).filter(RenewableAsset.id == item["id"]).first()
        if not ren_obj:
            ren_obj = RenewableAsset(id=item["id"])
            db.add(ren_obj)
        ren_obj.name = item["name"]
        ren_obj.type = item["asset_type"]
        ren_obj.capacity_mw = item["capacity_mw"]
        ren_obj.current_generation_mw = item["current_generation_mw"]
        ren_obj.efficiency = max(0.1, min(1.0, item["capacity_utilization_pct"] / 100.0 * 2.5)) # calculated efficiency multiplier
        ren_obj.status = "ACTIVE" if item["health_index"] >= 80.0 else "DEGRADED"

        # 2. Raw SQL Seeding
        try:
            db.execute(text("""
                INSERT INTO renewable_assets (id, name, asset_type, state, capacity_mw, current_generation_mw, capacity_utilization_pct, health_index, connection_endpoint)
                VALUES (:id, :name, :asset_type, :state, :capacity_mw, :current_generation_mw, :capacity_utilization_pct, :health_index, :connection_endpoint)
                ON CONFLICT (id) DO UPDATE SET
                    current_generation_mw = EXCLUDED.current_generation_mw,
                    health_index = EXCLUDED.health_index,
                    capacity_utilization_pct = EXCLUDED.capacity_utilization_pct;
            """), item)
        except Exception as e:
            pass

    db.commit()
    print("  -> 13 clean renewable generation assets seeded successfully.")

    # Step 7: Seeding 4 Modernization Strategies (Master Scenario Deliverable)
    print("\n[Step 7] Seeding 4 Modernization Strategies...")
    strategies_payload = [
        {
            "id": "strat-1",
            "strategy_name": "Carbon Neutral Fast Track",
            "description": "Aggressively install decentralized solar grids, utility wind arrays, and cross-state interties. Optimizes purely for emission limits reduction by fast-tracking solar-wind deployments with higher initial capex margins.",
            "total_cost_cr": 9200.0,
            "renewable_penetration_pct": 87.5,
            "reliability_gain_pct": 8.5,
            "carbon_reduction_pct": 95.0,
            "risk_score": 35.5,
            "stakeholder_alignment_score": 76.5,
            "investment_priority": "HIGH"
        },
        {
            "id": "strat-2",
            "strategy_name": "Resilient Microgrid Expansion",
            "description": "Prioritize grid hardening, GIS substation replacements, and localized ring-bus configurations with heavy microgrid storage to protect manufacturing regions and weather severe conditions safely.",
            "total_cost_cr": 7200.0,
            "renewable_penetration_pct": 52.5,
            "reliability_gain_pct": 16.8,
            "carbon_reduction_pct": 42.0,
            "risk_score": 12.5,
            "stakeholder_alignment_score": 84.0,
            "investment_priority": "CRITICAL"
        },
        {
            "id": "strat-3",
            "strategy_name": "Capital Preservation Plan",
            "description": "Defer non-critical line expansions and avoid major storage rollouts. Focus purely on thermal conductor cleaning, physical tree trim clearing, and baseline substation transformer maintenance.",
            "total_cost_cr": 3600.0,
            "renewable_penetration_pct": 35.0,
            "reliability_gain_pct": 3.2,
            "carbon_reduction_pct": 25.0,
            "risk_score": 65.0,
            "stakeholder_alignment_score": 64.5,
            "investment_priority": "LOW"
        },
        {
            "id": "strat-4",
            "strategy_name": "Pragmatic Compromise Council Plan",
            "description": "A carefully structured hybrid plan allocating balanced funds to smart dynamic transformers, localized storage clusters, and medium-scale wind farms to assure collective multi-agent policy backing.",
            "total_cost_cr": 6400.0,
            "renewable_penetration_pct": 66.5,
            "reliability_gain_pct": 12.4,
            "carbon_reduction_pct": 60.0,
            "risk_score": 18.0,
            "stakeholder_alignment_score": 92.5,
            "investment_priority": "HIGH"
        }
    ]

    for strat in strategies_payload:
        # 1. ORM Seeding
        strat_obj = db.query(ModernizationStrategyModel).filter(ModernizationStrategyModel.id == strat["id"]).first()
        if not strat_obj:
            strat_obj = ModernizationStrategyModel(id=strat["id"])
            db.add(strat_obj)
        strat_obj.strategy_name = strat["strategy_name"]
        strat_obj.description = strat["description"]
        strat_obj.total_cost_cr = strat["total_cost_cr"]
        strat_obj.renewable_penetration_pct = strat["renewable_penetration_pct"]
        strat_obj.reliability_gain_pct = strat["reliability_gain_pct"]
        strat_obj.carbon_reduction_pct = strat["carbon_reduction_pct"]
        strat_obj.risk_score = strat["risk_score"]
        strat_obj.stakeholder_alignment_score = strat["stakeholder_alignment_score"]
        strat_obj.investment_priority = strat["investment_priority"]

        # 2. Raw SQL Seeding
        try:
            db.execute(text("""
                INSERT INTO modernization_strategies (id, strategy_name, description, total_cost_cr, renewable_penetration_pct, reliability_gain_pct, carbon_reduction_pct, risk_score, stakeholder_alignment_score, investment_priority)
                VALUES (:id, :strategy_name, :description, :total_cost_cr, :renewable_penetration_pct, :reliability_gain_pct, :carbon_reduction_pct, :risk_score, :stakeholder_alignment_score, :investment_priority)
                ON CONFLICT (id) DO UPDATE SET
                    strategy_name = EXCLUDED.strategy_name,
                    description = EXCLUDED.description,
                    total_cost_cr = EXCLUDED.total_cost_cr,
                    renewable_penetration_pct = EXCLUDED.renewable_penetration_pct,
                    reliability_gain_pct = EXCLUDED.reliability_gain_pct,
                    carbon_reduction_pct = EXCLUDED.carbon_reduction_pct,
                    risk_score = EXCLUDED.risk_score,
                    stakeholder_alignment_score = EXCLUDED.stakeholder_alignment_score,
                    investment_priority = EXCLUDED.investment_priority;
            """), strat)
        except Exception as e:
            pass

    db.commit()
    print("  -> 4 designated modernization strategies successfully seeded.")

    # Step 8: Seeding 9 Proposed Portfolio Projects
    print("\n[Step 8] Seeding Proposed Prioritized Portfolio Projects...")
    proposed_projects_payload = [
        {"id": "proj-1", "name": "Bhadla-Delhi 800kV Green HVDC link", "category": "TRANSMISSION", "region": "North Region", "cost_crore": 1450.00, "expected_roi_pct": 14.80, "reliability_impact": "CRITICAL", "priority_score": 9.60, "carbon_impact": "HIGH", "community_benefit": 9},
        {"id": "proj-2", "name": "Kutch Desert BESS Fortification", "category": "RESILIENCY", "region": "West Region", "cost_crore": 1120.00, "expected_roi_pct": 13.50, "reliability_impact": "HIGH", "priority_score": 9.20, "carbon_impact": "HIGH", "community_benefit": 8},
        {"id": "proj-3", "name": "Mumbai EV Fast-Charger Mesh Gateway", "category": "DISTRIBUTION", "region": "West Region", "cost_crore": 650.00, "expected_roi_pct": 11.20, "reliability_impact": "HIGH", "priority_score": 8.70, "carbon_impact": "HIGH", "community_benefit": 10},
        {"id": "proj-4", "name": "Chennai Coastal GIS Marine Flooding Protection", "category": "SECURITY", "region": "South Region", "cost_crore": 450.00, "expected_roi_pct": 8.50, "reliability_impact": "CRITICAL", "priority_score": 8.90, "carbon_impact": "LOW", "community_benefit": 7},
        {"id": "proj-5", "name": "Muppandal Wind Inter-tie Dynamic Capacity Upgrades", "category": "TRANSMISSION", "region": "South Region", "cost_crore": 580.00, "expected_roi_pct": 12.40, "reliability_impact": "MEDIUM", "priority_score": 7.80, "carbon_impact": "HIGH", "community_benefit": 8},
        {"id": "proj-6", "name": "Bangalore Smart-Grid Edge AMI Mesh V2", "category": "DISTRIBUTION", "region": "South Region", "cost_crore": 720.00, "expected_roi_pct": 9.60, "reliability_impact": "MEDIUM", "priority_score": 7.50, "carbon_impact": "MEDIUM", "community_benefit": 9},
        {"id": "proj-7", "name": "Central-East Cross-Regional Inter-tie Reinforcement", "category": "TRANSMISSION", "region": "Central Region", "cost_crore": 1250.00, "expected_roi_pct": 10.50, "reliability_impact": "HIGH", "priority_score": 8.20, "carbon_impact": "LOW", "community_benefit": 6},
        {"id": "proj-8", "name": "Rural Microgrid Autonomy Loop (20 Solar Villages)", "category": "RESILIENCY", "region": "East Region", "cost_crore": 380.00, "expected_roi_pct": 11.90, "reliability_impact": "HIGH", "priority_score": 8.80, "carbon_impact": "HIGH", "community_benefit": 10},
        {"id": "proj-9", "name": "PM-KUSUM Agri-Solar Grid Edge Integration - Ahmedabad", "category": "DISTRIBUTION", "region": "West Region", "cost_crore": 490.00, "expected_roi_pct": 13.10, "reliability_impact": "MEDIUM", "priority_score": 8.00, "carbon_impact": "HIGH", "community_benefit": 10}
    ]

    for proj in proposed_projects_payload:
        # 1. ORM Seeding
        proj_obj = db.query(PrioritizedProjectModel).filter(PrioritizedProjectModel.id == proj["id"]).first()
        if not proj_obj:
            proj_obj = PrioritizedProjectModel(id=proj["id"])
            db.add(proj_obj)
        proj_obj.name = proj["name"]
        proj_obj.category = proj["category"]
        proj_obj.region = proj["region"]
        proj_obj.cost = proj["cost_crore"]
        proj_obj.roi = proj["expected_roi_pct"]
        proj_obj.reliability_impact = proj["reliability_impact"]
        proj_obj.priority_score = proj["priority_score"] * 10.0 # scale to matching baseline
        proj_obj.carbon_impact = proj["carbon_impact"]
        proj_obj.community_benefit = proj["community_benefit"]
        proj_obj.selected = True if proj["priority_score"] >= 8.5 else False

        # 2. Raw SQL Seeding
        try:
            db.execute(text("""
                INSERT INTO proposed_projects (id, name, category, region, cost_crore, expected_roi_pct, reliability_impact, priority_score, carbon_impact, community_benefit)
                VALUES (:id, :name, :category, :region, :cost_crore, :expected_roi_pct, :reliability_impact, :priority_score, :carbon_impact, :community_benefit)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    priority_score = EXCLUDED.priority_score,
                    expected_roi_pct = EXCLUDED.expected_roi_pct;
            """), proj)
        except Exception as e:
            pass

    db.commit()
    print("  -> Prioritized proposed list of projects successfully seeded.")

    db.close()
    print("\n=====================================================================")
    print(" CASSANDRA GRIDOS - DATASET SEED SUCCESSFUL! DEMO GRID READY.")
    print("=====================================================================")

if __name__ == "__main__":
    run_seed()

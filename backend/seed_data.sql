-- =====================================================================
-- CASSANDRA GRIDOS - ENTERPRISE GRID PLANNING ARCHITECTURE
-- MASTER DEMO DATASET SEED SCRIPT
-- SCENARIO: India 2040 Renewable Transition
-- =====================================================================

-- -------------------------------------------------------------
-- 1. SCENARIO PROFILE METADATA
-- -------------------------------------------------------------
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


-- -------------------------------------------------------------
-- 2. PRIMARY HIGH-VOLTAGE SUBSTATIONS (25 Assets)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS substations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    voltage_kv INT NOT NULL,
    region VARCHAR(100) NOT NULL,
    capacity_mw NUMERIC(10,2) NOT NULL,
    current_load_mw NUMERIC(10,2) NOT NULL,
    utilization_pct NUMERIC(5,2) NOT NULL,
    health_index NUMERIC(5,2) NOT NULL,
    risk_score NUMERIC(4,2) NOT NULL,
    recommended_upgrade VARCHAR(255),
    upgrade_cost_crore NUMERIC(12,2) NOT NULL
);

INSERT INTO substations (id, name, voltage_kv, region, capacity_mw, current_load_mw, utilization_pct, health_index, risk_score, recommended_upgrade, upgrade_cost_crore) VALUES
('sub-1', 'Mumbai West Gas-Insulated Substation', 400, 'West Region', 1200.00, 936.00, 78.00, 82.00, 0.18, 'Active Phase Compensator deployment & GIS Elevators', 350.00),
('sub-2', 'Delhi NCR Grid Exchange Substation', 765, 'North Region', 2000.00, 1720.00, 86.00, 84.00, 0.22, 'Dynamic Line Rating controls & SCADA integration', 420.00),
('sub-3', 'Chennai Coastal Switching Substation', 400, 'South Region', 1000.00, 610.00, 61.00, 68.00, 0.28, 'GIS Elevation, floodwalls & maritime barrier coating', 280.00),
('sub-4', 'Nagpur Inter-regional Transmission Hub', 400, 'Central Region', 1500.00, 780.00, 52.00, 92.00, 0.05, 'Automatic sectionalizing smart breaker loop', 120.00),
('sub-5', 'Ahmedabad Urban Power Distribution Node', 220, 'West Region', 800.00, 536.00, 67.00, 88.00, 0.12, 'Distributed STATCOM active control installation', 190.00),
('sub-6', 'Pune Hinjewadi Tech-Park Substation', 220, 'West Region', 600.00, 516.00, 86.00, 79.00, 0.19, 'Smart Battery Buffer Suite for high density peak shave', 150.00),
('sub-7', 'Bangalore Whitefield Digital Grid Node', 400, 'South Region', 1100.00, 913.00, 83.00, 85.00, 0.15, 'D-STATCOM & secondary route tie-ins', 260.00),
('sub-8', 'Hyderabad Gachibowli Gateway Substation', 220, 'South Region', 750.00, 495.00, 66.00, 91.00, 0.08, 'Demand Side Management server integration', 110.00),
('sub-9', 'Kolkata SaltLake Metro Distribution Node', 220, 'East Region', 700.00, 588.00, 84.00, 64.00, 0.31, 'Underground ring main cables & gas insulation', 210.00),
('sub-10', 'Guwahati Eastern Inter-tie Substation', 400, 'East Region', 900.00, 405.00, 45.00, 74.00, 0.14, 'Light-sensing autonomous recloser loops', 160.00),
('sub-11', 'Patna Central Domestic Grid Base', 220, 'East Region', 500.00, 440.00, 88.00, 71.00, 0.24, 'Re-conducting high thermal capacity cables', 130.00),
('sub-12', 'Bhopal Central Exchange Substation', 400, 'Central Region', 1200.00, 648.00, 54.00, 89.00, 0.06, 'Secondary reactive power capacitor sets', 140.00),
('sub-13', 'Jabalpur Trunk Inter-tie Substation', 765, 'Central Region', 1800.00, 1170.00, 65.00, 86.00, 0.11, 'Continuous telemetry oil temperature gauges', 290.00),
('sub-14', 'Jaipur Solar Integration Substation', 400, 'North Region', 1400.00, 1190.00, 85.00, 80.00, 0.21, 'Fast-responding STATCOM generator coupling', 240.00),
('sub-15', 'Jodhpur Desert Collector Substation', 765, 'North Region', 2500.00, 2125.00, 85.00, 83.00, 0.17, 'Advanced cooling blower bays & line traps', 410.00),
('sub-16', 'Lucknow Grid Terminal Substation', 400, 'North Region', 1000.00, 790.00, 79.00, 76.00, 0.16, 'Overhead static earth shield dynamic wires', 180.00),
('sub-17', 'Surat West-Edge Heavy Industry Substation', 400, 'West Region', 1300.00, 1105.00, 85.00, 81.00, 0.18, 'Harmonic filtering blocks installation', 250.00),
('sub-18', 'Kochi Marine Terminal Substation', 220, 'South Region', 500.00, 320.00, 64.00, 75.00, 0.22, 'Heavy-duty epoxy insulations to resist salt wind', 120.00),
('sub-19', 'Bhubaneswar Coastal Grid Aggregator', 400, 'East Region', 950.00, 589.00, 62.00, 73.00, 0.25, 'Concrete structural foundation reinforcement', 170.00),
('sub-20', 'Ranchi Industrial Collector Substation', 400, 'East Region', 1100.00, 858.00, 78.00, 80.00, 0.13, 'Solid state transformer pilot modules', 200.00),
('sub-21', 'Indore West central Bulk-power Node', 400, 'Central Region', 1050.00, 661.00, 63.00, 90.00, 0.07, 'Standard maintenance cycle optimization', 130.00),
('sub-22', 'Visakhapatnam Steel City Substation', 400, 'South Region', 1250.00, 975.00, 78.00, 82.00, 0.16, 'Active voltage restorer system integration', 230.00),
('sub-23', 'Jamshedpur Heavy-Metallurgy Grid Exchange', 400, 'East Region', 1600.00, 1312.00, 82.00, 81.00, 0.17, 'Redundant bypass bus-bar architecture link', 300.00),
('sub-24', 'Rajkot Solar-Wind Local Pooling Base', 220, 'West Region', 800.00, 520.00, 65.00, 87.00, 0.10, 'Battery buffer expansion and telemetry links', 140.00),
('sub-25', 'Amritsar Northwest Boundary Exchange', 220, 'North Region', 600.00, 360.00, 60.00, 84.00, 0.12, 'Remote telemetry and drone mapping lines', 110.00)
ON CONFLICT (id) DO UPDATE SET
    current_load_mw = EXCLUDED.current_load_mw,
    utilization_pct = EXCLUDED.utilization_pct,
    health_index = EXCLUDED.health_index,
    risk_score = EXCLUDED.risk_score;


-- -------------------------------------------------------------
-- 3. HIGH-VOLTAGE TRANSMISSION CORRIDORS (14 Corridors)
-- -------------------------------------------------------------
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

INSERT INTO transmission_corridors (id, name, voltage_kv, corridor_type, capacity_mw, active_load_mw, length_km, regional_span, health_pct, risk_score, reliability_index) VALUES
('corr-1', 'Western Desert Renewable HVDC Trunkline', 800, 'HVDC', 3000.00, 2450.00, 420, 'West to North', 98.40, 0.05, 99.96),
('corr-2', 'Bhadla-NCR High Tension AC Highway', 765, 'UHV-AC', 2500.00, 2150.00, 280, 'West to North', 92.10, 0.18, 99.81),
('corr-3', 'Satpura Central-South Inter-regional Corridor', 400, 'HV-AC', 1800.00, 1410.00, 310, 'Central to South', 89.60, 0.12, 99.78),
('corr-4', 'Coastal Vindhyachal Energy Highway', 400, 'HV-AC', 1600.00, 1210.00, 240, 'East to West', 84.30, 0.22, 99.45),
('corr-5', 'Kutch Offshore Grid-to-Land collector Trunk', 400, 'HV-AC', 1500.00, 1180.00, 85, 'Offshore-Gujarat', 94.00, 0.14, 99.88),
('corr-6', 'Western Ghats High Peak Link Line 2', 220, 'HV-AC', 800.00, 736.00, 140, 'Inside West', 76.80, 0.29, 99.12),
('corr-7', 'Bangalore-Chennai Ultra Load Tie', 400, 'HV-AC', 1400.00, 1190.00, 190, 'South', 91.20, 0.11, 99.82),
('corr-8', 'Central India Coal Belt Evacuation Line', 765, 'UHV-AC', 2400.00, 1810.00, 350, 'East to Central', 88.40, 0.15, 99.74),
('corr-9', 'Gopalpur-Coastal Corrosive Switching Link', 220, 'HV-AC', 600.00, 410.00, 95, 'East Coastal', 74.20, 0.35, 98.92),
('corr-10', 'Narmada River Valley Double Circuit Link', 400, 'HV-AC', 1200.00, 890.00, 125, 'West to Central', 93.50, 0.08, 99.89),
('corr-11', 'Muppandal-Tuticorin High Output Wind Link', 220, 'HV-AC', 900.00, 792.00, 75, 'Inside South', 91.00, 0.10, 99.86),
('corr-12', 'Guwahati Brahmaputra River Span Crossing', 400, 'HV-AC', 1000.00, 450.00, 60, 'East Northeast', 83.10, 0.24, 99.30),
('corr-13', 'Jodhpur-Jaipur Solar Collector Trunk Line', 765, 'UHV-AC', 2000.00, 1720.00, 210, 'North Northwest', 94.60, 0.09, 99.91),
('corr-14', 'Lucknow-Bihar Subsegment Interconnector', 400, 'HV-AC', 1100.00, 902.00, 165, 'North to East', 85.90, 0.21, 99.52)
ON CONFLICT (id) DO UPDATE SET
    active_load_mw = EXCLUDED.active_load_mw,
    health_pct = EXCLUDED.health_pct,
    risk_score = EXCLUDED.risk_score,
    reliability_index = EXCLUDED.reliability_index;


-- -------------------------------------------------------------
-- 4. UTILITY-SCALE RENEWABLE ASSETS (13 Mega-Plants)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS renewable_assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- SOLAR, WIND, HYDRO
    state VARCHAR(100) NOT NULL,
    capacity_mw NUMERIC(10,2) NOT NULL,
    current_generation_mw NUMERIC(10,2) NOT NULL,
    capacity_utilization_pct NUMERIC(5,2) NOT NULL,
    health_index NUMERIC(5,2) NOT NULL,
    connection_endpoint VARCHAR(150) NOT NULL
);

INSERT INTO renewable_assets (id, name, asset_type, state, capacity_mw, current_generation_mw, capacity_utilization_pct, health_index, connection_endpoint) VALUES
('ren-sol-1', 'Bhadla Mega Solar Park Phase IV', 'SOLAR', 'Rajasthan', 2245.00, 1910.00, 24.50, 94.00, 'Jodhpur Collector Substation'),
('ren-sol-2', 'Kutch Ultra Mega Renewable Sun Array', 'SOLAR', 'Gujarat', 1500.00, 1280.00, 25.00, 91.00, 'Kutch Collector Substation'),
('ren-sol-3', 'Pavagada Solar Complex Park', 'SOLAR', 'Karnataka', 2050.00, 1620.00, 23.80, 89.00, 'Bangalore Whitefield Grid'),
('ren-sol-4', 'Rewa Mega Photovoltaic Array', 'SOLAR', 'Madhya Pradesh', 750.00, 610.00, 22.10, 92.00, 'Jabalpur Trunk Substation'),
('ren-sol-5', 'Kurnool Ultra Solar Cluster Base', 'SOLAR', 'Andhra Pradesh', 1000.00, 830.00, 24.20, 87.00, 'Chennai Coastal Switching'),
('ren-sol-6', 'Kadapa Renewable Sun Farm II', 'SOLAR', 'Andhra Pradesh', 750.00, 590.00, 23.00, 88.00, 'Hyderabad Gachibowli Gateway'),
('ren-wnd-1', 'Muppandal Extreme Output Wind Park', 'WIND', 'Tamil Nadu', 1500.00, 1125.00, 36.50, 84.00, 'Kochi Marine Terminal'),
('ren-wnd-2', 'Jaisalmer Ridge Wind Generator Complex', 'WIND', 'Rajasthan', 1064.00, 798.00, 34.00, 86.00, 'Jodhpur Collector Substation'),
('ren-wnd-3', 'Kutch Coastal Offshore Wind Cluster', 'WIND', 'Gujarat', 950.00, 665.00, 38.00, 82.00, 'Kutch Collector Substation'),
('ren-wnd-4', 'Western Ghats Ridge-line Wind Corridor', 'WIND', 'Maharashtra', 600.00, 420.00, 32.50, 90.00, 'Pune Hinjewadi Substation'),
('rhy-hyd-1', 'Tehri Dam Pumped Peaking Hydro Facility', 'HYDRO', 'Uttarakhand', 1000.00, 850.00, 48.00, 95.00, 'Delhi NCR Grid Exchange'),
('rhy-hyd-2', 'Koyna Major Hydroelectric Power Station', 'HYDRO', 'Maharashtra', 1960.00, 1570.00, 42.00, 93.00, 'Mumbai West Substation'),
('rhy-hyd-3', 'Bhakra Nangal Dam Base-Peaker Reservoir', 'HYDRO', 'Punjab', 1325.00, 1060.00, 52.00, 89.00, 'Amritsar Northwest Boundary')
ON CONFLICT (id) DO UPDATE SET
    current_generation_mw = EXCLUDED.current_generation_mw,
    health_index = EXCLUDED.health_index;


-- -------------------------------------------------------------
-- 5. PORTFOLIO PROPOSED PROJECTS (30 Projects total - Sample listed below)
-- -------------------------------------------------------------
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

INSERT INTO proposed_projects (id, name, category, region, cost_crore, expected_roi_pct, reliability_impact, priority_score, carbon_impact, community_benefit) VALUES
('proj-1', 'Bhadla-Delhi 800kV Green HVDC link', 'TRANSMISSION', 'North Region', 1450.00, 14.80, 'CRITICAL', 9.60, 'HIGH', 9),
('proj-2', 'Kutch Desert BESS Fortification', 'RESILIENCY', 'West Region', 1120.00, 13.50, 'HIGH', 9.20, 'HIGH', 8),
('proj-3', 'Mumbai EV Fast-Charger Mesh Gateway', 'DISTRIBUTION', 'West Region', 650.00, 11.20, 'HIGH', 8.70, 'HIGH', 10),
('proj-4', 'Chennai Coastal GIS Marine Flooding Protection', 'SECURITY', 'South Region', 450.00, 8.50, 'CRITICAL', 8.90, 'LOW', 7),
('proj-5', 'Muppandal Wind Inter-tie Dynamic Capacity Upgrades', 'TRANSMISSION', 'South Region', 580.00, 12.40, 'MEDIUM', 7.80, 'HIGH', 8),
('proj-6', 'Bangalore Smart-Grid Edge AMI Mesh V2', 'DISTRIBUTION', 'South Region', 720.00, 9.60, 'MEDIUM', 7.50, 'MEDIUM', 9),
('proj-7', 'Central-East Cross-Regional Inter-tie Reinforcement', 'TRANSMISSION', 'Central Region', 1250.00, 10.50, 'HIGH', 8.20, 'LOW', 6),
('proj-8', 'Rural Microgrid Autonomy Loop (20 Solar Villages)', 'RESILIENCY', 'East Region', 380.00, 11.90, 'HIGH', 8.80, 'HIGH', 10),
('proj-9', 'PM-KUSUM Agri-Solar Grid Edge Integration - Ahmedabad', 'DISTRIBUTION', 'West Region', 490.00, 13.10, 'MEDIUM', 8.00, 'HIGH', 10)
ON CONFLICT (id) DO UPDATE SET
    priority_score = EXCLUDED.priority_score,
    expected_roi_pct = EXCLUDED.expected_roi_pct;

-- =====================================================================
-- SEEDING COMPLETE FOR CASSANDRA GRIDOS DEMO DATA
-- =====================================================================

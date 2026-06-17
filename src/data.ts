import { 
  DataHubSource, 
  SyncActivityItem, 
  Stakeholder, 
  PrioritizedProject, 
  RecentAction, 
  CrisisNode, 
  ReportTemplate, 
  GeneratedReport, 
  QueueItem 
} from "./types";

// Master Scenario Metadata
export const MASTER_SCENARIO = {
  name: "India 2040 Renewable Transition",
  context: "National Utility Planning & Infrastructure Decarbonization",
  targetYear: 2040,
  renewableEnergyTargetPct: 70,
  evAdoptionTargetPct: 65,
  populationGrowthPct: 22,
  budgetCr: 8000, // ₹8,000 Crore
  primaryChallenge: "Integrate large-scale renewable generation while maintaining grid reliability and supporting EV-driven demand growth across major economic load centers."
};

export const INITIAL_DATA_SOURCES: DataHubSource[] = [
  {
    id: "src-1",
    name: "Central Electricity Authority (CEA) Registry",
    type: "National Planning Registry",
    health: 98.6,
    freshness: "Monthly Update",
    isLive: false,
    coverage: "All India Utilities & Load Centers",
    integration: "API / PDF Report Parser",
    status: "CONNECTED",
    lastSync: "Last Sync: Just Now",
    actionText: "Open Registry"
  },
  {
    id: "src-2",
    name: "Grid India / POSOCO Transmission Database",
    type: "Real-time Telemetry Portal",
    health: 95.4,
    freshness: "Real-Time Telemetry",
    isLive: true,
    coverage: "Inter-Regional Power Exchange Corridors",
    integration: "REST Gateway API",
    status: "CONNECTED",
    lastSync: "Last Sync: 12 min ago",
    actionText: "View Telemetry Logs"
  },
  {
    id: "src-3",
    name: "Ministry of New and Renewable Energy (MNRE) Capacity Models",
    type: "Capacity Database & Models",
    health: 92.8,
    freshness: "Bi-Weekly",
    isLive: false,
    coverage: "Bhadla, Pavagada, Kutch Solar / Wind Complexes",
    integration: "XML Stream endpoint",
    status: "POLLING",
    lastSync: "Next Pull: 00:04:12",
    actionText: "Check Models"
  },
  {
    id: "src-4",
    name: "National Power Portal (NPP) Operational Ledger",
    type: "Operational Analytics Endpoint",
    health: 96.2,
    freshness: "Daily Summary",
    isLive: false,
    coverage: "Hydro & Thermal Dispatch Schedules",
    integration: "JSON Webhook",
    status: "CONNECTED",
    lastSync: "Last Sync: Today",
    actionText: "Open Ledger Logs"
  },
  {
    id: "src-5",
    name: "OpenStreetMap GIS Infrastructure Layers",
    type: "PostGIS GeoServer",
    health: 99.1,
    freshness: "Weekly Refresh",
    isLive: false,
    coverage: "Transmission substation geo-polygons",
    integration: "WMS/WFS Geographic API",
    status: "CONNECTED",
    lastSync: "Last Sync: 3 days ago",
    actionText: "View Layers Map"
  },
  {
    id: "src-6",
    name: "State Renewable Energy Agencies (SREAs) Local Feed",
    type: "Localized Ingestion Pipelines",
    health: 89.4,
    freshness: "1h Refresh",
    isLive: false,
    coverage: "State STU substation telemetry (Gujarat, Rajasthan, etc)",
    integration: "FTP Secure Batch",
    status: "CONNECTED",
    lastSync: "Last Sync: 45 min ago",
    actionText: "Inspect Pipes"
  },
  {
    id: "src-7",
    name: "Public Transmission Expansion Project Reports",
    type: "Document Parsing Pipeline",
    health: 94.0,
    freshness: "Annual / Planning Cycles",
    isLive: false,
    coverage: "Green Energy Corridor Stage II updates",
    integration: "Deep PDF Chunk Ingestion API",
    status: "CONNECTED",
    lastSync: "Last Sync: Yesterday",
    actionText: "Verify Chunks"
  }
];

export const INITIAL_SYNC_ACTIVITIES: SyncActivityItem[] = [
  {
    id: "act-1",
    name: "Substation Metric Inflow",
    time: "NOW",
    description: "Synchronizing telemetry for 25 primary substations & 14 major corridors.",
    status: "active",
    speed: "2.4MB/s",
    eta: "45s"
  },
  {
    id: "act-2",
    name: "Bhadla Solar Telemetry",
    time: "10 min ago",
    description: "Refreshed generation metrics for Bhadla & Pavagada solar complexes.",
    status: "completed"
  },
  {
    id: "act-3",
    name: "Kutch Offshore Wind Feed",
    time: "45 min ago",
    description: "Intermittent handshake timeout on Offshore-Mast-4 telemetry.",
    status: "failed"
  },
  {
    id: "act-4",
    name: "Budget Ledger Sync",
    time: "2 hours ago",
    description: "Committed ₹8,000 Crore investment optimization ledger parameters.",
    status: "completed"
  }
];

export const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  {
    id: "stk-1",
    name: "Government Representative (CEA)",
    role: "National Policy Alignment",
    confidence: 96,
    objective: "Achieve 70% Renewables & 100% Reliability Standards",
    concern: "State funding allocations & project implementation delays",
    tradeoffScore: 85,
    isConflict: false,
    colorClass: "bg-[#0F4C81] text-white",
    avatarText: "GOV",
    icon: "account_balance"
  },
  {
    id: "stk-2",
    name: "POSOCO Grid Operator",
    role: "System Operational Reliability",
    confidence: 88,
    objective: "Maintain N-1 contingency safety margins & reserve limits",
    concern: "EV peak load coincidence spikes & voltage instability",
    tradeoffScore: 70,
    isConflict: false,
    colorClass: "bg-sky-700 text-white",
    avatarText: "OPS",
    icon: "bolt"
  },
  {
    id: "stk-3",
    name: "SEC Renewable Developer Council",
    role: "Clean Generation Expansion",
    confidence: 76,
    objective: "Maximize solar & wind absorption with zero curtailment",
    concern: "High transmission bottlenecks & lack of storage battery capital",
    tradeoffScore: 50,
    isConflict: false,
    colorClass: "bg-emerald-700 text-white",
    avatarText: "DEV",
    icon: "eco"
  },
  {
    id: "stk-4",
    name: "Municipal Consumer Forum",
    role: "Urban Electrification Advocacy",
    confidence: 82,
    objective: "Affordable utility rates & clean urban air quality",
    concern: "Disproportionate grid modernization surcharges on consumers",
    tradeoffScore: 75,
    isConflict: false,
    colorClass: "bg-amber-700 text-white",
    avatarText: "MCF",
    icon: "diversity_3"
  },
  {
    id: "stk-5",
    name: "Direct Capital ESG Syndicate",
    role: "Financial Sustainability & ROI",
    confidence: 90,
    objective: "Clear capital asset ROI > 11.5% with structured debt coverage",
    concern: "Under-utilized battery or transmission lines turning into stranded liabilities",
    tradeoffScore: 90,
    isConflict: false,
    colorClass: "bg-teal-700 text-white",
    avatarText: "ESG",
    icon: "payments"
  },
  {
    id: "stk-6",
    name: "NEXUS Adversarial Risk Evaluator",
    role: "Crisis Stress Simulator",
    confidence: 45,
    objective: "Expose system failure points & enforce emergency black-start capabilities",
    concern: "Coincident heatwaves + cyclone events cascading through the East-West corridor",
    tradeoffScore: 30,
    isConflict: true,
    colorClass: "bg-rose-700 text-white",
    avatarText: "RSK",
    icon: "security"
  }
];

export const INITIAL_PROJECTS: PrioritizedProject[] = [
  {
    id: "proj-1",
    name: "Bhadla-Delhi 800kV Green HVDC link",
    category: "TRANSMISSION",
    categoryColorClass: "bg-blue-50 text-blue-900 border border-blue-200",
    region: "North Region",
    cost: 1450, // ₹1,450 Crore
    roi: 14.8,
    reliabilityImpact: "CRITICAL",
    priorityScore: 9.6,
    selected: true,
    carbonImpact: "HIGH",
    riskWeight: 88,
    communityBenefit: 9
  },
  {
    id: "proj-2",
    name: "Kutch Desert BESS Fortification",
    category: "RESILIENCY",
    categoryColorClass: "bg-emerald-50 text-emerald-900 border border-emerald-200",
    region: "West Region",
    cost: 1120, // ₹1,120 Crore
    roi: 13.5,
    reliabilityImpact: "HIGH",
    priorityScore: 9.2,
    selected: true,
    carbonImpact: "HIGH",
    riskWeight: 90,
    communityBenefit: 8
  },
  {
    id: "proj-3",
    name: "Mumbai EV Fast-Charger Mesh Gateway",
    category: "DISTRIBUTION",
    categoryColorClass: "bg-amber-50 text-amber-900 border border-amber-200",
    region: "West Region",
    cost: 650, // ₹650 Crore
    roi: 11.2,
    reliabilityImpact: "HIGH",
    priorityScore: 8.7,
    selected: true,
    carbonImpact: "HIGH",
    riskWeight: 75,
    communityBenefit: 10
  },
  {
    id: "proj-4",
    name: "Chennai Coastal GIS Marine Flooding Protection",
    category: "SECURITY",
    categoryColorClass: "bg-rose-50 text-rose-900 border border-rose-200",
    region: "South Region",
    cost: 450, // ₹450 Crore
    roi: 8.5,
    reliabilityImpact: "CRITICAL",
    priorityScore: 8.9,
    selected: true,
    carbonImpact: "LOW",
    riskWeight: 94,
    communityBenefit: 7
  },
  {
    id: "proj-5",
    name: "Muppandal Wind Inter-tie Dynamic Capacity Upgrades",
    category: "TRANSMISSION",
    categoryColorClass: "bg-blue-50 text-blue-900 border border-blue-200",
    region: "South Region",
    cost: 580, // ₹580 Crore
    roi: 12.4,
    reliabilityImpact: "MEDIUM",
    priorityScore: 7.8,
    selected: true,
    carbonImpact: "HIGH",
    riskWeight: 68,
    communityBenefit: 8
  },
  {
    id: "proj-6",
    name: "Bangalore Smart-Grid Edge AMI Mesh V2",
    category: "DISTRIBUTION",
    categoryColorClass: "bg-amber-50 text-amber-900 border border-amber-200",
    region: "South Region",
    cost: 720, // ₹720 Crore
    roi: 9.6,
    reliabilityImpact: "MEDIUM",
    priorityScore: 7.5,
    selected: false,
    carbonImpact: "MEDIUM",
    riskWeight: 62,
    communityBenefit: 9
  },
  {
    id: "proj-7",
    name: "Central-East Cross-Regional Inter-tie Reinforcement",
    category: "TRANSMISSION",
    categoryColorClass: "bg-blue-50 text-blue-900 border border-blue-200",
    region: "Central Region",
    cost: 1250, // ₹1,250 Crore
    roi: 10.5,
    reliabilityImpact: "HIGH",
    priorityScore: 8.2,
    selected: false,
    carbonImpact: "LOW",
    riskWeight: 72,
    communityBenefit: 6
  },
  {
    id: "proj-8",
    name: "Rural Microgrid Autonomy Loop (20 Solar Villages)",
    category: "RESILIENCY",
    categoryColorClass: "bg-emerald-50 text-emerald-900 border border-emerald-200",
    region: "East Region",
    cost: 380, // ₹380 Crore
    roi: 11.9,
    reliabilityImpact: "HIGH",
    priorityScore: 8.8,
    selected: true,
    carbonImpact: "HIGH",
    riskWeight: 80,
    communityBenefit: 10
  },
  {
    id: "proj-9",
    name: "PM-KUSUM Agri-Solar Grid Edge Integration - Ahmedabad",
    category: "DISTRIBUTION",
    categoryColorClass: "bg-amber-50 text-amber-900 border border-amber-200",
    region: "West Region",
    cost: 490, // ₹490 Crore
    roi: 13.1,
    reliabilityImpact: "MEDIUM",
    priorityScore: 8.0,
    selected: false,
    carbonImpact: "HIGH",
    riskWeight: 58,
    communityBenefit: 10
  }
];

export const INITIAL_RECENT_ACTIONS: RecentAction[] = [
  {
    id: "act-1",
    title: "Bhadla-Delhi HVDC Link Approved",
    description: "CEA authorized capital allocation of ₹1,450 Crore from India 2040 Transition budget.",
    time: "2 hours ago"
  },
  {
    id: "act-2",
    title: "Kutch BESS Optimized",
    description: "Grid Operator configured virtual battery buffer thresholds on Kutch Desert BESS project.",
    time: "4 hours ago"
  },
  {
    id: "act-3",
    title: "Chennai GIS Flood Protection Added",
    description: "Inclusion of marine waterproofing mitigations due to coastal hazard forecast projections.",
    time: "Yesterday"
  }
];

export const INITIAL_CRISIS_NODES: CrisisNode[] = [
  {
    id: "node-1",
    name: "Mundra-Ahmedabad Corridor Substation 14",
    zone: "West Grid Ring",
    status: "FAILURE",
    icon: "dangerous",
    colorClass: "text-red-600"
  },
  {
    id: "node-2",
    name: "Bhadla Solar STATCOM Compensator Vector",
    zone: "Rajasthan Desert Hub",
    status: "ACTIVE",
    icon: "sync_alt",
    colorClass: "text-cyan-500"
  },
  {
    id: "node-3",
    name: "Tehri Hydro Reserve Black-Start Infeed",
    zone: "North Grid Ring",
    status: "DEPLOYING",
    icon: "bolt",
    colorClass: "text-[#0F4C81]"
  }
];

export const INITIAL_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "temp-1",
    title: "NEXUS Executive Briefing",
    revision: "v42.2",
    description: "High-level summary of national grid alignment, policy compliance metrics, and active vulnerability vectors.",
    tags: ["EXECUTIVE", "GOVERNANCE", "BRIEFING"],
    icon: "summarize"
  },
  {
    id: "temp-2",
    title: "NEXUS Modernization Roadmap",
    revision: "v14.8",
    description: "Phased grid upgrading sequence detailing inter-corridor expansions and smart-grid timeline integrations.",
    tags: ["ROADMAP", "TRANSLATION", "INFRASTRUCTURE"],
    icon: "health_and_safety"
  },
  {
    id: "temp-3",
    title: "NEXUS Investment Assessment",
    revision: "v20.4",
    description: "Detailed capital ledger tracking expenditure returns, risk hedging profiles, and multi-regional ROI audits.",
    tags: ["FINANCIAL", "CAPEX", "INVESTMENT"],
    icon: "account_balance_wallet"
  },
  {
    id: "temp-4",
    title: "NEXUS Decision Package",
    revision: "v1.5",
    description: "Official stakeholder consensus outputs, alternatives matrix, and compliance signatures ready for deployment.",
    tags: ["BOARDROOM", "CONCORD", "DECISION_PACKAGE"],
    icon: "verified_user"
  }
];

export const INITIAL_GENERATED_REPORTS: GeneratedReport[] = [
  {
    id: "rep-1",
    name: "NEXUS_Executive_Briefing_India_2040_Q3.pdf",
    format: "pdf",
    generatedOn: "Just Now",
    owner: "Executive Secretary"
  },
  {
    id: "rep-2",
    name: "NEXUS_Modernization_Roadmap_Phase1.pptx",
    format: "pptx",
    generatedOn: "5 hours ago",
    owner: "Chief Infrastructure Officer"
  },
  {
    id: "rep-3",
    name: "NEXUS_Decision_Package_2040.pdf",
    format: "pdf",
    generatedOn: "Yesterday",
    owner: "System Operator Counsel"
  }
];

export const INITIAL_QUEUE_ITEMS: QueueItem[] = [
  {
    id: "q-1",
    name: "India 2040 Horizon Synthesis Run",
    type: "Cascade Stress Simulation",
    status: "processing",
    progress: 78,
    remaining: "01m 05s"
  },
  {
    id: "q-2",
    name: "Pan-India Substation Coincident Peaks Grid",
    type: "Batch SQL Ledger",
    status: "queued",
    progress: 0,
    remaining: "--:--"
  }
];

// Complete Rich Detail Collections of Substations, Corridors, Renewable/Fossil plants for Digital Twin & Scenario Labs
export const DEMO_SUBSTATIONS = [
  { id: "sub-1", name: "Mumbai West Gas-Insulated Substation", voltageKv: 400, region: "West", capacityMw: 1200, currentLoadMw: 936, utilizationPct: 78, healthIndex: 82, riskScore: 0.18, recommendedUpgrade: "Active Phase Compensator deployment & GIS Elevators", costCr: 350 },
  { id: "sub-2", name: "Delhi NCR Grid Exchange Substation", voltageKv: 765, region: "North", capacityMw: 2000, currentLoadMw: 1720, utilizationPct: 86, healthIndex: 84, riskScore: 0.22, recommendedUpgrade: "Dynamic Line Rating controls & telemetry integration", costCr: 420 },
  { id: "sub-3", name: "Chennai Coastal Switching Substation", voltageKv: 400, region: "South", capacityMw: 1000, currentLoadMw: 610, utilizationPct: 61, healthIndex: 68, riskScore: 0.28, recommendedUpgrade: "GIS Elevation, floodwalls & maritime barrier coating", costCr: 280 },
  { id: "sub-4", name: "Nagpur Inter-regional Transmission Hub", voltageKv: 400, region: "Central", capacityMw: 1500, currentLoadMw: 780, utilizationPct: 52, healthIndex: 92, riskScore: 0.05, recommendedUpgrade: "Automatic sectionalizing smart breaker loop", costCr: 120 },
  { id: "sub-5", name: "Ahmedabad Urban Power Distribution Node", voltageKv: 220, region: "West", capacityMw: 800, currentLoadMw: 536, utilizationPct: 67, healthIndex: 88, riskScore: 0.12, recommendedUpgrade: "Distributed STATCOM active control installation", costCr: 190 },
  { id: "sub-6", name: "Pune Hinjewadi Tech-Park Substation", voltageKv: 220, region: "West", capacityMw: 600, currentLoadMw: 516, utilizationPct: 86, healthIndex: 79, riskScore: 0.19, recommendedUpgrade: "Smart Battery Buffer Suite for high density peak shave", costCr: 150 },
  { id: "sub-7", name: "Bangalore Whitefield Digital Grid Node", voltageKv: 400, region: "South", capacityMw: 1100, currentLoadMw: 913, utilizationPct: 83, healthIndex: 85, riskScore: 0.15, recommendedUpgrade: "D-STATCOM & secondary route tie-ins", costCr: 260 },
  { id: "sub-8", name: "Hyderabad Gachibowli Gateway Substation", voltageKv: 220, region: "South", capacityMw: 750, currentLoadMw: 495, utilizationPct: 66, healthIndex: 91, riskScore: 0.08, recommendedUpgrade: "Demand Side Management server integration", costCr: 110 },
  { id: "sub-9", name: "Kolkata SaltLake Metro Distribution Node", voltageKv: 220, region: "East", capacityMw: 700, currentLoadMw: 588, utilizationPct: 84, healthIndex: 64, riskScore: 0.31, recommendedUpgrade: "Underground ring main cables & gas insulation", costCr: 210 },
  { id: "sub-10", name: "Guwahati Eastern Inter-tie Substation", voltageKv: 400, region: "East", capacityMw: 900, currentLoadMw: 405, utilizationPct: 45, healthIndex: 74, riskScore: 0.14, recommendedUpgrade: "Light-sensing autonomous recloser loops", costCr: 160 },
  { id: "sub-11", name: "Patna Central Domestic Grid Base", voltageKv: 220, region: "East", capacityMw: 500, currentLoadMw: 440, utilizationPct: 88, healthIndex: 71, riskScore: 0.24, recommendedUpgrade: "Re-conducting high thermal capacity cables", costCr: 130 },
  { id: "sub-12", name: "Bhopal Central Exchange Substation", voltageKv: 400, region: "Central", capacityMw: 1200, currentLoadMw: 648, utilizationPct: 54, healthIndex: 89, riskScore: 0.06, recommendedUpgrade: "Secondary reactive power capacitor sets", costCr: 140 },
  { id: "sub-13", name: "Jabalpur Trunk Inter-tie Substation", voltageKv: 765, region: "Central", capacityMw: 1800, currentLoadMw: 1170, utilizationPct: 65, healthIndex: 86, riskScore: 0.11, recommendedUpgrade: "Continuous telemetry oil temperature gauges", costCr: 290 },
  { id: "sub-14", name: "Jaipur Solar Integration Substation", voltageKv: 400, region: "North", capacityMw: 1400, currentLoadMw: 1190, utilizationPct: 85, healthIndex: 80, riskScore: 0.21, recommendedUpgrade: "Fast-responding STATCOM generator coupling", costCr: 240 },
  { id: "sub-15", name: "Jodhpur Desert Collector Substation", voltageKv: 765, region: "North", capacityMw: 2500, currentLoadMw: 2125, utilizationPct: 85, healthIndex: 83, riskScore: 0.17, recommendedUpgrade: "Advanced cooling blower bays & line traps", costCr: 410 },
  { id: "sub-16", name: "Lucknow Grid Terminal Substation", voltageKv: 400, region: "North", capacityMw: 1000, currentLoadMw: 790, utilizationPct: 79, healthIndex: 76, riskScore: 0.16, recommendedUpgrade: "Overhead static earth shield dynamic wires", costCr: 180 },
  { id: "sub-17", name: "Surat West-Edge Heavy Industry Substation", voltageKv: 400, region: "West", capacityMw: 1300, currentLoadMw: 1105, utilizationPct: 85, healthIndex: 81, riskScore: 0.18, recommendedUpgrade: "Harmonic filtering blocks installation", costCr: 250 },
  { id: "sub-18", name: "Kochi Marine Terminal Substation", voltageKv: 220, region: "South", capacityMw: 500, currentLoadMw: 320, utilizationPct: 64, healthIndex: 75, riskScore: 0.22, recommendedUpgrade: "Heavy-duty epoxy insulations to resist salt wind", costCr: 120 },
  { id: "sub-19", name: "Bhubaneswar Coastal Grid Aggregator", voltageKv: 400, region: "East", capacityMw: 950, currentLoadMw: 589, utilizationPct: 62, healthIndex: 73, riskScore: 0.25, recommendedUpgrade: "Concrete structural foundation reinforcement", costCr: 170 },
  { id: "sub-20", name: "Ranchi Industrial Collector Substation", voltageKv: 400, region: "East", capacityMw: 1100, currentLoadMw: 858, utilizationPct: 78, healthIndex: 80, riskScore: 0.13, recommendedUpgrade: "Solid state transformer pilot modules", costCr: 200 },
  { id: "sub-21", name: "Indore West central Bulk-power Node", voltageKv: 400, region: "Central", capacityMw: 1050, currentLoadMw: 661, utilizationPct: 63, healthIndex: 90, riskScore: 0.07, recommendedUpgrade: "Standard maintenance cycle optimization", costCr: 130 },
  { id: "sub-22", name: "Visakhapatnam Steel City Substation", voltageKv: 400, region: "South", capacityMw: 1250, currentLoadMw: 975, utilizationPct: 78, healthIndex: 82, riskScore: 0.16, recommendedUpgrade: "Active voltage restorer system integration", costCr: 230 },
  { id: "sub-23", name: "Jamshedpur Heavy-Metallurgy Grid Exchange", voltageKv: 400, region: "East", capacityMw: 1600, currentLoadMw: 1312, utilizationPct: 82, healthIndex: 81, riskScore: 0.17, recommendedUpgrade: "Redundant bypass bus-bar architecture link", costCr: 300 },
  { id: "sub-24", name: "Rajkot Solar-Wind Local Pooling Base", voltageKv: 220, region: "West", capacityMw: 800, currentLoadMw: 520, utilizationPct: 65, healthIndex: 87, riskScore: 0.10, recommendedUpgrade: "Battery buffer expansion and telemetry links", costCr: 140 },
  { id: "sub-25", name: "Amritsar Northwest Boundary Exchange", voltageKv: 220, region: "North", capacityMw: 600, currentLoadMw: 360, utilizationPct: 60, healthIndex: 84, riskScore: 0.12, recommendedUpgrade: "Remote telemetry and drone mapping lines", costCr: 110 }
];

export const DEMO_CORRIDORS = [
  { id: "corr-1", name: "Western Desert Renewable HVDC Trunkline", voltageKv: 800, type: "HVDC", capacityMw: 3000, activeLoadMw: 2450, lengthKm: 420, regionalSpan: "West to North", healthPct: 98.4, riskScore: 0.05, reliabilityIndex: 99.96 },
  { id: "corr-2", name: "Bhadla-NCR High Tension AC Highway", voltageKv: 765, type: "UHV-AC", capacityMw: 2500, activeLoadMw: 2150, lengthKm: 280, regionalSpan: "West to North", healthPct: 92.1, riskScore: 0.18, reliabilityIndex: 99.81 },
  { id: "corr-3", name: "Satpura Central-South Inter-regional Corridor", voltageKv: 400, type: "HV-AC", capacityMw: 1800, activeLoadMw: 1410, lengthKm: 310, regionalSpan: "Central to South", healthPct: 89.6, riskScore: 0.12, reliabilityIndex: 99.78 },
  { id: "corr-4", name: "Coastal Vindhyachal Energy Highway", voltageKv: 400, type: "HV-AC", capacityMw: 1600, activeLoadMw: 1210, lengthKm: 240, regionalSpan: "East to West", healthPct: 84.3, riskScore: 0.22, reliabilityIndex: 99.45 },
  { id: "corr-5", name: "Kutch Offshore Grid-to-Land collector Trunk", voltageKv: 400, type: "HV-AC", capacityMw: 1500, activeLoadMw: 1180, lengthKm: 85, regionalSpan: "Offshore-Gujarat", healthPct: 94.0, riskScore: 0.14, reliabilityIndex: 99.88 },
  { id: "corr-6", name: "Western Ghats High Peak Link Line 2", voltageKv: 220, type: "HV-AC", capacityMw: 800, activeLoadMw: 736, lengthKm: 140, regionalSpan: "Inside West", healthPct: 76.8, riskScore: 0.29, reliabilityIndex: 99.12 },
  { id: "corr-7", name: "Bangalore-Chennai Ultra Load Tie", voltageKv: 400, type: "HV-AC", capacityMw: 1400, activeLoadMw: 1190, lengthKm: 190, regionalSpan: "South", healthPct: 91.2, riskScore: 0.11, reliabilityIndex: 99.82 },
  { id: "corr-8", name: "Central India Coal Belt Evacuation Line", voltageKv: 765, type: "UHV-AC", capacityMw: 2400, activeLoadMw: 1810, lengthKm: 350, regionalSpan: "East to Central", healthPct: 88.4, riskScore: 0.15, reliabilityIndex: 99.74 },
  { id: "corr-9", name: "Gopalpur-Coastal Corrosive Switching Link", voltageKv: 220, type: "HV-AC", capacityMw: 600, activeLoadMw: 410, lengthKm: 95, regionalSpan: "East Coastal", healthPct: 74.2, riskScore: 0.35, reliabilityIndex: 98.92 },
  { id: "corr-10", name: "Narmada River Valley Double Circuit Link", voltageKv: 400, type: "HV-AC", capacityMw: 1200, activeLoadMw: 890, lengthKm: 125, regionalSpan: "West to Central", healthPct: 93.5, riskScore: 0.08, reliabilityIndex: 99.89 },
  { id: "corr-11", name: "Muppandal-Tuticorin High Output Wind Link", voltageKv: 220, type: "HV-AC", capacityMw: 900, activeLoadMw: 792, lengthKm: 75, regionalSpan: "Inside South", healthPct: 91.0, riskScore: 0.10, reliabilityIndex: 99.86 },
  { id: "corr-12", name: "Guwahati Brahmaputra River Span Crossing", voltageKv: 400, type: "HV-AC", capacityMw: 1000, activeLoadMw: 450, lengthKm: 60, regionalSpan: "East Northeast", healthPct: 83.1, riskScore: 0.24, reliabilityIndex: 99.30 },
  { id: "corr-13", name: "Jodhpur-Jaipur Solar Collector Trunk Line", voltageKv: 765, type: "UHV-AC", capacityMw: 2000, activeLoadMw: 1720, lengthKm: 210, regionalSpan: "North Northwest", healthPct: 94.6, riskScore: 0.09, reliabilityIndex: 99.91 },
  { id: "corr-14", name: "Lucknow-Bihar Subsegment Interconnector", voltageKv: 400, type: "HV-AC", capacityMw: 1100, activeLoadMw: 902, lengthKm: 165, regionalSpan: "North to East", healthPct: 85.9, riskScore: 0.21, reliabilityIndex: 99.52 }
];

export const DEMO_RENEWABLE_ASSETS = [
  // 6 Solar Farms
  { id: "ren-sol-1", name: "Bhadla Mega Solar Park Phase IV", type: "SOLAR", state: "Rajasthan", capacityMw: 2245, currentGenerationMw: 1910, capacityUtilizationFactorPct: 24.5, healthIndex: 94, gridConnectionPoint: "Jodhpur Collector Substation" },
  { id: "ren-sol-2", name: "Kutch Ultra Mega Renewable Sun Array", type: "SOLAR", state: "Gujarat", capacityMw: 1500, currentGenerationMw: 1280, capacityUtilizationFactorPct: 25.0, healthIndex: 91, gridConnectionPoint: "Kutch Collector Substation" },
  { id: "ren-sol-3", name: "Pavagada Solar Complex Park", type: "SOLAR", state: "Karnataka", capacityMw: 2050, currentGenerationMw: 1620, capacityUtilizationFactorPct: 23.8, healthIndex: 89, gridConnectionPoint: "Bangalore Whitefield Grid" },
  { id: "ren-sol-4", name: "Rewa Mega Photovoltaic Array", type: "SOLAR", state: "Madhya Pradesh", capacityMw: 750, currentGenerationMw: 610, capacityUtilizationFactorPct: 22.1, healthIndex: 92, gridConnectionPoint: "Jabalpur Trunk Substation" },
  { id: "ren-sol-5", name: "Kurnool Ultra Solar Cluster Base", type: "SOLAR", state: "Andhra Pradesh", capacityMw: 1000, currentGenerationMw: 830, capacityUtilizationFactorPct: 24.2, healthIndex: 87, gridConnectionPoint: "Chennai Coastal Switching" },
  { id: "ren-sol-6", name: "Kadapa Renewable Sun Farm II", type: "SOLAR", state: "Andhra Pradesh", capacityMw: 750, currentGenerationMw: 590, capacityUtilizationFactorPct: 23.0, healthIndex: 88, gridConnectionPoint: "Hyderabad Gachibowli Gateway" },
  // 4 Wind Farms
  { id: "ren-wnd-1", name: "Muppandal Extreme Output Wind Park", type: "WIND", state: "Tamil Nadu", capacityMw: 1500, currentGenerationMw: 1125, capacityUtilizationFactorPct: 36.5, healthIndex: 84, gridConnectionPoint: "Kochi Marine Terminal" },
  { id: "ren-wnd-2", name: "Jaisalmer Ridge Wind Generator Complex", type: "WIND", state: "Rajasthan", capacityMw: 1064, currentGenerationMw: 798, capacityUtilizationFactorPct: 34.0, healthIndex: 86, gridConnectionPoint: "Jodhpur Collector Substation" },
  { id: "ren-wnd-3", name: "Kutch Coastal Offshore Wind Cluster", type: "WIND", state: "Gujarat", capacityMw: 950, currentGenerationMw: 665, capacityUtilizationFactorPct: 38.0, healthIndex: 82, gridConnectionPoint: "Kutch Collector Substation" },
  { id: "ren-wnd-4", name: "Western Ghats Ridge-line Wind Corridor", type: "WIND", state: "Maharashtra", capacityMw: 600, currentGenerationMw: 420, capacityUtilizationFactorPct: 32.5, healthIndex: 90, gridConnectionPoint: "Pune Hinjewadi Substation" },
  // 3 Hydro Facilities
  { id: "rhy-hyd-1", name: "Tehri Dam Pumped Peaking Hydro Facility", type: "HYDRO", state: "Uttarakhand", capacityMw: 1000, currentGenerationMw: 850, capacityUtilizationFactorPct: 48.0, healthIndex: 95, gridConnectionPoint: "Delhi NCR Grid Exchange" },
  { id: "rhy-hyd-2", name: "Koyna Major Hydroelectric Power Station", type: "HYDRO", state: "Maharashtra", capacityMw: 1960, currentGenerationMw: 1570, capacityUtilizationFactorPct: 42.0, healthIndex: 93, gridConnectionPoint: "Mumbai West Substation" },
  { id: "rhy-hyd-3", name: "Bhakra Nangal Dam Base-Peaker Reservoir", type: "HYDRO", state: "Punjab", capacityMw: 1325, currentGenerationMw: 1060, capacityUtilizationFactorPct: 52.0, healthIndex: 89, gridConnectionPoint: "Amritsar Northwest Boundary" }
];

// Municipal Energy Assets (10 Charge Hubs, 15 Urban Substations, 10 Rooftop Zones)
export const MUNICIPAL_DEMO_DATA = {
  cities: ["Mumbai", "Pune", "Bangalore", "Hyderabad", "Chennai", "Delhi", "Ahmedabad"],
  evChargingHubs: [
    { id: "evh-1", name: "Mumbai Bandra-Kurla Transit Charging Depot", capacityMw: 45, chargersCount: 220, concurrentLoadMw: 36, utilizationPct: 80, healthPct: 94 },
    { id: "evh-2", name: "Pune Hinjewadi Software Cluster EV Terminal", capacityMw: 25, chargersCount: 150, concurrentLoadMw: 18, utilizationPct: 72, healthPct: 91 },
    { id: "evh-3", name: "Bangalore Electronic City Hub V2G Node", capacityMw: 35, chargersCount: 180, concurrentLoadMw: 29, utilizationPct: 83, healthPct: 96 },
    { id: "evh-4", name: "Hyderabad Gachibowli High-density Charge Core", capacityMw: 30, chargersCount: 160, concurrentLoadMw: 21, utilizationPct: 70, healthPct: 95 },
    { id: "evh-5", name: "Chennai Coastal Metro EV Depot Node", capacityMw: 20, chargersCount: 110, concurrentLoadMw: 15, utilizationPct: 75, healthPct: 88 },
    { id: "evh-6", name: "Delhi Dwarka Smart Fleet Charging Base", capacityMw: 50, chargersCount: 250, concurrentLoadMw: 42, utilizationPct: 84, healthPct: 93 },
    { id: "evh-7", name: "Ahmedabad Riverfront Transit Charging Hub", capacityMw: 28, chargersCount: 140, concurrentLoadMw: 19, utilizationPct: 68, healthPct: 90 },
    { id: "evh-8", name: "Mumbai South Transit Depot and V2G Terminal", capacityMw: 30, chargersCount: 160, concurrentLoadMw: 24, utilizationPct: 80, healthPct: 92 },
    { id: "evh-9", name: "Delhi NCR Logistic Hub Heavy EV Charging", capacityMw: 40, chargersCount: 200, concurrentLoadMw: 35, utilizationPct: 87, healthPct: 89 },
    { id: "evh-10", name: "Bangalore North Airport Link Charging Node", capacityMw: 22, chargersCount: 120, concurrentLoadMw: 14, utilizationPct: 64, healthPct: 94 }
  ],
  urbanSubstations: [
    { id: "urb-sub-1", name: "Mumbai Goregaon Digital Ring Substation", capacityMw: 450, loadMw: 396, riskIndex: 0.18 },
    { id: "urb-sub-2", name: "Mumbai Worli Coastal Gas Insulated Node", capacityMw: 500, loadMw: 410, riskIndex: 0.25 },
    { id: "urb-sub-3", name: "Pune Kothrud High Density Ring Substation", capacityMw: 200, loadMw: 176, riskIndex: 0.11 },
    { id: "urb-sub-4", name: "Bangalore Whitefield High Capacity Exchange", capacityMw: 600, loadMw: 522, riskIndex: 0.16 },
    { id: "urb-sub-5", name: "Bangalore Koramangala Grid edge Substation", capacityMw: 250, loadMw: 220, riskIndex: 0.14 },
    { id: "urb-sub-6", name: "Hyderabad Madhapur Tech-Ring Node", capacityMw: 400, loadMw: 348, riskIndex: 0.12 },
    { id: "urb-sub-7", name: "Hyderabad Begumpet Old City Switching Station", capacityMw: 300, loadMw: 261, riskIndex: 0.22 },
    { id: "urb-sub-8", name: "Chennai Guindy Industrial Base Substation", capacityMw: 350, loadMw: 294, riskIndex: 0.19 },
    { id: "urb-sub-9", name: "Chennai Coastal Royapuram Power Gateway", capacityMw: 400, loadMw: 332, riskIndex: 0.29 },
    { id: "urb-sub-10", name: "Delhi Connaught Place Central Core Ring Node", capacityMw: 600, loadMw: 552, riskIndex: 0.20 },
    { id: "urb-sub-11", name: "Delhi Noida Express Tech Terminal Station", capacityMw: 400, loadMw: 344, riskIndex: 0.14 },
    { id: "urb-sub-12", name: "Ahmedabad Satellite Residential Base Substation", capacityMw: 250, loadMw: 215, riskIndex: 0.13 },
    { id: "urb-sub-13", name: "Ahmedabad GIDC Heavy Manufacturing Substation", capacityMw: 500, loadMw: 435, riskIndex: 0.17 },
    { id: "urb-sub-14", name: "Pune Chinchwad industrial subsegment Node", capacityMw: 300, loadMw: 249, riskIndex: 0.15 },
    { id: "urb-sub-15", name: "Kochi Marine Drive Coastal Ring Station", capacityMw: 200, loadMw: 146, riskIndex: 0.23 }
  ],
  rooftopSolarZones: [
    { id: "rsz-1", name: "Mumbai Thane Commercial Solar Coop Zone", capacityMw: 85, activeGenerationMw: 620, householdsAdopted: 12400 },
    { id: "rsz-2", name: "Pune Residentials Solar Rooftop Cluster A", capacityMw: 45, activeGenerationMw: 310, householdsAdopted: 7800 },
    { id: "rsz-3", name: "Bangalore South Grid edge Community Solar", capacityMw: 60, activeGenerationMw: 440, householdsAdopted: 9500 },
    { id: "rsz-4", name: "Hyderabad Gachibowli Corporate Green Roofs", capacityMw: 95, activeGenerationMw: 710, householdsAdopted: 3200 },
    { id: "rsz-5", name: "Chennai Suburban Solar Mesh Cooperative", capacityMw: 40, activeGenerationMw: 280, householdsAdopted: 6200 },
    { id: "rsz-6", name: "Delhi NCR Green Rooftops Program Phase 2", capacityMw: 110, activeGenerationMw: 780, householdsAdopted: 18500 },
    { id: "rsz-7", name: "Ahmedabad Sabarmati Residential Solar Cluster", capacityMw: 55, activeGenerationMw: 410, householdsAdopted: 11200 },
    { id: "rsz-8", name: "Pune Hinjewadi Industrial Solar Cooperatives", capacityMw: 35, activeGenerationMw: 250, householdsAdopted: 1400 },
    { id: "rsz-9", name: "Kochi Marine Commercial Complex Rooftop Solars", capacityMw: 20, activeGenerationMw: 140, householdsAdopted: 2200 },
    { id: "rsz-10", name: "Mumbai Central High-rise Solar Infeed Zone", capacityMw: 30, activeGenerationMw: 190, householdsAdopted: 4100 }
  ]
};

// Rural Electrification Data (20 Solar Villages, 15 Microgrids, 10 Battery Storage Nodes)
export const RURAL_DEMO_DATA = {
  solarVillages: [
    { id: "vil-1", name: "Bhadra Solar Village", state: "Rajasthan", solarIntensityKwh: 6.2, householdConnections: 450, loadMw: 0.8 },
    { id: "vil-2", name: "Charanka Cooperative Village", state: "Gujarat", solarIntensityKwh: 6.1, householdConnections: 600, loadMw: 1.1 },
    { id: "vil-3", name: "Jawhar tribal Village Microgrid", state: "Maharashtra", solarIntensityKwh: 4.8, householdConnections: 350, loadMw: 0.5 },
    { id: "vil-4", name: "Odanthurai Biomass-Solar Village", state: "Tamil Nadu", solarIntensityKwh: 5.4, householdConnections: 800, loadMw: 1.5 },
    { id: "vil-5", name: "Patoda Smart Water-Solar Village", state: "Maharashtra", solarIntensityKwh: 5.2, householdConnections: 320, loadMw: 0.6 },
    { id: "vil-6", name: "Kanthi Rural solar Cooperative Base", state: "West Bengal", solarIntensityKwh: 4.5, householdConnections: 520, loadMw: 0.8 },
    { id: "vil-7", name: "Nandurbar Hill Tribal Hamlet Mini-net", state: "Maharashtra", solarIntensityKwh: 4.9, householdConnections: 280, loadMw: 0.4 },
    { id: "vil-8", name: "Kamuthi Rural solar Base Cluster Phase I", state: "Tamil Nadu", solarIntensityKwh: 5.8, householdConnections: 640, loadMw: 1.2 },
    { id: "vil-9", name: "Mandvi Desert Border Solar Outpost Set", state: "Gujarat", solarIntensityKwh: 6.3, householdConnections: 210, loadMw: 0.5 },
    { id: "vil-10", name: "Srinagar Rural backup microgrid group 2", state: "Jammu & Kashmir", solarIntensityKwh: 4.2, householdConnections: 380, loadMw: 0.7 },
    { id: "vil-11", name: "Gopalpur Eastern Coastal Agri-Solar Coop", state: "Odisha", solarIntensityKwh: 4.6, householdConnections: 490, loadMw: 0.9 },
    { id: "vil-12", name: "Kurnool Outskirts Green Solar Village", state: "Andhra Pradesh", solarIntensityKwh: 5.9, householdConnections: 710, loadMw: 1.3 },
    { id: "vil-13", name: "Rewa Foothills Smallholder solar collective", state: "Madhya Pradesh", solarIntensityKwh: 5.3, householdConnections: 440, loadMw: 0.8 },
    { id: "vil-14", name: "Guwahati Rural Solar Outpost Area Alpha", state: "Assam", solarIntensityKwh: 4.0, householdConnections: 310, loadMw: 0.5 },
    { id: "vil-15", name: "Tehri Uplands Biomass & Solar Hybrid", state: "Uttarakhand", solarIntensityKwh: 4.7, householdConnections: 290, loadMw: 0.6 },
    { id: "vil-16", name: "Jaisalmer Hinterland Camel-Corps Mini-grid", state: "Rajasthan", solarIntensityKwh: 6.4, householdConnections: 180, loadMw: 0.4 },
    { id: "vil-17", name: "Muppandal village community self-reliance", state: "Tamil Nadu", solarIntensityKwh: 5.7, householdConnections: 550, loadMw: 1.1 },
    { id: "vil-18", name: "Ranchi forest edge biomass microgrid loop", state: "Jharkhand", solarIntensityKwh: 4.4, householdConnections: 390, loadMw: 0.6 },
    { id: "vil-19", name: "Patna East Outpost Rural Solar Project", state: "Bihar", solarIntensityKwh: 4.8, householdConnections: 620, loadMw: 1.0 },
    { id: "vil-20", name: "Sundarbans Delta Isolated Solar Village Base", state: "West Bengal", solarIntensityKwh: 4.3, householdConnections: 340, loadMw: 0.5 }
  ],
  microgrids: [
    { id: "mrg-1", name: "Jawhar Mountain Microgrid Loop", capacityMw: 2.5, storageKwh: 1200, isIslandingCapable: true },
    { id: "mrg-2", name: "Sundarbans Delta Off-Grid Resiliency Core", capacityMw: 1.8, storageKwh: 1500, isIslandingCapable: true },
    { id: "mrg-3", name: "Mandvi Desert Border Mini-Grid Network", capacityMw: 3.0, storageKwh: 1800, isIslandingCapable: true },
    { id: "mrg-4", name: "Nandurbar Forest Hybrid Infeed Loop", capacityMw: 1.2, storageKwh: 800, isIslandingCapable: false },
    { id: "mrg-5", name: "Tehri Gorges Isolated Hydro-solar Ring", capacityMw: 4.5, storageKwh: 3000, isIslandingCapable: true },
    { id: "mrg-6", name: "Odanthurai Community Biomass-Storage Grid", capacityMw: 2.2, storageKwh: 1000, isIslandingCapable: true },
    { id: "mrg-7", name: "Bhadra Desert Border Security Microgrid", capacityMw: 3.5, storageKwh: 2000, isIslandingCapable: true },
    { id: "mrg-8", name: "Ranchi Hinterlands Rural Solar-Co-op Net", capacityMw: 1.5, storageKwh: 750, isIslandingCapable: false },
    { id: "mrg-9", name: "Gopalpur Marine Wind-Solar Micro Ring", capacityMw: 2.0, storageKwh: 1400, isIslandingCapable: true },
    { id: "mrg-10", name: "Kamuthi Agriculture Pumping Peak Dispatch grid", capacityMw: 5.0, storageKwh: 4000, isIslandingCapable: true },
    { id: "mrg-11", name: "Patoda Water Purity Comm Grid Core", capacityMw: 1.1, storageKwh: 600, isIslandingCapable: true },
    { id: "mrg-12", name: "Kanthi Salt Marsh Community Solar Grid", capacityMw: 1.6, storageKwh: 900, isIslandingCapable: false },
    { id: "mrg-13", name: "Charanka Solar Agri Irrigation Booster Grid", capacityMw: 3.8, storageKwh: 2400, isIslandingCapable: true },
    { id: "mrg-14", name: "Srinagar Uplands Avalanche backup micro loop", capacityMw: 2.8, storageKwh: 2000, isIslandingCapable: true },
    { id: "mrg-15", name: "Sundarbans Delta Isolated Swamp Grid Node II", capacityMw: 1.4, storageKwh: 1000, isIslandingCapable: true }
  ],
  batteryStorageNodes: [
    { id: "bsn-1", name: "Bhadla Desert Border Lithium Buffer Suite", capacityMwh: 12.0, currentChargePct: 84 },
    { id: "bsn-2", name: "Sundarbans Resiliency Containerized Pack", capacityMwh: 8.5, currentChargePct: 62 },
    { id: "bsn-3", name: "Jawhar Communal Backup Pack Base", capacityMwh: 4.0, currentChargePct: 91 },
    { id: "bsn-4", name: "Tehri Peak Dispatch Energy Buffer Array", capacityMwh: 25.0, currentChargePct: 35 },
    { id: "bsn-5", name: "Muppandal Ridge Wind Peak Ingestion Core", capacityMwh: 18.0, currentChargePct: 52 },
    { id: "bsn-6", name: "Mandvi Camel-corps border security array", capacityMwh: 6.0, currentChargePct: 88 },
    { id: "bsn-7", name: "Odanthurai Biomass gasification firming buffer", capacityMwh: 5.0, currentChargePct: 75 },
    { id: "bsn-8", name: "Patoda water plant micro backup batteries", capacityMwh: 3.0, currentChargePct: 95 },
    { id: "bsn-9", name: "Nandurbar Forest Edge community lithium pack", capacityMwh: 2.5, currentChargePct: 70 },
    { id: "bsn-10", name: "Kolkata rural outskirts delta stabilizer", capacityMwh: 10.0, currentChargePct: 58 }
  ]
};

// Scenario Laboratory Future Shock datasets for years 2025-2050
export const FUTURE_SHOCK_DATA = [
  {
    year: 2025,
    title: "Baseline State Setup",
    renewablePct: 45,
    evAdoptionPct: 15,
    systemReliabilityPct: 99.8,
    requiredCapexCr: 550,
    carbonOffsetMillionTons: 110,
    logs: [
      "[INITIATE] Command Center: India 2040 Renewable Transition simulation initialized.",
      "[STATE] Year 2025 current baseline established. EV fleet penetration at 15%.",
      "[ALERT] Substation Corridor Mundra-Ahmedabad (Sub-14) experiencing steady peak thermal stress."
    ]
  },
  {
    year: 2030,
    title: "Midterm Consolidation Stage",
    renewablePct: 55,
    evAdoptionPct: 35,
    systemReliabilityPct: 98.4,
    requiredCapexCr: 2100,
    carbonOffsetMillionTons: 240,
    logs: [
      "[STAGE 1/4] EV adoption surge across Tier-1 cities (Mumbai, Pune, Delhi NCR) triggers heavy evening peak demand.",
      "[WARN] Severe thermal load alerts flagged on Delhi SubNCR and Hinjewadi nodes.",
      "[ACTION] Grid operator deploys Kutch batteries to shave 400MW metropolitan coincidence load."
    ]
  },
  {
    year: 2040,
    title: "Transition Horizon Milestone",
    renewablePct: 70, // CEA target met
    evAdoptionPct: 65,
    systemReliabilityPct: 96.8, // slight drop but stabilized via BESS
    requiredCapexCr: 5800, // cumulative
    carbonOffsetMillionTons: 520,
    logs: [
      "[STAGE 2/4] Carbon footprint reduced by 520 Million Metric Tons! Major milestone achieved.",
      "[CRITICAL] Retirement of baseload thermal plants (80% retirement rate) shifts inertia focus to hydro & battery fast response.",
      "[DYNAMIC] Mundra-Ahmedabad Substation 14 experiences coincident load overload. STATCOM devices active."
    ]
  },
  {
    year: 2050,
    title: "Deep Decarbonization Maturity",
    renewablePct: 95,
    evAdoptionPct: 90,
    systemReliabilityPct: 99.1, // recovery via virtual grid orchestration
    requiredCapexCr: 8000,
    carbonOffsetMillionTons: 820,
    logs: [
      "[STAGE 3/4] Deep Decarbonized Pan-India grid active: 95% clean power.",
      "[SUCCESS] Committing of final PM-KUSUM smart agricultural solar-meshing projects.",
      "[COMPLETED] Total system recovery: virtual grid models and automated self-islanding networks secure high-voltage integrity."
    ]
  }
];

// Modernization Roadmap Timeline Stages
export const MODERNIZATION_ROADMAP_STAGES = [
  {
    phase: "Phase 1: Tactical Grid Decongestion (2025 - 2028)",
    budgetCr: 1800,
    focus: "HVDC Links & Smart Grid Telemetry",
    projects: [
      "Bhadla-Delhi 800kV Green HVDC Link (Inception)",
      "Mundra-Ahmedabad Substation 14 fast reactive power installation",
      "Dynamic Air-Core Transformer Cooling Systems across Mumbai clusters"
    ],
    offsets: "Saves 45 Million tons carbon annually. Prevents thermal line-loss degradation."
  },
  {
    phase: "Phase 2: Decentralized Storage Fortification (2029 - 2032)",
    budgetCr: 2500,
    focus: "Utility-Scale Battery (BESS) & Community Solar",
    projects: [
      "Kutch Desert BESS Array - 300MWh Lead Station deployment",
      "Bangalore Electronic City Smart Aggregator V2G Node Phase II",
      "Solar Village Autonomy loop initialization (60 East/Central solar villages)"
    ],
    offsets: "Balances solar midday load peaks. Shaves evening EV charging coincident spikes."
  },
  {
    phase: "Phase 3: Deep Urban & Industrial Electrification (2033 - 2036)",
    budgetCr: 2100,
    focus: "MaaS Fleet Charging Nodes & Smart AMI Edge Networks",
    projects: [
      "Mumbai, Pune, and Delhi dwelling-cluster Smart Charging Gateways",
      "Ahmedabad GIDC heavy industry STATCOM reactive line installations",
      "Kurnool solar park collector substations upgrade to 765kV"
    ],
    offsets: "Integrates 65% EV adoption target without regional transformer collapses."
  },
  {
    phase: "Phase 4: Sovereign Microgrid Resiliency (2037 - 2040)",
    budgetCr: 1600,
    focus: "Full Grid Autonomy & Autonomous Black-Start",
    projects: [
      "Sundarbans Delta and Outer East off-grid community microgrid networks",
      "Chennai Coastal digital substations waterproofing and elevation past 2.0m flood surge",
      "Muppandal Offshore and Jaisalmer Wind telemetry control rooms remote mapping"
    ],
    offsets: "Secures final 70% Renewable Penetration. Establishes disaster-proof grid loops."
  }
];

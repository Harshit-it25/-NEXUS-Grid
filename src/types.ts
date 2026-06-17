export enum ActiveView {
  EXECUTIVE_COMMAND_CENTER = "Executive Command Center",
  DIGITAL_TWIN = "Digital Twin",
  GRID_DATA_HUB = "Grid Data Hub",
  SCENARIO_LABORATORY = "Scenario Laboratory",
  PLANNING_COUNCIL = "Planning Council",
  INVESTMENT_PRIORITIZATION = "Investment Prioritization",
  CRISIS_LABORATORY = "Crisis Laboratory",
  REPORTING_CENTER = "Reports",
  DECISION_TRACEABILITY = "Decision Traceability",
  DEMO_STORY_MODE = "60s Demo Pitch",
  IMPACT_ASSESSMENT = "Impact Assessment",
}

export interface KPIState {
  gridHealth: number;
  renewableIntegration: number;
  resilience: "HIGH" | "MEDIUM" | "LOW";
}

export interface DataHubSource {
  id: string;
  name: string;
  type: string;
  health: number;
  freshness: string;
  isLive: boolean;
  coverage: string;
  integration: string;
  status: "CONNECTED" | "POLLING" | "MAINTENANCE";
  lastSync: string;
  actionText: string;
}

export interface SyncActivityItem {
  id: string;
  name: string;
  time: string;
  description: string;
  status: "active" | "completed" | "failed";
  speed?: string;
  eta?: string;
}

export interface ScenarioParameters {
  evAdoption: number;
  populationGrowth: number;
  renewableTarget: number;
  storageFirmness: boolean;
  hydrogenReady: boolean;
  carbonCapture: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  confidence: number;
  objective: string;
  concern: string;
  tradeoffScore: number;
  isConflict: boolean;
  colorClass: string;
  avatarText: string;
  icon: string;
}

export interface PrioritizedProject {
  id: string;
  name: string;
  category: "TRANSMISSION" | "RESILIENCY" | "DISTRIBUTION" | "SECURITY";
  categoryColorClass: string;
  region: string;
  cost: number; // in Millions
  roi: number | null; // percentage, or null for N/A
  reliabilityImpact: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priorityScore: number;
  selected: boolean;
  carbonImpact?: "HIGH" | "MEDIUM" | "LOW";
  riskWeight?: number;
  communityBenefit?: number;
}

export interface RecentAction {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface CrisisNode {
  id: string;
  name: string;
  zone: string;
  status: "FAILURE" | "ACTIVE" | "DEPLOYING";
  icon: string;
  colorClass: string;
}

export interface ReportTemplate {
  id: string;
  title: string;
  revision: string;
  description: string;
  tags: string[];
  icon: string;
}

export interface GeneratedReport {
  id: string;
  name: string;
  format: "pdf" | "pptx" | "csv";
  generatedOn: string;
  owner: string;
}

export interface QueueItem {
  id: string;
  name: string;
  type: string;
  status: "processing" | "queued" | "completed";
  progress: number;
  remaining: string;
}

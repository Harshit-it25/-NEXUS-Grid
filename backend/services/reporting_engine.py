# /backend/services/reporting_engine.py
import csv
import json
import io
from typing import Dict, Any

class ReportingEngineService:
    @staticmethod
    def generate_executive_summary(grid_health: float, consensus_score: float, carbon_reduction: float) -> Dict[str, Any]:
        return {
            "title": "GridOS Cassandra Executive Council Summary",
            "compliance_rating": "AAA" if grid_health > 90 else "AA+",
            "regulatory_status": "COMPLIANT",
            "summary_paragraph": (
                f"GridOS digital twin simulation establishes a current national core health score of {grid_health}%. "
                f"Through multi-agent modeling, stakeholder alignment registers a consensus magnitude of {consensus_score}%. "
                f"Investment prioritized execution pathways will achieve an average carbon discharge reduction of {carbon_reduction}% "
                f"while safeguarding operational baseline limits."
            ),
            "key_directives": [
                "Deploy proactive battery banks to Zone B to support high renewable penetration",
                "Authorize high-priority Transformer replacements at Northeast Transmission Hub",
                "Fulfill Government compliance objectives via phased community joint venture funding"
            ]
        }
        
    @staticmethod
    def generate_infrastructure_report(substations: list, lines: list) -> Dict[str, Any]:
        warning_subs = sum(1 for s in substations if s.get("status", "OPERATIONAL") != "OPERATIONAL")
        congested_lines = sum(1 for l in lines if l.get("status", "ONLINE") == "CONGESTED")
        
        return {
            "critical_warning_count": warning_subs,
            "congested_transmission_loops": congested_lines,
            "remediation_status": "URGENT" if warning_subs > 0 else "NOMINAL",
            "risk_mitigation_vector": "Transformer replacement cycles accelerated to 12% annual frequency."
        }
        
    @staticmethod
    def export_csv_payload(rows: list, headers: list) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(headers)
        writer.writerows(rows)
        return output.getvalue()

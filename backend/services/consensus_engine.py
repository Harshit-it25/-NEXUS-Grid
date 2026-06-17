# /backend/services/consensus_engine.py
from typing import List, Dict, Any
from backend.schemas.schemas import ConsensusOutput, AgentOpinion, CompromisePlan, ConflictDescription

class ConsensusEngine:
    @staticmethod
    def calculate_alignment(opinions: List[AgentOpinion]) -> ConsensusOutput:
        # Weighted Stakeholder Utility Function
        # Weights represent the structural influence hierarchy of stakeholders in grid operations:
        # Grid Operator: 0.25, Gov: 0.20, Investment: 0.15, Risk: 0.15, Renewables: 0.10, Community: 0.10, Industry: 0.05
        weights = {
            "stk-1": 0.20, # Gov
            "stk-2": 0.25, # Operator
            "stk-3": 0.10, # Renewables
            "stk-4": 0.10, # Community
            "stk-5": 0.15, # Investment
            "stk-6": 0.15, # Risk
            "stk-7": 0.05, # Industry
        }
        
        weighted_score = 0.0
        total_weight = 0.0
        
        for op in opinions:
            weight = weights.get(op.agent_id, 0.1)
            weighted_score += op.objective_score * weight
            total_weight += weight
            
        consensus_score = weighted_score / total_weight if total_weight > 0 else 75.0
        
        # Build Conflict Matrix representing distance between objectives
        conflict_matrix = {}
        for op1 in opinions:
            conflict_matrix[op1.agent_name] = {}
            for op2 in opinions:
                # Difference in score manifests as operational conflict distance
                distance = round(abs(op1.objective_score - op2.objective_score), 1)
                conflict_matrix[op1.agent_name][op2.agent_name] = distance
                
        # Pinpoint list of significant conflicts (distance > 30)
        conflicts = []
        for i in range(len(opinions)):
            for j in range(i + 1, len(opinions)):
                op1 = opinions[i]
                op2 = opinions[j]
                dist = abs(op1.objective_score - op2.objective_score)
                if dist > 25.0:
                    reconciliation = round(100.0 - dist * 0.8, 1)
                    conflicts.append(ConflictDescription(
                        agents=[op1.agent_name, op2.agent_name],
                        critical_stress=f"Gap of {dist:.1f} points between {op1.agent_name}'s {op1.recommendation} and {op2.agent_name}'s {op2.recommendation}.",
                        reconciliation_index=reconciliation
                    ))
                    
        # Generate Compromise Plan
        # Allocate resources based on the consensus profile
        shares = {
            "transmission_hardening": round(max(15, 35 - (consensus_score - 70)), 1),
            "renewable_subventions": round(max(10, 25 + (consensus_score - 70) * 0.5), 1),
            "storage_and_resiliency": round(max(15, 20 + (100 - consensus_score) * 0.3), 1),
            "community_rate_relief": round(max(5, 20 - (consensus_score / 10)), 1)
        }
        
        # Normalize to 100%
        tot = sum(shares.values())
        for k in shares:
            shares[k] = round((shares[k] / tot) * 100.0, 1)
            
        cop_plan = CompromisePlan(
            strategy_name="Equitable Multi-Vector Modernization",
            implementation_year=2030,
            primary_vector="STABILIZATION" if consensus_score < 75 else "CARBON_DECARBONIZATION",
            allocated_shares=shares
        )
        
        # Determine overall strategy label
        if consensus_score >= 82.0:
            strategy = (
                "COOPERATIVE GRID EXPANSION PLATFORM: Accelerate smart distribution networks using private capital bonds, "
                "incorporating advanced SCADA endpoints & wind micro-grids."
            )
        elif consensus_score >= 68.0:
            strategy = (
                "BALANCED TRANSITIONAL FRAMEWORK: Phased renewable additions coupled with proactive "
                "local energy storage expansion to mitigate Operator loop bottlenecks."
            )
        else:
            strategy = (
                "CONGESTION EMERGENCY DECREE: Postpone non-critical distribution projects to allocate 100% of "
                "capital to substation reinforcement and substation battery retrofits immediately."
            )
            
        return ConsensusOutput(
            consensus_score=round(consensus_score, 2),
            conflict_matrix=conflict_matrix,
            conflicts_identified=conflicts[:4], # limit to avoid overcrowding
            compromise_plan=cop_plan,
            final_strategy=strategy
        )

"""CrisisLink AI — Root Workflow."""

from __future__ import annotations

from google.adk.workflow import START, JoinNode, Workflow

from .agents import (
    communication_agent,
    damage_agent,
    human_approval_agent,
    medical_agent,
    orchestrator_agent,
    priority_agent,
    resource_agent,
    shelter_agent,
    sos_agent,
)
from .security import security_checkpoint

_sos_damage_join = JoinNode(name="sos_damage_join")
_resource_shelter_medical_join = JoinNode(name="resource_shelter_medical_join")

root_agent = Workflow(
    name="crisislink_workflow",
    description="CrisisLink AI multi-agent disaster coordination pipeline.",
    edges=[
        (START, orchestrator_agent),
        (orchestrator_agent, (sos_agent, damage_agent)),
        ((sos_agent, damage_agent), _sos_damage_join),
        (_sos_damage_join, priority_agent),
        (priority_agent, (resource_agent, shelter_agent, medical_agent)),
        (
            (resource_agent, shelter_agent, medical_agent),
            _resource_shelter_medical_join,
        ),
        (_resource_shelter_medical_join, security_checkpoint),
        (security_checkpoint, human_approval_agent),
        (human_approval_agent, communication_agent),
    ],
)

"""Priority Agent.

Calculates a 0-100 rescue priority score using people affected,
presence of children/senior citizens, hospital proximity, road
accessibility, and medical urgency.
"""

from __future__ import annotations

from google.adk.agents import LlmAgent

from ..config import settings
from ..key_rotation import get_rotating_model
from ..mcp_client import mcp_toolset

priority_agent = LlmAgent(
    name="priority_agent",
    model=get_rotating_model(),
    mode="single_turn",
    description="Calculates a 0-100 rescue priority score.",
    tools=[mcp_toolset],
    instruction=(
        "You are the Priority Agent for a disaster-response platform.\n\n"
        "Orchestrator output:\n{orchestrator_output}\n\n"
        "SOS verification result:\n{sos_result}\n\n"
        "Damage assessment result:\n{damage_result}\n\n"
        "If verified is false in the SOS result, set priority_score to 0 and "
        "status to 'REJECTED'. Otherwise use the maps_tool and hospital_tool "
        "(if coordinates are available) to check road accessibility and "
        "hospital proximity, then compute a rescue priority score from 0-100 "
        "based on: number of people affected, presence of children/senior "
        "citizens if mentioned, hospital proximity, road accessibility, and "
        "medical urgency implied by the damage severity.\n\n"
        f"A score >= {settings.CRITICAL_PRIORITY_THRESHOLD} means CRITICAL and "
        "will require human dispatcher approval before any plan goes out.\n\n"
        "Respond ONLY with a compact JSON object in this exact shape:\n"
        '{\"priority_score\": <0-100 int>, \"priority_label\": \"LOW|MEDIUM|HIGH|CRITICAL\", '
        '\"status\": \"ACCEPTED|REJECTED\", \"reasoning\": \"short reasoning\"}'
    ),
    output_key="priority_result",
)
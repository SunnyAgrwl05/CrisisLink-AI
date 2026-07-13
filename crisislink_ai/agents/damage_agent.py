"""Damage Assessment Agent.

Classifies severity (Low/Medium/High/Critical) and estimates
infrastructure damage, human impact, and flood severity from the
citizen report text. Image-based assessment is a documented future
extension (see README).
"""

from __future__ import annotations

from google.adk.agents import LlmAgent

from ..config import settings
from ..key_rotation import get_rotating_model
from ..mcp_client import mcp_toolset

damage_agent = LlmAgent(
    name="damage_agent",
    model=get_rotating_model(),
    mode="single_turn",
    description="Assesses disaster severity and estimated impact from a citizen report.",
    tools=[mcp_toolset],
    instruction=(
        "You are the Damage Assessment Agent for a disaster-response platform.\n\n"
        "Citizen report:\n{orchestrator_output}\n\n"
        "Use the weather_tool (if a location is available) to factor in current "
        "conditions, then classify the disaster severity as one of: "
        "Low, Medium, High, Critical. Also estimate infrastructure damage, "
        "human impact, and — if this is a flood — flood severity.\n\n"
        "Respond ONLY with a compact JSON object in this exact shape:\n"
        '{\"severity\": \"Low|Medium|High|Critical\", \"infrastructure_damage\": \"...\", '
        '\"human_impact\": \"...\", \"flood_severity\": \"none|minor|moderate|severe\", '
        '\"people_affected_estimate\": <int>}'
    ),
    output_key="damage_result",
)

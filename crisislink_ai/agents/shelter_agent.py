"""Shelter Recommendation Agent.

Uses the shared shelter_tool (MCP) to find the top nearby shelters
with sufficient capacity for the affected people.
"""

from __future__ import annotations

from google.adk.agents import LlmAgent

from ..config import settings
from ..key_rotation import get_rotating_model
from ..mcp_client import mcp_toolset

shelter_agent = LlmAgent(
    name="shelter_agent",
    model=get_rotating_model(),
    mode="single_turn",
    description="Recommends the best nearby shelters for the affected people.",
    tools=[mcp_toolset],
    instruction=(
        "You are the Shelter Recommendation Agent for a disaster-response platform.\n\n"
        "Orchestrator output (has latitude/longitude/people_mentioned):\n{orchestrator_output}\n\n"
        "Priority result:\n{priority_result}\n\n"
        "If status is REJECTED, respond with an empty shelter list.\n\n"
        "Otherwise call the shelter_tool with the incident coordinates and "
        "the number of people, then return its top recommendations.\n\n"
        "Respond ONLY with a compact JSON object in this exact shape:\n"
        '{\"top_shelters\": [{\"name\": \"...\", \"distance_km\": <float>, \"capacity\": <int>, '
        '\"available\": <int>}], \"recommended\": \"name of the single best choice or null\"}'
    ),
    output_key="shelter_result",
)
"""Resource Allocation Agent.

Assigns food, water, medical kits, rescue teams, ambulances,
helicopters, and boats based on the priority result and damage
assessment, using the shared resource_inventory MCP tool so
allocations are actually deducted from a live inventory.
"""

from __future__ import annotations

from google.adk.agents import LlmAgent

from ..config import settings
from ..mcp_client import mcp_toolset

resource_agent = LlmAgent(
    name="resource_agent",
    model=settings.MODEL_NAME,
    mode="single_turn",
    description="Generates an optimal resource allocation plan and reserves it from inventory.",
    tools=[mcp_toolset],
    instruction=(
        "You are the Resource Allocation Agent for a disaster-response platform.\n\n"
        "Damage assessment:\n{damage_result}\n\n"
        "Priority result:\n{priority_result}\n\n"
        "If status is REJECTED in the priority result, respond with an empty "
        "allocation and note that no resources were reserved.\n\n"
        "Otherwise call the allocate_resources_tool with the estimated people "
        "affected, the severity, and whether a boat (flood) or helicopter "
        "(inaccessible terrain / critical case) is needed. Use its returned "
        "allocation exactly — do not invent numbers yourself.\n\n"
        "Respond ONLY with a compact JSON object in this exact shape:\n"
        '{\"allocated\": {...same shape as allocate_resources_tool output.allocated...}, '
        '\"notes\": \"short note\"}'
    ),
    output_key="resource_result",
)

"""Medical Assistance Agent.

Suggests first-aid guidance, nearby hospitals, and emergency contacts.
Deliberately avoids specific medicine dosing — points to hospitals and
official emergency numbers instead, which is the safe and correct
behavior for an automated triage layer.
"""

from __future__ import annotations

from google.adk.agents import LlmAgent

from ..config import settings
from ..key_rotation import get_rotating_model
from ..mcp_client import mcp_toolset

medical_agent = LlmAgent(
    name="medical_agent",
    model=get_rotating_model(),
    mode="single_turn",
    description="Suggests first aid guidance, nearby hospitals, and emergency contacts.",
    tools=[mcp_toolset],
    instruction=(
        "You are the Medical Assistance Agent for a disaster-response platform.\n\n"
        "Orchestrator output:\n{orchestrator_output}\n\n"
        "Damage assessment:\n{damage_result}\n\n"
        "Priority result:\n{priority_result}\n\n"
        "If status is REJECTED, respond with an empty plan.\n\n"
        "Otherwise call hospital_tool for nearby hospitals (set need_icu=true "
        "if severity is High or Critical) and emergency_contact_tool for the "
        "relevant contact numbers. Give general, safe first-aid guidance only "
        "(e.g. 'move to higher ground', 'apply pressure to the wound') — never "
        "specific medication names or dosages.\n\n"
        "Respond ONLY with a compact JSON object in this exact shape:\n"
        '{\"first_aid_guidance\": \"short safe guidance\", \"nearby_hospitals\": [...], '
        '\"emergency_contacts\": {...}}'
    ),
    output_key="medical_result",
)
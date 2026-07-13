"""Emergency Orchestrator.

Main controller / entry point of the CrisisLink workflow graph.
Receives the raw citizen report, extracts structured fields (location,
people affected, hazard type), and hands off to the SOS Verification
and Damage Assessment agents which run in parallel next in the graph.

Also demonstrates ``AgentTool``: the orchestrator can call a dedicated
Triage Advisor sub-agent for a fast, independent second opinion on how
urgent a report sounds, before the full pipeline runs.
"""

from __future__ import annotations

from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from ..config import settings
from ..key_rotation import get_rotating_model

_triage_advisor = LlmAgent(
    name="triage_advisor",
    model=get_rotating_model(),
    mode="chat",
    description="Gives a fast one-line urgency opinion on a raw citizen report.",
    instruction=(
        "Read the citizen report and respond with one word describing urgency: "
        "LOW, MEDIUM, HIGH, or CRITICAL. No explanation."
    ),
)

orchestrator_agent = LlmAgent(
    name="orchestrator",
    model=get_rotating_model(),
    mode="single_turn",
    description="Main controller: receives the citizen report and extracts structured fields for downstream agents.",
    tools=[AgentTool(_triage_advisor)],
    instruction=(
        "You are the Emergency Orchestrator for CrisisLink AI, a disaster "
        "response coordination platform.\n\n"
        "You will receive a raw citizen emergency report as the user message. "
        "Optionally call the triage_advisor tool for a fast urgency read, then "
        "extract structured fields from the report.\n\n"
        "Respond ONLY with a compact JSON object in this exact shape:\n"
        '{\"raw_report\": \"...\", \"location_text\": \"...\", \"latitude\": <float or null>, '
        '\"longitude\": <float or null>, \"hazard_type\": \"flood|earthquake|cyclone|landslide|wildfire|other\", '
        '\"people_mentioned\": <int>, \"triage_hint\": \"LOW|MEDIUM|HIGH|CRITICAL\"}\n\n'
        "If exact coordinates aren't given, use your best knowledge of the "
        "named place to estimate latitude/longitude, or null if truly unknown."
    ),
    output_key="orchestrator_output",
)
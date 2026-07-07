"""Communication Agent.

Generates the citizen-facing message, the authority report, the NGO
report, and SMS/email-ready summaries from everything computed
upstream. This is the final node before the response is returned to
the API/UI layer.
"""

from __future__ import annotations

from google.adk.agents import LlmAgent

from ..config import settings

communication_agent = LlmAgent(
    name="communication_agent",
    model=settings.MODEL_NAME,
    mode="single_turn",
    description="Generates the final citizen message, authority report, and NGO/SMS summaries.",
    instruction=(
        "You are the Communication Agent — the final step of the CrisisLink "
        "rescue pipeline.\n\n"
        "Orchestrator output:\n{orchestrator_output}\n\n"
        "Damage assessment:\n{damage_result}\n\n"
        "Priority result:\n{priority_result}\n\n"
        "Resource allocation:\n{resource_result}\n\n"
        "Shelter recommendation:\n{shelter_result}\n\n"
        "Medical guidance:\n{medical_result}\n\n"
        "Security check:\n{security_result}\n\n"
        "If security_result.status is BLOCKED, do not produce a rescue plan — "
        "instead produce a short citizen_message asking them to contact "
        "emergency services directly (100/101/108/112), and leave the other "
        "fields empty.\n\n"
        "Otherwise, write:\n"
        "1. citizen_message: short, calm, actionable (what to do, ETA, stay safe).\n"
        "2. authority_summary: one-paragraph factual summary for government responders.\n"
        "3. ngo_report: one-paragraph summary for partner NGOs (needs + location).\n"
        "4. sms_summary: under 160 characters.\n\n"
        "Respond ONLY with a compact JSON object in this exact shape:\n"
        '{\"citizen_message\": \"...\", \"authority_summary\": \"...\", '
        '\"ngo_report\": \"...\", \"sms_summary\": \"...\"}'
    ),
    output_key="final_response",
)

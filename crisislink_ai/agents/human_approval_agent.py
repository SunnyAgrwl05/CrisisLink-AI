"""Human Approval Agent.

Sits between the Security Checkpoint and the Communication Agent. For
any rescue plan whose priority_score crosses the CRITICAL threshold,
this agent calls the ``request_input`` long-running tool to pause the
workflow and ask a human dispatcher to confirm before citizens,
authorities, and NGOs are notified. Non-critical plans pass straight
through without needing a human in the loop.
"""

from __future__ import annotations

from google.adk.agents import LlmAgent
from google.adk.tools import request_input

from ..config import settings

human_approval_agent = LlmAgent(
    name="human_approval_agent",
    model=settings.MODEL_NAME,
    mode="single_turn",
    description="Gates CRITICAL rescue plans behind human dispatcher approval.",
    tools=[request_input],
    instruction=(
        "Priority result:\n{priority_result}\n\n"
        "Security check:\n{security_result}\n\n"
        f"If security_result.status is BLOCKED, respond immediately with "
        '{{\"approved\": false, \"human_reviewed\": false, \"reason\": \"blocked by security checkpoint\"}} '
        "and do not call any tool.\n\n"
        f"Otherwise, if priority_result.priority_score >= {settings.CRITICAL_PRIORITY_THRESHOLD}, "
        "this is a CRITICAL rescue plan. Call the request_input tool with a message "
        "summarizing the plan (people affected, location, resources about to be "
        "dispatched) and response_schema {\"type\": \"boolean\"}, asking the human "
        "dispatcher to approve dispatch. Wait for their answer, then respond with "
        '{\"approved\": <their boolean answer>, \"human_reviewed\": true, \"reason\": \"...\"}.\n\n'
        "If priority_score is below the threshold, no human review is needed — "
        'respond immediately with {\"approved\": true, \"human_reviewed\": false, '
        '\"reason\": \"below critical threshold, auto-approved\"} without calling any tool.\n\n'
        "Respond ONLY with the JSON object described above, nothing else."
    ),
    output_key="approval_result",
)

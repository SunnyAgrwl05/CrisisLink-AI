"""Human Approval Agent.

Uses request_input() when running interactively in ADK.
Automatically approves when running through the FastAPI REST API.
"""

from __future__ import annotations

import os

from google.adk.agents import LlmAgent
from google.adk.tools import request_input

from ..config import settings
from ..key_rotation import get_rotating_model

# ------------------------------------------------------------
# FastAPI mode:
# API_MODE=true
#
# ADK Web/UI mode:
# API_MODE=false
# ------------------------------------------------------------

API_MODE = os.getenv("API_MODE", "true").lower() == "true"

if API_MODE:

    # REST API version (auto approve)

    human_approval_agent = LlmAgent(
        name="human_approval_agent",
        model=get_rotating_model(),
        mode="single_turn",
        description="Automatically approves plans when running via REST API.",
        instruction=(
            "Priority result:\n{priority_result}\n\n"
            "Security result:\n{security_result}\n\n"

            "If security_result.status == 'BLOCKED', respond with:\n"
            '{"approved": false, '
            '"human_reviewed": false, '
            '"reason": "blocked by security checkpoint"}\n\n'

            "Otherwise respond with:\n"
            '{"approved": true, '
            '"human_reviewed": false, '
            '"reason": "auto-approved in REST API mode"}\n\n'

            "Return ONLY valid JSON."
        ),
        output_key="approval_result",
    )

else:

    # ADK UI version (interactive approval)

    human_approval_agent = LlmAgent(
        name="human_approval_agent",
        model=get_rotating_model(),
        mode="single_turn",
        description="Requests dispatcher approval for CRITICAL cases.",
        tools=[request_input],
        instruction=(
            "Priority result:\n{priority_result}\n\n"
            "Security result:\n{security_result}\n\n"

            f"If security_result.status == 'BLOCKED', respond with:\n"
            '{"approved": false, '
            '"human_reviewed": false, '
            '"reason": "blocked by security checkpoint"}\n\n'

            f"If priority_result.priority_score >= {settings.CRITICAL_PRIORITY_THRESHOLD}, "
            "call request_input asking the dispatcher whether to approve dispatch. "
            "Wait for the answer and respond with:\n"
            '{"approved": <boolean>, '
            '"human_reviewed": true, '
            '"reason": "..."}\n\n'

            "Otherwise respond with:\n"
            '{"approved": true, '
            '"human_reviewed": false, '
            '"reason": "below critical threshold"}'
        ),
        output_key="approval_result",
    )


    
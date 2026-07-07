"""Human-in-the-loop approval gate.

Any rescue plan whose priority score crosses
``settings.CRITICAL_PRIORITY_THRESHOLD`` must be confirmed by a human
dispatcher before the Communication Agent is allowed to notify
citizens/authorities/NGOs. This uses ADK's built-in ``request_input``
long-running tool, which pauses the workflow node and waits for a
human response instead of guessing.
"""

from __future__ import annotations

from google.adk.tools import request_input

from ..config import settings


def requires_human_approval(priority_score: int) -> bool:
    """Returns True if this rescue plan must be confirmed by a human."""
    if not settings.HUMAN_APPROVAL_REQUIRED_FOR_CRITICAL:
        return False
    return priority_score >= settings.CRITICAL_PRIORITY_THRESHOLD


# Exposed as an agent tool. When the Security Checkpoint agent decides a
# plan is CRITICAL, it calls this tool, which pauses the workflow run
# and surfaces a yes/no prompt to the human dispatcher via the ADK
# long-running tool protocol (adk web / adk run / your own client all
# know how to render this).
human_approval_tool = request_input

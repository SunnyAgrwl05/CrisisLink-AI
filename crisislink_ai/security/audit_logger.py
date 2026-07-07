"""Structured JSON audit logging.

Every agent decision is written as a single JSON line so the trail can
be grepped, shipped to a log pipeline, or replayed for a hackathon
demo. Levels: INFO (normal decision), WARNING (flagged but allowed,
e.g. low-confidence SOS), CRITICAL (blocked or requires human
approval).
"""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from typing import Any, Literal

LogLevel = Literal["INFO", "WARNING", "CRITICAL"]

_LOG_PATH = os.getenv("AUDIT_LOG_PATH", "audit_log.jsonl")

_logger = logging.getLogger("crisislink_ai.audit")
_logger.setLevel(logging.INFO)
if not _logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter("%(message)s"))
    _logger.addHandler(_handler)


def audit_log(
    agent: str,
    decision: str,
    level: LogLevel = "INFO",
    **extra: Any,
) -> dict[str, Any]:
    """Writes one structured audit-log entry and returns it.

    Args:
        agent: Name of the agent/node making the decision (e.g.
            "sos_agent", "security_checkpoint").
        decision: Short human-readable description of what happened.
        level: INFO | WARNING | CRITICAL.
        **extra: Any additional structured fields (priority_score,
            confidence, request_id, etc.)

    Returns:
        The log entry dict, so callers can also attach it to session
        state or an API response for full traceability.
    """
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent": agent,
        "decision": decision,
        "level": level,
        **extra,
    }
    line = json.dumps(entry, ensure_ascii=False)

    if level == "CRITICAL":
        _logger.error(line)
    elif level == "WARNING":
        _logger.warning(line)
    else:
        _logger.info(line)

    try:
        with open(_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        # Never let logging failures break the rescue pipeline.
        pass

    return entry

"""Security Checkpoint workflow node.

Runs as a plain Python function node (not an LLM call) between the
Medical Agent and the Human Approval / Communication Agents. It:

1. Masks PII (phone, email, Aadhaar, coordinates, names) in the raw
   citizen report before anything downstream logs or forwards it.
2. Scans the raw report for prompt-injection attempts.
3. Writes a structured audit-log entry for this decision.
4. Blocks the pipeline (status="BLOCKED") if an injection attempt is
   detected, or if the SOS Verification Agent rejected the report.

Being plain code (not an LLM call), this step is fast, deterministic,
and cannot itself be talked out of its job by a malicious prompt.
"""

from __future__ import annotations

import json
from typing import Any

from google.adk.agents import Context

from .audit_logger import audit_log
from .pii_masking import mask_pii
from .prompt_injection_detector import detect_prompt_injection


def _parse_json_state(ctx: Context, key: str) -> dict[str, Any]:
    """Best-effort parse of a JSON-string agent output stored in state."""
    raw = ctx.state.get(key)
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {}
    return {}


async def security_checkpoint(ctx: Context, node_input: Any = None) -> dict:
    """Masks PII, detects prompt injection, and logs the decision.

    Writes ``security_result`` into session state so downstream agent
    instructions can reference ``{security_result}``.
    """
    orchestrator_output = _parse_json_state(ctx, "orchestrator_output")
    sos_result = _parse_json_state(ctx, "sos_result")
    priority_result = _parse_json_state(ctx, "priority_result")

    raw_report = str(orchestrator_output.get("raw_report", ""))
    masked_report = mask_pii(raw_report)
    scan = detect_prompt_injection(raw_report)

    sos_verified = bool(sos_result.get("verified", True))
    priority_status = priority_result.get("status", "ACCEPTED")

    blocked = scan.flagged or (not sos_verified) or (priority_status == "REJECTED")
    status = "BLOCKED" if blocked else "PASSED"

    level = "CRITICAL" if scan.flagged else ("WARNING" if blocked else "INFO")
    audit_log(
        agent="security_checkpoint",
        decision=f"status={status}",
        level=level,
        injection_flagged=scan.flagged,
        injection_categories=scan.matched_categories,
        sos_verified=sos_verified,
        priority_status=priority_status,
        masked_report_preview=masked_report[:200],
    )

    result = {
        "status": status,
        "pii_masked": True,
        "prompt_injection_detected": scan.flagged,
        "masked_report": masked_report,
    }
    ctx.state["security_result"] = result
    return result

"""PII masking for citizen-submitted disaster reports.

Masks phone numbers, emails, Aadhaar numbers, raw GPS coordinates, and
common name-introduction patterns before any text is written to logs,
NGO reports, or third-party MCP tool calls. The *unmasked* original is
kept only in the encrypted session state used by the rescue-dispatch
path, never in audit logs or outbound communication.
"""

from __future__ import annotations

import re

_PHONE_RE = re.compile(r"(?:(?:\+91[\-\s]?)|0)?[6-9]\d{9}\b")
_EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
_AADHAAR_RE = re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b")
_COORD_RE = re.compile(r"[-+]?\d{1,3}\.\d{3,},\s*[-+]?\d{1,3}\.\d{3,}")
# Very lightweight "my name is X" / "I am X" pattern — a hackathon-grade
# heuristic, not a full NER model. Good enough to keep raw names out of
# logs; real deployments should swap this for a proper NER pipeline.
_NAME_INTRO_RE = re.compile(
    r"\b(?:my name is|i am|this is)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)",
)


def mask_pii(text: str) -> str:
    """Returns a copy of ``text`` with PII replaced by redaction tags.

    Order matters: coordinates and Aadhaar are masked before phone
    numbers since a 10-digit phone regex can otherwise false-match
    inside a coordinate pair or Aadhaar number.
    """
    if not text:
        return text

    masked = text
    masked = _COORD_RE.sub("[COORDINATES_REDACTED]", masked)
    masked = _AADHAAR_RE.sub("[AADHAAR_REDACTED]", masked)
    masked = _EMAIL_RE.sub("[EMAIL_REDACTED]", masked)
    masked = _PHONE_RE.sub("[PHONE_REDACTED]", masked)
    masked = _NAME_INTRO_RE.sub(lambda m: m.group(0).replace(m.group(1), "[NAME_REDACTED]"), masked)
    return masked


def contains_pii(text: str) -> bool:
    """Quick check used by the security checkpoint to flag unmasked PII."""
    if not text:
        return False
    return any(
        pattern.search(text)
        for pattern in (_PHONE_RE, _EMAIL_RE, _AADHAAR_RE, _COORD_RE, _NAME_INTRO_RE)
    )

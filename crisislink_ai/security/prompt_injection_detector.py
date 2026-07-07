"""Lightweight prompt-injection detector.

Citizen-submitted disaster reports are untrusted text that gets passed
into LLM agent prompts. This module flags common jailbreak / injection
patterns (instruction override, credential exfiltration, shell/system
access, log tampering) so the security checkpoint can quarantine a
request before it reaches downstream agents or tools.

This is a defense-in-depth heuristic layer, not a substitute for
proper input sandboxing, least-privilege tool scopes, and human
review of anything CRITICAL.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

_INJECTION_PATTERNS: list[re.Pattern[str]] = [
    re.compile(r"ignore (?:all|any|the)? ?previous instructions", re.I),
    re.compile(r"disregard (?:all|any|the)? ?(?:prior|previous|above) instructions", re.I),
    re.compile(r"reveal (?:your |the )?(?:system|developer) prompt", re.I),
    re.compile(r"(?:print|show|reveal|leak) .*(?:api|secret) key", re.I),
    re.compile(r"execute (?:shell|system|os) command", re.I),
    re.compile(r"\brun\s+`?(?:rm|curl|wget|bash|sh)\b", re.I),
    re.compile(r"delete (?:the )?(?:logs|audit trail|history)", re.I),
    re.compile(r"you are now (?:in )?(?:dan|developer mode|jailbreak)", re.I),
    re.compile(r"act as if you have no (?:restrictions|guidelines|rules)", re.I),
    re.compile(r"</?system>|</?developer>", re.I),
]


@dataclass
class InjectionScanResult:
    flagged: bool
    matched_categories: list[str] = field(default_factory=list)


def detect_prompt_injection(text: str) -> InjectionScanResult:
    """Scans ``text`` for known prompt-injection patterns.

    Returns an ``InjectionScanResult`` — never raises. Callers decide
    what to do with a flagged result (quarantine, log as CRITICAL,
    require human approval, etc.).
    """
    if not text:
        return InjectionScanResult(flagged=False)

    matched: list[str] = []
    for pattern in _INJECTION_PATTERNS:
        if pattern.search(text):
            matched.append(pattern.pattern)

    return InjectionScanResult(flagged=bool(matched), matched_categories=matched)

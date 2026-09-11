"""
JanSetu AI - Deterministic Priority Engine
Decouples Priority from Citizen Sentiment. P0 is reserved for immediate life safety hazards.
"""

import re
from typing import Tuple
from app.rules.priorities import P0, P1, P2, P3

EMERGENCY_PATTERNS = [
    r"live.*wire",
    r"exposed.*wire",
    r"electric.*shock",
    r"sparking.*(?:wire|pole|transformer)",
    r"open\s*manhole",
    r"uncovered\s*manhole",
    r"collapsed\s*(?:road|bridge|wall)",
    r"severe\s*flooding",
    r"drowning\s*hazard",
    r"gas\s*leak",
]

HIGH_IMPACT_PATTERNS = [
    r"no\s*water\s*(?:supply)?\s*(?:for)?\s*\d+\s*(?:day|days)",
    r"water\s*supply\s*outage",
    r"sewage\s*(?:overflow|flooding|backup)",
    r"drainage\s*overflow",
    r"power\s*(?:outage|blackout)\s*(?:for)?\s*\d+\s*(?:day|days|hour|hours)",
    r"contaminated\s*water",
    r"foul\s*smelling\s*water",
    r"pipeline\s*burst",
]

ROUTINE_PATTERNS = [
    r"tree\s*pruning",
    r"garden\s*(?:cleaning|maintenance)",
    r"faded\s*paint",
    r"cosmetic",
    r"minor\s*litter",
]


def evaluate_priority(text: str, duration_days: int = 0) -> Tuple[str, str]:
    """
    Evaluates grievance text deterministically.
    Returns (priority, explanation).
    """
    lower_text = text.lower()

    # P0 Check: Immediate Safety Hazards
    for pat in EMERGENCY_PATTERNS:
        if re.search(pat, lower_text):
            return P0, "Identified immediate life-safety hazard requiring emergency response team."

    # P1 Check: Major Public Impact or Multi-day Outages
    for pat in HIGH_IMPACT_PATTERNS:
        if re.search(pat, lower_text):
            return P1, "Major civic service outage or public health disruption detected."
    if duration_days >= 2:
        return P1, f"Reported service outage duration ({duration_days} days) represents significant public impact."

    # P3 Check: Routine / Cosmetic
    for pat in ROUTINE_PATTERNS:
        if re.search(pat, lower_text):
            return P3, "Classified as routine or non-urgent cosmetic municipal maintenance."

    # Default: P2 Medium (Important non-immediate civic maintenance)
    return P2, "Standard municipal maintenance issue affecting local neighborhood infrastructure."


def determine_priority(text: str, severity: str = None, urgency: str = None, sentiment_score: float = 0.0) -> str:
    """
    Determines priority while strictly ensuring negative sentiment alone does not inflate priority.
    Prioritizes real safety hazard and outage rules.
    """
    if severity == P0 or urgency == P0:
        return P0
    prio, _ = evaluate_priority(text)
    if severity == P3 and prio not in [P0, P1]:
        return P3
    return prio

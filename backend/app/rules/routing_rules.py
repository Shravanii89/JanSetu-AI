"""
JanSetu AI - Controlled Department Routing Engine
Maps grievances strictly to the 8 PMC departments or OTHER_HUMAN_REVIEW.
"""

import re
from typing import Tuple
from app.rules.departments import (
    WATER_SUPPLY, ELECTRICITY, PUBLIC_HEALTH, WASTE_MANAGEMENT,
    PUBLIC_PROPERTY_MANAGEMENT, GARDEN, ROAD, ENCROACHMENT, OTHER_HUMAN_REVIEW
)

DEPARTMENT_KEYWORDS = {
    WATER_SUPPLY: [
        r"\bwater\b", r"\bpani\b", r"\bjal\b", r"\bpipeline\b", r"\btap\b", r"\btanker\b",
        r"\bwater\s*supply\b", r"\bdrinking\s*water\b", r"\blow\s*pressure\b"
    ],
    ELECTRICITY: [
        r"\belectric", r"\bpower\b", r"\bvibhag\b", r"\blight\b", r"\bstreetlight\b",
        r"\bwire\b", r"\bpole\b", r"\btransformer\b", r"\bblackout\b", r"\bsparking\b", r"\bcurrent\b"
    ],
    PUBLIC_HEALTH: [
        r"\bsewage\b", r"\bgutter\b", r"\bdrain", r"\bnallah\b", r"\bmosquito", r"\bdengue\b",
        r"\bmalaria\b", r"\bsanitation\b", r"\bmanhole\b", r"\bstink", r"\bfoul\s*smell\b"
    ],
    WASTE_MANAGEMENT: [
        r"\bgarbage\b", r"\bwaste\b", r"\btrash\b", r"\bkachra\b", r"\bdump", r"\bcleaning\b",
        r"\bsweeping\b", r"\bbin\b", r"\bdustbin\b", r"\blitter\b"
    ],
    ROAD: [
        r"\broad\b", r"\brasta\b", r"\bpothole\b", r"\bgadde\b", r"\basphalt\b", r"\btar\b",
        r"\bcave-in\b", r"\bdivider\b", r"\bspeed\s*breaker\b"
    ],
    GARDEN: [
        r"\btree\b", r"\bbranch\b", r"\bgarden\b", r"\bpark\b", r"\bbagh\b", r"\budyan\b",
        r"\bgrass\b", r"\bpruning\b", r"\bplayground\b"
    ],
    ENCROACHMENT: [
        r"\bencroach", r"\bhawker\b", r"\billegal\s*stall\b", r"\bunauthorized\b",
        r"\bfootpath\s*block", r"\b कब्जा\b", r"\bati-kraman\b", r"\bhoarding\b"
    ],
    PUBLIC_PROPERTY_MANAGEMENT: [
        r"\bbus\s*stop\b", r"\bpublic\s*toilet\b", r"\bmunicipal\s*building\b",
        r"\bcommunity\s*hall\b", r"\bgovernment\s*property\b", r"\bboundary\s*wall\b"
    ],
}


def route_to_department(text: str) -> Tuple[str, str]:
    """
    Deterministically determines the responsible department from complaint text.
    Returns (department_id, reasoning).
    """
    lower_text = text.lower()
    scores = {}

    for dept, patterns in DEPARTMENT_KEYWORDS.items():
        score = 0
        for pat in patterns:
            if re.search(pat, lower_text):
                score += 1
        if score > 0:
            scores[dept] = score

    if not scores:
        return OTHER_HUMAN_REVIEW, "Grievance text did not conclusively match any specific department keywords."

    # Return department with highest score
    best_dept = max(scores.items(), key=lambda x: x[1])[0]
    return best_dept, f"Grievance matched {scores[best_dept]} domain keyword(s) associated with {best_dept}."

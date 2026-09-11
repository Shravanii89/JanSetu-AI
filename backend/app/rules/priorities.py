"""
JanSetu AI - Priority Tier Definitions
"""

P0 = "P0"  # Critical / Emergency (Immediate safety risk to human life)
P1 = "P1"  # High (Major service disruption or public impact)
P2 = "P2"  # Medium (Important non-immediate issue)
P3 = "P3"  # Low (Routine / cosmetic maintenance)

ALL_PRIORITIES = [P0, P1, P2, P3]


def is_valid_priority(priority: str) -> bool:
    return priority in ALL_PRIORITIES

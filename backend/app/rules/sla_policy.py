"""
JanSetu AI - Deterministic Demo SLA Policy Engine
Calculates deadlines and evaluates SLA compliance deterministically.
"""

from datetime import datetime, timedelta
from typing import Dict, Tuple
from app.rules.priorities import P0, P1, P2, P3
from app.core.time import get_ist_now, to_ist_naive

# Demo SLA Policy targets (in hours)
# P0: Response 15m (0.25h), Resolution 4h
# P1: Response 2h, Resolution 24h
# P2: Response 8h, Resolution 48h
# P3: Response 24h, Resolution 120h (5 days)
DEMO_SLA_POLICY: Dict[str, Dict[str, float]] = {
    P0: {"response_hours": 0.25, "resolution_hours": 4.0},
    P1: {"response_hours": 2.0, "resolution_hours": 24.0},
    P2: {"response_hours": 8.0, "resolution_hours": 48.0},
    P3: {"response_hours": 24.0, "resolution_hours": 120.0},
}
SLA_POLICY = DEMO_SLA_POLICY


def calculate_deadlines(priority: str, start_time: datetime = None) -> Tuple[datetime, datetime]:
    """Calculates response and resolution deadlines in Indian Standard Time (IST)."""
    if not start_time:
        start_time = get_ist_now()

    policy = DEMO_SLA_POLICY.get(priority, DEMO_SLA_POLICY[P2])
    response_deadline = start_time + timedelta(hours=policy["response_hours"])
    resolution_deadline = start_time + timedelta(hours=policy["resolution_hours"])
    return response_deadline, resolution_deadline


def evaluate_sla_status(
    priority: str,
    created_at: datetime,
    resolved_at: datetime = None,
    is_paused: bool = False,
    now: datetime = None,
) -> str:
    """
    Evaluates SLA state in IST:
    WITHIN_SLA, AT_RISK (>= 75% elapsed), BREACHED, PAUSED, RESOLVED
    """
    if resolved_at is not None:
        return "RESOLVED"
    if is_paused:
        return "PAUSED"

    if not now:
        now = get_ist_now()

    # Align naive and aware datetimes to prevent subtraction errors
    if created_at.tzinfo is not None and now.tzinfo is None:
        now = to_ist_naive(now)
        created_at = to_ist_naive(created_at)
    elif created_at.tzinfo is None and now.tzinfo is not None:
        now = to_ist_naive(now)
        created_at = to_ist_naive(created_at)

    policy = DEMO_SLA_POLICY.get(priority, DEMO_SLA_POLICY[P2])
    total_allowed_seconds = policy["resolution_hours"] * 3600
    elapsed_seconds = (now - created_at).total_seconds()

    if elapsed_seconds >= total_allowed_seconds:
        return "BREACHED"
    elif elapsed_seconds >= (total_allowed_seconds * 0.75):
        return "AT_RISK"
    return "WITHIN_SLA"

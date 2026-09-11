"""
JanSetu AI - Priority & SLA Tests
"""

from datetime import datetime, timedelta, timezone
from app.rules.priorities import P0, P1, P2, P3
from app.rules.priority_rules import determine_priority
from app.rules.sla_policy import calculate_deadlines, evaluate_sla_status


def test_priority_decoupling_from_sentiment():
    # Negative sentiment alone does not make a cosmetic issue P0 or P1
    prio_cosmetic = determine_priority("broken garden bench", severity="P3", urgency="P3", sentiment_score=-0.9)
    assert prio_cosmetic == P3

    # Hazardous condition triggers P0 regardless of calm text
    prio_p0 = determine_priority("live wire hanging", severity="P0", urgency="P0", sentiment_score=0.0)
    assert prio_p0 == P0


def test_sla_deadlines_calculation():
    now = datetime.now(timezone.utc)
    resp_p0, res_p0 = calculate_deadlines(P0, start_time=now)
    # P0 resolution target is 4 hours
    assert (res_p0 - now).total_seconds() == 4 * 3600

    resp_p1, res_p1 = calculate_deadlines(P1, start_time=now)
    # P1 resolution target is 24 hours
    assert (res_p1 - now).total_seconds() == 24 * 3600


def test_sla_evaluation_states():
    now = datetime.now(timezone.utc)

    # 1. Created 1 hour ago for P1 (24h resolution): Within SLA
    status_within = evaluate_sla_status(P1, created_at=now - timedelta(hours=1), now=now)
    assert status_within == "WITHIN_SLA"

    # 2. Created 20 hours ago for P1 (>75% of 24h): At Risk
    status_risk = evaluate_sla_status(P1, created_at=now - timedelta(hours=20), now=now)
    assert status_risk == "AT_RISK"

    # 3. Created 26 hours ago for P1 (>24h): Breached
    status_breached = evaluate_sla_status(P1, created_at=now - timedelta(hours=26), now=now)
    assert status_breached == "BREACHED"

    # 4. Paused SLA
    status_paused = evaluate_sla_status(P1, created_at=now - timedelta(hours=10), is_paused=True, now=now)
    assert status_paused == "PAUSED"

    # 5. Resolved SLA
    status_resolved = evaluate_sla_status(P1, created_at=now - timedelta(hours=10), resolved_at=now - timedelta(hours=1), now=now)
    assert status_resolved == "RESOLVED"

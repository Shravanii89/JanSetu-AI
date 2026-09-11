"""
JanSetu AI - Escalation Rules Engine
Determines when tickets must escalate to Municipal Admin or Collector.
"""

from app.rules.priorities import P0
from app.rules.roles import MUNICIPAL_ADMIN, COLLECTOR


def check_auto_escalation(priority: str, sla_status: str) -> tuple[bool, str, str]:
    """
    Evaluates if a ticket triggers automatic escalation.
    Returns (should_escalate, target_role, reason).
    """
    if priority == P0:
        return True, COLLECTOR, "P0 Emergency life-safety hazard triggers immediate leadership oversight."
    if sla_status == "BREACHED":
        return True, MUNICIPAL_ADMIN, "SLA deadline breached without verified resolution."
    return False, "", ""

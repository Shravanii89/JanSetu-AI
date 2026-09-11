"""
JanSetu AI - Server-Side RBAC & Authorization Rules
Enforces server-side department isolation. Frontend state is untrusted.
"""

from app.rules.roles import CITIZEN, MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR


def can_view_ticket(user_role: str, user_dept_id: str, ticket_dept_id: str) -> bool:
    """Checks if a user can view a specific ticket."""
    if user_role in [MUNICIPAL_ADMIN, COLLECTOR]:
        return True
    if user_role == DEPARTMENT_OFFICER:
        return user_dept_id == ticket_dept_id
    return False


def can_modify_ticket(user_role: str, user_dept_id: str, ticket_dept_id: str) -> bool:
    """Checks if an official user can modify a ticket (status, notes, priority)."""
    if user_role == MUNICIPAL_ADMIN:
        return True
    if user_role == DEPARTMENT_OFFICER:
        return user_dept_id == ticket_dept_id
    return False


def can_reroute_department(user_role: str) -> bool:
    """Only Municipal Admin can re-route tickets across departments."""
    return user_role == MUNICIPAL_ADMIN


def can_view_admin_metrics(user_role: str) -> bool:
    return user_role == MUNICIPAL_ADMIN


def can_view_collector_brief(user_role: str) -> bool:
    return user_role in [COLLECTOR, MUNICIPAL_ADMIN]

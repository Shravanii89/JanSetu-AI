"""
JanSetu AI - Role Definitions
Enforces exactly 4 roles. SUPER_ADMIN is permanently prohibited.
"""

from typing import List

CITIZEN = "CITIZEN"
MUNICIPAL_ADMIN = "MUNICIPAL_ADMIN"
DEPARTMENT_OFFICER = "DEPARTMENT_OFFICER"
COLLECTOR = "COLLECTOR"

ALL_ROLES: List[str] = [
    CITIZEN,
    MUNICIPAL_ADMIN,
    DEPARTMENT_OFFICER,
    COLLECTOR,
]


def is_valid_role(role: str) -> bool:
    return role in ALL_ROLES

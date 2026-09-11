"""
JanSetu AI - Controlled Department Routing Tests
"""

from app.rules.departments import (
    validate_department,
    is_valid_department,
    WATER_SUPPLY,
    ROAD,
    OTHER_HUMAN_REVIEW,
    CONTROLLED_DEPARTMENTS,
)


def test_controlled_department_count():
    # Exactly 8 controlled departments + 1 fallback
    assert len(CONTROLLED_DEPARTMENTS) == 9


def test_valid_department_validation():
    assert validate_department("WATER_SUPPLY") == WATER_SUPPLY
    assert validate_department("ROAD") == ROAD
    assert is_valid_department("ELECTRICITY") is True


def test_invalid_department_fallback():
    # AI or client must never invent a department; must fall back to OTHER_HUMAN_REVIEW
    assert validate_department("UNKNOWN_SPACE_DEPT") == OTHER_HUMAN_REVIEW
    assert validate_department("") == OTHER_HUMAN_REVIEW
    assert is_valid_department("NON_EXISTENT") is False

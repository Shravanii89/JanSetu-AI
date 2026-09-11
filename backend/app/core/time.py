"""
JanSetu AI - Centralized Indian Standard Time (IST) Engine
Standardizes all datetime operations to Indian Standard Time (Asia/Kolkata, UTC+05:30)
across PostgreSQL storage, business logic, SLA computation, and API responses.
"""

from datetime import datetime, timezone, timedelta
from typing import Optional
from zoneinfo import ZoneInfo

# Indian Standard Time (IST) is UTC+05:30
try:
    IST = ZoneInfo("Asia/Kolkata")
except Exception:
    IST = timezone(timedelta(hours=5, minutes=30), name="IST")

IST_OFFSET = timedelta(hours=5, minutes=30)


def get_ist_now() -> datetime:
    """
    Returns current datetime in Indian Standard Time as a naive datetime object.
    Suitable for PostgreSQL TIMESTAMP WITHOUT TIME ZONE columns so that database
    records store the exact local Indian Standard Time.
    """
    return datetime.now(IST).replace(tzinfo=None)


def get_ist_now_aware() -> datetime:
    """
    Returns current datetime in Indian Standard Time with tzinfo=IST.
    """
    return datetime.now(IST)


def to_ist(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Converts any datetime to a timezone-aware IST datetime.
    - If dt is naive, assumes it is already local IST and sets tzinfo=IST.
    - If dt is aware, converts to IST.
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=IST)
    return dt.astimezone(IST)


def to_ist_naive(dt: Optional[datetime]) -> Optional[datetime]:
    """
    Converts any datetime to naive IST datetime for database persistence.
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt
    return dt.astimezone(IST).replace(tzinfo=None)


def format_ist_iso(dt: Optional[datetime]) -> Optional[str]:
    """
    Serializes a datetime into an ISO-8601 string with explicit '+05:30' offset.
    E.g., '2026-09-06T21:13:00+05:30'.
    Guarantees clients in any timezone parse the exact local IST timestamp.
    """
    if dt is None:
        return None
    aware = to_ist(dt)
    return aware.isoformat()

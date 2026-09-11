"""
JanSetu AI - Tests for Indian Standard Time (IST) Engine and Synchronization
"""

import pytest
from datetime import datetime, timezone, timedelta
from app.core.time import get_ist_now, get_ist_now_aware, to_ist, to_ist_naive, format_ist_iso, IST


def test_ist_timezone_offset():
    """Verify IST is strictly UTC+05:30."""
    now_ist = get_ist_now_aware()
    offset = now_ist.utcoffset()
    assert offset == timedelta(hours=5, minutes=30)


def test_get_ist_now_is_naive():
    """Verify get_ist_now returns naive datetime representing local IST."""
    now_ist = get_ist_now()
    assert now_ist.tzinfo is None
    utc_now = datetime.now(timezone.utc)
    # The hour difference should match the +5h30m difference between UTC and IST
    # (allowing minute edge-case transition)
    expected_ist_hour = (utc_now + timedelta(hours=5, minutes=30)).hour
    assert abs(now_ist.hour - expected_ist_hour) in (0, 23)  # wrap-around handling


def test_to_ist_conversion():
    """Verify timezone conversion to IST."""
    # From UTC
    utc_dt = datetime(2026, 9, 6, 15, 43, 0, tzinfo=timezone.utc)
    ist_dt = to_ist(utc_dt)
    assert ist_dt.hour == 21
    assert ist_dt.minute == 13
    assert ist_dt.day == 6

    # Naive assumed to be IST
    naive_dt = datetime(2026, 9, 6, 21, 13, 0)
    aware_ist = to_ist(naive_dt)
    assert aware_ist.tzinfo == IST
    assert aware_ist.hour == 21
    assert aware_ist.minute == 13


def test_to_ist_naive():
    """Verify to_ist_naive returns naive IST datetime."""
    utc_dt = datetime(2026, 9, 6, 15, 43, 0, tzinfo=timezone.utc)
    naive = to_ist_naive(utc_dt)
    assert naive.tzinfo is None
    assert naive.hour == 21
    assert naive.minute == 13


def test_format_ist_iso():
    """Verify format_ist_iso produces explicit +05:30 offset."""
    dt = datetime(2026, 9, 6, 21, 13, 0)
    formatted = format_ist_iso(dt)
    assert "+05:30" in formatted
    assert "2026-09-06T21:13:00+05:30" == formatted

    # From UTC
    utc_dt = datetime(2026, 9, 6, 15, 43, 0, tzinfo=timezone.utc)
    formatted_utc = format_ist_iso(utc_dt)
    assert "2026-09-06T21:13:00+05:30" == formatted_utc

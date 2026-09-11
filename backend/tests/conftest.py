"""
Pytest Fixtures for JanSetu AI Test Suite
"""

import sys
import os
import asyncio
import pytest

# Ensure repository root and backend directory are in sys.path
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(REPO_ROOT, "backend")
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.db.session import init_db, AsyncSessionLocal, engine
from app.models.user import UserModel
from sqlalchemy import select


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Ensure database schema is created and seeded before running tests."""
    async def _setup():
        await init_db()
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(UserModel).filter_by(email="admin@jansetu.local"))
            if not result.scalars().first():
                from scripts.seed_database import seed_data
                await seed_data()
        await engine.dispose()

    asyncio.run(_setup())


@pytest.fixture
def mock_db_session():
    return None


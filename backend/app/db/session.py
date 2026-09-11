"""
JanSetu AI - Database Engine, Session Management & Automatic Initialization
Supports PostgreSQL / Supabase with zero-dependency local SQLite fallback.
"""

import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.core.config import settings

raw_url = os.getenv("DATABASE_URL")
if not raw_url:
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    db_path = os.path.join(project_root, "jansetu_dev.db").replace("\\", "/")
    raw_url = f"sqlite+aiosqlite:///{db_path}"

# Convert standard postgresql:// to asyncpg if needed
if raw_url.startswith("postgresql://"):
    ASYNC_DATABASE_URL = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif raw_url.startswith("postgres://"):
    ASYNC_DATABASE_URL = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif raw_url.startswith("sqlite:///") and not raw_url.startswith("sqlite+aiosqlite:///"):
    ASYNC_DATABASE_URL = raw_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
else:
    ASYNC_DATABASE_URL = raw_url

# Engine configuration
connect_args = {}
if "sqlite" in ASYNC_DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides an async database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Creates all database tables on application startup."""
    # Import all models to register with Base.metadata
    from app.models import (
        user, department, complaint, ticket, assignment,
        clarification, ai_analysis, sla, incident, escalation,
        attachment, notification, audit_log
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

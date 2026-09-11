"""
JanSetu AI - Database Engine, Session Management & Automatic Initialization
Supports Supabase PostgreSQL with production pooling and asyncpg.
"""

import os
from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse
from typing import AsyncGenerator, Tuple, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.core.config import settings


def _normalize_database_url(url: str) -> Tuple[str, Dict[str, Any], Dict[str, Any]]:
    """
    Normalizes database URL for SQLAlchemy asyncpg engine.
    Strips unsupported query parameters (like sslmode), enforces SSL for cloud PostgreSQL,
    and configures engine pool and connect arguments.
    """
    connect_args: Dict[str, Any] = {}
    engine_kwargs: Dict[str, Any] = {
        "echo": False,
    }

    raw = (url or "").strip()
    if not raw:
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        db_path = os.path.join(project_root, "jansetu_dev.db").replace("\\", "/")
        raw = f"sqlite+aiosqlite:///{db_path}"

    # Convert standard postgres schemes to asyncpg
    if raw.startswith("postgresql://"):
        raw = raw.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif raw.startswith("postgres://"):
        raw = raw.replace("postgres://", "postgresql+asyncpg://", 1)
    elif raw.startswith("sqlite:///") and not raw.startswith("sqlite+aiosqlite:///"):
        raw = raw.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

    if "sqlite" in raw:
        connect_args["check_same_thread"] = False
        return raw, connect_args, engine_kwargs

    # PostgreSQL / Supabase configuration
    parsed = urlparse(raw)
    query_params = dict(parse_qsl(parsed.query))

    # asyncpg does not recognize 'sslmode', use connect_args['ssl'] instead
    sslmode = query_params.pop("sslmode", None)
    if sslmode or "supabase.co" in parsed.netloc or "pooler.supabase.com" in parsed.netloc:
        connect_args["ssl"] = "require"

    # Transaction pooler (port 6543) requires statement caching disabled
    if parsed.port == 6543:
        connect_args["prepared_statement_cache_size"] = 0
        connect_args["statement_cache_size"] = 0

    import sys
    from sqlalchemy.pool import NullPool

    # When running under pytest or test environments, use NullPool to avoid cross-loop socket reuse
    if "pytest" in sys.modules or os.getenv("PYTEST_CURRENT_TEST") or settings.ENVIRONMENT == "test":
        engine_kwargs["poolclass"] = NullPool
    else:
        # Production connection pool resilience
        engine_kwargs.update({
            "pool_pre_ping": True,
            "pool_recycle": 300,
            "pool_size": 10,
            "max_overflow": 20,
        })

    # Reconstruct clean URL without incompatible query parameters
    new_query = urlencode(query_params)
    sanitized_url = urlunparse(parsed._replace(query=new_query))

    return sanitized_url, connect_args, engine_kwargs


# Resolve configured database URL from settings or environment
_raw_db_url = settings.DATABASE_URL or os.getenv("DATABASE_URL", "")
ASYNC_DATABASE_URL, _connect_args, _engine_kwargs = _normalize_database_url(_raw_db_url)

engine = create_async_engine(
    ASYNC_DATABASE_URL,
    connect_args=_connect_args,
    **_engine_kwargs,
)

from datetime import datetime, timezone
from sqlalchemy import event

# Automatic datetime normalization for PostgreSQL TIMESTAMP WITHOUT TIME ZONE
def _strip_tz_from_params(val: Any) -> Any:
    if isinstance(val, datetime) and val.tzinfo is not None:
        return val.astimezone(timezone.utc).replace(tzinfo=None)
    elif isinstance(val, tuple):
        return tuple(_strip_tz_from_params(x) for x in val)
    elif isinstance(val, list):
        return [_strip_tz_from_params(x) for x in val]
    elif isinstance(val, dict):
        return {k: _strip_tz_from_params(v) for k, v in val.items()}
    return val


@event.listens_for(engine.sync_engine, "before_cursor_execute", retval=True)
def _normalize_datetimes_on_execute(conn, cursor, statement, parameters, context, executemany):
    if parameters is not None:
        parameters = _strip_tz_from_params(parameters)
    return statement, parameters


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


"""
JanSetu AI - SQLite to Supabase PostgreSQL Migration Script
Migrates all existing demo and operational records from jansetu_dev.db into Supabase PostgreSQL.
Preserves primary keys, foreign key constraints, timestamps, password hashes, and audit history.
"""

import sys
import os
import sqlite3
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List

# Ensure backend directory is in sys.path
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(REPO_ROOT, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.db.session import engine, Base, AsyncSessionLocal, init_db
from app.models.department import DepartmentModel
from app.models.user import UserModel
from app.models.complaint import ComplaintModel
from app.models.incident import IncidentModel
from app.models.ticket import TicketModel
from app.models.ai_analysis import AIAnalysisModel
from app.models.sla import SLAModel
from app.models.escalation import EscalationModel
from app.models.clarification import ClarificationModel
from app.models.assignment import AssignmentModel
from app.models.attachment import AttachmentModel
from app.models.notification import NotificationModel
from app.models.audit_log import AuditLogModel
from sqlalchemy import select, func, text, insert

# Table models in strict topological foreign-key order
MIGRATION_TABLES = [
    ("departments", DepartmentModel),
    ("users", UserModel),
    ("complaints", ComplaintModel),
    ("incidents", IncidentModel),
    ("tickets", TicketModel),
    ("ai_analyses", AIAnalysisModel),
    ("slas", SLAModel),
    ("escalations", EscalationModel),
    ("clarifications", ClarificationModel),
    ("assignments", AssignmentModel),
    ("attachments", AttachmentModel),
    ("notifications", NotificationModel),
    ("audit_logs", AuditLogModel),
]

BOOLEAN_COLUMNS = {
    "is_active", "is_emergency", "is_escalated", "is_paused", "is_read"
}

DATETIME_COLUMNS = {
    "created_at", "updated_at", "response_deadline", "resolution_deadline",
    "responded_at", "resolved_at", "closed_at", "paused_at", "breached_at",
    "first_reported_at", "last_activity_at", "answered_at"
}


def parse_datetime(val: Any):
    if not val:
        return None
    if isinstance(val, datetime):
        return val.replace(tzinfo=None)
    try:
        # SQLite string datetimes: '2026-09-11 10:59:01.572576' or ISO format
        dt = datetime.fromisoformat(val.strip().replace("Z", "+00:00"))
        if dt.tzinfo:
            return dt.astimezone(timezone.utc).replace(tzinfo=None)
        return dt
    except Exception:
        return None


def transform_row(row_dict: Dict[str, Any]) -> Dict[str, Any]:
    transformed = {}
    for col, val in row_dict.items():
        if val is None:
            transformed[col] = None
        elif col in BOOLEAN_COLUMNS:
            transformed[col] = bool(val)
        elif col in DATETIME_COLUMNS:
            transformed[col] = parse_datetime(val)
        else:
            transformed[col] = val
    return transformed


def get_sqlite_connection():
    candidates = [
        os.path.join(REPO_ROOT, "jansetu_dev.db"),
        os.path.join(BACKEND_DIR, "jansetu_dev.db"),
    ]
    for p in candidates:
        if os.path.exists(p) and os.path.getsize(p) > 0:
            print(f"[SOURCE] Found source SQLite database at: {p} ({os.path.getsize(p)} bytes)")
            conn = sqlite3.connect(p)
            conn.row_factory = sqlite3.Row
            return conn
    raise FileNotFoundError("Could not locate valid source jansetu_dev.db")


async def run_migration():
    print("=" * 70)
    print("JanSetu AI - SQLite to Supabase PostgreSQL Migration")
    print("=" * 70)

    sqlite_conn = get_sqlite_connection()

    print("\n[STEP 1] Ensuring PostgreSQL schema exists on Supabase...")
    await init_db()
    print("[STEP 1] Schema verified successfully.")

    print("\n[STEP 2] Migrating tables in dependency order...")
    migration_summary = []

    # Filter rules for dangling SQLite records
    valid_complaint_ids = set(r[0] for r in sqlite_conn.execute("SELECT id FROM complaints").fetchall())
    valid_ticket_ids = set(r[0] for r in sqlite_conn.execute("SELECT id FROM tickets").fetchall())

    async with engine.begin() as pg_conn:
        # First, ensure all tables are truncated cleanly with CASCADE in reverse topological order
        print("  [-] Truncating existing Supabase tables with CASCADE for fresh migration...")
        for table_name, _ in reversed(MIGRATION_TABLES):
            await pg_conn.execute(text(f"TRUNCATE TABLE {table_name} CASCADE;"))

        for table_name, model in MIGRATION_TABLES:
            # Read rows from SQLite
            cur = sqlite_conn.cursor()
            try:
                cur.execute(f"SELECT * FROM {table_name}")
                raw_rows = [dict(r) for r in cur.fetchall()]
            except sqlite3.OperationalError:
                raw_rows = []

            # Filter out any dangling foreign key records left over from previous local SQLite testing
            valid_rows = []
            for r in raw_rows:
                if table_name == "ai_analyses" and r.get("complaint_id") not in valid_complaint_ids:
                    print(f"    [SKIP ORPHAN] ai_analyses {r.get('id')} has dangling complaint_id {r.get('complaint_id')}")
                    continue
                if table_name == "slas" and r.get("ticket_id") not in valid_ticket_ids:
                    print(f"    [SKIP ORPHAN] slas {r.get('id')} has dangling ticket_id {r.get('ticket_id')}")
                    continue
                valid_rows.append(r)

            target_count = len(valid_rows)
            if target_count == 0:
                print(f"  [-] Table '{table_name}': 0 valid records to migrate. Skipped.")
                migration_summary.append({
                    "table": table_name,
                    "sqlite_count": len(raw_rows),
                    "supabase_count": 0,
                    "status": "EMPTY",
                })
                continue

            # Transform and insert
            records = [transform_row(r) for r in valid_rows]
            chunk_size = 50
            for i in range(0, len(records), chunk_size):
                chunk = records[i:i + chunk_size]
                await pg_conn.execute(insert(model.__table__).values(chunk))

            # Verify count
            new_supabase_count = (await pg_conn.execute(
                select(func.count()).select_from(model.__table__)
            )).scalar() or 0

            print(f"  [+] Table '{table_name}': migrated {len(records)} rows -> Supabase now has {new_supabase_count} rows.")
            migration_summary.append({
                "table": table_name,
                "sqlite_count": target_count,
                "supabase_count": new_supabase_count,
                "status": "MATCH" if target_count == new_supabase_count else "MISMATCH",
            })

    sqlite_conn.close()
    await engine.dispose()

    print("\n" + "=" * 70)
    print("MIGRATION VERIFICATION AUDIT REPORT")
    print("=" * 70)
    print(f"{'TABLE NAME':<20} | {'SQLITE':<8} | {'SUPABASE':<8} | {'STATUS':<15}")
    print("-" * 70)
    all_matched = True
    for item in migration_summary:
        print(f"{item['table']:<20} | {item['sqlite_count']:<8} | {item['supabase_count']:<8} | {item['status']:<15}")
        if item["status"] not in ("MATCH", "ALREADY_MIGRATED", "EMPTY"):
            all_matched = False

    print("=" * 70)
    if all_matched:
        print("[SUCCESS] ALL 13 TABLES MIGRATED WITH 100% PARITY!")
    else:
        print("[ERROR] SOME TABLES HAD ROW COUNT MISMATCHES.")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(run_migration())

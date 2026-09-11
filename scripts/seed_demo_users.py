"""
JanSetu AI - Upsert Demo Accounts Script
Ensures demo accounts exist in Supabase PostgreSQL without dropping any data.
"""

import sys
import os
import asyncio

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(REPO_ROOT, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.db.session import engine, AsyncSessionLocal
from app.models.user import UserModel
from app.core.security import get_password_hash
from app.core.time import get_ist_now
from sqlalchemy import select


DEMO_USERS = [
    {
        "email": "citizen@jansetu.demo",
        "employee_id": None,
        "full_name": "Pooja Kadam (Citizen of Pune)",
        "role": "CITIZEN",
        "department_id": None,
        "phone": "9822000001",
        "password": "citizen123",
        "address": "B-402, Shivajinagar, Pune",
        "ward": "Ward 7 (Shivajinagar)",
        "preferred_language": "en",
    },
    {
        "email": "water.admin@jansetu.demo",
        "employee_id": "PMC-ADM-WTR",
        "full_name": "Anil Kulkarni (Municipal Admin - Water)",
        "role": "MUNICIPAL_ADMIN",
        "department_id": "WATER_SUPPLY",
        "phone": "9822000002",
        "password": "admin123",
        "address": "PMC Headquarters, Shivajinagar, Pune",
        "ward": "Ward 12 (Pune West)",
        "preferred_language": "en",
    },
    {
        "email": "road.admin@jansetu.demo",
        "employee_id": "PMC-ADM-ROD",
        "full_name": "Suresh Shinde (Municipal Admin - Road)",
        "role": "MUNICIPAL_ADMIN",
        "department_id": "ROAD",
        "phone": "9822000003",
        "password": "admin123",
        "address": "PMC Headquarters, Shivajinagar, Pune",
        "ward": "Ward 12 (Pune West)",
        "preferred_language": "en",
    },
    {
        "email": "collector@jansetu.demo",
        "employee_id": "IAS-PUN-COL",
        "full_name": "Dr. Suhas Diwase (District Collector)",
        "role": "COLLECTOR",
        "department_id": None,
        "phone": "9822000004",
        "password": "collector123",
        "address": "Collector Office, Station Road, Pune",
        "ward": "Central District",
        "preferred_language": "en",
    },
    {
        "email": "citizen@jansetu.local",
        "employee_id": None,
        "full_name": "Pooja Kadam (Citizen of Pune)",
        "role": "CITIZEN",
        "department_id": None,
        "phone": "9822000099",
        "password": "citizen123",
        "address": "B-402, Shivajinagar, Pune",
        "ward": "Ward 7 (Shivajinagar)",
        "preferred_language": "en",
    },
]


async def seed_demo_users():
    async with AsyncSessionLocal() as session:
        for u in DEMO_USERS:
            res = await session.execute(select(UserModel).where(UserModel.email == u["email"]))
            existing = res.scalars().first()
            if not existing:
                user = UserModel(
                    email=u["email"],
                    employee_id=u["employee_id"],
                    full_name=u["full_name"],
                    role=u["role"],
                    department_id=u["department_id"],
                    phone=u["phone"],
                    password_hash=get_password_hash(u["password"]),
                    address=u["address"],
                    ward=u["ward"],
                    preferred_language=u["preferred_language"],
                    is_active=True,
                    is_verified=True,
                    last_login=get_ist_now(),
                    created_at=get_ist_now(),
                    updated_at=get_ist_now(),
                )
                session.add(user)
                print(f"[+] Created demo user: {u['email']} ({u['role']})")
            else:
                # Ensure password hash and department_id are current
                existing.password_hash = get_password_hash(u["password"])
                existing.role = u["role"]
                existing.department_id = u["department_id"]
        # Verify and Seed Badges
        from app.models.badge import BadgeModel
        STANDARD_BADGES = [
            {
                "id": "first_voice",
                "name": "First Voice",
                "description": "Submitted your first civic grievance on JanSetu AI.",
                "icon": "🌟",
                "credits_reward": 10,
                "requirement": "Submit 1 complaint",
            },
            {
                "id": "civic_starter",
                "name": "Civic Starter",
                "description": "Earned 20+ civic credits through active community participation.",
                "icon": "🥉",
                "credits_reward": 20,
                "requirement": "Accumulate 20 civic credits",
            },
            {
                "id": "detail_contributor",
                "name": "Detail Contributor",
                "description": "Provided helpful clarification or photo evidence for faster resolution.",
                "icon": "🔍",
                "credits_reward": 15,
                "requirement": "Provide clarification or evidence",
            },
            {
                "id": "community_reporter",
                "name": "Community Reporter",
                "description": "Reported 3 or more verified civic issues in your neighborhood.",
                "icon": "📢",
                "credits_reward": 30,
                "requirement": "Submit 3 complaints",
            },
            {
                "id": "civic_champion",
                "name": "Civic Champion",
                "description": "Achieved 50+ civic credits as an exemplary citizen contributor.",
                "icon": "🥇",
                "credits_reward": 50,
                "requirement": "Accumulate 50 civic credits",
            },
            {
                "id": "responsible_citizen",
                "name": "Responsible Citizen",
                "description": "Actively tracked a grievance to complete official resolution.",
                "icon": "🛡️",
                "credits_reward": 40,
                "requirement": "Have a complaint reach resolved status",
            },
        ]
        for b in STANDARD_BADGES:
            b_res = await session.execute(select(BadgeModel).where(BadgeModel.id == b["id"]))
            if not b_res.scalars().first():
                new_badge = BadgeModel(
                    id=b["id"],
                    name=b["name"],
                    description=b["description"],
                    icon=b["icon"],
                    credits_reward=b["credits_reward"],
                    requirement=b["requirement"],
                    created_at=get_ist_now(),
                )
                session.add(new_badge)
                print(f"[+] Seeded standard badge: {b['id']}")

        await session.commit()
    print("[SUCCESS] Demo users and badges verified/seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed_demo_users())


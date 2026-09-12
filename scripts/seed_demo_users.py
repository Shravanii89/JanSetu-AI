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
    {
        "email": "admin@jansetu.local",
        "employee_id": "PMC-ADM-001",
        "full_name": "Rajesh Deshmukh (Municipal Commissioner Office)",
        "role": "MUNICIPAL_ADMIN",
        "department_id": None,
        "phone": "9822000010",
        "password": "admin123",
        "address": "PMC Headquarters, Shivajinagar, Pune",
        "ward": "Ward 1 (Shivajinagar)",
        "preferred_language": "en",
    },
    {
        "email": "collector@jansetu.local",
        "employee_id": "IAS-PUN-004",
        "full_name": "Dr. Suhas Diwase (District Collector)",
        "role": "COLLECTOR",
        "department_id": None,
        "phone": "9822000011",
        "password": "collector123",
        "address": "Collector Office, Station Road, Pune",
        "ward": "Central District",
        "preferred_language": "en",
    },
    # --- 8 Department Officers ---
    {
        "email": "water.officer@jansetu.local",
        "employee_id": "PMC-ENG-101",
        "full_name": "Anil Kulkarni (Executive Engineer, Water Supply)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "WATER_SUPPLY",
        "phone": "9822000021",
        "password": "officer123",
        "address": "Water Works Division, Swargate, Pune",
        "ward": "Ward 5 (Swargate)",
        "preferred_language": "en",
    },
    {
        "email": "electricity.officer@jansetu.local",
        "employee_id": "PMC-ENG-305",
        "full_name": "Mahesh Patil (Chief Electrical Officer)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "ELECTRICITY",
        "phone": "9822000022",
        "password": "officer123",
        "address": "Electrical Dept, Pune Station Road, Pune",
        "ward": "Ward 2 (Pune Station)",
        "preferred_language": "en",
    },
    {
        "email": "health.officer@jansetu.local",
        "employee_id": "PMC-MOH-501",
        "full_name": "Dr. Sanjeev Wavare (Chief Health Officer)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "PUBLIC_HEALTH",
        "phone": "9822000023",
        "password": "officer123",
        "address": "Public Health Division, PMC Main Bldg, Pune",
        "ward": "Ward 1 (Shivajinagar)",
        "preferred_language": "en",
    },
    {
        "email": "waste.officer@jansetu.local",
        "employee_id": "PMC-SWM-402",
        "full_name": "Sunita Gaikwad (Head, Solid Waste Management)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "WASTE_MANAGEMENT",
        "phone": "9822000024",
        "password": "officer123",
        "address": "SWM Head Office, Hadapsar, Pune",
        "ward": "Ward 19 (Hadapsar)",
        "preferred_language": "en",
    },
    {
        "email": "property.officer@jansetu.local",
        "employee_id": "PMC-PPM-601",
        "full_name": "Vikas More (Superintendent, Public Property Management)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "PUBLIC_PROPERTY_MANAGEMENT",
        "phone": "9822000025",
        "password": "officer123",
        "address": "Estate Management Division, PMC, Pune",
        "ward": "Ward 1 (Shivajinagar)",
        "preferred_language": "en",
    },
    {
        "email": "garden.officer@jansetu.local",
        "employee_id": "PMC-GDN-701",
        "full_name": "Ashok Ghorpade (Chief Garden Superintendent)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "GARDEN",
        "phone": "9822000026",
        "password": "officer123",
        "address": "Garden Dept, Sambhaji Park, Pune",
        "ward": "Ward 8 (Deccan Gymkhana)",
        "preferred_language": "en",
    },
    {
        "email": "road.officer@jansetu.local",
        "employee_id": "PMC-ENG-204",
        "full_name": "Suresh Shinde (Superintending Engineer, Road Works)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "ROAD",
        "phone": "9822000027",
        "password": "officer123",
        "address": "Road Maintenance Division, Yerawada, Pune",
        "ward": "Ward 6 (Yerawada)",
        "preferred_language": "en",
    },
    {
        "email": "encroachment.officer@jansetu.local",
        "employee_id": "PMC-ENC-801",
        "full_name": "Madhav Jagtap (Deputy Commissioner, Encroachment)",
        "role": "DEPARTMENT_OFFICER",
        "department_id": "ENCROACHMENT",
        "phone": "9822000028",
        "password": "officer123",
        "address": "Encroachment Control Office, PMC, Pune",
        "ward": "Ward 1 (Shivajinagar)",
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
                "criteria": "Submit 1 valid civic grievance",
                "required_credits": 10,
            },
            {
                "id": "civic_starter",
                "name": "Civic Starter",
                "description": "Earned 20+ civic credits through active community participation.",
                "icon": "🥉",
                "criteria": "Accumulate 20 civic credits",
                "required_credits": 20,
            },
            {
                "id": "detail_contributor",
                "name": "Detail Contributor",
                "description": "Provided helpful clarification or photo evidence for faster resolution.",
                "icon": "🔍",
                "criteria": "Provide clarification or evidence",
                "required_credits": 15,
            },
            {
                "id": "community_reporter",
                "name": "Community Reporter",
                "description": "Reported 3 or more verified civic issues in your neighborhood.",
                "icon": "📢",
                "criteria": "Submit 3 complaints",
                "required_credits": 30,
            },
            {
                "id": "civic_champion",
                "name": "Civic Champion",
                "description": "Achieved 50+ civic credits as an exemplary citizen contributor.",
                "icon": "🥇",
                "criteria": "Accumulate 50 civic credits",
                "required_credits": 50,
            },
            {
                "id": "responsible_citizen",
                "name": "Responsible Citizen",
                "description": "Actively tracked a grievance to complete official resolution.",
                "icon": "🛡️",
                "criteria": "Have a complaint reach resolved status",
                "required_credits": 40,
            },
        ]
        for b in STANDARD_BADGES:
            b_res = await session.execute(select(BadgeModel).where(BadgeModel.id == b["id"]))
            existing_b = b_res.scalars().first()
            if not existing_b:
                new_badge = BadgeModel(
                    id=b["id"],
                    name=b["name"],
                    description=b["description"],
                    icon=b["icon"],
                    criteria=b["criteria"],
                    required_credits=b["required_credits"],
                    created_at=get_ist_now(),
                )
                session.add(new_badge)
                print(f"[+] Seeded standard badge: {b['id']}")
            else:
                existing_b.name = b["name"]
                existing_b.description = b["description"]
                existing_b.icon = b["icon"]
                existing_b.criteria = b["criteria"]
                existing_b.required_credits = b["required_credits"]

        await session.commit()
    print("[SUCCESS] Demo users and badges verified/seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed_demo_users())


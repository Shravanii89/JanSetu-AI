"""
JanSetu AI - Departmental Personnel Seeding Script
Populates verified, realistic departmental staff in the PostgreSQL database.
"""

import asyncio
import uuid
from sqlalchemy import select, text
from app.db.session import engine, AsyncSessionLocal
from app.models.user import UserModel
from app.core.security import get_password_hash
from app.core.time import get_ist_now

PERSONNEL_DATA = [
    # Road Department
    {
        "full_name": "Rahul Patil",
        "email": "rahul.patil@pmc.local",
        "employee_id": "PMC-RD-2041",
        "designation": "Field Maintenance Officer",
        "department_id": "ROAD",
        "phone": "+91 98220 14321",
        "ward": "Ward 7 (Shivaji Nagar)",
    },
    {
        "full_name": "Amit Deshmukh",
        "email": "amit.deshmukh@pmc.local",
        "employee_id": "PMC-RD-2088",
        "designation": "Asphalt & Paving Supervisor",
        "department_id": "ROAD",
        "phone": "+91 98220 28945",
        "ward": "Ward 12 (Kothrud)",
    },
    {
        "full_name": "Sachin Jadhav",
        "email": "sachin.jadhav@pmc.local",
        "employee_id": "PMC-RD-3104",
        "designation": "Road Safety & Inspection Officer",
        "department_id": "ROAD",
        "phone": "+91 98220 37190",
        "ward": "Ward 9 (Aundh)",
    },
    # Water Supply Department
    {
        "full_name": "Rajesh Pawar",
        "email": "rajesh.pawar@pmc.local",
        "employee_id": "PMC-WS-1042",
        "designation": "Pipeline Maintenance Engineer",
        "department_id": "WATER_SUPPLY",
        "phone": "+91 98220 45612",
        "ward": "Ward 7 (Shivaji Nagar)",
    },
    {
        "full_name": "Ganesh Shinde",
        "email": "ganesh.shinde@pmc.local",
        "employee_id": "PMC-WS-1109",
        "designation": "Sluice Valve Inspector",
        "department_id": "WATER_SUPPLY",
        "phone": "+91 98220 58731",
        "ward": "Ward 4 (Kasba Peth)",
    },
    {
        "full_name": "Nitin More",
        "email": "nitin.more@pmc.local",
        "employee_id": "PMC-WS-1180",
        "designation": "Water Quality Testing Technician",
        "department_id": "WATER_SUPPLY",
        "phone": "+91 98220 62399",
        "ward": "Ward 14 (Hadapsar)",
    },
    # Electricity Department
    {
        "full_name": "Prashant Kulkarni",
        "email": "prashant.kulkarni@pmc.local",
        "employee_id": "PMC-EL-3012",
        "designation": "Senior Substation Electrician",
        "department_id": "ELECTRICITY",
        "phone": "+91 98220 74102",
        "ward": "Ward 7 (Shivaji Nagar)",
    },
    {
        "full_name": "Vilas Kamble",
        "email": "vilas.kamble@pmc.local",
        "employee_id": "PMC-EL-3045",
        "designation": "Feeder Cable & High-Tension Lineman",
        "department_id": "ELECTRICITY",
        "phone": "+91 98220 81290",
        "ward": "Ward 10 (Sinhagad Road)",
    },
    {
        "full_name": "Deepak Chavan",
        "email": "deepak.chavan@pmc.local",
        "employee_id": "PMC-EL-3089",
        "designation": "Streetlight Maintenance Inspector",
        "department_id": "ELECTRICITY",
        "phone": "+91 98220 93451",
        "ward": "Ward 5 (Bibvewadi)",
    },
    # Waste Management Department
    {
        "full_name": "Sanjay Thorat",
        "email": "sanjay.thorat@pmc.local",
        "employee_id": "PMC-WM-4011",
        "designation": "Zonal Sanitation Inspector",
        "department_id": "WASTE_MANAGEMENT",
        "phone": "+91 98221 04512",
        "ward": "Ward 8 (Ghole Road)",
    },
    {
        "full_name": "Santosh Gaikwad",
        "email": "santosh.gaikwad@pmc.local",
        "employee_id": "PMC-WM-4056",
        "designation": "Solid Waste Transport Coordinator",
        "department_id": "WASTE_MANAGEMENT",
        "phone": "+91 98221 17823",
        "ward": "Ward 11 (Warje)",
    },
    {
        "full_name": "Milind Waghmare",
        "email": "milind.waghmare@pmc.local",
        "employee_id": "PMC-WM-4092",
        "designation": "Dumping Ground Operations Lead",
        "department_id": "WASTE_MANAGEMENT",
        "phone": "+91 98221 28945",
        "ward": "Ward 15 (Uruli Devachi)",
    },
    # Public Health Department
    {
        "full_name": "Dr. Anjali Joshi",
        "email": "anjali.joshi@pmc.local",
        "employee_id": "PMC-PH-5012",
        "designation": "Medical Health Officer",
        "department_id": "PUBLIC_HEALTH",
        "phone": "+91 98221 39012",
        "ward": "Ward 7 (Shivaji Nagar)",
    },
    {
        "full_name": "Rohan Shirole",
        "email": "rohan.shirole@pmc.local",
        "employee_id": "PMC-PH-5045",
        "designation": "Vector Control & Fumigation Inspector",
        "department_id": "PUBLIC_HEALTH",
        "phone": "+91 98221 48123",
        "ward": "Ward 3 (Bhavani Peth)",
    },
    # Garden Department
    {
        "full_name": "Tanaji Bhosale",
        "email": "tanaji.bhosale@pmc.local",
        "employee_id": "PMC-GD-6014",
        "designation": "Tree Trimming & Arboriculture Supervisor",
        "department_id": "GARDEN",
        "phone": "+91 98221 59234",
        "ward": "Ward 7 (Shivaji Nagar)",
    },
    {
        "full_name": "Santosh Mane",
        "email": "santosh.mane@pmc.local",
        "employee_id": "PMC-GD-6033",
        "designation": "Park Maintenance Officer",
        "department_id": "GARDEN",
        "phone": "+91 98221 68345",
        "ward": "Ward 13 (Viman Nagar)",
    },
    # Encroachment Department
    {
        "full_name": "Arvind Jagtap",
        "email": "arvind.jagtap@pmc.local",
        "employee_id": "PMC-EN-7019",
        "designation": "Anti-Encroachment Squad Leader",
        "department_id": "ENCROACHMENT",
        "phone": "+91 98221 79456",
        "ward": "Ward 1 (Yerwada)",
    },
    {
        "full_name": "Hemant Sonawane",
        "email": "hemant.sonawane@pmc.local",
        "employee_id": "PMC-EN-7042",
        "designation": "Hawker Zone Compliance Inspector",
        "department_id": "ENCROACHMENT",
        "phone": "+91 98221 89567",
        "ward": "Ward 6 (Kothrud)",
    },
    # Public Property Management Department
    {
        "full_name": "Vijay Kadam",
        "email": "vijay.kadam@pmc.local",
        "employee_id": "PMC-PP-8015",
        "designation": "Municipal Asset Surveyor",
        "department_id": "PUBLIC_PROPERTY_MANAGEMENT",
        "phone": "+91 98221 98678",
        "ward": "Ward 2 (Kalyani Nagar)",
    },
]


async def seed_department_personnel():
    async with AsyncSessionLocal() as db:
        now_ist = get_ist_now()
        password_hash = get_password_hash("Staff@123")

        # 1. Update existing department heads with designations if not set
        dept_officers_res = await db.execute(select(UserModel).where(UserModel.role == "DEPARTMENT_OFFICER"))
        existing_officers = dept_officers_res.scalars().all()
        for off in existing_officers:
            if not off.designation:
                if "road" in off.email:
                    off.designation = "Superintending Engineer"
                elif "water" in off.email:
                    off.designation = "Executive Engineer"
                elif "electricity" in off.email:
                    off.designation = "Chief Electrical Officer"
                elif "waste" in off.email:
                    off.designation = "Head, Solid Waste Management"
                elif "health" in off.email:
                    off.designation = "Chief Health Officer"
                elif "garden" in off.email:
                    off.designation = "Chief Garden Superintendent"
                elif "encroachment" in off.email:
                    off.designation = "Deputy Commissioner"
                elif "property" in off.email:
                    off.designation = "Superintendent"
                else:
                    off.designation = "Departmental Officer"
                off.updated_at = now_ist

        # 2. Insert or update personnel
        added_count = 0
        for p in PERSONNEL_DATA:
            res = await db.execute(select(UserModel).where(UserModel.email == p["email"]))
            existing = res.scalars().first()
            if existing:
                existing.full_name = p["full_name"]
                existing.employee_id = p["employee_id"]
                existing.designation = p["designation"]
                existing.department_id = p["department_id"]
                existing.phone = p["phone"]
                existing.ward = p["ward"]
                existing.is_active = True
                existing.updated_at = now_ist
            else:
                user = UserModel(
                    id=str(uuid.uuid4()),
                    employee_id=p["employee_id"],
                    email=p["email"],
                    password_hash=password_hash,
                    full_name=p["full_name"],
                    role="DEPARTMENT_OFFICER",
                    department_id=p["department_id"],
                    designation=p["designation"],
                    phone=p["phone"],
                    ward=p["ward"],
                    preferred_language="en",
                    is_active=True,
                    is_verified=True,
                    created_at=now_ist,
                    updated_at=now_ist,
                )
                db.add(user)
                added_count += 1

        await db.commit()
        print(f"Successfully seeded/updated departmental personnel. Added: {added_count}, Total staff defined: {len(PERSONNEL_DATA)}")


if __name__ == "__main__":
    asyncio.run(seed_department_personnel())

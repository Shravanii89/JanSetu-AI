"""
JanSetu AI - Controlled Department Taxonomy
Strictly 8 PMC departments + OTHER_HUMAN_REVIEW fallback.
"""

from typing import List, Dict

WATER_SUPPLY = "WATER_SUPPLY"
ELECTRICITY = "ELECTRICITY"
PUBLIC_HEALTH = "PUBLIC_HEALTH"
WASTE_MANAGEMENT = "WASTE_MANAGEMENT"
PUBLIC_PROPERTY_MANAGEMENT = "PUBLIC_PROPERTY_MANAGEMENT"
GARDEN = "GARDEN"
ROAD = "ROAD"
ENCROACHMENT = "ENCROACHMENT"
OTHER_HUMAN_REVIEW = "OTHER_HUMAN_REVIEW"

DEPARTMENTS: List[Dict[str, str]] = [
    {"id": WATER_SUPPLY, "name": "Water Supply Department", "description": "Municipal drinking water pipeline, supply outages, contamination, low pressure, valve repairs."},
    {"id": ELECTRICITY, "name": "Electricity Department", "description": "Streetlights, electrical feeder poles, live wire hazards, transformer outages."},
    {"id": PUBLIC_HEALTH, "name": "Public Health Department", "description": "Sewage overflow, sanitation, vector-borne disease control, stormwater drain blockages."},
    {"id": WASTE_MANAGEMENT, "name": "Waste Management Department", "description": "Garbage pickup, overflowing community bins, open waste dumping, street sweeping."},
    {"id": PUBLIC_PROPERTY_MANAGEMENT, "name": "Public Property Management Department", "description": "Municipal buildings, community halls, civic bus stops, damaged public assets."},
    {"id": GARDEN, "name": "Garden Department", "description": "Public parks, tree branch hazards, fallen trees, municipal playground maintenance."},
    {"id": ROAD, "name": "Road Department", "description": "Potholes, asphalt resurfacing, road cave-ins, footpaths, road divider damage."},
    {"id": ENCROACHMENT, "name": "Encroachment Department", "description": "Illegal structures, hawker footpath encroachments, unauthorized hoarding removals."},
    {"id": OTHER_HUMAN_REVIEW, "name": "Other / Human Review", "description": "Internal fallback for ambiguous complaints requiring manual officer routing."},
]

CONTROLLED_DEPARTMENTS = DEPARTMENTS
DEPARTMENT_IDS = [d["id"] for d in DEPARTMENTS]
VALID_DEPARTMENT_IDS = DEPARTMENT_IDS


def validate_department(dept_id: str) -> str:
    """Validates department against controlled list, falling back to OTHER_HUMAN_REVIEW."""
    if not dept_id or dept_id not in DEPARTMENT_IDS:
        return OTHER_HUMAN_REVIEW
    return dept_id


def is_valid_department(dept_id: str) -> bool:
    """Checks if a department ID is in the controlled taxonomy."""
    return dept_id in DEPARTMENT_IDS

// JanSetu AI - System Constants
export const DEPARTMENTS = [
  { id: "WATER_SUPPLY", name: "Water Supply Department" },
  { id: "ELECTRICITY", name: "Electricity Department" },
  { id: "PUBLIC_HEALTH", name: "Public Health Department" },
  { id: "WASTE_MANAGEMENT", name: "Waste Management Department" },
  { id: "PUBLIC_PROPERTY_MANAGEMENT", name: "Public Property Management Department" },
  { id: "GARDEN", name: "Garden Department" },
  { id: "ROAD", name: "Road Department" },
  { id: "ENCROACHMENT", name: "Encroachment Department" },
] as const;

export const ROLES = ["CITIZEN", "MUNICIPAL_ADMIN", "DEPARTMENT_OFFICER", "COLLECTOR"] as const;
export const PRIORITIES = ["P0", "P1", "P2", "P3"] as const;

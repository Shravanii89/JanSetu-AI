export interface Incident {
  id: string;
  incident_number: string;
  title: string;
  department_id: string;
  severity: "P0" | "P1" | "P2" | "P3";
  status: string;
  location_name: string;
  complaint_count: number;
  first_reported_at: string;
  last_activity_at: string;
}

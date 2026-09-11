import { ComplaintStatus } from "./complaint";

export type TicketPriority = "P0" | "P1" | "P2" | "P3";

export interface Ticket {
  id: string;
  complaint_id: string;
  department_id: string;
  assigned_officer_id?: string | null;
  status: ComplaintStatus;
  priority: TicketPriority;
  severity: TicketPriority;
  urgency: TicketPriority;
  issue_summary: string;
  location_name?: string | null;
  created_at: string;
}

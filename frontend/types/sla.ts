export type SLAStatus = "WITHIN_SLA" | "AT_RISK" | "BREACHED" | "PAUSED" | "RESOLVED";

export interface TicketSLA {
  id: string;
  ticket_id: string;
  priority: "P0" | "P1" | "P2" | "P3";
  response_deadline: string;
  resolution_deadline: string;
  status: SLAStatus;
  is_paused: boolean;
}

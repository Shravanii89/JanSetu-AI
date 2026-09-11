export type ComplaintStatus =
  | "NEW" | "AI_ANALYZED" | "NEEDS_CLARIFICATION" | "READY_FOR_ROUTING"
  | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  | "DUPLICATE" | "SPAM" | "REJECTED" | "ESCALATED" | "SLA_BREACHED" | "AWAITING_CITIZEN";

export interface Complaint {
  id: string;
  tracking_number: string;
  raw_text: string;
  citizen_name?: string | null;
  citizen_phone?: string | null;
  preferred_language: string;
  input_channel: "WEB" | "VOICE" | "IMAGE";
  status: ComplaintStatus;
  created_at: string;
}

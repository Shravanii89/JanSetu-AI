// JanSetu AI - Production Frontend API Client

import { getToken } from "./auth";
import { formatApiError } from "./error";

export { formatApiError };

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(formatApiError(errorData, res.status));
  }
  return res.json();
}

// 1. Citizen Intake & Tracking
export async function submitComplaint(data: {
  raw_text: string;
  citizen_name?: string;
  citizen_phone?: string;
  citizen_email?: string;
  preferred_language?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  client_timestamp?: string;
}) {
  const sanitizedPayload = {
    ...data,
    latitude:
      typeof data.latitude === "number" && !isNaN(data.latitude)
        ? data.latitude
        : undefined,
    longitude:
      typeof data.longitude === "number" && !isNaN(data.longitude)
        ? data.longitude
        : undefined,
  };

  return apiClient<{
    id: string;
    tracking_number: string;
    status: string;
    ticket_id: string;
    ai_preview: any;
  }>("/complaints/", {
    method: "POST",
    body: JSON.stringify(sanitizedPayload),
  });
}

export async function trackComplaint(idOrTracking: string) {
  return apiClient<any>(`/complaints/${encodeURIComponent(idOrTracking.trim())}`);
}

export async function searchComplaintsByContact(phone: string, name?: string) {
  const params = new URLSearchParams();
  if (phone) params.set("phone", phone.trim());
  if (name && name.trim()) params.set("name", name.trim());
  return apiClient<any[]>(`/complaints/search?${params.toString()}`);
}

export async function submitClarification(
  idOrTracking: string,
  answer: string,
  requested_field = "location"
) {
  return apiClient<any>(`/complaints/${encodeURIComponent(idOrTracking.trim())}/clarify`, {
    method: "POST",
    body: JSON.stringify({ answer, requested_field }),
  });
}

// 2. Real-time AI Demonstration & Pre-submission Triage
export async function analyzeTextLive(text: string, language = "en") {
  return apiClient<any>("/ai/analyze", {
    method: "POST",
    body: JSON.stringify({ text, language }),
  });
}

// 3. Official Authentication
export async function loginOfficial(email_or_employee_id: string, password: string) {
  return apiClient<{
    access_token: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      full_name: string;
      role: "MUNICIPAL_ADMIN" | "DEPARTMENT_OFFICER" | "COLLECTOR" | "CITIZEN";
      department_id?: string;
      employee_id?: string;
    };
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email_or_employee_id, password }),
  });
}

export async function getMe() {
  return apiClient<any>("/auth/me");
}

// 4. Operational Tickets
export async function getTickets(params?: {
  department_id?: string;
  status?: string;
  priority?: string;
  is_escalated?: boolean;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.department_id) query.append("department_id", params.department_id);
  if (params?.status) query.append("status", params.status);
  if (params?.priority) query.append("priority", params.priority);
  if (params?.is_escalated !== undefined) query.append("is_escalated", String(params.is_escalated));
  if (params?.search) query.append("search", params.search);

  const qs = query.toString();
  return apiClient<any[]>(`/tickets/${qs ? `?${qs}` : ""}`);
}

export async function getTicketDetail(id: string) {
  return apiClient<any>(`/tickets/${id}`);
}

export async function updateTicketStatus(id: string, status: string, resolution_notes?: string) {
  return apiClient<any>(`/tickets/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, resolution_notes }),
  });
}

export async function updateTicketPriority(id: string, priority: string, justification: string) {
  return apiClient<any>(`/tickets/${id}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priority, justification }),
  });
}

export async function rerouteTicket(id: string, new_department_id: string, reason: string) {
  return apiClient<any>(`/tickets/${id}/reroute`, {
    method: "POST",
    body: JSON.stringify({ new_department_id, reason }),
  });
}

export async function escalateTicket(id: string, reason: string) {
  return apiClient<any>(`/tickets/${id}/escalate`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// 5. Systemic Intelligence & Analytics
export async function getDepartments() {
  return apiClient<any[]>("/departments/");
}

export async function getSlaSummary() {
  return apiClient<any>("/sla/summary");
}

export async function getIncidents() {
  return apiClient<any[]>("/incidents/");
}

export async function getAnalyticsOverview() {
  return apiClient<any>("/analytics/overview");
}

export async function getDepartmentAnalytics() {
  return apiClient<any[]>("/analytics/departments");
}

export async function getPriorityAnalytics() {
  return apiClient<any[]>("/analytics/priorities");
}

export async function getHotspots() {
  return apiClient<any[]>("/map/hotspots");
}

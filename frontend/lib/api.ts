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
  location_address?: string;
  latitude?: number;
  longitude?: number;
  client_timestamp?: string;
}) {
  const sanitizedPayload = {
    ...data,
    location_name: data.location_name || data.location_address,
    location_address: data.location_address || data.location_name,
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

// 3. Authentication & Citizen Management
export async function loginUser(email_or_employee_id: string, password: string) {
  return apiClient<{
    access_token: string;
    token_type: string;
    user: any;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email_or_employee_id, password }),
  });
}

// Backwards-compatible alias for official login
export const loginOfficial = loginUser;

export async function registerCitizen(data: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address?: string;
  ward?: string;
  preferred_language?: string;
}) {
  return apiClient<{
    access_token: string;
    token_type: string;
    user: any;
  }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe() {
  return apiClient<any>("/auth/me");
}

export async function getMyComplaints() {
  return apiClient<any[]>("/complaints/my");
}

export async function getUserContributions() {
  return apiClient<any[]>("/auth/contributions");
}

export async function getUserBadges() {
  return apiClient<{ total_earned: number; badges: any[] }>("/auth/badges");
}

export async function updateUserProfile(data: {
  full_name?: string;
  phone?: string;
  address?: string;
  ward?: string;
  preferred_language?: string;
  profile_image?: string;
}) {
  return apiClient<any>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function saveComplaintDraft(data: {
  session_id?: string;
  complaint_data: any;
}) {
  return apiClient<{ status: string; draft_id: string; message: string }>("/complaints/draft", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getComplaintDraft(draft_id: string, session_id?: string) {
  const qs = session_id ? `?session_id=${encodeURIComponent(session_id)}` : "";
  return apiClient<any>(`/complaints/draft/${draft_id}${qs}`);
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

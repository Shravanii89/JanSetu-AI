export type UserRole =
  | "CITIZEN"
  | "MUNICIPAL_ADMIN"
  | "DEPARTMENT_OFFICER"
  | "COLLECTOR"
  | "DISTRICT_COLLECTOR";

export interface User {
  id: string;
  employee_id?: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string | null;
  phone?: string | null;
  address?: string | null;
  ward?: string | null;
  preferred_language?: string | null;
  civic_credits?: number;
  contribution_level?: string;
  badges_count?: number;
  is_verified?: boolean;
  last_login?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement?: string;
  criteria?: string;
  credits_reward?: number;
  required_credits?: number;
  is_unlocked?: boolean;
  is_earned?: boolean;
  unlocked_at?: string | null;
  earned_at?: string | null;
}

export interface ContributionRecord {
  id: string;
  event_type: string;
  credits: number;
  reference_id?: string | null;
  description: string;
  created_at: string;
}

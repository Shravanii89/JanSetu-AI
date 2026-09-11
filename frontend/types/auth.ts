export type UserRole = "CITIZEN" | "MUNICIPAL_ADMIN" | "DEPARTMENT_OFFICER" | "COLLECTOR";

export interface User {
  id: string;
  employee_id?: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

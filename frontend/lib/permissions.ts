// JanSetu AI - Role Permissions
import { UserRole } from "@/types/auth";

export function canAccessAdmin(role: UserRole): boolean {
  return role === "MUNICIPAL_ADMIN";
}

export function canAccessDepartment(role: UserRole): boolean {
  return role === "DEPARTMENT_OFFICER" || role === "MUNICIPAL_ADMIN";
}

export function canAccessCollector(role: UserRole): boolean {
  return role === "COLLECTOR";
}

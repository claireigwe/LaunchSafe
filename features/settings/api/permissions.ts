export type UserRole = "owner" | "admin" | "member";

export function canManageTeam(role: UserRole): boolean {
  return role === "owner" || role === "admin";
}

export function canDeleteBusiness(role: UserRole): boolean {
  return role === "owner";
}

export function canManageBilling(role: UserRole): boolean {
  return role === "owner" || role === "admin";
}

export function canAccessSettings(role: UserRole): boolean {
  return role === "owner" || role === "admin";
}

export type UserRole = "owner" | "admin" | "member";

export function canManageTeam(role: UserRole): boolean {
  return role === "owner" || role === "admin";
}

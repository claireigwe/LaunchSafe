import type { AppNotification, NotificationCategory, NotificationPriority } from "../types/notifications.types";

/* ----- API helpers ----- */
async function apiGet<T>(url: string): Promise<T | null> {
  try { const r = await fetch(url); const j = await r.json(); return j.success ? j.data : null; } catch { return null; }
}
async function apiPost<T>(url: string, body: any): Promise<T | null> {
  try { const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success ? j.data : null; } catch { return null; }
}
async function apiPatch(url: string, body: any): Promise<boolean> {
  try { const r = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success; } catch { return false; }
}
async function apiDelete(url: string, body: any): Promise<boolean> {
  try { const r = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success; } catch { return false; }
}

/* ----- Public API ----- */

export async function fetchNotifications(): Promise<AppNotification[]> {
  const server = await apiGet<AppNotification[]>("/api/notifications");
  return server || [];
}

export async function getUnreadCount(): Promise<number> {
  const server = await apiGet<AppNotification[]>("/api/notifications");
  return (server || []).filter((n) => !n.isRead).length;
}

export async function createNotification(
  title: string,
  message: string,
  type: NotificationCategory,
  priority: NotificationPriority,
  actionUrl: string | null = null,
  actionLabel: string | null = null
): Promise<AppNotification | null> {
  return await apiPost<AppNotification>("/api/notifications", { title, message, type, actionUrl, priority });
}

export async function markAsRead(id: string): Promise<void> {
  await apiPatch("/api/notifications", { id });
}

export async function markAllAsRead(): Promise<void> {
  await apiPatch("/api/notifications", { markAll: true });
}

export async function deleteNotification(id: string): Promise<void> {
  await apiDelete("/api/notifications", { id });
}


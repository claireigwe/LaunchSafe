import type { AppNotification, NotificationCategory, NotificationPriority } from "../types/notifications.types";

const NOTIF_KEY = "launchsafe-notifications";

/* ----- localStorage ----- */
function loadLocal(): AppNotification[] {
  try { const raw = localStorage.getItem(NOTIF_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveLocal(items: AppNotification[]): void { try { localStorage.setItem(NOTIF_KEY, JSON.stringify(items)); } catch {} }
function genId(): string { return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

/* ----- API helpers ----- */
async function apiGet<T>(url: string): Promise<T | null> {
  try { const r = await fetch(url); const j = await r.json(); return j.success ? j.data : null; } catch { return null; }
}
async function apiPost(url: string, body: any): Promise<boolean> {
  try { const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success; } catch { return false; }
}
async function apiPatch(url: string, body: any): Promise<boolean> {
  try { const r = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success; } catch { return false; }
}
async function apiDelete(url: string, body: any): Promise<boolean> {
  try { const r = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success; } catch { return false; }
}

/* ----- Public API ----- */

export function getNotifications(): AppNotification[] {
  apiGet<AppNotification[]>("/api/notifications").then((server) => {
    if (server) saveLocal(server);
  }).catch(() => {});
  return loadLocal();
}

export function getUnreadCount(): number {
  return loadLocal().filter((n) => !n.isRead).length;
}

export function createNotification(
  title: string,
  message: string,
  type: NotificationCategory,
  priority: NotificationPriority,
  actionUrl: string | null = null,
  actionLabel: string | null = null
): AppNotification {
  const now = new Date().toISOString();
  const n: AppNotification = {
    id: genId(), userId: "user", businessId: "onboarded",
    title, message, type, priority,
    isRead: false, actionUrl, actionLabel,
    createdAt: now, readAt: null,
    deliveryChannel: "in_app", emailSent: false, pushSent: false,
  };

  apiPost("/api/notifications", { title, message, type, actionUrl }).catch(() => {});

  const items = loadLocal();
  items.unshift(n);
  saveLocal(items);
  return n;
}

export async function markAsRead(id: string): Promise<void> {
  await apiPatch("/api/notifications", { id });
  const items = loadLocal();
  const n = items.find((x) => x.id === id);
  if (n && !n.isRead) { n.isRead = true; n.readAt = new Date().toISOString(); saveLocal(items); }
}

export async function markAllAsRead(): Promise<void> {
  await apiPatch("/api/notifications", { markAll: true });
  const items = loadLocal();
  const now = new Date().toISOString();
  for (const n of items) { if (!n.isRead) { n.isRead = true; n.readAt = now; } }
  saveLocal(items);
}

export async function deleteNotification(id: string): Promise<void> {
  await apiDelete("/api/notifications", { id });
  saveLocal(loadLocal().filter((n) => n.id !== id));
}

export function deleteAllNotifications(): void { saveLocal([]); }

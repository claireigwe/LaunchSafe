import type { AppNotification, NotificationCategory, NotificationPriority } from "../types/notifications.types";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/base";

/* ----- Public API ----- */

export async function fetchNotifications(limit = 50): Promise<AppNotification[]> {
  const server = await apiGet<AppNotification[]>(`/api/notifications?limit=${limit}`);
  return server || [];
}

export async function getUnreadCount(): Promise<number> {
  const data = await apiGet<{ unread: number }>("/api/notifications?count=true");
  return data?.unread ?? 0;
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

import type { AppNotification, NotificationCategory, NotificationPriority } from "../types/notifications.types";

const NOTIF_KEY = "launchsafe-notifications";

function load(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(items: AppNotification[]): void {
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(items)); } catch {}
}

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getNotifications(): AppNotification[] {
  return load();
}

export function getUnreadCount(): number {
  return load().filter((n) => !n.isRead).length;
}

export function createNotification(
  title: string,
  message: string,
  type: NotificationCategory,
  priority: NotificationPriority,
  actionUrl: string | null = null,
  actionLabel: string | null = null
): AppNotification {
  const items = load();
  const n: AppNotification = {
    id: generateId(),
    userId: "user",
    businessId: "onboarded",
    title,
    message,
    type,
    priority,
    isRead: false,
    actionUrl,
    actionLabel,
    createdAt: new Date().toISOString(),
    readAt: null,
    deliveryChannel: "in_app",
    emailSent: false,
    pushSent: false,
  };
  items.unshift(n);
  save(items);
  return n;
}

export function markAsRead(id: string): void {
  const items = load();
  const n = items.find((x) => x.id === id);
  if (n && !n.isRead) {
    n.isRead = true;
    n.readAt = new Date().toISOString();
    save(items);
  }
}

export function markAllAsRead(): void {
  const items = load();
  const now = new Date().toISOString();
  for (const n of items) {
    if (!n.isRead) {
      n.isRead = true;
      n.readAt = now;
    }
  }
  save(items);
}

export function deleteNotification(id: string): void {
  save(load().filter((n) => n.id !== id));
}

export function deleteAllNotifications(): void {
  save([]);
}

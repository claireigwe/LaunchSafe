export type NotificationPriority = "info" | "warning" | "critical";
export type NotificationCategory = "task" | "deadline" | "document" | "billing" | "system";

export interface AppNotification {
  id: string;
  userId: string;
  businessId: string;
  title: string;
  message: string;
  type: NotificationCategory;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl: string | null;
  actionLabel: string | null;
  createdAt: string;
  readAt: string | null;
}



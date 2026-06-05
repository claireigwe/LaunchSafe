export type NotificationType =
  | "deadline_reminder"
  | "payment_success"
  | "payment_failed"
  | "subscription_expiring"
  | "subscription_expired"
  | "assessment_unlocked"
  | "regulatory_update"
  | "compliance_overdue";

export interface Notification {
  id: string;
  userId: string;
  businessId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPreferences {
  userId: string;
  emailDeadlineReminders: boolean;
  emailPaymentAlerts: boolean;
  emailRegulatoryUpdates: boolean;
  inAppDeadlineReminders: boolean;
  inAppPaymentAlerts: boolean;
  inAppRegulatoryUpdates: boolean;
  reminderDaysBefore: number;
}

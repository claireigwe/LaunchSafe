export interface ProfileData {
  fullName: string;
  email: string;
  jobTitle: string;
  createdAt: string;
  lastLogin: string;
}

export interface NotificationPrefs {
  taskNotifications: boolean;
  deadlineReminders: boolean;
  documentNotifications: boolean;
  billingNotifications: boolean;
  systemAnnouncements: boolean;
}

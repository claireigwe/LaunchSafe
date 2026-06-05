import type { ProfileData, NotificationPrefs } from "../types/settings.types";

const PROFILE_KEY = "launchsafe-profile";
const PREFS_KEY = "launchsafe-notification-prefs";
const CREATED_KEY = "launchsafe-account-created";

export function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    fullName: "",
    email: "",
    jobTitle: "",
    createdAt: localStorage.getItem(CREATED_KEY) || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
}

export function saveProfile(data: Partial<ProfileData>): ProfileData {
  const current = loadProfile();
  const updated = { ...current, ...data };
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

export function loadNotificationPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    taskNotifications: true,
    deadlineReminders: true,
    documentNotifications: true,
    billingNotifications: true,
    systemAnnouncements: true,
  };
}

export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
}

export function setAccountCreated(): void {
  try { localStorage.setItem(CREATED_KEY, new Date().toISOString()); } catch {}
}

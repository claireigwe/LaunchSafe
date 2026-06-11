import type { ProfileData, NotificationPrefs } from "../types/settings.types";

export async function fetchProfileAndPrefs(): Promise<{ profile: ProfileData, prefs: NotificationPrefs }> {
  const res = await fetch('/api/settings/profile');
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.error || 'Failed to fetch profile and preferences');
  }
  return data.data;
}

export async function updateProfile(profile: Partial<ProfileData>): Promise<void> {
  const res = await fetch('/api/settings/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });
  if (!res.ok) {
    throw new Error('Failed to update profile');
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to update profile');
  }
}

export async function updateNotificationPrefs(prefs: NotificationPrefs): Promise<void> {
  const res = await fetch('/api/settings/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefs }),
  });
  if (!res.ok) {
    throw new Error('Failed to update preferences');
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to update preferences');
  }
}

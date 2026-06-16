"use client";

import { useState, useEffect } from "react";
import { fetchProfileAndPrefs, updateNotificationPrefs } from "../../api/settings-api";
import { trackEvent } from "@/lib/analytics/track";
import { Section, ToggleRow } from "./shared";
import type { NotificationPrefs } from "../../types/settings.types";
import styles from "../settings-page.module.css";

export function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfileAndPrefs();
        setPrefs(data.prefs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function toggle(key: keyof NotificationPrefs) {
    if (!prefs) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await updateNotificationPrefs(next);
      trackEvent("Notification Preference Updated", { key, value: next[key] });
    } catch (err) {
      console.error(err);
      setPrefs(prefs);
    }
  }

  if (loading || !prefs) return <Section title="Notification Preferences" subtitle="Control which notifications you receive."><p className={styles.emptyText}>Loading preferences...</p></Section>;

  return (
    <Section title="Notification Preferences" subtitle="Control which notifications you receive.">
      <ToggleRow label="Task Notifications" description="When tasks are created, completed, or overdue" value={prefs.taskNotifications} onChange={() => toggle("taskNotifications")} />
      <ToggleRow label="Deadline Reminders" description="Upcoming and missed deadline alerts" value={prefs.deadlineReminders} onChange={() => toggle("deadlineReminders")} />
      <ToggleRow label="Document Notifications" description="Document uploads and updates" value={prefs.documentNotifications} onChange={() => toggle("documentNotifications")} />
      <ToggleRow label="Billing Notifications" description="Payment confirmations and subscription alerts" value={prefs.billingNotifications} onChange={() => toggle("billingNotifications")} />
      <ToggleRow label="System Announcements" description="Platform updates and new features" value={prefs.systemAnnouncements} onChange={() => toggle("systemAnnouncements")} />
      <p className={styles.deliveryNote}>Notifications are delivered in-app only. Email and push notification delivery coming soon.</p>
    </Section>
  );
}

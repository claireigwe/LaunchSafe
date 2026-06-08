"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../api/notifications-api";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import type { AppNotification, NotificationCategory } from "../types/notifications.types";
import styles from "./notification-center.module.css";

type FilterValue = "all" | "unread" | "read" | "critical" | "task" | "deadline" | "document" | "billing" | "system";

const FILTERS: { key: FilterValue; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "critical", label: "Critical" },
  { key: "task", label: "Tasks" },
  { key: "deadline", label: "Deadlines" },
  { key: "document", label: "Documents" },
  { key: "billing", label: "Billing" },
  { key: "system", label: "System" },
];

function matchesFilter(n: AppNotification, f: FilterValue): boolean {
  if (f === "all") return true;
  if (f === "unread") return !n.isRead;
  if (f === "read") return n.isRead;
  if (f === "critical") return n.priority === "critical";
  return n.type === f;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadNotifications = async () => {
    setLoading(true);
    const data = await fetchNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
    trackEvent("Notification Center Viewed");
  }, []);

  const filtered = notifications.filter((n) => matchesFilter(n, filter));

  async function handleRead(id: string) {
    await markAsRead(id);
    trackEvent("Notification Read", { id });
    loadNotifications();
  }

  async function handleMarkAll() {
    await markAllAsRead();
    trackEvent("Notification Read", { bulk: true });
    loadNotifications();
  }

  async function handleDelete(id: string) {
    await deleteNotification(id);
    trackEvent("Notification Deleted", { id });
    loadNotifications();
  }

  async function handleClick(n: AppNotification) {
    if (!n.isRead) {
      await markAsRead(n.id);
      loadNotifications();
    }
    trackEvent("Notification Action Clicked", { id: n.id });
    if (n.actionUrl) router.push(n.actionUrl);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Stay informed about your compliance activities.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="ghost" size="sm" onClick={handleMarkAll}>
            <CheckCheck size={14} /> Mark All Read
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button key={f.key} className={cn(styles.filterBtn, filter === f.key && styles.filterActive)} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className={styles.list}>
          {filtered.map((n) => (
            <div key={n.id} className={cn(styles.card, !n.isRead && styles.unreadCard)}>
              <button type="button" className={cn(styles.cardBody, !n.isRead && styles.unreadBody)} onClick={() => handleClick(n)}>
                <span className={`${styles.dot} ${styles[`p_${n.priority}`]}`} />
                <div className={styles.cardContent}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardTitle}>{n.title}</span>
                    <span className={cn(styles.priorityBadge, styles[`pr_${n.priority}`])}>{n.priority}</span>
                  </div>
                  <p className={styles.cardMessage}>{n.message}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardType}>{n.type}</span>
                    <span className={styles.cardTime}>{formatDate(n.createdAt)}</span>
                    {!n.isRead && <span className={styles.unreadDot} />}
                  </div>
                </div>
              </button>
              <div className={styles.cardActions}>
                {!n.isRead && (
                  <button type="button" className={styles.actionBtn} onClick={() => handleRead(n.id)} aria-label="Mark as read">
                    <CheckCheck size={14} />
                  </button>
                )}
                {confirmDeleteId === n.id ? (
                  <div className={styles.confirmDeleteNotif}>
                    <button type="button" className={styles.confirmDeleteNotifBtn} onClick={() => { handleDelete(n.id); setConfirmDeleteId(null); }}>Confirm</button>
                    <button type="button" className={styles.confirmDeleteNotifCancel} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className={styles.actionBtn} onClick={() => setConfirmDeleteId(n.id)} aria-label="Delete notification">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Bell size={32} className={styles.emptyIcon} />
          <p className={styles.emptyText}>
            {notifications.length === 0 ? "You're all caught up. No notifications at this time." : "No notifications match the selected filter."}
          </p>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

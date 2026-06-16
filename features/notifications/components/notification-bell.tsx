"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/time";
import { fetchNotifications, getUnreadCount, markAsRead } from "../api/notifications-api";
import type { AppNotification } from "../types/notifications.types";
import styles from "./notification-bell.module.css";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function refresh() {
    const [allNotifs, unreadNotifs] = await Promise.all([
      fetchNotifications(),
      getUnreadCount()
    ]);
    setNotifications(allNotifs.slice(0, 5));
    setUnread(unreadNotifs);
  }

  async function handleClick(n: AppNotification) {
    if (!n.isRead) {
      await markAsRead(n.id);
      refresh();
    }
    if (n.actionUrl) {
      window.location.href = n.actionUrl;
    }
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.bell} onClick={() => setOpen((p) => !p)} aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}>
        <Bell size={18} />
        {unread > 0 && <span className={styles.count}>{unread > 99 ? "99+" : unread}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3 className={styles.dropdownTitle}>Notifications</h3>
            {unread > 0 && <span className={styles.unreadBadge}>{unread} unread</span>}
          </div>

          {notifications.length > 0 ? (
            <ul className={styles.list}>
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={cn(styles.item, !n.isRead && styles.unread)}
                    onClick={() => handleClick(n)}
                  >
                    <span className={`${styles.dot} ${styles[`p_${n.priority}`]}`} />
                    <div className={styles.itemBody}>
                      <span className={styles.itemTitle}>{n.title}</span>
                      <span className={styles.itemMessage}>{n.message}</span>
                      <span className={styles.itemTime}>{formatRelativeTime(n.createdAt)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p>You're all caught up.</p>
            </div>
          )}

          <Link href="/notifications" className={styles.viewAll} onClick={() => setOpen(false)}>
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}



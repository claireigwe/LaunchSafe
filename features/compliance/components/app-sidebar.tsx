"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Calendar,
  Bell,
  Building2,
  BarChart,
  CreditCard,
  Settings,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { getCurrentPlanName } from "@/features/billing/api/feature-access";
import styles from "./app-sidebar.module.css";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compliance", label: "Tasks", icon: ClipboardList },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/business", label: "Business", icon: Building2 },
  { href: "/reports", label: "Reports", icon: BarChart },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setCollapsed((p) => !p)}
        aria-label={collapsed ? "Open navigation" : "Close navigation"}
      >
        <Menu size={20} />
      </button>

      <aside className={cn(styles.sidebar, collapsed && styles.collapsed)}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          {!collapsed && <span className={styles.logoText}>LaunchSafe</span>}
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            let isActive = false;
            if (href === "/settings") {
              isActive = pathname === href || (pathname.startsWith(href + "/") && !pathname.startsWith("/settings/billing"));
            } else {
              isActive = pathname === href || pathname.startsWith(href + "/");
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(styles.link, isActive && styles.active)}
                tabIndex={collapsed ? -1 : 0}
              >
                <Icon size={18} className={styles.icon} />
                {!collapsed && (
                  <span>{label}{href === "/business" && <span className={styles.navPlanTag}>{getCurrentPlanName()}</span>}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn(styles.footer, collapsed && styles.footerCollapsed)}>
          <div className={styles.bellRow}>
            <NotificationBell />
          </div>
        </div>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((p) => !p)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={16} className={cn(collapsed && styles.rotated)} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      {collapsed && <div className={styles.overlay} onClick={() => setCollapsed(false)} />}
    </>
  );
}

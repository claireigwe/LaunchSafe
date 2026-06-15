"use client";

import { useState, useEffect } from "react";
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
  Compass,
} from "lucide-react";
import { isInSetupMode } from "@/features/billing/api/setup-check";
import { getUnreadCount } from "@/features/notifications/api/notifications-api";
import { getActiveBusinessId, useAppStore } from "@/lib/stores/app-store";
import { fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";
import { fetchProfileAndPrefs } from "@/features/settings/api/settings-api";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [setupMode, setSetupMode] = useState(false);
  const [activeBizName, setActiveBizName] = useState("");
  const [profile, setProfile] = useState<{ fullName: string; jobTitle: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const storeBizId = useAppStore((s) => s.activeBusinessId);

  async function refreshActiveBusiness() {
    const id = storeBizId || getActiveBusinessId();
    if (id) {
      const all = await fetchAllBusinesses();
      const biz = all.find((b) => b.id === id);
      setActiveBizName(biz?.name || "");
    } else {
      setActiveBizName("");
    }
  }

  useEffect(() => {
    setSetupMode(isInSetupMode());
    setMounted(true);

    const refresh = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    refresh();
    const interval = setInterval(refresh, 15000);

    fetchProfileAndPrefs().then((data) => {
      if (data?.profile) {
        setProfile({ fullName: data.profile.fullName, jobTitle: data.profile.jobTitle || "" });
      }
    }).catch(() => {});

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    refreshActiveBusiness();
  }, [storeBizId]);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen((p) => !p)}
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        <Menu size={20} />
      </button>

      <aside className={cn(styles.sidebar, collapsed && styles.collapsed, mobileOpen && styles.mobileOpen)}>
        <button
          className={styles.collapseIconBtn}
          onClick={() => setCollapsed((p) => !p)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={14} className={cn(collapsed && styles.rotated)} />
        </button>

        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          {!collapsed && <span className={styles.logoText}>LaunchSafe</span>}
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          {!collapsed && <div className={styles.sectionLabel}>MAIN</div>}
          {mounted && setupMode && (
            <Link
              href="/onboarding"
              className={cn(styles.link, styles.setupLink, pathname === "/onboarding" && styles.active)}
              tabIndex={collapsed && !mobileOpen ? -1 : 0}
              onClick={handleLinkClick}
            >
              <Compass size={18} className={styles.icon} />
              {!collapsed && <span>Setup</span>}
            </Link>
          )}
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
                tabIndex={collapsed && !mobileOpen ? -1 : 0}
                onClick={handleLinkClick}
              >
                <Icon size={18} className={styles.icon} />
                {!collapsed && (
                  <>
                    <span>{label}{href === "/business" && mounted && activeBizName && <span className={styles.navPlanTag}>{activeBizName}</span>}</span>
                    {href === "/notifications" && unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn(styles.footer, collapsed && styles.footerCollapsed)}>
          <div className={styles.userProfile}>
            <img src="https://api.dicebear.com/9.x/micah/svg?seed=LaunchSafe&backgroundColor=f0f0f0" alt="User" className={styles.userAvatar} />
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{profile?.fullName || "User"}</span>
                {profile?.jobTitle && <span className={styles.userRole}>{profile.jobTitle}</span>}
              </div>
            )}
          </div>
        </div>
      </aside>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}
    </>
  );
}

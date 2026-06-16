"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { ProfileSection } from "./sections/profile-section";
import { NotificationsSection } from "./sections/notifications-section";
import { SecuritySection } from "./sections/security-section";
import { TeamSection } from "./sections/team-section";
import { AccountSection } from "./sections/account-section";
import styles from "./settings-page.module.css";

type Section = "profile" | "notifications" | "security" | "team" | "account";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notification Preferences" },
  { key: "security", label: "Security" },
  { key: "team", label: "Team" },
  { key: "account", label: "Account Management" },
];

export function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [section, setSection] = useState<Section>(() => {
    const tab = searchParams.get("tab");
    if (tab === "team") return "team";
    return "profile";
  });

  useEffect(() => {
    trackEvent("Settings Viewed");
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </div>
      <div className={styles.layout}>
        <nav className={styles.sidebar} aria-label="Settings sections">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button" className={cn(styles.sidebarBtn, section === s.key && styles.sidebarActive)} onClick={() => setSection(s.key)}>
              {s.label}
            </button>
          ))}
        </nav>
        <div className={styles.content}>
          {section === "profile" && <ProfileSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "security" && <SecuritySection supabase={supabase} />}
          {section === "team" && <TeamSection />}
          {section === "account" && <AccountSection router={router} supabase={supabase} />}
        </div>
      </div>
    </div>
  );
}

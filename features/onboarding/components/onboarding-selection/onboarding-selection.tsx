"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./onboarding-selection.module.css";
import { Building2, FileText, LogOut } from "lucide-react";

export function OnboardingSelection() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const pending = localStorage.getItem("launchsafe-pending-unlock");
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed.summary) {
          router.replace("/assessment/unlock");
          return;
        }
      } catch {}
    }

    const intent = localStorage.getItem("launchsafe-intent");
    if (intent) {
      try {
        const parsed = JSON.parse(intent);
        if (parsed === "existing_business") {
          router.replace("/business-onboarding");
          return;
        }
      } catch {}
    }
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>LaunchSafe</div>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome to LaunchSafe</h1>
          <p className={styles.subtitle}>Choose how you want to get started with your compliance journey.</p>
        </div>

        <div className={styles.cardsContainer}>
          {/* Option 1: Free Assessment */}
          <button 
            className={styles.card}
            onClick={() => router.push("/assessment")} // Just a placeholder route per rules
          >
            <div className={styles.cardIconContainer}>
              <FileText className={styles.cardIcon} />
            </div>
            <h2 className={styles.cardTitle}>Start a Free Assessment</h2>
            <p className={styles.cardDescription}>
              I have a new business idea and want to understand my compliance requirements and costs before launching.
            </p>
            <div className={styles.cardFooter}>
              Explore Pre-Launch →
            </div>
          </button>

          {/* Option 2: Existing Business */}
          <button 
            className={styles.card}
            onClick={() => router.push("/dashboard")} // Just a placeholder route per rules
          >
            <div className={styles.cardIconContainer}>
              <Building2 className={styles.cardIcon} />
            </div>
            <h2 className={styles.cardTitle}>Add an Existing Business</h2>
            <p className={styles.cardDescription}>
              I already run a business and want to manage my compliance obligations, track deadlines, and generate documents.
            </p>
            <div className={styles.cardFooter}>
              Set up Autopilot →
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

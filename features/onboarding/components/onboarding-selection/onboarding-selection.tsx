"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./onboarding-selection.module.css";
import { Building2, FileText } from "lucide-react";

export function OnboardingSelection() {
  const router = useRouter();

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
          try { localStorage.removeItem("launchsafe-intent"); } catch {}
          router.replace("/business-onboarding");
          return;
        }
      } catch {}
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome to LaunchSafe</h1>
          <p className={styles.subtitle}>Choose how you want to get started with your compliance journey.</p>
        </div>

        <div className={styles.cardsContainer}>
          <button 
            className={styles.card}
            onClick={() => router.push("/assessment")}
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

          <button 
            className={styles.card}
            onClick={() => router.push("/business-onboarding")}
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

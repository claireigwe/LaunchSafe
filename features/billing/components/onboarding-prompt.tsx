"use client";

import { useRouter } from "next/navigation";
import { Building2, FileText, ArrowRight } from "lucide-react";
import styles from "./onboarding-prompt.module.css";

export function OnboardingPrompt() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome to LaunchSafe</h1>
        <p className={styles.subtitle}>Choose how you want to get started with your compliance journey.</p>
      </div>

      <div className={styles.grid}>
        <button className={styles.card} onClick={() => router.push("/assessment")}>
          <div className={styles.cardIcon}>
            <FileText size={24} />
          </div>
          <h2 className={styles.cardTitle}>Start a Free Assessment</h2>
          <p className={styles.cardDesc}>
            I have a new business idea and want to understand my compliance requirements and costs before launching.
          </p>
          <span className={styles.cardAction}>
            Explore Pre-Launch <ArrowRight size={14} />
          </span>
        </button>

        <button className={styles.card} onClick={() => router.push("/business-onboarding")}>
          <div className={styles.cardIcon}>
            <Building2 size={24} />
          </div>
          <h2 className={styles.cardTitle}>Add an Existing Business</h2>
          <p className={styles.cardDesc}>
            I already run a business and want to manage my compliance obligations, track deadlines, and generate documents.
          </p>
          <span className={styles.cardAction}>
            Set up Autopilot <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

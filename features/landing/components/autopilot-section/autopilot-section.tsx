"use client";

import { useRouter } from "next/navigation";
import { Activity, Calendar, Bell, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveUserIntent } from "@/features/businesses/api/onboarding-api";
import styles from "./autopilot-section.module.css";

export function AutopilotSection() {
  const router = useRouter();

  function handleAddExisting() {
    saveUserIntent("existing_business");
    router.push("/business-onboarding");
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Stay compliant after launch</h2>
          <p className={styles.subtitle}>
            Launch is only the beginning. Track deadlines, manage permits, monitor regulatory updates, store compliance records, and stay ahead of compliance risks from one dashboard.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" size="lg" onClick={handleAddExisting}>
              Add Your Existing Business
            </Button>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.dashboardMock}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarItem}><Activity size={16} /> Score</div>
              <div className={styles.sidebarItem}><Calendar size={16} /> Deadlines</div>
              <div className={styles.sidebarItem}><FileText size={16} /> Tasks</div>
              <div className={styles.sidebarItem}><Bell size={16} /> Updates</div>
              <div className={styles.sidebarItem}><Shield size={16} /> Records</div>
            </div>
            <div className={styles.mainContent}>
              <div className={styles.header}>
                <div className={styles.scoreCard}>
                  <span className={styles.scoreTitle}>Compliance Score</span>
                  <span className={styles.scoreValue}>92/100</span>
                </div>
              </div>
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Calendar size={14} className={styles.cardIcon} /> Upcoming Deadlines
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.task}>
                      <span className={styles.taskName}>Annual Returns Filing</span>
                      <span className={styles.taskDue}>Due in 14 days</span>
                    </div>
                    <div className={styles.task}>
                      <span className={styles.taskName}>Tax Clearance Renewal</span>
                      <span className={styles.taskDue}>Due in 30 days</span>
                    </div>
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Bell size={14} className={styles.cardIcon} /> Regulatory Updates
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.update}>
                      <span className={styles.updateBadge}>New</span>
                      <span className={styles.updateText}>CAC fee changes for 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

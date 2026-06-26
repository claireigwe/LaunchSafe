"use client";

import Link from "next/link";
import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SavedSubscription } from "@/types/domain/billing";
import pageStyles from "./billing-page.module.css";
import styles from "./current-subscription.module.css";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "statusActive" },
  trialing: { label: "Trialing", className: "statusTrialing" },
  past_due: { label: "Past Due", className: "statusWarning" },
  cancelled: { label: "Cancelled", className: "statusMuted" },
  expired: { label: "Expired", className: "statusMuted" },
  suspended: { label: "Suspended", className: "statusError" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export function CurrentSubscription({ sub }: { sub: SavedSubscription | null }) {
  const statusInfo = sub ? STATUS_LABELS[sub.status] || STATUS_LABELS.active : null;

  return (
    <section className={pageStyles.section}>
      <div className={pageStyles.sectionHeader}>
        <CreditCard size={16} className={pageStyles.sectionIcon} />
        <h2 className={pageStyles.sectionTitle}>Current Subscription</h2>
      </div>
      {sub ? (
        <div className={styles.subCardWrap}>
          <div className={styles.subCard}>
            <div className={styles.subRow}>
              <span className={styles.subLabel}>Plan</span>
              <span className={styles.subValue}>{sub.planName}</span>
            </div>
            <div className={styles.subRow}>
              <span className={styles.subLabel}>Billing</span>
              <span className={styles.subValue}>{sub.billingCycle === "annual" ? "Annual" : "Monthly"}</span>
            </div>
            <div className={styles.subRow}>
              <span className={styles.subLabel}>Status</span>
              <span className={`${styles.statusBadge} ${statusInfo ? styles[statusInfo.className] : ""}`}>{statusInfo?.label || sub.status}</span>
            </div>
            <div className={styles.subRow}>
              <span className={styles.subLabel}>Started</span>
              <span className={styles.subValue}>{formatDate(sub.startDate)}</span>
            </div>
            {sub.nextRenewal && (
              <div className={styles.subRow}>
                <span className={styles.subLabel}>Next Renewal</span>
                <span className={styles.subValue}>{formatDate(sub.nextRenewal)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={pageStyles.emptyCard}>
          <p className={pageStyles.emptyText}>No active subscription found.</p>
          <Link href="/business-onboarding"><Button variant="primary" size="sm">Choose a Plan</Button></Link>
        </div>
      )}
    </section>
  );
}

export function PlanFeatures({ planName, features }: { planName: string; features: string[] }) {
  return (
    <section className={pageStyles.section}>
      <div className={pageStyles.sectionHeader}>
        <Check size={16} className={pageStyles.sectionIcon} />
        <h2 className={pageStyles.sectionTitle}>Plan Details — {planName}</h2>
      </div>
      <div className={styles.featuresList}>
        {features.map((f) => (
          <div key={f} className={styles.featureRow}>
            <Check size={14} className={styles.checkIcon} />
            <span>{f}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

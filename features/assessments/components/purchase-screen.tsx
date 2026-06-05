"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getPendingUnlockIntent, clearPendingUnlockIntent, trackEvent, initiateAssessmentPayment } from "../api/assessment-api";
import type { AssessmentSummary } from "@/types/domain/assessment";
import { getComplexityLabel, getComplexityColor } from "../data/summary-generator";
import styles from "./purchase-screen.module.css";

export function PurchaseScreen() {
  const router = useRouter();
  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const pending = getPendingUnlockIntent();
    if (pending.summary) {
      setSummary(pending.summary);
      trackEvent("Unlock Page Viewed", { hasSummary: true });
    } else {
      router.replace("/assessment");
    }
    setLoading(false);
  }, [router]);

  async function handlePayment() {
    trackEvent("Payment Initiated");
    setError(null);
    setIsProcessing(true);

    if (!session) {
      router.push("/signup?redirect=/assessment/unlock");
      return;
    }

    const pending = getPendingUnlockIntent();
    const assessmentId = pending.assessmentId;

    if (!assessmentId) {
      setError("Assessment ID is missing.");
      setIsProcessing(false);
      return;
    }

    try {
      trackEvent("Assessment Purchase Initiated");
      const { authorizationUrl } = await initiateAssessmentPayment(assessmentId);
      clearPendingUnlockIntent();
      window.location.href = authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  }

  function handleLater() {
    trackEvent("Unlock Skipped");
    clearPendingUnlockIntent();
    router.push("/");
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const complexityLabel = getComplexityLabel(summary.complexityScore);
  const complexityColor = getComplexityColor(summary.complexityScore);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.summaryCard}>
          <h1 className={styles.title}>Your Compliance Report Is Ready</h1>
          <p className={styles.subtitle}>
            Complete your <strong>₦10,000</strong> payment to unlock your full compliance report.
          </p>

          <div className={styles.profileCard}>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Business Type</span>
              <span className={styles.profileValue}>{summary.businessType}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Location</span>
              <span className={styles.profileValue}>{summary.location}</span>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{summary.requirementCount}</span>
              <span className={styles.statLabel}>Requirements</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{summary.agencyCount}</span>
              <span className={styles.statLabel}>Agencies</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue} style={{ color: complexityColor }}>{complexityLabel}</span>
              <span className={styles.statLabel}>Complexity</span>
            </div>
          </div>
        </div>

        <div className={styles.lockedSection}>
          <h2 className={styles.lockedTitle}>What You'll Unlock</h2>

          <div className={styles.lockedItems}>
            {[
              { icon: "📋", label: "Requirement Breakdown" },
              { icon: "💰", label: "Cost Analysis" },
              { icon: "⚠️", label: "Risk Analysis" },
              { icon: "🗺️", label: "Launch Roadmap" },
              { icon: "📅", label: "Compliance Timeline" },
              { icon: "🏛️", label: "Agency Guidance" },
            ].map((item) => (
              <div key={item.label} className={styles.lockedItem}>
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemLabel}>{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={styles.lockIcon}>
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 7V5C5.5 3.6 6.6 2.5 8 2.5C9.4 2.5 10.5 3.6 10.5 5V7" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
            ))}
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.amountRow}>
              <span className={styles.amount}>₦10,000</span>
              <span className={styles.amountNote}>One-time payment</span>
            </div>
            <p className={styles.noSubscription}>No subscription required</p>
            {error && (
              <div className={styles.errorAlert} style={{ color: "var(--color-palette-error-40)", backgroundColor: "var(--color-palette-error-95)", padding: "12px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>
                {error}
              </div>
            )}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePayment}
              isLoading={isProcessing}
            >
              Unlock Full Report
            </Button>
          </div>

          <div className={styles.secureBadge}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1L12 3.5V6.5C12 9.8 9.8 12.9 7 13.5C4.2 12.9 2 9.8 2 6.5V3.5L7 1Z" stroke="var(--color-key-success)" strokeWidth="1.2" fill="none" />
              <path d="M5 7L6.5 8.5L9 5.5" stroke="var(--color-key-success)" strokeWidth="1.2" />
            </svg>
            <span>Secure checkout via Paystack</span>
          </div>

          <button className={styles.laterButton} onClick={handleLater}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

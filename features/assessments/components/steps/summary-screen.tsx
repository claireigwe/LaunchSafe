"use client";

import { useEffect } from "react";
import type { AssessmentSummary } from "@/types/domain/assessment";
import { getComplexityLabel, getComplexityColor } from "../../data/summary-generator";
import { trackEvent } from "../../api/assessment-api";
import styles from "./summary-screen.module.css";

interface SummaryScreenProps {
  summary: AssessmentSummary;
  onUnlock: () => void;
  onLater: () => void;
  onEdit?: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Business Registration": "🏢",
  "Tax Compliance": "📋",
  "Industry Licensing": "📜",
  "Health & Safety": "🛡️",
  "Food Safety": "🍽️",
  "Employment Compliance": "👥",
  "Data Protection": "🔒",
  "Healthcare Regulation": "🏥",
  "Trade License": "🏪",
  "Environmental Compliance": "🌿",
  "Import/Export Regulations": "🚢",
  "Financial Regulation": "💰",
  "Anti-Money Laundering": "🔍",
  "Transport Regulation": "🚚",
};

export function SummaryScreen({ summary, onUnlock, onLater, onEdit }: SummaryScreenProps) {
  useEffect(() => {
    trackEvent("Summary Viewed", { requirementCount: summary.requirementCount, complexityScore: summary.complexityScore });
  }, [summary]);

  const complexityLabel = getComplexityLabel(summary.complexityScore);
  const complexityColor = getComplexityColor(summary.complexityScore);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" fill="var(--color-key-warning)" />
          </svg>
          Assessment Complete
        </div>
        <h2 className={styles.title}>Your Compliance Profile</h2>
        <p className={styles.subtitle}>Here is a summary of your compliance requirements based on the information you provided.</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Business Type</span>
          <span className={styles.profileValue}>{summary.businessType}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Industry</span>
          <span className={styles.profileValue}>{summary.categories[0]?.replace(" Compliance", "").replace(" Registration", "") || "General Business"}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Location</span>
          <span className={styles.profileValue}>{summary.location}</span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{summary.requirementCount}</span>
          <span className={styles.statLabel}>Requirements</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{summary.agencyCount}</span>
          <span className={styles.statLabel}>Agencies</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: complexityColor }}>
            {complexityLabel}
          </span>
          <span className={styles.statLabel}>Complexity</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Compliance Categories</h3>
        <div className={styles.categoryGrid}>
          {summary.categories.map((cat) => (
            <div key={cat} className={styles.categoryChip}>
              <span className={styles.categoryIcon}>{CATEGORY_ICONS[cat] || "📄"}</span>
              <span className={styles.categoryName}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {onEdit && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button
            type="button"
            onClick={onEdit}
            style={{
              background: "none", border: "none",
              fontFamily: "var(--font-label-label-medium-fontFamily)",
              fontSize: 13, fontWeight: 500,
              color: "var(--color-role-light-primary)",
              cursor: "pointer", padding: "8px 16px",
              textDecoration: "underline",
            }}
          >
            Edit Answers
          </button>
        </div>
      )}

      <div className={styles.lockedSection}>
        <div className={styles.lockedHeader}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>
            <h3 className={styles.lockedTitle}>Your Full Compliance Report Is Ready</h3>
            <p className={styles.lockedSubtitle}>Unlock detailed compliance intelligence for your business</p>
          </div>
        </div>

        <div className={styles.lockedItems}>
          {[
            "Requirement Breakdown",
            "Cost Analysis",
            "Risk Analysis",
            "Launch Roadmap",
            "Compliance Timeline",
            "Agency Guidance",
          ].map((item) => (
            <div key={item} className={styles.lockedItem}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8L6.5 11.5L13 5" stroke="var(--color-key-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.lockedItemText}>{item}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={styles.lockIcon}>
                <rect x="2.5" y="6.5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5 6.5V4.5C5 3.4 5.9 2.5 7 2.5C8.1 2.5 9 3.4 9 4.5V6.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          ))}
        </div>

        <button className={styles.unlockButton} onClick={onUnlock}>
          <div className={styles.unlockContent}>
            <span className={styles.unlockTitle}>Unlock Your Full Compliance Report</span>
            <span className={styles.unlockPrice}>₦10,000 <span className={styles.unlockOnce}>One-Time Payment</span></span>
            <span className={styles.unlockSubtext}>No Subscription Required</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.secureBadge}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1L12 3.5V6.5C12 9.8 9.8 12.9 7 13.5C4.2 12.9 2 9.8 2 6.5V3.5L7 1Z" stroke="var(--color-key-success)" strokeWidth="1.2" fill="none" />
            <path d="M5 7L6.5 8.5L9 5.5" stroke="var(--color-key-success)" strokeWidth="1.2" />
          </svg>
          <span>Secure checkout via Paystack</span>
        </div>

        <button className={styles.laterButton} onClick={onLater}>
          Maybe Later
        </button>
      </div>
    </div>
  );
}

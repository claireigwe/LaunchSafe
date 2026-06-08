"use client";

import { FileText, CheckCircle, AlertTriangle } from "lucide-react";
import type { DocumentReport } from "../types/reporting.types";
import styles from "./documentation-health.module.css";

interface Props {
  data: DocumentReport;
}

export function DocumentationHealthSection({ data }: Props) {
  const totalPossible = data.totalUploaded + data.missingRecommended;
  const score = totalPossible > 0 ? Math.round((data.totalUploaded / totalPossible) * 100) : 0;
  const status = score >= 80 ? "excellent" : score >= 50 ? "good" : "needs_attention";
  const statusLabel = status === "excellent" ? "Excellent" : status === "good" ? "Good" : "Needs Attention";
  const statusCls = status === "excellent" ? "stExcellent" : status === "good" ? "stGood" : "stAttention";

  const missing = data.missingRecommended > 0;
  const impact = missing
    ? `Uploading ${data.missingRecommended} missing document${data.missingRecommended > 1 ? "s" : ""} could improve compliance health.`
    : "All recommended documents have been uploaded.";

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Documentation Health</h2>
        <p className={styles.subtitle}>How prepared your document records are for compliance.</p>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <div className={styles.donut}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-role-light-surfaceContainerHigh)" strokeWidth="6" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={score >= 80 ? "var(--color-key-success)" : score >= 50 ? "var(--color-key-warning)" : "var(--color-key-error)"} strokeWidth="6" strokeDasharray={`${score * 2.01} 201`} transform="rotate(-90 40 40)" strokeLinecap="round" />
              <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="700" fill="var(--color-role-light-onSurface)" fontFamily="var(--font-headline-headline-medium-fontFamily)">{score}%</text>
            </svg>
          </div>
          <span className={`${styles.statusBadge} ${styles[statusCls]}`}>{statusLabel}</span>
          <p className={styles.scoreDesc}>
            {data.totalUploaded} document{data.totalUploaded !== 1 ? "s" : ""} uploaded · {data.missingRecommended} recommended document{data.missingRecommended !== 1 ? "s" : ""} missing
          </p>
        </div>

        <div className={styles.midCol}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{data.totalUploaded}</span>
            <span className={styles.statLabel}>Uploaded</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: missing ? "var(--color-key-warning)" : "var(--color-key-success)" }}>{data.missingRecommended}</span>
            <span className={styles.statLabel}>Missing</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{data.recentlyAdded}</span>
            <span className={styles.statLabel}>Recent (30d)</span>
          </div>
        </div>

        <div className={styles.rightCol}>
          {data.recommendations.length > 0 && (
            <div className={styles.recoPanel}>
              <h3 className={styles.recoTitle}>Missing Critical Documents</h3>
              {data.recommendations.map((r, i) => (
                <div key={i} className={styles.recoCard}>
                  <div className={styles.recoCardLeft}>
                    <AlertTriangle size={18} className={styles.recoIcon} />
                    <span>{r}</span>
                  </div>
                  <span className={styles.uploadLink}>Upload</span>
                </div>
              ))}
              <p className={styles.impact}>{impact}</p>
            </div>
          )}

          {!missing && (
            <div className={styles.allGood}>
              <CheckCircle size={16} />
              <span>All recommended documents have been uploaded.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

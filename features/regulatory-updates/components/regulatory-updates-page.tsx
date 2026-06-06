"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ExternalLink, AlertTriangle } from "lucide-react";
import { getRegulatoryUpdates } from "../api/regulatory-updates-api";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import styles from "./regulatory-updates-page.module.css";

export function RegulatoryUpdatesPage() {
  const [updates, setUpdates] = useState(getRegulatoryUpdates());

  useEffect(() => {
    trackEvent("Regulatory Updates Viewed");
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Regulatory Updates</h1>
        <p className={styles.subtitle}>Stay informed about regulatory changes affecting your business.</p>
      </div>

      {updates.length > 0 ? (
        <div className={styles.list}>
          {updates.map((u) => (
            <div key={u.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                  <Bell size={16} className={styles.cardIcon} />
                  <h2 className={styles.cardTitle}>{u.title}</h2>
                </div>
                <span className={`${styles.impactBadge} ${styles[`impact_${u.impactLevel}`]}`}>{u.impactLevel}</span>
              </div>
              <p className={styles.cardSummary}>{u.summary}</p>
              <div className={styles.cardMeta}>
                <span className={styles.source}>Source: {u.source}</span>
                <span className={styles.date}>
                  {new Date(u.publishedAt || u.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              {u.sourceUrl && (
                <Link href={u.sourceUrl} target="_blank" className={styles.sourceLink}>
                  View official source <ExternalLink size={12} />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <AlertTriangle size={32} className={styles.emptyIcon} />
          <p className={styles.emptyText}>No regulatory updates available for your industry at this time.</p>
        </div>
      )}
    </div>
  );
}

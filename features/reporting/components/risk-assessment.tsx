"use client";

import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import type { RiskReport } from "../types/reporting.types";
import { formatRiskInsights } from "../api/reporting-format";
import styles from "./risk-assessment.module.css";

interface Props {
  data: RiskReport;
}

export function RiskAssessmentSection({ data }: Props) {
  const levelCls = data.level === "low" ? "levelLow" : data.level === "medium" ? "levelMedium" : "levelHigh";

  const recommendations: string[] = [];
  if (data.factors.some((f) => f.includes("overdue"))) recommendations.push("Complete overdue tasks immediately.");
  if (data.factors.some((f) => f.includes("deadline"))) recommendations.push("Review upcoming deadlines and prioritize.");
  if (data.factors.some((f) => f.includes("document"))) recommendations.push("Upload missing compliance documents.");
  if (data.factors.some((f) => f.includes("activity"))) recommendations.push("Increase compliance activity and task completion.");
  if (data.score < 25) recommendations.push("Maintain current compliance practices to stay low risk.");

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Compliance Risk Assessment</h2>
        <p className={styles.subtitle}>Current risk level and actions to reduce exposure.</p>
      </div>

      <div className={styles.scoreRow}>
        <div className={`${styles.scoreCircle} ${styles[levelCls]}`}>
          <span className={styles.scoreValue}>{data.score}</span>
          <span className={styles.scoreUnit}>/100</span>
        </div>
        <div className={styles.scoreInfo}>
          <span className={`${styles.levelBadge} ${styles[levelCls]}`}>
            <AlertTriangle size={14} />
            {data.level === "low" ? "Low Risk" : data.level === "medium" ? "Medium Risk" : "High Risk"}
          </span>
          <p className={styles.insight}>{formatRiskInsights(data)}</p>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div>
          <h3 className={styles.colTitle}>Risk Drivers</h3>
          <ul className={styles.driverList}>
            {data.factors.length > 0 ? data.factors.map((f, i) => (
              <li key={i} className={styles.driverItem}>
                <AlertTriangle size={13} className={styles.driverIcon} />
                {f}
              </li>
            )) : (
              <li className={styles.driverItem}>
                <CheckCircle size={13} style={{ color: "var(--color-key-success)" }} />
                No significant risk factors detected.
              </li>
            )}
          </ul>
        </div>
        <div>
          <h3 className={styles.colTitle}>Recommended Actions</h3>
          <ul className={styles.actionList}>
            {recommendations.map((r, i) => (
              <li key={i} className={styles.actionItem}>
                <ArrowRight size={13} className={styles.actionArrow} />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

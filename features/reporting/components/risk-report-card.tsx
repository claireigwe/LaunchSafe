import { AlertTriangle } from "lucide-react";
import type { RiskReport } from "../types/reporting.types";
import { formatRiskInsights } from "../api/reporting-format";
import styles from "./risk-report-card.module.css";

interface Props {
  data: RiskReport;
}

const LEVELS = {
  low: { label: "Low Risk", cls: "levelLow" },
  medium: { label: "Medium Risk", cls: "levelMedium" },
  high: { label: "High Risk", cls: "levelHigh" },
};

export function RiskReportCard({ data }: Props) {
  const level = LEVELS[data.level];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <AlertTriangle size={16} className={styles.icon} />
        <h2 className={styles.title}>Compliance Risk</h2>
      </div>
      <div className={styles.scoreRow}>
        <div className={`${styles.scoreCircle} ${styles[level.cls]}`}>
          <span className={styles.scoreValue}>{data.score}</span>
          <span className={styles.scoreUnit}>/100</span>
        </div>
        <div>
          <div className={`${styles.levelBadge} ${styles[level.cls]}`}>{level.label}</div>
          <p className={styles.insights}>{formatRiskInsights(data)}</p>
        </div>
      </div>
      {data.factors.length > 0 && (
        <ul className={styles.factors}>
          {data.factors.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      )}
    </div>
  );
}

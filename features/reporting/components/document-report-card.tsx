import { FileText } from "lucide-react";
import type { DocumentReport } from "../types/reporting.types";
import styles from "./document-report-card.module.css";

interface Props {
  data: DocumentReport;
}

export function DocumentReportCard({ data }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FileText size={16} className={styles.icon} />
        <h2 className={styles.title}>Document Compliance</h2>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.totalUploaded}</span>
          <span className={styles.statLabel}>Uploaded</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.missingRecommended}</span>
          <span className={styles.statLabel}>Missing</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.recentlyAdded}</span>
          <span className={styles.statLabel}>Recent (30d)</span>
        </div>
      </div>
      {data.recommendations.length > 0 && (
        <div className={styles.recs}>
          <span className={styles.recLabel}>Recommended documents:</span>
          {data.recommendations.map((r, i) => <span key={i} className={styles.recItem}>{r}</span>)}
        </div>
      )}
    </div>
  );
}

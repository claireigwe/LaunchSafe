import { Activity } from "lucide-react";
import type { ActivityReport } from "../types/reporting.types";
import styles from "./activity-report-card.module.css";

interface Props {
  data: ActivityReport;
}

export function ActivityReportCard({ data }: Props) {
  const maxCount = Math.max(...data.trendDays.map((d) => d.count), 1);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Activity size={16} className={styles.icon} />
        <h2 className={styles.title}>Activity</h2>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.tasksCreated}</span>
          <span className={styles.statLabel}>Tasks Created</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.tasksCompleted}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.documentsUploaded}</span>
          <span className={styles.statLabel}>Docs Uploaded</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.events}</span>
          <span className={styles.statLabel}>Events</span>
        </div>
      </div>
      <div className={styles.trend}>
        <span className={styles.trendLabel}>7-day activity</span>
        <div className={styles.trendChart}>
          {data.trendDays.map((d, i) => (
            <div key={i} className={styles.trendBarCol}>
              <div className={styles.trendBarTrack}>
                <div className={styles.trendBar} style={{ height: `${(d.count / maxCount) * 100}%` }} />
              </div>
              <span className={styles.trendDay}>{d.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

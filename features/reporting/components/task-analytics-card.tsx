import { ClipboardList } from "lucide-react";
import type { TaskAnalytics } from "../types/reporting.types";
import styles from "./task-analytics-card.module.css";

interface Props {
  data: TaskAnalytics;
}

export function TaskAnalyticsCard({ data }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <ClipboardList size={16} className={styles.icon} />
        <h2 className={styles.title}>Task Analytics</h2>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.totalTasks}</span>
          <span className={styles.statLabel}>Total Tasks</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.completedTasks}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.pendingTasks}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.overdueTasks}</span>
          <span className={styles.statLabel}>Overdue</span>
        </div>
      </div>
      <div className={styles.rateRow}>
        <div className={styles.rateBar}>
          <div className={styles.rateFill} style={{ width: `${data.completionRate}%` }} />
        </div>
        <span className={styles.rateLabel}>{data.completionRate}% completion rate</span>
      </div>
    </div>
  );
}

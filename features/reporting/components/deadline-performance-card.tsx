import { Calendar } from "lucide-react";
import type { DeadlinePerformance } from "../types/reporting.types";
import styles from "./deadline-performance-card.module.css";

interface Props {
  data: DeadlinePerformance;
}

const RATINGS = {
  excellent: { label: "Excellent", cls: "ratingExcellent" },
  good: { label: "Good", cls: "ratingGood" },
  needs_attention: { label: "Needs Attention", cls: "ratingAttention" },
};

export function DeadlinePerformanceCard({ data }: Props) {
  const rating = RATINGS[data.rating];
  const total = data.met + data.missed;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Calendar size={16} className={styles.icon} />
        <h2 className={styles.title}>Deadline Performance</h2>
      </div>
      <div className={`${styles.ratingBadge} ${styles[rating.cls]}`}>{rating.label}</div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.met}</span>
          <span className={styles.statLabel}>Met</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.missed}</span>
          <span className={styles.statLabel}>Missed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.upcoming}</span>
          <span className={styles.statLabel}>Upcoming</span>
        </div>
      </div>
      {total > 0 && (
        <div className={styles.barRow}>
          <div className={styles.barTrack}>
            <div className={styles.barMet} style={{ width: `${(data.met / total) * 100}%` }} />
          </div>
          <span className={styles.barLabel}>{Math.round((data.met / total) * 100)}% met</span>
        </div>
      )}
    </div>
  );
}

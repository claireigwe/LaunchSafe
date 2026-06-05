import type { ComplianceScore } from "@/types/domain/compliance";
import styles from "./health-score.module.css";

interface Props {
  score: ComplianceScore | null;
}

export function HealthScore({ score }: Props) {
  if (!score) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Compliance Health</h2>
        </div>
        <div className={styles.emptyBody}>
          <div className={styles.emptyScore}>—</div>
          <p className={styles.emptyText}>Complete your compliance setup to see your health score.</p>
        </div>
      </div>
    );
  }

  const label = score.score >= 80 ? "Healthy" : score.score >= 50 ? "Needs Attention" : "At Risk";
  const level = score.score >= 80 ? "healthy" : score.score >= 50 ? "attention" : "risk";
  const message = score.score >= 80
    ? "Your compliance profile is in good standing. No critical deadlines require immediate action."
    : score.score >= 50
    ? "Some compliance items require your attention. Review upcoming deadlines and overdue items below."
    : "Your compliance profile has critical issues. Address overdue items immediately.";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Compliance Health</h2>
      </div>
      <div className={styles.body}>
        <div className={`${styles.scoreCircle} ${styles[level]}`}>
          <span className={styles.scoreValue}>{score.score}%</span>
        </div>
        <div className={styles.details}>
          <p className={styles.message}>{message}</p>
          <div className={styles.breakdown}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{score.breakdown.completedTasks}/{score.breakdown.totalTasks}</span>
              <span className={styles.statLabel}>Tasks done</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{score.breakdown.overdueCount}</span>
              <span className={styles.statLabel}>Overdue</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{score.breakdown.missingEvidence}</span>
              <span className={styles.statLabel}>Missing evidence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

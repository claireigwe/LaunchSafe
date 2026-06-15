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
        <div className={styles.body}>
          <div className={styles.scoreCol}>
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: "var(--color-role-light-surfaceContainer)", animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
          <div className={styles.details}>
            <div style={{ width: "80%", height: 14, background: "var(--color-role-light-surfaceContainer)", borderRadius: 8, marginBottom: 20, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div className={styles.breakdown}>
              {[1,2,3].map((i) => (
                <div key={i} className={styles.stat}>
                  <div style={{ width: 30, height: 16, background: "var(--color-role-light-surfaceContainer)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                  <div style={{ width: 50, height: 12, marginTop: 4, background: "var(--color-role-light-surfaceContainer)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                </div>
              ))}
            </div>
          </div>
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

  const trendDiff = score.previousScore != null ? score.score - score.previousScore : null;
  const trendUp = trendDiff != null && trendDiff > 0;
  const trendDown = trendDiff != null && trendDiff < 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Compliance Health</h2>
      </div>
      <div className={styles.body}>
        <div className={styles.scoreCol}>
          <div className={`${styles.scoreCircle} ${styles[level]}`}>
            <span className={styles.scoreValue}>{score.score}%</span>
          </div>
          {trendDiff != null && trendDiff !== 0 && (
            <span className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
              {trendUp ? "↑" : "↓"} {Math.abs(trendDiff)} pts
            </span>
          )}
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
              <span className={styles.statValue}>{score.breakdown.upcomingDeadlineCount}</span>
              <span className={styles.statLabel}>Due soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Clock } from "lucide-react";
import type { ActivityEntry } from "@/features/activity/api/activity-api";
import styles from "./recent-activity.module.css";

interface Props {
  activities: ActivityEntry[];
}

export function RecentActivity({ activities }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Clock size={16} className={styles.icon} />
        <h2 className={styles.title}>Recent Activity</h2>
      </div>
      {activities.length > 0 ? (
        <ul className={styles.list}>
          {activities.map((a) => (
            <li key={a.id} className={styles.item}>
              <span className={`${styles.dot} ${styles[`t_${a.type}`]}`} />
              <div className={styles.itemBody}>
                <p className={styles.itemTitle}>{a.title}</p>
                <p className={styles.itemDesc}>{a.description}</p>
                <span className={styles.itemTime}>{new Date(a.timestamp).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No recent activity.</p>
        </div>
      )}
    </div>
  );
}

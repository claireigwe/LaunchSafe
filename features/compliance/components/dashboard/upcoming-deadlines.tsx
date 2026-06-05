import Link from "next/link";
import { Calendar } from "lucide-react";
import type { ComplianceTask } from "@/types/domain/compliance";
import styles from "./upcoming-deadlines.module.css";

interface Props {
  tasks: ComplianceTask[];
}

export function UpcomingDeadlines({ tasks }: Props) {
  const hasItems = tasks.length > 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Calendar size={16} className={styles.icon} />
        <h2 className={styles.title}>Upcoming Deadlines</h2>
      </div>
      {hasItems ? (
        <ul className={styles.list}>
          {tasks.map((t) => (
            <li key={t.id} className={styles.item}>
              <Link href={`/compliance/${t.id}`} className={styles.link}>
                <span className={styles.taskName}>{t.requirementName}</span>
                <span className={styles.taskMeta}>
                  {t.dueDate && <span className={styles.due}>{t.dueDate}</span>}
                  <span className={`${styles.priority} ${styles[`p_${t.status}`]}`}>{t.status.replace("_", " ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No upcoming deadlines.</p>
        </div>
      )}
    </div>
  );
}

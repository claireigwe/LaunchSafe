import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { ComplianceTask } from "@/types/domain/compliance";
import styles from "./overdue-items.module.css";

interface Props {
  items: ComplianceTask[];
}

export function OverdueItems({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <AlertTriangle size={16} className={styles.icon} />
        <h2 className={styles.title}>Overdue Items</h2>
        <span className={styles.count}>{items.length}</span>
      </div>
      <ul className={styles.list}>
        {items.map((t) => (
          <li key={t.id} className={styles.item}>
            <Link href={`/compliance/${t.id}`} className={styles.link}>
              <span className={styles.taskName}>{t.requirementName}</span>
              <span className={styles.meta}>
                {t.dueDate && <span className={styles.due}>Due {t.dueDate}</span>}
                <span className={styles.overdue}>Overdue</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import type { ComplianceTaskItem } from "../../types/tasks.types";
import styles from "./dashboard-page.module.css";

interface Props {
  items: ComplianceTaskItem[];
}

export function UpcomingSection({ items }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <ClipboardList size={20} className={styles.cardHeaderIcon} />
        <h2 className={styles.cardHeaderTitle}>Upcoming Deadlines</h2>
        <Link href="/compliance" className={styles.cardAction}>View All</Link>
      </div>
      {items.map((t) => {
        const days = t.dueDate ? Math.ceil((new Date(t.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        return (
          <Link key={t.id} href="/compliance" className={styles.cardItem}>
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 15, fontWeight: 500, color: "var(--color-role-light-onSurface)" }}>{t.title}</span>
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: days !== null && days <= 3 ? 600 : 500, color: days !== null && days <= 3 ? "var(--color-role-light-error)" : "var(--color-role-light-onSurfaceVariant)" }}>
              {days === 0 ? "Due today" : days === 1 ? "1 day left" : days !== null && days > 0 ? `${days} days left` : ""}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

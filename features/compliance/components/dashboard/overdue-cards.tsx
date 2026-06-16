import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { ComplianceTaskItem } from "../../types/tasks.types";
import styles from "./dashboard-page.module.css";

interface Props {
  items: ComplianceTaskItem[];
}

export function OverdueCards({ items }: Props) {
  return (
    <div className={styles.card} style={{ background: "var(--color-role-light-errorContainer)", borderColor: "var(--color-palette-error-60)" }}>
      <div className={styles.cardHeader} style={{ borderBottomColor: "var(--color-palette-error-60)" }}>
        <AlertTriangle size={20} style={{ color: "var(--color-role-light-onErrorContainer)" }} />
        <h2 className={styles.cardHeaderTitle} style={{ color: "var(--color-role-light-onErrorContainer)" }}>Overdue Items</h2>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, background: "var(--color-role-light-error)", color: "var(--color-role-light-onError)", padding: "4px 12px", borderRadius: 12 }}>{items.length}</span>
      </div>
      {items.slice(0, 3).map((t, i) => (
        <Link key={t.id} href="/compliance" className={styles.cardItem} style={{ color: "var(--color-role-light-onErrorContainer)", borderBottomColor: i < Math.min(items.length, 3) - 1 ? "var(--color-palette-error-60)" : "transparent" }}>
          <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 15, fontWeight: 500 }}>{t.title}</span>
          <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "var(--color-role-light-error)", color: "var(--color-role-light-onError)" }}>Overdue</span>
        </Link>
      ))}
      <Link href="/compliance" className={styles.cardFooter} style={{ color: "var(--color-role-light-onErrorContainer)", borderTopColor: "var(--color-palette-error-60)", background: "transparent" }}>View All Overdue Tasks</Link>
    </div>
  );
}

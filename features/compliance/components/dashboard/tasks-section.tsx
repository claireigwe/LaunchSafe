import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComplianceTaskItem } from "../../types/tasks.types";
import styles from "./dashboard-page.module.css";

interface Props {
  tasks: ComplianceTaskItem[];
  onAddTask: () => void;
}

export function TasksSection({ tasks, onAddTask }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <ClipboardList size={20} className={styles.cardHeaderIcon} />
        <h2 className={styles.cardHeaderTitle}>Recent Tasks</h2>
        <Button variant="primary" size="sm" onClick={onAddTask} style={{ borderRadius: 12, padding: "8px 16px" }}><Plus size={16} style={{ marginRight: 6 }} /> New Task</Button>
      </div>
      {tasks.slice(0, 5).map((t) => (
        <Link key={t.id} href="/compliance" className={styles.cardItem}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.priority === "critical" || t.priority === "high" ? "var(--color-role-light-error)" : t.priority === "medium" ? "var(--color-key-warning)" : "var(--color-key-neutral)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 15, fontWeight: 500, color: "var(--color-role-light-onSurface)" }}>{t.title}</span>
          </div>
          <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: t.status === "overdue" ? "var(--color-role-light-errorContainer)" : "var(--color-role-light-surfaceContainerLowest)", color: t.status === "overdue" ? "var(--color-role-light-onErrorContainer)" : "var(--color-role-light-onSurfaceVariant)", border: t.status !== "overdue" ? "1px solid var(--color-role-light-outlineVariant)" : "none", textTransform: "capitalize" }}>{t.status.replace("_", " ")}</span>
        </Link>
      ))}
      {tasks.length > 5 && (
        <Link href="/compliance" className={styles.cardFooter}>View All Tasks</Link>
      )}
    </div>
  );
}

import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./dashboard-page.module.css";

interface Props {
  onAddTask: () => void;
}

export function EmptyTasks({ onAddTask }: Props) {
  return (
    <div className={styles.card} style={{ padding: "64px 24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-role-light-surfaceContainer)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--color-role-light-onSurfaceVariant)" }}>
        <ClipboardList size={32} />
      </div>
      <h3 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 20, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 12px" }}>No Tasks Yet</h3>
      <p style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 auto 32px", maxWidth: 300 }}>You do not have any active compliance tasks. Get started by creating your first task.</p>
      <Button variant="primary" size="lg" onClick={onAddTask} style={{ borderRadius: 12 }}>Create Your First Task</Button>
    </div>
  );
}

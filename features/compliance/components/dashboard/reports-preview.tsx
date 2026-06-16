import Link from "next/link";
import { BarChart } from "lucide-react";
import { getCurrentPlanId } from "@/features/billing/api/feature-access";

interface Props {
  savedTasks: { status: string }[];
}

export function ReportsPreview({ savedTasks }: Props) {
  const planId = getCurrentPlanId();
  if (!planId) return null;
  const completed = savedTasks.filter((t) => t.status === "completed").length;
  const overdue = savedTasks.filter((t) => t.status === "overdue").length;
  const rate = savedTasks.length > 0 ? Math.round((completed / savedTasks.length) * 100) : 0;
  return (
    <Link href="/reports" style={{ display: "block", textDecoration: "none" }}>
      <div style={{ background: "linear-gradient(135deg, var(--color-role-light-primaryContainer), var(--color-role-light-surfaceContainerLowest))", border: "1px solid var(--color-role-light-primary)", borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-role-light-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
          <BarChart size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-onPrimaryContainer)", margin: "0 0 2px" }}>Advanced Reporting</h3>
          <p style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, color: "var(--color-role-light-onPrimaryContainer)", margin: 0, opacity: 0.8 }}>
            {rate}% completion · {overdue} overdue · {savedTasks.length} total tasks
          </p>
        </div>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-primary)", whiteSpace: "nowrap" }}>View Reports →</span>
      </div>
    </Link>
  );
}

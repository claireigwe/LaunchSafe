"use client";

import { cn } from "@/lib/utils/cn";
import type { ComplianceTaskItem } from "../../types/tasks.types";
import styles from "./task-card.module.css";

interface Props {
  task: ComplianceTaskItem;
  onClick: (task: ComplianceTaskItem) => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  not_started: "Pending",
  in_progress: "In Progress",
  awaiting_submission: "Awaiting Submission",
  submitted: "Submitted",
  approved: "Approved",
  due_soon: "Due Soon",
  completed: "Completed",
  overdue: "Overdue",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function TaskCard({ task, onClick }: Props) {
  const daysUntilDue = task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <button
      type="button"
      className={cn(styles.card, task.status === "overdue" && styles.overdue, task.status === "completed" && styles.completed)}
      onClick={() => onClick(task)}
    >
      <div className={styles.row}>
        <span className={`${styles.dot} ${styles[`p_${task.priority}`]}`} />
        <span className={styles.title}>{task.title}</span>
        <span className={cn(styles.badge, styles[`s_${task.status}`])}>{STATUS_LABELS[task.status]}</span>
      </div>
      <div className={styles.meta}>
        {daysUntilDue !== null && (
          <span className={cn(styles.due, daysUntilDue < 0 && styles.overdueText)}>
            {daysUntilDue === 0 ? "Due today" : daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
          </span>
        )}
        <span className={styles.priority}>{PRIORITY_LABELS[task.priority]}</span>
        {task.source === "suggested" && <span className={styles.source}>Suggested</span>}
      </div>
    </button>
  );
}

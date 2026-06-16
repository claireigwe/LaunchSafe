"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TaskAnalytics, DeadlinePerformance } from "../types/reporting.types";
import styles from "./compliance-execution.module.css";

interface Props {
  taskData: TaskAnalytics;
  deadlineData: DeadlinePerformance;
}

export function ComplianceExecutionSection({ taskData, deadlineData }: Props) {
  const totalDefined = taskData.completedTasks + taskData.overdueTasks + taskData.pendingTasks;
  const trend = taskData.completionRate >= 70 ? "up" : taskData.completionRate >= 40 ? "stable" : "down";
  const trendIcon = trend === "up" ? <TrendingUp size={14} /> : trend === "down" ? <TrendingDown size={14} /> : <Minus size={14} />;
  const trendColor = trend === "up" ? "var(--color-key-success)" : trend === "down" ? "var(--color-key-error)" : "var(--color-role-light-onSurfaceVariant)";

  const insight =
    deadlineData.rating === "excellent"
      ? "Most deadlines are being met successfully."
      : deadlineData.rating === "good"
      ? "Some deadlines require attention. Review upcoming obligations."
      : "Deadline performance needs improvement. Focus on overdue items first.";

  const overdueInsight =
    taskData.overdueTasks > 0
      ? ` ${taskData.overdueTasks} overdue task${taskData.overdueTasks > 1 ? "s" : ""} require${taskData.overdueTasks === 1 ? "s" : ""} immediate attention.`
      : " No overdue tasks — good execution discipline.";

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Compliance Execution</h2>
        <p className={styles.subtitle}>How effectively your business completes compliance activities.</p>
      </div>

      <div className={styles.scoreRow}>
        <div className={styles.scoreCard}>
          <span className={styles.scoreLabel}>Task Completion Rate</span>
          <span className={styles.scoreValue}>{taskData.completionRate}%</span>
          <span className={styles.scoreTrend} style={{ color: trendColor }}>
            {trendIcon}
            {trend === "up" ? " Improving" : trend === "down" ? " Declining" : " Stable"}
          </span>
        </div>
        <div className={styles.scoreCard}>
          <span className={styles.scoreLabel}>Deadlines Met</span>
          <span className={styles.scoreValue}>{deadlineData.rating === "excellent" ? "Excellent" : deadlineData.rating === "good" ? "Good" : "Needs Attention"}</span>
          <span className={styles.scoreTrend}>{deadlineData.met} of {deadlineData.met + deadlineData.missed} on time</span>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricValue}>{taskData.totalTasks}</span>
          <span className={styles.metricLabel}>Total Tasks</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricValue} style={{ color: "var(--color-key-success)" }}>{taskData.completedTasks}</span>
          <span className={styles.metricLabel}>Completed</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricValue} style={{ color: "var(--color-key-warning)" }}>{taskData.pendingTasks}</span>
          <span className={styles.metricLabel}>Pending</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricValue} style={{ color: "var(--color-key-error)" }}>{taskData.overdueTasks}</span>
          <span className={styles.metricLabel}>Overdue</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricValue}>{deadlineData.met}</span>
          <span className={styles.metricLabel}>Deadlines Met</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricValue} style={{ color: "var(--color-key-error)" }}>{deadlineData.missed}</span>
          <span className={styles.metricLabel}>Missed</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricValue}>{deadlineData.upcoming}</span>
          <span className={styles.metricLabel}>Upcoming</span>
        </div>
      </div>

      <div className={styles.insightBox}>
        <p>{insight}{overdueInsight}</p>
      </div>
    </div>
  );
}

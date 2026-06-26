"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, Info } from "lucide-react";
import { useTasks } from "@/features/compliance/hooks/use-tasks-query";
import { useDocuments } from "@/features/documents/hooks/use-documents-query";
import type { HealthTrendPoint } from "../types/reporting.types";
import styles from "./health-trend-chart.module.css";

interface Props {
  data: HealthTrendPoint[];
}

export function HealthTrendChart({ data }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "12m">("90d");

  const chartData = useMemo(() => {
    // Show all available data; when more historical data exists, this can be filtered
    return data;
  }, [data, timeRange]);
  const current = chartData[chartData.length - 1] || { score: 0 };
  const previous = chartData[chartData.length - 2] || { score: 0 };
  const periodChange = current.score - previous.score;
  const hasRealData = chartData.length > 0;

  const { data: tasks = [] } = useTasks();
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const overdueTasks = tasks.filter((t) => t.status === "overdue").length;
  const missedDeadlines = tasks.filter((t) => t.status === "overdue" && t.dueDate).length;
  const { data: documents = [] } = useDocuments();
  const docsUploaded = documents.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;



  const w = 600;
  const h = 200;
  const pt = { top: 20, right: 20, bottom: 28, left: 36 };
  const cw = w - pt.left - pt.right;
  const ch = h - pt.top - pt.bottom;

  const maxScore = Math.max(...chartData.map((p) => p.score), 100);
  const minScore = Math.min(...chartData.map((p) => p.score), 0);
  const rng = maxScore - minScore || 1;

  const pts = chartData.map((p, i) => ({
    x: pt.left + (i / Math.max(chartData.length - 1, 1)) * cw,
    y: pt.top + ch - ((p.score - minScore) / rng) * ch,
    ...p,
  }));

  const areaPath = pts.length > 1
    ? `M${pts[0].x},${pt.top + ch} L${pts.map((p) => `${p.x},${p.y}`).join(" L")} L${pts[pts.length - 1].x},${pt.top + ch} Z`
    : "";

  const linePath = pts.length > 1
    ? `M${pts.map((p) => `${p.x},${p.y}`).join(" L")}`
    : "";

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Compliance Completion Rate</h2>
          <p className={styles.subtitle}>Track how your task completion percentage changes over time.</p>
        </div>
        <div className={styles.timeToggle}>
          <span className={`${styles.timeBtn} ${timeRange === "30d" ? styles.timeActive : ""}`} onClick={() => { setTimeRange("30d"); setHovered(null); }}>30 Days</span>
          <span className={`${styles.timeBtn} ${timeRange === "90d" ? styles.timeActive : ""}`} onClick={() => { setTimeRange("90d"); setHovered(null); }}>90 Days</span>
          <span className={`${styles.timeBtn} ${timeRange === "12m" ? styles.timeActive : ""}`} onClick={() => { setTimeRange("12m"); setHovered(null); }}>12 Months</span>
        </div>
      </div>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>
            Current Score
            <span className={styles.kpiInfoWrap}>
              <Info className={styles.kpiInfoIcon} />
              <span className={styles.kpiTooltip}>Percentage of compliance tasks completed. Based on tasks marked as done vs total tasks in the selected period.</span>
            </span>
          </span>
          <span className={`${styles.kpiValue} ${hasRealData ? "" : styles.kpiEmpty}`}>
            {hasRealData ? `${current.score}%` : "—"}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>
            Period Change
            <span className={styles.kpiInfoWrap}>
              <Info className={styles.kpiInfoIcon} />
              <span className={styles.kpiTooltip}>How your completion rate changed compared to the previous period. Positive means improvement, negative means decline.</span>
            </span>
          </span>
          <span className={`${styles.kpiValue} ${periodChange > 0 ? styles.kpiUp : periodChange < 0 ? styles.kpiDown : ""}`}>
            {periodChange !== 0 ? (
              <>{periodChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {Math.abs(periodChange)}%</>
            ) : (
              <><Minus size={14} /> 0%</>
            )}
          </span>
        </div>
      </div>

      {hasRealData ? (
        <div className={styles.chartContainer}>
          <svg viewBox={`0 0 ${w} ${h}`} className={styles.chartSvg}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-role-light-primary)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="var(--color-role-light-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = pt.top + ch - ratio * ch;
              return (
                <g key={ratio}>
                  <line x1={pt.left} y1={y} x2={w - pt.right} y2={y} stroke="var(--color-role-light-outlineVariant)" strokeWidth="0.5" />
                  <text x={pt.left - 6} y={y + 3} textAnchor="end" fill="var(--color-role-light-onSurfaceVariant)" fontSize="9" fontFamily="var(--font-label-label-small-fontFamily)">
                    {Math.round(minScore + ratio * rng)}
                  </text>
                </g>
              );
            })}

            {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
            {linePath && <path d={linePath} fill="none" stroke="var(--color-role-light-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

            {pts.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hovered === i ? 5 : 3}
                  fill={hovered === i ? "var(--color-role-light-primary)" : "white"}
                  stroke="var(--color-role-light-primary)"
                  strokeWidth="2"
                  style={{ cursor: "pointer", transition: "r 0.15s" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                {hovered === i && (
                  <>
                    <line x1={p.x} y1={pt.top} x2={p.x} y2={pt.top + ch} stroke="var(--color-role-light-outlineVariant)" strokeWidth="1" strokeDasharray="4 3" />
                    <rect x={p.x - 12} y={p.y - 26} width={24} height={20} rx={5} className={styles.chartTooltip} strokeWidth={1} />
                    <text x={p.x} y={p.y - 13} textAnchor="middle" className={styles.chartTooltipText}>
                      {p.score}%
                    </text>
                  </>
                )}
              </g>
            ))}

            {pts.map((p, i) => (
              <text key={i} x={p.x} y={h - 5} textAnchor="middle" fill="var(--color-role-light-onSurfaceVariant)" fontSize="9" fontFamily="var(--font-label-label-small-fontFamily)">
                {p.label}
              </text>
            ))}
          </svg>
        </div>
      ) : (
        <div className={styles.noData}>
          <span className={styles.noDataIcon}>—</span>
          <p className={styles.noDataText}>No compliance data available yet. Start adding tasks to generate trends.</p>
        </div>
      )}

      {hasRealData && (
        <div className={styles.insightsPanel}>
          <h3 className={styles.insightsTitle}>Key Insights</h3>
          <p className={styles.insight}>
            {periodChange < 0
              ? `Completion rate declined ${Math.abs(periodChange)}% over the last period.`
              : periodChange > 0
              ? `Completion rate improved ${periodChange}% over the last period.`
              : `Completion rate remained stable over the last period.`}
            {overdueTasks > 0 && ` ${overdueTasks} overdue task${overdueTasks > 1 ? "s" : ""} are affecting the rate.`}
            {pendingTasks > 0 && ` Completing ${pendingTasks} pending task${pendingTasks > 1 ? "s" : ""} could improve your score.`}
          </p>

          <div className={styles.contributors}>
            <div className={styles.contribCol}>
              <h4 className={styles.contribLabel}>Positive</h4>
              {completedTasks > 0 && (
                <div className={styles.contribItem}>
                  <CheckCircle size={14} className={styles.posIcon} />
                  <span>{completedTasks} Task{completedTasks > 1 ? "s" : ""} Completed</span>
                </div>
              )}
              {docsUploaded > 0 && (
                <div className={styles.contribItem}>
                  <CheckCircle size={14} className={styles.posIcon} />
                  <span>{docsUploaded} Document{docsUploaded > 1 ? "s" : ""} Uploaded</span>
                </div>
              )}
              {completedTasks === 0 && docsUploaded === 0 && (
                <div className={styles.contribItem}>
                  <span className={styles.neutral}>No positive contributors yet</span>
                </div>
              )}
            </div>
            <div className={styles.contribCol}>
              <h4 className={styles.contribLabel}>Negative</h4>
              {overdueTasks > 0 && (
                <div className={styles.contribItem}>
                  <XCircle size={14} className={styles.negIcon} />
                  <span>{overdueTasks} Overdue Task{overdueTasks > 1 ? "s" : ""}</span>
                </div>
              )}
              {missedDeadlines > 0 && (
                <div className={styles.contribItem}>
                  <XCircle size={14} className={styles.negIcon} />
                  <span>{missedDeadlines} Missed Deadline{missedDeadlines > 1 ? "s" : ""}</span>
                </div>
              )}
              {overdueTasks === 0 && missedDeadlines === 0 && (
                <div className={styles.contribItem}>
                  <span className={styles.neutral}>No negative contributors</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

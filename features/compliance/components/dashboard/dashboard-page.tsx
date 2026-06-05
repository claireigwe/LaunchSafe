"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardList, Plus, AlertTriangle, Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "../../hooks/use-dashboard";
import { HealthScore } from "./health-score";
import { RegulatoryUpdates } from "./regulatory-updates";
import { BusinessOverview } from "./business-overview";
import { RecentActivity } from "./recent-activity";
import { QuickActions } from "./quick-actions";
import { SuggestedTasksWidget } from "../tasks/suggested-tasks-widget";
import { TaskCreateModal } from "../tasks/task-create-modal";
import { loadTasks, reconcileTaskStatuses, createTask } from "../../api/tasks-api";
import { getNotifications, markAsRead } from "@/features/notifications/api/notifications-api";
import { getDocuments, formatFileSize } from "@/features/documents/api/documents-api";
import { DOC_TYPE_LABELS } from "@/features/documents/types/documents.types";
import { getSubscription, getPlanPrice, getPlanAnnualTotal, formatCurrency } from "@/features/billing/api/billing-api";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import type { ComplianceTaskItem, CreateTaskInput } from "../../types/tasks.types";
import type { AppNotification } from "@/features/notifications/types/notifications.types";
import type { AppDocument } from "@/features/documents/types/documents.types";
import styles from "./dashboard-page.module.css";

export function DashboardPage() {
  const { data, loading } = useDashboard();
  const [savedTasks, setSavedTasks] = useState<ComplianceTaskItem[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [recentDocs, setRecentDocs] = useState<AppDocument[]>([]);
  const subscription = getSubscription();

  useEffect(() => {
    reconcileTaskStatuses();
    setSavedTasks(loadTasks());
    setNotifs(getNotifications().slice(0, 5));
    setRecentDocs(getDocuments().slice(0, 4));
  }, []);

  function handleNotifClick(n: AppNotification) {
    if (!n.isRead) {
      markAsRead(n.id);
      setNotifs(getNotifications().slice(0, 5));
    }
    if (n.actionUrl) window.location.href = n.actionUrl;
  }

  const upcoming = savedTasks
    .filter((t) => t.status !== "completed" && t.dueDate)
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
    .slice(0, 5);

  const overdue = savedTasks.filter((t) => t.status === "overdue");

  const healthScore = savedTasks.length > 0
    ? Math.round((savedTasks.filter((t) => t.status === "completed").length / savedTasks.length) * 100)
    : null;

  const computedScore = healthScore !== null
    ? {
        id: "computed",
        businessId: "onboarded",
        score: healthScore,
        breakdown: {
          completedTasks: savedTasks.filter((t) => t.status === "completed").length,
          totalTasks: savedTasks.length,
          overdueCount: overdue.length,
          missingEvidence: 0,
          expiredDocuments: 0,
        },
        calculatedAt: new Date().toISOString(),
      }
    : null;

  function handleCreateTask(input: CreateTaskInput) {
    createTask(input, "onboarded");
    trackEvent("Task Created", { title: input.title });
    setSavedTasks(loadTasks());
    setShowCreate(false);
  }

function OverdueCards({ items }: { items: ComplianceTaskItem[] }) {
  return (
    <div style={{ background: "var(--color-role-light-errorContainer)", border: "1px solid var(--color-palette-error-60)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid var(--color-palette-error-60)" }}>
        <AlertTriangle size={16} style={{ color: "var(--color-role-light-onErrorContainer)" }} />
        <h2 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onErrorContainer)", margin: 0, flex: 1 }}>Overdue Items</h2>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, background: "var(--color-role-light-error)", color: "var(--color-role-light-onError)", padding: "2px 10px", borderRadius: 12 }}>{items.length}</span>
      </div>
      {items.slice(0, 3).map((t) => (
        <Link key={t.id} href="/compliance" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", textDecoration: "none", color: "var(--color-role-light-onErrorContainer)", borderBottom: items.indexOf(t) < Math.min(items.length, 3) - 1 ? "1px solid var(--color-palette-error-60)" : "none" }}>
          <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 500 }}>{t.title}</span>
          <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--color-role-light-error)", color: "var(--color-role-light-onError)" }}>Overdue</span>
        </Link>
      ))}
      <Link href="/compliance" style={{ display: "block", padding: "10px 20px", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 500, color: "var(--color-role-light-onErrorContainer)", textAlign: "center", textDecoration: "none", borderTop: "1px solid var(--color-palette-error-60)" }}>View All Overdue Tasks</Link>
    </div>
  );
}

function UpcomingSection({ items }: { items: ComplianceTaskItem[] }) {
  return (
    <div style={{ background: "var(--color-role-light-surfaceContainerLowest)", border: "1px solid var(--color-role-light-outlineVariant)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid var(--color-role-light-outlineVariant)" }}>
        <ClipboardList size={16} style={{ color: "var(--color-role-light-primary)" }} />
        <h2 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0, flex: 1 }}>Upcoming Deadlines</h2>
        <Link href="/compliance" style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 500, color: "var(--color-role-light-primary)", textDecoration: "none" }}>View All</Link>
      </div>
      {items.map((t) => {
        const days = t.dueDate ? Math.ceil((new Date(t.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        return (
          <Link key={t.id} href="/compliance" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", textDecoration: "none", borderBottom: items.indexOf(t) < items.length - 1 ? "1px solid var(--color-role-light-outlineVariant)" : "none" }}>
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 500, color: "var(--color-role-light-onSurface)" }}>{t.title}</span>
            <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, color: days !== null && days <= 3 ? "var(--color-role-light-error)" : "var(--color-role-light-onSurfaceVariant)" }}>
              {days === 0 ? "Due today" : days === 1 ? "1 day left" : days !== null && days > 0 ? `${days} days left` : ""}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function TasksSection({ tasks, onAddTask }: { tasks: ComplianceTaskItem[]; onAddTask: () => void }) {
  return (
    <div style={{ background: "var(--color-role-light-surfaceContainerLowest)", border: "1px solid var(--color-role-light-outlineVariant)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--color-role-light-outlineVariant)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ClipboardList size={16} style={{ color: "var(--color-role-light-primary)" }} />
          <h2 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>Recent Tasks</h2>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button variant="primary" size="sm" onClick={onAddTask}><Plus size={14} /> New Task</Button>
        </div>
      </div>
      {tasks.slice(0, 5).map((t) => (
        <Link key={t.id} href="/compliance" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", textDecoration: "none", borderBottom: tasks.indexOf(t) < Math.min(tasks.length, 5) - 1 ? "1px solid var(--color-role-light-outlineVariant)" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.priority === "critical" || t.priority === "high" ? "var(--color-role-light-error)" : t.priority === "medium" ? "var(--color-key-warning)" : "var(--color-key-neutral)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 500, color: "var(--color-role-light-onSurface)" }}>{t.title}</span>
          </div>
          <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6, background: t.status === "overdue" ? "var(--color-role-light-errorContainer)" : "var(--color-role-light-surfaceContainer)", color: t.status === "overdue" ? "var(--color-role-light-onErrorContainer)" : "var(--color-role-light-onSurfaceVariant)" }}>{t.status.replace("_", " ")}</span>
        </Link>
      ))}
      {tasks.length > 5 && (
        <Link href="/compliance" style={{ display: "block", padding: "10px 20px", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 500, color: "var(--color-role-light-primary)", textAlign: "center", textDecoration: "none", borderTop: "1px solid var(--color-role-light-outlineVariant)" }}>View All Tasks</Link>
      )}
    </div>
  );
}

function NotificationsSection({ notifications, onClick }: { notifications: AppNotification[]; onClick: (n: AppNotification) => void }) {
  if (notifications.length === 0) return null;
  return (
    <div style={{ background: "var(--color-role-light-surfaceContainerLowest)", border: "1px solid var(--color-role-light-outlineVariant)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid var(--color-role-light-outlineVariant)" }}>
        <Bell size={16} style={{ color: "var(--color-role-light-primary)" }} />
        <h2 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0, flex: 1 }}>Recent Notifications</h2>
        <Link href="/notifications" style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 500, color: "var(--color-role-light-primary)", textDecoration: "none" }}>View All</Link>
      </div>
      {notifications.slice(0, 3).map((n) => (
        <button key={n.id} type="button" onClick={() => onClick(n)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", border: "none", background: n.isRead ? "none" : "var(--color-role-light-primaryContainer)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", width: "100%", borderBottom: notifications.indexOf(n) < Math.min(notifications.length, 3) - 1 ? "1px solid var(--color-role-light-outlineVariant)" : "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: n.priority === "critical" ? "var(--color-role-light-error)" : n.priority === "warning" ? "var(--color-key-warning)" : "var(--color-role-light-primary)", marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: n.isRead ? 500 : 700, color: "var(--color-role-light-onSurface)" }}>{n.title}</span>
            <span style={{ display: "block", fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function SubscriptionStatus({ sub }: { sub: any }) {
  return (
    <div style={{ background: "var(--color-role-light-surfaceContainerLowest)", border: "1px solid var(--color-role-light-outlineVariant)", borderRadius: 20, padding: 20 }}>
      <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 12px" }}>Subscription</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)" }}>Plan</span>
        <span style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-onSurface)" }}>{sub.planName}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)" }}>Status</span>
        <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "var(--color-role-light-successContainer)", color: "var(--color-role-light-onSuccessContainer)" }}>{sub.status}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)" }}>Next Renewal</span>
        <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)" }}>{sub.nextRenewal ? new Date(sub.nextRenewal).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
      </div>
      <Link href="/settings/billing" style={{ display: "block", textAlign: "center", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 500, color: "var(--color-role-light-primary)", textDecoration: "none", padding: "8px 0" }}>Manage Billing</Link>
    </div>
  );
}

function DocumentsSection({ docs }: { docs: AppDocument[] }) {
  return (
    <div style={{ background: "var(--color-role-light-surfaceContainerLowest)", border: "1px solid var(--color-role-light-outlineVariant)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid var(--color-role-light-outlineVariant)" }}>
        <FileText size={16} style={{ color: "var(--color-role-light-primary)" }} />
        <h2 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0, flex: 1 }}>Recent Documents</h2>
        <Link href="/documents" style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 500, color: "var(--color-role-light-primary)", textDecoration: "none" }}>View All</Link>
      </div>
      {docs.map((d) => (
        <Link key={d.id} href="/documents" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", textDecoration: "none", borderBottom: docs.indexOf(d) < docs.length - 1 ? "1px solid var(--color-role-light-outlineVariant)" : "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--color-role-light-primaryContainer)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-role-light-primary)", flexShrink: 0 }}><FileText size={16} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 500, color: "var(--color-role-light-onSurface)" }}>{d.title}</span>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)" }}>{DOC_TYPE_LABELS[d.docType]}</span>
          </div>
          <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)" }}>{formatFileSize(d.fileSize)}</span>
        </Link>
      ))}
    </div>
  );
}

function EmptyTasks({ onAddTask }: { onAddTask: () => void }) {
  return (
    <div style={{ background: "var(--color-role-light-surfaceContainerLowest)", border: "1px solid var(--color-role-light-outlineVariant)", borderRadius: 20, padding: "40px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 12px" }}>You do not have any compliance tasks yet.</p>
      <Button variant="primary" size="sm" onClick={onAddTask}>Create Your First Task</Button>
    </div>
  );
}

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Your compliance workspace at a glance.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.primary}>
          <HealthScore score={computedScore} />
          {overdue.length > 0 && <OverdueCards items={overdue} />}
          <SuggestedTasksWidget />
          {upcoming.length > 0 && <UpcomingSection items={upcoming} />}
          <NotificationsSection notifications={notifs} onClick={handleNotifClick} />
          {recentDocs.length > 0 && <DocumentsSection docs={recentDocs} />}
          {savedTasks.length > 0 ? <TasksSection tasks={savedTasks} onAddTask={() => setShowCreate(true)} /> : <EmptyTasks onAddTask={() => setShowCreate(true)} />}
          <RegulatoryUpdates updates={data.regulatoryUpdates} />
        </section>
        <aside className={styles.secondary}>
          <QuickActions onAddTask={() => setShowCreate(true)} />
          {subscription && <SubscriptionStatus sub={subscription} />}
          <BusinessOverview business={data.business} />
          <RecentActivity activities={data.recentActivity} />
        </aside>
      </div>

      {showCreate && <TaskCreateModal onSave={handleCreateTask} onClose={() => setShowCreate(false)} />}
    </div>
  );
}

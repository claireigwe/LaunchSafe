"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardList, Plus, AlertTriangle, FileText, BarChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "../../hooks/use-dashboard";
import { useDashboardData } from "../../hooks/use-dashboard-data";
import { useHasBusiness } from "@/features/businesses/hooks/use-has-business";
import { BusinessRequiredOverlay } from "@/features/businesses/components/business-required-overlay";
import { PastReportsWidget } from "@/features/assessments/components/past-reports-widget";
import { HealthScore } from "./health-score";
import { RegulatoryUpdates } from "./regulatory-updates";
import { BusinessOverview } from "./business-overview";
import { RecentActivity } from "./recent-activity";
import { QuickActions } from "./quick-actions";
import { SuggestedTasksWidget } from "../tasks/suggested-tasks-widget";
import { TaskCreateModal } from "../tasks/task-create-modal";
import { DocumentUploadModal } from "@/features/documents/components/document-upload-modal";
import { loadTasks, reconcileTaskStatuses, createTask } from "../../api/tasks-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
import { formatFileSize, type UploadDocumentInput } from "@/features/documents/api/documents-api";
import { DOC_TYPE_LABELS } from "@/features/documents/types/documents.types";
import { formatCurrency } from "@/features/billing/api/billing-api";
import { canAccess, getCurrentPlanId } from "@/features/billing/api/feature-access";
import { SetupOverlay } from "@/features/billing/components/setup-overlay";
import { isInSetupMode } from "@/features/billing/api/setup-check";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import type { ComplianceTaskItem, CreateTaskInput } from "../../types/tasks.types";
import type { AppDocument } from "@/features/documents/types/documents.types";
import type { RegulatoryUpdate } from "@/types/domain/regulatory";
import { useDocuments, useUploadDocument } from "@/features/documents/hooks/use-documents-query";
import styles from "./dashboard-page.module.css";

export function DashboardPage() {
  const { data, loading, businessCount } = useDashboard();
  const { data: dashData } = useDashboardData();
  const [savedTasks, setSavedTasks] = useState<ComplianceTaskItem[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showUploadDoc, setShowUploadDoc] = useState(false);
  const hasBusiness = useHasBusiness();
  const { data: uploadedDocs = [] } = useDocuments();
  const uploadMutation = useUploadDocument();
  const recentDocs = uploadedDocs.slice(0, 4);
  const [setupMsg, setSetupMsg] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    if (params.get("subscription") === "success" && reference) {
      window.history.replaceState({}, "", "/dashboard");

      // Verify payment and create pending business
      const pendingRaw = localStorage.getItem("launchsafe-pending-business");
      if (!pendingRaw) return;

      localStorage.removeItem("launchsafe-pending-business");
      setSetupMsg("Completing your setup...");

      fetch("/api/billing/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      })
      .then(res => res.json())
      .then(async (json) => {
        if (json.success) {
          try {
            const pending = JSON.parse(pendingRaw);
            const { addBusiness } = await import("@/features/businesses/api/onboarding-api");
            const biz = await addBusiness(pending);
            if (biz?.id) {
              localStorage.setItem("launchsafe-active-business", biz.id);
            }
          } catch {}
        }
        window.location.reload();
      })
      .catch(() => window.location.reload());
    }
  }, []);

  useEffect(() => {
    if (savedTasks.length === 0) return;
    setAiInsightLoading(true);
    setAiInsightError(null);

    const completedCount = savedTasks.filter(t => t.status === "completed").length;
    const overdueTasks = savedTasks.filter(t => t.status === "overdue");
    const pendingTasks = savedTasks.filter(t => t.status !== "completed" && t.status !== "overdue");
    const industry = data?.business?.industryId || "";

    let details = `I run a business in the ${industry} industry. I have ${savedTasks.length} compliance task(s): ${completedCount} completed, ${overdueTasks.length} overdue, ${pendingTasks.length} pending.`;
    if (overdueTasks.length > 0) {
      details += ` Overdue tasks: ${overdueTasks.map(t => t.title).join(", ")}.`;
    }
    if (pendingTasks.length > 0) {
      details += ` Pending tasks: ${pendingTasks.map(t => t.title).join(", ")}.`;
    }

    fetch("/api/ai/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `Based on this compliance status, give me one brief, actionable insight or observation: ${details}`,
      }),
    })
    .then(res => res.json())
    .then(json => {
      if (json.success && json.data?.content) {
        const cleaned = json.data.content.replace(/\*\*/g, "").replace(/\*/g, "");
        setAiInsight(cleaned);
      } else {
        setAiInsightError(json.error?.message || "AI insight unavailable");
      }
    })
    .catch(() => setAiInsightError("Failed to get AI insight"))
    .finally(() => setAiInsightLoading(false));
  }, [savedTasks]);

  async function refreshDashboard() {
    await reconcileTaskStatuses();
    setSavedTasks(loadTasks());
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  const [computedScore, setComputedScore] = useState<any>(null);

  useEffect(() => {
    const bid = getActiveBusinessId() || data.business?.id;
    if (!bid) return;

    const formatScore = (d: any) => ({
      id: d.id,
      businessId: d.businessId,
      score: d.score,
      breakdown: d.breakdown,
      previousScore: d.previousScore,
      calculatedAt: d.calculatedAt,
    });

    // Always recalculate score to reflect current task state
    fetch("/api/compliance/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: bid }),
    })
    .then(r => r.json())
    .then(json => {
      if (json.success && json.data) setComputedScore(formatScore(json.data));
    })
    .catch((err) => console.error("[Dashboard] Score fetch failed:", err));
  }, [data.business]);

  const upcoming = savedTasks
    .filter((t) => t.status !== "completed" && t.dueDate)
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
    .slice(0, 5);

  const overdue = savedTasks.filter((t) => t.status === "overdue");

  async function handleCreateTask(input: CreateTaskInput) {
    await createTask(input, getActiveBusinessId() || undefined);
    trackEvent("Task Created", { title: input.title });
    setSavedTasks(loadTasks());
    setShowCreate(false);
  }

  function handleUploadDocument(input: UploadDocumentInput) {
    uploadMutation.mutate(input, {
      onSuccess: () => {
        trackEvent("Document Uploaded", { title: input.title });
        setShowUploadDoc(false);
      }
    });
  }

function OverdueCards({ items }: { items: ComplianceTaskItem[] }) {
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

function UpcomingSection({ items }: { items: ComplianceTaskItem[] }) {
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

function TasksSection({ tasks, onAddTask }: { tasks: ComplianceTaskItem[]; onAddTask: () => void }) {
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

function SubscriptionStatus({ sub }: { sub: any }) {
  return (
    <div className={styles.card} style={{ padding: 24 }}>
      <h3 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 18, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 20px" }}>Subscription</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)" }}>Plan</span>
        <span style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)" }}>{sub.planName}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)" }}>Status</span>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 8, background: "var(--color-role-light-successContainer)", color: "var(--color-role-light-onSuccessContainer)" }}>{sub.status}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <span style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)" }}>Next Renewal</span>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 500, color: "var(--color-role-light-onSurface)" }}>{sub.nextRenewal ? new Date(sub.nextRenewal).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
      </div>
      <Button variant="outline" fullWidth style={{ borderRadius: 12 }}>Manage Billing</Button>
    </div>
  );
}

function DocumentsSection({ docs }: { docs: AppDocument[] }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <FileText size={20} className={styles.cardHeaderIcon} />
        <h2 className={styles.cardHeaderTitle}>Recent Documents</h2>
        <Link href="/documents" className={styles.cardAction}>View All</Link>
      </div>
      {docs.map((d) => (
        <Link key={d.id} href="/documents" className={styles.cardItem} style={{ gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-role-light-primaryContainer)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-role-light-primary)", flexShrink: 0 }}><FileText size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 15, fontWeight: 500, color: "var(--color-role-light-onSurface)", marginBottom: 4 }}>{d.title}</span>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)" }}>{DOC_TYPE_LABELS[d.docType]}</span>
          </div>
          <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)", fontWeight: 500 }}>{formatFileSize(d.fileSize)}</span>
        </Link>
      ))}
    </div>
  );
}

function ReportsPreview() {
  const planId = getCurrentPlanId();
  if (!planId) return null;
  const tasks = loadTasks();
  const completed = tasks.filter((t) => t.status === "completed").length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;
  const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  return (
    <Link href="/reports" style={{ display: "block", textDecoration: "none" }}>
      <div style={{ background: "linear-gradient(135deg, var(--color-role-light-primaryContainer), var(--color-role-light-surfaceContainerLowest))", border: "1px solid var(--color-role-light-primary)", borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-role-light-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
          <BarChart size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-onPrimaryContainer)", margin: "0 0 2px" }}>Advanced Reporting</h3>
          <p style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, color: "var(--color-role-light-onPrimaryContainer)", margin: 0, opacity: 0.8 }}>
            {rate}% completion · {overdue} overdue · {tasks.length} total tasks
          </p>
        </div>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-primary)", whiteSpace: "nowrap" }}>View Reports →</span>
      </div>
    </Link>
  );
}

function EmptyTasks({ onAddTask }: { onAddTask: () => void }) {
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

  if (setupMsg) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton} style={{ width: 280, height: 28, margin: "28px 0 8px" }} />
        <div className={styles.skeleton} style={{ width: 200, height: 16, marginBottom: 28 }} />
        <div className={styles.grid}>
          <section className={styles.primary}>
            <div className={styles.card} style={{ padding: 24 }}><div className={styles.skeleton} style={{ width: 160, height: 20, marginBottom: 20 }} /><div className={styles.skeleton} style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px" }} /><div className={styles.skeleton} style={{ width: "70%", height: 14, margin: "0 auto" }} /></div>
            <div className={styles.card} style={{ padding: 24 }}><div className={styles.skeleton} style={{ width: 140, height: 20, marginBottom: 16 }} /><div className={styles.skeleton} style={{ width: "100%", height: 14, marginBottom: 8 }} /><div className={styles.skeleton} style={{ width: "80%", height: 14 }} /></div>
          </section>
          <aside className={styles.secondary}>
            <div className={styles.card} style={{ padding: 24 }}><div className={styles.skeleton} style={{ width: 100, height: 20, marginBottom: 16 }} /><div className={styles.skeleton} style={{ width: "100%", height: 36 }} /></div>
          </aside>
        </div>
      </div>
    );
  }

  const pageContent = (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {data.userProfile?.fullName || data.business?.name || "Founder"}</h1>
          <p className={styles.subtitle}>Here is your compliance overview for today.</p>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.primary}>
          <HealthScore score={computedScore} />
          {overdue.length > 0 && <OverdueCards items={overdue} />}
          <SuggestedTasksWidget onTaskAdded={() => setSavedTasks(loadTasks())} />
          {upcoming.length > 0 && <UpcomingSection items={upcoming} />}
          {recentDocs.length > 0 && <DocumentsSection docs={recentDocs} />}
          {savedTasks.length > 0 ? (
            <TasksSection tasks={savedTasks} onAddTask={() => hasBusiness === true && setShowCreate(true)} />
          ) : (
            <EmptyTasks onAddTask={() => hasBusiness === true && setShowCreate(true)} />
          )}
          <ReportsPreview />
          <RegulatoryUpdates updates={dashData?.regulatoryUpdates || []} />
        </section>
        <aside className={styles.secondary}>
          <QuickActions onAddTask={() => hasBusiness === true && setShowCreate(true)} onUploadDocument={() => hasBusiness === true && setShowUploadDoc(true)} />
          {aiInsight && (
            <div className={styles.aiInsightCard}>
              <div className={styles.aiInsightHeader}>
                <Sparkles size={14} />
                <span>AI Insight</span>
              </div>
              <p className={styles.aiInsightText}>{aiInsight}</p>
            </div>
          )}
          {aiInsightLoading && (
            <div className={styles.aiInsightCard}>
              <p className={styles.aiInsightText} style={{ opacity: 0.5 }}>Loading insight...</p>
            </div>
          )}
          {aiInsightError && !aiInsightLoading && (
            <div className={styles.aiInsightCard}>
              <p className={styles.aiInsightText} style={{ color: "var(--color-role-light-onSurfaceVariant)", fontSize: 12 }}>{aiInsightError}</p>
            </div>
          )}
          <PastReportsWidget />
          {dashData?.subscription && <SubscriptionStatus sub={dashData.subscription} />}
          <BusinessOverview business={data.business} businessCount={businessCount} />
          <RecentActivity activities={dashData?.recentActivity || []} />
        </aside>
      </div>

      {showCreate && <TaskCreateModal onSave={handleCreateTask} onClose={() => setShowCreate(false)} />}
      {showUploadDoc && <DocumentUploadModal onSave={handleUploadDocument} onClose={() => setShowUploadDoc(false)} />}
    </div>
  );

  return (
    <BusinessRequiredOverlay hasBusiness={hasBusiness}>
      {hasBusiness === false ? pageContent : <SetupOverlay>{pageContent}</SetupOverlay>}
    </BusinessRequiredOverlay>
  );
}

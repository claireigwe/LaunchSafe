"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
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
import { OverdueCards } from "./overdue-cards";
import { UpcomingSection } from "./upcoming-section";
import { TasksSection } from "./tasks-section";
import { DocumentsSection } from "./documents-section";
import { ReportsPreview } from "./reports-preview";
import { EmptyTasks } from "./empty-tasks";
import { SubscriptionStatus } from "./subscription-status";
import { SuggestedTasksWidget } from "../tasks/suggested-tasks-widget";
import { TaskCreateModal } from "../tasks/task-create-modal";
import { DocumentUploadModal } from "@/features/documents/components/document-upload-modal";
import { useTasks } from "../../hooks/use-tasks-query";
import { createTask } from "../../api/tasks-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
import { type UploadDocumentInput } from "@/features/documents/api/documents-api";

import { SetupOverlay } from "@/features/billing/components/setup-overlay";
import { trackEvent } from "@/lib/analytics/track";
import type { CreateTaskInput } from "../../types/tasks.types";
import { useDocuments, useUploadDocument } from "@/features/documents/hooks/use-documents-query";
import styles from "./dashboard-page.module.css";

export function DashboardPage() {
  const { data, loading, businessCount } = useDashboard();
  const { data: dashData } = useDashboardData();
  const { data: savedTasks = [] } = useTasks();
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
          <SuggestedTasksWidget />
          {upcoming.length > 0 && <UpcomingSection items={upcoming} />}
          {recentDocs.length > 0 && <DocumentsSection docs={recentDocs} />}
          {savedTasks.length > 0 ? (
            <TasksSection tasks={savedTasks} onAddTask={() => hasBusiness === true && setShowCreate(true)} />
          ) : (
            <EmptyTasks onAddTask={() => hasBusiness === true && setShowCreate(true)} />
          )}
          <ReportsPreview savedTasks={savedTasks} />
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

import { createAdminClient } from "@/lib/supabase/server";

export interface ScoreBreakdown {
  completedTasks: number;
  totalTasks: number;
  overdueCount: number;
  missingEvidence: number;
  expiredDocuments: number;
  upcomingDeadlineCount: number;
}

export interface ScoreCalculationResult {
  score: number;
  breakdown: ScoreBreakdown;
  previousScore: number | null;
}

export async function calculateComplianceScore(businessId: string): Promise<ScoreCalculationResult> {
  const supabase = createAdminClient() as any;

  const { data: tasks, error: tasksError, count: tasksCount } = await supabase
    .from("compliance_tasks")
    .select("*", { count: "exact" })
    .eq("business_id", businessId);

  console.log("[LaunchSafe] Score calc: tasks query result", {
    businessId,
    count: (tasks || []).length,
    error: tasksError?.message,
  });

  if (tasksError) {
    throw new Error("Failed to fetch compliance tasks for score calculation");
  }

  const { data: evidence, error: evidenceError } = await supabase
    .from("evidence")
    .select("compliance_task_id")
    .eq("business_id", businessId);

  if (evidenceError) {
    throw new Error("Failed to fetch evidence for score calculation");
  }

  const { data: documents, error: docsError } = await supabase
    .from("compliance_documents")
    .select("id")
    .eq("business_id", businessId);

  if (docsError) {
    throw new Error("Failed to fetch documents for score calculation");
  }

  const { data: previousScores } = await supabase
    .from("compliance_scores")
    .select("score")
    .eq("business_id", businessId)
    .order("calculated_at", { ascending: false })
    .limit(1);

  const allTasks = tasks || [];
  const allEvidence = evidence || [];
  const allDocuments = documents || [];

  const evidenceTaskIds = new Set(allEvidence.map((e: any) => e.compliance_task_id).filter(Boolean));

  if (allTasks.length === 0) {
    return {
      score: 0,
      breakdown: { completedTasks: 0, totalTasks: 0, overdueCount: 0, missingEvidence: 0, expiredDocuments: 0, upcomingDeadlineCount: 0 },
      previousScore: previousScores?.[0]?.score ?? null,
    };
  }

  const now = Date.now();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

  let completedTasks = 0;
  let overdueCount = 0;
  let missingEvidence = 0;
  let upcomingDeadlineCount = 0;

  for (const task of allTasks) {
    const isCompleted = task.status === "completed";
    const hasEvidence = evidenceTaskIds.has(task.id);

    let isOverdue = task.status === "overdue";
    if (!isCompleted && task.due_date) {
      const dueDate = new Date(task.due_date).getTime();
      if (dueDate < now) {
        isOverdue = true;
      }
    }

    if (isCompleted) {
      completedTasks++;
      if (!hasEvidence) {
        missingEvidence++;
      }
    } else if (isOverdue) {
      overdueCount++;
    } else if (task.due_date) {
      const dueDate = new Date(task.due_date).getTime();
      const diff = dueDate - now;
      if (diff >= 0 && diff <= SEVEN_DAYS) {
        upcomingDeadlineCount++;
      }
    }
  }

  const expiredDocuments = 0;

  const completionRatio = completedTasks / allTasks.length;
  let score = Math.round(completionRatio * 70);

  score -= overdueCount * 10;
  score -= missingEvidence * 5;
  score -= expiredDocuments * 5;
  score -= upcomingDeadlineCount * 3;

  const tasksDueToday = allTasks.filter((t: any) => {
    if (t.status === "completed") return false;
    if (!t.due_date) return false;
    const due = new Date(t.due_date);
    const today = new Date();
    return due.getFullYear() === today.getFullYear() &&
           due.getMonth() === today.getMonth() &&
           due.getDate() === today.getDate();
  }).length;

  score -= tasksDueToday * 2;

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    breakdown: {
      completedTasks,
      totalTasks: allTasks.length,
      overdueCount,
      missingEvidence,
      expiredDocuments,
      upcomingDeadlineCount,
    },
    previousScore: previousScores?.[0]?.score ?? null,
  };
}

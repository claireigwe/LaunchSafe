import { createAdminClient } from "@/lib/supabase/server";

export interface ScoreBreakdown {
  completedTasks: number;
  totalTasks: number;
  overdueCount: number;
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

  const { data: previousScores } = await supabase
    .from("compliance_scores")
    .select("score")
    .eq("business_id", businessId)
    .order("calculated_at", { ascending: false })
    .limit(1);

  const allTasks = tasks || [];

  if (allTasks.length === 0) {
    return {
      score: 0,
      breakdown: { completedTasks: 0, totalTasks: 0, overdueCount: 0, upcomingDeadlineCount: 0 },
      previousScore: previousScores?.[0]?.score ?? null,
    };
  }

  const now = Date.now();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

  let completedTasks = 0;
  let overdueCount = 0;
  let upcomingDeadlineCount = 0;

  for (const task of allTasks) {
    const isCompleted = task.status === "completed";

    let isOverdue = task.status === "overdue";
    if (!isCompleted && task.due_date) {
      const dueDate = new Date(task.due_date).getTime();
      if (dueDate < now) {
        isOverdue = true;
      }
    }

    if (isCompleted) {
      completedTasks++;
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

  const completionRatio = completedTasks / allTasks.length;
  let score = Math.round(completionRatio * 70);

  score -= overdueCount * 10;
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
      upcomingDeadlineCount,
    },
    previousScore: previousScores?.[0]?.score ?? null,
  };
}

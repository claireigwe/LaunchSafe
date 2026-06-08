import { createAdminClient } from "@/lib/supabase/server";

export interface ScoreBreakdown {
  completedTasks: number;
  totalTasks: number;
  overdueCount: number;
  missingEvidence: number;
  expiredDocuments: number;
}

export interface ScoreCalculationResult {
  score: number;
  breakdown: ScoreBreakdown;
}

export async function calculateComplianceScore(userId: string, businessId: string): Promise<ScoreCalculationResult> {
  const supabase = createAdminClient() as any;

  // 1. Fetch all tasks for the business
  const { data: tasks, error: tasksError } = await supabase
    .from("compliance_tasks")
    .select("*")
    .eq("business_id", businessId);

  if (tasksError) {
    throw new Error("Failed to fetch compliance tasks for score calculation");
  }

  // 2. Fetch all evidence to check for missing evidence on completed tasks
  const { data: evidence, error: evidenceError } = await supabase
    .from("evidence")
    .select("compliance_task_id")
    .eq("business_id", businessId);

  if (evidenceError) {
    throw new Error("Failed to fetch evidence for score calculation");
  }

  const allTasks = tasks || [];
  const allEvidence = evidence || [];
  
  const evidenceTaskIds = new Set(allEvidence.map((e: any) => e.compliance_task_id).filter(Boolean));

  let score = 100;
  let completedTasks = 0;
  let overdueCount = 0;
  let missingEvidence = 0;

  if (allTasks.length === 0) {
    return {
      score: 0,
      breakdown: { completedTasks: 0, totalTasks: 0, overdueCount: 0, missingEvidence: 0, expiredDocuments: 0 },
    };
  }

  const now = new Date().getTime();

  for (const task of allTasks) {
    const isCompleted = task.status === "completed";
    const hasEvidence = evidenceTaskIds.has(task.id);
    
    // Check if truly overdue
    let isOverdue = task.status === "overdue";
    if (!isCompleted && task.due_date) {
      const dueDate = new Date(task.due_date).getTime();
      if (dueDate < now) {
        isOverdue = true;
      }
    }

    if (isCompleted) {
      completedTasks++;
      // If completed but no evidence, apply a small penalty
      if (!hasEvidence) {
        missingEvidence++;
        score -= 5;
      }
    } else {
      // Incomplete tasks
      if (isOverdue) {
        overdueCount++;
        score -= 10;
      } else {
        // Pending task deduction based on priority (if field exists, assuming it doesn't from schema, but let's deduct generic amount)
        // Deduct 2 points for incomplete tasks that are not overdue yet.
        score -= 2;
      }
    }
  }

  // Calculate base ratio for reward
  const completionRatio = completedTasks / allTasks.length;
  // Let's blend a perfect 100 with the ratio, then subtract penalties
  // E.g. if you have 10 tasks, 0 completed, you start at 0? 
  // Wait, if base score is 100, then incomplete tasks deduct points.
  // If we have 1 task and it is pending, score = 100 - 2 = 98. This is fine.
  
  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));

  // Note: We'll calculate expired documents in the future if document expiry is tracked.
  const expiredDocuments = 0;

  return {
    score: Math.round(score),
    breakdown: {
      completedTasks,
      totalTasks: allTasks.length,
      overdueCount,
      missingEvidence,
      expiredDocuments,
    },
  };
}

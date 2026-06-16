import { createAdminClient } from "@/lib/supabase/server";

export interface DueTask {
  id: string;
  requirement_name: string;
  due_date: string;
  status: string;
  business_id: string;
  user_id: string;
}

export interface ReminderAction {
  taskId: string;
  userId: string;
  businessId: string;
  taskName: string;
  dueDate: string;
  diffDays: number;
  type: "deadline_approaching" | "deadline_due_soon" | "task_overdue";
  typeLabel: string;
}

/**
 * Fetches all non-completed tasks with a due date that belong to a user via their business.
 */
export async function fetchDueTasks(): Promise<DueTask[]> {
  const supabase = createAdminClient();
  const { data, error } = await (supabase as any)
    .from("compliance_tasks")
    .select(`id, requirement_name, due_date, status, business_id, businesses ( user_id )`)
    .neq("status", "completed")
    .not("due_date", "is", null);

  if (error) throw error;

  return ((data || []) as any[]).map((t: any) => ({
    id: t.id,
    requirement_name: t.requirement_name,
    due_date: t.due_date,
    status: t.status,
    business_id: t.business_id,
    user_id: t.businesses?.user_id,
  })).filter((t: DueTask) => t.user_id);
}

/**
 * Builds a set of already-sent notification signatures to avoid duplicates.
 * Key format: `${userId}_${taskId}_${typeLabel}`
 */
export async function buildSentMap(): Promise<Set<string>> {
  const supabase = createAdminClient();
  const { data: recentNotifs } = await (supabase as any)
    .from("notifications")
    .select("id, user_id, metadata")
    .in("type", ["deadline_reminder"]);

  const sentMap = new Set<string>();
  if (recentNotifs) {
    for (const n of recentNotifs) {
      if (n.metadata?.taskId) {
        sentMap.add(`${n.user_id}_${n.metadata.taskId}_${n.metadata.typeLabel}`);
      }
    }
  }
  return sentMap;
}

/**
 * Determines what reminder action (if any) is needed for a given task.
 * Returns null if no reminder should be sent.
 */
export function determineReminder(task: DueTask, today: Date): ReminderAction | null {
  const dueDate = new Date(task.due_date);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let notifType: ReminderAction["type"] | null = null;
  let typeLabel: string | null = null;

  if (diffDays === 7) {
    notifType = "deadline_approaching";
    typeLabel = "7_days";
  } else if (diffDays === 3) {
    notifType = "deadline_due_soon";
    typeLabel = "3_days";
  } else if (diffDays < 0) {
    notifType = "task_overdue";
    typeLabel = "overdue";
  }

  if (!notifType || !typeLabel) return null;

  return {
    taskId: task.id,
    userId: task.user_id,
    businessId: task.business_id,
    taskName: task.requirement_name,
    dueDate: task.due_date,
    diffDays,
    type: notifType,
    typeLabel,
  };
}

/**
 * Marks a task as overdue in the database if it isn't already.
 */
export async function markTaskOverdue(taskId: string): Promise<void> {
  const supabase = createAdminClient();
  await (supabase as any).from("compliance_tasks").update({ status: "overdue" }).eq("id", taskId);
}

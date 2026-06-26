import { createAdminClient } from "@/lib/supabase/server";

export async function verifyTaskOwnership(supabase: any, taskId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("compliance_tasks")
    .select("id, businesses!inner(user_id)")
    .eq("id", taskId)
    .eq("businesses.user_id", userId)
    .maybeSingle();
  return !!data;
}

export function computeStatus(dueDate: string | null): string {
  if (!dueDate) return "not_started";
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now ? "overdue" : "not_started";
}

export function mapTask(row: any): any {
  let notes = {};
  try { notes = row.notes ? JSON.parse(row.notes) : {}; } catch {}

  const notesObj = notes as any;

  return {
    id: row.id,
    businessId: row.business_id || "",
    title: row.requirement_name,
    description: row.agency_name || notesObj.description || "",
    dueDate: row.due_date || null,
    priority: notesObj.priority || "medium",
    status: row.status === "not_started" || row.status === "in_progress" || row.status === "awaiting_submission" || row.status === "submitted" || row.status === "approved" || row.status === "due_soon" ? "pending" : row.status,
    source: notesObj.source || "manual",
    suggestionReason: notesObj.suggestionReason || null,
    reminderDate: null,
    reminderEnabled: false,
    createdBy: "user",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

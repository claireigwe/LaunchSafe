import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    let query = (supabase as any)
      .from("compliance_tasks")
      .select("*");

    if (businessId) query = query.eq("business_id", businessId);

    if (businessId) query = query.eq("business_id", businessId);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    const tasks = (data || []).map(mapTask);

    return NextResponse.json<ApiResponse>({ success: true, data: tasks });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { id, title, description, dueDate, priority, businessId, source, suggestionReason } = body;

    if (!title || !businessId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Title and businessId are required" } },
        { status: 400 }
      );
    }

    console.log("[LaunchSafe] Task POST: creating task", { title, businessId, userId: user.id });

    const { data: biz } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!biz) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business not found or access denied" } },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("compliance_tasks")
      .insert({
        id: id || undefined,
        business_id: businessId,
        requirement_name: title,
        agency_name: description || "",
        status: computeStatus(dueDate),
        due_date: dueDate || null,
        notes: JSON.stringify({ description, priority, source: source || "manual", suggestionReason: suggestionReason || null }),
      })
      .select()
      .single();

    if (error) {
      console.error("[LaunchSafe] Task POST insert error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    console.log("[LaunchSafe] Task POST: success", { taskId: data.id, title: data.requirement_name });

    return NextResponse.json<ApiResponse>(
      { success: true, data: mapTask(data) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[LaunchSafe] Task POST catch:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

async function verifyTaskOwnership(supabase: any, taskId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("compliance_tasks")
    .select("id, businesses!inner(user_id)")
    .eq("id", taskId)
    .eq("businesses.user_id", userId)
    .maybeSingle();

  return !!data;
}

export async function PATCH(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { id, title, description, dueDate, priority, status, businessId } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "id is required" } },
        { status: 400 }
      );
    }

    if (!(await verifyTaskOwnership(supabase, id, user.id))) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Task not found" } },
        { status: 404 }
      );
    }

    const updates: any = {};
    if (title) updates.requirement_name = title;
    if (description !== undefined) updates.agency_name = description;
    if (dueDate !== undefined) updates.due_date = dueDate || null;
    if (status) updates.status = status === "pending" ? "not_started" : status;

    if (priority !== undefined || description !== undefined) {
      try {
        const { data: existing } = await supabase
          .from("compliance_tasks")
          .select("notes")
          .eq("id", id)
          .maybeSingle();
        let notes: any = {};
        if (existing?.notes) {
          try { notes = JSON.parse(existing.notes); } catch { notes = {}; }
        }
        if (priority !== undefined) notes.priority = priority;
        if (description !== undefined) notes.description = description;
        updates.notes = JSON.stringify(notes);
      } catch {
        // Notes merge failed — proceed with column updates only
      }
    }

    const { data, error } = await (supabase as any)
      .from("compliance_tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: mapTask(data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[LaunchSafe] PATCH error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { id, businessId } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "id is required" } },
        { status: 400 }
      );
    }

    if (!(await verifyTaskOwnership(supabase, id, user.id))) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Task not found" } },
        { status: 404 }
      );
    }

    let deleteQuery = (supabase as any).from("compliance_tasks").delete().eq("id", id);
    if (businessId) deleteQuery = deleteQuery.eq("business_id", businessId);
    await deleteQuery;

    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

function computeStatus(dueDate: string | null): string {
  if (!dueDate) return "not_started";
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now ? "overdue" : "not_started";
}

function mapTask(row: any): any {
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
    status: row.status === "not_started" ? "pending" : row.status,
    source: notesObj.source || "manual",
    suggestionReason: notesObj.suggestionReason || null,
    reminderDate: null,
    reminderEnabled: false,
    createdBy: "user",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

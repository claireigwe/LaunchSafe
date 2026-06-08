import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    let query = (supabase as any)
      .from("compliance_tasks")
      .select("*, businesses!inner(user_id)")
      .eq("businesses.user_id", user.id);

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
    const supabase = await createClient() as any;
    const body = await request.json();
    const { id, title, description, dueDate, priority, businessId } = body;

    if (!title || !businessId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Title and businessId are required" } },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from("compliance_tasks")
      .insert({
        id: id || undefined,
        user_id: user.id,
        business_id: businessId,
        requirement_name: title,
        agency_name: description || "",
        status: computeStatus(dueDate),
        due_date: dueDate || null,
        notes: JSON.stringify({ description, priority, source: "manual" }),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: mapTask(data) },
      { status: 201 }
    );
  } catch (error) {
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
    if (status) updates.status = status;

    let updateQuery = (supabase as any)
      .from("compliance_tasks")
      .update(updates)
      .eq("id", id);

    if (businessId) updateQuery = updateQuery.eq("business_id", businessId);

    const { data, error } = await updateQuery.select().single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: mapTask(data) });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
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
    description: notesObj.description || row.agency_name || "",
    dueDate: row.due_date || null,
    priority: notesObj.priority || "medium",
    status: row.status === "completed" ? "completed" : row.status === "overdue" ? "overdue" : row.status === "in_progress" ? "in_progress" : row.status === "not_started" ? "pending" : "pending",
    source: notesObj.source || "manual",
    suggestionReason: null,
    reminderDate: null,
    reminderEnabled: false,
    createdBy: "user",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

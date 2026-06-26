import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/features/notifications/services/notification-service";
import type { ApiResponse } from "@/types/api.types";

export async function GET(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const countOnly = searchParams.get("count") === "true";

    if (countOnly) {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      return NextResponse.json<ApiResponse>({ success: true, data: { unread: count || 0 } });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const notifications = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      businessId: row.business_id || "",
      title: row.title,
      message: row.message,
      type: row.type || "system",
      priority: "info",
      isRead: row.is_read,
      actionUrl: row.action_url || null,
      actionLabel: null,
      createdAt: row.created_at,
      readAt: row.read_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: notifications });
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
    const body = await request.json();
    const { title, message, type, actionUrl } = body;

    if (!title || !message) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Title and message are required" } },
        { status: 400 }
      );
    }

    const TYPE_MAP: Record<string, string> = {
      task: "deadline_reminder",
      deadline: "deadline_reminder",
      document: "regulatory_update",
      billing: "payment_success",
      system: "deadline_reminder",
      payment_success: "payment_success",
      payment_failed: "payment_failed",
      regulatory_update: "regulatory_update",
    };

    const data = await createNotification({
      userId: user.id,
      type: TYPE_MAP[type] || "deadline_reminder",
      title,
      message,
      actionUrl: actionUrl || undefined,
    });

    if (!data) throw new Error("Failed to create notification");

    return NextResponse.json<ApiResponse>({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("is_read", false);
    } else if (id) {
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user.id);
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
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
    const { id } = body;

    if (id) {
      await supabase.from("notifications").delete().eq("id", id).eq("user_id", user.id);
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

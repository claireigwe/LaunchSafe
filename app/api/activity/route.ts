import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

const TABLE = "notifications";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    const activity = (data || []).map((row: any) => ({
      id: row.id,
      type: mapType(row.type),
      title: row.title,
      description: row.message,
      timestamp: row.created_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: activity });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

function mapType(type: string): string {
  const map: Record<string, string> = {
    payment_success: "subscription_activated",
    compliance_overdue: "task_completed",
    deadline_reminder: "task_created",
    regulatory_update: "notification_triggered",
  };
  return map[type] || "notification_triggered";
}

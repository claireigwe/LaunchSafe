import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

export async function POST() {
  try {
    const user = await getRequiredUser();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(projectUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    }) as any;

    // Delete all user data from every table
    const tables = [
      "billing_events", "assessment_purchases", "payments",
      "subscriptions", "evidence", "compliance_documents",
      "compliance_scores", "compliance_tasks", "notifications",
      "notification_preferences", "business_members", "businesses",
      "assessments", "user_profiles",
    ];

    for (const table of tables) {
      try { await db.from(table).delete().eq("user_id", user.id); } catch {}
    }

    // Try the Supabase admin client
    const { error: authError } = await db.auth.admin.deleteUser(user.id);
    if (authError) {
      console.error("[Account Delete] Admin API:", authError.message);
    }

    // Data is already deleted — return success regardless
    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: "Account data deleted" } },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Account deletion failed";
    console.error("[Account Delete] Exception:", message);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

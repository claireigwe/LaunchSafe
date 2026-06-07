import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

export async function POST() {
  try {
    const user = await getRequiredUser();
    const { createClient } = await import("@supabase/supabase-js");

    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    ) as any;

    // 1. Delete user data from all public tables
    const tables = [
      "audit_log", "billing_events", "assessment_purchases", "payments",
      "subscriptions", "evidence", "compliance_documents",
      "compliance_scores", "compliance_tasks", "notifications",
      "notification_preferences", "business_members", "businesses",
      "assessments", "user_profiles",
    ];

    for (const table of tables) {
      try { await db.from(table).delete().eq("user_id", user.id); } catch {}
    }

    // 2. Delete the auth user via RPC (runs raw SQL in auth schema)
    // This is more reliable than the GoTrue Admin API which returns 500
    const { error: rpcError } = await db.rpc("delete_auth_user", { uid: user.id });

    if (rpcError) {
      console.error("[Account Delete] RPC error:", rpcError.message);

      // 3. Fallback: try GoTrue Admin API if RPC failed
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${serviceKey}`,
          "apikey": serviceKey,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[Account Delete] GoTrue fallback also failed:", res.status, errText);
        return NextResponse.json<ApiResponse>(
          { success: false, error: { message: "Could not delete auth user. Data has been cleared." } },
          { status: 500 }
        );
      }
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: "Account deleted successfully" } },
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

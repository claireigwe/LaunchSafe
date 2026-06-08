import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function PATCH(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { action, planId, planName, billingCycle } = body;

    if (action === "cancel") {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (sub) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("id", sub.id);
      }

      return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
    }

    if (action === "schedule_change") {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .in("status", ["active", "trial"])
        .maybeSingle();

      if (sub && planId) {
        const { data: plan } = await supabase
          .from("subscription_plans")
          .select("id")
          .eq("slug", planId)
          .maybeSingle();

        if (plan) {
          await supabase
            .from("subscriptions")
            .update({ pending_plan_id: plan.id })
            .eq("id", sub.id);
        }
      }

      return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
    }

    if (action === "clear_pending") {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .in("status", ["active", "trial"])
        .maybeSingle();

      if (sub) {
        await supabase
          .from("subscriptions")
          .update({ pending_plan_id: null })
          .eq("id", sub.id);
      }

      return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unknown action" } },
      { status: 400 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

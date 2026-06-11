import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, userId, email } = body;

    if (!ADMIN_SECRET) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Admin not configured" } },
        { status: 503 }
      );
    }

    if (password !== ADMIN_SECRET) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const supabase = createAdminClient() as any;
    let targetUserId = userId;

    if (!targetUserId && email) {
      const { data: userData } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();

      if (userData) targetUserId = userData.user_id;
    }

    if (!targetUserId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "User not found. Provide a valid userId or email." } },
        { status: 404 }
      );
    }

    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", "enterprise")
      .single();

    if (!plan) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Enterprise plan not found. Run the seed first." } },
        { status: 500 }
      );
    }

    const now = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("subscriptions")
        .update({
          plan_id: plan.id,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: end.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("subscriptions")
        .insert({
          user_id: targetUserId,
          plan_id: plan.id,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: end.toISOString(),
        });
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { granted: true } });
  } catch (error) {
    console.error("Admin grant enterprise error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Internal error" } },
      { status: 500 }
    );
  }
}

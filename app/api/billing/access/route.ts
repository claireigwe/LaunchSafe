import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveAccess } from "@/lib/billing/features";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, subscription_plans!inner(slug)")
      .eq("user_id", user.id)
      .in("status", ["active", "trial"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const planSlug = sub?.subscription_plans?.slug || null;
    const planStatus = sub?.status || null;
    const access = resolveAccess(planSlug, planStatus);

    return NextResponse.json<ApiResponse>({ success: true, data: access });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: true, data: resolveAccess(null, null) },
    );
  }
}

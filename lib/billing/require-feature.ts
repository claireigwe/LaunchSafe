import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveAccess, type FeatureFlag } from "./features";
import type { ApiResponse } from "@/types/api.types";

export async function requireFeature(userId: string, feature: FeatureFlag): Promise<{ allowed: boolean; response?: NextResponse }> {
  const supabase = createAdminClient() as any;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["active", "trial"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let planSlug: string | null = null;
  if (sub?.plan_id) {
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("slug")
      .eq("id", sub.plan_id)
      .maybeSingle();
    if (plan) planSlug = plan.slug;
  }

  const access = resolveAccess(planSlug, sub?.status || null);

  if (!access.features.includes(feature)) {
    return {
      allowed: false,
      response: NextResponse.json<ApiResponse>(
        { success: false, error: { message: `This action requires the ${feature.replace("_", " ")} feature on the Enterprise plan` } },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

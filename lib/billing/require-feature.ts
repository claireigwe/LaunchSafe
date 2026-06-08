import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveAccess, type FeatureFlag } from "./features";
import type { ApiResponse } from "@/types/api.types";

export async function requireFeature(userId: string, feature: FeatureFlag): Promise<{ allowed: boolean; response?: NextResponse }> {
  const supabase = createAdminClient() as any;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, subscription_plans!inner(slug)")
    .eq("user_id", userId)
    .in("status", ["active", "trial"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const planSlug = sub?.subscription_plans?.slug || null;
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

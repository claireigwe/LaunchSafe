import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { PlanService } from "@/lib/billing/plan-service";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const [bizResult, profileResult, subscription, updatesResult, activityResult] = await Promise.all([
      supabase.from("businesses").select("id, name, industry, state, type, created_at").eq("user_id", user.id),
      supabase.from("user_profiles").select("full_name, job_title").eq("user_id", user.id).maybeSingle(),
      PlanService.getUserPlan(user.id),
      supabase.from("regulatory_updates").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3),
      supabase.from("activity_log").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    ]);

    const businesses = bizResult.data || [];
    const activeBusinessId = businesses.length > 0 ? businesses[0].id : null;

    // Get the latest compliance score for the first business
    let score = null;
    if (activeBusinessId) {
      const { data: scores } = await supabase
        .from("compliance_scores")
        .select("*")
        .eq("business_id", activeBusinessId)
        .order("calculated_at", { ascending: false })
        .limit(1);

      if (scores && scores.length > 0) {
        score = {
          id: scores[0].id,
          businessId: scores[0].business_id,
          score: scores[0].score,
          breakdown: scores[0].breakdown,
          calculatedAt: scores[0].calculated_at,
        };
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        businesses,
        profile: profileResult?.data
          ? { fullName: profileResult.data.full_name || "", jobTitle: profileResult.data.job_title || "" }
          : null,
        subscription,
        score,
        regulatoryUpdates: (updatesResult.data || []).slice(0, 3),
        recentActivity: (activityResult.data || []).slice(0, 5),
      },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

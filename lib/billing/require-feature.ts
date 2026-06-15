import { NextResponse } from "next/server";
import { resolveAccess, type FeatureFlag } from "./features";
import { PlanService } from "./plan-service";
import type { ApiResponse } from "@/types/api.types";

export async function requireFeature(userId: string, feature: FeatureFlag): Promise<{ allowed: boolean; response?: NextResponse }> {
  const access = await PlanService.getUserPlanAccess(userId);

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

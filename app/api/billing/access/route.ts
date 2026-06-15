import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { PlanService } from "@/lib/billing/plan-service";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const access = await PlanService.getUserPlanAccess(user.id);
    return NextResponse.json<ApiResponse>({ success: true, data: access });
  } catch (error) {
    console.error("[Billing Access] Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: true, data: { planId: null, planName: "", features: [], limits: { businesses: 0, documents: 0 }, status: null } },
    );
  }
}

import { NextResponse } from "next/server";
import { PlanService } from "@/lib/billing/plan-service";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const plans = await PlanService.getAllPlans();
    return NextResponse.json<ApiResponse>({ success: true, data: plans });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Failed to load plans" } },
      { status: 500 }
    );
  }
}

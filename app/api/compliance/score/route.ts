import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

import { calculateComplianceScore } from "@/features/compliance/api/score-calculator";

export async function GET(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId") || "";

    const { data } = await supabase
      .from("compliance_scores")
      .select("*")
      .eq("user_id", user.id)
      .eq("business_id", businessId)
      .order("calculated_at", { ascending: false })
      .limit(1)
      .single();

    if (!data) {
      return NextResponse.json<ApiResponse>({ success: true, data: null });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: data.id,
        businessId: data.business_id,
        score: data.score,
        breakdown: data.breakdown,
        calculatedAt: data.calculated_at,
      },
    });
  } catch {
    return NextResponse.json<ApiResponse>({ success: true, data: null });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const businessId = body.businessId || "";

    const result = await calculateComplianceScore(user.id, businessId);

    const { data, error } = await supabase.from("compliance_scores").insert({
      user_id: user.id,
      business_id: businessId,
      score: result.score,
      breakdown: result.breakdown,
      calculated_at: new Date().toISOString(),
    }).select().single();

    if (error) {
      throw error;
    }

    return NextResponse.json<ApiResponse>({ 
      success: true, 
      data: {
        id: data.id,
        businessId: data.business_id,
        score: data.score,
        breakdown: data.breakdown,
        calculatedAt: data.calculated_at,
      } 
    });
  } catch (error) {
    console.error("Score POST Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Failed to compute score" } },
      { status: 500 }
    );
  }
}


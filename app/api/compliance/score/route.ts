import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

import { calculateComplianceScore } from "@/features/compliance/api/score-calculator";

export async function GET(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId") || "";

    const { data: all } = await supabase
      .from("compliance_scores")
      .select("*")
      .eq("user_id", user.id)
      .eq("business_id", businessId)
      .order("calculated_at", { ascending: false })
      .limit(2);

    if (!all || all.length === 0) {
      return NextResponse.json<ApiResponse>({ success: true, data: null });
    }

    const current = all[0];
    const previous = all.length > 1 ? all[1] : null;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: current.id,
        businessId: current.business_id,
        score: current.score,
        breakdown: current.breakdown,
        previousScore: previous?.score ?? null,
        calculatedAt: current.calculated_at,
      },
    });
  } catch {
    return NextResponse.json<ApiResponse>({ success: true, data: null });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { businessId, score: clientScore, breakdown: clientBreakdown } = body;

    if (!businessId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "businessId is required" } },
        { status: 400 }
      );
    }

    let score: number;
    let breakdown: any;

    if (clientScore !== undefined && clientBreakdown !== undefined) {
      score = clientScore;
      breakdown = clientBreakdown;
    } else {
      const result = await calculateComplianceScore(user.id, businessId);
      score = result.score;
      breakdown = result.breakdown;
    }

    const { data: previousScores } = await supabase
      .from("compliance_scores")
      .select("score")
      .eq("user_id", user.id)
      .eq("business_id", businessId)
      .order("calculated_at", { ascending: false })
      .limit(1);

    const previousScore = previousScores?.[0]?.score ?? null;

    const { data, error } = await supabase.from("compliance_scores").insert({
      user_id: user.id,
      business_id: businessId,
      score,
      breakdown,
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
        previousScore,
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


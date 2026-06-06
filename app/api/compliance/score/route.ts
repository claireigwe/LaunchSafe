import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;

    const { data } = await supabase
      .from("compliance_scores")
      .select("*")
      .eq("user_id", user.id)
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
    const { score, completedTasks, totalTasks, overdueCount } = body;

    if (score === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Score is required" } },
        { status: 400 }
      );
    }

    await supabase.from("compliance_scores").insert({
      user_id: user.id,
      business_id: "onboarded",
      score,
      breakdown: { completedTasks, totalTasks, overdueCount },
      calculated_at: new Date().toISOString(),
    });

    return NextResponse.json<ApiResponse>({ success: true, data: { saved: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

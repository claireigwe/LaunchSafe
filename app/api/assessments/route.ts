import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AssessmentEngine } from "@/features/assessments/services/assessment-engine";
import type { ApiResponse } from "@/types/api.types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("assessments")
      .select("id, status, summary_json, results_json, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const list = (data || []).map((a: any) => ({
      id: a.id,
      status: a.status,
      summary: a.summary_json,
      hasReport: a.results_json !== null,
      createdAt: a.created_at,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: list,
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Use admin client to bypass RLS — no session required for anonymous assessments
    const supabase = createAdminClient() as any;
    let userId: string | null = null;

    try {
      const { cookies } = await import("next/headers");
      const { createServerClient } = await import("@supabase/ssr");
      const cookieStore = await cookies();
      const authClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: () => {},
          },
        }
      );
      const { data: { user } } = await authClient.auth.getUser();
      if (user) userId = user.id;
    } catch {} // Anonymous user — userId stays null

    const body = await request.json();
    const { data: formData } = body;

    if (!formData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Assessment data is required" } },
        { status: 400 }
      );
    }

    const { summary: summaryJson, report: resultsJson } = await AssessmentEngine.generateAssessment(formData);

    // Resolve sub_industry_id from form data
    let subIndustryId = null;
    const industrySlug = formData?.basics?.industry;
    const subIndustrySlug = formData?.basics?.subIndustry;
    if (industrySlug && subIndustrySlug) {
      const { data: ind } = await (supabase as any)
        .from("industries")
        .select("id")
        .eq("slug", industrySlug)
        .maybeSingle();
      if (ind) {
        const { data: subInd } = await (supabase as any)
          .from("sub_industries")
          .select("id")
          .eq("slug", subIndustrySlug)
          .eq("industry_id", (ind as any).id)
          .maybeSingle();
        if (subInd) subIndustryId = subInd.id;
      }
    }

    // LGA is already a UUID from the wizard selection
    const lgaId = formData?.location?.lga || null;

    // Store assessment for both authenticated and anonymous users
    const { data: assessment, error } = await supabase
      .from("assessments")
      .insert({
        user_id: userId || null,
        status: "completed",
        wizard_data: formData,
        sub_industry_id: subIndustryId,
        lga_id: lgaId,
        summary_json: summaryJson,
        results_json: resultsJson,
      } as any)
      .select()
      .single();

    if (error) throw error;
    if (!assessment) throw new Error("Failed to create assessment");

    const a = assessment as any;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          id: a.id,
          userId: a.user_id,
          businessId: null,
          industryId: null,
          countryId: null,
          stateId: null,
          status: a.status,
          summaryJson: a.summary_json,
          resultsJson: null,
          createdAt: a.created_at,
          updatedAt: a.updated_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Assessment Create] Error:", error);
    const message = error?.message || (typeof error === 'string' ? error : "Internal server error");
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}



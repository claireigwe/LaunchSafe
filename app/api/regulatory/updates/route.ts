import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("regulatory_updates")
      .select("*")
      .eq("is_published", true)
      .order("effective_date", { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Failed to fetch regulatory updates" } },
        { status: 500 }
      );
    }

    const mapped = (data || []).map((u: any) => ({
      id: u.id,
      title: u.title,
      summary: u.summary,
      source: u.source,
      sourceUrl: u.source_url,
      effectiveDate: u.effective_date,
      affectedIndustries: u.affected_industries || [],
      affectedRequirements: u.affected_requirements || [],
      impactLevel: u.impact_level,
      isPublished: u.is_published,
      publishedAt: u.published_at,
      createdAt: u.created_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: mapped });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { INDUSTRIES } from "@/features/assessments/data/industries";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("industries")
      .select("id, name, slug, description")
      .order("name");

    if (error || !data || data.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: INDUSTRIES.map((i) => ({ id: i.id, name: i.name, slug: i.id, description: i.description })),
      });
    }

    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch {
    return NextResponse.json<ApiResponse>({
      success: true,
      data: INDUSTRIES.map((i) => ({ id: i.id, name: i.name, slug: i.id, description: i.description })),
    });
  }
}

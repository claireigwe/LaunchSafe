import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const supabase = createAdminClient() as any;
    const { data } = await supabase.from("requirements").select("*, agencies(name, acronym), industries(name)").order("name");
    return NextResponse.json<ApiResponse>({ success: true, data: data || [] });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase.from("requirements").insert({
      name: body.name, description: body.description, agency_id: body.agencyId, industry_id: body.industryId,
      country_id: "00000000-0000-0000-0000-000000000000", requirement_type: body.requirementType || "registration",
      frequency: body.frequency || "one_time", status: "active", confidence_level: "verified", is_verified: true,
    }).select().single();
    if (error) return NextResponse.json<ApiResponse>({ success: false, error: { message: error.message } }, { status: 500 });
    return NextResponse.json<ApiResponse>({ success: true, data }, { status: 201 });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    await supabase.from("requirements").delete().eq("id", body.id);
    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

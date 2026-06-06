import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const supabase = createAdminClient() as any;
    const { data } = await supabase.from("regulatory_updates").select("*").order("created_at", { ascending: false });
    return NextResponse.json<ApiResponse>({ success: true, data: data || [] });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase.from("regulatory_updates").insert({
      title: body.title, summary: body.summary, source: body.source, source_url: body.sourceUrl,
      effective_date: body.effectiveDate, affected_industries: body.affectedIndustries || [],
      impact_level: body.impactLevel || "medium", is_published: true, published_at: new Date().toISOString(),
    }).select().single();
    if (error) return NextResponse.json<ApiResponse>({ success: false, error: { message: error.message } }, { status: 500 });
    return NextResponse.json<ApiResponse>({ success: true, data }, { status: 201 });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    await supabase.from("regulatory_updates").update({
      title: body.title, summary: body.summary, source: body.source, is_published: body.isPublished,
    }).eq("id", body.id);
    return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    await supabase.from("regulatory_updates").delete().eq("id", body.id);
    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const supabase = createAdminClient() as any;
    const { data } = await supabase.from("agencies").select("*, countries(name)").order("name");
    return NextResponse.json<ApiResponse>({ success: true, data: data || [] });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase.from("agencies").insert({ name: body.name, acronym: body.acronym, country_id: body.countryId, website: body.website }).select().single();
    if (error) return NextResponse.json<ApiResponse>({ success: false, error: { message: error.message } }, { status: 500 });
    return NextResponse.json<ApiResponse>({ success: true, data }, { status: 201 });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("agencies").update({ name: body.name, acronym: body.acronym, website: body.website }).eq("id", body.id);
    if (error) return NextResponse.json<ApiResponse>({ success: false, error: { message: error.message } }, { status: 500 });
    return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    await supabase.from("agencies").delete().eq("id", body.id);
    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

function checkAuth(body?: any) {
  return process.env.ADMIN_SECRET && body?.secret === process.env.ADMIN_SECRET;
}

export async function GET() {
  try {
    const supabase = createAdminClient() as any;
    const { data } = await supabase.from("industries").select("*").order("name");
    return NextResponse.json<ApiResponse>({ success: true, data: data || [] });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase.from("industries").insert({ name: body.name, slug: body.slug, description: body.description || null }).select().single();
    if (error) return NextResponse.json<ApiResponse>({ success: false, error: { message: error.message } }, { status: 500 });
    return NextResponse.json<ApiResponse>({ success: true, data }, { status: 201 });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("industries").update({ name: body.name, slug: body.slug, description: body.description }).eq("id", body.id);
    if (error) return NextResponse.json<ApiResponse>({ success: false, error: { message: error.message } }, { status: 500 });
    return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient() as any;
    await supabase.from("industries").delete().eq("id", body.id);
    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch { return NextResponse.json<ApiResponse>({ success: false, error: { message: "Failed" } }, { status: 500 }); }
}

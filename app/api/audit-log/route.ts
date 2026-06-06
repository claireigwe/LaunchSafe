import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;

    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({ success: true, data: data || [] });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { action, entityType, entityId, metadata } = body;

    if (!action || !entityType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "action and entityType are required" } },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("audit_log").insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      metadata: metadata || {},
    });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { logged: true } }, { status: 201 });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

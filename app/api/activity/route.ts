import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const activity = (data || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      timestamp: row.created_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: activity });
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
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { type, title, description } = body;

    if (!type || !title) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "type and title are required" } },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("activity_log").insert({
      user_id: user.id,
      type,
      title,
      description: description || "",
    });

    if (error) throw error;

    return NextResponse.json<ApiResponse>({ success: true, data: { logged: true } }, { status: 201 });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateName = searchParams.get("state");

    if (!stateName) {
      return NextResponse.json<ApiResponse>({ success: true, data: [] });
    }

    const supabase = createAdminClient() as any;

    // Look up state by name (case-insensitive)
    const { data: state } = await supabase
      .from("states")
      .select("id")
      .ilike("name", stateName)
      .maybeSingle();

    if (!state) {
      return NextResponse.json<ApiResponse>({ success: true, data: [] });
    }

    const { data } = await supabase
      .from("lgas")
      .select("id, name")
      .eq("state_id", state.id)
      .order("name", { ascending: true });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: (data || []).map((l: any) => ({ id: l.id, name: l.name })),
    });
  } catch {
    return NextResponse.json<ApiResponse>({ success: true, data: [] });
  }
}

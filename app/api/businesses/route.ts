import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const businesses = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description || "",
      industryId: row.industry_id,
      stateId: row.state_id,
      status: row.status,
      employeeCount: row.employee_count,
      website: row.website,
      createdAt: row.created_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: businesses });
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business name is required" } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      { success: true, data: { id: data.id, name: data.name } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

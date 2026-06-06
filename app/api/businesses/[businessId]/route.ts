import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;
    const supabase = await createClient() as any;

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        description: data.description || "",
        industryId: data.industry_id,
        stateId: data.state_id,
        status: data.status,
        employeeCount: data.employee_count,
        website: data.website,
        createdAt: data.created_at,
      },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;
    const supabase = await createClient() as any;
    const body = await request.json();

    const updates: any = {};
    if (body.name) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.website !== undefined) updates.website = body.website;

    const { data, error } = await supabase
      .from("businesses")
      .update(updates)
      .eq("id", businessId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { id: data.id, name: data.name } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

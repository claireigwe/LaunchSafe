import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
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
        details: data.details || {},
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
    const supabase = createAdminClient() as any;
    const body = await request.json();

    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.website !== undefined) updates.website = body.website;
    if (body.employeeCount !== undefined) updates.employee_count = parseInt(body.employeeCount, 10) || null;
    if (body.details !== undefined) updates.details = body.details;
    if (body.industrySlug) {
      const { data: ind } = await supabase.from("industries").select("id").eq("slug", body.industrySlug).maybeSingle();
      if (ind) updates.industry_id = ind.id;
    }
    if (body.stateSlug) {
      const { data: st } = await supabase.from("states").select("id").ilike("name", body.stateSlug).maybeSingle();
      if (st) updates.state_id = st.id;
    }

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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;
    const supabase = await createClient() as any;

    const { data: business, error: findError } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("user_id", user.id)
      .single();

    if (findError || !business) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business not found" } },
        { status: 404 }
      );
    }

    const adminSupabase = createAdminClient() as any;
    const { error: deleteError } = await adminSupabase
      .from("businesses")
      .delete()
      .eq("id", businessId);

    if (deleteError) {
      console.error("Delete Business Error:", deleteError);
      throw deleteError;
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Delete Business Catch:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Internal Error" } },
      { status: 500 }
    );
  }
}

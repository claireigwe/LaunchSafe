import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;

    const { data } = await supabase
      .from("business_members")
      .select("*, user_profiles(full_name, email)")
      .eq("user_id", user.id);

    const members = (data || []).map((m: any) => ({
      id: m.id,
      businessId: m.business_id,
      role: m.role,
      name: m.user_profiles?.full_name || "Unknown",
      joinedAt: m.joined_at,
      invitedAt: m.invited_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: members });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { memberId } = body;

    const { data: membership } = await supabase
      .from("business_members")
      .select("business_id, role")
      .eq("user_id", user.id)
      .single();

    if (!membership || membership.role === "member") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Not authorized" } },
        { status: 403 }
      );
    }

    await supabase
      .from("business_members")
      .delete()
      .eq("id", memberId)
      .eq("business_id", membership.business_id);

    return NextResponse.json<ApiResponse>({ success: true, data: { removed: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const { data } = await supabase
      .from("user_profiles")
      .select("preferred_business_id")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { preferredBusinessId: data?.preferred_business_id || null },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { preferredBusinessId } = body;

    await supabase
      .from("user_profiles")
      .update({ preferred_business_id: preferredBusinessId || null })
      .eq("user_id", user.id);

    return NextResponse.json<ApiResponse>({ success: true, data: { preferredBusinessId } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { assessmentId } = await params;
    const supabase = createAdminClient() as any;

    // Only claim assessments that have no user_id (anonymous)
    const { data: assessment } = await supabase
      .from("assessments")
      .select("user_id")
      .eq("id", assessmentId)
      .maybeSingle();

    if (!assessment) {
      return NextResponse.json<ApiResponse>({ success: false, error: { message: "Assessment not found" } }, { status: 404 });
    }

    if (assessment.user_id) {
      // Already claimed — nothing to do
      return NextResponse.json<ApiResponse>({ success: true, data: { claimed: false } });
    }

    // Link this assessment to the logged-in user
    const { error } = await supabase
      .from("assessments")
      .update({ user_id: user.id })
      .eq("id", assessmentId);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({ success: true, data: { claimed: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

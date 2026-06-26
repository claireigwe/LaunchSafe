import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

/**
 * DELETE /api/assessments/[assessmentId]
 * Deletes the specified assessment.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { assessmentId } = await params;
    const supabase = await createClient();

    // Verify ownership
    const { data: assessment, error: fetchError } = await supabase
      .from("assessments")
      .select("id, user_id")
      .eq("id", assessmentId)
      .single();

    if (fetchError || !assessment) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Assessment not found" } },
        { status: 404 }
      );
    }

    const a = assessment as any;
    if (a.user_id !== user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Unauthorized" } },
        { status: 403 }
      );
    }

    // Delete assessment using admin client to bypass RLS missing DELETE policy
    const adminSupabase = createAdminClient() as any;

    // First delete any associated purchase records to prevent foreign key violations
    await adminSupabase
      .from("assessment_purchases")
      .delete()
      .eq("assessment_id", assessmentId);

    const { error: deleteError } = await adminSupabase
      .from("assessments")
      .delete()
      .eq("id", assessmentId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: err.message || "Failed to delete assessment" } },
      { status: 500 }
    );
  }
}

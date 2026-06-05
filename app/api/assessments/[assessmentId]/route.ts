import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

/**
 * GET /api/assessments/[assessmentId]
 * Returns the assessment summary (pre-payment visible content only).
 * results_json is NEVER returned from this route.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { assessmentId } = await params;

    // TODO: AssessmentRepository.getSummary(assessmentId, user.id)
    // Verify ownership before returning. Never return results_json.

    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

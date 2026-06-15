import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { AssessmentEngine } from "@/features/assessments/services/assessment-engine";
import type { ApiResponse } from "@/types/api.types";

/**
 * GET /api/assessments/[assessmentId]/report
 *
 * Returns the full compliance report.
 * ACCESS REQUIRES server-side payment verification.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { assessmentId } = await params;

    const report = await AssessmentEngine.getFullReport(assessmentId, user.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: report,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "PaymentRequired") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment required" } },
        { status: 402 }
      );
    }
    
    const msg = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: msg } },
      { status: msg === "PaymentRequired" ? 402 : 401 }
    );
  }
}

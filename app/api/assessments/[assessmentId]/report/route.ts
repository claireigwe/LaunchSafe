import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

/**
 * GET /api/assessments/[assessmentId]/report
 *
 * Returns the full compliance report.
 * ACCESS REQUIRES server-side payment verification.
 *
 * Flow:
 * 1. Verify user authentication
 * 2. Verify user owns the assessment
 * 3. Check assessment_purchases table for status = 'paid'
 * 4. Only then return results_json
 *
 * NEVER return results_json without completing steps 1-3.
 * Client-side payment state must never be trusted.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { assessmentId } = await params;

    // TODO: AssessmentService.getFullReport(assessmentId, user.id)
    //       — verifies ownership
    //       — verifies assessment_purchases.status = 'paid' in DB
    //       — returns results_json only if verified

    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Payment required" } },
      { status: 402 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

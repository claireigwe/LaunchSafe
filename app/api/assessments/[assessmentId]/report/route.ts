import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { AssessmentEngine } from "@/features/assessments/services/assessment-engine";
import type { ApiResponse } from "@/types/api.types";

/**
 * GET /api/assessments/[assessmentId]/report
 *
 * Returns the full compliance report with business info.
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

    // Also fetch business info from wizard_data for the report page
    const supabase = createAdminClient() as any;
    const { data: assessment } = await supabase
      .from("assessments")
      .select("wizard_data")
      .eq("id", assessmentId)
      .maybeSingle();

    let businessInfo: Record<string, any> | null = null;
    if (assessment?.wizard_data) {
      const wd = assessment.wizard_data;
      businessInfo = {
        businessType: wd.basics?.businessType || wd.basics?.businessStage || "",
        industry: wd.basics?.industry || "",
        location: wd.location?.state ? `${wd.location.state}, Nigeria` : "Nigeria",
        businessStage: wd.basics?.businessStage || "",
        employeeCount: wd.team?.employeeCount || "",
      };
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { report, businessInfo },
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

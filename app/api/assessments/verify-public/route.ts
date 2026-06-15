import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { AssessmentEngine } from "@/features/assessments/services/assessment-engine";
import type { ApiResponse } from "@/types/api.types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_VERIFY_API = "https://api.paystack.co/transaction/verify";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assessmentId, trxref } = body;

    if (!trxref) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Transaction reference is required" } },
        { status: 400 }
      );
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment service not configured" } },
        { status: 503 }
      );
    }

    // Verify with Paystack
    const verifyRes = await fetch(`${PAYSTACK_VERIFY_API}/${encodeURIComponent(trxref)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment verification failed" } },
        { status: 402 }
      );
    }

    const supabase = createAdminClient() as any;

    // Try to find existing assessment by ID
    let report = null;
    let businessInfo: Record<string, any> | null = null;
    if (assessmentId && assessmentId !== "pending") {
      const { data: existing } = await supabase
        .from("assessments")
        .select("wizard_data, results_json")
        .eq("id", assessmentId)
        .maybeSingle();

      if (existing?.results_json) {
        report = existing.results_json;
      }

      if (existing?.wizard_data) {
        const wd = existing.wizard_data;
        businessInfo = {
          businessType: wd.basics?.businessType || wd.basics?.businessStage || "",
          industry: wd.basics?.industry || "",
          location: wd.location?.state ? `${wd.location.state}, Nigeria` : "Nigeria",
          businessStage: wd.basics?.businessStage || "",
          employeeCount: wd.team?.employeeCount || "",
        };

        if (!report) {
          const result = await AssessmentEngine.generateAssessment(wd);
          report = result.report;
        }
      }
    }

    // If no stored assessment, generate a temporary report from metadata
    if (!report) {
      const metadata = verifyData.data.metadata || {};
      const formData = metadata.assessmentData ? JSON.parse(metadata.assessmentData) : {};
      const result = await AssessmentEngine.generateAssessment(formData);
      report = result.report;
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { report, businessInfo, verified: true },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

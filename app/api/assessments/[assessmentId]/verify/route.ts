import { generateFullReport } from '@/features/assessments/services/report-generator';
import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";
import { createAdminClient } from "@/lib/supabase/server";
import type { AssessmentFullReport } from "@/types/domain/assessment";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_VERIFY_API = "https://api.paystack.co/transaction/verify";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { assessmentId } = await params;
    const body = await request.json();
    const { trxref, assessmentData } = body;

    if (!trxref) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Transaction reference (trxref) is required" } },
        { status: 400 }
      );
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment service not configured" } },
        { status: 503 }
      );
    }

    const verifyRes = await fetch(`${PAYSTACK_VERIFY_API}/${encodeURIComponent(trxref)}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment verification failed" } },
        { status: 402 }
      );
    }

    // Save to database
    const supabase = createAdminClient() as any;

    if (assessmentId !== "pending") {
      // Check if assessment already exists
      const { data: existingAssessment } = await supabase
        .from("assessments")
        .select("results_json, status")
        .eq("id", assessmentId)
        .maybeSingle();
    }

    const report = generateFullReport(assessmentData || {});

    // 1. Create or get payment record
    let paymentId;
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("provider_reference", trxref)
      .maybeSingle();

    if (existingPayment) {
      paymentId = existingPayment.id;
    } else {
      const { data: newPayment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          amount: verifyData.data.amount,
          currency: verifyData.data.currency,
          provider: "paystack",
          payment_type: "assessment",
          reference: `ls_ass_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          provider_reference: trxref,
          status: "paid",
        })
        .select()
        .single();
        
      if (paymentError) throw new Error(`Failed to create payment record: ${paymentError.message}`);
      paymentId = newPayment.id;
    }

    let finalAssessmentId = assessmentId;
    if (existingPayment && assessmentId === "pending") {
      const { data: existingPurchase } = await supabase
        .from("assessment_purchases")
        .select("assessment_id")
        .eq("payment_id", paymentId)
        .maybeSingle();

      if (existingPurchase) {
        finalAssessmentId = existingPurchase.assessment_id;
      }
    }

    if (assessmentId === "pending" && finalAssessmentId === "pending") {
      const { data: newAss, error: insertError } = await supabase
        .from("assessments")
        .insert({
          user_id: user.id,
          status: "completed",
          results_json: report,
        })
        .select()
        .single();
      
      if (insertError) throw new Error(`Failed to insert assessment: ${insertError.message}`);
      finalAssessmentId = newAss.id;
    } else {
      const { error: updateError } = await supabase
        .from("assessments")
        .update({
          status: "completed",
          results_json: report,
        })
        .eq("id", finalAssessmentId);

      if (updateError) throw new Error(`Failed to update assessment: ${updateError.message}`);
    }

    // 3. Upsert assessment purchase record (handles race condition with webhook)
    const { error: purchaseError } = await supabase
      .from("assessment_purchases")
      .upsert({
        assessment_id: finalAssessmentId,
        user_id: user.id,
        payment_id: paymentId,
        status: "paid",
        unlocked_at: new Date().toISOString(),
      }, { onConflict: "assessment_id" });

    if (purchaseError) throw new Error(`Failed to create assessment purchase: ${purchaseError.message}`);

    return NextResponse.json<ApiResponse>(
      { success: true, data: { report } },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}


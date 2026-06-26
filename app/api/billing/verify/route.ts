import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { activateSubscription } from "@/features/billing/services/webhook/subscription-service";
import type { ApiResponse } from "@/types/api.types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Reference is required" } },
        { status: 400 }
      );
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment service not configured" } },
        { status: 503 }
      );
    }

    // Verify payment with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment verification failed" } },
        { status: 402 }
      );
    }

    const metadata = verifyData.data.metadata || {};
    const planId = metadata.planId || "";
    const billingCycle = metadata.billingCycle || "monthly";
    const planName = metadata.planName || planId || "your plan";

    const supabase = createAdminClient() as any;

    // Create payment record if it doesn't exist (idempotent)
    const { data: existingPay } = await supabase
      .from("payments")
      .select("id")
      .eq("reference", reference)
      .maybeSingle();

    if (!existingPay) {
      await supabase.from("payments").insert({
        user_id: user.id,
        amount: verifyData.data.amount || 0,
        currency: verifyData.data.currency || "NGN",
        provider: "paystack",
        payment_type: "subscription",
        reference,
        provider_reference: reference,
        status: "paid",
        metadata: { planId, source: "verify" },
      });
    }

    // Activate subscription using the shared service (same path as webhook)
    if (planId) {
      await activateSubscription(supabase, user.id, planId, billingCycle, null, planName);
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { activated: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Verification failed" } },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
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

    // Read planId from Paystack transaction metadata
    const metadata = verifyData.data.metadata || {};
    const planId = metadata.planId || "enterprise";
    const billingCycle = metadata.billingCycle || "monthly";

    const supabase = createAdminClient() as any;

    // Look up the plan by slug
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", planId)
      .eq("is_active", true)
      .maybeSingle();

    if (plan) {
      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + (billingCycle === "annual" ? 12 : 1));

      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingSub) {
        await supabase
          .from("subscriptions")
          .update({
            plan_id: plan.id,
            status: "active",
            paystack_subscription_code: reference,
            current_period_start: now.toISOString(),
            current_period_end: end.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq("id", existingSub.id);
      } else {
        await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            plan_id: plan.id,
            status: "active",
            paystack_subscription_code: reference,
            current_period_start: now.toISOString(),
            current_period_end: end.toISOString(),
          });
      }
    }

    // Create payment record if it doesn't exist
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

    return NextResponse.json<ApiResponse>({ success: true, data: { activated: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Verification failed" } },
      { status: 500 }
    );
  }
}

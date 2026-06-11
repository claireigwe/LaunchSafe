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

    const supabase = createAdminClient() as any;

    const { data: entPlan } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("slug", "enterprise")
      .maybeSingle();

    if (entPlan) {
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("plan_id", entPlan.id)
        .maybeSingle();

      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + 1);

      if (existingSub) {
        await supabase
          .from("subscriptions")
          .update({
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
            plan_id: entPlan.id,
            status: "active",
            paystack_subscription_code: reference,
            current_period_start: now.toISOString(),
            current_period_end: end.toISOString(),
          });
      }
    }

    const { data: existingPay } = await supabase
      .from("payments")
      .select("id")
      .eq("reference", reference)
      .maybeSingle();

    if (!existingPay) {
      const amount = verifyData.data.amount || 3500000;
      await supabase.from("payments").insert({
        user_id: user.id,
        amount,
        currency: "NGN",
        provider: "paystack",
        payment_type: "subscription",
        reference,
        provider_reference: reference,
        status: "paid",
        metadata: { planId: "enterprise", source: "verify" },
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

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API = "https://api.paystack.co/transaction/initialize";

const PLANS: Record<string, { monthly: number; annual: number }> = {
  starter: { monthly: 10000, annual: 102000 },
  growth: { monthly: 20000, annual: 216000 },
};

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json() as { planId?: string; billingCycle?: string };
    const { planId, billingCycle } = body;

    if (!planId || !PLANS[planId]) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Invalid plan" } },
        { status: 400 }
      );
    }

    if (!billingCycle || (billingCycle !== "monthly" && billingCycle !== "annual")) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Invalid billing cycle" } },
        { status: 400 }
      );
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment service not configured" } },
        { status: 503 }
      );
    }

    const amount = PLANS[planId][billingCycle as "monthly" | "annual"];
    const amountInKobo = amount * 100;
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?subscription=success&plan=${planId}&billing=${billingCycle}`;

    const paystackRes = await fetch(PAYSTACK_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInKobo,
        currency: "NGN",
        channels: ["card"],
        callback_url: callbackUrl,
        metadata: {
          userId: user.id,
          planId,
          billingCycle,
          type: "subscription",
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Paystack initialization failed");
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { authorizationUrl: paystackData.data.authorization_url } },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initiation failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

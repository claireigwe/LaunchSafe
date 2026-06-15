import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API = "https://api.paystack.co/transaction/initialize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assessmentId, email: bodyEmail, callbackUrl: clientCallbackUrl } = body;

    if (!assessmentId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "assessmentId is required" } },
        { status: 400 }
      );
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment service not configured" } },
        { status: 503 }
      );
    }

    // Try to get authenticated user, but don't require it
    let userId: string | null = null;
    let userEmail: string | null = bodyEmail || null;
    try {
      const { getRequiredUser } = await import("@/lib/auth/get-session");
      const user = await getRequiredUser();
      userId = user.id;
      userEmail = user.email || null;
    } catch {
      // Anonymous payment — rely on provided email or use fallback
    }

    if (!userEmail) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Email is required for payment. Please provide an email address." } },
        { status: 400 }
      );
    }

    const callbackUrl = clientCallbackUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/assessment/success?assessmentId=${assessmentId}`;

    // Initialize Paystack transaction
    const paystackRes = await fetch(PAYSTACK_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        amount: 1000000,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: {
          userId,
          assessmentId,
          type: "assessment",
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

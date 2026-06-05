import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API = "https://api.paystack.co/transaction/initialize";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { assessmentId } = body;

    if (!assessmentId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "assessmentId is required" } },
        { status: 400 }
      );
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/assessment?paid=${assessmentId}&assessmentId=${assessmentId}`;

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Payment service not configured" } },
        { status: 503 }
      );
    }

    // Initialize Paystack transaction
    const paystackRes = await fetch(PAYSTACK_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: 1000000,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: {
          userId: user.id,
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

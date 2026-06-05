import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

/**
 * POST /api/billing/subscriptions
 *
 * Initiates a Paystack subscription payment.
 *
 * Security rules:
 * - Server selects the plan and creates the transaction
 * - Subscription is ONLY activated via webhook after verified payment
 * - Client must never activate subscriptions directly
 */
export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();

    // TODO: Validate { planId, billingCycle, callbackUrl }
    // TODO: BillingService.initiateSubscription(user.id, body)
    //       — looks up plan price from DB
    //       — creates Paystack transaction server-side
    //       — returns { paymentUrl }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { paymentUrl: "" } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

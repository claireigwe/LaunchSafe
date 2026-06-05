import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

/**
 * POST /api/billing/webhooks/paystack
 *
 * Receives and processes Paystack webhook events.
 *
 * Security requirements (ALL must be satisfied before any action):
 * 1. Verify HMAC-SHA512 signature using PAYSTACK_WEBHOOK_SECRET
 * 2. Verify the payment reference exists in the payments table
 * 3. Verify payment status with Paystack API directly (do not trust event data alone)
 * 4. Prevent duplicate processing (check billing_events for existing event)
 * 5. Log all events to billing_events before taking action
 *
 * Supported events:
 * - charge.success → unlock assessment OR activate subscription
 * - subscription.create → record subscription
 * - subscription.not_renew → update subscription status
 * - invoice.payment_failed → mark payment failed, notify user
 */
export async function POST(request: Request) {
  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Missing signature" } },
      { status: 400 }
    );
  }

  try {
    const rawBody = await request.text();

    // TODO: WebhookService.verifySignature(rawBody, signature)
    // TODO: const event = JSON.parse(rawBody)
    // TODO: WebhookService.handleEvent(event)
    //       — deduplicate
    //       — log to billing_events
    //       — route to BillingService.handleChargeSuccess() etc.

    return NextResponse.json<ApiResponse>(
      { success: true, data: { received: true } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Paystack Webhook] Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Webhook processing failed" } },
      { status: 500 }
    );
  }
}

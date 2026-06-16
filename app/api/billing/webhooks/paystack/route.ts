import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";
import type { ApiResponse } from "@/types/api.types";
import { logEvent } from "@/features/billing/services/webhook/webhook-helpers";
import { handleChargeSuccess } from "@/features/billing/services/webhook/charge-success";
import { handleSubscriptionCreate } from "@/features/billing/services/webhook/subscription-create";
import { handleSubscriptionNotRenew } from "@/features/billing/services/webhook/subscription-not-renew";
import { handleInvoiceFailed } from "@/features/billing/services/webhook/invoice-failed";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (!signature || !PAYSTACK_SECRET_KEY) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Missing signature or secret key" } },
      { status: 400 }
    );
  }

  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");

  if (hash !== signature) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Invalid signature" } },
      { status: 401 }
    );
  }

  try {
    const event = JSON.parse(rawBody);
    const supabase = createAdminClient();
    const eventId = event.id;

    // Deduplicate
    const { data: existing } = await supabase
      .from("billing_events")
      .select("id")
      .eq("metadata->>event_id", eventId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: true, data: { received: true, duplicated: true } },
        { status: 200 }
      );
    }

    const eventType = event.event;
    const eventData = event.data;

    switch (eventType) {
      case "charge.success":
        await handleChargeSuccess(supabase, eventData, event);
        break;
      case "subscription.create":
        await handleSubscriptionCreate(supabase, eventData);
        break;
      case "subscription.not_renew":
        await handleSubscriptionNotRenew(supabase, eventData);
        break;
      case "invoice.payment_failed":
        await handleInvoiceFailed(supabase, eventData);
        break;
      default:
        console.log("[Paystack] Unhandled event type:", eventType);
    }

    await logEvent(supabase, eventData?.metadata?.userId || "unknown", eventType, {
      event_id: eventId,
      event_data: eventData,
    });

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

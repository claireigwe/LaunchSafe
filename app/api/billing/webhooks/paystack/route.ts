import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";
import type { ApiResponse } from "@/types/api.types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

async function logEvent(supabase: any, userId: string, eventType: string, metadata: any) {
  try {
    await supabase.from("billing_events").insert({
      user_id: userId,
      event_type: eventType,
      metadata,
    });
  } catch (err) {
    console.error("[Paystack] Failed to log billing event:", err);
  }
}

async function sendEmail(userId: string, emailType: string, data?: Record<string, unknown>) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const supabase = createAdminClient();
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    if (!user?.email) return;
    await fetch(`${appUrl}/api/notifications/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: user.email, type: emailType, data }),
    });
  } catch {}
}

async function insertNotification(supabase: any, userId: string, title: string, message: string, actionUrl?: string, emailType?: string, emailData?: Record<string, unknown>) {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "payment_success",
      title,
      message,
      action_url: actionUrl || null,
    });
    if (emailType) {
      sendEmail(userId, emailType, emailData);
    }
  } catch (err) {
    console.error("[Paystack] Failed to insert notification:", err);
  }
}

async function handleChargeSuccess(supabase: any, eventData: any, rawEvent: any) {
  const metadata = eventData.metadata || {};
  const userId = metadata.userId;
  const paymentType = metadata.type;

  if (!userId) {
    console.warn("[Paystack] charge.success missing userId in metadata");
    return;
  }

  const { data: existingPay } = await supabase
    .from("payments")
    .select("id")
    .eq("reference", eventData.reference)
    .maybeSingle();

  if (!existingPay) {
    await supabase.from("payments").insert({
      user_id: userId,
      amount: eventData.amount,
      currency: eventData.currency || "NGN",
      provider: "paystack",
      payment_type: paymentType || "subscription",
      reference: eventData.reference,
      provider_reference: eventData.reference,
      status: "paid",
      metadata: { ...metadata, event_id: rawEvent.id },
    });
  }

  if (paymentType === "assessment") {
    const assessmentId = metadata.assessmentId;
    if (assessmentId && assessmentId !== "pending") {
      const { data: payment } = await supabase
        .from("payments")
        .select("id")
        .eq("reference", eventData.reference)
        .maybeSingle();

      if (payment?.id) {
        const { data: existingPurchase } = await supabase
          .from("assessment_purchases")
          .select("id")
          .eq("assessment_id", assessmentId)
          .maybeSingle();

        if (existingPurchase) {
          await supabase
            .from("assessment_purchases")
            .update({ payment_id: payment.id, status: "paid" })
            .eq("id", existingPurchase.id);
        } else {
          await supabase.from("assessment_purchases").insert({
            user_id: userId,
            assessment_id: assessmentId,
            payment_id: payment.id,
            status: "paid",
            unlocked_at: new Date().toISOString(),
          });
        }
      }
    }

    await insertNotification(
      supabase,
      userId,
      "Assessment Unlocked",
      "Your full compliance report is now available. View your requirements, costs, and roadmap.",
      "/assessment",
      "assessment_unlocked"
    );
  }

  if (paymentType === "subscription") {
    const planId = metadata.planId;
    const billingCycle = metadata.billingCycle || "monthly";

    if (planId) {
      const dbSlug = planId;
      const { data: plans } = await supabase
        .from("subscription_plans")
        .select("id")
        .eq("slug", dbSlug)
        .maybeSingle();

      if (plans) {
        const now = new Date();
        const end = new Date(now);
        end.setMonth(end.getMonth() + (billingCycle === "annual" ? 12 : 1));

        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingSub) {
          await supabase
            .from("subscriptions")
            .update({
              plan_id: plans.id,
              status: "active",
              paystack_subscription_code: eventData.subscription_code || null,
              current_period_start: now.toISOString(),
              current_period_end: end.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq("id", existingSub.id);
        } else {
          await supabase.from("subscriptions").insert({
            user_id: userId,
            plan_id: plans.id,
            status: "active",
            paystack_subscription_code: eventData.subscription_code || null,
            current_period_start: now.toISOString(),
            current_period_end: end.toISOString(),
          });
        }
      }
    }

    const planName = metadata.planName || planId || "your plan";
    await insertNotification(
      supabase,
      userId,
      "Subscription Activated",
      `Your ${planName} plan is now active. Welcome to Compliance Autopilot.`,
      "/dashboard",
      "subscription_activated",
      { planName }
    );
  }
}

async function handleSubscriptionCreate(supabase: any, eventData: any) {
  const subCode = eventData.subscription_code;
  const customerEmail = eventData.customer?.email;

  if (!subCode || !customerEmail) return;

  const { data: users } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("email", customerEmail)
    .single();

  if (users) {
    await supabase
      .from("subscriptions")
      .update({ paystack_subscription_code: subCode })
      .eq("user_id", users.user_id);
  }
}

async function handleSubscriptionNotRenew(supabase: any, eventData: any) {
  const subCode = eventData.subscription_code;
  if (!subCode) return;

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("paystack_subscription_code", subCode)
    .single();

  if (subs) {
    await supabase
      .from("subscriptions")
      .update({ status: "expired" })
      .eq("id", subs.id);

    await insertNotification(
      supabase,
      subs.user_id,
      "Subscription Expired",
      "Your subscription has ended. Renew to continue accessing compliance management features.",
      "/settings/billing",
      "subscription_expired"
    );
  }
}

async function handleInvoiceFailed(supabase: any, eventData: any) {
  const userId = eventData.metadata?.userId;
  if (!userId) return;

  await insertNotification(
    supabase,
    userId,
    "Payment Failed",
    "Your recent payment could not be processed. Please update your payment method to continue.",
    "/settings/billing",
    "payment_failed"
  );
}

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

    const userId = eventData?.metadata?.userId || "unknown";
    await logEvent(supabase, userId, eventType, { event_id: eventId, event_data: eventData });

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

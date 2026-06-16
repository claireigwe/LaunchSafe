import { insertNotification } from "./webhook-helpers";

export async function handleChargeSuccess(supabase: any, eventData: any, rawEvent: any) {
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

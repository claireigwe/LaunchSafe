import { insertNotification } from "./webhook-helpers";

export async function activateSubscription(
  supabase: any,
  userId: string,
  planSlug: string,
  billingCycle: string,
  subscriptionCode: string | null,
  planName: string
) {
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("id")
    .eq("slug", planSlug)
    .maybeSingle();

  if (!plans) return;

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
        paystack_subscription_code: subscriptionCode,
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
      paystack_subscription_code: subscriptionCode,
      current_period_start: now.toISOString(),
      current_period_end: end.toISOString(),
    });
  }

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

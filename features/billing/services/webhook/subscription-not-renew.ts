import { insertNotification } from "./webhook-helpers";

export async function handleSubscriptionNotRenew(supabase: any, eventData: any) {
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

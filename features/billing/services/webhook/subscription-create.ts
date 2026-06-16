export async function handleSubscriptionCreate(supabase: any, eventData: any) {
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

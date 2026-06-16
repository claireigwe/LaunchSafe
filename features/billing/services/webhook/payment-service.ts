export async function recordPayment(supabase: any, eventData: any, rawEvent: any, userId: string, paymentType: string) {
  const { data: existingPay } = await supabase
    .from("payments")
    .select("id")
    .eq("reference", eventData.reference)
    .maybeSingle();

  if (!existingPay) {
    const metadata = eventData.metadata || {};
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
}

export async function getPaymentByReference(supabase: any, reference: string) {
  const { data } = await supabase
    .from("payments")
    .select("id")
    .eq("reference", reference)
    .maybeSingle();
  return data;
}

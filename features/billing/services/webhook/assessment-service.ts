import { insertNotification } from "./webhook-helpers";

export async function unlockAssessment(supabase: any, userId: string, assessmentId: string, paymentId: string) {
  const { data: existingPurchase } = await supabase
    .from("assessment_purchases")
    .select("id")
    .eq("assessment_id", assessmentId)
    .maybeSingle();

  if (existingPurchase) {
    await supabase
      .from("assessment_purchases")
      .update({ payment_id: paymentId, status: "paid" })
      .eq("id", existingPurchase.id);
  } else {
    await supabase.from("assessment_purchases").insert({
      user_id: userId,
      assessment_id: assessmentId,
      payment_id: paymentId,
      status: "paid",
      unlocked_at: new Date().toISOString(),
    });
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

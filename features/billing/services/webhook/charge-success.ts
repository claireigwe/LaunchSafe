import { recordPayment, getPaymentByReference } from "./payment-service";
import { unlockAssessment } from "./assessment-service";
import { activateSubscription } from "./subscription-service";
import { insertNotification } from "./webhook-helpers";

export async function handleChargeSuccess(supabase: any, eventData: any, rawEvent: any) {
  const metadata = eventData.metadata || {};
  const userId = metadata.userId;
  const paymentType = metadata.type;

  if (!userId) {
    console.warn("[Paystack] charge.success missing userId in metadata");
    return;
  }

  await recordPayment(supabase, eventData, rawEvent, userId, paymentType);

  if (paymentType === "assessment") {
    const assessmentId = metadata.assessmentId;
    if (assessmentId && assessmentId !== "pending") {
      const payment = await getPaymentByReference(supabase, eventData.reference);
      if (payment?.id) {
        await unlockAssessment(supabase, userId, assessmentId, payment.id);
      }
    } else {
      // No assessmentId — just send the notification
      await insertNotification(
        supabase,
        userId,
        "Assessment Unlocked",
        "Your full compliance report is now available.",
        "/assessment",
        "assessment_unlocked"
      );
    }
  }

  if (paymentType === "subscription") {
    const planId = metadata.planId;
    const billingCycle = metadata.billingCycle || "monthly";
    const planName = metadata.planName || planId || "your plan";

    if (planId) {
      await activateSubscription(supabase, userId, planId, billingCycle, eventData.subscription_code || null, planName);
    }
  }
}

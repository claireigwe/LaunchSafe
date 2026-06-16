import { insertNotification } from "./webhook-helpers";

export async function handleInvoiceFailed(supabase: any, eventData: any) {
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

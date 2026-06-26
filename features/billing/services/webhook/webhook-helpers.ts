import { createAdminClient } from "@/lib/supabase/server";

export async function logEvent(supabase: any, userId: string, eventType: string, metadata: any) {
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

export async function insertNotification(
  supabase: any,
  userId: string,
  title: string,
  message: string,
  actionUrl?: string,
  emailType?: string,
  emailData?: Record<string, unknown>
) {
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

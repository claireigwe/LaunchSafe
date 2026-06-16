import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type AppNotificationRow = any;

export async function getNotifications(userId: string): Promise<AppNotificationRow[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getNotifications] Error:", error);
    return [];
  }
  return data || [];
}

export async function getUnreadCount(userId?: string): Promise<number> {
  const supabase = await createClient();
  // If no user ID provided, get the current user
  let queryUserId = userId;
  if (!queryUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    queryUserId = user?.id;
  }
  
  if (!queryUserId) return 0;

  const { count, error } = await (supabase as any)
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", queryUserId)
    .eq("is_read", false);

  if (error) {
    console.error("[getUnreadCount] Error:", error);
    return 0;
  }
  return count || 0;
}

export async function createNotification(params: {
  userId: string;
  businessId?: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}) {
  const supabase = createAdminClient();
  const { data, error } = await (supabase as any).from("notifications").insert({
    user_id: params.userId,
    business_id: params.businessId || null,
    type: params.type,
    title: params.title,
    message: params.message,
    action_url: params.actionUrl || null,
    metadata: params.metadata || {},
  }).select().single();

  if (error) {
    console.error("[createNotification] Error:", error);
    return null;
  }
  return data;
}

export async function markAsRead(userId: string, notificationId?: string) {
  const supabase = await createClient();
  const updateQuery = (supabase as any)
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (notificationId) {
    updateQuery.eq("id", notificationId);
  }

  const { error } = await updateQuery;
  if (error) {
    console.error("[markAsRead] Error:", error);
    return false;
  }
  return true;
}

export async function deleteNotification(userId: string, notificationId: string) {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from("notifications")
    .delete()
    .eq("user_id", userId)
    .eq("id", notificationId);

  if (error) {
    console.error("[deleteNotification] Error:", error);
    return false;
  }
  return true;
}

export async function getNotificationPreferences(userId: string): Promise<any> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") { // not found
    console.error("[getNotificationPreferences] Error:", error);
  }
  return data;
}

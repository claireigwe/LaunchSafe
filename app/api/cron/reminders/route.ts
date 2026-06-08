import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createNotification, getNotificationPreferences } from "@/features/notifications/services/notification-service";

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV !== "development" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = createAdminClient();

    // 2. Fetch all non-completed tasks with a due date
    const { data: tasks, error } = await supabaseAdmin
      .from("compliance_tasks")
      .select(`
        id,
        requirement_name,
        due_date,
        status,
        business_id,
        businesses ( user_id )
      `)
      .neq("status", "completed")
      .not("due_date", "is", null);

    if (error) {
      console.error("[Cron Reminders] Error fetching tasks:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 3. Fetch all users to map user_id to email
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const userMap = new Map(users.map(u => [u.id, u.email]));

    // 4. Fetch all recently sent deadline_reminder notifications to avoid spamming
    const { data: recentNotifs } = await supabaseAdmin
      .from("notifications")
      .select("id, user_id, metadata")
      .in("type", ["deadline_reminder"]);

    const sentMap = new Set<string>();
    if (recentNotifs) {
      for (const n of recentNotifs as any[]) {
        if (n.metadata?.taskId) {
          sentMap.add(`${n.user_id}_${n.metadata.taskId}_${n.metadata.typeLabel}`);
        }
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sentCount = 0;

    for (const task of (tasks as any[]) || []) {
      const businessUserId = (task.businesses as any)?.user_id;
      if (!businessUserId) continue;

      const email = userMap.get(businessUserId);
      if (!email) continue;

      const dueDate = new Date(task.due_date);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let notifType = null;
      let typeLabel = null;

      if (diffDays === 7) {
        notifType = "deadline_approaching";
        typeLabel = "7_days";
      } else if (diffDays === 3) {
        notifType = "deadline_due_soon";
        typeLabel = "3_days";
      } else if (diffDays < 0 && task.status === "overdue") {
        // Send overdue reminder only once
        notifType = "task_overdue";
        typeLabel = "overdue";
      }

      if (!notifType) continue;

      // Check if we already sent this specific reminder
      const signature = `${businessUserId}_${task.id}_${typeLabel}`;
      if (sentMap.has(signature)) continue;

      // Check user preferences
      const prefs = await getNotificationPreferences(businessUserId);
      const emailAllowed = prefs ? prefs.email_deadline_reminders : true;
      const inAppAllowed = prefs ? prefs.in_app_deadline_reminders : true;

      if (inAppAllowed) {
        await createNotification({
          userId: businessUserId,
          businessId: task.business_id,
          type: "deadline_reminder", // General db type
          title: notifType === "task_overdue" ? "Task Overdue" : "Deadline Approaching",
          message: notifType === "task_overdue"
            ? `${task.requirement_name} is overdue!`
            : `${task.requirement_name} is due in ${diffDays} day(s).`,
          actionUrl: `/compliance`,
          metadata: { taskId: task.id, typeLabel, priority: notifType === "task_overdue" ? "critical" : "high" },
        });
      }

      if (emailAllowed) {
        try {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          await fetch(`${appUrl}/api/notifications/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              type: notifType,
              data: { title: task.requirement_name, days: diffDays, dueDate: task.due_date }
            }),
          });
        } catch (e) {
          console.error("Failed to trigger email API for", email, e);
        }
      }

      sentCount++;
    }

    return NextResponse.json({ success: true, message: `Processed reminders. Sent ${sentCount} notifications.` });
  } catch (error: any) {
    console.error("[Cron Reminders] Unhandled error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

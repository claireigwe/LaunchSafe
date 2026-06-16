import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createNotification, getNotificationPreferences } from "@/features/notifications/services/notification-service";
import { fetchDueTasks, buildSentMap, determineReminder, markTaskOverdue } from "@/features/notifications/services/reminder-service";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.NODE_ENV !== "development" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const userMap = new Map(users.map((u: any) => [u.id, u.email]));

    const tasks = await fetchDueTasks();
    const sentMap = await buildSentMap();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sentCount = 0;

    for (const task of tasks) {
      const email = userMap.get(task.user_id);
      if (!email) continue;

      const action = determineReminder(task, today);
      if (!action) continue;

      const signature = `${action.userId}_${action.taskId}_${action.typeLabel}`;
      if (sentMap.has(signature)) continue;

      // Mark overdue tasks
      if (action.type === "task_overdue" && task.status !== "overdue") {
        await markTaskOverdue(task.id);
      }

      // Check user preferences
      const prefs = await getNotificationPreferences(action.userId);
      const emailAllowed = prefs ? prefs.email_deadline_reminders : true;
      const inAppAllowed = prefs ? prefs.in_app_deadline_reminders : true;

      if (inAppAllowed) {
        await createNotification({
          userId: action.userId,
          businessId: action.businessId,
          type: "deadline_reminder",
          title: action.type === "task_overdue" ? "Task Overdue" : "Deadline Approaching",
          message: action.type === "task_overdue"
            ? `${action.taskName} is overdue!`
            : `${action.taskName} is due in ${action.diffDays} day(s).`,
          actionUrl: "/compliance",
          metadata: { taskId: action.taskId, typeLabel: action.typeLabel, priority: action.type === "task_overdue" ? "critical" : "high" },
        });
      }

      if (emailAllowed) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        fetch(`${appUrl}/api/notifications/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: email, type: action.type, data: { title: action.taskName, days: action.diffDays, dueDate: action.dueDate } }),
        }).catch((e) => console.error("Failed to trigger email API for", email, e));
      }

      sentCount++;
    }

    return NextResponse.json({ success: true, message: `Processed reminders. Sent ${sentCount} notifications.` });
  } catch (error: any) {
    console.error("[Cron Reminders] Unhandled error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

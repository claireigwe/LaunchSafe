import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { ApiResponse } from "@/types/api.types";
import {
  buildEmailHtml,
  taskCreatedHtml,
  taskCompletedHtml,
  taskOverdueHtml,
  deadlineApproachingHtml,
  documentUploadedHtml,
  subscriptionActivatedHtml,
  subscriptionRenewedHtml,
  paymentFailedHtml,
  welcomeHtml,
} from "@/lib/email/templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const BODY_BUILDERS: Record<string, (data: any) => string> = {
  task_created: (d) => taskCreatedHtml(d.title, d.dueDate),
  task_completed: (d) => taskCompletedHtml(d.title),
  task_overdue: (d) => taskOverdueHtml(d.title),
  deadline_approaching: (d) => deadlineApproachingHtml(d.title, d.days),
  deadline_due_soon: (d) => deadlineApproachingHtml(d.title, d.days),
  deadline_today: (d) => deadlineApproachingHtml(d.title, 0),
  document_uploaded: (d) => documentUploadedHtml(d.title),
  subscription_activated: (d) => subscriptionActivatedHtml(d.planName),
  subscription_renewed: (d) => subscriptionRenewedHtml(d.planName),
  payment_failed: () => paymentFailedHtml(),
  welcome: () => welcomeHtml(),
  assessment_unlocked: (d) => subscriptionActivatedHtml(d.planName || "Full Compliance Report"),
  subscription_expired: () => paymentFailedHtml(),
};

const TITLES: Record<string, string> = {
  task_created: "New Compliance Task",
  task_completed: "Task Completed",
  task_overdue: "Task Overdue — Action Required",
  deadline_approaching: "Deadline Approaching",
  deadline_due_soon: "Due Soon",
  deadline_today: "Due Today",
  document_uploaded: "Document Uploaded",
  subscription_activated: "Welcome to Compliance Autopilot",
  subscription_renewed: "Subscription Renewed",
  payment_failed: "Payment Failed",
  welcome: "Welcome to LaunchSafe",
  assessment_unlocked: "Your Compliance Report is Ready",
  subscription_expired: "Subscription Expired",
};

const ACTION_DATA: Record<string, { url: string; label: string }> = {
  task_created: { url: "/compliance", label: "View Task" },
  task_completed: { url: "/compliance", label: "View Tasks" },
  task_overdue: { url: "/compliance", label: "View Overdue Tasks" },
  deadline_approaching: { url: "/compliance", label: "View Tasks" },
  deadline_due_soon: { url: "/compliance", label: "View Tasks" },
  deadline_today: { url: "/compliance", label: "View Tasks" },
  document_uploaded: { url: "/documents", label: "View Documents" },
  subscription_activated: { url: "/dashboard", label: "Go to Dashboard" },
  subscription_renewed: { url: "/settings/billing", label: "View Billing" },
  payment_failed: { url: "/settings/billing", label: "Update Payment Method" },
  welcome: { url: "/compliance", label: "Create First Task" },
  assessment_unlocked: { url: "/assessment", label: "View Report" },
  subscription_expired: { url: "/settings/billing", label: "Renew Subscription" },
};

export async function POST(request: Request) {
  try {
    if (!resend) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Email service not configured" } },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { to, type, data } = body;

    if (!to || !type) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Missing required fields: to, type" } },
        { status: 400 }
      );
    }

    const buildBody = BODY_BUILDERS[type];
    const title = TITLES[type] || "LaunchSafe Notification";
    const action = ACTION_DATA[type];

    if (!buildBody) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: `Unknown notification type: ${type}` } },
        { status: 400 }
      );
    }

    const bodyHtml = buildBody(data || {});
    const html = buildEmailHtml(title, bodyHtml, action?.url, action?.label);

    await resend.emails.send({
      from: "LaunchSafe <onboarding@resend.dev>",
      to,
      subject: title,
      html,
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: { sent: true } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Send Email] Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Failed to send email" } },
      { status: 500 }
    );
  }
}

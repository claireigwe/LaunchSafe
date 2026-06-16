import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api.types";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Name, email, and message are required." } },
        { status: 400 }
      );
    }

    if (resend) {
      await resend.emails.send({
        from: "LaunchSafe <onboarding@resend.dev>",
        to: "hello@launchsafe.co",
        subject: `Enterprise Sales Inquiry from ${name}`,
        html: `
          <h2>Enterprise Sales Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { received: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Failed to send message." } },
      { status: 500 }
    );
  }
}

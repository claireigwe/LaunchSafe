import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api.types";

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

    console.log("[LaunchSafe] Enterprise Sales Inquiry:", { name, email, company, message });

    return NextResponse.json<ApiResponse>({ success: true, data: { received: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Failed to send message." } },
      { status: 500 }
    );
  }
}

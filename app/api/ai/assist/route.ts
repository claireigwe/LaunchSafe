import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { chatWithDeepSeek } from "@/features/ai/api/deepseek";
import type { ApiResponse } from "@/types/api.types";

const SYSTEM_PROMPT = `You are a compliance assistant for LaunchSafe, a compliance intelligence platform for African businesses.

RULES:
- NEVER invent regulations, compliance obligations, agencies, deadlines, costs, or penalties.
- NEVER present assumptions as facts.
- When information cannot be verified, clearly state: "I cannot verify this information. Please check with the relevant regulatory agency."
- Keep responses concise and actionable.
- Do not act as a legal advisor. Recommend users consult professionals for legal advice.`;

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { query, context } = body;

    if (!query || !query.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Query is required" } },
        { status: 400 }
      );
    }

    const response = await chatWithDeepSeek(
      [{ role: "user", content: query }],
      context
    );

    if (!response.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: response.error || "AI request failed" } },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { content: response.content },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

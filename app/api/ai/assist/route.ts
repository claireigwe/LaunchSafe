import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { chatWithDeepSeek } from "@/features/ai/api/deepseek";
import { requireFeature } from "@/lib/billing/require-feature";
import type { ApiResponse } from "@/types/api.types";

const SYSTEM_PROMPT = `You are a compliance assistant for LaunchSafe, a compliance intelligence platform for African businesses.

RULES:
- NEVER invent regulations, compliance obligations, agencies, deadlines, costs, or penalties.
- NEVER present assumptions as facts.
- When information cannot be verified, clearly state: "I cannot verify this information. Please check with the relevant regulatory agency."
- Keep responses concise and actionable.
- Do not act as a legal advisor. Recommend users consult professionals for legal advice.`;

async function fetchRegulatoryContext(supabase: any, userId: string): Promise<string> {
  try {
    const { data: businesses } = await supabase
      .from("businesses")
      .select("id, name, industry_id, state_id, industries(name), states(name)")
      .eq("user_id", userId)
      .neq("status", "archived")
      .order("created_at", { ascending: false })
      .limit(1);

    if (!businesses || businesses.length === 0) return "";

    const biz = businesses[0];
    const industryId = biz.industry_id;

    if (!industryId) return "";

    const { data: reqs } = await supabase
      .from("requirements")
      .select("name, description, requirement_type, agencies(name, acronym), confidence_level, frequency")
      .eq("industry_id", industryId)
      .eq("status", "active")
      .in("confidence_level", ["verified", "estimated"])
      .limit(20);

    if (!reqs || reqs.length === 0) return "";

    const industryName = biz.industries?.name || "your industry";
    const ctx = reqs.map((r: any) => {
      const agency = r.agencies?.acronym || r.agencies?.name || "Unknown";
      return `- ${r.name} (${agency}, ${r.confidence_level}, ${r.requirement_type}, ${r.frequency || "ongoing"})`;
    }).join("\n");

    return `The user operates a ${industryName} business. Here are relevant regulatory requirements from the LaunchSafe database:\n${ctx}\n\nBase your answer on these requirements. If the user asks about something not in this list, say you cannot verify and suggest checking with the relevant agency.`;
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const { allowed, response: denied } = await requireFeature(user.id, "priority_support");
    if (!allowed) return denied;

    const body = await request.json();
    const { query, context } = body;

    if (!query || !query.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Query is required" } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient() as any;
    const regulatoryContext = await fetchRegulatoryContext(supabase, user.id);
    const fullContext = [context, regulatoryContext].filter(Boolean).join("\n\n");

    const response = await chatWithDeepSeek(
      [{ role: "user", content: query }],
      fullContext
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

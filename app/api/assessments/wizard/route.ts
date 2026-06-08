import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const { data } = await supabase
      .from("assessments")
      .select("id, wizard_data, wizard_step, summary_json, status")
      .eq("user_id", user.id)
      .in("status", ["draft", "processing"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) {
      return NextResponse.json<ApiResponse>({ success: true, data: null });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        assessmentId: data.id,
        wizardData: data.wizard_data,
        wizardStep: data.wizard_step,
        summary: data.summary_json,
        status: data.status,
      },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { assessmentId, wizardData, wizardStep, summary } = body;

    if (assessmentId) {
      const updates: any = {};
      if (wizardData !== undefined) updates.wizard_data = wizardData;
      if (wizardStep !== undefined) updates.wizard_step = String(wizardStep);
      if (summary !== undefined) updates.summary_json = summary;

      const { data } = await supabase
        .from("assessments")
        .update(updates)
        .eq("id", assessmentId)
        .eq("user_id", user.id)
        .select("id")
        .single();

      if (data) {
        return NextResponse.json<ApiResponse>({ success: true, data: { id: data.id } });
      }
    }

    const { data: newAssessment } = await supabase
      .from("assessments")
      .insert({
        user_id: user.id,
        status: "draft",
        wizard_data: wizardData || null,
        wizard_step: wizardStep ? String(wizardStep) : null,
        summary_json: summary || null,
      })
      .select("id")
      .single();

    if (!newAssessment) throw new Error("Failed to create assessment");

    return NextResponse.json<ApiResponse>(
      { success: true, data: { id: newAssessment.id } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

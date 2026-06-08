import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function GET(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    let query = supabase
      .from("compliance_documents")
      .select("*")
      .eq("user_id", user.id)
      .not("generated_at", "is", null);

    if (businessId) query = query.eq("business_id", businessId);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    const docs = (data || []).map((row: any) => ({
      id: row.id,
      businessId: row.business_id,
      userId: row.user_id,
      requirementId: row.requirement_id,
      title: row.title,
      documentType: row.document_type,
      status: row.status,
      storagePath: row.storage_path,
      content: row.content,
      version: row.version,
      generatedAt: row.generated_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: docs });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

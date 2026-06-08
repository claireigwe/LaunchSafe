import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { generateDocumentWithAI } from "@/ai/generate-document";
import type { ApiResponse } from "@/types/api.types";
import type { DocumentType } from "@/types/domain/document";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { docType, context, businessId } = body as {
      docType: DocumentType;
      context: string;
      businessId?: string;
    };

    if (!docType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Document type is required" } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient() as any;

    // Resolve businessId if not provided (fallback to first active business)
    let activeBusinessId = businessId;

    if (activeBusinessId) {
      const { data: b } = await supabase.from("businesses").select("id").eq("id", activeBusinessId).eq("user_id", user.id).single();
      if (!b) activeBusinessId = null;
    }

    if (!activeBusinessId) {
      const { data: businesses } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (businesses && businesses.length > 0) {
        activeBusinessId = businesses[0].id;
      }
    }

    if (!activeBusinessId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "No active business found for document generation" } },
        { status: 400 }
      );
    }

    // Generate the document via AI
    const result = await generateDocumentWithAI(docType, context || "", activeBusinessId);

    // Persist to database
    const { data: newDoc, error: insertError } = await supabase
      .from("compliance_documents")
      .insert({
        user_id: user.id,
        business_id: activeBusinessId,
        document_type: docType,
        title: result.title,
        content: result.content,
        status: "final",
        version: 1,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to save document: ${insertError.message}`);
    }

    // Also map to local format so frontend can easily use it if needed
    const docResponse = {
      id: newDoc.id,
      businessId: newDoc.business_id,
      userId: newDoc.user_id,
      requirementId: newDoc.requirement_id,
      title: newDoc.title,
      documentType: newDoc.document_type,
      status: newDoc.status,
      storagePath: newDoc.storage_path,
      content: newDoc.content,
      version: newDoc.version,
      generatedAt: newDoc.generated_at,
      createdAt: newDoc.created_at,
      updatedAt: newDoc.updated_at,
    };

    return NextResponse.json<ApiResponse>(
      { success: true, data: { document: docResponse } },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Document generation error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: err.message || "Failed to generate document" } },
      { status: 500 }
    );
  }
}

import { createAdminClient } from "@/lib/supabase/server";
import { generateDocumentWithAI } from "@/ai/generate-document";
import { PlanService } from "@/lib/billing/plan-service";
import type { DocumentType } from "@/types/domain/document";

export class DocumentService {
  static async resolveBusinessId(userId: string, preferredBusinessId?: string): Promise<string> {
    const supabase = createAdminClient() as any;

    if (preferredBusinessId) {
      const { data: b } = await supabase.from("businesses").select("id").eq("id", preferredBusinessId).eq("user_id", userId).maybeSingle();
      if (b) return b.id;
    }

    const { data: businesses } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (businesses && businesses.length > 0) {
      return businesses[0].id;
    }

    throw new Error("No active business found for document generation");
  }

  static async checkGenerationLimit(userId: string): Promise<void> {
    const supabase = createAdminClient() as any;
    const access = await PlanService.getUserPlanAccess(userId);
    const limit = access.limits.documents || 2;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("compliance_documents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("generated_at", "is", null)
      .gte("created_at", monthStart.toISOString());

    if (count !== null && count >= limit) {
      const nextPlan = access.planId === "starter" || !access.planId ? "Growth" : "Enterprise";
      throw Object.assign(
        new Error(`You've used all ${limit} document generations this month. Upgrade to ${nextPlan} for more.`),
        { status: 403 }
      );
    }
  }

  static async generateAndSave(
    userId: string,
    businessId: string,
    docType: DocumentType,
    context: string,
    templateSlug?: string
  ): Promise<Record<string, any>> {
    const supabase = createAdminClient() as any;

    const result = await generateDocumentWithAI(docType, context, businessId, templateSlug);

    const { data: newDoc, error: insertError } = await supabase
      .from("compliance_documents")
      .insert({
        user_id: userId,
        business_id: businessId,
        document_type: docType,
        title: result.title,
        content: result.content,
        status: "final",
        version: 1,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw new Error(`Failed to save document: ${insertError.message}`);

    return {
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
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { DocumentService } from "@/features/documents/services/document-service";
import type { ApiResponse } from "@/types/api.types";
import type { DocumentType } from "@/types/domain/document";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { docType, context, businessId, templateSlug } = body as {
      docType: DocumentType;
      context: string;
      businessId?: string;
      templateSlug?: string;
    };

    if (!docType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Document type is required" } },
        { status: 400 }
      );
    }

    const activeBusinessId = await DocumentService.resolveBusinessId(user.id, businessId);

    await DocumentService.checkGenerationLimit(user.id);

    const { title, content } = await DocumentService.generate(docType, context || "", activeBusinessId, templateSlug);
    const docResponse = await DocumentService.save(user.id, activeBusinessId, docType, title, content);

    return NextResponse.json<ApiResponse>(
      { success: true, data: { document: docResponse } },
      { status: 200 }
    );
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: err.message || "Failed to generate document" } },
      { status }
    );
  }
}

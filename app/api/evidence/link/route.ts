import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { EvidenceService } from "@/features/compliance/services/evidence-service";
import type { ApiResponse } from "@/types/api.types";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { documentId, complianceTaskId, businessId } = body;

    if (!documentId || !complianceTaskId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "documentId and complianceTaskId are required" } },
        { status: 400 }
      );
    }

    const evidence = await EvidenceService.linkDocument(user.id, documentId, complianceTaskId, businessId);

    return NextResponse.json<ApiResponse>({ success: true, data: evidence }, { status: 201 });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized or Invalid Request" } },
      { status: 401 }
    );
  }
}

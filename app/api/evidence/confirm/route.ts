import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { EvidenceService } from "@/features/compliance/services/evidence-service";
import type { ApiResponse } from "@/types/api.types";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { evidenceId, businessId, complianceTaskId, title, description, storagePath, fileType, fileSize } = body;

    if (!evidenceId || !complianceTaskId || !storagePath || !title) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "evidenceId, complianceTaskId, storagePath, and title are required" } },
        { status: 400 }
      );
    }

    if (!businessId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business ID is required" } },
        { status: 400 }
      );
    }

    const evidence = await EvidenceService.saveDirect({
      userId: user.id,
      businessId,
      complianceTaskId,
      title,
      description: description || "",
      evidenceId,
      storagePath,
      fileType: fileType || "application/octet-stream",
      fileSize: fileSize || 0,
    });

    return NextResponse.json<ApiResponse>({ success: true, data: evidence }, { status: 201 });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

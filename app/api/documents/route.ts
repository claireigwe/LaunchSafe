import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    // TODO: DocumentRepository.findByUser(user.id)
    return NextResponse.json<ApiResponse>({ success: true, data: [] });
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
    const body = await request.json();
    // TODO: DocumentService.generateDocument(user.id, body)
    return NextResponse.json<ApiResponse>(
      { success: true, data: { id: "placeholder" } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

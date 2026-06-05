import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

/** GET /api/businesses | POST /api/businesses */
export async function GET() {
  try {
    const user = await getRequiredUser();
    // TODO: BusinessRepository.findByUserId(user.id)
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
    // TODO: Validate with zod | BusinessService.createBusiness(user.id, body)
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

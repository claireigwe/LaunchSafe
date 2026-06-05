import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

type Params = { params: Promise<{ businessId: string }> };

/** GET /api/businesses/[businessId] */
export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;
    // TODO: BusinessRepository.findById(businessId) + ownership check
    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

/** PATCH /api/businesses/[businessId] */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;
    const body = await request.json();
    // TODO: Validate | BusinessService.updateBusiness(businessId, user.id, body)
    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { BusinessService } from "@/features/businesses/services/business-service";
import type { ApiResponse } from "@/types/api.types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;

    const data = await BusinessService.getById(businessId, user.id);

    if (!data) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;
    const body = await request.json();

    const result = await BusinessService.update(businessId, user.id, body);

    if (!result) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: result });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const user = await getRequiredUser();
    const { businessId } = await params;

    const deleted = await BusinessService.delete(businessId, user.id);

    if (!deleted) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Delete Business Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Internal Error" } },
      { status: 500 }
    );
  }
}

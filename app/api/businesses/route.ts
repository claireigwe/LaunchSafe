import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { BusinessService } from "@/features/businesses/services/business-service";
import type { ApiResponse } from "@/types/api.types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getRequiredUser();
    const businesses = await BusinessService.list(user.id);
    return NextResponse.json<ApiResponse>({ success: true, data: businesses });
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
    const { name, description, industrySlug, subIndustrySlug, stateSlug, lgaId, website, employeeCount, details } = body;

    if (!name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business name is required" } },
        { status: 400 }
      );
    }

    // Check subscription and plan limit
    const { limit } = await BusinessService.checkSubscription(user.id);
    await BusinessService.checkBusinessLimit(user.id, limit);

    // Handle duplicate name — rejoin existing business
    const existing = await BusinessService.findExistingByName(user.id, name);
    if (existing) {
      await BusinessService.addExistingBusinessMember(existing.id, user.id);
      return NextResponse.json<ApiResponse>(
        { success: true, data: { id: existing.id, name: existing.name } },
        { status: 200 }
      );
    }

    // Create new business
    const result = await BusinessService.create({
      userId: user.id,
      name,
      description,
      industrySlug,
      subIndustrySlug,
      stateSlug,
      lgaId,
      website,
      employeeCount,
      details,
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: result },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "An unexpected error occurred";
    return NextResponse.json<ApiResponse>({ success: false, error: { message, code: error.code } }, { status });
  }
}

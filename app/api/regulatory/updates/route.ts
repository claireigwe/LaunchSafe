import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api.types";

/** GET /api/regulatory/updates — returns published regulatory updates. */
export async function GET() {
  // Public route — no auth required for published updates.
  // TODO: RegulatoryRepository.findPublishedUpdates()
  return NextResponse.json<ApiResponse>({ success: true, data: [] });
}

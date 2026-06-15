import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { PlanService } from "@/lib/billing/plan-service";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const [subscription, payments, purchases] = await Promise.all([
      PlanService.getUserPlan(user.id),
      supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("assessment_purchases").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    const paymentList = (payments.data || []).map((p: any) => ({
      id: p.id,
      amount: p.amount / 100,
      currency: p.currency,
      status: p.status,
      paymentType: p.payment_type,
      reference: p.reference,
      description: p.metadata?.description || `${p.payment_type} payment`,
      createdAt: p.created_at,
    }));

    const purchaseList = (purchases.data || []).map((p: any) => ({
      id: p.id,
      reportName: "Full Compliance Report",
      amount: p.status === "paid" ? 10000 : 0,
      status: p.status,
      createdAt: p.created_at,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { subscription, payments: paymentList, purchases: purchaseList },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveAccess } from "@/lib/billing/features";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*, subscription_plans!inner(slug, name), pending_plan:subscription_plans!pending_plan_id(slug, name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: payments } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: purchases } = await supabase
      .from("assessment_purchases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const rawPlanSlug = subs?.subscription_plans?.slug || "starter";
    const resolved = resolveAccess(rawPlanSlug, subs?.status || "trial");

    const subscription = subs ? {
      planId: resolved.planId,
      planName: resolved.planName,
      billingCycle: "monthly",
      status: subs.status,
      startDate: subs.current_period_start,
      nextRenewal: subs.current_period_end,
      cancelledAt: subs.cancelled_at,
      pendingPlanId: (subs as any).pending_plan?.slug || null,
      pendingPlanName: (subs as any).pending_plan?.name || null,
      pendingBillingCycle: null,
    } : null;

    const paymentList = (payments || []).map((p: any) => ({
      id: p.id,
      amount: p.amount / 100,
      currency: p.currency,
      status: p.status,
      paymentType: p.payment_type,
      reference: p.reference,
      description: p.metadata?.description || `${p.payment_type} payment`,
      createdAt: p.created_at,
    }));

    const purchaseList = (purchases || []).map((p: any) => ({
      id: p.id,
      reportName: "Full Compliance Report",
      amount: 10000,
      status: p.status,
      createdAt: p.created_at,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { subscription, payments: paymentList, purchases: purchaseList },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

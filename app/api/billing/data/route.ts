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
      .select("*")
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

    let rawPlanSlug: string | null = null;
    if (subs?.plan_id) {
      const { data: plan } = await supabase
        .from("subscription_plans")
        .select("slug")
        .eq("id", subs.plan_id)
        .maybeSingle();
      if (plan) rawPlanSlug = plan.slug;
    }

    let pendingSlug: string | null = null;
    let pendingName: string | null = null;
    if ((subs as any)?.pending_plan_id) {
      const { data: pendingPlan } = await supabase
        .from("subscription_plans")
        .select("slug, name")
        .eq("id", (subs as any).pending_plan_id)
        .maybeSingle();
      if (pendingPlan) {
        pendingSlug = pendingPlan.slug;
        pendingName = pendingPlan.name;
      }
    }

    const subscription = subs ? (() => {
      const resolved = resolveAccess(rawPlanSlug, subs.status);
      return {
        planId: resolved.planId,
        planName: resolved.planName,
        billingCycle: "monthly",
        status: subs.status,
        startDate: subs.current_period_start,
        nextRenewal: subs.current_period_end,
        cancelledAt: subs.cancelled_at,
        paystackSubscriptionCode: subs.paystack_subscription_code,
        pendingPlanId: pendingSlug,
        pendingPlanName: pendingName,
        pendingBillingCycle: null,
      };
    })() : null;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

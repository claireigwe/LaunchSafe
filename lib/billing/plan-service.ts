import { createAdminClient } from "@/lib/supabase/server";
import { resolveAccess, type FeatureFlag, type AccessInfo } from "./features";

export class PlanService {
  static async getPlanBySlug(slug: string): Promise<{
    id: string;
    slug: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    businessLimit: number;
  } | null> {
    const supabase = createAdminClient() as any;

    const { data } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      priceMonthly: data.price_monthly,
      priceYearly: data.price_yearly,
      features: data.features || [],
      businessLimit: data.business_limit || 1,
    };
  }

  static async getPlanById(id: string): Promise<{
    slug: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    businessLimit: number;
  } | null> {
    const supabase = createAdminClient() as any;

    const { data } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;

    return {
      slug: data.slug,
      name: data.name,
      priceMonthly: data.price_monthly,
      priceYearly: data.price_yearly,
      features: data.features || [],
      businessLimit: data.business_limit || 1,
    };
  }

  static async getUserPlanAccess(userId: string): Promise<AccessInfo> {
    const supabase = createAdminClient() as any;

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan_id, status")
      .eq("user_id", userId)
      .in("status", ["active", "trial"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let planSlug: string | null = null;
    if (sub?.plan_id) {
      const plan = await this.getPlanById(sub.plan_id);
      if (plan) planSlug = plan.slug;
    }

    return await resolveAccess(planSlug, sub?.status || null);
  }

  static async getUserPlan(userId: string): Promise<{
    planId: string | null;
    planName: string;
    billingCycle: string;
    status: string;
    startDate: string;
    nextRenewal: string;
    cancelledAt: string | null;
    pendingPlanId: string | null;
    pendingPlanName: string | null;
  } | null> {
    const supabase = createAdminClient() as any;

    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!subs) return null;

    const plan = subs.plan_id ? await this.getPlanById(subs.plan_id) : null;
    const access = await resolveAccess(plan?.slug || null, subs.status);

    let pendingSlug: string | null = null;
    let pendingName: string | null = null;
    if ((subs as any).pending_plan_id) {
      const pendingPlan = await this.getPlanById((subs as any).pending_plan_id);
      if (pendingPlan) {
        pendingSlug = pendingPlan.slug;
        pendingName = pendingPlan.name;
      }
    }

    return {
      planId: access.planId,
      planName: access.planName,
      billingCycle: "monthly",
      status: subs.status,
      startDate: subs.current_period_start,
      nextRenewal: subs.current_period_end,
      cancelledAt: subs.cancelled_at,
      pendingPlanId: pendingSlug,
      pendingPlanName: pendingName,
    };
  }

  static async getAllPlans(): Promise<Array<{
    slug: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    businessLimit: number;
  }>> {
    const supabase = createAdminClient() as any;

    const { data } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly", { ascending: true });

    return (data || []).map((p: any) => ({
      slug: p.slug,
      name: p.name,
      priceMonthly: p.price_monthly,
      priceYearly: p.price_yearly,
      features: p.features || [],
      businessLimit: p.business_limit || 1,
    }));
  }
}

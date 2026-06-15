import { createAdminClient } from "@/lib/supabase/server";
import { resolveAccess } from "@/lib/billing/features";

export interface CreateBusinessResult {
  id: string;
  name: string;
}

export class BusinessService {
  static async checkSubscription(userId: string): Promise<{ planSlug: string | null; limit: number }> {
    const supabase = createAdminClient() as any;

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan_id, status")
      .eq("user_id", userId)
      .in("status", ["active", "trial"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      throw Object.assign(new Error("A subscription is required to create a business. Please subscribe to a plan first."), { code: "payment_required", status: 402 });
    }

    let planSlug: string | null = null;
    if (sub.plan_id) {
      const { data: plan } = await supabase
        .from("subscription_plans")
        .select("slug")
        .eq("id", sub.plan_id)
        .maybeSingle();
      if (plan) planSlug = plan.slug;
    }

    const access = await resolveAccess(planSlug, "active");
    const limit = access.limits.businesses || 1;
    return { planSlug, limit };
  }

  static async checkBusinessLimit(userId: string, limit: number): Promise<void> {
    const supabase = createAdminClient() as any;

    const { count: bizCount } = await supabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (bizCount !== null && bizCount !== undefined && bizCount >= limit) {
      throw Object.assign(
        new Error(`Your plan allows up to ${limit} business${limit > 1 ? "es" : ""}. Upgrade to add more.`),
        { status: 403 }
      );
    }
  }

  static async findExistingByName(userId: string, name: string): Promise<{ id: string; name: string } | null> {
    const supabase = createAdminClient() as any;

    const { data } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("user_id", userId)
      .eq("name", name)
      .maybeSingle();

    return data;
  }

  static async addExistingBusinessMember(businessId: string, userId: string): Promise<void> {
    const supabase = createAdminClient() as any;

    await supabase.from("business_members").insert({
      business_id: businessId,
      user_id: userId,
      role: "owner",
      invited_by: userId,
      invited_at: new Date().toISOString(),
      joined_at: new Date().toISOString(),
    }).maybeSingle();
  }

  static async create(input: {
    userId: string;
    name: string;
    description?: string;
    industrySlug?: string;
    subIndustrySlug?: string;
    stateSlug?: string;
    lgaId?: string;
    website?: string;
    employeeCount?: string;
    details?: any;
  }): Promise<CreateBusinessResult> {
    const supabase = createAdminClient() as any;

    let industry_id = null;
    if (input.industrySlug) {
      const { data: ind } = await supabase.from("industries").select("id").eq("slug", input.industrySlug).maybeSingle();
      if (ind) industry_id = ind.id;
    }

    let sub_industry_id = null;
    if (input.subIndustrySlug && industry_id) {
      const { data: subInd } = await supabase
        .from("sub_industries")
        .select("id")
        .eq("slug", input.subIndustrySlug)
        .eq("industry_id", industry_id)
        .maybeSingle();
      if (subInd) sub_industry_id = subInd.id;
    }

    let state_id = null;
    if (input.stateSlug) {
      const { data: st } = await supabase.from("states").select("id").ilike("name", input.stateSlug).maybeSingle();
      if (st) state_id = st.id;
    }

    let country_id = null;
    const { data: ng } = await supabase.from("countries").select("id").eq("code", "NG").maybeSingle();
    if (ng) country_id = ng.id;

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: input.userId,
        name: input.name,
        description: input.description || null,
        website: input.website || null,
        employee_count: input.employeeCount ? parseInt(input.employeeCount, 10) || null : null,
        details: input.details || {},
        status: "active",
        industry_id,
        sub_industry_id,
        state_id,
        country_id,
        lga_id: input.lgaId || null,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("business_members").insert({
      business_id: data.id,
      user_id: input.userId,
      role: "owner",
      invited_by: input.userId,
      invited_at: new Date().toISOString(),
      joined_at: new Date().toISOString(),
    });

    return { id: data.id, name: data.name };
  }

  static async list(userId: string): Promise<any[]> {
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description || "",
      industryId: row.industry_id,
      stateId: row.state_id,
      status: row.status,
      employeeCount: row.employee_count,
      website: row.website,
      details: row.details || {},
      createdAt: row.created_at,
    }));
  }
}

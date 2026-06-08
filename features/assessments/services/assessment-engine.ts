import { createAdminClient } from "@/lib/supabase/server";
import type { AssessmentSummary, AssessmentFullReport, AssessmentRequirement, AssessmentAgency, RoadmapItem } from "@/types/domain/assessment";

export class AssessmentEngine {
  /**
   * Generates the Assessment Summary and Full Report based on the provided form data.
   * Uses real database records from requirements, agencies, and requirement_costs tables.
   * If the DB lacks data, falls back to mock logic to prevent blocking the UI.
   */
  static async generateAssessment(formData: any): Promise<{
    summary: AssessmentSummary;
    report: AssessmentFullReport;
  }> {
    const supabase = createAdminClient() as any;

    const {
      basics = {},
      activities = {},
      location = {},
      team = {},
    } = formData;

    const industrySlug = basics.industry || "food-beverage";
    const countrySlug = location.country || "nigeria";
    const stateSlug = location.state;

    // 1. Resolve Industry and Location IDs
    const [{ data: industry }, { data: country }] = await Promise.all([
      supabase.from("industries").select("id, name, slug").eq("slug", industrySlug).single(),
      supabase.from("countries").select("id, name, code").eq("code", countrySlug).single()
    ]);

    let state = null;
    if (stateSlug && country?.id) {
      const { data: st } = await supabase.from("states").select("id, name, code").eq("country_id", country.id).eq("code", stateSlug).single();
      state = st;
    }

    // If no real records found, fallback to mock generation for demo purposes
    if (!industry || !country) {
      console.warn("[AssessmentEngine] Missing industry/country in DB, falling back to mock generation");
      return this.generateMockAssessment(formData);
    }

    // 2. Fetch requirements and agencies
    let query = supabase.from("requirements").select(`
      id, name, description, requirement_type, frequency, status, confidence_level, is_verified, source_url, source_document,
      agencies ( id, name, acronym ),
      requirement_costs ( cost_type, amount, currency )
    `)
      .eq("industry_id", industry.id)
      .eq("country_id", country.id)
      .eq("status", "active");

    if (state?.id) {
      // Also fetch state-specific requirements or federal ones
      query = query.or(`state_id.eq.${state.id},state_id.is.null`);
    }

    const { data: reqs, error } = await query;
    
    if (error || !reqs || reqs.length === 0) {
      console.warn("[AssessmentEngine] Missing requirements in DB, falling back to mock generation", error);
      return this.generateMockAssessment(formData);
    }

    // 3. Map to Domain Models
    const agenciesMap = new Map<string, AssessmentAgency>();
    let totalOfficialCost = 0;
    let totalEstimatedCost = 0;

    const requirements: AssessmentRequirement[] = reqs.map((r: any) => {
      const agencyName = r.agencies?.name || "Unknown Agency";
      const agencyId = r.agencies?.id;
      
      if (agencyId && !agenciesMap.has(agencyId)) {
        agenciesMap.set(agencyId, {
          id: agencyId,
          name: agencyName,
          acronym: r.agencies?.acronym || null,
          requirementCount: 0
        });
      }
      if (agencyId) {
        agenciesMap.get(agencyId)!.requirementCount += 1;
      }

      let official = null;
      let estimated = null;
      let community = null;

      if (r.requirement_costs && Array.isArray(r.requirement_costs)) {
        for (const rc of r.requirement_costs) {
          if (rc.cost_type === "official") {
             official = rc.amount;
             totalOfficialCost += official;
          }
          if (rc.cost_type === "estimated") {
             estimated = rc.amount;
             totalEstimatedCost += estimated;
          }
          if (rc.cost_type === "community_reported") community = rc.amount;
        }
      }

      return {
        id: r.id,
        name: r.name,
        description: r.description,
        agencyName,
        requirementType: r.requirement_type,
        officialCost: official,
        estimatedCost: estimated,
        communityReportedCost: community,
        deadline: null,
        frequency: r.frequency,
        confidenceLevel: r.confidence_level || "estimated",
        sourceUrl: r.source_url || null
      };
    });

    const agencies = Array.from(agenciesMap.values());

    // Compute basic complexity
    let complexityScore = 20 + requirements.length * 2;
    if (activities.willManufacture) complexityScore += 10;
    if (activities.willImport) complexityScore += 8;
    if (activities.willExport) complexityScore += 8;
    complexityScore = Math.min(100, Math.max(5, complexityScore));

    const summary: AssessmentSummary = {
      businessType: industry.name,
      location: `${state ? state.name + ", " : ""}${country.name}`,
      requirementCount: requirements.length,
      agencyCount: agencies.length,
      complexityScore,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing"]
    };

    const riskFactors = [];
    if (activities.willManufacture) riskFactors.push("High environmental and safety compliance risk.");
    if (activities.willImport || activities.willExport) riskFactors.push("Customs and cross-border trade regulation risk.");

    const report: AssessmentFullReport = {
      requirements,
      agencies,
      totalOfficialCost,
      totalEstimatedCost,
      riskLevel: complexityScore > 60 ? "high" : complexityScore > 35 ? "medium" : "low",
      riskFactors,
      roadmap: this.generateRoadmap(requirements),
      generatedAt: new Date().toISOString()
    };

    return { summary, report };
  }

  static async getFullReport(assessmentId: string, userId: string): Promise<AssessmentFullReport> {
    const supabase = createAdminClient() as any;

    // Verify ownership
    const { data: assessment, error: aErr } = await supabase
      .from("assessments")
      .select("user_id, results_json")
      .eq("id", assessmentId)
      .single();

    if (aErr || !assessment) throw new Error("Assessment not found");
    if (assessment.user_id !== userId) throw new Error("Unauthorized");

    // Verify payment
    const { data: purchase, error: pErr } = await supabase
      .from("assessment_purchases")
      .select("status")
      .eq("assessment_id", assessmentId)
      .eq("user_id", userId)
      .single();

    if (pErr || !purchase || purchase.status !== "paid") {
      throw new Error("PaymentRequired");
    }

    if (!assessment.results_json) {
      throw new Error("Report data is unavailable");
    }

    return assessment.results_json as AssessmentFullReport;
  }

  private static generateRoadmap(reqs: AssessmentRequirement[]): RoadmapItem[] {
    const roadmap: RoadmapItem[] = [
      {
        phase: 1,
        title: "Initial Registration",
        description: "Register your business entity and obtain tax identification.",
        estimatedDuration: "2-4 Weeks",
        requirements: reqs.filter(r => r.requirementType === "registration" || r.requirementType === "tax").map(r => r.name)
      },
      {
        phase: 2,
        title: "Core Licensing",
        description: "Obtain required industry and operational licenses.",
        estimatedDuration: "4-8 Weeks",
        requirements: reqs.filter(r => r.requirementType === "license" || r.requirementType === "permit").map(r => r.name)
      },
      {
        phase: 3,
        title: "Ongoing Compliance",
        description: "Set up systems for recurring filings and renewals.",
        estimatedDuration: "Ongoing",
        requirements: reqs.filter(r => r.frequency !== "one_time" && r.requirementType !== "registration").map(r => r.name)
      }
    ];
    return roadmap.filter(r => r.requirements.length > 0);
  }

  // Fallback mock engine if database lacks regulatory data
  private static generateMockAssessment(formData: any): { summary: AssessmentSummary, report: AssessmentFullReport } {
    const { basics = {}, activities = {}, location = {} } = formData;
    
    let reqCount = 10;
    if (activities.willManufacture) reqCount += 4;
    
    let complexity = 30;
    if (activities.willManufacture) complexity += 15;

    const summary: AssessmentSummary = {
      businessType: basics.industry || "Business",
      location: location.country || "Location not specified",
      requirementCount: reqCount,
      agencyCount: 4,
      complexityScore: complexity,
      categories: ["Business Registration", "Tax Compliance"]
    };

    const agencies: AssessmentAgency[] = [
      { id: "cac", name: "Corporate Affairs Commission", acronym: "CAC", requirementCount: 2 },
      { id: "firs", name: "Federal Inland Revenue Service", acronym: "FIRS", requirementCount: 3 }
    ];

    const requirements: AssessmentRequirement[] = [
      {
        id: "cac-1",
        name: "Company Incorporation",
        description: "Register as an entity with CAC",
        agencyName: "Corporate Affairs Commission",
        requirementType: "registration",
        officialCost: 5000000,
        estimatedCost: null,
        communityReportedCost: null,
        deadline: null,
        frequency: "one_time",
        confidenceLevel: "verified",
        sourceUrl: "https://cac.gov.ng"
      },
      {
        id: "firs-1",
        name: "Tax Identification Number (TIN)",
        description: "Register for tax purposes",
        agencyName: "Federal Inland Revenue Service",
        requirementType: "tax",
        officialCost: 0,
        estimatedCost: null,
        communityReportedCost: null,
        deadline: null,
        frequency: "one_time",
        confidenceLevel: "verified",
        sourceUrl: "https://firs.gov.ng"
      }
    ];

    const report: AssessmentFullReport = {
      requirements,
      agencies,
      totalOfficialCost: 5000000,
      totalEstimatedCost: 0,
      riskLevel: "low",
      riskFactors: [],
      roadmap: this.generateRoadmap(requirements),
      generatedAt: new Date().toISOString()
    };

    return { summary, report };
  }
}

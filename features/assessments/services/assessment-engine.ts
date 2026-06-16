import { createAdminClient } from "@/lib/supabase/server";
import type { AssessmentSummary, AssessmentFullReport, AssessmentRequirement, AssessmentAgency, RoadmapItem } from "@/types/domain/assessment";

export class AssessmentEngine {
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

    // Map frontend country identifiers to DB codes
    const COUNTRY_CODES: Record<string, string> = {
      nigeria: "NG",
    };
    const dbCountryCode = COUNTRY_CODES[countrySlug] || countrySlug;

    // Some DB industries have both a generic slug and a frontend-specific slug.
    // When looking up requirements, include both so the user sees the full set.
    const INDUSTRY_PAIRS: Record<string, string[]> = {
      "health-pharma": ["healthcare", "health-pharma"],
      "healthcare": ["healthcare", "health-pharma"],
      "technology-saas": ["technology", "technology-saas"],
      "technology": ["technology", "technology-saas"],
      "finance-fintech": ["finance", "financial-services", "finance-fintech"],
      "finance": ["finance", "financial-services", "finance-fintech"],
      "financial-services": ["finance", "financial-services", "finance-fintech"],
    };

    const [{ data: industry }, { data: country }] = await Promise.all([
      supabase.from("industries").select("id, name, slug").eq("slug", industrySlug).single(),
      supabase.from("countries").select("id, name, code").eq("code", dbCountryCode).single()
    ]);

    if (!industry || !country) {
      throw new Error("Unable to resolve industry or country from the provided data.");
    }

    let state = null;
    if (stateSlug && country?.id) {
      const { data: st } = await supabase.from("states").select("id, name, code").eq("country_id", country.id).eq("code", stateSlug).single();
      state = st;
    }

    // Resolve all paired industry IDs for requirement lookup
    const pairedSlugs = INDUSTRY_PAIRS[industrySlug] || [industrySlug];
    const { data: allIndustries } = await supabase
      .from("industries")
      .select("id")
      .in("slug", pairedSlugs);

    const industryIds = allIndustries?.map((i: any) => i.id) || [industry.id];

    let query = supabase.from("requirements").select(`
      id, name, description, requirement_type, frequency, status, confidence_level, is_verified, source_url, source_document,
      agencies ( id, name, acronym ),
      requirement_costs ( cost_type, amount, currency )
    `)
      .in("industry_id", industryIds)
      .eq("country_id", country.id)
      .eq("status", "active");

    if (state?.id) {
      query = query.or(`state_id.eq.${state.id},state_id.is.null`);
    }

    const { data: reqs, error } = await query;

    if (error || !reqs || reqs.length === 0) {
      throw new Error(
        `No compliance requirements found for ${industry.name} (slug: ${industrySlug}, paired: ${pairedSlugs.join(",")}, industryIds: ${industryIds.join(",")}) in ${country.name}. Please contact support.`
      );
    }

    // Deduplicate requirements by name — paired industries may share the same requirements
    const seen = new Set<string>();
    const unique = reqs.filter((r: any) => {
      if (seen.has(r.name)) return false;
      seen.add(r.name);
      return true;
    });

    const agenciesMap = new Map<string, AssessmentAgency>();
    let totalOfficialCost = 0;
    let totalEstimatedCost = 0;

    const requirements: AssessmentRequirement[] = unique.map((r: any) => {
      const agencyName = r.agencies?.name || "Unknown Agency";
      const agencyId = r.agencies?.id;

      if (agencyId && !agenciesMap.has(agencyId)) {
        agenciesMap.set(agencyId, {
          id: agencyId,
          name: agencyName,
          acronym: r.agencies?.acronym || null,
          requirementCount: 0,
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
        sourceUrl: r.source_url || null,
      };
    });

    const agencies = Array.from(agenciesMap.values());

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
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing"],
    };

    const riskFactors = this.generateRiskFactors(industrySlug, activities, requirements.length);

    // Category 1: Official compliance costs (with 30% buffer for the high end)
    const officialMin = totalOfficialCost;
    const officialMax = Math.round(totalOfficialCost * 1.3) + totalEstimatedCost;

    // Category 2: Common business setup costs (industry-agnostic, varies by business complexity)
    const commonItems = this.generateCommonSetupCosts(requirements.length, !!activities.willManufacture);
    const commonMin = commonItems.reduce((s, i) => s + i.min, 0);
    const commonMax = commonItems.reduce((s, i) => s + i.max, 0);

    // Category 3: Potential local costs & levies
    const localItems = this.generateLocalCosts(state?.name || null);

    // Overall budget range
    const budgetMin = officialMin + commonMin;
    const budgetMax = officialMax + commonMax;

    const report: AssessmentFullReport = {
      requirements,
      agencies,
      officialCosts: {
        label: "Official Compliance Costs",
        min: officialMin,
        max: officialMax,
      },
      commonSetupCosts: commonItems.map((i) => ({ label: i.label, range: i.rangeStr, reason: i.reason })),
      commonSetupCostRange: {
        label: "Common Setup Costs",
        min: commonMin,
        max: commonMax,
      },
      localCosts: localItems,
      localCostNote: "These costs vary significantly by location and may not apply to every business. Verify locally before budgeting.",
      estimatedBudget: {
        label: "Estimated Launch Budget",
        min: budgetMin,
        max: budgetMax,
      },
      riskLevel: complexityScore > 60 ? "high" : complexityScore > 35 ? "medium" : "low",
      riskFactors,
      roadmap: this.generateRoadmap(requirements),
      generatedAt: new Date().toISOString(),
    };

    return { summary, report };
  }

  static async getFullReport(assessmentId: string, userId: string): Promise<AssessmentFullReport> {
    const supabase = createAdminClient() as any;

    const { data: assessment, error: aErr } = await supabase
      .from("assessments")
      .select("user_id, results_json")
      .eq("id", assessmentId)
      .single();

    if (aErr || !assessment) throw new Error("Assessment not found");

    // Allow if user owns the assessment, OR assessment is anonymous (no userId)
    if (assessment.user_id && assessment.user_id !== userId) throw new Error("Unauthorized");

    if (!assessment.results_json) {
      throw new Error("Report data is unavailable");
    }

    // Upgrade old-format reports to the new 3-category cost structure
    const report = assessment.results_json as any;
    if (report.totalOfficialCost !== undefined && !report.officialCosts) {
      const officialMin = report.totalOfficialCost || 0;
      const officialMax = Math.round(officialMin * 1.3) + (report.totalEstimatedCost || 0);
      report.officialCosts = { label: "Official Compliance Costs", min: officialMin, max: officialMax };
      report.commonSetupCosts = [
        { label: "Legal & Documentation Services", range: "₦50,000 – ₦150,000", reason: "Professional fees for business registration and legal advice" },
        { label: "Business Registration Processing", range: "₦20,000 – ₦50,000", reason: "Filing fees and processing charges" },
      ];
      report.commonSetupCostRange = { label: "Common Setup Costs", min: 7000000, max: 20000000 };
      report.localCosts = [
        { label: "Local Government Development Levy", note: "Annual levy charged by some LGAs" },
        { label: "Market or Trade Association Fees", note: "May be required depending on location" },
      ];
      report.localCostNote = "These costs vary significantly by location. Verify locally before budgeting.";
      report.estimatedBudget = { label: "Estimated Launch Budget", min: officialMin + 7000000, max: officialMax + 20000000 };
      delete report.totalOfficialCost;
      delete report.totalEstimatedCost;
    }

    return report as AssessmentFullReport;
  }

  private static generateRiskFactors(industrySlug: string, activities: any, reqCount: number): string[] {
    const factors: string[] = [];

    // General risks that apply to all businesses
    factors.push("Failure to register your business before commencing operations can result in fines, legal penalties, and difficulty opening bank accounts.");
    factors.push("Non-compliance with tax regulations (VAT, PAYE, CIT) may lead to penalties, interest charges, audits, and business closure by tax authorities.");
    factors.push("Operating without required licenses and permits exposes your business to regulatory sanctions, shutdown orders, and reputational damage.");

    // Activity-based risks
    if (activities.willManufacture) {
      factors.push("Manufacturing operations without environmental impact assessment and waste management permits risk NESREA enforcement actions and fines.");
    }
    if (activities.willImport || activities.willExport) {
      factors.push("Cross-border trade without proper customs documentation and permits risks seizure of goods, customs penalties, and import/export bans.");
    }
    if (activities.willOperateOnline) {
      factors.push("Online operations without data protection compliance risk NDPC enforcement, data breach liability, and customer trust erosion.");
    }
    if (activities.hasPhysicalLocation) {
      factors.push("Operating a physical premises without the required local government permits, fire safety clearance, and health inspections risks closure orders.");
    }


    // Industry-specific risks
    const industryRisks: Record<string, string[]> = {
      "health-pharma": [
        "Operating a healthcare facility without PCN licensing and NAFDAC drug registration risks patient harm, professional license revocation, and criminal liability.",
      ],
      "healthcare": [
        "Operating a healthcare facility without PCN licensing and NAFDAC drug registration risks patient harm, professional license revocation, and criminal liability.",
      ],
      "finance-fintech": [
        "Providing financial services without CBN licensing and SCUML registration risks criminal prosecution, asset forfeiture, and unlimited fines.",
      ],
      "financial-services": [
        "Providing financial services without CBN licensing and SCUML registration risks criminal prosecution, asset forfeiture, and unlimited fines.",
      ],
      "finance": [
        "Providing financial services without CBN licensing and SCUML registration risks criminal prosecution, asset forfeiture, and unlimited fines.",
      ],
      "food-beverage": [
        "Operating a food business without NAFDAC product registration and food safety certification risks product seizure, consumer illness, and business closure.",
      ],
      "manufacturing": [
        "Manufacturing without SON standards certification and factory registration exposes your business to product liability claims and regulatory sanctions.",
      ],
      "retail-ecommerce": [
        "E-commerce operations without consumer protection registration and SON product certification risks FCCPC enforcement actions and customer lawsuits.",
      ],
      "technology-saas": [
        "Technology platforms handling user data without NDPC compliance and data protection audits risk regulatory fines and data breach liability.",
      ],
      "technology": [
        "Technology platforms handling user data without NDPC compliance and data protection audits risk regulatory fines and data breach liability.",
      ],
      "agriculture": [
        "Agricultural operations without environmental permits and phytosanitary certificates risk land use disputes and export restrictions.",
      ],
      "education": [
        "Operating an educational institution without Ministry of Education approval risks student credential invalidation and immediate closure orders.",
      ],
      "transportation-logistics": [
        "Transport and logistics operations without proper vehicle registration, operator licenses, and insurance risk accidents, legal liability, and impoundment.",
      ],
      "real-estate-construction": [
        "Construction without approved building plans and CORBON-registered contractors risks structural collapse, legal liability, and demolition orders.",
      ],
      "energy-mining": [
        "Energy and mining operations without NERC licenses, mining leases, and environmental impact assessments risk project shutdown and criminal prosecution.",
      ],
      "fashion-apparel": [
        "Textile and apparel businesses without SON standards compliance and NAFDAC registration risk product rejection, import/export restrictions, and brand damage.",
      ],
      "professional-services": [
        "Professional service firms without professional indemnity insurance and regulatory body registration risk malpractice liability and loss of practicing license.",
      ],
    };

    const matched = industryRisks[industrySlug];
    if (matched) {
      factors.push(...matched);
    }

    // If we have many requirements, add a complexity-based risk
    if (reqCount > 15) {
      factors.push(`With ${reqCount} regulatory requirements to fulfill, you have a high-compliance-burden business. Consider engaging a compliance professional to manage these obligations.`);
    } else if (reqCount > 10) {
      factors.push(`With ${reqCount} regulatory requirements to fulfill, your business has a moderate compliance burden. Stay organized with a compliance tracking system.`);
    }

    return factors;
  }

  private static generateCommonSetupCosts(reqCount: number, hasManufacturing: boolean): Array<{ label: string; min: number; max: number; rangeStr: string; reason: string }> {
    const items: Array<{ label: string; min: number; max: number; rangeStr: string; reason: string }> = [
      { label: "Legal & Documentation Services", min: 5000000, max: 15000000, rangeStr: "₦50,000 – ₦150,000", reason: "Professional fees for business registration, document preparation, and legal advice" },
      { label: "Business Registration Processing", min: 2000000, max: 5000000, rangeStr: "₦20,000 – ₦50,000", reason: "Filing fees, stamp duties, and processing charges beyond official CAC fees" },
    ];

    if (reqCount > 8) {
      items.push({ label: "Compliance Documentation", min: 3000000, max: 10000000, rangeStr: "₦30,000 – ₦100,000", reason: "Preparing compliance manuals, policies, and regulatory filings" });
    }

    if (hasManufacturing) {
      items.push({ label: "Inspection Preparation", min: 5000000, max: 20000000, rangeStr: "₦50,000 – ₦200,000", reason: "Site preparation, equipment calibration, and inspection readiness" });
    }

    items.push({ label: "Miscellaneous Setup Expenses", min: 1000000, max: 3000000, rangeStr: "₦10,000 – ₦30,000", reason: "Transport, communication, and incidental expenses during registration" });

    return items;
  }

  private static generateLocalCosts(stateName: string | null): Array<{ label: string; note: string }> {
    const items: Array<{ label: string; note: string }> = [
      { label: "Local Government Development Levy", note: "Annual levy charged by some LGAs for business operation within their jurisdiction" },
      { label: "Market or Trade Association Fees", note: "May be required depending on your business location and industry" },
    ];

    if (stateName === "Lagos") {
      items.push({ label: "Lagos State Safety Commission Levy", note: "Annual safety compliance levy for businesses operating in Lagos" });
      items.push({ label: "Signage and Advertisement Levy", note: "Lagos State Signage Agency (LASSA) charges for business signage" });
    }

    return items;
  }

  private static generateRoadmap(reqs: AssessmentRequirement[]): RoadmapItem[] {
    const roadmap: RoadmapItem[] = [
      {
        phase: 1,
        title: "Initial Registration",
        description: "Register your business entity and obtain tax identification.",
        estimatedDuration: "2-4 Weeks",
        requirements: reqs.filter(r => r.requirementType === "registration" || r.requirementType === "tax").map(r => r.name),
      },
      {
        phase: 2,
        title: "Core Licensing",
        description: "Obtain required industry and operational licenses.",
        estimatedDuration: "4-8 Weeks",
        requirements: reqs.filter(r => r.requirementType === "license" || r.requirementType === "permit").map(r => r.name),
      },
      {
        phase: 3,
        title: "Ongoing Compliance",
        description: "Set up systems for recurring filings and renewals.",
        estimatedDuration: "Ongoing",
        requirements: reqs.filter(r => r.frequency !== "one_time" && r.requirementType !== "registration").map(r => r.name),
      },
    ];
    return roadmap.filter(r => r.requirements.length > 0);
  }
}

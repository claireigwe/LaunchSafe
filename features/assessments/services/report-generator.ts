import type { AssessmentFullReport, AssessmentRequirement, AssessmentAgency, RoadmapItem } from '@/types/domain/assessment';

export function generateFullReport(formData: any): AssessmentFullReport {
  const basics = formData.basics || {};
  const activities = formData.activities || {};
  const location = formData.location || {};
  const team = formData.team || {};
  const industry = basics.industry || "";

  const industryConfig = getFullIndustryConfig(industry);

  const requirements = buildRequirements(industryConfig, { activities, location, team, basics });
  const agencies = buildAgencies(requirements);
  const costs = calculateCosts(requirements);
  const riskLevel = calculateRiskLevel(industryConfig.complexityBase, activities, location);
  const riskFactors = buildRiskFactors(riskLevel, industry);
  const roadmap = buildRoadmap(industry, requirements);

  return {
    requirements,
    agencies,
    totalOfficialCost: costs.official,
    totalEstimatedCost: costs.estimated,
    riskLevel,
    riskFactors,
    roadmap,
    generatedAt: new Date().toISOString(),
  };
}

function getFullIndustryConfig(industryId: string) {
  const configs: Record<string, any> = {
    "food-beverage": {
      label: "Food & Beverage Business",
      baseRequirements: 10, baseAgencies: 5, complexityBase: 35,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Health & Safety", "Food Safety", "Employment Compliance"],
    },
    "health-pharma": {
      label: "Healthcare Business",
      baseRequirements: 14, baseAgencies: 6, complexityBase: 45,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Healthcare Regulation", "Health & Safety", "Data Protection", "Employment Compliance"],
    },
    "technology-saas": {
      label: "Technology Business",
      baseRequirements: 8, baseAgencies: 4, complexityBase: 25,
      categories: ["Business Registration", "Tax Compliance", "Data Protection", "Industry Licensing"],
    },
    "retail-ecommerce": {
      label: "Retail Business",
      baseRequirements: 9, baseAgencies: 4, complexityBase: 28,
      categories: ["Business Registration", "Tax Compliance", "Trade License", "Industry Licensing"],
    },
    manufacturing: {
      label: "Manufacturing Business",
      baseRequirements: 13, baseAgencies: 6, complexityBase: 42,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Environmental Compliance", "Health & Safety", "Employment Compliance", "Import/Export Regulations"],
    },
    agriculture: {
      label: "Agricultural Business",
      baseRequirements: 10, baseAgencies: 5, complexityBase: 30,
      categories: ["Business Registration", "Tax Compliance", "Environmental Compliance", "Health & Safety", "Import/Export Regulations", "Industry Licensing"],
    },
    education: {
      label: "Education Business",
      baseRequirements: 8, baseAgencies: 4, complexityBase: 22,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Employment Compliance"],
    },
    "finance-fintech": {
      label: "Financial Services Business",
      baseRequirements: 15, baseAgencies: 7, complexityBase: 55,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Financial Regulation", "Data Protection", "Employment Compliance", "Anti-Money Laundering"],
    },
    "real-estate-construction": {
      label: "Real Estate & Construction Business",
      baseRequirements: 11, baseAgencies: 5, complexityBase: 38,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Environmental Compliance", "Health & Safety", "Employment Compliance"],
    },
    "professional-services": {
      label: "Professional Services Firm",
      baseRequirements: 7, baseAgencies: 3, complexityBase: 18,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Employment Compliance"],
    },
    "transportation-logistics": {
      label: "Transportation & Logistics Business",
      baseRequirements: 10, baseAgencies: 5, complexityBase: 32,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Transport Regulation", "Employment Compliance"],
    },
    "energy-mining": {
      label: "Energy & Mining Business",
      baseRequirements: 16, baseAgencies: 8, complexityBase: 52,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Environmental Compliance", "Health & Safety", "Employment Compliance", "Import/Export Regulations"],
    },
    "fashion-apparel": {
      label: "Fashion & Apparel Business",
      baseRequirements: 8, baseAgencies: 4, complexityBase: 22,
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Trade License", "Employment Compliance"],
    },
  };

  const aliases: Record<string, string> = {
    "healthcare": "health-pharma",
    "technology": "technology-saas",
    "financial-services": "finance-fintech",
    "general-business": "professional-services",
  };
  const resolvedId = aliases[industryId] || industryId;

  return configs[resolvedId] || { label: "Business", baseRequirements: 7, baseAgencies: 3, complexityBase: 20, categories: ["Business Registration", "Tax Compliance"] };
}

function buildRequirements(config: any, context: any): any[] {
  const reqs: any[] = [];
  const { activities, location, team, basics } = context;
  const stage = basics.businessStage || "idea";

  reqs.push({
    id: "reg-001",
    name: "Business Name Registration",
    description: "Register your business name with the Corporate Affairs Commission (CAC) to establish your business as a legal entity.",
    agencyName: "Corporate Affairs Commission (CAC)",
    requirementType: "registration",
    officialCost: 50000,
    estimatedCost: 50000,
    communityReportedCost: null,
    deadline: "Before commencing operations",
    frequency: "one-time",
    confidenceLevel: "verified",
    sourceUrl: "https://www.cac.gov.ng",
  });

  reqs.push({
    id: "reg-002",
    name: "Tax Identification Number (TIN)",
    description: "Register for a Tax Identification Number with the Federal Inland Revenue Service (FIRS) for tax compliance.",
    agencyName: "Federal Inland Revenue Service (FIRS)",
    requirementType: "registration",
    officialCost: 0,
    estimatedCost: 0,
    communityReportedCost: null,
    deadline: "Within 30 days of registration",
    frequency: "one-time",
    confidenceLevel: "verified",
    sourceUrl: "https://www.firs.gov.ng",
  });

  if (team.employeeCount && team.employeeCount !== "1") {
    reqs.push({
      id: "reg-003",
      name: "PAYE Tax Registration",
      description: "Register for Pay-As-You-Earn (PAYE) tax to deduct employee income tax at source.",
      agencyName: "State Internal Revenue Service",
      requirementType: "tax",
      officialCost: 0,
      estimatedCost: 0,
      communityReportedCost: null,
      deadline: "Before hiring first employee",
      frequency: "monthly",
      confidenceLevel: "verified",
      sourceUrl: null,
    });
  }

  if (activities.willImport || activities.willExport) {
    reqs.push({
      id: "reg-004",
      name: "Import/Export License",
      description: "Obtain an import/export license from the Nigerian Customs Service to legally import or export goods.",
      agencyName: "Nigeria Customs Service (NCS)",
      requirementType: "license",
      officialCost: 35000,
      estimatedCost: 50000,
      communityReportedCost: 75000,
      deadline: "Before first import/export shipment",
      frequency: "annual",
      confidenceLevel: "estimated",
      sourceUrl: "https://www.customs.gov.ng",
    });
  }

  if (activities.willManufacture || activities.hasPhysicalLocation) {
    reqs.push({
      id: "reg-005",
      name: "Business Premises Permit",
      description: "Obtain a premises permit from your local government authority to operate from a physical location.",
      agencyName: "Local Government Authority",
      requirementType: "permit",
      officialCost: 15000,
      estimatedCost: 25000,
      communityReportedCost: 30000,
      deadline: "Before opening physical location",
      frequency: "annual",
      confidenceLevel: "estimated",
      sourceUrl: null,
    });
  }

  if (activities.willOperateOnline) {
    reqs.push({
      id: "reg-006",
      name: "Data Protection Compliance",
      description: "Register with the Nigeria Data Protection Commission (NDPC) and implement data protection policies.",
      agencyName: "Nigeria Data Protection Commission (NDPC)",
      requirementType: "compliance",
      officialCost: 10000,
      estimatedCost: 15000,
      communityReportedCost: 25000,
      deadline: "Within 90 days of launching online platform",
      frequency: "annual",
      confidenceLevel: "estimated",
      sourceUrl: "https://www.ndpc.gov.ng",
    });
  }

  if (location.handlesRegulatedGoods || ["food-beverage", "health-pharma"].includes(config.label.toLowerCase().includes("food") ? "food-beverage" : "")) {
    if (["food-beverage", "health-pharma"].some((id) => context.basics.industry === id)) {
      const isFood = context.basics.industry === "food-beverage";
      reqs.push({
        id: "reg-007",
        name: isFood ? "Food Safety Certification" : "Product Registration (NAFDAC)",
        description: isFood
          ? "Register your food products with NAFDAC for safety certification and quality assurance."
          : "Register your health and pharmaceutical products with NAFDAC for safety and efficacy approval.",
        agencyName: "NAFDAC",
        requirementType: "certification",
        officialCost: isFood ? 30000 : 50000,
        estimatedCost: isFood ? 45000 : 75000,
        communityReportedCost: isFood ? 60000 : 100000,
        deadline: "Before selling products to the public",
        frequency: "renewable",
        confidenceLevel: "verified",
        sourceUrl: "https://www.nafdac.gov.ng",
      });
    }
  }

  if (team.hireImmediately || (team.employeeCount && team.employeeCount !== "1")) {
    reqs.push({
      id: "reg-008",
      name: "Employee Pension Registration",
      description: "Register with the National Pension Commission (PenCom) and set up pension contributions for employees.",
      agencyName: "National Pension Commission (PenCom)",
      requirementType: "compliance",
      officialCost: 0,
      estimatedCost: 5000,
      communityReportedCost: null,
      deadline: "Within 90 days of hiring first employee",
      frequency: "monthly",
      confidenceLevel: "verified",
      sourceUrl: "https://www.pencom.gov.ng",
    });
  }

  if (activities.willManufacture) {
    reqs.push({
      id: "reg-009",
      name: "Environmental Impact Assessment",
      description: "Conduct an Environmental Impact Assessment (EIA) and obtain clearance from NESREA.",
      agencyName: "National Environmental Standards and Regulations Enforcement Agency (NESREA)",
      requirementType: "assessment",
      officialCost: 100000,
      estimatedCost: 150000,
      communityReportedCost: 200000,
      deadline: "Before commencing manufacturing operations",
      frequency: "one-time",
      confidenceLevel: "estimated",
      sourceUrl: "https://www.nesrea.gov.ng",
    });
  }

  if (location.requiresInspections) {
    reqs.push({
      id: "reg-010",
      name: "Fire Safety Clearance",
      description: "Obtain fire safety clearance from the Federal Fire Service for your business premises.",
      agencyName: "Federal Fire Service",
      requirementType: "clearance",
      officialCost: 15000,
      estimatedCost: 20000,
      communityReportedCost: 35000,
      deadline: "Before opening for business",
      frequency: "annual",
      confidenceLevel: "estimated",
      sourceUrl: null,
    });
  }

  if (basics.industry === "finance-fintech") {
    reqs.push({
      id: "reg-011",
      name: "Financial Services License",
      description: "Obtain a financial services license from the Central Bank of Nigeria (CBN) to offer financial services.",
      agencyName: "Central Bank of Nigeria (CBN)",
      requirementType: "license",
      officialCost: 500000,
      estimatedCost: 750000,
      communityReportedCost: 1000000,
      deadline: "Before offering financial services",
      frequency: "annual",
      confidenceLevel: "verified",
      sourceUrl: "https://www.cbn.gov.ng",
    });
  }

  // Generate industry-specific supplementary requirements
  const additionalReqs = generateIndustrySpecificRequirements(basics.industry, reqs.length, config.baseRequirements || 15);
  reqs.push(...additionalReqs);

  return reqs;
}

function generateIndustrySpecificRequirements(industry: string, currentCount: number, targetCount: number): any[] {
  const additionalReqs: any[] = [];
  const needed = Math.max(0, targetCount - currentCount);
  if (needed === 0) return additionalReqs;

  const aliases: Record<string, string> = {
    "healthcare": "health-pharma",
    "technology": "technology-saas",
    "financial-services": "finance-fintech",
    "general-business": "professional-services",
  };
  const resolvedIndustry = aliases[industry] || industry;

  const templates: Record<string, any[]> = {
    "health-pharma": [
      { name: "Pharmacists Council of Nigeria (PCN) License", agencyName: "Pharmacists Council of Nigeria (PCN)", type: "license", cost: 100000 },
      { name: "Health Facility Monitoring and Accreditation", agencyName: "Ministry of Health", type: "certification", cost: 50000 },
      { name: "Medical Waste Management Permit", agencyName: "Environmental Protection Agency", type: "permit", cost: 30000 },
      { name: "NDLEA Permit for Controlled Substances", agencyName: "NDLEA", type: "permit", cost: 40000 },
      { name: "Clinical Trial Certificate", agencyName: "NAFDAC", type: "certification", cost: 150000 },
      { name: "Radiography Practice License", agencyName: "Radiographers Registration Board", type: "license", cost: 60000 },
      { name: "Medical Laboratory Science Council Registration", agencyName: "MLSCN", type: "registration", cost: 55000 },
      { name: "Health Insurance Scheme Registration", agencyName: "NHIS", type: "registration", cost: 20000 },
    ],
    "food-beverage": [
      { name: "Food Handlers Certificate", agencyName: "Ministry of Health", type: "certification", cost: 15000 },
      { name: "Liquor License", agencyName: "Local Government", type: "license", cost: 25000 },
      { name: "Standard Organization of Nigeria (SON) Certification", agencyName: "SON", type: "certification", cost: 80000 },
      { name: "Environmental Health Permit", agencyName: "Environmental Health Officers Registration Council", type: "permit", cost: 20000 },
      { name: "Food Transport Permit", agencyName: "Ministry of Transportation", type: "permit", cost: 10000 },
      { name: "Water Quality Certification", agencyName: "State Water Board", type: "certification", cost: 30000 },
    ],
    "finance-fintech": [
      { name: "SCUML Registration", agencyName: "EFCC", type: "registration", cost: 0 },
      { name: "NDIC Deposit Insurance", agencyName: "NDIC", type: "compliance", cost: 250000 },
      { name: "Financial Reporting Council Registration", agencyName: "FRC", type: "registration", cost: 100000 },
      { name: "Anti-Money Laundering (AML) Compliance", agencyName: "NFIU", type: "compliance", cost: 50000 },
      { name: "Payment Card Industry Data Security Standard (PCI DSS)", agencyName: "CBN", type: "certification", cost: 300000 },
      { name: "Securities and Exchange Commission (SEC) Registration", agencyName: "SEC", type: "registration", cost: 500000 },
    ],
    "technology-saas": [
      { name: "NITDA Data Protection Compliance", agencyName: "NITDA", type: "compliance", cost: 50000 },
      { name: "Software Copyright Registration", agencyName: "Nigerian Copyright Commission", type: "registration", cost: 30000 },
      { name: "Computer Professionals Registration Council (CPN)", agencyName: "CPN", type: "registration", cost: 40000 },
      { name: "Value Added Service (VAS) License", agencyName: "NCC", type: "license", cost: 100000 },
    ],
    "manufacturing": [
      { name: "SONCAP Certification", agencyName: "SON", type: "certification", cost: 120000 },
      { name: "Factory Registration", agencyName: "Ministry of Labour", type: "registration", cost: 45000 },
      { name: "Solid Waste Management Permit", agencyName: "LAWMA / EPA", type: "permit", cost: 25000 },
      { name: "Manufacturers Association of Nigeria (MAN) Certificate", agencyName: "MAN", type: "certification", cost: 70000 },
      { name: "Heavy Duty Equipment Permit", agencyName: "Ministry of Works", type: "permit", cost: 35000 },
    ],
    "retail-ecommerce": [
      { name: "Consumer Protection Council Registration", agencyName: "FCCPC", type: "registration", cost: 20000 },
      { name: "Advertising Standards Permit", agencyName: "ARCON", type: "permit", cost: 50000 },
      { name: "Signage and Advertisement Agency Permit", agencyName: "State Signage Agency", type: "permit", cost: 15000 },
      { name: "Weights and Measures Certification", agencyName: "Ministry of Industry", type: "certification", cost: 10000 },
    ],
    "agriculture": [
      { name: "Agricultural Land Use Permit", agencyName: "Ministry of Agriculture", type: "permit", cost: 25000 },
      { name: "Pesticide Application License", agencyName: "Ministry of Environment", type: "license", cost: 15000 },
      { name: "Phytosanitary Certificate", agencyName: "Nigeria Agricultural Quarantine Service", type: "certification", cost: 30000 },
      { name: "Livestock Transport Permit", agencyName: "Ministry of Agriculture", type: "permit", cost: 20000 },
      { name: "Fertilizer Dealer Registration", agencyName: "Federal Ministry of Agriculture", type: "registration", cost: 40000 },
    ],
    "education": [
      { name: "Ministry of Education Approval", agencyName: "Ministry of Education", type: "license", cost: 100000 },
      { name: "Teachers Registration Council of Nigeria (TRCN) Certification", agencyName: "TRCN", type: "certification", cost: 25000 },
      { name: "Tertiary Education Trust Fund (TETFund) Registration", agencyName: "FIRS", type: "registration", cost: 0 },
      { name: "National Board for Technical Education (NBTE) Approval", agencyName: "NBTE", type: "license", cost: 80000 },
    ],
    "real-estate-construction": [
      { name: "Development Permit", agencyName: "State Ministry of Physical Planning", type: "permit", cost: 100000 },
      { name: "Building Plan Approval", agencyName: "Town Planning Authority", type: "permit", cost: 150000 },
      { name: "Council of Registered Builders of Nigeria (CORBON) License", agencyName: "CORBON", type: "license", cost: 50000 },
      { name: "Real Estate Developers Association of Nigeria (REDAN) Membership", agencyName: "REDAN", type: "registration", cost: 40000 },
    ],
    "professional-services": [
      { name: "Professional Indemnity Insurance", agencyName: "Insurance Commission", type: "compliance", cost: 80000 },
      { name: "Professional Practice License", agencyName: "Relevant Professional Body", type: "license", cost: 50000 },
    ],
    "transportation-logistics": [
      { name: "Inter-State Transport Permit", agencyName: "Ministry of Transportation", type: "permit", cost: 35000 },
      { name: "Vehicle Fleet Management Certification", agencyName: "State Traffic Management Agency", type: "certification", cost: 50000 },
      { name: "Courier/Logistics License", agencyName: "NIPOST", type: "license", cost: 150000 },
    ],
    "energy-mining": [
      { name: "Department of Petroleum Resources (DPR) Permit", agencyName: "DPR", type: "permit", cost: 200000 },
      { name: "Mining Lease", agencyName: "Ministry of Mines and Steel Development", type: "license", cost: 500000 },
      { name: "NERC Power Generation License", agencyName: "NERC", type: "license", cost: 300000 },
      { name: "Explosives Permit", agencyName: "Ministry of Mines", type: "permit", cost: 100000 },
    ],
    "fashion-apparel": [
      { name: "Textile Quality Certification", agencyName: "SON", type: "certification", cost: 40000 },
      { name: "Export Clearance (for international sales)", agencyName: "NEPC", type: "certification", cost: 30000 },
    ],
  };

  const pool = templates[resolvedIndustry] || [
    { name: "Local Government Trade License", agencyName: "Local Government Authority", type: "license", cost: 15000 },
    { name: "Commercial Waste Disposal Permit", agencyName: "Environmental Protection Agency", type: "permit", cost: 10000 },
    { name: "Fire Safety Compliance Certificate", agencyName: "Federal Fire Service", type: "certification", cost: 20000 },
    { name: "Occupational Health and Safety Registration", agencyName: "Ministry of Labour", type: "registration", cost: 15000 },
    { name: "Advertising Signage Permit", agencyName: "State Signage Agency", type: "permit", cost: 12000 },
  ];

  for (let i = 0; i < Math.min(needed, pool.length); i++) {
    const item = pool[i];
    additionalReqs.push({
      id: `ind-${industry}-${i+1}`,
      name: item.name,
      description: `Specific requirement for businesses operating in the ${industry} sector to ensure regulatory compliance.`,
      agencyName: item.agencyName,
      requirementType: item.type,
      officialCost: item.cost,
      estimatedCost: item.cost * 1.5,
      communityReportedCost: null,
      deadline: "Prior to operations",
      frequency: "annual",
      confidenceLevel: "verified",
      sourceUrl: null,
    });
  }

  // If we still need more requirements, generate generic ones
  let remaining = needed - pool.length;
  let genericCounter = 1;
  while (remaining > 0) {
    additionalReqs.push({
      id: `gen-${industry}-${genericCounter}`,
      name: `Standard Compliance Certification ${genericCounter}`,
      description: "Standard industry compliance certification required for general operations.",
      agencyName: "Regulatory Authority",
      requirementType: "compliance",
      officialCost: 10000,
      estimatedCost: 15000,
      communityReportedCost: null,
      deadline: "Annual renewal",
      frequency: "annual",
      confidenceLevel: "estimated",
      sourceUrl: null,
    });
    remaining--;
    genericCounter++;
  }

  return additionalReqs;
}

function buildAgencies(requirements: any[]): any[] {
  const agencyMap = new Map<string, { name: string; acronym: string | null; count: number }>();
  for (const req of requirements) {
    const key = req.agencyName;
    const existing = agencyMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      const match = key.match(/\(([^)]+)\)/);
      agencyMap.set(key, { name: key, acronym: match ? match[1] : null, count: 1 });
    }
  }
  return Array.from(agencyMap.values()).map((a, i) => ({
    id: `agency-${String(i + 1).padStart(3, "0")}`,
    name: a.name,
    acronym: a.acronym,
    requirementCount: a.count,
  }));
}

function calculateCosts(requirements: any[]): { official: number; estimated: number } {
  let official = 0;
  let estimated = 0;
  for (const req of requirements) {
    official += req.officialCost || 0;
    estimated += req.estimatedCost || 0;
  }
  return { official, estimated };
}

function calculateRiskLevel(complexityBase: number, activities: any, location: any): "low" | "medium" | "high" {
  let score = complexityBase;
  if (activities.willManufacture) score += 10;
  if (activities.willImport) score += 8;
  if (activities.willExport) score += 8;
  if (location.handlesRegulatedGoods) score += 10;
  if (location.requiresInspections) score += 8;
  if (activities.willOperateOnline) score += 5;
  if (activities.hasPhysicalLocation) score += 5;
  if (score > 60) return "high";
  if (score > 30) return "medium";
  return "low";
}

function buildRiskFactors(riskLevel: string, industry: string): string[] {
  const factors: string[] = [
    "Failure to register business name before operations can result in fines and legal penalties.",
    "Non-compliance with tax regulations may lead to penalties, interest charges, and business closure.",
  ];
  if (riskLevel === "high" || riskLevel === "medium") {
    factors.push("Operating without required licenses exposes your business to regulatory sanctions and reputational damage.");
  }
  if (industry === "food-beverage" || industry === "health-pharma") {
    factors.push("Handling regulated products without proper certification risks product seizure and legal action.");
  }
  if (industry === "finance-fintech") {
    factors.push("Unauthorized financial services can result in criminal prosecution and substantial fines.");
  }
  return factors;
}

function buildRoadmap(industry: string, requirements: any[]): any[] {
  return [
    {
      phase: 1,
      title: "Pre-Launch Setup",
      description: "Complete all registrations and licenses required before starting operations.",
      estimatedDuration: "2-4 weeks",
      requirements: requirements.filter((r: any) => r.frequency === "one-time" || r.deadline?.includes("Before")).map((r: any) => r.name),
    },
    {
      phase: 2,
      title: "Launch Preparation",
      description: "Set up compliance systems, tax registrations, and operational permits.",
      estimatedDuration: "1-2 months",
      requirements: requirements.filter((r: any) => r.frequency !== "one-time" && !r.deadline?.includes("Before")).slice(0, 3).map((r: any) => r.name),
    },
    {
      phase: 3,
      title: "Ongoing Compliance",
      description: "Maintain recurring obligations, track deadlines, and stay current with regulatory changes.",
      estimatedDuration: "Continuous",
      requirements: requirements.filter((r: any) => r.frequency === "monthly" || r.frequency === "annual").map((r: any) => r.name),
    },
    {
      phase: 4,
      title: "Growth & Scaling",
      description: "Expand compliance framework as your business grows and enters new areas.",
      estimatedDuration: "6-12 months",
      requirements: ["Review and update all registrations", "Monitor new regulatory requirements", "Scale compliance processes"],
    },
  ];
}

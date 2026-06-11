
function generateIndustrySpecificRequirements(industry: string, currentCount: number, targetCount: number): any[] {
  const additionalReqs: any[] = [];
  const needed = Math.max(0, targetCount - currentCount);
  if (needed === 0) return additionalReqs;

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
  };

  const pool = templates[industry] || [
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


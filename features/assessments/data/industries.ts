export interface IndustryQuestion {
  id: string;
  label: string;
  tooltip?: string;
}

export interface IndustryOption {
  id: string;
  name: string;
  description: string;
  questions: IndustryQuestion[];
  baseRequirementCount: number;
  baseAgencyCount: number;
  categories: string[];
  complexityModifier: number;
}

export const INDUSTRIES: IndustryOption[] = [
  {
    id: "food-beverage",
    name: "Food & Beverage",
    description: "Restaurants, food processing, catering, beverage production",
    baseRequirementCount: 10,
    baseAgencyCount: 5,
    complexityModifier: 15,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Health & Safety",
      "Food Safety",
      "Employment Compliance",
    ],
    questions: [
      { id: "foodPreparation", label: "Will you prepare or process food?", tooltip: "This includes cooking, baking, blending, or any form of food preparation for sale or distribution." },
      { id: "foodPackaging", label: "Will you package food products?", tooltip: "Packaged food products may require labeling compliance, nutritional information, and packaging standards approval." },
      { id: "foodDelivery", label: "Will you offer food delivery services?", tooltip: "Food delivery may require separate permits for transportation, handling, and temperature control of perishable items." },
    ],
  },
  {
    id: "health-pharma",
    name: "Health & Pharmaceutical",
    description: "Medical services, health products, pharmaceutical manufacturing",
    baseRequirementCount: 14,
    baseAgencyCount: 6,
    complexityModifier: 20,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Healthcare Regulation",
      "Health & Safety",
      "Data Protection",
      "Employment Compliance",
    ],
    questions: [
      { id: "medicalServices", label: "Will you provide medical services?", tooltip: "Medical services require licensing from health regulatory bodies, professional certifications, and facility approvals." },
      { id: "healthProducts", label: "Will you sell health or wellness products?", tooltip: "Health products such as supplements, herbal remedies, and wellness items may require registration and approval before sale." },
      { id: "pharmaceuticalProducts", label: "Will you handle pharmaceutical products?", tooltip: "Pharmaceuticals are highly regulated and require special licenses for import, storage, distribution, and dispensing." },
    ],
  },
  {
    id: "technology-saas",
    name: "Technology / SaaS",
    description: "Software platforms, digital services, tech products",
    baseRequirementCount: 8,
    baseAgencyCount: 4,
    complexityModifier: 10,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Data Protection",
      "Industry Licensing",
    ],
    questions: [
      { id: "customerDataCollection", label: "Will you collect customer personal data?", tooltip: "Collecting personal data like names, emails, or payment info triggers data protection and privacy compliance requirements." },
      { id: "paymentProcessing", label: "Will you process payments?", tooltip: "Processing payments may require PCI DSS compliance, payment service provider licensing, and financial regulation." },
      { id: "saasPlatform", label: "Are you building a SaaS platform?", tooltip: "SaaS platforms may have specific requirements for data residency, service level agreements, and consumer protection." },
    ],
  },
  {
    id: "retail-ecommerce",
    name: "Retail & E-commerce",
    description: "Physical stores, online shops, wholesale trade",
    baseRequirementCount: 9,
    baseAgencyCount: 4,
    complexityModifier: 8,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Trade License",
      "Industry Licensing",
    ],
    questions: [
      { id: "physicalStore", label: "Will you operate a physical store?", tooltip: "Physical retail stores require trade licenses, signage permits, health inspections, and sometimes zoning approvals." },
      { id: "onlineStore", label: "Will you operate an online store?", tooltip: "Online stores may require e-commerce registration, data protection compliance, and digital payment processing licenses." },
      { id: "importedGoods", label: "Will you sell imported goods?", tooltip: "Importing goods for resale requires import permits, customs clearance, product standards compliance, and sometimes special licenses." },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Product manufacturing, assembly, industrial production",
    baseRequirementCount: 13,
    baseAgencyCount: 6,
    complexityModifier: 18,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Environmental Compliance",
      "Health & Safety",
      "Employment Compliance",
      "Import/Export Regulations",
    ],
    questions: [
      { id: "manufacturingProduction", label: "Will you manufacture products?", tooltip: "Manufacturing requires industrial permits, environmental impact assessments, and compliance with production standards." },
      { id: "industrialPackaging", label: "Will you package finished goods?", tooltip: "Industrial packaging may require labeling standards, quality control certifications, and waste management compliance." },
      { id: "qualityControl", label: "Will you operate quality control processes?", tooltip: "Quality control processes may need to meet industry-specific standards and may require certification from standards bodies." },
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Farming, crop production, livestock, agribusiness",
    baseRequirementCount: 10,
    baseAgencyCount: 5,
    complexityModifier: 12,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Environmental Compliance",
      "Health & Safety",
      "Import/Export Regulations",
      "Industry Licensing",
    ],
    questions: [
      { id: "farming", label: "Will you engage in crop farming?", tooltip: "Crop farming may require land use permits, environmental impact assessments, and compliance with agricultural regulations." },
      { id: "processing", label: "Will you process agricultural products?", tooltip: "Processing agricultural products often requires food safety certifications, facility inspections, and quality standards compliance." },
      { id: "export", label: "Will you export agricultural products?", tooltip: "Exporting agricultural products requires phytosanitary certificates, export permits, and compliance with destination country standards." },
    ],
  },
  {
    id: "education",
    name: "Education",
    description: "Schools, training centers, online education",
    baseRequirementCount: 8,
    baseAgencyCount: 4,
    complexityModifier: 8,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Employment Compliance",
    ],
    questions: [
      { id: "physicalSchool", label: "Will you operate a physical school?", tooltip: "Physical schools require licensing from education authorities, facility inspections, and curriculum approval." },
      { id: "onlineCourses", label: "Will you offer online courses?", tooltip: "Online education may require accreditation, data protection compliance, and platform licensing." },
      { id: "certifications", label: "Will you issue certifications?", tooltip: "Issuing certificates or diplomas typically requires accreditation from recognized education bodies." },
    ],
  },
  {
    id: "finance-fintech",
    name: "Finance & Fintech",
    description: "Financial services, payment platforms, investment",
    baseRequirementCount: 15,
    baseAgencyCount: 7,
    complexityModifier: 25,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Financial Regulation",
      "Data Protection",
      "Employment Compliance",
      "Anti-Money Laundering",
    ],
    questions: [
      { id: "financialServices", label: "Will you provide financial services?", tooltip: "Financial services require licensing from the central bank or financial regulatory authority, plus capital adequacy requirements." },
      { id: "paymentPlatform", label: "Will you operate a payment platform?", tooltip: "Payment platforms require payment system licensing, anti-money laundering compliance, and data security certifications." },
      { id: "customerFunds", label: "Will you hold customer funds?", tooltip: "Holding customer funds requires trust account management, regulatory oversight, and often a separate banking license." },
    ],
  },
  {
    id: "real-estate-construction",
    name: "Real Estate & Construction",
    description: "Property development, construction, real estate services",
    baseRequirementCount: 11,
    baseAgencyCount: 5,
    complexityModifier: 14,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Environmental Compliance",
      "Health & Safety",
      "Employment Compliance",
    ],
    questions: [
      { id: "construction", label: "Will you undertake construction projects?", tooltip: "Construction requires contractor licensing, building permits, environmental approvals, and health and safety compliance." },
      { id: "propertyManagement", label: "Will you manage properties?", tooltip: "Property management may require real estate licenses, tenant protection compliance, and property registration." },
      { id: "realEstateSales", label: "Will you sell real estate?", tooltip: "Real estate sales typically require a real estate license, adherence to property laws, and consumer protection compliance." },
    ],
  },
  {
    id: "professional-services",
    name: "Professional Services",
    description: "Consulting, legal, accounting, business services",
    baseRequirementCount: 7,
    baseAgencyCount: 3,
    complexityModifier: 6,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Employment Compliance",
    ],
    questions: [
      { id: "clientServices", label: "Will you provide professional advisory services?", tooltip: "Professional advisory services may need professional indemnity insurance and in some cases, regulatory licensing." },
      { id: "professionalCertification", label: "Does your profession require certification?", tooltip: "Some professions like law, accounting, and engineering require mandatory certification from professional bodies." },
      { id: "regulatedProfession", label: "Is your profession regulated by a governing body?", tooltip: "Regulated professions have specific licensing requirements, continuing education obligations, and codes of conduct." },
    ],
  },
  {
    id: "transportation-logistics",
    name: "Transportation & Logistics",
    description: "Transport services, fleet management, delivery services",
    baseRequirementCount: 10,
    baseAgencyCount: 5,
    complexityModifier: 12,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Transport Regulation",
      "Employment Compliance",
    ],
    questions: [
      { id: "transportServices", label: "Will you provide transportation services?", tooltip: "Transport services require transport operator licenses, vehicle registration, insurance, and route permits." },
      { id: "fleetManagement", label: "Will you operate a vehicle fleet?", tooltip: "Fleet operations require commercial vehicle registration, driver certifications, and regular safety inspections." },
      { id: "logistics", label: "Will you offer logistics or delivery services?", tooltip: "Logistics services may require warehousing permits, customs clearance licenses, and last-mile delivery regulations." },
    ],
  },
  {
    id: "energy-mining",
    name: "Energy & Mining",
    description: "Energy generation, mining, natural resources",
    baseRequirementCount: 16,
    baseAgencyCount: 8,
    complexityModifier: 22,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Environmental Compliance",
      "Health & Safety",
      "Employment Compliance",
      "Import/Export Regulations",
    ],
    questions: [
      { id: "energyGeneration", label: "Will you generate energy?", tooltip: "Energy generation requires power generation licenses, environmental permits, grid connection agreements, and regulatory approvals." },
      { id: "mining", label: "Will you engage in mining activities?", tooltip: "Mining requires mineral rights licenses, environmental impact assessments, community agreements, and safety permits." },
      { id: "distribution", label: "Will you distribute energy or resources?", tooltip: "Distribution of energy or resources requires distribution licenses, infrastructure permits, and compliance with industry regulations." },
    ],
  },
  {
    id: "fashion-apparel",
    name: "Fashion & Apparel",
    description: "Fashion design, clothing manufacturing, textile production, and fashion retail",
    baseRequirementCount: 8,
    baseAgencyCount: 4,
    complexityModifier: 10,
    categories: [
      "Business Registration",
      "Tax Compliance",
      "Industry Licensing",
      "Trade License",
      "Employment Compliance",
    ],
    questions: [
      { id: "clothingManufacturing", label: "Will you manufacture clothing?", tooltip: "Clothing manufacturing may require factory registration, safety inspections, and labor compliance." },
      { id: "clothingRetail", label: "Will you sell clothing directly to customers?", tooltip: "Retail fashion businesses need trade licenses, premises permits, and consumer protection compliance." },
      { id: "textileImport", label: "Will you import fabrics or materials?", tooltip: "Importing textiles requires customs clearance, SON certification, and import permits." },
    ],
  },
];

export function getIndustryById(id: string): IndustryOption | undefined {
  return INDUSTRIES.find((i) => i.id === id);
}

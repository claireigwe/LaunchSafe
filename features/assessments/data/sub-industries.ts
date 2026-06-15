export interface SubIndustry {
  id: string;
  name: string;
  description: string;
}

export interface IndustryGroup {
  id: string;
  name: string;
  description: string;
  subIndustries: SubIndustry[];
}

export const INDUSTRIES_WITH_SUB: IndustryGroup[] = [
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Farming, livestock, processing, and agricultural supply",
    subIndustries: [
      { id: "crop-farming", name: "Crop Farming", description: "Cultivation of crops on a commercial scale" },
      { id: "livestock-farming", name: "Livestock Farming", description: "Rearing of livestock for commercial purposes" },
      { id: "poultry-farming", name: "Poultry Farming", description: "Commercial poultry and egg production" },
      { id: "fish-farming", name: "Fish Farming", description: "Aquaculture and fish production" },
      { id: "agro-processing", name: "Agro Processing", description: "Processing of agricultural raw materials" },
      { id: "agricultural-supply", name: "Agricultural Supply", description: "Supply of farm inputs, equipment, and services" },
    ],
  },
  {
    id: "education",
    name: "Education",
    description: "Schools, training, and educational services",
    subIndustries: [
      { id: "nursery-school", name: "Nursery School", description: "Early childhood education" },
      { id: "primary-school", name: "Primary School", description: "Primary education" },
      { id: "secondary-school", name: "Secondary School", description: "Secondary education" },
      { id: "training-institute", name: "Training Institute", description: "Vocational and professional training" },
      { id: "coaching-centre", name: "Coaching Centre", description: "Tutorial and coaching services" },
      { id: "online-education", name: "Online Education", description: "Digital learning platforms" },
    ],
  },
  {
    id: "energy",
    name: "Energy",
    description: "Energy generation, distribution, and services",
    subIndustries: [
      { id: "solar-installation", name: "Solar Installation", description: "Solar panel and renewable energy installation" },
      { id: "renewable-energy-services", name: "Renewable Energy Services", description: "Renewable energy consulting and services" },
      { id: "fuel-station", name: "Fuel Station", description: "Petrol station and fuel retail" },
      { id: "gas-distribution", name: "Gas Distribution", description: "LPG and natural gas distribution" },
      { id: "energy-consulting", name: "Energy Consulting", description: "Energy efficiency and advisory services" },
    ],
  },
  {
    id: "fashion-apparel",
    name: "Fashion & Apparel",
    description: "Fashion design, clothing, and textile production",
    subIndustries: [
      { id: "tailoring", name: "Tailoring", description: "Custom clothing and alterations" },
      { id: "fashion-design", name: "Fashion Design", description: "Fashion design and branding" },
      { id: "clothing-retail", name: "Clothing Retail", description: "Retail sale of clothing and accessories" },
      { id: "textile-production", name: "Textile Production", description: "Textile manufacturing and production" },
      { id: "fashion-manufacturing", name: "Fashion Manufacturing", description: "Large-scale fashion production" },
    ],
  },
  {
    id: "finance-fintech",
    name: "Finance & Fintech",
    description: "Financial services, fintech, and payment platforms",
    subIndustries: [
      { id: "fintech-startup", name: "Fintech Startup", description: "Financial technology startup" },
      { id: "payment-services", name: "Payment Services", description: "Digital payment and transaction processing" },
      { id: "agency-banking", name: "Agency Banking", description: "Banking agency and mobile money operations" },
      { id: "lending-services", name: "Lending Services", description: "Microfinance and lending" },
      { id: "financial-technology-platform", name: "Financial Technology Platform", description: "Platform-based financial services" },
    ],
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    description: "Food preparation, processing, and beverage production",
    subIndustries: [
      { id: "restaurant", name: "Restaurant", description: "Full-service restaurant" },
      { id: "fast-food-outlet", name: "Fast Food Outlet", description: "Quick service restaurant" },
      { id: "bakery", name: "Bakery", description: "Bakery and confectionery" },
      { id: "catering-services", name: "Catering Services", description: "Event and corporate catering" },
      { id: "packaged-water-production", name: "Packaged Water Production", description: "Sachet and bottled water production" },
      { id: "food-processing", name: "Food Processing", description: "Industrial food processing" },
      { id: "beverage-production", name: "Beverage Production", description: "Production of beverages and drinks" },
      { id: "grocery-store", name: "Grocery Store", description: "Retail grocery and provision store" },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical services, pharmaceuticals, and health technology",
    subIndustries: [
      { id: "pharmacy", name: "Pharmacy", description: "Retail pharmacy and drug dispensing" },
      { id: "clinic", name: "Clinic", description: "Medical clinic and outpatient services" },
      { id: "hospital", name: "Hospital", description: "Inpatient medical services" },
      { id: "diagnostic-laboratory", name: "Diagnostic Laboratory", description: "Medical diagnostics and testing" },
      { id: "medical-equipment-supply", name: "Medical Equipment Supply", description: "Supply of medical equipment" },
      { id: "telemedicine-services", name: "Telemedicine Services", description: "Remote healthcare services" },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Industrial and consumer goods manufacturing",
    subIndustries: [
      { id: "food-manufacturing", name: "Food Manufacturing", description: "Large-scale food production" },
      { id: "consumer-goods-manufacturing", name: "Consumer Goods Manufacturing", description: "Manufacturing of consumer products" },
      { id: "chemical-manufacturing", name: "Chemical Manufacturing", description: "Industrial chemical production" },
      { id: "industrial-production", name: "Industrial Production", description: "Heavy industrial manufacturing" },
      { id: "packaging-production", name: "Packaging Production", description: "Packaging materials manufacturing" },
    ],
  },
  {
    id: "professional-services",
    name: "Professional Services",
    description: "Consulting, legal, accounting, and advisory services",
    subIndustries: [
      { id: "consulting", name: "Consulting", description: "Management and business consulting" },
      { id: "accounting-firm", name: "Accounting Firm", description: "Accounting and tax services" },
      { id: "legal-services", name: "Legal Services", description: "Legal advisory and representation" },
      { id: "marketing-agency", name: "Marketing Agency", description: "Marketing and advertising services" },
      { id: "recruitment-agency", name: "Recruitment Agency", description: "Recruitment and HR services" },
      { id: "compliance-consulting", name: "Compliance Consulting", description: "Regulatory compliance advisory" },
    ],
  },
  {
    id: "real-estate-construction",
    name: "Real Estate & Construction",
    description: "Property, construction, and building services",
    subIndustries: [
      { id: "real-estate-agency", name: "Real Estate Agency", description: "Property sales and leasing" },
      { id: "property-development", name: "Property Development", description: "Real estate development" },
      { id: "construction-company", name: "Construction Company", description: "Building and construction services" },
      { id: "building-materials-supply", name: "Building Materials Supply", description: "Supply of construction materials" },
      { id: "facility-management", name: "Facility Management", description: "Property and facility management" },
    ],
  },
  {
    id: "retail-ecommerce",
    name: "Retail & E-Commerce",
    description: "Retail trade, online commerce, and distribution",
    subIndustries: [
      { id: "physical-retail-store", name: "Physical Retail Store", description: "Brick-and-mortar retail" },
      { id: "online-store", name: "Online Store", description: "E-commerce and online retail" },
      { id: "marketplace-seller", name: "Marketplace Seller", description: "Third-party marketplace selling" },
      { id: "wholesale-distribution", name: "Wholesale Distribution", description: "Wholesale and distribution" },
      { id: "import-export", name: "Import & Export", description: "Cross-border trade" },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    description: "Software, IT services, and digital platforms",
    subIndustries: [
      { id: "saas", name: "SaaS", description: "Software as a Service platform" },
      { id: "software-development", name: "Software Development", description: "Custom software development" },
      { id: "it-services", name: "IT Services", description: "IT support and infrastructure services" },
      { id: "digital-agency", name: "Digital Agency", description: "Digital marketing and web services" },
      { id: "cybersecurity-services", name: "Cybersecurity Services", description: "Security and compliance services" },
      { id: "ai-startup", name: "AI Startup", description: "Artificial intelligence and ML startup" },
    ],
  },
  {
    id: "transportation-logistics",
    name: "Transportation & Logistics",
    description: "Transport, logistics, and fleet services",
    subIndustries: [
      { id: "logistics-company", name: "Logistics Company", description: "Freight and logistics services" },
      { id: "courier-service", name: "Courier Service", description: "Last-mile delivery and courier" },
      { id: "fleet-operations", name: "Fleet Operations", description: "Commercial fleet management" },
      { id: "ride-hailing-services", name: "Ride-Hailing Services", description: "Transportation network services" },
      { id: "haulage-services", name: "Haulage Services", description: "Heavy goods transportation" },
    ],
  },
  {
    id: "general-business",
    name: "General Business",
    description: "General trading and small business services",
    subIndustries: [
      { id: "trading", name: "Trading", description: "General trading business" },
      { id: "general-merchandise", name: "General Merchandise", description: "Sale of general goods" },
      { id: "small-business-services", name: "Small Business Services", description: "Miscellaneous small business services" },
      { id: "other", name: "Other", description: "Other business types not listed" },
    ],
  },
];

export function getIndustryById(id: string): IndustryGroup | undefined {
  return INDUSTRIES_WITH_SUB.find((i) => i.id === id);
}

export function getSubIndustryById(industryId: string, subIndustryId: string): SubIndustry | undefined {
  const industry = getIndustryById(industryId);
  return industry?.subIndustries.find((s) => s.id === subIndustryId);
}

export function getSubIndustriesByIndustry(industryId: string): SubIndustry[] {
  return getIndustryById(industryId)?.subIndustries || [];
}

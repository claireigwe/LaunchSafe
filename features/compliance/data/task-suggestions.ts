import type { SuggestedTask } from "../types/tasks.types";

interface BusinessProfile {
  industry: string;
  subIndustry: string;
  state: string;
  isRegistered: boolean | null;
  hasCAC: boolean | null;
  employeeCount: string;
  hasPhysicalLocation: boolean | null;
  hasOnlineOperations: boolean | null;
  hasCustomerLocation: boolean | null;
}

const SUB_INDUSTRY_TASKS: Record<string, SuggestedTask[]> = {
  // Healthcare
  "pharmacy": [
    { id: "sug-pcn-license", title: "PCN Pharmacy License", description: "Obtain a pharmacy license from the Pharmacists Council of Nigeria.", explanation: "All pharmacies require PCN licensing and premises inspection.", priority: "critical", reason: "Operating a pharmacy without PCN license is illegal." },
    { id: "sug-health-facility-reg", title: "Health Facility Registration", description: "Register your facility with the State Ministry of Health.", explanation: "Healthcare facilities require state-level registration.", priority: "critical", reason: "Unregistered healthcare facilities face closure." },
  ],
  "clinic": [
    { id: "sug-clinic-license", title: "Clinic Operating License", description: "Obtain operating license from State Ministry of Health.", explanation: "Medical clinics require licensing and periodic inspections.", priority: "critical", reason: "Operating without a license puts patients at risk." },
  ],
  "hospital": [
    { id: "sug-hospital-license", title: "Hospital Operating License", description: "Obtain comprehensive hospital operating license.", explanation: "Hospitals require multi-agency licensing and accreditation.", priority: "critical", reason: "Hospitals must meet strict regulatory standards." },
  ],
  "diagnostic-laboratory": [
    { id: "sug-lab-accreditation", title: "Medical Lab Accreditation", description: "Register and accredit your diagnostic laboratory.", explanation: "Diagnostic labs require MLSCN accreditation.", priority: "critical", reason: "Unaccredited labs cannot legally operate." },
  ],
  "medical-equipment-supply": [
    { id: "sug-medical-device-reg", title: "Medical Device Registration", description: "Register medical devices with NAFDAC.", explanation: "Medical equipment suppliers must register devices.", priority: "high", reason: "Unregistered devices cannot be imported or sold." },
  ],
  "telemedicine-services": [
    { id: "sug-telemedicine-license", title: "Telemedicine Practice License", description: "Register telemedicine services with relevant authorities.", explanation: "Digital health platforms require special licensing.", priority: "high", reason: "Telemedicine is regulated by multiple agencies." },
  ],

  // Food & Beverage
  "restaurant": [
    { id: "sug-food-handlers", title: "Food Handlers Certificate", description: "Obtain medical certificates for all food handlers.", explanation: "Restaurant staff require health certificates.", priority: "high", reason: "Health inspections require valid food handler certificates." },
    { id: "sug-restaurant-premises", title: "Restaurant Premises Permit", description: "Obtain premises permit and health inspection clearance.", explanation: "Restaurants require health department approval.", priority: "high", reason: "Operating without health clearance risks closure." },
  ],
  "fast-food-outlet": [
    { id: "sug-fast-food-permit", title: "Fast Food Operating Permit", description: "Get health department permit for fast food operations.", explanation: "Quick service restaurants need health and safety permits.", priority: "high", reason: "Health and safety compliance is mandatory." },
  ],
  "bakery": [
    { id: "sug-bakery-nafdac", title: "NAFDAC Bakery Registration", description: "Register bakery products with NAFDAC.", explanation: "Baked goods require NAFDAC product registration.", priority: "high", reason: "Commercial bakeries must register all products." },
  ],
  "catering-services": [
    { id: "sug-catering-permit", title: "Catering Business Permit", description: "Obtain catering permit from health authorities.", explanation: "Catering services need health department certification.", priority: "high", reason: "Catering without health certification is prohibited." },
  ],
  "packaged-water-production": [
    { id: "sug-water-nafdac", title: "NAFDAC Water Production License", description: "Obtain NAFDAC license for packaged water production.", explanation: "Sachet and bottled water requires NAFDAC approval.", priority: "critical", reason: "Water production without NAFDAC license is illegal." },
    { id: "sug-water-son", title: "SON Water Standards Certification", description: "Certify water meets SON quality standards.", explanation: "Packaged water must meet Nigerian Industrial Standards.", priority: "high", reason: "Substandard water products face enforcement action." },
  ],
  "food-processing": [
    { id: "sug-food-processing-license", title: "Food Processing Facility License", description: "Obtain NAFDAC food processing facility license.", explanation: "Food processing plants require NAFDAC inspection and licensing.", priority: "critical", reason: "Processing food without license is illegal." },
  ],
  "beverage-production": [
    { id: "sug-beverage-nafdac", title: "NAFDAC Beverage Registration", description: "Register beverages with NAFDAC for product approval.", explanation: "All beverages must be registered before sale.", priority: "critical", reason: "Unregistered beverages cannot be sold legally." },
  ],
  "grocery-store": [
    { id: "sug-grocery-permit", title: "Grocery Store Permit", description: "Obtain local government trade permit for grocery store.", explanation: "Retail food stores require local permits.", priority: "medium", reason: "Local governments require permits for retail food sales." },
  ],

  // Fintech
  "fintech-startup": [
    { id: "sug-fintech-cbn", title: "CBN Fintech License", description: "Apply for CBN fintech operating license.", explanation: "Fintech startups require CBN regulatory approval.", priority: "critical", reason: "Operating without CBN approval is a serious violation." },
    { id: "sug-fintech-scuml", title: "SCUML Registration", description: "Register with Special Control Unit against Money Laundering.", explanation: "Fintech businesses must register with SCUML.", priority: "critical", reason: "AML registration is mandatory for financial services." },
  ],
  "payment-services": [
    { id: "sug-payment-psp", title: "PSP License", description: "Obtain Payment Service Provider license from CBN.", explanation: "Payment processing requires CBN PSP licensing.", priority: "critical", reason: "Payment services without CBN license are illegal." },
  ],
  "agency-banking": [
    { id: "sug-agency-banking", title: "Agency Banking Registration", description: "Register as an approved banking agent.", explanation: "Banking agents must be licensed by financial institutions.", priority: "high", reason: "Unauthorized banking agency is prohibited." },
  ],
  "lending-services": [
    { id: "sug-lending-license", title: "Lending License", description: "Obtain lending license from relevant regulatory body.", explanation: "Lending businesses require regulatory approval.", priority: "critical", reason: "Illegal lending practices face severe penalties." },
  ],
  "financial-technology-platform": [
    { id: "sug-fintech-platform", title: "Fintech Platform License", description: "Register your financial technology platform.", explanation: "Digital financial platforms require multiple licenses.", priority: "critical", reason: "Platforms must comply with CBN fintech guidelines." },
  ],

  // Technology
  "saas": [
    { id: "sug-saas-ndpc", title: "NDPC Data Protection Registration", description: "Register your SaaS platform with NDPC.", explanation: "SaaS platforms handling user data must register.", priority: "critical", reason: "Data protection compliance is mandatory for SaaS." },
    { id: "sug-saas-copyright", title: "Software Copyright Registration", description: "Register your software copyright with NCC.", explanation: "Protect your intellectual property through copyright.", priority: "medium", reason: "Copyright registration protects your software." },
  ],
  "software-development": [
    { id: "sug-software-ip", title: "Software IP Protection", description: "Register intellectual property for your software.", explanation: "Software companies should protect their IP.", priority: "medium", reason: "IP protection prevents unauthorized use." },
  ],
  "it-services": [
    { id: "sug-it-services-license", title: "IT Services Registration", description: "Register your IT services business with NITDA.", explanation: "IT service providers may need NITDA registration.", priority: "medium", reason: "NITDA registration ensures compliance with tech guidelines." },
  ],
  "digital-agency": [
    { id: "sug-digital-agency-reg", title: "Digital Agency Registration", description: "Register your digital agency with relevant bodies.", explanation: "Marketing and digital agencies may need ARCON registration.", priority: "medium", reason: "Advertising regulatory compliance is required." },
  ],
  "cybersecurity-services": [
    { id: "sug-cybersecurity-license", title: "Cybersecurity Service License", description: "Obtain cybersecurity service provider license.", explanation: "Cybersecurity services may require NITDA certification.", priority: "high", reason: "Cybersecurity is a regulated profession in Nigeria." },
  ],
  "ai-startup": [
    { id: "sug-ai-data-governance", title: "AI Data Governance Compliance", description: "Implement AI data governance and ethics framework.", explanation: "AI startups must comply with data protection and ethics guidelines.", priority: "high", reason: "AI regulation is evolving and requires proactive compliance." },
  ],

  // Manufacturing
  "food-manufacturing": [
    { id: "sug-food-manufacturing-nafdac", title: "NAFDAC Food Manufacturing License", description: "Obtain NAFDAC manufacturing license for food production.", explanation: "Food manufacturers require NAFDAC facility inspection.", priority: "critical", reason: "Manufacturing food without license is illegal." },
  ],
  "consumer-goods-manufacturing": [
    { id: "sug-consumer-goods-son", title: "SON Consumer Goods Certification", description: "Certify consumer goods meet SON standards.", explanation: "Consumer products require SON certification.", priority: "high", reason: "Uncertified products can be seized from the market." },
  ],
  "chemical-manufacturing": [
    { id: "sug-chemical-nesrea", title: "NESREA Chemical Compliance", description: "Register chemicals with NESREA for environmental compliance.", explanation: "Chemical manufacturers require environmental permits.", priority: "critical", reason: "Chemical handling without permits is dangerous and illegal." },
  ],
  "industrial-production": [
    { id: "sug-industrial-eia", title: "Environmental Impact Assessment", description: "Conduct EIA for industrial production facility.", explanation: "Industrial facilities require environmental assessment.", priority: "critical", reason: "Operating without EIA clearance risks shutdown." },
  ],
  "packaging-production": [
    { id: "sug-packaging-son", title: "SON Packaging Standards", description: "Ensure packaging meets SON standards.", explanation: "Packaging materials must comply with quality standards.", priority: "medium", reason: "Non-compliant packaging can affect product marketability." },
  ],

  // Energy
  "solar-installation": [
    { id: "sug-solar-nemsa", title: "Solar Installation License", description: "Register with NEMSA for solar installation services.", explanation: "Solar installers require NEMSA certification.", priority: "high", reason: "Unlicensed electrical installations are prohibited." },
  ],
  "fuel-station": [
    { id: "sug-fuel-station-nmdis", title: "Fuel Station Operating License", description: "Obtain fuel station license from NMDPRA.", explanation: "Petrol stations require multiple regulatory approvals.", priority: "critical", reason: "Operating without NMDPRA license is illegal." },
  ],
  "gas-distribution": [
    { id: "sug-gas-nmdis", title: "Gas Distribution License", description: "Obtain LPG/gas distribution license.", explanation: "Gas distribution requires safety permits.", priority: "critical", reason: "Gas operations without license face severe penalties." },
  ],

  // Agriculture
  "crop-farming": [
    { id: "sug-crop-land-use", title: "Agricultural Land Use Permit", description: "Obtain land use permit for farming operations.", explanation: "Agricultural land requires proper permits.", priority: "medium", reason: "Land use disputes can disrupt farming operations." },
  ],
  "livestock-farming": [
    { id: "sug-livestock-veterinary", title: "Veterinary Services Registration", description: "Register livestock operations with veterinary authorities.", explanation: "Livestock farms require animal health compliance.", priority: "high", reason: "Animal disease outbreaks can devastate livestock operations." },
  ],
  "poultry-farming": [
    { id: "sug-poultry-health", title: "Poultry Health Certification", description: "Obtain poultry health certification.", explanation: "Poultry farms require veterinary health monitoring.", priority: "high", reason: "Disease prevention is critical for poultry operations." },
  ],
  "fish-farming": [
    { id: "sug-fish-nafdac", title: "NAFDAC Fish Product Registration", description: "Register fish products with NAFDAC.", explanation: "Processed fish products require regulatory approval.", priority: "high", reason: "Seafood products must meet safety standards." },
  ],

  // Education
  "nursery-school": [
    { id: "sug-nursery-license", title: "Nursery School Operating License", description: "Obtain early childhood education license.", explanation: "Nursery schools require Ministry of Education approval.", priority: "critical", reason: "Operating without education license is illegal." },
  ],
  "primary-school": [
    { id: "sug-primary-license", title: "Primary School License", description: "Obtain primary school operating license.", explanation: "Primary schools must be registered with education authorities.", priority: "critical", reason: "Unregistered schools face immediate closure." },
  ],
  "secondary-school": [
    { id: "sug-secondary-license", title: "Secondary School License", description: "Obtain secondary school approval from Ministry of Education.", explanation: "Secondary schools require comprehensive licensing.", priority: "critical", reason: "Secondary education is strictly regulated." },
  ],
  "training-institute": [
    { id: "sug-training-nbte", title: "NBTE Training Registration", description: "Register training institute with NBTE.", explanation: "Vocational training centers need NBTE accreditation.", priority: "high", reason: "Accreditation ensures training quality and certification validity." },
  ],
  "online-education": [
    { id: "sug-online-edu-license", title: "Online Education Platform License", description: "Register online education platform with relevant authorities.", explanation: "Digital learning platforms may need NITDA compliance.", priority: "medium", reason: "Online education is subject to emerging regulations." },
  ],

  // Professional Services
  "consulting": [
    { id: "sug-consulting-indemnity", title: "Professional Indemnity Insurance", description: "Obtain professional indemnity insurance.", explanation: "Consultants should protect against liability claims.", priority: "medium", reason: "Professional liability insurance is recommended for consultants." },
  ],
  "accounting-firm": [
    { id: "sug-accounting-ican", title: "ICAN Practice License", description: "Register accounting firm with ICAN.", explanation: "Accounting firms require ICAN registration.", priority: "critical", reason: "Practicing without ICAN license is prohibited." },
  ],
  "legal-services": [
    { id: "sug-legal-nba", title: "NBA Practice License", description: "Register legal practice with Nigerian Bar Association.", explanation: "Legal practitioners must have NBA certification.", priority: "critical", reason: "Unauthorized legal practice is a criminal offense." },
  ],
  "marketing-agency": [
    { id: "sug-marketing-arcon", title: "ARCON Advertising Registration", description: "Register marketing agency with ARCON.", explanation: "Advertising agencies require ARCON registration.", priority: "medium", reason: "ARCON regulates all advertising and marketing communications." },
  ],
  "recruitment-agency": [
    { id: "sug-recruitment-license", title: "Recruitment Agency License", description: "Obtain recruitment agency license from Ministry of Labour.", explanation: "Employment agencies require government licensing.", priority: "high", reason: "Unlicensed recruitment operations are illegal." },
  ],
  "compliance-consulting": [
    { id: "sug-compliance-consulting", title: "Compliance Consulting Registration", description: "Register your compliance consulting practice.", explanation: "Compliance consultants benefit from professional body registration.", priority: "medium", reason: "Professional registration builds client trust." },
  ],

  // Transportation & Logistics
  "logistics-company": [
    { id: "sug-logistics-nipost", title: "NIPOST Logistics License", description: "Obtain courier/logistics license from NIPOST.", explanation: "Logistics companies require NIPOST licensing.", priority: "critical", reason: "Operating logistics services without a license is illegal." },
  ],
  "courier-service": [
    { id: "sug-courier-nipost", title: "Courier Service License", description: "Register courier service with NIPOST.", explanation: "Courier businesses require postal regulatory approval.", priority: "critical", reason: "Unlicensed courier services face enforcement action." },
  ],
  "ride-hailing-services": [
    { id: "sug-ride-hailing-license", title: "Ride-Hailing Operating License", description: "Obtain ride-hailing platform license from state authorities.", explanation: "Ride-hailing services require state-level licensing.", priority: "high", reason: "Ride-hailing regulations vary by state." },
  ],
  "haulage-services": [
    { id: "sug-haulage-permit", title: "Haulage Operating Permit", description: "Obtain heavy goods transport permit.", explanation: "Haulage operators require transport ministry permits.", priority: "high", reason: "Heavy goods vehicles are strictly regulated." },
  ],

  // Real Estate & Construction
  "construction-company": [
    { id: "sug-construction-corbon", title: "CORBON Contractor Registration", description: "Register with Council of Registered Builders of Nigeria.", explanation: "Construction companies require CORBON registration.", priority: "critical", reason: "Unregistered contractors cannot legally operate." },
  ],
  "property-development": [
    { id: "sug-property-dev-permit", title: "Development Permit", description: "Obtain development permit from planning authority.", explanation: "Property development requires town planning approval.", priority: "critical", reason: "Construction without permits faces demolition orders." },
  ],
  "real-estate-agency": [
    { id: "sug-real-estate-redan", title: "REDAN Registration", description: "Register with Real Estate Developers Association.", explanation: "Real estate agents benefit from REDAN membership.", priority: "medium", reason: "REDAN registration enhances credibility." },
  ],

  // Fashion & Apparel
  "fashion-design": [
    { id: "sug-fashion-trademark", title: "Fashion Brand Trademark", description: "Register your fashion brand trademark.", explanation: "Protect your brand identity through trademark registration.", priority: "medium", reason: "Trademark prevents brand infringement." },
  ],
  "fashion-manufacturing": [
    { id: "sug-fashion-manufacturing-nafdac", title: "NAFDAC Textile Registration", description: "Register textile products with NAFDAC.", explanation: "Fabrics contacting skin may require NAFDAC registration.", priority: "medium", reason: "Textile products require safety compliance." },
  ],
  "textile-production": [
    { id: "sug-textile-son", title: "SON Textile Standards", description: "Certify textile production meets SON standards.", explanation: "Textile manufacturers must meet quality standards.", priority: "high", reason: "Substandard textiles face market restrictions." },
  ],

  // General Business
  "trading": [
    { id: "sug-trading-license", title: "General Trading License", description: "Obtain trading license from local government.", explanation: "General trading businesses require local permits.", priority: "medium", reason: "Trading without license may result in fines." },
  ],
  "import-export": [
    { id: "sug-import-export-license", title: "Import/Export License", description: "Obtain import/export license from NCS.", explanation: "Cross-border trade requires customs registration.", priority: "critical", reason: "Importing without license risks seizure." },
  ],
};

const STATE_TASKS: Record<string, SuggestedTask[]> = {
  "lagos": [
    { id: "sug-lagos-lassa", title: "LASAA Signage Permit", description: "Register business signage with Lagos State Signage Agency.", explanation: "All business signs in Lagos require LASAA approval.", priority: "medium", reason: "Unauthorized signage in Lagos is subject to removal and fines." },
    { id: "sug-lagos-lirs", title: "Lagos PSN Business Premises Permit", description: "Obtain Premises Registration Number from LIRS.", explanation: "All Lagos businesses need a PSN from Lagos IRS.", priority: "high", reason: "PSN is mandatory for all businesses operating in Lagos." },
    { id: "sug-lagos-safety", title: "Lagos State Safety Commission Registration", description: "Register with Lagos State Safety Commission.", explanation: "Businesses in Lagos must register for safety compliance.", priority: "high", reason: "Safety commission registration is required in Lagos." },
  ],
  "abuja-fct": [
    { id: "sug-abuja-area-council", title: "Area Council Business Permit", description: "Obtain business permit from your FCT Area Council.", explanation: "Businesses in Abuja must register with their area council.", priority: "high", reason: "Area council permits are required for FCT businesses." },
  ],
  "rivers": [
    { id: "sug-rivers-rsirs", title: "Rivers State Tax Registration", description: "Register for Rivers State tax identification.", explanation: "Businesses in Rivers State require state tax registration.", priority: "high", reason: "State tax compliance is mandatory in Rivers." },
  ],
  "oyo": [
    { id: "sug-oyo-oyirs", title: "Oyo State Tax Registration", description: "Register with Oyo State Internal Revenue Service.", explanation: "Businesses in Oyo require state tax registration.", priority: "high", reason: "Oyo State tax compliance is mandatory." },
  ],
  "kano": [
    { id: "sug-kano-knirs", title: "Kano State Tax Registration", description: "Register with Kano State Internal Revenue Service.", explanation: "Businesses in Kano require state tax compliance.", priority: "high", reason: "Kano State tax registration is required." },
  ],
};

export function generateTaskSuggestions(profile: BusinessProfile | null): SuggestedTask[] {
  if (!profile) return [];

  const suggestions: SuggestedTask[] = [];
  const push = (s: SuggestedTask) => suggestions.push(s);

  // === UNIVERSAL TASKS ===
  if (!profile.isRegistered && !profile.hasCAC) {
    push({ id: "sug-business-registration", title: "Business Registration with CAC", description: "Register your business with the Corporate Affairs Commission.", explanation: "Every formal business entity in Nigeria must be registered with the CAC.", priority: "critical", reason: "All businesses require CAC registration to operate legally." });
  }

  push({ id: "sug-tin-registration", title: "Tax Identification Number (TIN)", description: "Register for a Tax Identification Number with FIRS.", explanation: "All businesses operating in Nigeria need a TIN for tax purposes.", priority: "high", reason: "A TIN is required for tax filings and government transactions." });
  push({ id: "sug-vat-registration", title: "VAT Registration and Filing", description: "Register for VAT with FIRS if turnover exceeds NGN 25M.", explanation: "Businesses above the VAT threshold must file monthly returns.", priority: "medium", reason: "VAT-registered businesses must charge 7.5% VAT." });
  push({ id: "sug-company-income-tax", title: "Company Income Tax Filing", description: "File annual Company Income Tax returns with FIRS.", explanation: "All registered companies must file annual CIT returns.", priority: "high", reason: "Failure to file CIT returns results in penalties." });
  push({ id: "sug-business-bank-account", title: "Business Bank Account", description: "Open a dedicated business bank account.", explanation: "Separating business and personal finances is essential.", priority: "medium", reason: "A business bank account is required for tax compliance." });

  // === REGISTERED BUSINESS TASKS ===
  if (profile.isRegistered || profile.hasCAC) {
    push({ id: "sug-cac-annual", title: "CAC Annual Return Filing", description: "File annual returns with the Corporate Affairs Commission.", explanation: "Registered businesses must file annual returns.", priority: "high", reason: "Annual returns maintain good standing with CAC." });
  }

  // === EMPLOYEE TASKS ===
  if (profile.employeeCount && profile.employeeCount !== "1") {
    push({ id: "sug-paye", title: "PAYE Tax Registration", description: "Register for PAYE tax with state revenue service.", explanation: "Businesses with employees must deduct and remit PAYE.", priority: "high", reason: "PAYE compliance is mandatory for employers." });
    push({ id: "sug-pension", title: "Employee Pension Registration", description: "Register with PenCom for employee pension contributions.", explanation: "Employers must contribute to the pension scheme.", priority: "high", reason: "Employers contribute 10% of employee salary to PFA." });
    push({ id: "sug-nsitf", title: "NSITF Employee Compensation", description: "Register with NSITF for Employee Compensation Scheme.", explanation: "All employers must register for the scheme.", priority: "medium", reason: "NSITF registration protects employees." });
    push({ id: "sug-itf", title: "ITF Skills Development Levy", description: "Register with ITF and contribute 1% of annual payroll.", explanation: "Businesses with 5+ employees must contribute to ITF.", priority: "medium", reason: "ITF contributions fund workforce training." });
  }

  // === PHYSICAL LOCATION TASKS ===
  if (profile.hasPhysicalLocation) {
    push({ id: "sug-premises-permit", title: "Business Premises Permit", description: "Obtain premises permit from local government.", explanation: "Physical business locations may require permits.", priority: "medium", reason: "Most local governments require premises permits." });
    push({ id: "sug-fire-safety", title: "Fire Safety Compliance", description: "Obtain fire safety certificate from state fire service.", explanation: "Commercial premises require fire safety certification.", priority: "medium", reason: "Fire safety compliance is mandatory." });
  }

  // === ONLINE OPERATIONS TASKS ===
  if (profile.hasOnlineOperations) {
    push({ id: "sug-data-protection", title: "Data Protection Compliance (NDPC)", description: "Register with NDPC for data protection compliance.", explanation: "Online businesses handling user data must register.", priority: "high", reason: "Data breaches can result in significant penalties." });
    push({ id: "sug-ecommerce-registration", title: "E-Commerce Registration", description: "Register online business with relevant authorities.", explanation: "E-commerce businesses may need state-level registration.", priority: "medium", reason: "Some states require separate online business registration." });
  }

  // === SUB-INDUSTRY TASKS ===
  if (profile.subIndustry) {
    const subTasks = SUB_INDUSTRY_TASKS[profile.subIndustry];
    if (subTasks) {
      for (const task of subTasks) push(task);
    }
  }

  // === INDUSTRY FALLBACK (if no sub-industry match) ===
  if (!profile.subIndustry || !SUB_INDUSTRY_TASKS[profile.subIndustry]) {
    const industryFallback: Record<string, SuggestedTask[]> = {
      "food-beverage": [
        { id: "sug-nafdac-food", title: "Food Safety Certification (NAFDAC)", description: "Register food products with NAFDAC.", explanation: "Food businesses require NAFDAC product registration.", priority: "critical", reason: "Food without NAFDAC certification cannot be sold." },
      ],
      "healthcare": [
        { id: "sug-health-nafdac", title: "NAFDAC Healthcare Product Registration", description: "Register healthcare products with NAFDAC.", explanation: "Healthcare products require NAFDAC approval.", priority: "critical", reason: "Unregistered healthcare products cannot be sold." },
      ],
      "finance-fintech": [
        { id: "sug-finance-cbn", title: "CBN Financial Services License", description: "Obtain regulatory license from CBN.", explanation: "Financial services require CBN licensing.", priority: "critical", reason: "Operating without CBN approval is a violation." },
      ],
      "technology": [
        { id: "sug-tech-ndpc", title: "NDPR Compliance for Tech", description: "Register with NDPC for data protection.", explanation: "Tech platforms handling user data must comply.", priority: "critical", reason: "Data breaches result in severe penalties." },
      ],
      "manufacturing": [
        { id: "sug-manufacturing-son", title: "SON Standards Certification", description: "Ensure products meet SON standards.", explanation: "Manufactured goods must meet quality standards.", priority: "high", reason: "SON certification is mandatory for manufactured goods." },
      ],
      "agriculture": [
        { id: "sug-agric-nafdac", title: "NAFDAC Agricultural Registration", description: "Register agricultural products with NAFDAC.", explanation: "Processed agricultural products need approval.", priority: "high", reason: "Agricultural products for consumption need regulatory approval." },
      ],
      "retail-ecommerce": [
        { id: "sug-retail-son", title: "SON Product Certification", description: "Ensure products meet SON standards.", explanation: "Retail products must meet quality standards.", priority: "high", reason: "Uncertified products can be seized." },
      ],
    };

    const fallback = industryFallback[profile.industry];
    if (fallback) {
      for (const task of fallback) push(task);
    }
  }

  // === STATE-SPECIFIC TASKS ===
  if (profile.state) {
    const stateTasks = STATE_TASKS[profile.state];
    if (stateTasks) {
      for (const task of stateTasks) push(task);
    }
  }

  // === SIZE-BASED TASKS ===
  if (profile.employeeCount === "51-200" || profile.employeeCount === "201+") {
    push({ id: "sug-industry-union", title: "Industrial Relations Compliance", description: "Register with trade unions and comply with labour laws.", explanation: "Larger workforces have additional labour obligations.", priority: "medium", reason: "Businesses with many employees have extra labour law duties." });
  }

  // === GENERAL TASKS ===
  push({ id: "sug-record-keeping", title: "Financial Record Keeping", description: "Maintain proper accounting records.", explanation: "All businesses must keep accurate financial records.", priority: "medium", reason: "Good record-keeping is essential for tax compliance." });

  return suggestions;
}

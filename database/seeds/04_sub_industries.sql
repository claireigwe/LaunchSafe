-- 04_sub_industries.sql
-- Seed sub-industries for each industry.
-- Each INSERT resolves the industry_id by slug.

-- AGRICULTURE
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'crop-farming', 'Crop Farming', 'Cultivation of crops on a commercial scale'
FROM public.industries i WHERE i.slug IN ('agriculture', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'crop-farming' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'livestock-farming', 'Livestock Farming', 'Rearing of livestock for commercial purposes'
FROM public.industries i WHERE i.slug IN ('agriculture', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'livestock-farming' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'poultry-farming', 'Poultry Farming', 'Commercial poultry and egg production'
FROM public.industries i WHERE i.slug IN ('agriculture', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'poultry-farming' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'fish-farming', 'Fish Farming', 'Aquaculture and fish production'
FROM public.industries i WHERE i.slug IN ('agriculture', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'fish-farming' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'agro-processing', 'Agro Processing', 'Processing of agricultural raw materials'
FROM public.industries i WHERE i.slug IN ('agriculture', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'agro-processing' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'agricultural-supply', 'Agricultural Supply', 'Supply of farm inputs and equipment'
FROM public.industries i WHERE i.slug IN ('agriculture', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'agricultural-supply' AND industry_id = i.id);

-- EDUCATION
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'nursery-school', 'Nursery School', 'Early childhood education'
FROM public.industries i WHERE i.slug = 'education'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'nursery-school' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'primary-school', 'Primary School', 'Primary education'
FROM public.industries i WHERE i.slug = 'education'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'primary-school' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'secondary-school', 'Secondary School', 'Secondary education'
FROM public.industries i WHERE i.slug = 'education'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'secondary-school' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'training-institute', 'Training Institute', 'Vocational and professional training'
FROM public.industries i WHERE i.slug = 'education'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'training-institute' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'coaching-centre', 'Coaching Centre', 'Tutorial and coaching services'
FROM public.industries i WHERE i.slug = 'education'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'coaching-centre' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'online-education', 'Online Education', 'Digital learning platforms'
FROM public.industries i WHERE i.slug = 'education'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'online-education' AND industry_id = i.id);

-- ENERGY
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'solar-installation', 'Solar Installation', 'Solar panel and renewable energy installation'
FROM public.industries i WHERE i.slug = 'energy-mining'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'solar-installation' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'renewable-energy-services', 'Renewable Energy Services', 'Renewable energy consulting and services'
FROM public.industries i WHERE i.slug = 'energy-mining'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'renewable-energy-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'fuel-station', 'Fuel Station', 'Petrol station and fuel retail'
FROM public.industries i WHERE i.slug = 'energy-mining'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'fuel-station' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'gas-distribution', 'Gas Distribution', 'LPG and natural gas distribution'
FROM public.industries i WHERE i.slug = 'energy-mining'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'gas-distribution' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'energy-consulting', 'Energy Consulting', 'Energy efficiency and advisory services'
FROM public.industries i WHERE i.slug = 'energy-mining'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'energy-consulting' AND industry_id = i.id);

-- FASHION & APPAREL
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'tailoring', 'Tailoring', 'Custom clothing and alterations'
FROM public.industries i WHERE i.slug = 'fashion-apparel'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'tailoring' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'fashion-design', 'Fashion Design', 'Fashion design and branding'
FROM public.industries i WHERE i.slug = 'fashion-apparel'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'fashion-design' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'clothing-retail', 'Clothing Retail', 'Retail sale of clothing and accessories'
FROM public.industries i WHERE i.slug = 'fashion-apparel'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'clothing-retail' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'textile-production', 'Textile Production', 'Textile manufacturing and production'
FROM public.industries i WHERE i.slug = 'fashion-apparel'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'textile-production' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'fashion-manufacturing', 'Fashion Manufacturing', 'Large-scale fashion production'
FROM public.industries i WHERE i.slug = 'fashion-apparel'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'fashion-manufacturing' AND industry_id = i.id);

-- FINANCE & FINTECH
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'fintech-startup', 'Fintech Startup', 'Financial technology startup'
FROM public.industries i WHERE i.slug IN ('finance-fintech', 'financial-services', 'finance')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'fintech-startup' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'payment-services', 'Payment Services', 'Digital payment and transaction processing'
FROM public.industries i WHERE i.slug IN ('finance-fintech', 'financial-services', 'finance')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'payment-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'agency-banking', 'Agency Banking', 'Banking agency and mobile money operations'
FROM public.industries i WHERE i.slug IN ('finance-fintech', 'financial-services', 'finance')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'agency-banking' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'lending-services', 'Lending Services', 'Microfinance and lending'
FROM public.industries i WHERE i.slug IN ('finance-fintech', 'financial-services', 'finance')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'lending-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'financial-technology-platform', 'Financial Technology Platform', 'Platform-based financial services'
FROM public.industries i WHERE i.slug IN ('finance-fintech', 'financial-services', 'finance')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'financial-technology-platform' AND industry_id = i.id);

-- FOOD & BEVERAGE
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'restaurant', 'Restaurant', 'Full-service restaurant'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'restaurant' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'fast-food-outlet', 'Fast Food Outlet', 'Quick service restaurant'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'fast-food-outlet' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'bakery', 'Bakery', 'Bakery and confectionery'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'bakery' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'catering-services', 'Catering Services', 'Event and corporate catering'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'catering-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'packaged-water-production', 'Packaged Water Production', 'Sachet and bottled water production'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'packaged-water-production' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'food-processing', 'Food Processing', 'Industrial food processing'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'food-processing' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'beverage-production', 'Beverage Production', 'Production of beverages and drinks'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'beverage-production' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'grocery-store', 'Grocery Store', 'Retail grocery and provision store'
FROM public.industries i WHERE i.slug = 'food-beverage'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'grocery-store' AND industry_id = i.id);

-- HEALTHCARE
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'pharmacy', 'Pharmacy', 'Retail pharmacy and drug dispensing'
FROM public.industries i WHERE i.slug IN ('healthcare', 'health-pharma')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'pharmacy' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'clinic', 'Clinic', 'Medical clinic and outpatient services'
FROM public.industries i WHERE i.slug IN ('healthcare', 'health-pharma')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'clinic' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'hospital', 'Hospital', 'Inpatient medical services'
FROM public.industries i WHERE i.slug IN ('healthcare', 'health-pharma')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'hospital' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'diagnostic-laboratory', 'Diagnostic Laboratory', 'Medical diagnostics and testing'
FROM public.industries i WHERE i.slug IN ('healthcare', 'health-pharma')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'diagnostic-laboratory' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'medical-equipment-supply', 'Medical Equipment Supply', 'Supply of medical equipment'
FROM public.industries i WHERE i.slug IN ('healthcare', 'health-pharma')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'medical-equipment-supply' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'telemedicine-services', 'Telemedicine Services', 'Remote healthcare services'
FROM public.industries i WHERE i.slug IN ('healthcare', 'health-pharma')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'telemedicine-services' AND industry_id = i.id);

-- MANUFACTURING
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'food-manufacturing', 'Food Manufacturing', 'Large-scale food production'
FROM public.industries i WHERE i.slug = 'manufacturing'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'food-manufacturing' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'consumer-goods-manufacturing', 'Consumer Goods Manufacturing', 'Manufacturing of consumer products'
FROM public.industries i WHERE i.slug = 'manufacturing'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'consumer-goods-manufacturing' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'chemical-manufacturing', 'Chemical Manufacturing', 'Industrial chemical production'
FROM public.industries i WHERE i.slug = 'manufacturing'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'chemical-manufacturing' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'industrial-production', 'Industrial Production', 'Heavy industrial manufacturing'
FROM public.industries i WHERE i.slug = 'manufacturing'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'industrial-production' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'packaging-production', 'Packaging Production', 'Packaging materials manufacturing'
FROM public.industries i WHERE i.slug = 'manufacturing'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'packaging-production' AND industry_id = i.id);

-- PROFESSIONAL SERVICES
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'consulting', 'Consulting', 'Management and business consulting'
FROM public.industries i WHERE i.slug IN ('professional-services', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'consulting' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'accounting-firm', 'Accounting Firm', 'Accounting and tax services'
FROM public.industries i WHERE i.slug IN ('professional-services', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'accounting-firm' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'legal-services', 'Legal Services', 'Legal advisory and representation'
FROM public.industries i WHERE i.slug IN ('professional-services', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'legal-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'marketing-agency', 'Marketing Agency', 'Marketing and advertising services'
FROM public.industries i WHERE i.slug IN ('professional-services', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'marketing-agency' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'recruitment-agency', 'Recruitment Agency', 'Recruitment and HR services'
FROM public.industries i WHERE i.slug IN ('professional-services', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'recruitment-agency' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'compliance-consulting', 'Compliance Consulting', 'Regulatory compliance advisory'
FROM public.industries i WHERE i.slug IN ('professional-services', 'general-business')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'compliance-consulting' AND industry_id = i.id);

-- REAL ESTATE & CONSTRUCTION
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'real-estate-agency', 'Real Estate Agency', 'Property sales and leasing'
FROM public.industries i WHERE i.slug = 'real-estate-construction'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'real-estate-agency' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'property-development', 'Property Development', 'Real estate development'
FROM public.industries i WHERE i.slug = 'real-estate-construction'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'property-development' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'construction-company', 'Construction Company', 'Building and construction services'
FROM public.industries i WHERE i.slug = 'real-estate-construction'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'construction-company' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'building-materials-supply', 'Building Materials Supply', 'Supply of construction materials'
FROM public.industries i WHERE i.slug = 'real-estate-construction'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'building-materials-supply' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'facility-management', 'Facility Management', 'Property and facility management'
FROM public.industries i WHERE i.slug = 'real-estate-construction'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'facility-management' AND industry_id = i.id);

-- RETAIL & E-COMMERCE
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'physical-retail-store', 'Physical Retail Store', 'Brick-and-mortar retail'
FROM public.industries i WHERE i.slug = 'retail-ecommerce'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'physical-retail-store' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'online-store', 'Online Store', 'E-commerce and online retail'
FROM public.industries i WHERE i.slug = 'retail-ecommerce'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'online-store' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'marketplace-seller', 'Marketplace Seller', 'Third-party marketplace selling'
FROM public.industries i WHERE i.slug = 'retail-ecommerce'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'marketplace-seller' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'wholesale-distribution', 'Wholesale Distribution', 'Wholesale and distribution'
FROM public.industries i WHERE i.slug = 'retail-ecommerce'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'wholesale-distribution' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'import-export', 'Import & Export', 'Cross-border trade'
FROM public.industries i WHERE i.slug = 'retail-ecommerce'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'import-export' AND industry_id = i.id);

-- TECHNOLOGY
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'saas', 'SaaS', 'Software as a Service platform'
FROM public.industries i WHERE i.slug IN ('technology', 'technology-saas')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'saas' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'software-development', 'Software Development', 'Custom software development'
FROM public.industries i WHERE i.slug IN ('technology', 'technology-saas')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'software-development' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'it-services', 'IT Services', 'IT support and infrastructure services'
FROM public.industries i WHERE i.slug IN ('technology', 'technology-saas')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'it-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'digital-agency', 'Digital Agency', 'Digital marketing and web services'
FROM public.industries i WHERE i.slug IN ('technology', 'technology-saas')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'digital-agency' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'cybersecurity-services', 'Cybersecurity Services', 'Security and compliance services'
FROM public.industries i WHERE i.slug IN ('technology', 'technology-saas')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'cybersecurity-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'ai-startup', 'AI Startup', 'Artificial intelligence and ML startup'
FROM public.industries i WHERE i.slug IN ('technology', 'technology-saas')
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'ai-startup' AND industry_id = i.id);

-- TRANSPORTATION & LOGISTICS
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'logistics-company', 'Logistics Company', 'Freight and logistics services'
FROM public.industries i WHERE i.slug = 'transportation-logistics'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'logistics-company' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'courier-service', 'Courier Service', 'Last-mile delivery and courier'
FROM public.industries i WHERE i.slug = 'transportation-logistics'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'courier-service' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'fleet-operations', 'Fleet Operations', 'Commercial fleet management'
FROM public.industries i WHERE i.slug = 'transportation-logistics'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'fleet-operations' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'ride-hailing-services', 'Ride-Hailing Services', 'Transportation network services'
FROM public.industries i WHERE i.slug = 'transportation-logistics'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'ride-hailing-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'haulage-services', 'Haulage Services', 'Heavy goods transportation'
FROM public.industries i WHERE i.slug = 'transportation-logistics'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'haulage-services' AND industry_id = i.id);

-- GENERAL BUSINESS
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'trading', 'Trading', 'General trading business'
FROM public.industries i WHERE i.slug = 'general-business'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'trading' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'general-merchandise', 'General Merchandise', 'Sale of general goods'
FROM public.industries i WHERE i.slug = 'general-business'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'general-merchandise' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'small-business-services', 'Small Business Services', 'Miscellaneous small business services'
FROM public.industries i WHERE i.slug = 'general-business'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'small-business-services' AND industry_id = i.id);
INSERT INTO public.sub_industries (industry_id, slug, name, description)
SELECT i.id, 'other', 'Other', 'Other business types not listed'
FROM public.industries i WHERE i.slug = 'general-business'
AND NOT EXISTS (SELECT 1 FROM public.sub_industries WHERE slug = 'other' AND industry_id = i.id);

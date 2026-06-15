-- 03_costs_expansion.sql
-- Adds comprehensive cost entries for all industry-specific requirements.
-- Amounts stored in kobo (100 kobo = NGN 1).
-- Official = government-stated fee. Estimated = realistic all-in cost (30-50% higher).

-- ========================
-- ADD ESTIMATED COSTS FOR SHARED REQUIREMENTS
-- ========================

-- CAC Registration: estimated cost (includes professional fees, documentation)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 2500000, 'NGN', 'Estimated total including professional fees and documentation', false
FROM public.requirements r WHERE r.name = 'Business Registration with CAC'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NSITF: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 200000, 'NGN', 'Estimated annual NSITF contribution', false
FROM public.requirements r WHERE r.name = 'NSITF Employee Compensation'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NAFDAC Product Registration: official cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1000000, 'NGN', 'Official NAFDAC product registration fee', true
FROM public.requirements r WHERE r.name = 'NAFDAC Product Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- NAFDAC Manufacturing License: official cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 2000000, 'NGN', 'Official NAFDAC manufacturing license fee', true
FROM public.requirements r WHERE r.name = 'NAFDAC Manufacturing License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- Lagos PSN: official cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1500000, 'NGN', 'Official Lagos PSN premises permit fee', true
FROM public.requirements r WHERE r.name = 'Lagos PSN Business Premises Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- Lagos PSN: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3000000, 'NGN', 'Estimated total including agency processing', false
FROM public.requirements r WHERE r.name = 'Lagos PSN Business Premises Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NAFDAC Manufacturing License: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3500000, 'NGN', 'Estimated total including facility inspection costs', false
FROM public.requirements r WHERE r.name = 'NAFDAC Manufacturing License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NDPC Data Protection: official cost (NDPC registration is free, audit costs are separate)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'NDPC registration is free. Audit costs are separate.', true
FROM public.requirements r WHERE r.name = 'NDPR Data Protection Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- ========================
-- HEALTHCARE / PHARMACEUTICAL COSTS
-- ========================

-- PCN Pharmacy License
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1000000, 'NGN', 'Official PCN pharmacy license fee (varies by premises category)', true
FROM public.requirements r WHERE r.name = 'PCN Pharmacy License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1500000, 'NGN', 'Estimated total including premises inspection and professional fees', false
FROM public.requirements r WHERE r.name = 'PCN Pharmacy License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NAFDAC Drug and Product Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 5000000, 'NGN', 'Official NAFDAC drug registration per product', true
FROM public.requirements r WHERE r.name = 'NAFDAC Drug and Product Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 7500000, 'NGN', 'Estimated total including lab testing per product', false
FROM public.requirements r WHERE r.name = 'NAFDAC Drug and Product Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Health Facility Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 2000000, 'NGN', 'Official health facility registration fee', true
FROM public.requirements r WHERE r.name = 'Health Facility Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3500000, 'NGN', 'Estimated total including inspection and certification', false
FROM public.requirements r WHERE r.name = 'Health Facility Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Medical Waste Management Permit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official medical waste management permit fee', true
FROM public.requirements r WHERE r.name = 'Medical Waste Management Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1000000, 'NGN', 'Estimated total including waste disposal setup', false
FROM public.requirements r WHERE r.name = 'Medical Waste Management Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Controlled Substances License
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official NDLEA controlled substances license', true
FROM public.requirements r WHERE r.name = 'Controlled Substances License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1000000, 'NGN', 'Estimated total including security clearance', false
FROM public.requirements r WHERE r.name = 'Controlled Substances License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- FINTECH COSTS
-- ========================

-- AML Compliance Program
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official AML compliance registration fee', true
FROM public.requirements r WHERE r.name = 'Anti-Money Laundering (AML) Compliance Program'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1500000, 'NGN', 'Estimated total including AML software and training', false
FROM public.requirements r WHERE r.name = 'Anti-Money Laundering (AML) Compliance Program'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- PCI DSS Compliance
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1000000, 'NGN', 'Official PCI DSS assessment fee (varies by volume)', true
FROM public.requirements r WHERE r.name = 'PCI DSS Compliance Certification'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3000000, 'NGN', 'Estimated total including audit and remediation', false
FROM public.requirements r WHERE r.name = 'PCI DSS Compliance Certification'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- SEC Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 5000000, 'NGN', 'Official SEC registration fee (varies by capital market activities)', true
FROM public.requirements r WHERE r.name = 'SEC Registration (Capital Market)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 7500000, 'NGN', 'Estimated total including professional advice', false
FROM public.requirements r WHERE r.name = 'SEC Registration (Capital Market)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- SCUML: estimated cost (official is already 0)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 500000, 'NGN', 'Estimated compliance preparation cost', false
FROM public.requirements r WHERE r.name = 'SCUML Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- CBN Payment License: estimated cost (official already exists)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 15000000, 'NGN', 'Estimated total including legal and compliance setup', false
FROM public.requirements r WHERE r.name = 'CBN Payment Service Provider License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- RETAIL & E-COMMERCE COSTS
-- ========================

-- FCCPC Consumer Protection Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 50000, 'NGN', 'Official FCCPC registration fee', true
FROM public.requirements r WHERE r.name = 'FCCPC Consumer Protection Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 200000, 'NGN', 'Estimated total including compliance documentation', false
FROM public.requirements r WHERE r.name = 'FCCPC Consumer Protection Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Customs Clearance (estimated only — varies per shipment)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 500000, 'NGN', 'Estimated customs clearance cost per shipment (varies by value)', false
FROM public.requirements r WHERE r.name = 'Customs Clearance for Imports'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- E-commerce Platform Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 200000, 'NGN', 'Official e-commerce registration fee', true
FROM public.requirements r WHERE r.name = 'E-commerce Platform Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 500000, 'NGN', 'Estimated total including platform compliance', false
FROM public.requirements r WHERE r.name = 'E-commerce Platform Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Trade License: official cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official trade license fee from local government', true
FROM public.requirements r WHERE r.name = 'Trade License (Local Government)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- ========================
-- MANUFACTURING COSTS
-- ========================

-- Factory Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official factory registration fee', true
FROM public.requirements r WHERE r.name = 'Factory Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1000000, 'NGN', 'Estimated total including inspection fees', false
FROM public.requirements r WHERE r.name = 'Factory Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Environmental Impact Assessment
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1000000, 'NGN', 'Official EIA fee (varies by project scale)', true
FROM public.requirements r WHERE r.name = 'Environmental Impact Assessment (EIA)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3000000, 'NGN', 'Estimated total including consultant fees', false
FROM public.requirements r WHERE r.name = 'Environmental Impact Assessment (EIA)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Industrial Waste Management Permit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 300000, 'NGN', 'Official industrial waste management permit', true
FROM public.requirements r WHERE r.name = 'Industrial Waste Management Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 800000, 'NGN', 'Estimated total including waste disposal plan', false
FROM public.requirements r WHERE r.name = 'Industrial Waste Management Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- SON Manufacturing Standards Certification
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official SON manufacturing certification fee', true
FROM public.requirements r WHERE r.name = 'SON Manufacturing Standards Certification'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1200000, 'NGN', 'Estimated total including product testing', false
FROM public.requirements r WHERE r.name = 'SON Manufacturing Standards Certification'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Occupational Health and Safety
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 300000, 'NGN', 'Official OHS compliance registration', true
FROM public.requirements r WHERE r.name = 'Occupational Health and Safety Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 800000, 'NGN', 'Estimated total including training and inspections', false
FROM public.requirements r WHERE r.name = 'Occupational Health and Safety Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- TECHNOLOGY COSTS
-- ========================

-- NITDA Technology Compliance
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 200000, 'NGN', 'Official NITDA registration fee', true
FROM public.requirements r WHERE r.name = 'NITDA Technology Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 500000, 'NGN', 'Estimated total including compliance documentation', false
FROM public.requirements r WHERE r.name = 'NITDA Technology Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Data Protection Audit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 300000, 'NGN', 'Official data protection audit fee (varies by data volume)', true
FROM public.requirements r WHERE r.name = 'Data Protection Audit (Annual)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1000000, 'NGN', 'Estimated total including auditor fees', false
FROM public.requirements r WHERE r.name = 'Data Protection Audit (Annual)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Software IP Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 50000, 'NGN', 'Official software copyright registration fee', true
FROM public.requirements r WHERE r.name = 'Software Intellectual Property Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 200000, 'NGN', 'Estimated total including legal fees', false
FROM public.requirements r WHERE r.name = 'Software Intellectual Property Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- AGRICULTURE COSTS
-- ========================

-- Agricultural Land Use Permit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 200000, 'NGN', 'Official agricultural land use permit', true
FROM public.requirements r WHERE r.name = 'Agricultural Land Use Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 500000, 'NGN', 'Estimated total including survey and processing', false
FROM public.requirements r WHERE r.name = 'Agricultural Land Use Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Pesticide Permit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 100000, 'NGN', 'Official pesticide use permit', true
FROM public.requirements r WHERE r.name = 'Pesticide and Chemical Use Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 300000, 'NGN', 'Estimated total including inspection', false
FROM public.requirements r WHERE r.name = 'Pesticide and Chemical Use Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Phytosanitary Certificate
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 150000, 'NGN', 'Official phytosanitary certificate fee per shipment', true
FROM public.requirements r WHERE r.name = 'Phytosanitary Certificate (Export)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 350000, 'NGN', 'Estimated total including inspection per shipment', false
FROM public.requirements r WHERE r.name = 'Phytosanitary Certificate (Export)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- FASHION & APPAREL COSTS
-- ========================

-- SON Textile Standards
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 300000, 'NGN', 'Official SON textile standards certification', true
FROM public.requirements r WHERE r.name = 'SON Textile Standards Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 600000, 'NGN', 'Estimated total including product testing', false
FROM public.requirements r WHERE r.name = 'SON Textile Standards Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NAFDAC Textile Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official NAFDAC textile product registration', true
FROM public.requirements r WHERE r.name = 'NAFDAC Textile Product Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 800000, 'NGN', 'Estimated total including lab testing', false
FROM public.requirements r WHERE r.name = 'NAFDAC Textile Product Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Export Clearance
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 200000, 'NGN', 'Official NEPC export clearance fee', true
FROM public.requirements r WHERE r.name = 'Export Clearance for International Sales'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 400000, 'NGN', 'Estimated total including documentation', false
FROM public.requirements r WHERE r.name = 'Export Clearance for International Sales'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- EDUCATION COSTS
-- ========================

-- Ministry of Education Operating License
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 2000000, 'NGN', 'Official Ministry of Education operating license', true
FROM public.requirements r WHERE r.name = 'Ministry of Education Operating License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 5000000, 'NGN', 'Estimated total including facility inspection', false
FROM public.requirements r WHERE r.name = 'Ministry of Education Operating License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- School Registration with State
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official state school registration fee', true
FROM public.requirements r WHERE r.name = 'School Registration with State Ministry'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1500000, 'NGN', 'Estimated total including approval process', false
FROM public.requirements r WHERE r.name = 'School Registration with State Ministry'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Staff Qualification Verification
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 50000, 'NGN', 'Official TRCN registration per teacher', true
FROM public.requirements r WHERE r.name = 'Staff Qualification Verification'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 150000, 'NGN', 'Estimated total per teacher including processing', false
FROM public.requirements r WHERE r.name = 'Staff Qualification Verification'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- PROFESSIONAL SERVICES COSTS
-- ========================

-- Professional Indemnity Insurance
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Annual professional indemnity insurance premium (varies by profession)', true
FROM public.requirements r WHERE r.name = 'Professional Indemnity Insurance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1000000, 'NGN', 'Estimated total including broker fees', false
FROM public.requirements r WHERE r.name = 'Professional Indemnity Insurance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Professional Body Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 300000, 'NGN', 'Official professional body registration fee (varies by body)', true
FROM public.requirements r WHERE r.name = 'Professional Body Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 700000, 'NGN', 'Estimated total including induction and documentation', false
FROM public.requirements r WHERE r.name = 'Professional Body Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Practice License Renewal
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 200000, 'NGN', 'Annual practice license renewal fee', true
FROM public.requirements r WHERE r.name = 'Practice License Renewal'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 400000, 'NGN', 'Estimated total including CPD requirements', false
FROM public.requirements r WHERE r.name = 'Practice License Renewal'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- TRANSPORTATION & LOGISTICS COSTS
-- ========================

-- Transport Operator License
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 500000, 'NGN', 'Official transport operator license', true
FROM public.requirements r WHERE r.name = 'Transport Operator License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 1200000, 'NGN', 'Estimated total including vehicle inspections', false
FROM public.requirements r WHERE r.name = 'Transport Operator License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Commercial Vehicle Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 300000, 'NGN', 'Official commercial vehicle registration per vehicle', true
FROM public.requirements r WHERE r.name = 'Commercial Vehicle Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 600000, 'NGN', 'Estimated total per vehicle including road worthiness', false
FROM public.requirements r WHERE r.name = 'Commercial Vehicle Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Logistics Service Permit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1500000, 'NGN', 'Official NIPOST logistics license fee', true
FROM public.requirements r WHERE r.name = 'Logistics Service Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3000000, 'NGN', 'Estimated total including facility inspection', false
FROM public.requirements r WHERE r.name = 'Logistics Service Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- REAL ESTATE & CONSTRUCTION COSTS
-- ========================

-- Building Plan Approval
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1500000, 'NGN', 'Official building plan approval fee', true
FROM public.requirements r WHERE r.name = 'Building Plan Approval'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 5000000, 'NGN', 'Estimated total including architect and processing', false
FROM public.requirements r WHERE r.name = 'Building Plan Approval'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Contractor Registration
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 300000, 'NGN', 'Official CORBON contractor registration', true
FROM public.requirements r WHERE r.name = 'Contractor Registration with CORBON'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 700000, 'NGN', 'Estimated total including verification', false
FROM public.requirements r WHERE r.name = 'Contractor Registration with CORBON'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Development Permit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 2000000, 'NGN', 'Official development permit fee', true
FROM public.requirements r WHERE r.name = 'Development Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 5000000, 'NGN', 'Estimated total including environmental assessment', false
FROM public.requirements r WHERE r.name = 'Development Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- ========================
-- ENERGY & MINING COSTS
-- ========================

-- Energy Generation License
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 5000000, 'NGN', 'Official NERC generation license (varies by capacity)', true
FROM public.requirements r WHERE r.name = 'Energy Generation License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 15000000, 'NGN', 'Estimated total including feasibility studies', false
FROM public.requirements r WHERE r.name = 'Energy Generation License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Mining Lease
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 10000000, 'NGN', 'Official mining lease fee (varies by mineral type)', true
FROM public.requirements r WHERE r.name = 'Mining Lease or License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 25000000, 'NGN', 'Estimated total including EIA and community agreements', false
FROM public.requirements r WHERE r.name = 'Mining Lease or License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- EIA for Energy/Mining
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 3000000, 'NGN', 'Official EIA fee for energy/mining projects', true
FROM public.requirements r WHERE r.name = 'Environmental Impact Assessment (Energy/Mining)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 8000000, 'NGN', 'Estimated total including consultant and community engagement', false
FROM public.requirements r WHERE r.name = 'Environmental Impact Assessment (Energy/Mining)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Explosives Permit
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1000000, 'NGN', 'Official explosives and hazardous materials permit', true
FROM public.requirements r WHERE r.name = 'Explosives and Hazardous Materials Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3000000, 'NGN', 'Estimated total including safety compliance', false
FROM public.requirements r WHERE r.name = 'Explosives and Hazardous Materials Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

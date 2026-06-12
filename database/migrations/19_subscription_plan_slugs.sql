-- 19_subscription_plan_slugs.sql
-- Standardise subscription plan slugs to: starter, growth, enterprise.

-- 1. Drop the old CHECK constraint (Postgres names it automatically)
ALTER TABLE public.subscription_plans
DROP CONSTRAINT IF EXISTS subscription_plans_slug_check;

-- 2. Add the new constraint with only the three active slugs
ALTER TABLE public.subscription_plans
ADD CONSTRAINT subscription_plans_slug_check
CHECK (slug IN ('starter', 'growth', 'enterprise'));

-- 3. Remove rows with old slugs that are no longer used
DELETE FROM public.subscription_plans WHERE slug NOT IN ('starter', 'growth', 'enterprise');

-- 4. Seed Starter plan if missing (prices in kobo: 10000 NGN = 1,000,000 kobo)
INSERT INTO public.subscription_plans (slug, name, price_monthly, price_yearly, currency, features, business_limit, assessment_limit, is_active)
SELECT 'starter', 'Starter', 1000000, 10200000, 'NGN',
  '["basic_dashboard", "basic_assessments", "basic_reports"]'::jsonb,
  1, 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'starter');

-- 5. Seed Growth plan if missing
INSERT INTO public.subscription_plans (slug, name, price_monthly, price_yearly, currency, features, business_limit, assessment_limit, is_active)
SELECT 'growth', 'Growth', 2000000, 21600000, 'NGN',
  '["unlimited_assessments", "compliance_dashboard", "compliance_calendar", "compliance_health_score", "notifications", "regulatory_updates", "document_generation", "evidence_management"]'::jsonb,
  5, -1, true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'growth');

-- 6. Seed Enterprise plan if missing
INSERT INTO public.subscription_plans (slug, name, price_monthly, price_yearly, currency, features, business_limit, assessment_limit, is_active)
SELECT 'enterprise', 'Enterprise', 3500000, 38400000, 'NGN',
  '["unlimited_assessments", "compliance_dashboard", "compliance_calendar", "compliance_health_score", "notifications", "regulatory_updates", "document_generation", "evidence_management", "multi_business", "team_collaboration", "advanced_reporting", "priority_support", "ai_compliance"]'::jsonb,
  20, -1, true
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'enterprise');

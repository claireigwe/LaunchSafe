-- 22_sub_industries.sql
-- Add sub-industry support for more granular compliance requirements.

-- Sub-industries table (platform-owned, like industries)
CREATE TABLE IF NOT EXISTS public.sub_industries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id UUID NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(industry_id, slug)
);

-- Add sub_industry_id to requirements for future LGA-level compliance mapping
ALTER TABLE public.requirements
  ADD COLUMN IF NOT EXISTS sub_industry_id UUID REFERENCES public.sub_industries(id) ON DELETE SET NULL;

ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS sub_industry_id UUID REFERENCES public.sub_industries(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lga_id UUID REFERENCES public.lgas(id) ON DELETE SET NULL;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS sub_industry_id UUID REFERENCES public.sub_industries(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lga_id UUID REFERENCES public.lgas(id) ON DELETE SET NULL;

-- RLS for sub_industries (read-only for authenticated users, like industries)
ALTER TABLE public.sub_industries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sub_industries"
  ON public.sub_industries FOR SELECT
  USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sub_industries_industry ON public.sub_industries(industry_id);
CREATE INDEX IF NOT EXISTS idx_requirements_sub_industry ON public.requirements(sub_industry_id);

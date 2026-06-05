-- 03_assessments.sql

CREATE TABLE IF NOT EXISTS public.assessments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id    UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  industry_id    UUID,                         -- FK added after 06_regulatory.sql
  country_id     UUID,
  state_id       UUID,
  status         TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  -- summary_json: available before payment (counts, categories, complexity only)
  summary_json   JSONB,
  -- results_json: full report — only populated after server-verified payment
  results_json   JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id     ON public.assessments(user_id);
CREATE INDEX idx_assessments_business_id ON public.assessments(business_id);
CREATE INDEX idx_assessments_status      ON public.assessments(status);

CREATE TRIGGER set_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

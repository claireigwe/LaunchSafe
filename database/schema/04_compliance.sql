-- 04_compliance.sql

CREATE TABLE IF NOT EXISTS public.compliance_tasks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id      UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  requirement_id   UUID,                       -- FK added after 06_regulatory.sql
  requirement_name TEXT NOT NULL,              -- denormalized for display
  agency_name      TEXT NOT NULL,              -- denormalized for display
  status           TEXT NOT NULL DEFAULT 'not_started'
                     CHECK (status IN (
                       'not_started', 'in_progress', 'awaiting_submission',
                       'submitted', 'approved', 'due_soon', 'overdue', 'completed'
                     )),
  due_date         DATE,
  completed_at     TIMESTAMPTZ,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_tasks_business_id ON public.compliance_tasks(business_id);
CREATE INDEX idx_compliance_tasks_status      ON public.compliance_tasks(status);
CREATE INDEX idx_compliance_tasks_due_date    ON public.compliance_tasks(due_date);

CREATE TRIGGER set_compliance_tasks_updated_at
  BEFORE UPDATE ON public.compliance_tasks
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Compliance scores
CREATE TABLE IF NOT EXISTS public.compliance_scores (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id     UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  score           INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  breakdown       JSONB NOT NULL DEFAULT '{}',
  calculated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_scores_business_id ON public.compliance_scores(business_id);

-- Evidence
CREATE TABLE IF NOT EXISTS public.evidence (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id         UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id),
  compliance_task_id  UUID REFERENCES public.compliance_tasks(id) ON DELETE SET NULL,
  requirement_id      UUID,
  title               TEXT NOT NULL,
  description         TEXT,
  file_url            TEXT NOT NULL,
  file_type           TEXT NOT NULL,
  file_size_bytes     BIGINT NOT NULL,
  is_archived         BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Evidence is immutable after upload: no updated_at trigger intentionally.
CREATE INDEX idx_evidence_business_id ON public.evidence(business_id);
CREATE INDEX idx_evidence_task_id     ON public.evidence(compliance_task_id);
-- 07_documents.sql

CREATE TABLE IF NOT EXISTS public.compliance_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id     UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  requirement_id  UUID REFERENCES public.requirements(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  document_type   TEXT NOT NULL
                    CHECK (document_type IN (
                      'application_letter', 'compliance_plan', 'checklist',
                      'policy', 'declaration', 'report'
                    )),
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'final', 'archived')),
  storage_path    TEXT,                         -- Supabase Storage path
  content         TEXT,                         -- raw content before PDF generation
  version         INTEGER NOT NULL DEFAULT 1,
  generated_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generated documents may NEVER represent official government approvals/certificates/permits.

CREATE INDEX idx_compliance_documents_business_id ON public.compliance_documents(business_id);

CREATE TRIGGER set_compliance_documents_updated_at
  BEFORE UPDATE ON public.compliance_documents
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

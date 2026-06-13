-- 21_evidence_document_id.sql
-- Add document_id column so evidence records can link back to their source document.

ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS document_id UUID REFERENCES public.compliance_documents(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_evidence_document_id ON public.evidence(document_id);

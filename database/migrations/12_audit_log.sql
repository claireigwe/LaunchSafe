-- Audit log — immutable record of meaningful actions.
-- Once written, rows are never updated or deleted.

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT,
  metadata    JSONB DEFAULT '{}',
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit log"
  ON public.audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert audit log"
  ON public.audit_log FOR INSERT
  WITH CHECK (true);

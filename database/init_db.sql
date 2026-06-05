-- 00_extensions.sql
-- Enable required PostgreSQL extensions.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy text search
-- 01_users.sql
-- User profile table extending Supabase Auth.
-- auth.users is managed by Supabase — we extend it here.

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  phone        TEXT,
  country      TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatically create a profile when a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Updated-at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
-- 02_businesses.sql

CREATE TABLE IF NOT EXISTS public.businesses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  industry_id     UUID,                        -- FK added after 06_regulatory.sql
  country_id      UUID,                        -- FK added after 06_regulatory.sql
  state_id        UUID,
  lga_id          UUID,
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived', 'suspended')),
  launch_date     DATE,
  employee_count  INTEGER,
  website         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_businesses_status   ON public.businesses(status);

CREATE TRIGGER set_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
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
-- 05_billing.sql

-- Payments (covers both assessment purchases and subscription payments)
CREATE TABLE IF NOT EXISTS public.payments (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES auth.users(id),
  amount               BIGINT NOT NULL,          -- stored in kobo (smallest unit)
  currency             TEXT NOT NULL DEFAULT 'NGN',
  provider             TEXT NOT NULL DEFAULT 'paystack',
  payment_type         TEXT NOT NULL
                         CHECK (payment_type IN ('assessment', 'subscription')),
  reference            TEXT NOT NULL UNIQUE,     -- LaunchSafe-generated reference
  provider_reference   TEXT,                     -- Paystack reference
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  metadata             JSONB,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NEVER store card numbers, CVV, or expiry dates.

CREATE INDEX idx_payments_user_id   ON public.payments(user_id);
CREATE INDEX idx_payments_reference ON public.payments(reference);
CREATE INDEX idx_payments_status    ON public.payments(status);

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Assessment purchases
CREATE TABLE IF NOT EXISTS public.assessment_purchases (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id),
  payment_id    UUID REFERENCES public.payments(id),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  unlocked_at   TIMESTAMPTZ,                    -- set only after server-side verification
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id)                         -- one purchase per assessment
);

CREATE TRIGGER set_assessment_purchases_updated_at
  BEFORE UPDATE ON public.assessment_purchases
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Subscription plans (configurable — not hardcoded)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE
                     CHECK (slug IN ('free', 'pro', 'business', 'enterprise')),
  price_monthly    BIGINT NOT NULL DEFAULT 0,   -- in kobo
  price_yearly     BIGINT NOT NULL DEFAULT 0,
  currency         TEXT NOT NULL DEFAULT 'NGN',
  features         JSONB NOT NULL DEFAULT '[]',
  business_limit   INTEGER NOT NULL DEFAULT 1,
  assessment_limit INTEGER NOT NULL DEFAULT 1,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                      UUID NOT NULL REFERENCES auth.users(id),
  plan_id                      UUID NOT NULL REFERENCES public.subscription_plans(id),
  status                       TEXT NOT NULL DEFAULT 'trial'
                                 CHECK (status IN ('trial', 'active', 'expired', 'cancelled', 'suspended')),
  paystack_subscription_code   TEXT,
  current_period_start         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end           TIMESTAMPTZ NOT NULL,
  cancelled_at                 TIMESTAMPTZ,
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status  ON public.subscriptions(status);

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Billing events (immutable audit log)
CREATE TABLE IF NOT EXISTS public.billing_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  payment_id      UUID REFERENCES public.payments(id),
  event_type      TEXT NOT NULL,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at: billing events are immutable audit records.
);

CREATE INDEX idx_billing_events_user_id ON public.billing_events(user_id);
-- 06_regulatory.sql
-- Platform-owned regulatory knowledge — not editable by regular users.

-- Geographic hierarchy
CREATE TABLE IF NOT EXISTS public.countries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,           -- ISO 3166-1 alpha-2
  currency_code TEXT NOT NULL DEFAULT 'NGN',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.states (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID NOT NULL REFERENCES public.countries(id),
  name       TEXT NOT NULL,
  code       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lgas (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id   UUID NOT NULL REFERENCES public.states(id),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Industries
CREATE TABLE IF NOT EXISTS public.industries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id   UUID REFERENCES public.industries(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Regulatory agencies
CREATE TABLE IF NOT EXISTS public.agencies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id  UUID NOT NULL REFERENCES public.countries(id),
  name        TEXT NOT NULL,
  acronym     TEXT,
  website     TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Requirements (core regulatory knowledge)
CREATE TABLE IF NOT EXISTS public.requirements (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id         UUID NOT NULL REFERENCES public.agencies(id),
  industry_id       UUID NOT NULL REFERENCES public.industries(id),
  country_id        UUID NOT NULL REFERENCES public.countries(id),
  state_id          UUID REFERENCES public.states(id),
  lga_id            UUID REFERENCES public.lgas(id),
  name              TEXT NOT NULL,
  description       TEXT NOT NULL,
  requirement_type  TEXT NOT NULL
                      CHECK (requirement_type IN (
                        'registration', 'license', 'permit', 'inspection',
                        'tax', 'filing', 'certification', 'reporting'
                      )),
  frequency         TEXT NOT NULL
                      CHECK (frequency IN (
                        'one_time', 'monthly', 'quarterly', 'annual', 'event_driven'
                      )),
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN (
                        'draft', 'under_review', 'verified', 'active', 'updated', 'archived'
                      )),
  confidence_level  TEXT NOT NULL DEFAULT 'estimated'
                      CHECK (confidence_level IN (
                        'verified', 'estimated', 'community_reported'
                      )),
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  source_url        TEXT,
  source_document   TEXT,
  verified_at       TIMESTAMPTZ,
  last_reviewed_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requirements_industry_id ON public.requirements(industry_id);
CREATE INDEX idx_requirements_country_id  ON public.requirements(country_id);
CREATE INDEX idx_requirements_status      ON public.requirements(status);

CREATE TRIGGER set_requirements_updated_at
  BEFORE UPDATE ON public.requirements
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Requirement costs (official vs estimated vs community must remain separate)
CREATE TABLE IF NOT EXISTS public.requirement_costs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requirement_id  UUID NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
  cost_type       TEXT NOT NULL
                    CHECK (cost_type IN ('official', 'estimated', 'community_reported')),
  amount          BIGINT NOT NULL,              -- in smallest currency unit
  currency        TEXT NOT NULL DEFAULT 'NGN',
  notes           TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_requirement_costs_updated_at
  BEFORE UPDATE ON public.requirement_costs
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Regulatory updates
CREATE TABLE IF NOT EXISTS public.regulatory_updates (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                  TEXT NOT NULL,
  summary                TEXT NOT NULL,
  source                 TEXT NOT NULL,
  source_url             TEXT,
  effective_date         DATE NOT NULL,
  affected_industries    JSONB NOT NULL DEFAULT '[]',
  affected_requirements  JSONB NOT NULL DEFAULT '[]',
  impact_level           TEXT NOT NULL DEFAULT 'medium'
                           CHECK (impact_level IN ('low', 'medium', 'high')),
  is_published           BOOLEAN NOT NULL DEFAULT FALSE,
  published_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_regulatory_updates_updated_at
  BEFORE UPDATE ON public.regulatory_updates
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Add FK constraints to businesses and assessments tables
ALTER TABLE public.businesses
  ADD CONSTRAINT fk_businesses_industry  FOREIGN KEY (industry_id)  REFERENCES public.industries(id),
  ADD CONSTRAINT fk_businesses_country   FOREIGN KEY (country_id)   REFERENCES public.countries(id),
  ADD CONSTRAINT fk_businesses_state     FOREIGN KEY (state_id)     REFERENCES public.states(id),
  ADD CONSTRAINT fk_businesses_lga       FOREIGN KEY (lga_id)       REFERENCES public.lgas(id);

ALTER TABLE public.assessments
  ADD CONSTRAINT fk_assessments_industry FOREIGN KEY (industry_id)  REFERENCES public.industries(id),
  ADD CONSTRAINT fk_assessments_country  FOREIGN KEY (country_id)   REFERENCES public.countries(id),
  ADD CONSTRAINT fk_assessments_state    FOREIGN KEY (state_id)     REFERENCES public.states(id);

ALTER TABLE public.compliance_tasks
  ADD CONSTRAINT fk_tasks_requirement    FOREIGN KEY (requirement_id) REFERENCES public.requirements(id);
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
-- 08_notifications.sql

CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  type        TEXT NOT NULL
                CHECK (type IN (
                  'deadline_reminder', 'payment_success', 'payment_failed',
                  'subscription_expiring', 'subscription_expired',
                  'assessment_unlocked', 'regulatory_update', 'compliance_overdue'
                )),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  action_url  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at     TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Notification preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_deadline_reminders      BOOLEAN NOT NULL DEFAULT TRUE,
  email_payment_alerts          BOOLEAN NOT NULL DEFAULT TRUE,
  email_regulatory_updates      BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_deadline_reminders     BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_payment_alerts         BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_regulatory_updates     BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_days_before          INTEGER NOT NULL DEFAULT 7,
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
-- 09_ai_knowledge.sql
-- AI knowledge base for RAG (Retrieval-Augmented Generation).
-- All compliance AI responses must originate from this knowledge base.
-- Model memory must never be treated as regulatory authority.

-- Knowledge documents (approved regulatory sources only)
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  source_url      TEXT,
  source_type     TEXT NOT NULL
                    CHECK (source_type IN (
                      'regulation', 'circular', 'guideline', 'agency_publication',
                      'fee_schedule', 'directive', 'compliance_template'
                    )),
  country_id      UUID REFERENCES public.countries(id),
  industry_id     UUID REFERENCES public.industries(id),
  requirement_id  UUID REFERENCES public.requirements(id),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_knowledge_documents_updated_at
  BEFORE UPDATE ON public.knowledge_documents
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Vector embeddings for semantic search
CREATE TABLE IF NOT EXISTS public.knowledge_embeddings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id     UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
  chunk_index     INTEGER NOT NULL,             -- position of this chunk in the document
  chunk_text      TEXT NOT NULL,
  embedding       VECTOR(1536),                 -- OpenAI text-embedding-3-small dimensions
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HNSW index for fast approximate nearest neighbour search
CREATE INDEX idx_knowledge_embeddings_vector
  ON public.knowledge_embeddings
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX idx_knowledge_embeddings_document_id
  ON public.knowledge_embeddings(document_id);
-- 10_rls_policies.sql
-- Row-Level Security policies.
-- All user-owned tables must enforce RLS.
-- Users may only access their own data.

-- Enable RLS on all user-owned tables
ALTER TABLE public.user_profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_scores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_purchases     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Regulatory / knowledge tables are platform-owned — read-only for authenticated users
ALTER TABLE public.countries            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lgas                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirement_costs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_updates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- User Profiles
-- =============================================
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- Businesses
-- =============================================
CREATE POLICY "Users can view their own businesses"
  ON public.businesses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- Assessments
-- =============================================
CREATE POLICY "Users can view their own assessments"
  ON public.assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Compliance Tasks
-- =============================================
CREATE POLICY "Users can view tasks for their businesses"
  ON public.compliance_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = compliance_tasks.business_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks for their businesses"
  ON public.compliance_tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = compliance_tasks.business_id
      AND b.user_id = auth.uid()
    )
  );

-- =============================================
-- Compliance Scores
-- =============================================
CREATE POLICY "Users can view scores for their businesses"
  ON public.compliance_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = compliance_scores.business_id
      AND b.user_id = auth.uid()
    )
  );

-- =============================================
-- Evidence
-- =============================================
CREATE POLICY "Users can view evidence for their businesses"
  ON public.evidence FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = evidence.business_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload evidence for their businesses"
  ON public.evidence FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = evidence.business_id
      AND b.user_id = auth.uid()
    )
  );

-- =============================================
-- Compliance Documents
-- =============================================
CREATE POLICY "Users can view their documents"
  ON public.compliance_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents for their businesses"
  ON public.compliance_documents FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = compliance_documents.business_id
      AND b.user_id = auth.uid()
    )
  );

-- =============================================
-- Payments & Billing
-- =============================================
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their assessment purchases"
  ON public.assessment_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their billing events"
  ON public.billing_events FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================
-- Notifications
-- =============================================
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- Regulatory / Knowledge (read-only for authenticated users)
-- =============================================
CREATE POLICY "Authenticated users can read countries"
  ON public.countries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read states"
  ON public.states FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read lgas"
  ON public.lgas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read industries"
  ON public.industries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read agencies"
  ON public.agencies FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read active requirements"
  ON public.requirements FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'active');

CREATE POLICY "Authenticated users can read requirement costs"
  ON public.requirement_costs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read published regulatory updates"
  ON public.regulatory_updates FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = TRUE);

CREATE POLICY "Authenticated users can read active knowledge documents"
  ON public.knowledge_documents FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = TRUE);

CREATE POLICY "Authenticated users can read knowledge embeddings"
  ON public.knowledge_embeddings FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role bypasses RLS for admin operations (webhooks, cron, migrations).

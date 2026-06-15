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

CREATE POLICY "Anonymous users can create assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (user_id IS NULL);

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

-- Document templates (platform-owned, read-only for authenticated users)
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active document templates"
  ON public.document_templates FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Service role bypasses RLS for admin operations (webhooks, cron, migrations).

-- 23_anonymous_assessments.sql
-- Allow assessments to be created without a user_id (anonymous users)
-- so that paid assessments persist and can be linked to a user after signup.

ALTER TABLE public.assessments
  ALTER COLUMN user_id DROP NOT NULL;

-- Also allow assessment_purchases and payments without user_id
-- for anonymous payment tracking.
ALTER TABLE public.assessment_purchases
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.payments
  ALTER COLUMN user_id DROP NOT NULL;

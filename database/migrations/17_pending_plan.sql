ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS pending_plan_id UUID REFERENCES public.subscription_plans(id);

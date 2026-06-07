-- Function to safely delete a user from auth schema
-- Uses SECURITY DEFINER to run with the permissions of the function creator (superuser)
-- This bypasses the GoTrue Admin API which can return 500 errors

CREATE OR REPLACE FUNCTION public.delete_auth_user(uid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  DELETE FROM auth.identities WHERE user_id = uid;
  DELETE FROM auth.sessions WHERE user_id = uid;
  DELETE FROM auth.refresh_tokens WHERE user_id = uid;
  DELETE FROM auth.mfa_factors WHERE user_id = uid;
  DELETE FROM auth.mfa_challenges WHERE user_id = uid;
  DELETE FROM auth.users WHERE id = uid;
END;
$$;
    
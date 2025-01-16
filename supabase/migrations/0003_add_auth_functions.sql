-- Create a function to set the authenticated context
CREATE OR REPLACE FUNCTION set_authenticated_context(auth_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth_user_id IS NULL THEN
    RESET ROLE;
  ELSE
    EXECUTE format('SET LOCAL ROLE authenticated; SET LOCAL "request.jwt.claim.sub" = %L', auth_user_id);
  END IF;
END;
$$;

-- Create a function to set a user's password
CREATE OR REPLACE PROCEDURE auth.set_password(user_id uuid, new_password text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  hashed_password text;
BEGIN
  -- Hash the password using Supabase Auth's default algorithm
  hashed_password := crypt(new_password, gen_salt('bf'));
  
  -- Update the user's password
  UPDATE auth.users
  SET 
    encrypted_password = hashed_password,
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now(),
    confirmation_token = NULL,
    confirmation_sent_at = NULL,
    recovery_token = NULL,
    recovery_sent_at = NULL
  WHERE id = user_id;
END;
$$; 
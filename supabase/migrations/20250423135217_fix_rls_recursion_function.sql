-- Function to check team membership securely (bypassing RLS for the check itself)
CREATE OR REPLACE FUNCTION public.is_user_in_team(user_uuid UUID, team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.team_members -- Use public schema explicitly
        WHERE team_id = team_uuid
        AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_user_in_team(UUID, UUID) TO authenticated;

-- Drop existing policy on posts
DROP POLICY IF EXISTS "Team members can view team content" ON public.posts;

-- Recreate policy using the helper function
CREATE POLICY "Team members can view team content"
    ON public.posts FOR SELECT
    USING (
        auth.uid() = user_id OR
        (team_id IS NOT NULL AND public.is_user_in_team(auth.uid(), posts.team_id)) -- Use the function
    );

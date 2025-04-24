-- Fix infinite recursion in team_members row-level security policy
-- The problem is in "Team members can view other team members" policy causing infinite recursion

-- 1. First drop the problematic policy
DROP POLICY IF EXISTS "Team members can view other team members" ON team_members;

-- 2. Create a security definer function to safely check team membership
-- Using SECURITY DEFINER means this function runs with the privileges of the creator
-- which bypasses row-level security and prevents the infinite recursion
CREATE OR REPLACE FUNCTION public.is_in_same_team(user_uuid UUID, team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.team_members
    WHERE user_id = user_uuid 
    AND team_id = team_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.is_in_same_team(UUID, UUID) TO authenticated;

-- 4. Create a new policy that uses the security definer function instead of direct query
CREATE POLICY "Team members can view other team members (fixed)"
ON team_members
FOR SELECT
USING (
  -- Using our helper function prevents the infinite recursion
  public.is_in_same_team(auth.uid(), team_id)
);

-- 5. Add a comment to explain the fix
COMMENT ON FUNCTION public.is_in_same_team(UUID, UUID) IS 
'Safely checks if a user is a member of a team without triggering RLS recursion.
Used by the team_members policies to prevent infinite recursion.';

-- 6. Also fix the "Team owners can manage team members" policy if needed
DROP POLICY IF EXISTS "Team owners can manage team members" ON team_members;

-- 7. Create a function to check if a user is a team owner
CREATE OR REPLACE FUNCTION public.is_team_owner(user_uuid UUID, team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.team_members
    WHERE user_id = user_uuid 
    AND team_id = team_uuid
    AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_team_owner(UUID, UUID) TO authenticated;

-- 9. Create a new policy for team owners
CREATE POLICY "Team owners can manage team members (fixed)"
ON team_members
FOR ALL
USING (
  public.is_team_owner(auth.uid(), team_id)
);

-- 10. Add comment
COMMENT ON FUNCTION public.is_team_owner(UUID, UUID) IS 
'Safely checks if a user is a team owner without triggering RLS recursion.
Used by the team_members policies to prevent infinite recursion.';

-- 11. Create a helper function to get all team IDs for a user
-- This is used in the posts.ts file to avoid RLS recursion when fetching team posts
CREATE OR REPLACE FUNCTION public.get_user_team_ids(user_uuid UUID)
RETURNS UUID[] AS $$
DECLARE
  team_ids UUID[];
BEGIN
  -- Direct query avoiding RLS
  SELECT ARRAY_AGG(team_id) INTO team_ids
  FROM public.team_members
  WHERE user_id = user_uuid;
  
  -- Handle case where user has no teams
  IF team_ids IS NULL THEN
    RETURN ARRAY[]::UUID[];
  END IF;
  
  RETURN team_ids;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_team_ids(UUID) TO authenticated;

-- 13. Add comment
COMMENT ON FUNCTION public.get_user_team_ids(UUID) IS 
'Returns an array of team IDs that a user belongs to without triggering RLS recursion.
Used by the posts service to efficiently fetch team posts.'; 
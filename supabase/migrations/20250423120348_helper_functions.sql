-- Create helper functions for team management and post access

-- Functions for team membership checks
CREATE OR REPLACE FUNCTION public.is_team_member(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = is_team_member.team_uuid
    AND team_members.user_id = is_team_member.user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is a team owner or admin
CREATE OR REPLACE FUNCTION public.is_team_admin(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = is_team_admin.team_uuid
    AND team_members.user_id = is_team_admin.user_uuid
    AND team_members.role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user can access a post
CREATE OR REPLACE FUNCTION public.can_access_post(post_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  post_owner_id UUID;
  post_team_id UUID;
BEGIN
  -- Get the post information
  SELECT posts.user_id, posts.team_id INTO post_owner_id, post_team_id
  FROM public.posts
  WHERE posts.id = can_access_post.post_uuid;

  -- Check if user is the owner
  IF post_owner_id = can_access_post.user_uuid THEN
    RETURN TRUE;
  END IF;

  -- Check if post belongs to a team and user is in that team
  IF post_team_id IS NOT NULL THEN
    RETURN public.is_team_member(post_team_id, can_access_post.user_uuid);
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

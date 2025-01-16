-- Insert admin user into auth.users
INSERT INTO auth.users (id, email, raw_user_meta_data, email_confirmed_at)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin@admin.com',
    '{"full_name": "Admin User"}'::jsonb,
    now()
) ON CONFLICT (id) DO NOTHING;

-- Set admin user password (requires auth.users SECURITY DEFINER function)
SELECT set_authenticated_context('00000000-0000-0000-0000-000000000000'::uuid);
CALL auth.set_password('00000000-0000-0000-0000-000000000000'::uuid, 'admin');
SELECT set_authenticated_context(NULL);

-- Insert admin profile
INSERT INTO profiles (id, email, full_name, bio)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin@admin.com',
    'Admin User',
    'System administrator'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo team
INSERT INTO teams (id, name, slug, description)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Demo Team', 'demo-team', 'A team collaborating on content creation');

-- Insert team members
INSERT INTO team_members (team_id, user_id, role)
VALUES 
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'owner');

-- Insert demo content
INSERT INTO posts (title, content, user_id, team_id, status)
VALUES 
  ('Getting Started with Mozzy', 'Welcome to Mozzy! This is your first post.', '00000000-0000-0000-0000-000000000000', NULL, 'published'),
  ('Team Collaboration Guide', 'Here are some best practices for team collaboration...', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'published');

INSERT INTO templates (title, content, user_id, team_id)
VALUES 
  ('Personal Blog Template', '# Title\n\n## Introduction\n\n## Main Points\n\n## Conclusion', '00000000-0000-0000-0000-000000000000', NULL),
  ('Team Blog Template', '# Team Post\n\n## Overview\n\n## Details\n\n## Summary', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222');

INSERT INTO podcasts (title, description, audio_url, user_id, team_id, status)
VALUES 
  ('Introduction to Content Creation', 'Learn the basics of content creation', 'https://example.com/audio1.mp3', '00000000-0000-0000-0000-000000000000', NULL, 'published'),
  ('Team Podcast Episode 1', 'Our first team podcast episode', 'https://example.com/team-audio1.mp3', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'published'); 
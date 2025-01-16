-- Create a test user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Test User"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
);

-- Insert test user profile
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    bio
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'test@example.com',
    'Test User',
    'A test user account'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo team
INSERT INTO teams (id, name, slug, description)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Demo Team', 'demo-team', 'A team collaborating on content creation');

-- Insert team members
INSERT INTO team_members (team_id, user_id, role)
VALUES 
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'owner');

-- Insert demo content
INSERT INTO posts (title, content, user_id, team_id, status)
VALUES 
  ('Getting Started with Mozzy', 'Welcome to Mozzy! This is your first post.', '11111111-1111-1111-1111-111111111111', NULL, 'published'),
  ('Team Collaboration Guide', 'Here are some best practices for team collaboration...', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'published');

INSERT INTO templates (title, content, user_id, team_id)
VALUES 
  ('Personal Blog Template', '# Title\n\n## Introduction\n\n## Main Points\n\n## Conclusion', '11111111-1111-1111-1111-111111111111', NULL),
  ('Team Blog Template', '# Team Post\n\n## Overview\n\n## Details\n\n## Summary', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');

INSERT INTO podcasts (title, description, audio_url, user_id, team_id, status)
VALUES 
  ('Introduction to Content Creation', 'Learn the basics of content creation', 'https://example.com/audio1.mp3', '11111111-1111-1111-1111-111111111111', NULL, 'published'),
  ('Team Podcast Episode 1', 'Our first team podcast episode', 'https://example.com/team-audio1.mp3', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'published'); 
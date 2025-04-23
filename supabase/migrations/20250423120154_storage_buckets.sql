-- Create storage buckets for posts (content) and avatars (user profile)

-- Create 'posts' bucket for content files
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true);

-- Create 'avatars' bucket for user profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create policy for public read access to 'posts'
CREATE POLICY "Posts bucket public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

-- Create policy for authenticated users to upload to 'posts'
CREATE POLICY "Authenticated users can upload to posts bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts' 
  AND auth.role() = 'authenticated'
);

-- Create separate policy for owner update access to 'posts'
CREATE POLICY "Owner can update posts objects"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'posts' 
  AND auth.uid() = owner
);

-- Create separate policy for owner delete access to 'posts'
CREATE POLICY "Owner can delete posts objects"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts' 
  AND auth.uid() = owner
);

-- Create policy for public read access to 'avatars'
CREATE POLICY "Avatars bucket public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Create policy for user uploading own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() = owner
);

-- Create separate policy for owner update access to avatars
CREATE POLICY "Owner can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid() = owner
);

-- Create separate policy for owner delete access to avatars
CREATE POLICY "Owner can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid() = owner
);

-- Create path structure for organized storage
-- Function to get the path for a user's content 
CREATE OR REPLACE FUNCTION storage.user_content_path(bucket text, user_id uuid, file_path text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN bucket || '/' || user_id::text || '/' || file_path;
END;
$$;

-- Function to get a user's avatar path
CREATE OR REPLACE FUNCTION storage.user_avatar_path(user_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'avatars/' || user_id::text || '/profile';
END;
$$;

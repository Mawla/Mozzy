-- Rename mergedcontents column to follow snake_case convention
ALTER TABLE posts RENAME COLUMN mergedcontents TO merged_contents;

-- Update the index to match the new column name
DROP INDEX IF EXISTS idx_posts_merged_contents;
CREATE INDEX IF NOT EXISTS idx_posts_merged_contents ON posts USING GIN (merged_contents);

-- Add missing/correct columns based on app/types/post.ts
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS template_ids uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS templates jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS transcript text DEFAULT '',
ADD COLUMN IF NOT EXISTS tweet_thread_content text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS refinement_instructions text DEFAULT '',
ADD COLUMN IF NOT EXISTS merge_instructions text DEFAULT ''; 
-- Add mergedContents column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS mergedContents JSONB DEFAULT '{}'::JSONB;

-- Add index for potentially searching/filtering by mergedContents
CREATE INDEX IF NOT EXISTS idx_posts_merged_contents ON posts USING GIN (mergedContents); 
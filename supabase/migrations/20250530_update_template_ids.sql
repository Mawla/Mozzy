-- Migration to update template_ids column from UUID array to TEXT array
-- This allows storing native template IDs from the template system

-- 1. First create a temporary column with the right type
ALTER TABLE posts 
ADD COLUMN template_ids_text text[] DEFAULT '{}';

-- 2. Copy data from old column to new column (when possible)
UPDATE posts 
SET template_ids_text = ARRAY(
  SELECT id::text 
  FROM unnest(template_ids) AS id
)
WHERE template_ids IS NOT NULL;

-- 3. Drop the old column
ALTER TABLE posts 
DROP COLUMN template_ids;

-- 4. Rename the new column to the original name
ALTER TABLE posts 
RENAME COLUMN template_ids_text TO template_ids;

-- 5. Add an index for the new column
CREATE INDEX IF NOT EXISTS idx_posts_template_ids ON posts USING GIN (template_ids);

-- Add comment to explain the column
COMMENT ON COLUMN posts.template_ids IS 'Array of template IDs in their native format (e.g., clj8niy1i0016xl149v7gxhb7)'; 
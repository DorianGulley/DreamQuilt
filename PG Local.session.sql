SELECT *
FROM contributions;
DROP TABLE contributions;
-- Create patches table
CREATE TABLE IF NOT EXISTS patches (
  id SERIAL PRIMARY KEY,
  quilt_id INTEGER REFERENCES quilts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE
  SET NULL,
    title VARCHAR(255) NOT NULL,
    content_html TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_published BOOLEAN DEFAULT TRUE
);
-- Create patch_images table
CREATE TABLE IF NOT EXISTS patch_images (
  id SERIAL PRIMARY KEY,
  patch_id INTEGER REFERENCES patches(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT
);
-- Create patch_links table
CREATE TABLE IF NOT EXISTS patch_links (
  id SERIAL PRIMARY KEY,
  from_patch_id INTEGER REFERENCES patches(id) ON DELETE CASCADE,
  to_patch_id INTEGER REFERENCES patches(id) ON DELETE CASCADE,
  relationship_type VARCHAR(100)
);
-- Create patch_tags table
CREATE TABLE IF NOT EXISTS patch_tags (
  id SERIAL PRIMARY KEY,
  patch_id INTEGER REFERENCES patches(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL
);
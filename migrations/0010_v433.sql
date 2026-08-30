-- Optional manual migration. Run only missing ALTER statements.
ALTER TABLE hero_slides ADD COLUMN image_position_x INTEGER NOT NULL DEFAULT 50;
ALTER TABLE hero_slides ADD COLUMN image_position_y INTEGER NOT NULL DEFAULT 50;
ALTER TABLE videos ADD COLUMN poster_key TEXT NOT NULL DEFAULT '';
ALTER TABLE videos ADD COLUMN mime_type TEXT NOT NULL DEFAULT '';
ALTER TABLE videos ADD COLUMN file_size INTEGER NOT NULL DEFAULT 0;
ALTER TABLE videos ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE videos ADD COLUMN created_at TEXT;
ALTER TABLE videos ADD COLUMN updated_at TEXT;
CREATE INDEX IF NOT EXISTS idx_videos_status_sort ON videos(status,sort_order,id);

CREATE TABLE IF NOT EXISTS media_assets(id INTEGER PRIMARY KEY AUTOINCREMENT,object_key TEXT NOT NULL UNIQUE,file_hash TEXT NOT NULL UNIQUE,file_name TEXT NOT NULL DEFAULT '',mime_type TEXT NOT NULL DEFAULT '',file_size INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS hero_slides(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL DEFAULT '',subtitle TEXT NOT NULL DEFAULT '',image_key TEXT NOT NULL DEFAULT '',button1_text TEXT NOT NULL DEFAULT 'Explore Products',button1_url TEXT NOT NULL DEFAULT '/products/',button2_text TEXT NOT NULL DEFAULT 'Request a Quote',button2_url TEXT NOT NULL DEFAULT '/feedback/',sort_order INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'published');
CREATE INDEX IF NOT EXISTS idx_media_hash ON media_assets(file_hash);
CREATE INDEX IF NOT EXISTS idx_hero_status_sort ON hero_slides(status,sort_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_status_date ON inquiries(status,created_at);
INSERT OR IGNORE INTO settings(key,value) VALUES('site_name','SMUSU'),('logo_key',''),('favicon_key',''),('hero_mode','slider'),('hero_interval','5');

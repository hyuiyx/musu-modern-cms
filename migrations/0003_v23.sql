CREATE INDEX IF NOT EXISTS idx_products_cat_status ON products(category_id,status);
CREATE INDEX IF NOT EXISTS idx_posts_type_status ON posts(type,status);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

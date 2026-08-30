# SMUSU CMS V4.0

Complete replacement release combining the fixes validated in production testing.

Key points:
- Category upload endpoint now always uploads/deduplicates then immediately updates `categories.image_key`.
- Product Families reads `categories.image_key`.
- Hero area is fully CMS-managed. One published Hero acts as a single image; two or more published Heroes rotate automatically.
- Hero title, subtitle, two CTA buttons, sort order, visibility and image are editable.
- News/Cases create/edit with cover upload and published detail routes.
- Products retain category, images, gallery, specifications and publishing.
- Media dedup uses SHA-256 + `media_assets`.
- Inquiry list is two-line preview + detail, paginated 20/page.

Run `migrations/0007_v40.sql` once in D1 Studio before opening the updated admin. Existing data is not deleted.

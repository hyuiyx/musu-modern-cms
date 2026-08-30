# SMUSU CMS V4.2

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

## V4.2
- Hero display reduced to 16:9, max-height 340px, object-fit cover.
- Hero uploads limited to 5 MB and image MIME types, with local preview and file-size feedback.
- Category upload continues to update categories.image_key directly, so each Product Families card must have its own category image.

## V4.2 classification image fix
Category information and optional category image are now sent in one multipart POST to `/api/admin/categories/:id/save`. The Worker deduplicates/uploads the file and writes `categories.image_key` inside the same request, then reads the row back and returns the saved image key. The admin displays the returned image key immediately so failure can no longer be hidden.

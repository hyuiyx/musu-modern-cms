# SMUSU CMS V3.2

Direct replacement upgrade for the existing `musu-modern-cms` Worker. Reuses current D1 `musu-db`, R2 `smusu-media`, `staging.ufya.tech`, and `admin.ufya.tech`.

## V3.0 additions
- Inquiry list: 2-line preview, detail modal, status filters, 20/page pagination.
- News/Cases: cover image upload.
- Global media library.
- SHA-256 media deduplication: identical uploads reuse the same R2 object.
- Product images use the same dedup layer and do not duplicate identical object content.
- Category management: rename, slug, description, image key, order, publish/hide.
- Website settings: site/brand name, company name, phone, WhatsApp, email, address, logo, favicon.
- Dynamic front-end logo/brand and product dropdown categories.

## Important first upgrade step
Run `migrations/0004_v30.sql` once in D1 Studio before opening the V3 admin. This only adds `media_assets`, indexes, and missing settings keys. It does not delete existing data.

## Production hardening
Protect `admin.ufya.tech` with Cloudflare Access. Add Turnstile server-side validation to public feedback before switching the production domain.

## V3.1 fixes
- News/Cases edit button and published page button.
- Upload progress bars for product/category/news/video/media uploads.
- Category image upload directly from category editor; homepage Product Families reads category.image_key.
- News/Case detail pages.

## V3.2 UI repair
- Category image: visible select-file input, upload/change button, preview, progress, remove button.
- Product Families reads category image_key; upload through Category Management.
- News/Case: visible cover preview, cancel-selected-file, remove-current-cover, edit button, save progress, post-save published-page button.
- News/Case list shows View for published records.

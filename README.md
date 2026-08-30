# SMUSU CMS V2.2A

Minimal product-management upgrade. Reuses existing Cloudflare Worker, `musu-db` D1 database and `smusu-media` R2 bucket.

Features:
- product category selection
- create/update products
- product image upload directly to R2 with automatic `product_images` association
- gallery preview, set primary image, delete image from R2 + D1
- product specification add/delete
- public product list/details render images/specifications automatically

Upload these files over the existing GitHub repository and commit to `main`. Do not recreate D1 or R2.

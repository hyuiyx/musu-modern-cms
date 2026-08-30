# SMUSU Modern CMS Template

Modernized Cloudflare Worker + D1 + R2 company/product-site starter based on SMUSU's current information architecture: Home, About, Product, News, Cases, Video and Contact, with six core product families.

## Deploy to Cloudflare

1. Upload this folder to a **public GitHub repository**.
2. Replace `YOUR_GITHUB_REPO_URL` in this README.
3. Click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=YOUR_GITHUB_REPO_URL)

The deploy script runs D1 migrations first, then deploys the Worker.

## After deployment

- Worker > Settings > Domains & Routes: add `smusu.com`, `www.smusu.com`, `admin.smusu.com`.
- Cloudflare Zero Trust > Access: protect **admin.smusu.com** before using it.
- Open `https://admin.smusu.com` to create/edit products and upload media.
- Add product images/specifications and News/Cases during migration. The schema is ready for them.
- Add legacy URLs to the `redirects` table so existing SMUSU paths permanently redirect to new URLs.

## Important

This is a full deployable architecture/template, not a byte-for-byte copy of the current site's copyrighted design/assets. It uses an original, modern industrial visual system while preserving the present business information architecture.

For production: keep Cloudflare Access enabled for admin, add Turnstile to public inquiry submission, use presigned/multipart R2 upload for large video, validate media sizes, keep D1 backups, and add content-editor screens for News/Cases/Pages as the next CMS iteration.

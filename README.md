# SMUSU Modern CMS V2.1

This V2 replaces the original Worker routing code while reusing the existing Cloudflare resources.

## Existing bindings
- D1: `musu-db`
- R2: `smusu-media`
- Test site: `https://staging.ufya.tech`
- Test admin: `https://admin.ufya.tech`

## Upgrade from V1
1. Keep your existing D1 and R2. Do not delete them.
2. Upload/overwrite these V2 files in the existing GitHub repository.
3. Commit to `main`; Cloudflare Workers Builds will deploy automatically.
4. Test the workers.dev URL first.
5. Add Custom Domains only after workers.dev works.
6. Protect `admin.ufya.tech` with Cloudflare Access before using the admin UI.

## Notes
The CMS V2 includes Products and R2 media upload UI. The database schema already supports categories, specifications, news, cases, videos, pages, redirects and inquiries; additional admin editors can be layered on without changing the public routing architecture.

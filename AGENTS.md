# Project rules

- Keep all service requests in `src/lib/api.ts`; pages consume exported functions so the data layer remains auditable.
- Reuse the generated brand icon for default website branding and derive public favicons from that same asset so browser and site identity stay consistent.
- Keep property search in the listings URL search parameter so header submissions and listing searches share the same state.
- Centralize pathname navigation effects and route metadata in PageNavigation; query-only filter changes must not reset scroll or create analytics page views.
- Keep browser Analytics service loading and event calls in src/lib/api.ts; load only with optional analytics consent and exclude admin pages and query strings.
- Use Helmet for route metadata and index.html for static crawler fallbacks; generate sitemap URLs only after a real public origin exists.
- Keep the public sitemap limited to existing public pages and listing IDs; refresh listing entries when inventory changes, and omit lastmod unless authoritative significant page-change timestamps are available.
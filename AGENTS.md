# Project rules

- Keep all service requests in `src/lib/api.ts`; pages consume exported functions so the data layer remains auditable.
- Reuse the generated brand icon for default website branding and derive public favicons from that same asset so browser and site identity stay consistent.
- Keep property search in the listings URL search parameter so header submissions and listing searches share the same state.
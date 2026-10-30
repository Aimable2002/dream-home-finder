# Roadmap

- [x] Add property-card WhatsApp contact with listing details, cover photo link and public details link — checked two real listings, contact destination, detail page and phone layout; 11 related tests passed
- [x] Strengthen branded Google search presentation — added WebSite identity, public-page breadcrumbs and descriptive links to Properties, Best Deals, About and Contact; Google controls sitelinks; changes reach production through existing Git-to-Netlify deployment

- [x] Verify scrolling to the top on page navigation and first load
- [x] Verify consent-based Google Analytics using the linked measurement ID — live Netlify banner and script checked; Google collection returned HTTP 204 after acceptance
- [x] Complete metadata, verification and sitemap setup for https://imenahomes.site/ and check Google indexing status — Google verified ownership, downloaded 8 URLs without errors, and reports homepage indexed
- [x] Follow the existing Git-to-Netlify deployment workflow; check the live verification tag and sitemap after Netlify updates

- [x] Add header property search and listing location filter
- [x] Show two property cards per row on phones; search checked live and populated location/card flow checked with fixtures

- [x] Write Supabase migration files (tables, RLS, storage buckets, seed) for new project seilaswjzerlycvqrwxz
- [x] Point the app at the new Supabase project keys (.env + client fallback)
- [x] Generate IHomes favicon and replace current favicon.ico
- [x] Rename CKIM -> ImenaHomes everywhere
- [x] Mobile-first responsive pass: adjusted public and admin layouts; public pages and populated card/gallery fixtures checked at phone and desktop widths
- [ ] Verify signed-in admin pages with real listings — blocked by unavailable external-project sign-in session

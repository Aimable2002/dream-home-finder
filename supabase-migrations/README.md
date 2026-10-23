# ImenaHomes — Supabase migration files

These SQL files set up the database for the ImenaHomes real estate platform
on your own Supabase project (seilaswjzerlycvqrwxz).

## How to apply

Run them in order in your Supabase dashboard: **SQL Editor → New query**,
paste each file's contents, and click **Run**.

1. `20261023000001_create_tables.sql` — tables, triggers, view-counter function
2. `20261023000002_rls_policies.sql` — row level security policies
3. `20261023000003_storage_buckets.sql` — image storage buckets + policies
4. `20261023000004_seed_site_settings.sql` — initial company settings row

## After applying

1. **Create your admin account:** Supabase dashboard → Authentication → Users
   → Add user (email + password). That account signs in at `/admin/login`.
2. Optional: if you want to lock admin actions to specific accounts, follow
   the "OPTIONAL HARDENING" block at the bottom of
   `20261023000002_rls_policies.sql` after adding a row to `user_roles`.

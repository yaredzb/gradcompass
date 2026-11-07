# Supabase SQL Editor tabs

Create six saved queries in the Supabase SQL Editor using the names below. Copy the entire matching file into each query, including `BEGIN` and `COMMIT`.

Run the queries **one at a time, in this order**, using the database owner (`postgres`). Wait for each query to succeed before running the next.

| Order / saved query name | Contents |
| --- | --- |
| [01_tables.sql](sql-editor/01_tables.sql) | Program and funding tables, private initialization history, and immediate row-level security |
| [02_validation.sql](sql-editor/02_validation.sql) | Defaults, legacy JSON upgrades, and validation constraints |
| [03_team_access.sql](sql-editor/03_team_access.sql) | Approved team membership, API permissions, and access policies |
| [04_indexes_and_triggers.sql](sql-editor/04_indexes_and_triggers.sql) | Search indexes and automatic update timestamps |
| [05_realtime.sql](sql-editor/05_realtime.sql) | Realtime publication registration |
| [06_demo_records.sql](sql-editor/06_demo_records.sql) | One-time insertion of the two demo programs and their awards |

Each file commits independently; the six tabs are not a single transaction. If a query fails, fix the error and rerun that query before continuing. Complete all six before using the app.

## Team accounts

Create your initial account(s) in **Authentication → Users before running query 03**. That query approves existing accounts once. Disable public sign-ups for this private team app.

If you create an account after query 03 has already run, approve it explicitly with the following SQL, replacing the email:

```sql
INSERT INTO public.team_members (user_id)
SELECT id FROM auth.users WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO NOTHING;
```

Rerunning query 03 will not reapprove removed members or automatically approve new accounts.

## Demo records and reruns

- The first successful run of query 06 inserts the examples without overwriting existing records.
- Redeployments and subsequent query runs preserve your edits.
- Deleted demos stay deleted, including when you rerun query 06 or all six queries.
- Keep `gradsearch_private.initializations`; it records that demo setup has already happened.
- Use the app's **Restore Demo Records** action only when you explicitly want missing examples restored.

## Deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the deployment build environment, then build/deploy the app. Use the public anon/publishable key, never the service-role key. Production requires Supabase; browser-only storage is available for local development.

The SQL files are saved locally in this repository. They have not been run against your hosted database or saved into your Supabase Dashboard automatically.

## Combined alternative and maintenance

For scheduled exports, see [Daily encrypted database backups](BACKUPS.md). The GitHub workflow can run daily or manually and retains encrypted backups for 30 days.

[schema.sql](schema.sql) remains an equivalent, single-transaction alternative. Choose the six tabs or the combined file; you do not need to run both.

The numbered files are the source of truth. After editing them, regenerate the combined file from the project root:

```sh
node supabase/assemble-schema.mjs
```

`supabase/schema.test.ts` executes both setup methods in embedded PostgreSQL and checks that the combined file stays synchronized.

# Daily encrypted database backups

The [Supabase database backup workflow](../.github/workflows/supabase-backup.yml) runs daily at **03:17 UTC / 07:17 Dubai time** and can also be started manually. Encrypted backups are stored as GitHub Actions artifacts for **30 days**, subject to the repository's retention limits. No backup data is committed to Git.

## One-time setup

1. Finish the [database setup](README.md), including all six SQL scripts.
2. In Supabase, open **Connect** and copy the PostgreSQL **Session pooler** URI on port **5432**. Replace its password placeholder with your database password. Percent-encode special characters in that password, such as `@`, `:`, `/`, `#`, `%`, and `$`. Use the database password, not the public API key or your app login password. Session pooling provides an IPv4 connection suitable for GitHub-hosted runners. [Connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres)
3. In your GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret** and add:

   | Secret name | Value |
   | --- | --- |
   | `SUPABASE_DB_URL` | The full session-pooler PostgreSQL URI, including its password; use `sslmode=require` or stronger |
   | `BACKUP_ENCRYPTION_PASSWORD` | A separate, random password of at least 32 characters, on one line |

   Example URI structure (replace all placeholders):

   ```text
   postgresql://postgres.PROJECT_REF:ENCODED_DATABASE_PASSWORD@SESSION_POOLER_HOST:5432/postgres?sslmode=require
   ```

   These are backend workflow secrets. Do not put them in `VITE_` variables, `.env.example`, or source code. Keep a recoverable copy of the encryption password in your password manager; GitHub does not let you read a secret back. Older backups need the password used when they were created.

4. Push the workflow and scripts to the repository's **default branch** and enable GitHub Actions if required. This local change has not been pushed or configured in GitHub automatically.
5. Open **Actions → Supabase database backup → Run workflow**. Confirm the first run succeeds and that its encrypted artifact can be downloaded and decrypted.

No Supabase access token or service-role API key is required. The workflow connects using the database credentials in `SUPABASE_DB_URL`.

## What is backed up

Each archive contains:

- `roles.sql`: custom database role definitions exported by the Supabase CLI.
- `schema.sql`: application schema definitions, including `public` and `gradsearch_private`.
- `data.sql`: database row data, including programs, funding, team memberships, Auth records, and the demo initialization history. Supabase-managed migration/internal tables and vector-storage metadata are excluded by the CLI/backup filters.
- `metadata.txt`: backup time, source commit, workflow run, and CLI version.
- `SHA256SUMS`: integrity checksums for those files.

The private initialization history is included so schema reruns after restoration can preserve intentionally deleted demos. An empty table is backed up as empty; the workflow never restores or seeds demo data.

This is a logical database backup using [Supabase's export approach](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore). It does not copy Storage file contents, Edge Function code, project settings, or a project's encryption root key. Follow Supabase's restore guide for any project-level prerequisites. The exports use separate database snapshots; avoid schema migrations while a backup runs.

## Download and check a backup

Open a successful workflow run, scroll to **Artifacts**, and download `supabase-backup-...`. Extract GitHub's artifact ZIP. It contains an encrypted `.tar.gz.gpg` file and its `.sha256` checksum.

Using GnuPG and standard Linux/macOS tools (or Git Bash on Windows):

```sh
# Substitute the actual downloaded filenames. GPG prompts for your backup password.
sha256sum -c gradquest-TIMESTAMP-RUN-ATTEMPT.tar.gz.gpg.sha256
gpg --output backup.tar.gz --decrypt gradquest-TIMESTAMP-RUN-ATTEMPT.tar.gz.gpg
mkdir restore-check
tar -xzf backup.tar.gz -C restore-check
cd restore-check
sha256sum -c SHA256SUMS
```

Restore first into a separate test/replacement project using [Supabase's restore instructions](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore#restore-backup-using-cli). The downloaded `schema.sql`/`data.sql` are backup exports; they are different from this repository's installation/seed scripts. Complete the restore before rerunning installation scripts, so the saved initialization markers are present. The workflow never automatically overwrites your live database.

## Schedule and retention

To switch to a weekly Sunday backup at the same time, change the cron to:

```yaml
- cron: '17 3 * * 0'
```

Change `retention-days` in the workflow if needed. Download and store backups elsewhere for longer retention. GitHub-hosted runner minutes and artifact storage count toward your account's quotas.

Scheduled runs can be delayed, and GitHub disables schedules in public repositories after 60 days without repository activity. Monitor successful runs rather than assuming the schedule always executes. [GitHub scheduling documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)

Backups generate database activity, which may help avoid inactivity pausing, but they do not guarantee uptime on Supabase's Free plan. [Supabase pausing rules](https://supabase.com/docs/guides/platform/free-project-pausing)

## Implementation and local checks

Official actions and the CLI are pinned. The script uses Supabase CLI 3.0.0's platform-aware dump templates with an official PostgreSQL 18 client. Credentials are parsed into a temporary private env file, not evaluated as shell code. The PostgreSQL client enforces TLS and a read-only session. Dumps are encrypted with AES-256, checked by decrypting and comparing them, and plaintext/credential files are removed before the job ends. Only encrypted files and ciphertext checksums are uploaded.

Run the isolated checks with Bash, Python 3, and GnuPG installed:

```sh
python .github/scripts/test_backup.py
```

These tests use a fake exporter/container and real encryption. They do not connect to your Supabase project; the first manual GitHub run is the live connection/export check. If a future PostgreSQL server major version exceeds the client version, update `postgres:18` in the backup script and retest.

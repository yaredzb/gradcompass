#!/usr/bin/env bash
set -euo pipefail
umask 077

fail() { printf '%s\n' "$1" >&2; exit 1; }

[[ -n "${SUPABASE_DB_URL:-}" ]] || fail 'Missing GitHub Actions secret: SUPABASE_DB_URL.'
[[ -n "${BACKUP_ENCRYPTION_PASSWORD:-}" ]] || fail 'Missing GitHub Actions secret: BACKUP_ENCRYPTION_PASSWORD.'
[[ ${#BACKUP_ENCRYPTION_PASSWORD} -ge 32 ]] || fail 'Use a backup encryption password of at least 32 characters.'
[[ "$BACKUP_ENCRYPTION_PASSWORD" != *$'\n'* && "$BACKUP_ENCRYPTION_PASSWORD" != *$'\r'* ]] || fail 'The encryption password must be a single line.'
case "$SUPABASE_DB_URL" in
  postgres://*|postgresql://*) ;;
  *) fail 'SUPABASE_DB_URL must be a PostgreSQL connection URI, not the project API URL.' ;;
esac
[[ "$SUPABASE_DB_URL" != *$'\n'* && "$SUPABASE_DB_URL" != *$'\r'* ]] || fail 'The database URL must be a single line.'

for tool in supabase docker gpg tar sha256sum cmp grep sed; do
  command -v "$tool" >/dev/null || fail "Required tool is unavailable: $tool."
done
python_bin="${BACKUP_PYTHON:-python3}"
command -v "$python_bin" >/dev/null || fail 'Python 3 is required for secure connection parsing.'

# Require encrypted database transport, including for session-pooler URLs.
database_url="$SUPABASE_DB_URL"
if [[ "$database_url" != *sslmode=* ]]; then
  if [[ "$database_url" == *\?* ]]; then
    database_url+='&sslmode=require'
  else
    database_url+='?sslmode=require'
  fi
elif [[ ! "$database_url" =~ [\?\&]sslmode=(require|verify-ca|verify-full)($|\&) ]]; then
  fail 'The database URL must use sslmode=require, verify-ca, or verify-full.'
fi

temp_root="${RUNNER_TEMP:-${TMPDIR:-/tmp}}"
output_dir="${BACKUP_OUTPUT_DIR:-$temp_root/supabase-backups}"
work_dir="$(mktemp -d "$temp_root/gradquest-backup.XXXXXX")"
cleanup() {
  # Remove only files produced in this invocation's unique temporary directory.
  rm -f -- "$work_dir/roles.sql" "$work_dir/schema.sql" "$work_dir/data.sql" \
    "$work_dir/metadata.txt" "$work_dir/SHA256SUMS" \
    "$work_dir/backup.tar.gz" "$work_dir/verified.tar.gz" \
    "$work_dir/connection.env" "$work_dir/dump-template.sh" "$work_dir/dump-client.sh"
  rmdir -- "$work_dir"
}
trap cleanup EXIT

# Parse credentials into a private Docker env file; never evaluate them as shell
# code or pass the password on a command line. TLS is enforced by libpq itself.
export SUPABASE_BACKUP_CONNECTION="$database_url"
"$python_bin" - "$work_dir/connection.env" <<'PY'
import os
import sys
from urllib.parse import parse_qs, unquote, urlsplit

url = urlsplit(os.environ['SUPABASE_BACKUP_CONNECTION'])
mode = parse_qs(url.query).get('sslmode', ['require'])[0]
if mode not in ('require', 'verify-ca', 'verify-full'):
    raise SystemExit('The PostgreSQL client requires TLS.')
if not url.hostname or not url.username or not url.password:
    raise SystemExit('The database connection URI must include its host, user, and password.')
values = {
    'PGHOST': url.hostname,
    'PGPORT': str(url.port or 5432),
    'PGUSER': unquote(url.username),
    'PGPASSWORD': unquote(url.password),
    'PGDATABASE': unquote(url.path.removeprefix('/')) or 'postgres',
    'PGSSLMODE': mode,
    'PGCONNECT_TIMEOUT': '30',
    'PGOPTIONS': '-c default_transaction_read_only=on -c statement_timeout=600000',
}
if any(any(char in value for char in '\r\n\0') for value in values.values()):
    raise SystemExit('Connection values cannot contain line breaks or null bytes.')
with open(sys.argv[1], 'x', encoding='utf8', newline='\n') as output:
    for key, value in values.items():
        output.write(key + '=' + value + '\n')
PY
unset SUPABASE_BACKUP_CONNECTION

# Supabase supplies the platform-aware pg_dump filters. Generate them with a
# dummy URL, strip its connection exports, and run against the real connection
# through an official PostgreSQL client container with PGSSLMODE=require (or
# the stronger mode selected in the URL). Source data is read-only throughout.
dump_database() {
  local output_file="$1"
  shift
  supabase db dump --remote='postgresql://postgres:placeholder@127.0.0.1:5432/postgres' \
    --dry-run "$@" > "$work_dir/dump-template.sh"
  grep -q '^#!/usr/bin/env bash' "$work_dir/dump-template.sh" || fail 'Unexpected Supabase dump template.'
  sed '/^export PG[A-Z_]*=/d' "$work_dir/dump-template.sh" > "$work_dir/dump-client.sh"
  docker run --rm --interactive --env-file "$work_dir/connection.env" \
    postgres:18 bash -euo pipefail -s < "$work_dir/dump-client.sh" > "$output_file"
}
dump_database "$work_dir/roles.sql" --role-only
dump_database "$work_dir/schema.sql"
dump_database "$work_dir/data.sql" --data-only --use-copy \
  --exclude 'storage.buckets_vectors,storage.vector_indexes'

for file in roles.sql schema.sql data.sql; do
  [[ -s "$work_dir/$file" ]] || fail "Database export is missing or empty: $file."
done

# Fail rather than publishing an incomplete export. Empty tables still produce
# COPY statements. The initialization table preserves deliberately deleted demos.
for table in public.programs public.funding_opportunities public.team_members \
  gradsearch_private.initializations auth.users; do
  schema_name="${table%%.*}"
  table_name="${table#*.}"
  grep -Eq "^COPY \"?$schema_name\"?\.\"?$table_name\"?[[:space:]]" "$work_dir/data.sql" \
    || fail "Expected table is missing from the export: $table. Run database setup before backing up."
done

{
  printf 'created_at_utc=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf 'source_commit=%s\n' "${GITHUB_SHA:-local}"
  printf 'workflow_run=%s\n' "${GITHUB_RUN_ID:-manual}"
  printf 'supabase_cli_version=%s\n' "$(supabase --version)"
} > "$work_dir/metadata.txt"
(cd "$work_dir" && sha256sum roles.sql schema.sql data.sql metadata.txt > SHA256SUMS)
tar -czf "$work_dir/backup.tar.gz" -C "$work_dir" roles.sql schema.sql data.sql metadata.txt SHA256SUMS

mkdir -p -- "$output_dir"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_name="gradquest-$stamp-${GITHUB_RUN_ID:-manual}-${GITHUB_RUN_ATTEMPT:-1}.tar.gz.gpg"
encrypted_file="$output_dir/$backup_name"

# Pass the encryption password over stdin, not as a command-line argument.
printf '%s' "$BACKUP_ENCRYPTION_PASSWORD" | gpg --batch --yes --quiet \
  --pinentry-mode loopback --passphrase-fd 0 --no-symkey-cache \
  --symmetric --cipher-algo AES256 --compress-algo none \
  --output "$encrypted_file" "$work_dir/backup.tar.gz"

# Verify that this password decrypts the archive before publishing it.
printf '%s' "$BACKUP_ENCRYPTION_PASSWORD" | gpg --batch --yes --quiet \
  --pinentry-mode loopback --passphrase-fd 0 --no-symkey-cache \
  --decrypt --output "$work_dir/verified.tar.gz" "$encrypted_file"
cmp -s "$work_dir/backup.tar.gz" "$work_dir/verified.tar.gz" || fail 'Backup encryption verification failed.'
(cd "$output_dir" && sha256sum "$backup_name" > "$backup_name.sha256")
printf 'Database backup exported, encrypted, and verified.\n'

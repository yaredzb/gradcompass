"""Run with python .github/scripts/test_backup.py; uses no database or network.

The exporter/container are mocked. GPG, archive creation, checksums, credential
parsing, TLS validation, failure handling, and cleanup are exercised for real.
"""
import hashlib
import io
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]


def posix(path):
    text = str(path).replace('\\', '/')
    return '/' + text[0].lower() + text[2:] if os.name == 'nt' and text[1:2] == ':' else text


class BackupTests(unittest.TestCase):
    def setUp(self):
        git_bash = Path(os.environ.get('ProgramFiles', 'C:/Program Files')) / 'Git/bin/bash.exe'
        self.bash = str(git_bash) if os.name == 'nt' and git_bash.exists() else shutil.which('bash')
        if not self.bash:
            self.skipTest('Bash is required')
        self.temp = tempfile.TemporaryDirectory(prefix='gradquest-backup-test-')
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name)
        binary_dir = self.directory / 'bin'
        binary_dir.mkdir()
        home = self.directory / 'gnupg'
        home.mkdir(mode=0o700)
        scripts = {
            'supabase': '''#!/usr/bin/env bash
set -euo pipefail
if [[ "$1" == '--version' ]]; then echo '3.0.0'; exit 0; fi
printf '#!/usr/bin/env bash\\nexport PGHOST="placeholder"\\npg_dump '
printf '%q ' "$@"
printf '\\n'
''',
            'docker': '''#!/usr/bin/env bash
set -euo pipefail
[[ "${FAKE_DUMP_FAIL:-}" != 1 ]] || exit 9
connection=''
while (($#)); do
  if [[ "$1" == '--env-file' ]]; then connection="$2"; shift 2; else shift; fi
done
grep -q '^PGSSLMODE=require$' "$connection"
grep -q '^PGOPTIONS=-c default_transaction_read_only=on' "$connection"
printf 'TLS enforced\\n' >> "$TEST_LOG"
script="$(cat)"
if grep -q '^export PG' <<< "$script"; then exit 8; fi
if [[ "$script" == *--data-only* ]]; then
  for table in '"public"."programs"' '"public"."funding_opportunities"' '"public"."team_members"' '"auth"."users"'; do
    printf 'COPY %s (id) FROM stdin;\\n\\\\.\\n' "$table"
  done
  if [[ "${FAKE_MISSING_HISTORY:-}" != 1 ]]; then
    printf 'COPY "gradsearch_private"."initializations" (name) FROM stdin;\\ninitial-demo-v1\\n\\\\.\\n'
  fi
else
  printf '%s\\n' '-- fake SQL export'
fi
''',
        }
        for name, source in scripts.items():
            path = binary_dir / name
            path.write_text(source, encoding='utf8', newline='\n')
            path.chmod(0o700)
        self.env = {
            **os.environ,
            'TEST_BIN': posix(binary_dir),
            'TEST_LOG': posix(self.directory / 'calls.log'),
            'BACKUP_SCRIPT': posix(ROOT / '.github/scripts/backup-supabase.sh'),
            'BACKUP_PYTHON': posix(sys.executable),
            'RUNNER_TEMP': posix(self.directory),
            'BACKUP_OUTPUT_DIR': posix(self.directory / 'output'),
            'GNUPGHOME': posix(home),
            'SUPABASE_DB_URL': 'postgresql://postgres:fake-password@localhost:5432/postgres',
            'BACKUP_ENCRYPTION_PASSWORD': 'test-only-password-with-at-least-32-characters',
            'GITHUB_RUN_ID': '12345',
            'GITHUB_RUN_ATTEMPT': '1',
        }
        self.addCleanup(lambda: self.shell('gpgconf --kill gpg-agent'))

    def shell(self, command):
        return subprocess.run([self.bash, '-c', 'export PATH="$TEST_BIN:/usr/bin:/bin"; ' + command], env=self.env, capture_output=True, timeout=45)

    def run_backup(self):
        return self.shell('exec bash "$BACKUP_SCRIPT"')

    def assert_clean(self):
        self.assertEqual(list(self.directory.glob('gradquest-backup.*')), [])
        self.assertEqual(list(self.directory.rglob('*.sql')), [])
        self.assertEqual(list(self.directory.rglob('connection.env')), [])

    def test_backup_roundtrip_checksums_tls_and_seed_history(self):
        result = self.run_backup()
        self.assertEqual(result.returncode, 0, result.stderr.decode())
        output = self.directory / 'output'
        self.assertEqual(len(list(output.iterdir())), 2)
        encrypted = next(output.glob('*.tar.gz.gpg'))
        digest = encrypted.with_name(encrypted.name + '.sha256').read_text().split()[0]
        self.assertEqual(hashlib.sha256(encrypted.read_bytes()).hexdigest(), digest)
        self.env['TEST_ARCHIVE'] = posix(encrypted)
        decrypted = self.shell('printf "%s" "$BACKUP_ENCRYPTION_PASSWORD" | gpg --batch --quiet --pinentry-mode loopback --passphrase-fd 0 --no-symkey-cache --decrypt "$TEST_ARCHIVE"')
        self.assertEqual(decrypted.returncode, 0, decrypted.stderr.decode())
        with tarfile.open(fileobj=io.BytesIO(decrypted.stdout), mode='r:gz') as archive:
            self.assertEqual(set(archive.getnames()), {'roles.sql', 'schema.sql', 'data.sql', 'metadata.txt', 'SHA256SUMS'})
            self.assertIn(b'initial-demo-v1', archive.extractfile('data.sql').read())
            for line in archive.extractfile('SHA256SUMS').read().decode().splitlines():
                checksum, name = line.split(maxsplit=1)
                name = name.removeprefix('*')  # GNU checksum binary-mode marker on Windows.
                self.assertEqual(hashlib.sha256(archive.extractfile(name).read()).hexdigest(), checksum)
        self.assertEqual((self.directory / 'calls.log').read_text().splitlines(), ['TLS enforced'] * 3)
        self.assertNotIn(self.env['SUPABASE_DB_URL'].encode(), result.stdout + result.stderr)
        self.assertNotIn(self.env['BACKUP_ENCRYPTION_PASSWORD'].encode(), result.stdout + result.stderr)
        self.assert_clean()

    def test_failed_export_is_not_published(self):
        self.env['FAKE_DUMP_FAIL'] = '1'
        self.assertNotEqual(self.run_backup().returncode, 0)
        self.assertFalse((self.directory / 'output').exists())
        self.assert_clean()

    def test_missing_initialization_history_rejects_incomplete_export(self):
        self.env['FAKE_MISSING_HISTORY'] = '1'
        result = self.run_backup()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'initializations', result.stderr)
        self.assertFalse((self.directory / 'output').exists())
        self.assert_clean()

    def test_missing_connection_secret_fails_clearly(self):
        self.env.pop('SUPABASE_DB_URL')
        result = self.run_backup()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'Missing GitHub Actions secret: SUPABASE_DB_URL', result.stderr)

    def test_weak_password_and_insecure_transport_are_rejected(self):
        self.env['BACKUP_ENCRYPTION_PASSWORD'] = 'short'
        self.assertNotEqual(self.run_backup().returncode, 0)
        self.env['BACKUP_ENCRYPTION_PASSWORD'] = 'test-only-password-with-at-least-32-characters'
        self.env['SUPABASE_DB_URL'] += '?sslmode=disable'
        result = self.run_backup()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b'must use sslmode=require', result.stderr)


if __name__ == '__main__':
    unittest.main(verbosity=2)

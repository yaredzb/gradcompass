import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const sqlFiles = [
  '01_tables.sql',
  '02_validation.sql',
  '03_team_access.sql',
  '04_indexes_and_triggers.sql',
  '05_realtime.sql',
  '06_demo_records.sql',
];

export function readEditorScripts() {
  return sqlFiles.map(name => readFileSync(new URL('./sql-editor/' + name, import.meta.url), 'utf8'));
}

export function assembleSchema() {
  const bodies = readEditorScripts().map((script, index) => {
    const body = script.match(/BEGIN;\s*SELECT pg_advisory_xact_lock\(728419036\);\s*([\s\S]*?)\s*COMMIT;\s*$/)?.[1];
    if (!body) throw new Error('Missing transaction wrapper in ' + sqlFiles[index]);
    return '-- Source: sql-editor/' + sqlFiles[index] + '\n' + body;
  });
  return '-- GradQuest: complete database setup (alternative to the six SQL Editor tabs).\n'
    + '-- Generated from sql-editor/*.sql by: node supabase/assemble-schema.mjs\n'
    + '-- Edit the numbered files, then regenerate this combined version.\n\n'
    + 'BEGIN;\nSELECT pg_advisory_xact_lock(728419036);\n\n'
    + bodies.join('\n\n') + '\n\nCOMMIT;\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('./schema.sql', import.meta.url), assembleSchema());
}

// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { assembleSchema, readEditorScripts } from './assemble-schema.mjs';

const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
const owner = '00000000-0000-4000-8000-000000000001';
const outsider = '00000000-0000-4000-8000-000000000002';

it('keeps the combined schema synchronized with the SQL Editor scripts', () => {
  expect(schema).toBe(assembleSchema());
});

describe.each(['combined', 'separate SQL Editor tabs'])('Supabase schema and durable demo lifecycle: %s', mode => {
  let db: PGlite;
  const applySchema = async () => {
    for (const sql of mode === 'combined' ? [schema] : readEditorScripts()) await db.exec(sql);
  };
  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    // Minimal Supabase Auth environment; all application SQL runs unchanged.
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id UUID PRIMARY KEY, email TEXT);
      CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE sql STABLE AS $$
        SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;
      GRANT USAGE ON SCHEMA auth TO authenticated;
      INSERT INTO auth.users VALUES ('${owner}', 'owner@example.test');
    `);
    await applySchema();
    await db.exec(`INSERT INTO auth.users VALUES ('${outsider}', 'outsider@example.test')`);
  }, 30000);

  afterAll(async () => { await db?.close(); });

  it('installs both demo programs and awards and bootstraps existing accounts', async () => {
    expect((await db.query('SELECT id FROM public.programs')).rows).toHaveLength(2);
    expect((await db.query('SELECT id FROM public.funding_opportunities')).rows).toHaveLength(2);
    expect((await db.query('SELECT user_id FROM public.team_members')).rows).toEqual([{ user_id: owner }]);
  });

  it('grants approved accounts CRUD access but denies outsiders and anonymous users', async () => {
    await db.exec(`SET ROLE authenticated; SET request.jwt.claim.sub = '${owner}';`);
    try {
      expect((await db.query('SELECT id FROM public.programs')).rows).toHaveLength(2);
      await db.exec("INSERT INTO public.programs (id,official_name,university) VALUES ('test-access','Test','Test')");
      await db.exec("UPDATE public.programs SET university='Edited' WHERE id='test-access'");
      await db.exec("DELETE FROM public.programs WHERE id='test-access'");
      await db.exec(`SET request.jwt.claim.sub = '${outsider}'`);
      expect((await db.query('SELECT id FROM public.programs')).rows).toHaveLength(0);
      expect((await db.query('SELECT id FROM public.funding_opportunities')).rows).toHaveLength(0);
      expect((await db.query("DELETE FROM public.programs WHERE id='demo-program-1' RETURNING id")).rows).toHaveLength(0);
      await expect(db.exec("INSERT INTO public.programs (official_name,university) VALUES ('Denied','Denied')")).rejects.toThrow(/row-level security/i);
      await expect(db.exec(`INSERT INTO public.team_members (user_id) VALUES ('${outsider}')`)).rejects.toThrow(/permission denied/i);
      await db.exec('RESET ROLE; SET ROLE anon');
      await expect(db.query('SELECT * FROM public.programs')).rejects.toThrow(/permission denied/i);
    } finally { await db.exec('RESET ROLE'); }
  });

  it('rejects malformed nested data and preserves timestamp instants outside UTC', async () => {
    await expect(db.exec(`UPDATE public.funding_opportunities SET fall_funding='{"term":"Fall","status":"Offered","workflow":"NotOffered"}' WHERE id='demo-funding-1'`)).rejects.toThrow(/chk_funding_json/);
    await expect(db.exec("UPDATE public.programs SET campus_cities='{}' WHERE id='demo-program-1'")).rejects.toThrow(/chk_programs_json/);
    await db.exec("SET timezone='Asia/Dubai'; UPDATE public.programs SET university=university WHERE id='demo-program-1'");
    const result = await db.query<{ difference: number }>("SELECT abs(extract(epoch FROM updated_at - now()))::float8 AS difference FROM public.programs WHERE id='demo-program-1'");
    expect(result.rows[0].difference).toBeLessThan(5);
    await db.exec("SET timezone='UTC'");
  });

  it('preserves edited demos, deleted awards, cascade deletions, and membership revocations on rerun', async () => {
    await db.exec("UPDATE public.programs SET official_name='My edited example' WHERE id='demo-program-1'");
    await db.exec("DELETE FROM public.funding_opportunities WHERE id='demo-funding-1'");
    await db.exec("DELETE FROM public.programs WHERE id='demo-program-2'");
    await db.exec(`DELETE FROM public.team_members WHERE user_id='${owner}'`);
    await applySchema();
    expect((await db.query('SELECT id,official_name FROM public.programs')).rows).toEqual([{ id: 'demo-program-1', official_name: 'My edited example' }]);
    expect((await db.query('SELECT id FROM public.funding_opportunities')).rows).toHaveLength(0);
    expect((await db.query('SELECT user_id FROM public.team_members')).rows).toHaveLength(0);
    await db.exec('DELETE FROM public.programs');
    await applySchema();
    expect((await db.query('SELECT id FROM public.programs')).rows).toHaveLength(0);
  });
});

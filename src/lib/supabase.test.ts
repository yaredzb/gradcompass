import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ auth: { signOut: mocks.signOut } }) }));

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  localStorage.clear();
  mocks.signOut.mockReset();
  localStorage.setItem('gradsearch_supabase_config_v1', JSON.stringify({ url: 'https://example.supabase.co', anonKey: 'test-key' }));
});

it('ends the actual Supabase session before clearing the app user', async () => {
  mocks.signOut.mockResolvedValue({ error: null });
  const auth = await import('./supabase');
  auth.setStoredAuthUser({ id: 'owner', email: 'owner@example.test' });
  await auth.signOut();
  expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' });
  expect(auth.getStoredAuthUser()).toBeNull();
});

it('preserves the app user and surfaces failed sign-outs', async () => {
  mocks.signOut.mockResolvedValue({ error: new Error('Network failed') });
  const auth = await import('./supabase');
  auth.setStoredAuthUser({ id: 'owner', email: 'owner@example.test' });
  await expect(auth.signOut()).rejects.toThrow('Network failed');
  expect(auth.getStoredAuthUser()?.id).toBe('owner');
});

it('requires Supabase configuration in production instead of silently enabling local login', async () => {
  localStorage.clear();
  vi.stubEnv('PROD', true);
  const auth = await import('./supabase');
  expect(() => auth.getSupabaseClient()).toThrow('before deploying');
});

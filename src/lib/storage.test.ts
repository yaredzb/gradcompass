import { beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_DEMO_PROGRAMS, INITIAL_DEMO_FUNDING } from '../data/initialDemoRecords';

const mocks = vi.hoisted(() => ({
  client: null as any,
  user: { id: 'owner', email: 'owner@example.test' } as { id: string; email: string } | null,
}));
vi.mock('./supabase', () => ({
  getSupabaseClient: () => mocks.client,
  getStoredAuthUser: () => mocks.user,
  getStoredSupabaseConfig: () => ({ url: mocks.client ? 'https://database.example.test' : '', anonKey: '' }),
}));

function query(result: { data?: any; error: any }) {
  const builder: any = {
    then: (resolve: any, reject: any) => Promise.resolve(result).then(resolve, reject),
  };
  for (const method of ['select', 'eq', 'upsert', 'delete']) builder[method] = vi.fn(() => builder);
  builder.maybeSingle = vi.fn(async () => result);
  builder.single = vi.fn(async () => result);
  return builder;
}

function remote(programs: any[] = [], funding: any[] = []) {
  mocks.client = { from: vi.fn((table: string) => query({
    data: table === 'team_members' ? { user_id: 'owner' } : table === 'programs' ? programs : funding,
    error: null,
  })) };
  return mocks.client;
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mocks.client = null;
  mocks.user = { id: 'owner', email: 'owner@example.test' };
});

describe('demo records and database authority', () => {
  it('round-trips consortium members and names through database writes and reads', async () => {
    const client = remote();
    const store = await import('./storage');
    await store.fetchAllData();
    const program = { ...INITIAL_DEMO_PROGRAMS[0], isJointProgram: true, university: 'Nordic partnership', consortiumName: 'Nordic partnership', universities: ['Aalto University', 'KTH'] };
    const row = { id: program.id, university: program.university, is_joint_program: true, universities: program.universities, consortium_name: program.consortiumName };
    const write = query({ data: row, error: null });
    client.from.mockReturnValue(write);
    await store.saveProgram(program);
    expect(write.upsert).toHaveBeenCalledWith(expect.objectContaining({ universities: ['Aalto University', 'KTH'], consortium_name: 'Nordic partnership' }));
    expect(store.getProgramsSync().find(item => item.id === program.id)).toMatchObject({ universities: program.universities, consortiumName: program.consortiumName });
  });

  it('keeps deleted local demos deleted after a reload, including the last record', async () => {
    const store = await import('./storage');
    expect((await store.fetchAllData()).programs).toHaveLength(2);
    for (const program of INITIAL_DEMO_PROGRAMS) await store.deleteProgram(program.id);
    vi.resetModules();
    const reloaded = await import('./storage');
    expect(await reloaded.fetchAllData()).toEqual({ programs: [], funding: [] });
  });

  it('restores missing local demos only on request and preserves custom records and edits', async () => {
    const store = await import('./storage');
    await store.fetchAllData();
    const edited = { ...INITIAL_DEMO_PROGRAMS[0], officialName: 'Edited example' };
    await store.saveProgram(edited);
    await store.saveProgram({ ...edited, id: 'my-program', officialName: 'My own record' });
    await store.deleteProgram(INITIAL_DEMO_PROGRAMS[1].id);
    await store.restoreDemoData();
    const data = await store.fetchAllData();
    expect(data.programs).toHaveLength(3);
    expect(data.programs.find(program => program.id === edited.id)?.officialName).toBe('Edited example');
    expect(data.funding).toHaveLength(2);
  });

  it('accepts successful empty remote results instead of loading local demos or stale cache', async () => {
    remote([{ id: 'remote', official_name: 'Remote program' }]);
    const store = await import('./storage');
    expect((await store.fetchAllData()).programs).toHaveLength(1);
    remote();
    expect(await store.fetchAllData()).toEqual({ programs: [], funding: [] });
    expect(localStorage.getItem('gradsearch_programs_v2')).toBeNull();
  });

  it('surfaces read errors instead of silently showing demo data', async () => {
    const client = remote();
    client.from.mockImplementation((table: string) => query(table === 'team_members'
      ? { data: { user_id: 'owner' }, error: null }
      : { data: null, error: { message: 'permission denied' } }));
    const store = await import('./storage');
    await expect(store.fetchAllData()).rejects.toThrow('permission denied');
    expect(localStorage.length).toBe(0);
  });

  it('rejects unapproved team accounts without falling back to local records', async () => {
    remote().from.mockReturnValue(query({ data: null, error: null }));
    const store = await import('./storage');
    await expect(store.fetchAllData()).rejects.toThrow('not been approved');
  });

  it('does not commit or notify after failed program/award saves or deletes', async () => {
    remote([{ id: 'remote', official_name: 'Unchanged' }], [{ id: 'award', program_id: 'remote' }]);
    const store = await import('./storage');
    const previous = await store.fetchAllData();
    const listener = vi.fn();
    store.subscribeToStore(listener);
    mocks.client.from.mockReturnValue(query({ data: null, error: { message: 'write rejected' } }));
    await expect(store.saveProgram(INITIAL_DEMO_PROGRAMS[0])).rejects.toThrow('write rejected');
    await expect(store.saveFundingOpportunity(INITIAL_DEMO_FUNDING[0])).rejects.toThrow('write rejected');
    await expect(store.deleteProgram('remote')).rejects.toThrow('write rejected');
    await expect(store.deleteFundingOpportunity('award')).rejects.toThrow('write rejected');
    expect(store.getProgramsSync()).toEqual(previous.programs);
    expect(store.getFundingSync()).toEqual(previous.funding);
    expect(listener).not.toHaveBeenCalled();
  });

  it('does not report a delete as successful when RLS filters out the target', async () => {
    const client = remote();
    const store = await import('./storage');
    client.from.mockReturnValue(query({ data: [], error: null }));
    await expect(store.deleteProgram('missing')).rejects.toThrow('not deleted');
  });

  it('uses a single cascading database delete for a program', async () => {
    const client = remote();
    const store = await import('./storage');
    await store.fetchAllData();
    client.from.mockClear();
    client.from.mockReturnValue(query({ data: [{ id: 'remote' }], error: null }));
    await store.deleteProgram('remote');
    expect(client.from).toHaveBeenCalledTimes(1);
    expect(client.from).toHaveBeenCalledWith('programs');
  });

  it('clears in-memory data when the account changes', async () => {
    remote([{ id: 'remote' }]);
    const store = await import('./storage');
    await store.fetchAllData();
    mocks.user = { id: 'different-user', email: 'other@example.test' };
    expect(store.getProgramsSync()).toEqual([]);
  });
});

import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_DEMO_PROGRAMS } from './data/initialDemoRecords';
import { programPath } from './lib/routes';
import App from './App';

const mocks = vi.hoisted(() => ({
  user: { id: 'owner', email: 'owner@example.test' } as { id: string; email: string } | null,
  fetch: vi.fn(),
  listener: undefined as (() => void) | undefined,
  remove: vi.fn(),
}));
vi.mock('./lib/supabase', () => ({
  getStoredAuthUser: () => mocks.user,
  getSupabaseClient: () => null,
  setStoredAuthUser: (user: typeof mocks.user) => { mocks.user = user; },
  signOut: vi.fn(),
}));
vi.mock('./lib/storage', () => ({
  fetchAllData: mocks.fetch,
  subscribeToStore: (listener: () => void) => { mocks.listener = listener; return () => { mocks.listener = undefined; }; },
  saveProgram: vi.fn(), deleteProgram: mocks.remove,
  saveFundingOpportunity: vi.fn(), deleteFundingOpportunity: vi.fn(), restoreDemoData: vi.fn(), clearStoreCache: vi.fn(),
}));
vi.mock('./components/AuthGate', () => ({ AuthGate: ({ onAuthenticated }: any) => <button onClick={() => {
  mocks.user = { id: 'owner', email: 'owner@example.test' }; onAuthenticated();
}}>Sign in</button> }));
vi.mock('./components/TopNav', () => ({ TopNav: ({ onSelectTab }: any) => <nav>
  <button onClick={() => onSelectTab('catalog')}>Catalog</button>
  <button onClick={() => onSelectTab('tree')}>Directory</button>
</nav> }));
vi.mock('./components/FilterBar', async importOriginal => {
  const actual = await importOriginal<typeof import('./components/FilterBar')>();
  return { ...actual, FilterBar: () => null };
});
vi.mock('./components/ProgramCard', () => ({ ProgramCard: ({ program, onOpenDetails }: any) => <button onClick={() => onOpenDetails(program)}>Open program</button> }));
vi.mock('./components/DirectoryTreeView', () => ({ DirectoryTreeView: () => <h1>Program directory</h1> }));
vi.mock('./components/ProgramDetailPage', () => ({ ProgramDetailPage: ({ program, onBack, onDeleteProgram }: any) => <div>
  <h1>{program.officialName}</h1><button onClick={onBack}>Back to catalog</button>
  <button onClick={() => { void onDeleteProgram(program.id); }}>Delete program</button>
</div> }));

const program = INITIAL_DEMO_PROGRAMS[0];
beforeEach(() => {
  mocks.user = { id: 'owner', email: 'owner@example.test' };
  mocks.fetch.mockReset().mockResolvedValue({ programs: [program], funding: [] });
  mocks.remove.mockReset().mockResolvedValue(undefined);
  window.history.replaceState(null, '', '/');
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

describe('program detail URLs', () => {
  it('opens a direct link and replaces its outdated slug using the stable ID', async () => {
    window.history.replaceState(null, '', `/programs/${program.id}/old-name`);
    render(<App />);
    await screen.findByRole('heading', { name: program.officialName });
    expect(window.location.pathname).toBe(programPath(program));
    expect(document.title).toBe(`${program.officialName} | GradQuest`);
  });

  it('preserves the requested program through sign-in and waits for records', async () => {
    mocks.user = null;
    let resolve!: (data: any) => void;
    mocks.fetch.mockReturnValue(new Promise(done => { resolve = done; }));
    window.history.replaceState(null, '', programPath(program));
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in' }));
    expect(window.location.pathname).toBe(programPath(program));
    expect(screen.queryByText('Program not found')).not.toBeInTheDocument();
    await act(async () => { resolve({ programs: [program], funding: [] }); });
    await screen.findByRole('heading', { name: program.officialName });
  });

  it('updates browser history and responds to Back and Forward', async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open program' }));
    expect(window.location.pathname).toBe(programPath(program));
    act(() => window.history.back());
    await screen.findByRole('heading', { name: 'Graduate Opportunities' });
    act(() => window.history.forward());
    await screen.findByRole('heading', { name: program.officialName });
    fireEvent.click(screen.getByRole('button', { name: 'Directory' }));
    expect(window.location.pathname).toBe('/directory');
    expect(screen.getByRole('heading', { name: 'Program directory' })).toBeInTheDocument();
  });

  it('shows a missing-program message only after a successful data load', async () => {
    window.history.replaceState(null, '', '/programs/missing/removed-program');
    render(<App />);
    await screen.findByRole('heading', { name: 'Program not found' });
    fireEvent.click(screen.getByRole('button', { name: 'Back to opportunities' }));
    expect(window.location.pathname).toBe('/');
  });

  it('keeps the link and offers retry if the database cannot be reached', async () => {
    mocks.fetch.mockRejectedValueOnce(new Error('Database unavailable'));
    window.history.replaceState(null, '', programPath(program));
    render(<App />);
    await screen.findByText('Database unavailable');
    expect(screen.queryByText('Program not found')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe(programPath(program));
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByRole('heading', { name: program.officialName });
  });

  it('updates the slug after renaming and leaves the detail URL after deletion', async () => {
    window.history.replaceState(null, '', programPath(program));
    render(<App />);
    await screen.findByRole('heading', { name: program.officialName });
    const renamed = { ...program, officialName: 'Updated program name' };
    mocks.fetch.mockResolvedValue({ programs: [renamed], funding: [] });
    act(() => mocks.listener?.());
    await screen.findByRole('heading', { name: renamed.officialName });
    await waitFor(() => expect(window.location.pathname).toBe(programPath(renamed)));
    fireEvent.click(screen.getByRole('button', { name: 'Delete program' }));
    await waitFor(() => expect(window.location.pathname).toBe('/'));
  });
});

import React, { useState, useEffect } from 'react';
import { Program, FundingOpportunity } from './types';
import {
  fetchAllData,
  subscribeToStore,
  saveProgram,
  deleteProgram,
  saveFundingOpportunity,
  deleteFundingOpportunity,
  restoreDemoData,
  clearStoreCache,
} from './lib/storage';
import { getStoredAuthUser, setStoredAuthUser, getSupabaseClient, signOut } from './lib/supabase';
import { AuthGate } from './components/AuthGate';
import { TopNav } from './components/TopNav';
import { FilterBar, FilterState, DEFAULT_FILTERS } from './components/FilterBar';
import { ProgramCard } from './components/ProgramCard';
import { SpreadsheetView } from './components/SpreadsheetView';
import { DirectoryTreeView } from './components/DirectoryTreeView';
import { ProgramDetailPage } from './components/ProgramDetailPage';
import { ProgramFormModal } from './components/ProgramFormModal';
import { FundingFormModal } from './components/FundingFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { useFilteredPrograms } from './hooks/useFilteredPrograms';
import { useAppRoute } from './hooks/useAppRoute';
import { programPath } from './lib/routes';
import { LayoutGrid, Table as TableIcon, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const { route, pathname, navigate } = useAppRoute();
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('gradsearch_theme') === 'dark';
  });

  // Sync theme class to <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gradsearch_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gradsearch_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Authentication State
  const [authUser, setAuthUser] = useState<{ email: string; id: string } | null>(() =>
    getStoredAuthUser()
  );

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [isRestoringDemo, setIsRestoringDemo] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      clearStoreCache();
      setPrograms([]);
      setFunding([]);
      setIsAddProgramOpen(false);
      setFundingModalProgram(null);
      setAuthUser(null);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Could not sign out. Please try again.');
    }
  };

  useEffect(() => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        setIsAuthLoading(false);
        return;
      }
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ? { id: session.user.id, email: session.user.email || '' } : null;
        setStoredAuthUser(user);
        setAuthUser(previous => previous?.id === user?.id && previous?.email === user?.email ? previous : user);
        setIsAuthLoading(false);
      });
      return () => data.subscription.unsubscribe();
    } catch (error) {
      setStoredAuthUser(null);
      setAuthUser(null);
      setIsAuthLoading(false);
    }
  }, []);

  // Data Store State
  const [programs, setPrograms] = useState<Program[]>([]);
  const [funding, setFunding] = useState<FundingOpportunity[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadedForUser, setLoadedForUser] = useState<string | null>(null);
  const isLoadingRecords = isLoadingData || loadedForUser !== authUser?.id;

  useEffect(() => {
    if (isAuthLoading) return;
    if (!authUser) {
      setLoadedForUser(null);
      clearStoreCache();
      setPrograms([]);
      setFunding([]);
      setIsAddProgramOpen(false);
      setFundingModalProgram(null);
      return;
    }
    let active = true;
    let latestRequest = 0;
    const loadData = async () => {
      const request = ++latestRequest;
      setIsLoadingData(true);
      try {
        const data = await fetchAllData();
        if (!active || request !== latestRequest) return;
        setPrograms(data.programs);
        setFunding(data.funding);
        setDataError(null);
      } catch (error) {
        if (!active || request !== latestRequest) return;
        setPrograms([]);
        setFunding([]);
        setDataError(error instanceof Error ? error.message : 'Could not load saved records.');
      } finally {
        if (active && request === latestRequest) {
          setLoadedForUser(authUser.id);
          setIsLoadingData(false);
        }
      }
    };
    void loadData();
    const unsubscribe = subscribeToStore(() => { void loadData(); });
    return () => { active = false; unsubscribe(); };
  }, [authUser, isAuthLoading, reloadCount]);

  const currentTab = route.view === 'tree' ? 'tree' : route.view === 'detail' ? 'detail' : 'catalog';
  // View mode inside catalog: 'grid' | 'spreadsheet'
  const [viewMode, setViewMode] = useState<'grid' | 'spreadsheet'>('grid');

  // Filter State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Active / Inspected Program for the Full Detail Page
  const inspectProgram = route.view === 'detail' && loadedForUser === authUser?.id ? programs.find(program => program.id === route.programId) : undefined;

  // Modal States
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [fundingModalProgram, setFundingModalProgram] = useState<Program | null>(null);
  const [editingFunding, setEditingFunding] = useState<FundingOpportunity | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const availableRegions = [
    'GCC',
    'Europe',
    'Nordic countries',
    'Asia',
    'USA',
    'Canada',
    'Oceania',
    'Other regions',
  ];

  const {
    availableCountries,
    availableUniversities,
    availableFields,
    filteredPrograms,
  } = useFilteredPrograms(programs, funding, filters);

  // The ID determines the record; replace stale slugs without breaking old links.
  useEffect(() => {
    if (authUser && inspectProgram && pathname !== programPath(inspectProgram)) {
      navigate(programPath(inspectProgram) + window.location.search + window.location.hash, true);
    }
  }, [authUser, inspectProgram, pathname, navigate]);

  useEffect(() => {
    document.title = inspectProgram ? `${inspectProgram.officialName} | GradQuest` : 'GradQuest';
  }, [inspectProgram]);

  useEffect(() => {
    setIsAddProgramOpen(false);
    setFundingModalProgram(null);
    setIsRestoreModalOpen(false);
  }, [pathname]);

  const handleOpenDetails = (program: Program) => {
    navigate(programPath(program));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is signed out, enforce AuthGate
  if (isAuthLoading) {
    return <div className="min-h-screen grid place-items-center" role="status">Loading your session…</div>;
  }
  if (!authUser) {
    return <AuthGate onAuthenticated={() => setAuthUser(getStoredAuthUser())} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1F2937] dark:bg-[#0F172A] dark:text-[#F8FAFC]">
      {/* Top Bar (One-Row Contract) */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={tab => navigate(tab === 'tree' ? '/directory' : '/')}
        onOpenAddModal={() => {
          setEditingProgram(null);
          setIsAddProgramOpen(true);
        }}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSignOut={handleSignOut}
        userEmail={authUser.email}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 overflow-x-hidden">
        {dataError && <div role="alert" className="rounded-xl bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-800 dark:text-red-200">
          <p>{dataError}</p>
          <button type="button" className="mt-2 underline" onClick={() => setReloadCount(value => value + 1)}>Try again</button>
        </div>}
        {isLoadingRecords && <p role="status" className="text-sm text-slate-500">Loading saved records…</p>}
        {(route.view === 'not-found' || (route.view === 'detail' && !isLoadingRecords && !dataError && !inspectProgram)) && (
          <div className="py-16 text-center space-y-3">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{route.view === 'detail' ? 'Program not found' : 'Page not found'}</h1>
            <p className="text-sm text-slate-500">{route.view === 'detail' ? 'This program may have been deleted or is not available to your account.' : 'This address does not match a page.'}</p>
            <button type="button" onClick={() => navigate('/')} className="text-sm font-medium underline">Back to opportunities</button>
          </div>
        )}
        {/* VIEW 1: Dedicated Full Detail Page */}
        {currentTab === 'detail' && inspectProgram && (
          <ProgramDetailPage
            program={inspectProgram}
            fundingList={funding.filter((f) => f.programId === inspectProgram.id)}
            onBack={() => navigate('/')}
            onEditProgram={(p) => {
              setEditingProgram(p);
              setIsAddProgramOpen(true);
            }}
            onDeleteProgram={async (id) => {
              await deleteProgram(id);
              navigate('/', true);
            }}
            onAddFunding={(p) => {
              setFundingModalProgram(p);
              setEditingFunding(null);
            }}
            onEditFunding={(fund) => {
              setFundingModalProgram(inspectProgram);
              setEditingFunding(fund);
            }}
            onDeleteFunding={(id) => deleteFundingOpportunity(id)}
          />
        )}

        {/* VIEW 2: Catalog (Grid or Spreadsheet) */}
        {route.view === 'catalog' && (
          <div className="space-y-4">
            {/* Catalog Page Header */}
            <div className="pb-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                Graduate Opportunities
              </h1>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onChange={setFilters}
              availableRegions={availableRegions}
              availableCountries={availableCountries}
              availableUniversities={availableUniversities}
              availableFields={availableFields}
              totalResults={filteredPrograms.length}
            />

            {/* View Mode Toggle: Grid vs Spreadsheet */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>
                {isLoadingData && programs.length === 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700 dark:text-slate-300" />
                    Loading saved programs…
                  </span>
                ) : (
                  <>
                    Showing <strong className="text-slate-800 dark:text-slate-200">{filteredPrograms.length}</strong> of{' '}
                    {programs.length} saved program{programs.length === 1 ? '' : 's'}
                  </>
                )}
              </span>

              {/* Clean View Switcher */}
              <div className="flex items-center border border-[#E6DFD5] dark:border-[#334155] rounded-lg overflow-hidden bg-white dark:bg-[#1E293B] shadow-2xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#F4EFE6] dark:hover:bg-slate-800'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Grid</span>
                </button>
                <div className="w-px h-4 bg-[#E6DFD5] dark:border-[#334155]" />
                <button
                  onClick={() => setViewMode('spreadsheet')}
                  className={`px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'spreadsheet'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#F4EFE6] dark:hover:bg-slate-800'
                  }`}
                  title="Spreadsheet Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Spreadsheet</span>
                </button>
              </div>
            </div>

            {/* Loading Skeletons on initial load/hard refresh */}
            {isLoadingData && programs.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] animate-pulse space-y-3"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0"></div>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                    <div className="pt-2 flex gap-2">
                      <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-5 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty Results State (only after loading completes) */}
            {!isLoadingData && filteredPrograms.length === 0 && (
              <div
                className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-xl
                  border border-[#E6DFD5] dark:border-[#334155] space-y-3"
              >
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No opportunities match the current filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try clearing active filters or adding a new graduate program record.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="px-3 py-1.5 text-xs font-medium bg-[#F4EFE6] dark:bg-[#0F172A]
                      rounded-lg text-slate-700 dark:text-slate-300 hover:bg-[#E6DFD5] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => {
                      setEditingProgram(null);
                      setIsAddProgramOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-900 dark:bg-white
                      text-white dark:text-slate-900 rounded-lg cursor-pointer"
                  >
                    Add Program
                  </button>
                </div>
              </div>
            )}

            {/* Mode A: Clean Grid View */}
            {viewMode === 'grid' && filteredPrograms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrograms.map((program) => {
                  const progFunding = funding.filter((f) => f.programId === program.id);
                  return (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      fundingList={progFunding}
                      onOpenDetails={(p) => handleOpenDetails(p)}
                    />
                  );
                })}
              </div>
            )}

            {/* Mode B: Full Spreadsheet View */}
            {viewMode === 'spreadsheet' && filteredPrograms.length > 0 && (
              <SpreadsheetView
                programs={filteredPrograms}
                funding={funding}
                onOpenDetails={(p) => handleOpenDetails(p)}
              />
            )}
          </div>
        )}

        {/* VIEW 3: Hierarchical Directory Tree View */}
        {currentTab === 'tree' && (
          <DirectoryTreeView
            programs={programs}
            funding={funding}
            onSelectProgram={(p) => handleOpenDetails(p)}
          />
        )}
      </main>

      {/* Add / Edit Program Modal */}
      {isAddProgramOpen && (
        <ProgramFormModal
          initialProgram={editingProgram}
            existingUniversities={programs.flatMap(program => program.universities?.length ? program.universities : program.isJointProgram ? [] : [program.university])}
          existingFields={availableFields}
          onSave={(p) => saveProgram(p)}
          onClose={() => {
            setIsAddProgramOpen(false);
            setEditingProgram(null);
          }}
        />
      )}

      {/* Add / Edit Funding Modal */}
      {fundingModalProgram && (
        <FundingFormModal
          program={fundingModalProgram}
          initialFunding={editingFunding}
          onSave={(f) => saveFundingOpportunity(f)}
          onClose={() => {
            setFundingModalProgram(null);
            setEditingFunding(null);
          }}
        />
      )}

      {/* Footer */}
      <footer
        className="mt-auto border-t border-[#E6DFD5] dark:border-[#334155] py-4
          px-4 text-center text-xs text-slate-500 dark:text-slate-400"
      >
        <div className="flex items-center justify-center">
          <button
            disabled={isRestoringDemo}
            onClick={() => setIsRestoreModalOpen(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer disabled:opacity-50"
          >
            {isRestoringDemo ? 'Restoring demo records…' : 'Restore Demo Records'}
          </button>
        </div>
      </footer>

      {/* Restore Demo Records Confirmation Modal */}
      <ConfirmModal
        isOpen={isRestoreModalOpen}
        title="Restore Demo Records?"
        message="Restore the standard Nordic Master and Direct PhD demo records?"
        confirmLabel={isRestoringDemo ? 'Restoring...' : 'Restore'}
        cancelLabel="Cancel"
        variant="warning"
        isLoading={isRestoringDemo}
        onConfirm={async () => {
          if (isRestoringDemo) return;
          setIsRestoringDemo(true);
          try {
            await restoreDemoData();
            setIsRestoreModalOpen(false);
          } catch (error) {
            setDataError(
              error instanceof Error
                ? error.message
                : 'Could not restore demo records.'
            );
          } finally {
            setIsRestoringDemo(false);
          }
        }}
        onCancel={() => { if (!isRestoringDemo) setIsRestoreModalOpen(false); }}
      />
    </div>
  );
}

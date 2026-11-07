import React, { useState, useEffect } from 'react';
import { Program, FundingOpportunity } from './types';
import {
  fetchAllData,
  subscribeToStore,
  saveProgram,
  deleteProgram,
  saveFundingOpportunity,
  deleteFundingOpportunity,
  resetDemoData,
} from './lib/storage';
import { getStoredAuthUser, setStoredAuthUser } from './lib/supabase';
import { AuthGate } from './components/AuthGate';
import { TopNav } from './components/TopNav';
import { FilterBar, FilterState, DEFAULT_FILTERS } from './components/FilterBar';
import { ProgramCard } from './components/ProgramCard';
import { SpreadsheetView } from './components/SpreadsheetView';
import { DirectoryTreeView } from './components/DirectoryTreeView';
import { ProgramDetailPage } from './components/ProgramDetailPage';
import { ProgramFormModal } from './components/ProgramFormModal';
import { FundingFormModal } from './components/FundingFormModal';
import { useFilteredPrograms } from './hooks/useFilteredPrograms';
import { LayoutGrid, Table as TableIcon, AlertCircle } from 'lucide-react';

export default function App() {
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

  const handleSignOut = () => {
    setStoredAuthUser(null);
    setAuthUser(null);
  };

  // Data Store State
  const [programs, setPrograms] = useState<Program[]>([]);
  const [funding, setFunding] = useState<FundingOpportunity[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadData = async () => {
    setIsLoadingData(true);
    const data = await fetchAllData();
    setPrograms(data.programs);
    setFunding(data.funding);
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (authUser) {
      loadData();
      return subscribeToStore(() => {
        loadData();
      });
    }
  }, [authUser]);

  // Tab State: 'catalog' | 'tree' | 'detail'
  const [currentTab, setCurrentTab] = useState<'catalog' | 'tree' | 'detail'>('catalog');
  // View mode inside catalog: 'grid' | 'spreadsheet'
  const [viewMode, setViewMode] = useState<'grid' | 'spreadsheet'>('grid');

  // Filter State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Active / Inspected Program for the Full Detail Page
  const [inspectProgram, setInspectProgram] = useState<Program | null>(null);

  // Modal States
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [fundingModalProgram, setFundingModalProgram] = useState<Program | null>(null);
  const [editingFunding, setEditingFunding] = useState<FundingOpportunity | null>(null);

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

  // Keep inspectProgram synced if programs updated
  useEffect(() => {
    if (inspectProgram) {
      const refreshed = programs.find((p) => p.id === inspectProgram.id);
      if (refreshed) {
        setInspectProgram(refreshed);
      }
    }
  }, [programs]);

  const handleOpenDetails = (program: Program) => {
    setInspectProgram(program);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is signed out, enforce AuthGate
  if (!authUser) {
    return <AuthGate onAuthenticated={() => setAuthUser(getStoredAuthUser())} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1F2937] dark:bg-[#0F172A] dark:text-[#F8FAFC]">
      {/* Top Bar (One-Row Contract) */}
      <TopNav
        currentTab={currentTab === 'detail' ? 'catalog' : currentTab}
        onSelectTab={(tab) => {
          if (tab === 'catalog' && currentTab === 'detail') {
            setCurrentTab('catalog');
          } else {
            setCurrentTab(tab);
          }
        }}
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
        {/* VIEW 1: Dedicated Full Detail Page */}
        {currentTab === 'detail' && inspectProgram && (
          <ProgramDetailPage
            program={inspectProgram}
            fundingList={funding.filter((f) => f.programId === inspectProgram.id)}
            onBack={() => setCurrentTab('catalog')}
            onEditProgram={(p) => {
              setEditingProgram(p);
              setIsAddProgramOpen(true);
            }}
            onDeleteProgram={(id) => {
              deleteProgram(id);
              setCurrentTab('catalog');
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
        {currentTab === 'catalog' && (
          <div className="space-y-4">
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
                Showing <strong className="text-slate-800 dark:text-slate-200">{filteredPrograms.length}</strong> of{' '}
                {programs.length} saved program{programs.length === 1 ? '' : 's'}
              </span>

            {/* View Switcher Button Group */}
            <div
              className="flex items-center gap-1 bg-[#F4EFE6] dark:bg-[#1E293B]
                p-1 rounded-lg border border-[#E6DFD5] dark:border-[#334155]"
            >
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors
                  flex items-center gap-1.5 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
              <button
                onClick={() => setViewMode('spreadsheet')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors
                  flex items-center gap-1.5 ${
                    viewMode === 'spreadsheet'
                      ? 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Spreadsheet View</span>
              </button>
            </div>
          </div>

          {/* Empty Results State */}
          {filteredPrograms.length === 0 && (
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
                    rounded-lg text-slate-700 dark:text-slate-300 hover:bg-[#E6DFD5]"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => {
                    setEditingProgram(null);
                    setIsAddProgramOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-900 dark:bg-white
                    text-white dark:text-slate-900 rounded-lg"
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
          existingUniversities={availableUniversities}
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
            onClick={() => {
              if (window.confirm('Reset database to the two standard demo examples?')) {
                resetDemoData();
              }
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
          >
            Reset Demo Records
          </button>
        </div>
      </footer>
    </div>
  );
}

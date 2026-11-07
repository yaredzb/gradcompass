import React from 'react';
import { Sun, Moon, Plus, LogOut, Layers, FolderTree } from 'lucide-react';

interface TopNavProps {
  currentTab: 'catalog' | 'tree';
  onSelectTab: (tab: 'catalog' | 'tree') => void;
  onOpenAddModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
  userEmail?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  isDark,
  onToggleTheme,
  onSignOut,
  userEmail,
}) => {
  return (
    <header
      className="sticky top-0 z-30 w-full bg-[#FBF9F5]/90 dark:bg-[#0F172A]/90
        backdrop-blur-md border-b border-[#E6DFD5] dark:border-[#334155]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900
              dark:text-white whitespace-nowrap"
          >
            GradSearch{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              EE·CE·AI
            </span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md
              transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                currentTab === 'catalog'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Catalog</span>
          </button>

          <button
            onClick={() => onSelectTab('tree')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md
              transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                currentTab === 'tree'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Directory</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md
              bg-blue-600 hover:bg-blue-700 text-white transition-colors flex
              items-center gap-1 whitespace-nowrap cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Program</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Theme Toggle & Sign Out) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300
              hover:bg-[#F4EFE6] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            title={isDark ? 'Switch to Warm Paper Light' : 'Switch to Soft Dark Slate'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={onSignOut}
            aria-label="Sign out"
            className="p-2 rounded-lg text-slate-500 hover:text-red-600
              dark:text-slate-400 dark:hover:text-red-400 hover:bg-[#F4EFE6]
              dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            title={
              userEmail
                ? `Signed in as ${userEmail} (Click to sign out)`
                : 'Sign out'
            }
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

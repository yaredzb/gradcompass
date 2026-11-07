import React from 'react';
import { Sun, Moon, Plus, LogOut, Layers, FolderTree, Compass, ArrowLeft } from 'lucide-react';

export interface TopNavProps {
  currentTab: 'catalog' | 'tree' | 'detail';
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
  const username = userEmail ? userEmail.split('@')[0] : '';
  const initial = username ? username[0].toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FBF9F5]/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-[#E6DFD5] dark:border-[#334155] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        {/* Left Section: Brand & Primary Navigation Tabs (Left-aligned, clean underline) */}
        <div className="flex items-center gap-6 sm:gap-8 h-full min-w-0">
          {/* Brand Logo */}
          <button
            onClick={() => onSelectTab('catalog')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg shrink-0 py-1"
            title="GradQuest Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] flex items-center justify-center text-slate-800 dark:text-slate-100 shadow-2xs group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors">
              <Compass className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-display">
              GradQuest
            </span>
          </button>

          {/* Primary View Navigation (No beige capsule; sits on the header bottom line) */}
          <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-3 h-full">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`h-full px-2.5 sm:px-3 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 -mb-px ${
                currentTab === 'catalog' || currentTab === 'detail'
                  ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {currentTab === 'detail' ? (
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <Layers className="w-3.5 h-3.5" />
              )}
              <span>Catalog</span>
            </button>

            <button
              onClick={() => onSelectTab('tree')}
              className={`h-full px-2.5 sm:px-3 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 -mb-px ${
                currentTab === 'tree'
                  ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Add Program</span>
          </button>

          <div className="h-5 w-px bg-[#E6DFD5] dark:bg-[#334155] mx-0.5 hidden xs:block" aria-hidden="true" />

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#F4EFE6] dark:hover:bg-[#1E293B] border border-transparent hover:border-[#E6DFD5] dark:hover:border-[#334155] transition-colors cursor-pointer"
            title={isDark ? 'Switch to Warm Paper Light' : 'Switch to Soft Dark Slate'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Account / Sign Out Pill */}
          {userEmail && (
            <div className="flex items-center gap-1.5 pl-1">
              <div
                className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#F4EFE6] dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] text-xs text-slate-700 dark:text-slate-300 font-medium"
                title={`Signed in as ${userEmail}`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[10px] flex items-center justify-center font-mono">
                  {initial}
                </span>
                <span className="max-w-[110px] truncate">{username}</span>
              </div>

              <button
                onClick={onSignOut}
                aria-label="Sign out"
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title={`Sign out (${userEmail})`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

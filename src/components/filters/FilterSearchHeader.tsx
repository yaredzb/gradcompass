import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterState } from '../FilterBar';

interface FilterSearchHeaderProps {
  filters: FilterState;
  update: (partial: Partial<FilterState>) => void;
  hasActiveFilters: boolean;
  onOpenDrawer: () => void;
}

export const FilterSearchHeader: React.FC<FilterSearchHeaderProps> = ({
  filters,
  update,
  hasActiveFilters,
  onOpenDrawer,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => update({ searchQuery: e.target.value })}
          placeholder="Search programs, institutions, fields, cities..."
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm min-h-[40px] sm:min-h-[36px] rounded-lg
            border border-[#E6DFD5] dark:border-[#334155] bg-white
            dark:bg-[#1E293B] text-slate-900 dark:text-white
            placeholder:text-slate-400 focus:outline-none focus:ring-1
            focus:ring-slate-900 dark:focus:ring-white"
        />
        {filters.searchQuery && (
          <button
            onClick={() => update({ searchQuery: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5
              text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Sort Select */}
        <div className="relative flex-1 sm:flex-none sm:shrink-0">
          <select
            value={filters.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as any })}
            className="w-full sm:w-auto text-xs px-2.5 py-2 min-h-[40px] sm:min-h-[36px] rounded-lg border border-[#E6DFD5]
              dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-700
              dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="deadline">Next Deadline</option>
            <option value="recent">Recently Checked</option>
            <option value="university">Institution (A-Z)</option>
            <option value="name">Program Name (A-Z)</option>
          </select>
        </div>

        {/* Filter Drawer Trigger */}
        <button
          onClick={onOpenDrawer}
          className={`shrink-0 px-3 py-2 min-h-[40px] sm:min-h-[36px] text-xs font-medium rounded-lg border
            transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              hasActiveFilters
                ? 'border-blue-600 bg-blue-50 text-blue-700 ' +
                  'dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                : 'border-[#E6DFD5] dark:border-[#334155] bg-white ' +
                  'dark:bg-[#1E293B] text-slate-700 dark:text-slate-300'
            }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
      </div>
    </div>
  );
};


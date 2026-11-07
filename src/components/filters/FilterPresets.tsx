import React from 'react';
import { RotateCcw } from 'lucide-react';
import { FilterState } from '../FilterBar';

interface FilterPresetsProps {
  filters: FilterState;
  update: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterPresets: React.FC<FilterPresetsProps> = ({
  filters,
  update,
  resetFilters,
  hasActiveFilters,
}) => {
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto pb-1
        text-xs no-scrollbar"
    >
      <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 mr-1">
        Quick filters:
      </span>

      <button
        onClick={() =>
          update({
            fullRideEthiopian: !filters.fullRideEthiopian,
            ethiopianEligibility: !filters.fullRideEthiopian
              ? 'OpenToEthiopian'
              : 'ALL',
            fundingCoverage: !filters.fullRideEthiopian ? 'FullRide' : 'ALL',
          })
        }
        className={`shrink-0 px-2.5 py-1 rounded text-xs transition-colors ${
          filters.fullRideEthiopian
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium'
            : 'bg-[#F4EFE6] dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 ' +
              'hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        Full-Ride for Ethiopian Applicants
      </button>

      <button
        onClick={() =>
          update({
            englishCourseworkOnly: !filters.englishCourseworkOnly,
            mediumOfInstruction: !filters.englishCourseworkOnly
              ? 'English'
              : 'ALL',
            programStructure: !filters.englishCourseworkOnly
              ? 'TaughtCourseworkOnly'
              : 'ALL',
            degreeRoute: !filters.englishCourseworkOnly ? 'Masters' : 'ALL',
          })
        }
        className={`shrink-0 px-2.5 py-1 rounded text-xs transition-colors ${
          filters.englishCourseworkOnly
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium'
            : 'bg-[#F4EFE6] dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 ' +
              'hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        English Coursework-Only Master’s
      </button>

      <button
        onClick={() =>
          update({
            directPhDOnly: !filters.directPhDOnly,
            degreeRoute: !filters.directPhDOnly ? 'DirectPhD' : 'ALL',
          })
        }
        className={`shrink-0 px-2.5 py-1 rounded text-xs transition-colors ${
          filters.directPhDOnly
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium'
            : 'bg-[#F4EFE6] dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 ' +
              'hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        Direct PhD from Bachelor’s
      </button>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="shrink-0 px-2 py-1 text-xs text-red-600 dark:text-red-400
            hover:underline flex items-center gap-1 ml-auto"
        >
          <RotateCcw className="w-3 h-3" />
          Reset all
        </button>
      )}
    </div>
  );
};


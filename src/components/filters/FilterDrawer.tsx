import React from 'react';
import { X } from 'lucide-react';
import { FilterState } from '../FilterBar';
import { ALL_COUNTRIES } from '../../utils/regions';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  update: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
  availableCountries: string[];
  availableUniversities: string[];
  availableFields: string[];
  totalResults: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  update,
  resetFilters,
  availableCountries,
  availableUniversities,
  availableFields,
  totalResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1E293B] h-full
          shadow-xl flex flex-col z-10 border-l border-[#E6DFD5]
          dark:border-[#334155]"
      >
        {/* Header */}
        <div
          className="p-4 border-b border-[#E6DFD5] dark:border-[#334155]
            flex items-center justify-between"
        >
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Filter Opportunities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalResults} program{totalResults === 1 ? '' : 's'} matching criteria
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900
              dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Select Fields */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Region */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Region
            </label>
            <select
              value={filters.region}
              onChange={(e) => update({ region: e.target.value })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Regions</option>
              <option value="GCC">GCC (UAE, Saudi Arabia, Qatar, etc.)</option>
              <option value="Europe">Europe (including Nordic)</option>
              <option value="Nordic countries">
                ↳ Nordic countries (Sweden, Denmark, Norway, Finland)
              </option>
              <option value="Asia">Asia (Japan, Korea, Singapore, etc.)</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="Oceania">Oceania (Australia, etc.)</option>
              <option value="Other regions">Other regions</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => update({ country: e.target.value })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Countries</option>
              {availableCountries.length > 0 && (
                <optgroup label="Countries in Saved Database">
                  {availableCountries.map((c) => (
                    <option key={`saved-${c}`} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Global Countries">
                {ALL_COUNTRIES.map((c) => (
                  <option key={`all-${c}`} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* University */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              University or Consortium
            </label>
            <select
              value={filters.university}
              onChange={(e) => update({ university: e.target.value })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Institutions</option>
              {availableUniversities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Field */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Field / Specialization
            </label>
            <select
              value={filters.field}
              onChange={(e) => update({ field: e.target.value })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Fields</option>
              {availableFields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Route */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Degree Route
            </label>
            <select
              value={filters.degreeRoute}
              onChange={(e) => update({ degreeRoute: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Degree Routes</option>
              <option value="Masters">Master’s</option>
              <option value="DirectPhD">Direct PhD from Bachelor’s</option>
              <option value="IntegratedMastersPhD">Integrated Master’s–PhD</option>
              <option value="MastersRequiredPhD">PhD (Requires Master’s)</option>
              <option value="Unclear">Unclear</option>
            </select>
          </div>

          {/* Program Structure */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Program Structure
            </label>
            <select
              value={filters.programStructure}
              onChange={(e) => update({ programStructure: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Structures</option>
              <option value="TaughtCourseworkOnly">Taught coursework only</option>
              <option value="CourseworkPlusCapstone">
                Taught coursework plus project or capstone
              </option>
              <option value="CourseworkPlusThesis">
                Taught coursework plus thesis
              </option>
              <option value="ResearchMastersByThesis">
                Research master’s by thesis
              </option>
              <option value="PhDByDissertation">PhD by dissertation</option>
              <option value="PhDCourseworkDissertation">
                PhD with coursework plus dissertation
              </option>
              <option value="Other">Other</option>
              <option value="Unclear">Unclear</option>
            </select>
          </div>

          {/* Medium of Instruction */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Medium of Instruction
            </label>
            <select
              value={filters.mediumOfInstruction}
              onChange={(e) => update({ mediumOfInstruction: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Instruction Languages</option>
              <option value="English">English</option>
              <option value="LocalLanguage">Local language</option>
              <option value="Mixed">Mixed</option>
              <option value="Other">Other</option>
              <option value="Unclear">Unclear</option>
            </select>
          </div>

          {/* Ethiopian Eligibility */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ethiopian Applicant Eligibility
            </label>
            <select
              value={filters.ethiopianEligibility}
              onChange={(e) => update({ ethiopianEligibility: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Eligibility</option>
              <option value="OpenToEthiopian">Open to Ethiopian applicants</option>
              <option value="EthiopiaSpecific">Ethiopia-specific award</option>
              <option value="Ineligible">Ineligible</option>
              <option value="Unclear">Unclear</option>
            </select>
          </div>

          {/* Funding Coverage */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Funding Coverage
            </label>
            <select
              value={filters.fundingCoverage}
              onChange={(e) => update({ fundingCoverage: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Coverage Types</option>
              <option value="FullRide">Full ride</option>
              <option value="FullTuitionPartialLiving">
                Full tuition plus partial living support
              </option>
              <option value="FullTuitionOnly">Full tuition only</option>
              <option value="PartialTuition">Partial tuition</option>
              <option value="StipendOnly">Stipend only</option>
              <option value="Other">Other</option>
              <option value="Unclear">Unclear</option>
            </select>
          </div>

          {/* Intake Filter */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Intake
            </label>
            <select
              value={filters.intakeFilter}
              onChange={(e) => update({ intakeFilter: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-[#E6DFD5]
                dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="ALL">All Intakes</option>
              <option value="Fall">Fall Intake Offered</option>
              <option value="Spring">Spring Intake Offered</option>
              <option value="Rolling">Rolling Admissions</option>
              <option value="OpenUpcoming">Upcoming Fixed Deadlines Only</option>
            </select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          className="p-4 border-t border-[#E6DFD5] dark:border-[#334155]
            flex items-center justify-between gap-3"
        >
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400
              hover:text-slate-900 dark:hover:text-white font-medium"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-900 dark:bg-blue-600
              text-white rounded-lg text-xs font-medium hover:bg-slate-800
              dark:hover:bg-blue-700 transition-colors"
          >
            Apply Filters ({totalResults})
          </button>
        </div>
      </div>
    </div>
  );
};


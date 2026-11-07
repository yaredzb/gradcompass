import React from 'react';
import { Check } from 'lucide-react';

interface SelectionCompetitivenessSectionProps {
  selectionSteps: string[];
  setSelectionSteps: (val: string[]) => void;
  availableSelectionSteps: string[];
  competitivenessDetails: string;
  setCompetitivenessDetails: (val: string) => void;
  competitivenessYear: string;
  setCompetitivenessYear: (val: string) => void;
  competitivenessLink: string;
  setCompetitivenessLink: (val: string) => void;
}

export const SelectionCompetitivenessSection: React.FC<SelectionCompetitivenessSectionProps> = ({
  selectionSteps,
  setSelectionSteps,
  availableSelectionSteps,
  competitivenessDetails,
  setCompetitivenessDetails,
  competitivenessYear,
  setCompetitivenessYear,
  competitivenessLink,
  setCompetitivenessLink,
}) => {
  const toggleSelectionStep = (step: string) => {
    if (selectionSteps.includes(step)) {
      setSelectionSteps(selectionSteps.filter((s) => s !== step));
    } else {
      setSelectionSteps([...selectionSteps, step]);
    }
  };

  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider text-slate-500 font-mono"
      >
        07. Selection Steps & Program Competitiveness
      </h3>

      {/* Selection Steps */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
          Selection Steps & Admission Workflow
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableSelectionSteps.map((step) => {
            const isSelected = selectionSteps.includes(step);
            return (
              <button
                type="button"
                key={step}
                onClick={() => toggleSelectionStep(step)}
                className={`px-3 py-2 rounded-lg border text-xs text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 font-medium shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white text-slate-900 dark:bg-slate-900 dark:text-white'
                      : 'border border-slate-300 dark:border-slate-600 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="leading-tight">{step}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Competitiveness */}
      <div className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-[#E6DFD5] dark:border-[#334155] space-y-2">
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
          Admission Selectivity & Acceptance Competitiveness
        </label>
        <textarea
          rows={2}
          value={competitivenessDetails}
          onChange={(e) => setCompetitivenessDetails(e.target.value)}
          placeholder="Cohort size, average admitted GPA, acceptance rate..."
          className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">
              Source Year
            </label>
            <input
              type="text"
              value={competitivenessYear}
              onChange={(e) => setCompetitivenessYear(e.target.value)}
              placeholder="2026"
              className="w-full px-2 py-1 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] text-slate-500 mb-0.5">
              Source URL
            </label>
            <input
              type="url"
              value={competitivenessLink}
              onChange={(e) => setCompetitivenessLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-2 py-1 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


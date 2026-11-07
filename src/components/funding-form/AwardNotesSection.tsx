import React from 'react';

interface AwardNotesSectionProps {
  intakeNotes: string;
  setIntakeNotes: (val: string) => void;
  competitivenessRate: string;
  setCompetitivenessRate: (val: string) => void;
  competitivenessYear: string;
  setCompetitivenessYear: (val: string) => void;
  competitivenessLink: string;
  setCompetitivenessLink: (val: string) => void;
  visaAndWorkNotes: string;
  setVisaAndWorkNotes: (val: string) => void;
  informationLastChecked?: string;
  setInformationLastChecked?: (val: string) => void;
}

export const AwardNotesSection: React.FC<AwardNotesSectionProps> = ({
  intakeNotes,
  setIntakeNotes,
  competitivenessRate,
  setCompetitivenessRate,
  competitivenessYear,
  setCompetitivenessYear,
  competitivenessLink,
  setCompetitivenessLink,
  visaAndWorkNotes,
  setVisaAndWorkNotes,
}) => {
  return (
    <div className="space-y-4">
      {/* General Intake Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Intake & Duration Notes
        </label>
        <textarea
          rows={2}
          value={intakeNotes}
          onChange={(e) => setIntakeNotes(e.target.value)}
          placeholder="e.g. Awarded for 24 months subject to satisfactory academic progress..."
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
            border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
            text-slate-900 dark:text-white"
        />
      </div>

      {/* Competitiveness */}
      <div
        className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-xl border
          border-[#E6DFD5] dark:border-[#334155] space-y-2"
      >
        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Award Selectivity & Competitiveness
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2">
            <label className="block text-[11px] text-slate-500 mb-0.5">
              Award Rate or Ratio
            </label>
            <input
              type="text"
              value={competitivenessRate}
              onChange={(e) => setCompetitivenessRate(e.target.value)}
              placeholder="e.g. ~8% award rate (20 awarded out of 250 applicants)"
              className="w-full px-2.5 py-1.5 text-xs rounded border
                border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">
              Source Year
            </label>
            <input
              type="text"
              value={competitivenessYear}
              onChange={(e) => setCompetitivenessYear(e.target.value)}
              placeholder="2026"
              className="w-full px-2.5 py-1.5 text-xs rounded border
                border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">
            Reference URL
          </label>
          <input
            type="url"
            value={competitivenessLink}
            onChange={(e) => setCompetitivenessLink(e.target.value)}
            placeholder="https://..."
            className="w-full px-2.5 py-1.5 text-xs rounded border
              border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
          />
        </div>
      </div>

      {/* Visa & Work Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Visa & Work Rights Notes
        </label>
        <input
          type="text"
          value={visaAndWorkNotes}
          onChange={(e) => setVisaAndWorkNotes(e.target.value)}
          placeholder="e.g. Student residence permit allows part-time employment up to 20h/week"
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
            border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
            text-slate-900 dark:text-white"
        />
      </div>
    </div>
  );
};


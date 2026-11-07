import React, { useId, useState } from 'react';
import { Info } from 'lucide-react';

interface AdmissionsPrereqSectionProps {
  minimumGrades: string;
  setMinimumGrades: (val: string) => void;
  gradingScale: string;
  setGradingScale: (val: string) => void;
  academicPrerequisites: string;
  setAcademicPrerequisites: (val: string) => void;
  keyRequirements: string;
  setKeyRequirements: (val: string) => void;
}

export const AdmissionsPrereqSection: React.FC<AdmissionsPrereqSectionProps> = ({
  minimumGrades,
  setMinimumGrades,
  gradingScale,
  setGradingScale,
  academicPrerequisites,
  setAcademicPrerequisites,
  keyRequirements,
  setKeyRequirements,
}) => {
  const [showGradingHelp, setShowGradingHelp] = useState(false);
  const gradingId = useId();
  const gradingHelpId = useId();
  const gradingHelp = 'The grading system used for the minimum grade requirement. For example, a 3.0 GPA on a 4.0 scale or 75% on a 100-point scale. For a German scale, lower grades are better.';
  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider text-slate-500 font-mono"
      >
        05. Academic Prerequisites & Grades
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Minimum Grade / CGPA Threshold
          </label>
          <input
            type="text"
            value={minimumGrades}
            onChange={(e) => setMinimumGrades(e.target.value)}
            placeholder="e.g. 3.5 / 4.0 CGPA"
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <label htmlFor={gradingId} className="text-xs font-medium text-slate-700 dark:text-slate-300">Grading Scale</label>
            <button type="button" aria-label="About grading scale" title={gradingHelp}
              aria-expanded={showGradingHelp} aria-controls={gradingHelpId}
              onClick={() => setShowGradingHelp(value => !value)}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400">
              <Info size={14} aria-hidden="true" />
            </button>
          </div>
          <input
            id={gradingId}
            aria-describedby={showGradingHelp ? gradingHelpId : undefined}
            type="text"
            value={gradingScale}
            onChange={(e) => setGradingScale(e.target.value)}
            placeholder="e.g. 4.0 Scale or ECTS"
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          />
          <p id={gradingHelpId} hidden={!showGradingHelp} className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{gradingHelp}</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Academic Prerequisites (Specific degree backgrounds & credit hours)
        </label>
        <textarea
          rows={2}
          value={academicPrerequisites}
          onChange={(e) => setAcademicPrerequisites(e.target.value)}
          placeholder="Specific degree and credit prerequisites..."
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Key Application Documents & Portfolio Requirements
        </label>
        <textarea
          rows={2}
          value={keyRequirements}
          onChange={(e) => setKeyRequirements(e.target.value)}
          placeholder="Transcripts, recommendation letters, CV..."
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
        />
      </div>
    </div>
  );
};


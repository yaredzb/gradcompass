import React from 'react';

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
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Grading Scale
          </label>
          <input
            type="text"
            value={gradingScale}
            onChange={(e) => setGradingScale(e.target.value)}
            placeholder="e.g. 4.0 Scale or ECTS"
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          />
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


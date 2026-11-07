import React from 'react';
import {
  FundingIntakeStatus,
  ScholarshipWorkflow,
} from '../../types';

interface FundingCycleSectionProps {
  title: string;
  seasonName: string;
  programDeadlineDate?: string;
  status: FundingIntakeStatus;
  setStatus: (val: FundingIntakeStatus) => void;
  workflow: ScholarshipWorkflow;
  setWorkflow: (val: ScholarshipWorkflow) => void;
  scholarshipDeadlineDate: string;
  setScholarshipDeadlineDate: (val: string) => void;
  earlierDeadlineDate: string;
  setEarlierDeadlineDate: (val: string) => void;
  directPositionLink: string;
  setDirectPositionLink: (val: string) => void;
  directPositionDeadlineDate: string;
  setDirectPositionDeadlineDate: (val: string) => void;
  workflowNotes: string;
  setWorkflowNotes: (val: string) => void;
}

export const FundingCycleSection: React.FC<FundingCycleSectionProps> = ({
  title,
  seasonName,
  programDeadlineDate,
  status,
  setStatus,
  workflow,
  setWorkflow,
  scholarshipDeadlineDate,
  setScholarshipDeadlineDate,
  earlierDeadlineDate,
  setEarlierDeadlineDate,
  directPositionLink,
  setDirectPositionLink,
  directPositionDeadlineDate,
  setDirectPositionDeadlineDate,
  workflowNotes,
  setWorkflowNotes,
}) => {
  return (
    <div
      className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border
        border-[#E6DFD5] dark:border-[#334155] space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3
          className="font-bold text-slate-900 dark:text-white text-xs
            uppercase tracking-wider text-slate-500 font-mono"
        >
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 dark:text-slate-400">
            Funding Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-2 py-1 text-xs rounded border border-[#E6DFD5]
              dark:border-[#334155] bg-white dark:bg-[#1E293B]"
          >
            <option value="Offered">Offered</option>
            <option value="Rolling">Rolling / Continuous</option>
            <option value="NotOffered">Funding Not Offered for {seasonName}</option>
            <option value="Unknown">Unknown / Under verification</option>
          </select>
        </div>
      </div>

      {status === 'Offered' && (
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              How do you apply for this scholarship in {seasonName}? *
            </label>
            <select
              value={workflow}
              onChange={(e) => setWorkflow(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border
                border-[#E6DFD5] dark:border-[#334155] bg-white
                dark:bg-[#1E293B] font-medium"
            >
              <option value="Automatic">
                Automatic with program application (Single deadline)
              </option>
              <option value="Separate">
                Separate scholarship application (Requires separate deadline)
              </option>
              <option value="EarlierDeadline">
                Earlier program deadline for scholarship consideration
              </option>
              <option value="DirectPosition">
                Apply directly to the funded position (Funded PhD)
              </option>
              <option value="Unclear">
                Unclear (Check official scholarship page)
              </option>
            </select>
          </div>

          {workflow === 'Automatic' && (
            <div
              className="p-2.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-lg
                border border-slate-200 dark:border-slate-700 text-xs
                text-slate-700 dark:text-slate-300"
            >
              Program deadline applies:{' '}
              <span className="font-mono font-medium text-slate-900 dark:text-white">
                {programDeadlineDate || 'Unpublished'}
              </span>{' '}
              with automatic funding evaluation.
            </div>
          )}

          {workflow === 'Separate' && (
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Separate Scholarship Application Deadline Date
                </label>
                <input
                  type="date"
                  value={scholarshipDeadlineDate}
                  onChange={(e) => setScholarshipDeadlineDate(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded border
                    border-[#E6DFD5] dark:border-[#334155] bg-white
                    dark:bg-[#1E293B] font-mono"
                />
              </div>
              <input
                type="text"
                value={workflowNotes}
                onChange={(e) => setWorkflowNotes(e.target.value)}
                placeholder="Optional notes: e.g. Admission offer required before applying"
                className="w-full px-2.5 py-1.5 text-xs rounded border
                  border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
              />
            </div>
          )}

          {workflow === 'EarlierDeadline' && (
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Earlier Priority Program Deadline Date
                </label>
                <input
                  type="date"
                  value={earlierDeadlineDate}
                  onChange={(e) => setEarlierDeadlineDate(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded border
                    border-[#E6DFD5] dark:border-[#334155] bg-white
                    dark:bg-[#1E293B] font-mono"
                />
              </div>
              <input
                type="text"
                value={workflowNotes}
                onChange={(e) => setWorkflowNotes(e.target.value)}
                placeholder="e.g. Regular program deadline is Jan 15, but Dec 1 is required for scholarship"
                className="w-full px-2.5 py-1.5 text-xs rounded border
                  border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
              />
            </div>
          )}

          {workflow === 'DirectPosition' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                    Position Cutoff Date
                  </label>
                  <input
                    type="date"
                    value={directPositionDeadlineDate}
                    onChange={(e) => setDirectPositionDeadlineDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border
                      border-[#E6DFD5] dark:border-[#334155] bg-white
                      dark:bg-[#1E293B] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                    Job Portal Vacancy Link
                  </label>
                  <input
                    type="url"
                    value={directPositionLink}
                    onChange={(e) => setDirectPositionLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border
                      border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
                  />
                </div>
              </div>
              <input
                type="text"
                value={workflowNotes}
                onChange={(e) => setWorkflowNotes(e.target.value)}
                placeholder="Notes: e.g. Apply to Department Lab vacancy portal"
                className="w-full px-2.5 py-1.5 text-xs rounded border
                  border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
              />
            </div>
          )}

          {workflow === 'Unclear' && (
            <input
              type="text"
              value={workflowNotes}
              onChange={(e) => setWorkflowNotes(e.target.value)}
              placeholder="Notes on where to check or current investigation status"
              className="w-full px-2.5 py-1.5 text-xs rounded border
                border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
            />
          )}
        </div>
      )}
    </div>
  );
};


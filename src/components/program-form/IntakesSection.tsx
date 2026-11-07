import React from 'react';
import { IntakeStatus } from '../../types';

interface IntakesSectionProps {
  fallTerm: string;
  fallStatus: IntakeStatus;
  setFallStatus: (val: IntakeStatus) => void;
  fallStartDate: string;
  setFallStartDate: (val: string) => void;
  fallDeadlineDate: string;
  setFallDeadlineDate: (val: string) => void;
  fallNotes: string;
  setFallNotes: (val: string) => void;
  springTerm: string;
  springStatus: IntakeStatus;
  setSpringStatus: (val: IntakeStatus) => void;
  springStartDate: string;
  setSpringStartDate: (val: string) => void;
  springDeadlineDate: string;
  setSpringDeadlineDate: (val: string) => void;
  springNotes: string;
  setSpringNotes: (val: string) => void;
}

export const IntakesSection: React.FC<IntakesSectionProps> = ({
  fallTerm,
  fallStatus,
  setFallStatus,
  fallStartDate,
  setFallStartDate,
  fallDeadlineDate,
  setFallDeadlineDate,
  fallNotes,
  setFallNotes,
  springTerm,
  springStatus,
  setSpringStatus,
  springStartDate,
  setSpringStartDate,
  springDeadlineDate,
  setSpringDeadlineDate,
  springNotes,
  setSpringNotes,
}) => {
  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider font-mono text-slate-500"
      >
        08. Application Timeline & Intakes
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fall Intake */}
        <div
          className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-xl border
            border-[#E6DFD5] dark:border-[#334155] space-y-3.5"
        >
          <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-between">
            <span className="text-sm font-semibold">{fallTerm || 'Fall Intake'}</span>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              Primary Intake
            </span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              Admission Status
            </label>
            <select
              value={fallStatus}
              onChange={(e) => setFallStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded border
                border-[#E6DFD5] dark:border-[#334155] bg-white
                dark:bg-[#1E293B] text-slate-800 dark:text-slate-200"
            >
              <option value="FixedDeadline">Fixed Deadline (Specify dates)</option>
              <option value="Rolling">Rolling Admissions</option>
              <option value="Unpublished">Pending / Unpublished Deadline</option>
              <option value="NotOffered">Not Offered</option>
              <option value="Unknown">Unknown / Under verification</option>
            </select>
          </div>

          {fallStatus !== 'NotOffered' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Application Opens (Start Date)
                  </label>
                  <input
                    type="date"
                    value={fallStartDate}
                    onChange={(e) => setFallStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border
                      border-[#E6DFD5] dark:border-[#334155] bg-white
                      dark:bg-[#1E293B] font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Application Deadline (End Date){' '}
                    {fallStatus === 'FixedDeadline' && '*'}
                  </label>
                  <input
                    type="date"
                    required={fallStatus === 'FixedDeadline'}
                    value={fallDeadlineDate}
                    onChange={(e) => setFallDeadlineDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border
                      border-[#E6DFD5] dark:border-[#334155] bg-white
                      dark:bg-[#1E293B] font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Timeline & Intake Notes
                </label>
                <input
                  type="text"
                  value={fallNotes}
                  onChange={(e) => setFallNotes(e.target.value)}
                  placeholder="e.g., Central portal closes Jan 15"
                  className="w-full px-2.5 py-1.5 text-xs rounded border
                    border-[#E6DFD5] dark:border-[#334155] bg-white
                    dark:bg-[#1E293B] text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Spring Intake */}
        <div
          className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-xl border
            border-[#E6DFD5] dark:border-[#334155] space-y-3.5"
        >
          <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-between">
            <span className="text-sm font-semibold">{springTerm || 'Spring Intake'}</span>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              Secondary Intake
            </span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              Admission Status
            </label>
            <select
              value={springStatus}
              onChange={(e) => setSpringStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded border
                border-[#E6DFD5] dark:border-[#334155] bg-white
                dark:bg-[#1E293B] text-slate-800 dark:text-slate-200"
            >
              <option value="NotOffered">Not Offered (Fall only)</option>
              <option value="FixedDeadline">Fixed Deadline (Specify dates)</option>
              <option value="Rolling">Rolling Admissions</option>
              <option value="Unpublished">Pending / Unpublished Deadline</option>
              <option value="Unknown">Unknown / Under verification</option>
            </select>
          </div>

          {springStatus !== 'NotOffered' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Application Opens (Start Date)
                  </label>
                  <input
                    type="date"
                    value={springStartDate}
                    onChange={(e) => setSpringStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border
                      border-[#E6DFD5] dark:border-[#334155] bg-white
                      dark:bg-[#1E293B] font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Application Deadline (End Date){' '}
                    {springStatus === 'FixedDeadline' && '*'}
                  </label>
                  <input
                    type="date"
                    required={springStatus === 'FixedDeadline'}
                    value={springDeadlineDate}
                    onChange={(e) => setSpringDeadlineDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border
                      border-[#E6DFD5] dark:border-[#334155] bg-white
                      dark:bg-[#1E293B] font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Timeline & Intake Notes
                </label>
                <input
                  type="text"
                  value={springNotes}
                  onChange={(e) => setSpringNotes(e.target.value)}
                  placeholder="e.g., Spring cohort cutoff Sep 15"
                  className="w-full px-2.5 py-1.5 text-xs rounded border
                    border-[#E6DFD5] dark:border-[#334155] bg-white
                    dark:bg-[#1E293B] text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

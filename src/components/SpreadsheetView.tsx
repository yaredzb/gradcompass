import React from 'react';
import { Award, ChevronRight } from 'lucide-react';
import { Program, FundingOpportunity } from '../types';
import { formatRegionDisplay } from '../utils/regions';

interface SpreadsheetViewProps {
  programs: Program[];
  funding: FundingOpportunity[];
  onOpenDetails: (program: Program) => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  programs,
  funding,
  onOpenDetails,
}) => {
  return (
    <div
      className="w-full overflow-x-auto bg-white dark:bg-[#1E293B] rounded-xl
        border border-[#E6DFD5] dark:border-[#334155] shadow-xs"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="sm:hidden px-3 py-1.5 bg-[#F4EFE6]/70 dark:bg-[#0F172A]/70 border-b border-[#E6DFD5] dark:border-[#334155] text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
        ← Swipe horizontally to view full table columns →
      </div>
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr
            className="border-b border-[#E6DFD5] dark:border-[#334155]
              bg-[#F4EFE6]/60 dark:bg-[#0F172A]/60 text-slate-700 dark:text-slate-300"
          >
            <th className="py-3 px-3 font-semibold whitespace-nowrap">Institution</th>
            <th className="py-3 px-3 font-semibold min-w-[200px]">Program</th>
            <th className="py-3 px-3 font-semibold whitespace-nowrap">Region / Country</th>
            <th className="py-3 px-3 font-semibold whitespace-nowrap">Route</th>
            <th className="py-3 px-3 font-semibold whitespace-nowrap">Top Funding Route</th>
            <th className="py-3 px-3 font-semibold whitespace-nowrap">Ethiopian Access</th>
            <th className="py-3 px-3 font-semibold whitespace-nowrap">Application Timeline</th>
            <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E6DFD5]/70 dark:divide-[#334155]/70">
          {programs.map((p) => {
            const progFunding = funding.filter((f) => f.programId === p.id);
            const topFund = progFunding[0];

            // Coverage label
            const coverage = topFund
              ? topFund.coverage === 'FullRide'
                ? 'Full Ride'
                : topFund.coverage === 'FullTuitionPartialLiving'
                ? 'Full Tuition + Living'
                : topFund.coverage === 'FullTuitionOnly'
                ? 'Full Tuition'
                : topFund.coverage
              : 'None attached';

            // Stipend label
            const stipend =
              topFund?.monthlyStipend?.amount !== undefined && topFund.monthlyStipend.amount !== ''
                ? `${topFund.monthlyStipend.amount.toLocaleString()} ${topFund.monthlyStipend.currency}`
                : '';

            // Timeline start & deadline date
            let nextDeadline = 'Unpublished';
            let timelineStart = '';
            let intakeName = '';
            if (p.fallIntake.status === 'FixedDeadline' && p.fallIntake.deadlineDate) {
              nextDeadline = p.fallIntake.deadlineDate;
              timelineStart = p.fallIntake.startDate || '';
              intakeName = p.fallIntake.term || 'Fall';
            } else if (p.springIntake.status === 'FixedDeadline' && p.springIntake.deadlineDate) {
              nextDeadline = p.springIntake.deadlineDate;
              timelineStart = p.springIntake.startDate || '';
              intakeName = p.springIntake.term || 'Spring';
            } else if (p.fallIntake.status === 'Rolling' || p.springIntake.status === 'Rolling') {
              nextDeadline = 'Rolling';
              timelineStart = p.fallIntake.startDate || p.springIntake.startDate || '';
            }

            const isEligible = progFunding.some(
              (f) => f.ethiopianEligibility === 'OpenToEthiopian' || f.ethiopianEligibility === 'EthiopiaSpecific'
            );

            return (
              <tr
                key={p.id}
                onClick={() => onOpenDetails(p)}
                className="hover:bg-slate-50 dark:hover:bg-[#0F172A]/50 cursor-pointer transition-colors"
              >
                {/* Institution */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {p.university}
                  </div>
                  {p.isJointProgram && (
                    <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      Joint Consortium
                    </span>
                  )}
                </td>

                {/* Program */}
                <td className="py-2.5 px-3">
                  <div className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    {p.officialName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    {p.fields.slice(0, 2).join(', ')}
                  </div>
                </td>

                {/* Region & Country */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="text-slate-800 dark:text-slate-200">
                    {p.countries.join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {formatRegionDisplay(p.assignedRegions)}
                  </div>
                </td>

                {/* Degree Route */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {p.degreeRoute === 'Masters'
                      ? 'Master’s'
                      : p.degreeRoute === 'DirectPhD'
                      ? 'Direct PhD'
                      : p.degreeRoute === 'MastersRequiredPhD'
                      ? 'PhD (Requires Master’s)'
                      : p.degreeRoute === 'IntegratedMastersPhD'
                      ? 'Integrated M-PhD'
                      : p.directPhDEntry === 'Unclear'
                      ? 'Unclear (PhD Entry)'
                      : 'Unclear'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {p.mediumOfInstruction}
                  </div>
                </td>

                {/* Funding Route */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                    <Award className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{coverage}</span>
                  </div>
                  {stipend && (
                    <div className="text-[11px] font-mono text-slate-500">
                      {stipend}/mo
                    </div>
                  )}
                </td>

                {/* Ethiopian Access */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  {isEligible ? (
                    <span className="text-slate-900 dark:text-slate-100 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                      Open to Ethiopia
                    </span>
                  ) : topFund ? (
                    <span className="text-slate-500">
                      {topFund.ethiopianEligibility}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                {/* Application Timeline Window */}
                <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                  {nextDeadline !== 'Unpublished' && nextDeadline !== 'Rolling' ? (
                    <div>
                      {timelineStart ? (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {timelineStart} → {nextDeadline}
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {nextDeadline}
                        </span>
                      )}
                      {intakeName && (
                        <div className="text-[10px] text-slate-500 font-sans">{intakeName}</div>
                      )}
                    </div>
                  ) : timelineStart ? (
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Opens {timelineStart}
                      </span>
                      <div className="text-[10px] text-slate-500 font-sans">{nextDeadline}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400">{nextDeadline}</span>
                  )}
                </td>

                {/* Action */}
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline gap-0.5">
                    View
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

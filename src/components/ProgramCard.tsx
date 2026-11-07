import React from 'react';
import { ExternalLink, Calendar, ArrowRight, Award } from 'lucide-react';
import { Program, FundingOpportunity } from '../types';
import { formatRegionDisplay } from '../utils/regions';

interface ProgramCardProps {
  program: Program;
  fundingList: FundingOpportunity[];
  onOpenDetails: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  fundingList,
  onOpenDetails,
}) => {
  // Format degree route label
  const degreeRouteLabel =
    program.degreeRoute === 'Masters'
      ? 'Master’s'
      : program.degreeRoute === 'DirectPhD'
      ? 'Direct PhD'
      : program.degreeRoute === 'MastersRequiredPhD'
      ? 'PhD (Requires Master’s)'
      : program.degreeRoute === 'IntegratedMastersPhD'
      ? 'Integrated M-PhD'
      : program.directPhDEntry === 'Unclear'
      ? 'PhD (Entry Unverified)'
      : 'Unclear';

  // Primary funding headline
  const topFunding = fundingList[0];
  let fundingHeadline = 'No funding attached';
  if (topFunding) {
    const coverageLabel =
      topFunding.coverage === 'FullRide'
        ? 'Full Ride'
        : topFunding.coverage === 'FullTuitionPartialLiving'
        ? 'Full Tuition + Living'
        : topFunding.coverage === 'FullTuitionOnly'
        ? 'Full Tuition'
        : topFunding.coverage === 'StipendOnly'
        ? 'Stipend Only'
        : topFunding.coverage;

    const stipendLabel =
      topFunding.monthlyStipend.amount !== undefined && topFunding.monthlyStipend.amount !== ''
        ? `${topFunding.monthlyStipend.amount.toLocaleString()} ${topFunding.monthlyStipend.currency}/mo`
        : topFunding.monthlyStipend.isZeroConfirmed
        ? 'Zero Stipend'
        : '';

    fundingHeadline = stipendLabel ? `${coverageLabel} · ${stipendLabel}` : coverageLabel;
  }

  // Next upcoming deadline anchor & timeline
  let deadlineLabel = 'Timeline Unpublished';
  let deadlineDate = '';
  let timelineStart = '';
  let workflowBadge = '';

  if (program.fallIntake.status === 'FixedDeadline' && program.fallIntake.deadlineDate) {
    deadlineLabel = program.fallIntake.term || 'Fall Intake';
    deadlineDate = program.fallIntake.deadlineDate;
    timelineStart = program.fallIntake.startDate || '';
    if (topFunding?.fallFunding?.workflow === 'Automatic') {
      workflowBadge = 'Automatic with degree';
    } else if (topFunding?.fallFunding?.workflow === 'EarlierDeadline') {
      workflowBadge = 'Priority funding date';
    }
  } else if (program.springIntake.status === 'FixedDeadline' && program.springIntake.deadlineDate) {
    deadlineLabel = program.springIntake.term || 'Spring Intake';
    deadlineDate = program.springIntake.deadlineDate;
    timelineStart = program.springIntake.startDate || '';
    if (topFunding?.springFunding?.status === 'NotOffered') {
      workflowBadge = 'Spring: No funding';
    } else if (topFunding?.springFunding?.workflow === 'Automatic') {
      workflowBadge = 'Automatic with degree';
    }
  } else if (program.fallIntake.status === 'Rolling' || program.springIntake.status === 'Rolling') {
    deadlineLabel = 'Rolling Admission';
    timelineStart = program.fallIntake.startDate || program.springIntake.startDate || '';
  }

  // Ethiopian eligibility check
  const isEthiopianEligible = fundingList.some(
    (f) =>
      f.ethiopianEligibility === 'OpenToEthiopian' ||
      f.ethiopianEligibility === 'EthiopiaSpecific'
  );

  return (
    <article
      onClick={() => onOpenDetails(program)}
      className="group cursor-pointer bg-white dark:bg-[#1E293B] border
        border-[#E6DFD5] dark:border-[#334155] rounded-xl p-4 sm:p-5 hover:border-slate-400
        dark:hover:border-slate-500 transition-all shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Region & Institution */}
        <div className="flex items-start justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {program.university}
            </span>
            <span aria-hidden="true">·</span>
            <span>{program.countries.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-400">
              Region: {formatRegionDisplay(program.assignedRegions)}
            </span>
            {program.isJointProgram && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Joint</span>
              </>
            )}
          </div>

          <a
            href={program.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            title="Official Program Link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Program Title */}
        <h3
          className="mt-2 text-base font-bold text-slate-900 dark:text-white
            group-hover:text-blue-600 dark:group-hover:text-blue-400
            transition-colors leading-snug"
        >
          {program.officialName}
        </h3>

        {/* Quick Academic Tags (Unboxed text) */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {degreeRouteLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span>{program.mediumOfInstruction}</span>
          {program.fields.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>{program.fields.slice(0, 2).join(', ')}</span>
            </>
          )}
        </div>

        {/* Funding Summary Pill */}
        <div
          className="mt-3.5 pt-3 border-t border-[#E6DFD5]/70
            dark:border-[#334155]/70 flex items-center justify-between text-xs gap-2"
        >
          <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 truncate">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{fundingHeadline}</span>
          </div>

          {isEthiopianEligible && (
            <span
              className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded
                bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200
                border border-slate-200/80 dark:border-slate-700/80"
            >
              Ethiopia: Eligible
            </span>
          )}
        </div>
      </div>

      {/* Footer: Next Deadline & Open Action */}
      <div
        className="mt-3.5 pt-3 border-t border-[#E6DFD5]/70
          dark:border-[#334155]/70 flex flex-wrap items-center justify-between gap-2 text-xs
          text-slate-500 dark:text-slate-400"
      >
        <div className="flex items-center gap-1.5 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {deadlineDate ? (
              <>
                {timelineStart ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {timelineStart} → {deadlineDate}
                  </span>
                ) : (
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Deadline: {deadlineDate}
                  </span>
                )}
                {workflowBadge && (
                  <span className="text-[11px] text-slate-500 font-sans ml-1.5">
                    ({workflowBadge})
                  </span>
                )}
              </>
            ) : timelineStart ? (
              <span>Opens {timelineStart} ({deadlineLabel})</span>
            ) : (
              deadlineLabel
            )}
          </span>
        </div>

        <span
          className="text-blue-600 dark:text-blue-400 font-medium
            group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs"
        >
          Details
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};

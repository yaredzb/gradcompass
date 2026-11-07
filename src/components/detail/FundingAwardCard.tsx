import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle2, ShieldCheck, Banknote, HelpCircle } from 'lucide-react';
import { FundingOpportunity, Program, FundingIntakeCycle, IntakeInfo } from '../../types';
import { formatFundingCoverage, formatMonthlyStipend } from './formatters';
import { DetailField, MoreDetails, SourceLink, formatDate, readableLabel } from './DetailPrimitives';
import { ConfirmModal } from '../ConfirmModal';

interface FundingAwardCardProps {
  fund: FundingOpportunity;
  program: Program;
  onEditFunding: (fund: FundingOpportunity) => void;
  onDeleteFunding: (id: string) => void | Promise<void>;
}

function FundingCycle({
  cycle,
  intake,
  fallback,
}: {
  cycle?: FundingIntakeCycle;
  intake?: IntakeInfo;
  fallback: string;
}) {
  const available = cycle?.status === 'Offered' || cycle?.status === 'Rolling';
  let workflow = 'Application process not confirmed.';
  let deadline: string | undefined;

  if (cycle?.workflow === 'Automatic') {
    workflow = 'Considered automatically with graduate degree application.';
    deadline = intake?.deadlineDate || intake?.endDate;
  } else if (cycle?.workflow === 'Separate') {
    workflow = 'Requires a separate scholarship application.';
    deadline = cycle.scholarshipDeadlineDate;
  } else if (cycle?.workflow === 'EarlierDeadline') {
    workflow = 'Earlier priority funding deadline applies.';
    deadline = cycle.earlierDeadlineDate;
  } else if (cycle?.workflow === 'DirectPosition') {
    workflow = 'Apply directly to open research/teaching position.';
    deadline = cycle.directPositionDeadlineDate;
  }

  return (
    <div className={`detail-funding-cycle-card ${!available ? 'opacity-65' : ''}`}>
      <div className="detail-cycle-header">
        <h4 className="detail-cycle-term">{cycle?.term || fallback}</h4>
        <span
          className={`detail-status-pill ${
            available
              ? 'detail-status-active'
              : cycle?.status === 'NotOffered'
              ? 'detail-status-muted'
              : 'detail-status-slate'
          }`}
        >
          {readableLabel(cycle?.status)}
        </span>
      </div>

      {available && (
        <>
          <p className="detail-cycle-workflow">{workflow}</p>
          <p className="detail-cycle-deadline">
            {deadline
              ? 'Deadline: ' + formatDate(deadline)
              : cycle?.status === 'Rolling'
              ? 'Rolling applications'
              : 'Deadline not published'}
          </p>
        </>
      )}

      {available && cycle?.workflow === 'DirectPosition' && (
        <SourceLink href={cycle.directPositionLink}>Position listing</SourceLink>
      )}
      {cycle?.workflowNotes && <p className="detail-note">{cycle.workflowNotes}</p>}
    </div>
  );
}

export const FundingAwardCard: React.FC<FundingAwardCardProps> = ({
  fund,
  program,
  onEditFunding,
  onDeleteFunding,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const competitiveness = fund.competitiveness;
  const isEligible =
    fund.ethiopianEligibility === 'OpenToEthiopian' ||
    fund.ethiopianEligibility === 'EthiopiaSpecific';

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteFunding(fund.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      setIsDeleteModalOpen(false);
      setDeleteError(error instanceof Error ? error.message : 'Could not delete award.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="detail-award-card">
      {deleteError && <p role="alert" className="p-3 text-sm text-red-700 dark:text-red-200">{deleteError}</p>}
      <div className="detail-award-top">
        <div className="detail-award-header-info">
          <div className="detail-award-tags">
            <span className="detail-award-type-badge">
              {readableLabel(fund.fundingType)}
            </span>

            {isEligible ? (
              <span className="detail-pill detail-pill-slate">
                <CheckCircle2 size={13} aria-hidden="true" />
                <span>{readableLabel(fund.ethiopianEligibility)}</span>
              </span>
            ) : fund.ethiopianEligibility === 'Ineligible' ? (
              <span className="detail-pill detail-pill-red">
                <span>Ethiopian applicants ineligible</span>
              </span>
            ) : (
              <span className="detail-pill detail-pill-slate">
                <HelpCircle size={13} aria-hidden="true" />
                <span>Eligibility unverified</span>
              </span>
            )}
          </div>

          <h3 className="detail-award-title">{fund.officialName}</h3>
        </div>

        <div className="detail-actions">
          <button
            className="detail-icon-button"
            onClick={() => onEditFunding(fund)}
            title="Edit award"
            aria-label={'Edit ' + fund.officialName}
          >
            <Edit2 size={14} />
          </button>
          <button
            className="detail-icon-button hover:text-red-600 dark:hover:text-red-400"
            onClick={() => setIsDeleteModalOpen(true)}
            title="Delete award"
            aria-label={'Delete ' + fund.officialName}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Award?"
        message={`Are you sure you want to delete "${fund.officialName}"?`}
        confirmLabel="Move to Trash"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        onCancel={() => { if (!isDeleting) setIsDeleteModalOpen(false); }}
      />

      {/* Hero Stipend & Coverage Banner */}
      <div className="detail-award-metrics-banner">
        <div className="detail-metric-box">
          <span className="detail-metric-label">Monthly Living Stipend</span>
          <div className="detail-metric-value-row">
            <Banknote size={17} className="text-slate-400 shrink-0" aria-hidden="true" />
            <span className="detail-stipend font-mono">
              {formatMonthlyStipend(fund)}
            </span>
          </div>
          {fund.monthlyStipend?.amount && fund.monthlyStipend?.currency && (
            <p className="detail-metric-subtext font-mono">
              ≈ {(Number(fund.monthlyStipend.amount) * 12).toLocaleString()}{' '}
              {fund.monthlyStipend.currency} annual baseline
            </p>
          )}
        </div>

        <div className="detail-metric-box">
          <span className="detail-metric-label">Tuition & Living Coverage</span>
          <div className="detail-metric-value-row">
            <ShieldCheck size={17} className="text-slate-400 shrink-0" aria-hidden="true" />
            <span className="detail-coverage-text">
              {formatFundingCoverage(fund.coverage)}
            </span>
          </div>
          <p className="detail-metric-subtext">
            {fund.coverage === 'FullRide'
              ? 'Complete tuition remission plus regular living maintenance allowance.'
              : fund.coverage === 'FullTuitionPartialLiving'
              ? '100% tuition remission with partial living support.'
              : fund.coverage === 'FullTuitionOnly'
              ? 'Full tuition waiver without monthly stipend.'
              : 'Direct funding award.'}
          </p>
        </div>
      </div>

      {/* Intakes & Workflow Section */}
      <div className="detail-workflows-section">
        <span className="detail-workflows-heading">Application Process by Intake</span>
        <div className="detail-funding-cycles-grid">
          <FundingCycle
            cycle={fund.fallFunding}
            intake={program.fallIntake}
            fallback="Fall intake"
          />
          <FundingCycle
            cycle={fund.springFunding}
            intake={program.springIntake}
            fallback="Spring intake"
          />
        </div>
      </div>

      {/* Collapsible Terms & Extra Notes */}
      {(fund.intakeNotes ||
        fund.visaAndWorkNotes ||
        competitiveness?.awardRateOrRatio ||
        competitiveness?.sourceLink ||
        competitiveness?.sourceYear ||
        fund.informationLastChecked) && (
        <MoreDetails title="Award terms, competitiveness & visa notes">
          <dl className="detail-stack">
            {fund.intakeNotes && (
              <DetailField label="Terms & duration">{fund.intakeNotes}</DetailField>
            )}
            {competitiveness?.awardRateOrRatio && (
              <DetailField label="Competitiveness">
                {competitiveness.awardRateOrRatio}
                {competitiveness.sourceYear && ' (' + competitiveness.sourceYear + ')'}
              </DetailField>
            )}
            {fund.visaAndWorkNotes && (
              <DetailField label="Visa & work permissions">
                {fund.visaAndWorkNotes}
              </DetailField>
            )}
          </dl>
          <SourceLink href={competitiveness?.sourceLink}>Award statistics</SourceLink>
        </MoreDetails>
      )}

      <div className="detail-award-footer">
        <SourceLink href={fund.officialLink}>Official award page</SourceLink>
      </div>
    </article>
  );
};

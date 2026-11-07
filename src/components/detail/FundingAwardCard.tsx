import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { FundingOpportunity, Program, FundingIntakeCycle, IntakeInfo } from '../../types';
import { formatFundingCoverage, formatMonthlyStipend } from './formatters';
import { DetailField, MoreDetails, SourceLink, formatDate, readableLabel } from './DetailPrimitives';

interface FundingAwardCardProps {
  fund: FundingOpportunity;
  program: Program;
  onEditFunding: (fund: FundingOpportunity) => void;
  onDeleteFunding: (id: string) => void;
}

function FundingCycle({ cycle, intake, fallback }: { cycle?: FundingIntakeCycle; intake?: IntakeInfo; fallback: string }) {
  const available = cycle?.status === 'Offered' || cycle?.status === 'Rolling';
  let workflow = 'Application process not confirmed.';
  let deadline: string | undefined;
  if (cycle?.workflow === 'Automatic') {
    workflow = 'Considered with degree application.';
    deadline = intake?.deadlineDate || intake?.endDate;
  } else if (cycle?.workflow === 'Separate') {
    workflow = 'Separate scholarship application.';
    deadline = cycle.scholarshipDeadlineDate;
  } else if (cycle?.workflow === 'EarlierDeadline') {
    workflow = 'Earlier funding deadline.';
    deadline = cycle.earlierDeadlineDate;
  } else if (cycle?.workflow === 'DirectPosition') {
    workflow = 'Apply directly to the position.';
    deadline = cycle.directPositionDeadlineDate;
  }
  return <div className="detail-funding-cycle">
    <div className="detail-intake-heading"><h4>{cycle?.term || fallback}</h4><span>{readableLabel(cycle?.status)}</span></div>
    {available && <><p>{workflow}</p><p className="detail-note">{deadline ? 'Deadline: ' + formatDate(deadline) : cycle?.status === 'Rolling' ? 'Rolling applications' : 'Deadline not published'}</p></>}
    {available && cycle?.workflow === 'DirectPosition' && <SourceLink href={cycle.directPositionLink}>Position listing</SourceLink>}
    {cycle?.workflowNotes && <p className="detail-note">{cycle.workflowNotes}</p>}
  </div>;
}

export const FundingAwardCard: React.FC<FundingAwardCardProps> = ({ fund, program, onEditFunding, onDeleteFunding }) => {
  const competitiveness = fund.competitiveness;
  return <article className="detail-award">
    <div className="detail-award-heading">
      <div><p className="detail-eyebrow">{readableLabel(fund.fundingType)}</p><h3>{fund.officialName}</h3></div>
      <div className="detail-actions">
        <button className="detail-icon-button" onClick={() => onEditFunding(fund)} title="Edit award" aria-label={'Edit ' + fund.officialName}><Edit2 size={14} /></button>
        <button className="detail-icon-button" onClick={() => { if (window.confirm('Delete funding award "' + fund.officialName + '"?')) onDeleteFunding(fund.id); }} title="Delete award" aria-label={'Delete ' + fund.officialName}><Trash2 size={14} /></button>
      </div>
    </div>
    <dl className="detail-facts-grid">
      <DetailField label="Coverage">{formatFundingCoverage(fund.coverage)}</DetailField>
      <DetailField label="Monthly stipend"><span className="detail-stipend">{formatMonthlyStipend(fund)}</span></DetailField>
      <DetailField label="Applicant eligibility">{readableLabel(fund.ethiopianEligibility)}</DetailField>
    </dl>
    <SourceLink href={fund.officialLink}>Official award page</SourceLink>
    <MoreDetails title="Intakes & application process">
      <div className="detail-funding-cycles">
        <FundingCycle cycle={fund.fallFunding} intake={program.fallIntake} fallback="Fall intake" />
        <FundingCycle cycle={fund.springFunding} intake={program.springIntake} fallback="Spring intake" />
      </div>
    </MoreDetails>
    {(fund.intakeNotes || fund.visaAndWorkNotes || competitiveness?.awardRateOrRatio || competitiveness?.sourceLink || competitiveness?.sourceYear || fund.informationLastChecked) && <MoreDetails title="Award terms & additional information">
      <dl className="detail-stack">
        {fund.intakeNotes && <DetailField label="Terms & duration">{fund.intakeNotes}</DetailField>}
        {competitiveness?.awardRateOrRatio && <DetailField label="Competitiveness">{competitiveness.awardRateOrRatio}{competitiveness.sourceYear && ' (' + competitiveness.sourceYear + ')'}</DetailField>}
        {fund.visaAndWorkNotes && <DetailField label="Visa & work">{fund.visaAndWorkNotes}</DetailField>}
        {fund.informationLastChecked && <DetailField label="Last checked">{formatDate(fund.informationLastChecked)}</DetailField>}
      </dl>
      <SourceLink href={competitiveness?.sourceLink}>Award statistics</SourceLink>
    </MoreDetails>}
  </article>;
};


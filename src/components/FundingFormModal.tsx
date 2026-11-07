import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  FundingOpportunity,
  Program,
  FundingType,
  FundingCoverage,
  EthiopianEligibility,
  FundingIntakeStatus,
  ScholarshipWorkflow,
} from '../types';
import { AwardDetailsSection } from './funding-form/AwardDetailsSection';
import { StipendSection } from './funding-form/StipendSection';
import { FundingCycleSection } from './funding-form/FundingCycleSection';
import { AwardNotesSection } from './funding-form/AwardNotesSection';

export interface FundingFormModalProps {
  program: Program;
  initialFunding?: FundingOpportunity | null;
  onSave: (funding: FundingOpportunity) => void;
  onClose: () => void;
}

export const FundingFormModal: React.FC<FundingFormModalProps> = ({
  program,
  initialFunding,
  onSave,
  onClose,
}) => {
  const isEditing = !!initialFunding;

  // Award Details
  const [officialName, setOfficialName] = useState(
    initialFunding?.officialName || ''
  );
  const [officialLink, setOfficialLink] = useState(
    initialFunding?.officialLink || program.officialLink || ''
  );
  const [fundingType, setFundingType] = useState<FundingType>(
    initialFunding?.fundingType || 'Scholarship'
  );
  const [coverage, setCoverage] = useState<FundingCoverage>(
    initialFunding?.coverage || 'FullRide'
  );
  const [ethiopianEligibility, setEthiopianEligibility] =
    useState<EthiopianEligibility>(
      initialFunding?.ethiopianEligibility || 'OpenToEthiopian'
    );

  // Stipend
  const [stipendAmount, setStipendAmount] = useState<number | ''>(
    initialFunding?.monthlyStipend?.amount ?? ''
  );
  const [stipendCurrency, setStipendCurrency] = useState(
    initialFunding?.monthlyStipend?.currency || 'EUR'
  );
  const [grossOrNet, setGrossOrNet] = useState<'Gross' | 'Net' | 'Unspecified'>(
    initialFunding?.monthlyStipend?.grossOrNet || 'Net'
  );
  const [isZeroConfirmed, setIsZeroConfirmed] = useState(
    initialFunding?.monthlyStipend?.isZeroConfirmed || false
  );
  const [isUnpublished, setIsUnpublished] = useState(
    initialFunding?.monthlyStipend?.isUnpublished || false
  );

  // Fall Funding
  const [fallTerm] = useState(
    initialFunding?.fallFunding?.term || program.fallIntake.term || 'Fall 2027'
  );
  const [fallStatus, setFallStatus] = useState<FundingIntakeStatus>(
    initialFunding?.fallFunding?.status ||
      (program.fallIntake.status !== 'NotOffered' ? 'Offered' : 'NotOffered')
  );
  const [fallWorkflow, setFallWorkflow] = useState<ScholarshipWorkflow>(
    initialFunding?.fallFunding?.workflow || 'Automatic'
  );
  const [fallScholarshipDeadlineDate, setFallScholarshipDeadlineDate] = useState(
    initialFunding?.fallFunding?.scholarshipDeadlineDate || ''
  );
  const [fallEarlierDeadlineDate, setFallEarlierDeadlineDate] = useState(
    initialFunding?.fallFunding?.earlierDeadlineDate || ''
  );
  const [fallDirectPositionLink, setFallDirectPositionLink] = useState(
    initialFunding?.fallFunding?.directPositionLink || ''
  );
  const [fallDirectPositionDeadlineDate, setFallDirectPositionDeadlineDate] =
    useState(initialFunding?.fallFunding?.directPositionDeadlineDate || '');
  const [fallWorkflowNotes, setFallWorkflowNotes] = useState(
    initialFunding?.fallFunding?.workflowNotes || ''
  );

  // Spring Funding
  const [springTerm] = useState(
    initialFunding?.springFunding?.term ||
      program.springIntake.term ||
      'Spring 2028'
  );
  const [springStatus, setSpringStatus] = useState<FundingIntakeStatus>(
    initialFunding?.springFunding?.status ||
      (program.springIntake.status === 'NotOffered' ? 'NotOffered' : 'Offered')
  );
  const [springWorkflow, setSpringWorkflow] = useState<ScholarshipWorkflow>(
    initialFunding?.springFunding?.workflow || 'Automatic'
  );
  const [springScholarshipDeadlineDate, setSpringScholarshipDeadlineDate] =
    useState(initialFunding?.springFunding?.scholarshipDeadlineDate || '');
  const [springEarlierDeadlineDate, setSpringEarlierDeadlineDate] = useState(
    initialFunding?.springFunding?.earlierDeadlineDate || ''
  );
  const [springDirectPositionLink, setSpringDirectPositionLink] = useState(
    initialFunding?.springFunding?.directPositionLink || ''
  );
  const [springDirectPositionDeadlineDate, setSpringDirectPositionDeadlineDate] =
    useState(initialFunding?.springFunding?.directPositionDeadlineDate || '');
  const [springWorkflowNotes, setSpringWorkflowNotes] = useState(
    initialFunding?.springFunding?.workflowNotes || ''
  );

  // Notes & Competitiveness
  const [intakeNotes, setIntakeNotes] = useState(
    initialFunding?.intakeNotes || ''
  );
  const [competitivenessRate, setCompetitivenessRate] = useState(
    initialFunding?.competitiveness?.awardRateOrRatio || ''
  );
  const [competitivenessYear, setCompetitivenessYear] = useState(
    initialFunding?.competitiveness?.sourceYear || '2026'
  );
  const [competitivenessLink, setCompetitivenessLink] = useState(
    initialFunding?.competitiveness?.sourceLink || ''
  );
  const [visaAndWorkNotes, setVisaAndWorkNotes] = useState(
    initialFunding?.visaAndWorkNotes || ''
  );
  const [informationLastChecked, setInformationLastChecked] = useState(
    initialFunding?.informationLastChecked ||
      new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!officialName.trim()) {
      alert('Please enter the official scholarship or funding name.');
      return;
    }

    const funding: FundingOpportunity = {
      id: initialFunding?.id || `funding-${Date.now()}`,
      programId: program.id,
      officialName: officialName.trim(),
      officialLink: officialLink.trim() || 'https://example.org',
      fundingType,
      coverage,
      ethiopianEligibility,
      monthlyStipend: {
        amount: isZeroConfirmed ? 0 : isUnpublished ? undefined : stipendAmount,
        currency: stipendCurrency.trim().toUpperCase() || 'USD',
        grossOrNet,
        isZeroConfirmed,
        isUnpublished,
      },
      fallFunding: {
        term: fallTerm.trim(),
        status: fallStatus,
        workflow: fallWorkflow,
        scholarshipDeadlineDate:
          fallWorkflow === 'Separate' ? fallScholarshipDeadlineDate : undefined,
        earlierDeadlineDate:
          fallWorkflow === 'EarlierDeadline'
            ? fallEarlierDeadlineDate
            : undefined,
        directPositionLink:
          fallWorkflow === 'DirectPosition'
            ? fallDirectPositionLink.trim()
            : undefined,
        directPositionDeadlineDate:
          fallWorkflow === 'DirectPosition'
            ? fallDirectPositionDeadlineDate
            : undefined,
        workflowNotes: fallWorkflowNotes.trim(),
      },
      springFunding: {
        term: springTerm.trim(),
        status: springStatus,
        workflow: springWorkflow,
        scholarshipDeadlineDate:
          springWorkflow === 'Separate'
            ? springScholarshipDeadlineDate
            : undefined,
        earlierDeadlineDate:
          springWorkflow === 'EarlierDeadline'
            ? springEarlierDeadlineDate
            : undefined,
        directPositionLink:
          springWorkflow === 'DirectPosition'
            ? springDirectPositionLink.trim()
            : undefined,
        directPositionDeadlineDate:
          springWorkflow === 'DirectPosition'
            ? springDirectPositionDeadlineDate
            : undefined,
        workflowNotes: springWorkflowNotes.trim(),
      },
      intakeNotes: intakeNotes.trim(),
      competitiveness: {
        awardRateOrRatio: competitivenessRate.trim(),
        sourceYear: competitivenessYear.trim(),
        sourceLink: competitivenessLink.trim(),
      },
      visaAndWorkNotes: visaAndWorkNotes.trim(),
      informationLastChecked:
        informationLastChecked || new Date().toISOString().split('T')[0],
      createdAt: initialFunding?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(funding);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2
        sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-white
          dark:bg-[#1E293B] rounded-xl border border-[#E6DFD5]
          dark:border-[#334155] shadow-xl flex flex-col overflow-hidden my-auto"
      >
        {/* Header */}
        <div
          className="p-4 sm:p-6 border-b border-[#E6DFD5] dark:border-[#334155]
            flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Connected to: {program.officialName}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {isEditing
                ? 'Edit Funding Opportunity'
                : 'Add Scholarship or Funding Opportunity'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900
              dark:hover:text-white hover:bg-[#F4EFE6] dark:hover:bg-[#0F172A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm"
        >
          {/* Section 1: Basic Funding Identification */}
          <AwardDetailsSection
            officialName={officialName}
            setOfficialName={setOfficialName}
            officialLink={officialLink}
            setOfficialLink={setOfficialLink}
            fundingType={fundingType}
            setFundingType={setFundingType}
            coverage={coverage}
            setCoverage={setCoverage}
            ethiopianEligibility={ethiopianEligibility}
            setEthiopianEligibility={setEthiopianEligibility}
          />

          {/* Section 2: Monthly Stipend / Salary */}
          <StipendSection
            stipendAmount={stipendAmount}
            setStipendAmount={setStipendAmount}
            stipendCurrency={stipendCurrency}
            setStipendCurrency={setStipendCurrency}
            grossOrNet={grossOrNet}
            setGrossOrNet={setGrossOrNet}
            isZeroConfirmed={isZeroConfirmed}
            setIsZeroConfirmed={setIsZeroConfirmed}
            isUnpublished={isUnpublished}
            setIsUnpublished={setIsUnpublished}
          />

          {/* Section 3: Fall Application Workflow */}
          <FundingCycleSection
            title="Fall Funding Application Model"
            seasonName="Fall"
            programDeadlineDate={program.fallIntake?.deadlineDate}
            status={fallStatus}
            setStatus={setFallStatus}
            workflow={fallWorkflow}
            setWorkflow={setFallWorkflow}
            scholarshipDeadlineDate={fallScholarshipDeadlineDate}
            setScholarshipDeadlineDate={setFallScholarshipDeadlineDate}
            earlierDeadlineDate={fallEarlierDeadlineDate}
            setEarlierDeadlineDate={setFallEarlierDeadlineDate}
            directPositionLink={fallDirectPositionLink}
            setDirectPositionLink={setFallDirectPositionLink}
            directPositionDeadlineDate={fallDirectPositionDeadlineDate}
            setDirectPositionDeadlineDate={setFallDirectPositionDeadlineDate}
            workflowNotes={fallWorkflowNotes}
            setWorkflowNotes={setFallWorkflowNotes}
          />

          {/* Section 4: Spring Application Workflow */}
          <FundingCycleSection
            title="Spring Funding Application Model"
            seasonName="Spring"
            programDeadlineDate={program.springIntake?.deadlineDate}
            status={springStatus}
            setStatus={setSpringStatus}
            workflow={springWorkflow}
            setWorkflow={setSpringWorkflow}
            scholarshipDeadlineDate={springScholarshipDeadlineDate}
            setScholarshipDeadlineDate={setSpringScholarshipDeadlineDate}
            earlierDeadlineDate={springEarlierDeadlineDate}
            setEarlierDeadlineDate={setSpringEarlierDeadlineDate}
            directPositionLink={springDirectPositionLink}
            setDirectPositionLink={setSpringDirectPositionLink}
            directPositionDeadlineDate={springDirectPositionDeadlineDate}
            setDirectPositionDeadlineDate={setSpringDirectPositionDeadlineDate}
            workflowNotes={springWorkflowNotes}
            setWorkflowNotes={setSpringWorkflowNotes}
          />

          {/* Section 5: Notes & Selectivity */}
          <AwardNotesSection
            intakeNotes={intakeNotes}
            setIntakeNotes={setIntakeNotes}
            competitivenessRate={competitivenessRate}
            setCompetitivenessRate={setCompetitivenessRate}
            competitivenessYear={competitivenessYear}
            setCompetitivenessYear={setCompetitivenessYear}
            competitivenessLink={competitivenessLink}
            setCompetitivenessLink={setCompetitivenessLink}
            visaAndWorkNotes={visaAndWorkNotes}
            setVisaAndWorkNotes={setVisaAndWorkNotes}
            informationLastChecked={informationLastChecked}
            setInformationLastChecked={setInformationLastChecked}
          />

          {/* Footer Submit Buttons */}
          <div
            className="pt-4 border-t border-[#E6DFD5] dark:border-[#334155]
              flex items-center justify-end gap-3"
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg
                border border-[#E6DFD5] dark:border-[#334155] hover:bg-[#F4EFE6]
                dark:hover:bg-[#0F172A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg
                bg-slate-900 dark:bg-white text-white dark:text-slate-900
                hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Save Changes' : 'Record Award'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

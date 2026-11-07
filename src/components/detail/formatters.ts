import { Program, FundingOpportunity } from '../../types';

export const getDegreeRouteLabel = (program: Program): string => {
  if (program.degreeRoute === 'Masters') {
    return 'Master’s Degree';
  }
  if (program.degreeRoute === 'DirectPhD') {
    return 'Direct PhD from Bachelor’s';
  }
  if (program.degreeRoute === 'MastersRequiredPhD') {
    return 'PhD (Requires Completed Master’s)';
  }
  if (program.degreeRoute === 'IntegratedMastersPhD') {
    return 'Integrated Master’s–PhD';
  }
  if (program.degreeRoute === 'Unclear') {
    return program.directPhDEntry === 'Unclear'
      ? 'PhD (Entry Route Unverified)'
      : 'Degree Route Unspecified';
  }
  return 'Degree Route Unspecified';
};

export const formatProgramStructure = (structure: string): string => {
  switch (structure) {
    case 'CourseworkPlusThesis':
      return 'Coursework + Master’s Thesis';
    case 'PhDCourseworkDissertation':
      return 'Doctoral Coursework + Dissertation';
    case 'TaughtCourseworkOnly':
      return 'Taught Coursework (No Thesis)';
    case 'CourseworkPlusCapstone':
      return 'Coursework + Capstone Project';
    case 'ResearchMastersByThesis':
      return 'Research Master’s by Thesis';
    case 'PhDByDissertation':
      return 'PhD by Dissertation';
    case 'Other':
      return 'Alternative Academic Structure';
    default:
      return structure || 'Not specified';
  }
};

export const formatFundingCoverage = (coverage: string): string => {
  switch (coverage) {
    case 'FullRide':
      return 'Full Ride (Tuition + Living)';
    case 'FullTuitionPartialLiving':
      return 'Full Tuition + Partial Living';
    case 'FullTuitionOnly':
      return 'Full Tuition Waiver';
    case 'PartialTuition':
      return 'Partial Tuition Waiver';
    case 'StipendOnly':
      return 'Living Stipend Only';
    default:
      return coverage;
  }
};

export const formatMonthlyStipend = (fund: FundingOpportunity): string => {
  if (!fund?.monthlyStipend) {
    return 'Stipend Not Specified';
  }
  const {
    amount,
    currency,
    grossOrNet,
    isZeroConfirmed,
    isUnpublished,
  } = fund.monthlyStipend;

  if (amount !== undefined && amount !== '') {
    const grossNet =
      grossOrNet && grossOrNet !== 'Unspecified' ? ` ${grossOrNet}` : '';
    return `${Number(amount).toLocaleString()} ${currency || ''}/mo${grossNet}`;
  }
  if (isZeroConfirmed) {
    return 'Confirmed Zero Stipend';
  }
  if (isUnpublished) {
    return 'Stipend Unpublished';
  }
  return 'Stipend Not Specified';
};


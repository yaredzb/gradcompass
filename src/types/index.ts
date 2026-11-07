export type DegreeRoute =
  | 'Masters'
  | 'DirectPhD'
  | 'IntegratedMastersPhD'
  | 'MastersRequiredPhD'
  | 'Unclear';

export type DirectPhDEntry =
  | 'DirectFromBachelors'
  | 'MasterRequired'
  | 'Unclear';

export type ProgramStructure =
  | 'TaughtCourseworkOnly'
  | 'CourseworkPlusCapstone'
  | 'CourseworkPlusThesis'
  | 'ResearchMastersByThesis'
  | 'PhDByDissertation'
  | 'PhDCourseworkDissertation'
  | 'Other'
  | 'Unclear';

export type CanApplyBeforeGraduation =
  | 'Yes'
  | 'Conditional'
  | 'No'
  | 'Unclear';

export type MediumOfInstruction =
  | 'English'
  | 'LocalLanguage'
  | 'Mixed'
  | 'Other'
  | 'Unclear';

export type EnglishPolicy =
  | 'NotRequired'
  | 'WaivedByMOI'
  | 'StrictlyRequired';

export type IntakeStatus =
  | 'FixedDeadline'
  | 'Rolling'
  | 'Unpublished'
  | 'Unknown'
  | 'NotOffered';

export interface IntakeInfo {
  term: string; // e.g. "Fall 2027", "Spring 2028"
  status: IntakeStatus;
  startDate?: string; // ISO "YYYY-MM-DD" application window opens
  deadlineDate?: string; // ISO "YYYY-MM-DD" application deadline / cutoff
  endDate?: string; // Alias to deadlineDate
  notes?: string;
}

export interface CampusCityCost {
  city: string;
  minMonthlyCost?: number | '';
  typicalMonthlyCost?: number | '';
  currency?: string;
  sourceLink?: string;
}

export interface ProofOfFunds {
  required: 'Yes' | 'No' | 'Unclear';
  amount?: number | '';
  currency?: string;
  notes?: string; // e.g. "Blocked account (Sperrkonto) must be opened before visa interview"
}

export interface Program {
  id: string;
  officialName: string;
  university: string; // Institution or consortium name
  universities?: string[]; // Participating institutions; legacy records may omit this
  consortiumName?: string;
  isJointProgram: boolean;
  countries: string[]; // Support multiple for joint programs
  assignedRegions: string[]; // e.g. ["Europe", "Nordic countries"] or ["GCC"]
  campusCities: CampusCityCost[];
  proofOfFunds?: ProofOfFunds;
  officialLink: string;
  fields: string[]; // "Electrical Engineering", "Computer Engineering", "AI", etc.
  degreeRoute: DegreeRoute;
  directPhDEntry?: DirectPhDEntry;
  programStructure: ProgramStructure;
  applyBeforeGraduation: CanApplyBeforeGraduation;
  applyBeforeGraduationNotes?: string;
  minimumGrades?: string;
  gradingScale?: string;
  academicPrerequisites?: string;
  keyRequirements?: string;
  mediumOfInstruction: MediumOfInstruction;
  instructionLanguageDetails?: string;
  englishProficiency: {
    policy?: EnglishPolicy;
    testRequired?: boolean;
    acceptedTests: string[];
    minimumScores?: string;
    waivers?: string;
  };
  selectionSteps: string[];
  admissionCompetitiveness?: {
    metricDetails?: string;
    sourceYear?: string;
    sourceLink?: string;
  };
  fallIntake: IntakeInfo;
  springIntake: IntakeInfo;
  informationLastChecked: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export type FundingType =
  | 'Scholarship'
  | 'SalariedPhD'
  | 'ResearchAssistantship'
  | 'TeachingAssistantship'
  | 'TuitionWaiver'
  | 'Other'
  | 'Unclear';

export type FundingCoverage =
  | 'FullRide'
  | 'FullTuitionPartialLiving'
  | 'FullTuitionOnly'
  | 'PartialTuition'
  | 'StipendOnly'
  | 'Other'
  | 'Unclear';

export type EthiopianEligibility =
  | 'EthiopiaSpecific'
  | 'OpenToEthiopian'
  | 'Ineligible'
  | 'Unclear';

export type ScholarshipWorkflow =
  | 'Automatic'
  | 'Separate'
  | 'EarlierDeadline'
  | 'DirectPosition'
  | 'Unclear';

export type FundingIntakeStatus =
  | 'Offered'
  | 'Rolling'
  | 'NotOffered'
  | 'Unknown';

export interface FundingIntakeCycle {
  term: string; // e.g. "Fall 2027"
  status: FundingIntakeStatus;
  workflow: ScholarshipWorkflow;
  scholarshipDeadlineDate?: string;
  earlierDeadlineDate?: string;
  directPositionLink?: string;
  directPositionDeadlineDate?: string;
  workflowNotes?: string;
}

export interface FundingOpportunity {
  id: string;
  programId: string;
  officialName: string;
  officialLink: string;
  fundingType: FundingType;
  coverage: FundingCoverage;
  ethiopianEligibility: EthiopianEligibility;
  monthlyStipend: {
    amount?: number | '';
    isZeroConfirmed: boolean;
    currency: string;
    grossOrNet: 'Gross' | 'Net' | 'Unspecified';
    isUnpublished: boolean;
  };
  fallFunding: FundingIntakeCycle;
  springFunding: FundingIntakeCycle;
  intakeNotes?: string;
  competitiveness?: {
    awardRateOrRatio?: string;
    sourceYear?: string;
    sourceLink?: string;
  };
  visaAndWorkNotes?: string;
  informationLastChecked: string;
  createdAt: string;
  updatedAt: string;
}

export type PrimaryRegion =
  | 'GCC'
  | 'Europe'
  | 'Asia'
  | 'USA'
  | 'Canada'
  | 'Oceania'
  | 'Other regions';

export interface RegionMappingResult {
  primaryRegion: PrimaryRegion;
  isNordic: boolean;
  displayGroups: string[]; // e.g. ["Europe", "Nordic countries"] or ["GCC"]
}

import React from 'react';
import {
  FundingType,
  FundingCoverage,
  EthiopianEligibility,
} from '../../types';

interface AwardDetailsSectionProps {
  officialName: string;
  setOfficialName: (val: string) => void;
  officialLink: string;
  setOfficialLink: (val: string) => void;
  fundingType: FundingType;
  setFundingType: (val: FundingType) => void;
  coverage: FundingCoverage;
  setCoverage: (val: FundingCoverage) => void;
  ethiopianEligibility: EthiopianEligibility;
  setEthiopianEligibility: (val: EthiopianEligibility) => void;
}

export const AwardDetailsSection: React.FC<AwardDetailsSectionProps> = ({
  officialName,
  setOfficialName,
  officialLink,
  setOfficialLink,
  fundingType,
  setFundingType,
  coverage,
  setCoverage,
  ethiopianEligibility,
  setEthiopianEligibility,
}) => {
  return (
    <div className="space-y-3">
      {/* Official Name */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Official Scholarship or Funding Name *
        </label>
        <input
          type="text"
          required
          value={officialName}
          onChange={(e) => setOfficialName(e.target.value)}
          placeholder="e.g. Nordic Future AI Full-Ride Fellowship"
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
            border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
            text-slate-900 dark:text-white focus:outline-none focus:ring-1
            focus:ring-slate-900"
        />
      </div>

      {/* Official Link */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Direct Official Scholarship Link
        </label>
        <input
          type="url"
          value={officialLink}
          onChange={(e) => setOfficialLink(e.target.value)}
          placeholder="https://university.edu/scholarships/details"
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
            border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
            text-slate-900 dark:text-white"
        />
      </div>

      {/* Funding Type, Coverage, Eligibility */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Funding Type *
          </label>
          <select
            value={fundingType}
            onChange={(e) => setFundingType(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border
              border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
              text-slate-900 dark:text-white"
          >
            <option value="Scholarship">Scholarship</option>
            <option value="SalariedPhD">Salaried PhD</option>
            <option value="ResearchAssistantship">Research assistantship</option>
            <option value="TeachingAssistantship">Teaching assistantship</option>
            <option value="TuitionWaiver">Tuition waiver</option>
            <option value="Other">Other</option>
            <option value="Unclear">Unclear</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Funding Coverage *
          </label>
          <select
            value={coverage}
            onChange={(e) => setCoverage(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border
              border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
              text-slate-900 dark:text-white"
          >
            <option value="FullRide">Full ride</option>
            <option value="FullTuitionPartialLiving">
              Full tuition + partial living
            </option>
            <option value="FullTuitionOnly">Full tuition only</option>
            <option value="PartialTuition">Partial tuition</option>
            <option value="StipendOnly">Stipend only</option>
            <option value="Other">Other</option>
            <option value="Unclear">Unclear</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Ethiopian Applicant Eligibility *
          </label>
          <select
            value={ethiopianEligibility}
            onChange={(e) => setEthiopianEligibility(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border
              border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
              text-slate-900 dark:text-white font-medium"
          >
            <option value="OpenToEthiopian">Open to Ethiopian applicants</option>
            <option value="EthiopiaSpecific">Ethiopia-specific</option>
            <option value="Ineligible">Ineligible</option>
            <option value="Unclear">Unclear</option>
          </select>
        </div>
      </div>
    </div>
  );
};


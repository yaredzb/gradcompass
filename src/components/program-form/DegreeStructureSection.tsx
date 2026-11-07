import React from 'react';
import {
  DirectPhDEntry,
  ProgramStructure,
  CanApplyBeforeGraduation,
  MediumOfInstruction,
} from '../../types';

interface DegreeStructureSectionProps {
  routeCategory: string;
  setRouteCategory: (val: string) => void;
  directPhDEntry: DirectPhDEntry;
  setDirectPhDEntry: (val: DirectPhDEntry) => void;
  programStructure: ProgramStructure;
  setProgramStructure: (val: ProgramStructure) => void;
  applyBeforeGraduation: CanApplyBeforeGraduation;
  setApplyBeforeGraduation: (val: CanApplyBeforeGraduation) => void;
  applyBeforeGraduationNotes: string;
  setApplyBeforeGraduationNotes: (val: string) => void;
  mediumOfInstruction: MediumOfInstruction;
  setMediumOfInstruction: (val: MediumOfInstruction) => void;
  instructionLanguageDetails: string;
  setInstructionLanguageDetails: (val: string) => void;
}

export const DegreeStructureSection: React.FC<DegreeStructureSectionProps> = ({
  routeCategory,
  setRouteCategory,
  directPhDEntry,
  setDirectPhDEntry,
  programStructure,
  setProgramStructure,
  applyBeforeGraduation,
  setApplyBeforeGraduation,
  applyBeforeGraduationNotes,
  setApplyBeforeGraduationNotes,
  mediumOfInstruction,
  setMediumOfInstruction,
  instructionLanguageDetails,
  setInstructionLanguageDetails,
}) => {
  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider text-slate-500 font-mono"
      >
        04. Degree Route & Academic Structure
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Route Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Primary Degree Route *
          </label>
          <select
            value={routeCategory}
            onChange={(e) => setRouteCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white font-medium"
          >
            <option value="Masters">Master’s Degree (Standalone)</option>
            <option value="PhD">Doctoral / PhD Program</option>
            <option value="IntegratedMastersPhD">Integrated Master’s–PhD</option>
            <option value="Unclear">Unclear / Under Verification</option>
          </select>
        </div>

        {/* PhD Entry Route Specifics */}
        {routeCategory === 'PhD' && (
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/60 space-y-2">
            <label className="block text-xs font-bold text-blue-900 dark:text-blue-300">
              Direct PhD Entry Rule *
            </label>
            <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="phdEntryRule"
                  value="DirectFromBachelors"
                  checked={directPhDEntry === 'DirectFromBachelors'}
                  onChange={() => setDirectPhDEntry('DirectFromBachelors')}
                />
                <span className="font-semibold text-slate-900 dark:text-white">
                  Direct entry from Bachelor’s degree allowed (Include in Direct-PhD catalog)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="phdEntryRule"
                  value="MasterRequired"
                  checked={directPhDEntry === 'MasterRequired'}
                  onChange={() => setDirectPhDEntry('MasterRequired')}
                />
                <span className="font-medium text-amber-800 dark:text-amber-400">
                  Requires completed Master’s degree (Kept out of Direct-PhD catalog)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="phdEntryRule"
                  value="Unclear"
                  checked={directPhDEntry === 'Unclear'}
                  onChange={() => setDirectPhDEntry('Unclear')}
                />
                <span>Unverified / Unclear bachelor entry status</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Structure */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Program Structure *
          </label>
          <select
            value={programStructure}
            onChange={(e) => setProgramStructure(e.target.value as any)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          >
            <option value="CourseworkPlusThesis">Coursework + Thesis</option>
            <option value="PhDCourseworkDissertation">PhD (Coursework + Dissertation)</option>
            <option value="TaughtCourseworkOnly">Taught Coursework Only (No thesis)</option>
            <option value="CourseworkPlusCapstone">Coursework + Capstone Project</option>
            <option value="ResearchMastersByThesis">Research Master’s by Thesis</option>
            <option value="PhDByDissertation">PhD by Dissertation Only</option>
            <option value="Other">Other</option>
            <option value="Unclear">Unclear</option>
          </select>
        </div>

        {/* Apply before graduation */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Can Apply Before Final Graduation? *
          </label>
          <select
            value={applyBeforeGraduation}
            onChange={(e) => setApplyBeforeGraduation(e.target.value as any)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          >
            <option value="Yes">Yes (Graduating seniors can apply with provisional grades)</option>
            <option value="Conditional">Conditional / University-specific waiver</option>
            <option value="No">No (Completed degree certificate strictly required at application)</option>
            <option value="Unclear">Unclear / Under verification</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Pre-graduation Application Guidance & Certificate Notes
        </label>
        <input
          type="text"
          value={applyBeforeGraduationNotes}
          onChange={(e) => setApplyBeforeGraduationNotes(e.target.value)}
          placeholder="e.g. Provisional certificate accepted"
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Medium of Instruction *
          </label>
          <select
            value={mediumOfInstruction}
            onChange={(e) => setMediumOfInstruction(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          >
            <option value="English">100% English</option>
            <option value="LocalLanguage">Local Language (Swedish, Arabic, German, etc.)</option>
            <option value="Mixed">Bilingual / Mixed</option>
            <option value="Other">Other</option>
            <option value="Unclear">Unclear</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Language Curriculum Details
          </label>
          <input
            type="text"
            value={instructionLanguageDetails}
            onChange={(e) => setInstructionLanguageDetails(e.target.value)}
            placeholder="e.g. Coursework & thesis in English"
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};


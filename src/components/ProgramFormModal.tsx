import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Program,
  DegreeRoute,
  DirectPhDEntry,
  ProgramStructure,
  CanApplyBeforeGraduation,
  MediumOfInstruction,
  IntakeStatus,
  CampusCityCost,
} from '../types';
import {
  ALL_COUNTRIES,
  getAssignedRegionsForCountries,
} from '../utils/regions';
import { IdentificationSection } from './program-form/IdentificationSection';
import { CountryRegionSection } from './program-form/CountryRegionSection';
import { FieldsSection } from './program-form/FieldsSection';
import { DegreeStructureSection } from './program-form/DegreeStructureSection';
import { AdmissionsPrereqSection } from './program-form/AdmissionsPrereqSection';
import { EnglishProficiencySection } from './program-form/EnglishProficiencySection';
import { SelectionCompetitivenessSection } from './program-form/SelectionCompetitivenessSection';
import { IntakesSection } from './program-form/IntakesSection';
import { CampusCitiesSection } from './program-form/CampusCitiesSection';

export interface ProgramFormModalProps {
  initialProgram?: Program | null;
  existingUniversities: string[];
  existingFields: string[];
  onSave: (program: Program) => void;
  onClose: () => void;
}

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  initialProgram,
  existingUniversities,
  existingFields,
  onSave,
  onClose,
}) => {
  const isEditing = !!initialProgram;

  // Basic info
  const [officialName, setOfficialName] = useState(
    initialProgram?.officialName || ''
  );
  const [university, setUniversity] = useState(
    initialProgram?.university || ''
  );
  const [customUniversity, setCustomUniversity] = useState('');
  const [isNewUniversity, setIsNewUniversity] = useState(false);
  const [isJointProgram, setIsJointProgram] = useState(
    initialProgram?.isJointProgram || false
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialProgram?.countries || []
  );
  const [countrySearch, setCountrySearch] = useState('');
  const [officialLink, setOfficialLink] = useState(
    initialProgram?.officialLink || ''
  );

  // Fields / Tags
  const [fields, setFields] = useState<string[]>(
    initialProgram?.fields || []
  );
  const [newFieldInput, setNewFieldInput] = useState('');

  // Degree & Structure
  const getInitialRouteCategory = (): string => {
    if (
      initialProgram?.degreeRoute === 'DirectPhD' ||
      initialProgram?.degreeRoute === 'MastersRequiredPhD' ||
      initialProgram?.directPhDEntry
    ) {
      return 'PhD';
    }
    return initialProgram?.degreeRoute || 'Masters';
  };

  const [routeCategory, setRouteCategory] = useState<string>(
    getInitialRouteCategory()
  );
  const [directPhDEntry, setDirectPhDEntry] = useState<DirectPhDEntry>(() => {
    if (initialProgram?.directPhDEntry) return initialProgram.directPhDEntry;
    if (initialProgram?.degreeRoute === 'MastersRequiredPhD')
      return 'MasterRequired';
    if (initialProgram?.degreeRoute === 'DirectPhD')
      return 'DirectFromBachelors';
    return 'DirectFromBachelors';
  });
  const [programStructure, setProgramStructure] = useState<ProgramStructure>(
    initialProgram?.programStructure || 'CourseworkPlusThesis'
  );
  const [applyBeforeGraduation, setApplyBeforeGraduation] =
    useState<CanApplyBeforeGraduation>(
      initialProgram?.applyBeforeGraduation || 'Yes'
    );
  const [applyBeforeGraduationNotes, setApplyBeforeGraduationNotes] = useState(
    initialProgram?.applyBeforeGraduationNotes || ''
  );

  // Requirements
  const [minimumGrades, setMinimumGrades] = useState(
    initialProgram?.minimumGrades || ''
  );
  const [gradingScale, setGradingScale] = useState(
    initialProgram?.gradingScale || ''
  );
  const [academicPrerequisites, setAcademicPrerequisites] = useState(
    initialProgram?.academicPrerequisites || ''
  );
  const [keyRequirements, setKeyRequirements] = useState(
    initialProgram?.keyRequirements || ''
  );

  // Language & English
  const [mediumOfInstruction, setMediumOfInstruction] =
    useState<MediumOfInstruction>(
      initialProgram?.mediumOfInstruction || 'English'
    );
  const [instructionLanguageDetails, setInstructionLanguageDetails] = useState(
    initialProgram?.instructionLanguageDetails || ''
  );
  const [englishTests, setEnglishTests] = useState<string[]>(
    initialProgram?.englishProficiency?.acceptedTests || [
      'TOEFL iBT',
      'IELTS Academic',
    ]
  );
  const [newEnglishTest, setNewEnglishTest] = useState('');
  const [englishMinimumScores, setEnglishMinimumScores] = useState(
    initialProgram?.englishProficiency?.minimumScores || ''
  );
  const [englishWaivers, setEnglishWaivers] = useState(
    initialProgram?.englishProficiency?.waivers || ''
  );

  // Selection Steps
  const availableSelectionSteps = [
    'Academic document review',
    'Faculty interview',
    'Entrance exam',
    'Technical assessment',
    'Portfolio or writing sample review',
    'Supervisor approval',
    'Language test verification',
  ];
  const [selectionSteps, setSelectionSteps] = useState<string[]>(
    initialProgram?.selectionSteps || [
      'Academic document review',
      'Faculty interview',
    ]
  );

  // Competitiveness
  const [competitivenessDetails, setCompetitivenessDetails] = useState(
    initialProgram?.admissionCompetitiveness?.metricDetails || ''
  );
  const [competitivenessYear, setCompetitivenessYear] = useState(
    initialProgram?.admissionCompetitiveness?.sourceYear || '2026'
  );
  const [competitivenessLink, setCompetitivenessLink] = useState(
    initialProgram?.admissionCompetitiveness?.sourceLink || ''
  );

  // Fall Intake
  const [fallTerm] = useState(
    initialProgram?.fallIntake?.term || 'Fall 2027'
  );
  const [fallStatus, setFallStatus] = useState<IntakeStatus>(
    initialProgram?.fallIntake?.status || 'FixedDeadline'
  );
  const [fallStartDate, setFallStartDate] = useState(
    initialProgram?.fallIntake?.startDate || ''
  );
  const [fallDeadlineDate, setFallDeadlineDate] = useState(
    initialProgram?.fallIntake?.deadlineDate || ''
  );
  const [fallNotes, setFallNotes] = useState(
    initialProgram?.fallIntake?.notes || ''
  );

  // Spring Intake
  const [springTerm] = useState(
    initialProgram?.springIntake?.term || 'Spring 2028'
  );
  const [springStatus, setSpringStatus] = useState<IntakeStatus>(
    initialProgram?.springIntake?.status || 'NotOffered'
  );
  const [springStartDate, setSpringStartDate] = useState(
    initialProgram?.springIntake?.startDate || ''
  );
  const [springDeadlineDate, setSpringDeadlineDate] = useState(
    initialProgram?.springIntake?.deadlineDate || ''
  );
  const [springNotes, setSpringNotes] = useState(
    initialProgram?.springIntake?.notes || ''
  );

  // Campus Cities
  const [campusCities, setCampusCities] = useState<CampusCityCost[]>(
    initialProgram?.campusCities && initialProgram.campusCities.length > 0
      ? initialProgram.campusCities
      : [
          {
            city: '',
            minMonthlyCost: '',
            typicalMonthlyCost: '',
            currency: 'USD',
            sourceLink: '',
          },
        ]
  );

  const [informationLastChecked, setInformationLastChecked] = useState(
    initialProgram?.informationLastChecked ||
      new Date().toISOString().split('T')[0]
  );

  const assignedRegions = getAssignedRegionsForCountries(selectedCountries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalUniversity = isNewUniversity
      ? customUniversity.trim()
      : university;
    if (!finalUniversity) {
      alert('Please enter or select a university or consortium.');
      return;
    }

    if (!officialName.trim()) {
      alert('Please enter the official program name.');
      return;
    }

    let finalDegreeRoute: DegreeRoute = 'Masters';
    let finalDirectPhDEntry: DirectPhDEntry | undefined = undefined;

    if (routeCategory === 'PhD') {
      finalDirectPhDEntry = directPhDEntry;
      if (directPhDEntry === 'DirectFromBachelors') {
        finalDegreeRoute = 'DirectPhD';
      } else if (directPhDEntry === 'MasterRequired') {
        finalDegreeRoute = 'MastersRequiredPhD';
      } else {
        finalDegreeRoute = 'Unclear';
      }
    } else if (routeCategory === 'IntegratedMastersPhD') {
      finalDegreeRoute = 'IntegratedMastersPhD';
    } else if (routeCategory === 'Unclear') {
      finalDegreeRoute = 'Unclear';
    } else {
      finalDegreeRoute = 'Masters';
    }

    const newProgram: Program = {
      id: initialProgram?.id || `program-${Date.now()}`,
      officialName: officialName.trim(),
      university: finalUniversity,
      isJointProgram,
      countries: selectedCountries,
      assignedRegions,
      campusCities: campusCities.filter((c) => c.city.trim() !== ''),
      officialLink: officialLink.trim() || 'https://example.org',
      fields,
      degreeRoute: finalDegreeRoute,
      directPhDEntry: finalDirectPhDEntry,
      programStructure,
      applyBeforeGraduation,
      applyBeforeGraduationNotes: applyBeforeGraduationNotes.trim(),
      minimumGrades: minimumGrades.trim(),
      gradingScale: gradingScale.trim(),
      academicPrerequisites: academicPrerequisites.trim(),
      keyRequirements: keyRequirements.trim(),
      mediumOfInstruction,
      instructionLanguageDetails: instructionLanguageDetails.trim(),
      englishProficiency: {
        acceptedTests: englishTests,
        minimumScores: englishMinimumScores.trim(),
        waivers: englishWaivers.trim(),
      },
      selectionSteps,
      admissionCompetitiveness: {
        metricDetails: competitivenessDetails.trim(),
        sourceYear: competitivenessYear.trim(),
        sourceLink: competitivenessLink.trim(),
      },
      fallIntake: {
        term: fallTerm.trim(),
        status: fallStatus,
        startDate: fallStartDate || undefined,
        deadlineDate:
          fallStatus === 'FixedDeadline' ? fallDeadlineDate : undefined,
        endDate:
          fallStatus === 'FixedDeadline' ? fallDeadlineDate : undefined,
        notes: fallNotes.trim(),
      },
      springIntake: {
        term: springTerm.trim(),
        status: springStatus,
        startDate: springStartDate || undefined,
        deadlineDate:
          springStatus === 'FixedDeadline' ? springDeadlineDate : undefined,
        endDate:
          springStatus === 'FixedDeadline' ? springDeadlineDate : undefined,
        notes: springNotes.trim(),
      },
      informationLastChecked:
        informationLastChecked || new Date().toISOString().split('T')[0],
      createdAt: initialProgram?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newProgram);
    onClose();
  };

  const filteredCountryList = ALL_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2
        sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-white
          dark:bg-[#1E293B] rounded-xl border border-[#E6DFD5]
          dark:border-[#334155] shadow-xl flex flex-col overflow-hidden my-auto"
      >
        {/* Header */}
        <div
          className="p-4 sm:p-6 border-b border-[#E6DFD5] dark:border-[#334155]
            flex items-center justify-between"
        >
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isEditing
                ? 'Edit Graduate Program Record'
                : 'Add Graduate Program Record'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Save essentials first; funding opportunities can be attached next.
            </p>
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
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm"
        >
          {/* Section 1: Institution & Official Name */}
          <IdentificationSection
            officialName={officialName}
            setOfficialName={setOfficialName}
            university={university}
            setUniversity={setUniversity}
            customUniversity={customUniversity}
            setCustomUniversity={setCustomUniversity}
            isNewUniversity={isNewUniversity}
            setIsNewUniversity={setIsNewUniversity}
            existingUniversities={existingUniversities}
            officialLink={officialLink}
            setOfficialLink={setOfficialLink}
          />

          {/* Section 2: Country & Region */}
          <CountryRegionSection
            isJointProgram={isJointProgram}
            setIsJointProgram={setIsJointProgram}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            countrySearch={countrySearch}
            setCountrySearch={setCountrySearch}
            filteredCountryList={filteredCountryList}
            assignedRegions={assignedRegions}
          />

          {/* Section 3: Fields & Specializations */}
          <FieldsSection
            fields={fields}
            setFields={setFields}
            newFieldInput={newFieldInput}
            setNewFieldInput={setNewFieldInput}
          />

          {/* Section 4: Degree Route & Structure */}
          <DegreeStructureSection
            routeCategory={routeCategory}
            setRouteCategory={setRouteCategory}
            directPhDEntry={directPhDEntry}
            setDirectPhDEntry={setDirectPhDEntry}
            programStructure={programStructure}
            setProgramStructure={setProgramStructure}
            applyBeforeGraduation={applyBeforeGraduation}
            setApplyBeforeGraduation={setApplyBeforeGraduation}
            applyBeforeGraduationNotes={applyBeforeGraduationNotes}
            setApplyBeforeGraduationNotes={setApplyBeforeGraduationNotes}
            mediumOfInstruction={mediumOfInstruction}
            setMediumOfInstruction={setMediumOfInstruction}
            instructionLanguageDetails={instructionLanguageDetails}
            setInstructionLanguageDetails={setInstructionLanguageDetails}
          />

          {/* Section 5: Academic Prerequisites & Grades */}
          <AdmissionsPrereqSection
            minimumGrades={minimumGrades}
            setMinimumGrades={setMinimumGrades}
            gradingScale={gradingScale}
            setGradingScale={setGradingScale}
            academicPrerequisites={academicPrerequisites}
            setAcademicPrerequisites={setAcademicPrerequisites}
            keyRequirements={keyRequirements}
            setKeyRequirements={setKeyRequirements}
          />

          {/* Section 6: English Proficiency & Waivers */}
          <EnglishProficiencySection
            englishTests={englishTests}
            setEnglishTests={setEnglishTests}
            newEnglishTest={newEnglishTest}
            setNewEnglishTest={setNewEnglishTest}
            englishMinimumScores={englishMinimumScores}
            setEnglishMinimumScores={setEnglishMinimumScores}
            englishWaivers={englishWaivers}
            setEnglishWaivers={setEnglishWaivers}
          />

          {/* Section 7: Selection Steps & Competitiveness */}
          <SelectionCompetitivenessSection
            selectionSteps={selectionSteps}
            setSelectionSteps={setSelectionSteps}
            availableSelectionSteps={availableSelectionSteps}
            competitivenessDetails={competitivenessDetails}
            setCompetitivenessDetails={setCompetitivenessDetails}
            competitivenessYear={competitivenessYear}
            setCompetitivenessYear={setCompetitivenessYear}
            competitivenessLink={competitivenessLink}
            setCompetitivenessLink={setCompetitivenessLink}
          />

          {/* Section 8: Intakes & Timeline */}
          <IntakesSection
            fallTerm={fallTerm}
            fallStatus={fallStatus}
            setFallStatus={setFallStatus}
            fallStartDate={fallStartDate}
            setFallStartDate={setFallStartDate}
            fallDeadlineDate={fallDeadlineDate}
            setFallDeadlineDate={setFallDeadlineDate}
            fallNotes={fallNotes}
            setFallNotes={setFallNotes}
            springTerm={springTerm}
            springStatus={springStatus}
            setSpringStatus={setSpringStatus}
            springStartDate={springStartDate}
            setSpringStartDate={setSpringStartDate}
            springDeadlineDate={springDeadlineDate}
            setSpringDeadlineDate={setSpringDeadlineDate}
            springNotes={springNotes}
            setSpringNotes={setSpringNotes}
          />

          {/* Section 9: Campus Living Cost Estimates */}
          <CampusCitiesSection
            campusCities={campusCities}
            setCampusCities={setCampusCities}
            informationLastChecked={informationLastChecked}
            setInformationLastChecked={setInformationLastChecked}
          />

          {/* Form Actions Footer */}
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
              {isEditing ? 'Save Changes' : 'Save Program Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

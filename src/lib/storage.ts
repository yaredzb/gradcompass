import { Program, FundingOpportunity } from '../types';
import { INITIAL_DEMO_PROGRAMS, INITIAL_DEMO_FUNDING } from '../data/initialDemoRecords';
import { getSupabaseClient, getStoredAuthUser, getStoredSupabaseConfig } from './supabase';

const PROGRAMS_KEY = 'gradsearch_programs_v2';
const FUNDING_KEY = 'gradsearch_funding_v2';
const listeners = new Set<() => void>();
let cachedPrograms: Program[] | null = null;
let cachedFunding: FundingOpportunity[] | null = null;
let storeContext = '';
let storeVersion = 0;

export function clearStoreCache() {
  cachedPrograms = null;
  cachedFunding = null;
  storeContext = '';
  storeVersion++;
}

function context() {
  const user = getStoredAuthUser();
  const config = getStoredSupabaseConfig();
  const next = config.url ? config.url + ':' + (user?.id || '') : 'local-demo';
  if (storeContext !== next) {
    clearStoreCache();
    storeContext = next;
  }
  return storeVersion;
}

function requireUser() {
  context();
  const user = getStoredAuthUser();
  if (!user) throw new Error('Please sign in to access saved records.');
  return user;
}

function checkSession(version: number) {
  context();
  if (version !== storeVersion) throw new Error('Your session changed. Please try again.');
}

function databaseError(operation: string, error: { message: string } | null) {
  if (error) throw new Error(operation + ': ' + error.message);
}

function notify() { listeners.forEach(listener => listener()); }

export function subscribeToStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function readLocal<T>(key: string, initial: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw !== null) {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Saved local data is invalid. It has not been replaced.');
    return parsed;
  }
  const records = structuredClone(initial);
  localStorage.setItem(key, JSON.stringify(records));
  return records;
}

function loadLocal() {
  cachedPrograms ??= readLocal(PROGRAMS_KEY, INITIAL_DEMO_PROGRAMS);
  cachedFunding ??= readLocal(FUNDING_KEY, INITIAL_DEMO_FUNDING.filter(
    fund => cachedPrograms!.some(program => program.id === fund.programId)
  ));
}

function programFromRow(row: any): Program {
  return {
          id: row.id,
          officialName: row.official_name ?? row.officialName ?? '',
          university: row.university ?? '',
          universities: row.universities || undefined,
          consortiumName: row.consortium_name ?? row.consortiumName ?? undefined,
          isJointProgram: row.is_joint_program ?? row.isJointProgram ?? false,
          countries: row.countries || [],
          assignedRegions: row.assigned_regions || row.assignedRegions || [],
          campusCities: row.campus_cities || row.campusCities || [],
          proofOfFunds: row.proof_of_funds || row.proofOfFunds || { required: 'Unclear' },
          officialLink: row.official_link ?? row.officialLink ?? '',
          fields: row.fields || [],
          degreeRoute: row.degree_route || row.degreeRoute || 'Unclear',
          directPhDEntry: row.direct_phd_entry || row.directPhDEntry || 'Unclear',
          programStructure: row.program_structure || row.programStructure || 'Unclear',
          applyBeforeGraduation: row.apply_before_graduation || row.applyBeforeGraduation || 'Unclear',
          applyBeforeGraduationNotes: row.apply_before_graduation_notes ?? row.applyBeforeGraduationNotes ?? '',
          minimumGrades: row.minimum_grades ?? row.minimumGrades ?? '',
          gradingScale: row.grading_scale ?? row.gradingScale ?? '',
          academicPrerequisites: row.academic_prerequisites ?? row.academicPrerequisites ?? '',
          keyRequirements: row.key_requirements ?? row.keyRequirements ?? '',
          mediumOfInstruction: row.medium_of_instruction || row.mediumOfInstruction || 'Unclear',
          instructionLanguageDetails: row.instruction_language_details ?? row.instructionLanguageDetails ?? '',
          englishProficiency: row.english_proficiency || row.englishProficiency || { acceptedTests: [] },
          selectionSteps: row.selection_steps || row.selectionSteps || [],
          admissionCompetitiveness: row.admission_competitiveness || row.admissionCompetitiveness || {},
          fallIntake: row.fall_intake || row.fallIntake || {},
          springIntake: row.spring_intake || row.springIntake || {},
          informationLastChecked: row.information_last_checked || row.informationLastChecked || '',
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

function fundingFromRow(row: any): FundingOpportunity {
  return {
          id: row.id,
          programId: row.program_id || row.programId,
          officialName: row.official_name ?? row.officialName ?? '',
          officialLink: row.official_link ?? row.officialLink ?? '',
          fundingType: row.funding_type || row.fundingType || 'Unclear',
          coverage: row.coverage || 'Unclear',
          ethiopianEligibility: row.ethiopian_eligibility || row.ethiopianEligibility || 'Unclear',
          monthlyStipend: row.monthly_stipend || row.monthlyStipend || {
            isZeroConfirmed: false,
            currency: 'USD',
            grossOrNet: 'Gross',
            isUnpublished: false,
          },
          fallFunding: row.fall_funding || row.fallFunding || {},
          springFunding: row.spring_funding || row.springFunding || {},
          intakeNotes: row.intake_notes ?? row.intakeNotes ?? '',
          competitiveness: row.competitiveness || {},
          visaAndWorkNotes: row.visa_and_work_notes ?? row.visaAndWorkNotes ?? '',
          informationLastChecked: row.information_last_checked || row.informationLastChecked || '',
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

function programToRow(program: Program) {
  return {
        id: program.id,
        official_name: program.officialName,
        university: program.university,
        universities: program.universities || [],
        consortium_name: program.consortiumName || '',
        is_joint_program: program.isJointProgram,
        countries: program.countries,
        assigned_regions: program.assignedRegions,
        campus_cities: program.campusCities,
        proof_of_funds: program.proofOfFunds || { required: 'Unclear' },
        official_link: program.officialLink,
        fields: program.fields,
        degree_route: program.degreeRoute,
        direct_phd_entry: program.directPhDEntry,
        program_structure: program.programStructure,
        apply_before_graduation: program.applyBeforeGraduation,
        apply_before_graduation_notes: program.applyBeforeGraduationNotes,
        minimum_grades: program.minimumGrades,
        grading_scale: program.gradingScale,
        academic_prerequisites: program.academicPrerequisites,
        key_requirements: program.keyRequirements,
        medium_of_instruction: program.mediumOfInstruction,
        instruction_language_details: program.instructionLanguageDetails,
        english_proficiency: program.englishProficiency,
        selection_steps: program.selectionSteps,
        admission_competitiveness: program.admissionCompetitiveness,
        fall_intake: program.fallIntake,
        spring_intake: program.springIntake,
        information_last_checked: program.informationLastChecked,
        created_at: program.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
  };
}

function fundingToRow(funding: FundingOpportunity) {
  return {
        id: funding.id,
        program_id: funding.programId,
        official_name: funding.officialName,
        official_link: funding.officialLink,
        funding_type: funding.fundingType,
        coverage: funding.coverage,
        ethiopian_eligibility: funding.ethiopianEligibility,
        monthly_stipend: funding.monthlyStipend,
        fall_funding: funding.fallFunding,
        spring_funding: funding.springFunding,
        intake_notes: funding.intakeNotes,
        competitiveness: funding.competitiveness,
        visa_and_work_notes: funding.visaAndWorkNotes,
        information_last_checked: funding.informationLastChecked,
        created_at: funding.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
  };
}

export async function fetchAllData(): Promise<{ programs: Program[]; funding: FundingOpportunity[] }> {
  context();
  if (!getStoredAuthUser()) return { programs: [], funding: [] };
  const version = storeVersion;
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data: membership, error: memberError } = await supabase
      .from('team_members').select('user_id').eq('user_id', getStoredAuthUser()!.id).maybeSingle();
    databaseError('Could not verify team access', memberError);
    if (!membership) throw new Error('Your account has not been approved for this team. Ask the database owner to add you.');
    const [programsRes, fundingRes] = await Promise.all([
      supabase.from('programs').select('*'),
      supabase.from('funding_opportunities').select('*'),
    ]);
    databaseError('Could not load programs', programsRes.error);
    databaseError('Could not load funding', fundingRes.error);
    checkSession(version);
    // Empty arrays are authoritative: deleted examples must stay deleted.
    cachedPrograms = (programsRes.data || []).map(programFromRow);
    cachedFunding = (fundingRes.data || []).map(fundingFromRow);
  } else {
    loadLocal();
  }
  return { programs: cachedPrograms!, funding: cachedFunding! };
}

export function getProgramsSync(): Program[] {
  context();
  if (!getStoredAuthUser()) return [];
  if (!getSupabaseClient()) loadLocal();
  return cachedPrograms || [];
}

export function getFundingSync(): FundingOpportunity[] {
  context();
  if (!getStoredAuthUser()) return [];
  if (!getSupabaseClient()) loadLocal();
  return cachedFunding || [];
}

function commitPrograms(programs: Program[], remote: boolean) {
  if (!remote) localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
  cachedPrograms = programs;
}

function commitFunding(funding: FundingOpportunity[], remote: boolean) {
  if (!remote) localStorage.setItem(FUNDING_KEY, JSON.stringify(funding));
  cachedFunding = funding;
}

export async function saveProgram(program: Program): Promise<void> {
  requireUser();
  const version = storeVersion;
  const supabase = getSupabaseClient();
  let saved = { ...program, updatedAt: new Date().toISOString() };
  if (supabase) {
    const { data, error } = await supabase.from('programs').upsert(programToRow(saved)).select().single();
    databaseError('Could not save program', error);
    saved = programFromRow(data);
  }
  checkSession(version);
  const current = getProgramsSync();
  commitPrograms([saved, ...current.filter(item => item.id !== saved.id)], !!supabase);
  notify();
}

export async function deleteProgram(id: string): Promise<void> {
  requireUser();
  const version = storeVersion;
  const supabase = getSupabaseClient();
  if (supabase) {
    // The foreign key deletes attached awards in the same database transaction.
    const { data, error } = await supabase.from('programs').delete().eq('id', id).select('id');
    databaseError('Could not delete program', error);
    if (!data?.length) throw new Error('The program was not deleted. It may no longer exist or you may not have access.');
  }
  checkSession(version);
  commitPrograms(getProgramsSync().filter(item => item.id !== id), !!supabase);
  commitFunding(getFundingSync().filter(item => item.programId !== id), !!supabase);
  notify();
}

export async function saveFundingOpportunity(funding: FundingOpportunity): Promise<void> {
  requireUser();
  const version = storeVersion;
  const supabase = getSupabaseClient();
  let saved = { ...funding, updatedAt: new Date().toISOString() };
  if (supabase) {
    const { data, error } = await supabase.from('funding_opportunities').upsert(fundingToRow(saved)).select().single();
    databaseError('Could not save funding', error);
    saved = fundingFromRow(data);
  }
  checkSession(version);
  const current = getFundingSync();
  commitFunding([saved, ...current.filter(item => item.id !== saved.id)], !!supabase);
  notify();
}

export async function deleteFundingOpportunity(id: string): Promise<void> {
  requireUser();
  const version = storeVersion;
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('funding_opportunities').delete().eq('id', id).select('id');
    databaseError('Could not delete funding', error);
    if (!data?.length) throw new Error('The award was not deleted. It may no longer exist or you may not have access.');
  }
  checkSession(version);
  commitFunding(getFundingSync().filter(item => item.id !== id), !!supabase);
  notify();
}

// Explicit user action only. Preserve all existing records, including edited demos.
export async function restoreDemoData(): Promise<void> {
  requireUser();
  const version = storeVersion;
  const supabase = getSupabaseClient();
  if (supabase) {
    // Ignore conflicts even if another team member edits a demo during restoration.
    const programsResult = await supabase.from('programs').upsert(
      INITIAL_DEMO_PROGRAMS.map(programToRow), { onConflict: 'id', ignoreDuplicates: true }
    );
    databaseError('Could not restore demo programs', programsResult.error);
    checkSession(version);
    const fundingResult = await supabase.from('funding_opportunities').upsert(
      INITIAL_DEMO_FUNDING.map(fundingToRow), { onConflict: 'id', ignoreDuplicates: true }
    );
    databaseError('Could not restore demo awards', fundingResult.error);
    checkSession(version);
    await fetchAllData();
    notify();
    return;
  }
  const { programs, funding } = await fetchAllData();
  for (const program of INITIAL_DEMO_PROGRAMS) {
    if (!programs.some(item => item.id === program.id)) await saveProgram(structuredClone(program));
  }
  for (const award of INITIAL_DEMO_FUNDING) {
    if (!funding.some(item => item.id === award.id)) await saveFundingOpportunity(structuredClone(award));
  }
}

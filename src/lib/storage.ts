import { Program, FundingOpportunity } from '../types';
import { INITIAL_DEMO_PROGRAMS, INITIAL_DEMO_FUNDING } from '../data/initialDemoRecords';
import { getSupabaseClient, getStoredAuthUser } from './supabase';

const PROGRAMS_KEY = 'gradsearch_programs_v2';
const FUNDING_KEY = 'gradsearch_funding_v2';

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// In-memory cache
let cachedPrograms: Program[] | null = null;
let cachedFunding: FundingOpportunity[] | null = null;

function loadLocalPrograms(): Program[] {
  try {
    const raw = localStorage.getItem(PROGRAMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure demo records have application timeline start dates
        return parsed.map((p) => {
          if (p.id === 'demo-program-1' && !p.fallIntake?.startDate) {
            return {
              ...p,
              fallIntake: {
                ...p.fallIntake,
                startDate: '2026-10-15',
                endDate: p.fallIntake?.deadlineDate || '2027-01-15',
              },
            };
          }
          if (p.id === 'demo-program-2' && !p.fallIntake?.startDate) {
            return {
              ...p,
              fallIntake: {
                ...p.fallIntake,
                startDate: '2026-09-01',
                endDate: p.fallIntake?.deadlineDate || '2026-12-01',
              },
              springIntake: {
                ...p.springIntake,
                startDate: '2027-05-01',
                endDate: p.springIntake?.deadlineDate || '2027-09-15',
              },
            };
          }
          return p;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load local programs:', e);
  }
  // Initialize with initial demo records
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(INITIAL_DEMO_PROGRAMS));
  return INITIAL_DEMO_PROGRAMS;
}

function loadLocalFunding(): FundingOpportunity[] {
  try {
    const raw = localStorage.getItem(FUNDING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load local funding:', e);
  }
  // Initialize with initial demo records
  localStorage.setItem(FUNDING_KEY, JSON.stringify(INITIAL_DEMO_FUNDING));
  return INITIAL_DEMO_FUNDING;
}

export async function fetchAllData(): Promise<{
  programs: Program[];
  funding: FundingOpportunity[];
}> {
  const user = getStoredAuthUser();
  if (!user) {
    // Gated: signed-out visitors cannot view records
    return { programs: [], funding: [] };
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const [programsRes, fundingRes] = await Promise.all([
        supabase.from('programs').select('*'),
        supabase.from('funding_opportunities').select('*'),
      ]);

      if (!programsRes.error && programsRes.data && programsRes.data.length > 0) {
        cachedPrograms = programsRes.data.map((row) => ({
          ...row,
          campusCities: row.campus_cities || row.campusCities || [],
          assignedRegions: row.assigned_regions || row.assignedRegions || [],
          countries: row.countries || [],
          fields: row.fields || [],
          selectionSteps: row.selection_steps || row.selectionSteps || [],
          fallIntake: row.fall_intake || row.fallIntake || {},
          springIntake: row.spring_intake || row.springIntake || {},
          englishProficiency: row.english_proficiency || row.englishProficiency || { acceptedTests: [] },
          admissionCompetitiveness: row.admission_competitiveness || row.admissionCompetitiveness || {},
        }));
      }

      if (!fundingRes.error && fundingRes.data && fundingRes.data.length > 0) {
        cachedFunding = fundingRes.data.map((row) => ({
          ...row,
          programId: row.program_id || row.programId,
          monthlyStipend: row.monthly_stipend || row.monthlyStipend || {},
          fallFunding: row.fall_funding || row.fallFunding || {},
          springFunding: row.spring_funding || row.springFunding || {},
          competitiveness: row.competitiveness || {},
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local persistent store:', e);
    }
  }

  if (!cachedPrograms) {
    cachedPrograms = loadLocalPrograms();
  }
  if (!cachedFunding) {
    cachedFunding = loadLocalFunding();
  }

  return {
    programs: cachedPrograms,
    funding: cachedFunding,
  };
}

export function getProgramsSync(): Program[] {
  const user = getStoredAuthUser();
  if (!user) return [];
  if (!cachedPrograms) {
    cachedPrograms = loadLocalPrograms();
  }
  return cachedPrograms;
}

export function getFundingSync(): FundingOpportunity[] {
  const user = getStoredAuthUser();
  if (!user) return [];
  if (!cachedFunding) {
    cachedFunding = loadLocalFunding();
  }
  return cachedFunding;
}

export async function saveProgram(program: Program): Promise<void> {
  const user = getStoredAuthUser();
  if (!user) {
    throw new Error('Unauthorized: Please sign in to save records');
  }

  const current = getProgramsSync();
  const index = current.findIndex((p) => p.id === program.id);
  let updated: Program[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...program, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...program, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }

  cachedPrograms = updated;
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(updated));
  notify();

  // Async sync to Supabase if available
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('programs').upsert({
        id: program.id,
        official_name: program.officialName,
        university: program.university,
        is_joint_program: program.isJointProgram,
        countries: program.countries,
        assigned_regions: program.assignedRegions,
        campus_cities: program.campusCities,
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
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Supabase program upsert error:', err);
    }
  }
}

export async function deleteProgram(id: string): Promise<void> {
  const user = getStoredAuthUser();
  if (!user) {
    throw new Error('Unauthorized: Please sign in to delete records');
  }

  const current = getProgramsSync();
  const updated = current.filter((p) => p.id !== id);
  cachedPrograms = updated;
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(updated));

  // Also delete associated funding opportunities
  const fundingCurrent = getFundingSync();
  const fundingUpdated = fundingCurrent.filter((f) => f.programId !== id);
  cachedFunding = fundingUpdated;
  localStorage.setItem(FUNDING_KEY, JSON.stringify(fundingUpdated));

  notify();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('funding_opportunities').delete().eq('program_id', id);
      await supabase.from('programs').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase program delete error:', err);
    }
  }
}

export async function saveFundingOpportunity(funding: FundingOpportunity): Promise<void> {
  const user = getStoredAuthUser();
  if (!user) {
    throw new Error('Unauthorized: Please sign in to save funding records');
  }

  const current = getFundingSync();
  const index = current.findIndex((f) => f.id === funding.id);
  let updated: FundingOpportunity[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...funding, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...funding, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }

  cachedFunding = updated;
  localStorage.setItem(FUNDING_KEY, JSON.stringify(updated));
  notify();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('funding_opportunities').upsert({
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
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Supabase funding upsert error:', err);
    }
  }
}

export async function deleteFundingOpportunity(id: string): Promise<void> {
  const user = getStoredAuthUser();
  if (!user) {
    throw new Error('Unauthorized: Please sign in to delete funding records');
  }

  const current = getFundingSync();
  const updated = current.filter((f) => f.id !== id);
  cachedFunding = updated;
  localStorage.setItem(FUNDING_KEY, JSON.stringify(updated));
  notify();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('funding_opportunities').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase funding delete error:', err);
    }
  }
}

export function resetDemoData() {
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(INITIAL_DEMO_PROGRAMS));
  localStorage.setItem(FUNDING_KEY, JSON.stringify(INITIAL_DEMO_FUNDING));
  cachedPrograms = INITIAL_DEMO_PROGRAMS;
  cachedFunding = INITIAL_DEMO_FUNDING;
  notify();
}

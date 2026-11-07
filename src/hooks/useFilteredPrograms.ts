import { useMemo } from 'react';
import { Program, FundingOpportunity } from '../types';
import { FilterState } from '../components/FilterBar';

export function useFilteredPrograms(
  programs: Program[],
  funding: FundingOpportunity[],
  filters: FilterState
) {
  // Derive unique lists for filters & autocomplete
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => p.countries.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [programs]);

  const availableUniversities = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => {
      if (p.university) set.add(p.university);
      p.universities?.forEach(name => set.add(name));
    });
    return Array.from(set).sort();
  }, [programs]);

  const availableFields = useMemo(() => {
    const defaultFields = [
      'Electrical Engineering',
      'Computer Engineering',
      'Artificial Intelligence',
    ];
    const set = new Set<string>(defaultFields);
    programs.forEach((p) => p.fields.forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, [programs]);

  // Filtering & Sorting Logic
  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => {
        // 1. Text Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = p.officialName.toLowerCase().includes(q);
          const matchesUni = p.university.toLowerCase().includes(q) || p.universities?.some(name => name.toLowerCase().includes(q));
          const matchesCountry = p.countries.some((c) =>
            c.toLowerCase().includes(q)
          );
          const matchesFields = p.fields.some((f) =>
            f.toLowerCase().includes(q)
          );
          const matchesCity = p.campusCities.some((c) =>
            c.city.toLowerCase().includes(q)
          );
          if (
            !matchesName &&
            !matchesUni &&
            !matchesCountry &&
            !matchesFields &&
            !matchesCity
          ) {
            return false;
          }
        }

        // 2. Region Filter
        if (filters.region !== 'ALL') {
          if (!p.assignedRegions.includes(filters.region)) {
            return false;
          }
        }

        // 3. Country Filter
        if (filters.country !== 'ALL') {
          if (!p.countries.includes(filters.country)) {
            return false;
          }
        }

        // 4. University Filter
        if (filters.university !== 'ALL') {
          if (p.university !== filters.university && !p.universities?.includes(filters.university)) {
            return false;
          }
        }

        // 5. Field Filter
        if (filters.field !== 'ALL') {
          if (!p.fields.includes(filters.field)) {
            return false;
          }
        }

        // 6. Degree Route Filter
        if (filters.degreeRoute !== 'ALL') {
          if (p.degreeRoute !== filters.degreeRoute) {
            return false;
          }
        }

        // 7. Program Structure Filter
        if (filters.programStructure !== 'ALL') {
          if (p.programStructure !== filters.programStructure) {
            return false;
          }
        }

        // 8. Medium of Instruction
        if (filters.mediumOfInstruction !== 'ALL') {
          if (p.mediumOfInstruction !== filters.mediumOfInstruction) {
            return false;
          }
        }

        // 9. Intake Filter
        if (filters.intakeFilter === 'Fall') {
          if (p.fallIntake.status === 'NotOffered') return false;
        } else if (filters.intakeFilter === 'Spring') {
          if (p.springIntake.status === 'NotOffered') return false;
        } else if (filters.intakeFilter === 'Rolling') {
          if (
            p.fallIntake.status !== 'Rolling' &&
            p.springIntake.status !== 'Rolling'
          ) {
            return false;
          }
        } else if (filters.intakeFilter === 'OpenUpcoming') {
          const hasDate =
            (p.fallIntake.status === 'FixedDeadline' &&
              p.fallIntake.deadlineDate) ||
            (p.springIntake.status === 'FixedDeadline' &&
              p.springIntake.deadlineDate);
          if (!hasDate) return false;
        }

        // 10. Funding Specific Filters
        const attachedFunding = funding.filter((f) => f.programId === p.id);

        if (filters.ethiopianEligibility !== 'ALL') {
          const hasEligible = attachedFunding.some(
            (f) => f.ethiopianEligibility === filters.ethiopianEligibility
          );
          if (!hasEligible) return false;
        }

        if (filters.fundingCoverage !== 'ALL') {
          const hasCoverage = attachedFunding.some(
            (f) => f.coverage === filters.fundingCoverage
          );
          if (!hasCoverage) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'recent') {
          return (b.informationLastChecked || '').localeCompare(
            a.informationLastChecked || ''
          );
        }
        if (filters.sortBy === 'university') {
          return a.university.localeCompare(b.university);
        }
        if (filters.sortBy === 'name') {
          return a.officialName.localeCompare(b.officialName);
        }

        // Default: Sort by next upcoming deadline date
        const getEarliestDeadline = (prog: Program): string => {
          const dates: string[] = [];
          if (
            prog.fallIntake.status === 'FixedDeadline' &&
            prog.fallIntake.deadlineDate
          ) {
            dates.push(prog.fallIntake.deadlineDate);
          }
          if (
            prog.springIntake.status === 'FixedDeadline' &&
            prog.springIntake.deadlineDate
          ) {
            dates.push(prog.springIntake.deadlineDate);
          }
          dates.sort();
          return dates[0] || '9999-99-99';
        };

        const dateA = getEarliestDeadline(a);
        const dateB = getEarliestDeadline(b);
        return dateA.localeCompare(dateB);
      });
  }, [programs, funding, filters]);

  return {
    availableCountries,
    availableUniversities,
    availableFields,
    filteredPrograms,
  };
}


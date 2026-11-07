import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredPrograms } from './useFilteredPrograms';
import { Program, FundingOpportunity } from '../types';
import { DEFAULT_FILTERS } from '../components/FilterBar';

const mockPrograms: Program[] = [
  {
    id: 'p1',
    officialName: 'Master in Artificial Intelligence',
    university: 'Nordic University',
    isJointProgram: false,
    countries: ['Sweden'],
    assignedRegions: ['Europe', 'Nordic countries'],
    campusCities: [{ city: 'Stockholm' }],
    officialLink: 'https://example.com',
    fields: ['Artificial Intelligence'],
    degreeRoute: 'Masters',
    programStructure: 'CourseworkPlusThesis',
    applyBeforeGraduation: 'Yes',
    mediumOfInstruction: 'English',
    englishProficiency: { acceptedTests: ['TOEFL'] },
    selectionSteps: [],
    fallIntake: {
      term: 'Fall 2027',
      status: 'FixedDeadline',
      startDate: '2026-10-15',
      deadlineDate: '2027-01-15',
    },
    springIntake: {
      term: 'Spring 2028',
      status: 'NotOffered',
    },
    informationLastChecked: '2026-11-01',
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'p2',
    officialName: 'PhD in Electrical Engineering',
    university: 'Gulf Institute',
    isJointProgram: false,
    countries: ['United Arab Emirates'],
    assignedRegions: ['GCC'],
    campusCities: [{ city: 'Abu Dhabi' }],
    officialLink: 'https://example.com',
    fields: ['Electrical Engineering'],
    degreeRoute: 'DirectPhD',
    programStructure: 'PhDCourseworkDissertation',
    applyBeforeGraduation: 'Yes',
    mediumOfInstruction: 'English',
    englishProficiency: { acceptedTests: ['IELTS'] },
    selectionSteps: [],
    fallIntake: {
      term: 'Fall 2027',
      status: 'FixedDeadline',
      startDate: '2026-09-01',
      deadlineDate: '2026-12-01',
    },
    springIntake: {
      term: 'Spring 2028',
      status: 'FixedDeadline',
      startDate: '2027-05-01',
      deadlineDate: '2027-09-15',
    },
    informationLastChecked: '2026-11-01',
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
];

const mockFunding: FundingOpportunity[] = [
  {
    id: 'f1',
    programId: 'p1',
    officialName: 'Nordic AI Scholarship',
    officialLink: 'https://example.com',
    fundingType: 'Scholarship',
    coverage: 'FullRide',
    ethiopianEligibility: 'OpenToEthiopian',
    monthlyStipend: {
      amount: 2000,
      currency: 'EUR',
      isZeroConfirmed: false,
      grossOrNet: 'Net',
      isUnpublished: false,
    },
    fallFunding: { term: 'Fall 2027', status: 'Offered', workflow: 'Automatic' },
    springFunding: { term: 'Spring 2028', status: 'NotOffered', workflow: 'Unclear' },
    competitiveness: {},
    informationLastChecked: '2026-11-01',
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
];

describe('useFilteredPrograms', () => {
  it('returns all programs with default filters', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, mockFunding, DEFAULT_FILTERS)
    );

    expect(result.current.filteredPrograms.length).toBe(2);
    expect(result.current.availableCountries).toEqual(['Sweden', 'United Arab Emirates']);
  });

  it('filters by search query', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, mockFunding, {
        ...DEFAULT_FILTERS,
        searchQuery: 'Nordic',
      })
    );

    expect(result.current.filteredPrograms.length).toBe(1);
    expect(result.current.filteredPrograms[0].id).toBe('p1');
  });

  it('filters by region', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, mockFunding, {
        ...DEFAULT_FILTERS,
        region: 'GCC',
      })
    );

    expect(result.current.filteredPrograms.length).toBe(1);
    expect(result.current.filteredPrograms[0].id).toBe('p2');
  });

  it('filters by Ethiopian applicant eligibility', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, mockFunding, {
        ...DEFAULT_FILTERS,
        ethiopianEligibility: 'OpenToEthiopian',
      })
    );

    expect(result.current.filteredPrograms.length).toBe(1);
    expect(result.current.filteredPrograms[0].id).toBe('p1');
  });

  it('sorts by deadline date correctly (earliest first)', () => {
    const { result } = renderHook(() =>
      useFilteredPrograms(mockPrograms, mockFunding, DEFAULT_FILTERS)
    );

    // p2 deadline is 2026-12-01, p1 is 2027-01-15 -> p2 should come first
    expect(result.current.filteredPrograms[0].id).toBe('p2');
    expect(result.current.filteredPrograms[1].id).toBe('p1');
  });
});


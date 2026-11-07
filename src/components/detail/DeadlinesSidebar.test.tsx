import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeadlinesSidebar } from './DeadlinesSidebar';
import { Program } from '../../types';

const baseProgram: Program = {
  id: 'test-p1',
  officialName: 'Master in Computer Science',
  university: 'Tech University',
  isJointProgram: false,
  countries: ['Sweden'],
  assignedRegions: ['Europe'],
  campusCities: [{ city: 'Stockholm' }],
  officialLink: 'https://example.com',
  fields: ['Computer Engineering'],
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
    notes: 'Apply via central portal.',
  },
  springIntake: {
    term: 'Spring 2028',
    status: 'NotOffered',
  },
  informationLastChecked: '2026-11-01',
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
};

describe('DeadlinesSidebar', () => {
  it('renders application dates heading and intake term', () => {
    render(<DeadlinesSidebar program={baseProgram} />);

    expect(screen.getByRole('heading', { name: /application dates/i })).toBeInTheDocument();
    expect(screen.getByText('Fall 2027')).toBeInTheDocument();
  });

  it('renders start date and end date for active intake', () => {
    render(<DeadlinesSidebar program={baseProgram} />);

    expect(screen.getByText('Opens')).toBeInTheDocument();
    expect(screen.getByText('15 Oct 2026')).toBeInTheDocument();
    expect(screen.getByText('Deadline')).toBeInTheDocument();
    expect(screen.getByText('15 Jan 2027')).toBeInTheDocument();
    expect(screen.getByText('Apply via central portal.')).toBeInTheDocument();
  });

  it('renders Not offered for secondary intake', () => {
    render(<DeadlinesSidebar program={baseProgram} />);

    expect(screen.getByText('Spring 2028')).toBeInTheDocument();
    expect(screen.getByText('Not offered')).toBeInTheDocument();
  });
});

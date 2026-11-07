import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IdentificationSection, UniversityPartner } from './IdentificationSection';

vi.mock('../../lib/universities', () => ({
  searchUniversities: vi.fn(async () => [{ id: 'aalto', name: 'Aalto University', country: 'Finland' }]),
}));

function Form({ joint }: { joint: boolean }) {
  const [singleUniversity, setSingleUniversity] = useState('');
  const [singleCountry, setSingleCountry] = useState('');
  const [partners, setPartners] = useState<UniversityPartner[]>([
    { university: '', country: '' }, { university: 'University of Oslo', country: 'Norway' },
  ]);
  return <IdentificationSection officialName="" setOfficialName={() => {}} isJointProgram={joint}
    setIsJointProgram={() => {}} singleUniversity={singleUniversity} setSingleUniversity={setSingleUniversity}
    singleCountry={singleCountry} setSingleCountry={setSingleCountry} partners={partners} setPartners={setPartners}
    consortiumName="" setConsortiumName={() => {}} existingUniversities={[]} officialLink="" setOfficialLink={() => {}} assignedRegions={[]} />;
}

describe('university country autofill', () => {
  it.each([false, true])('fills the matching country and allows manual corrections (consortium: %s)', async joint => {
    render(<Form joint={joint} />);
    fireEvent.click(screen.getByRole('button', { name: 'Search or enter university...' }));
    fireEvent.change(screen.getByPlaceholderText(joint ? 'Type university...' : 'Search university directory...'), { target: { value: 'Aalto' } });
    fireEvent.click(await screen.findByRole('option', { name: /Aalto University/ }));
    expect(screen.getByRole('button', { name: /Finland/ })).toBeInTheDocument();
    if (joint) expect(screen.getByRole('button', { name: /Norway/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Finland/ }));
    fireEvent.change(screen.getByPlaceholderText('Search country...'), { target: { value: 'Sweden' } });
    fireEvent.click(screen.getByRole('option', { name: 'Sweden' }));
    expect(screen.getByRole('button', { name: /Sweden/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Aalto University/ }));
    fireEvent.change(screen.getByPlaceholderText(joint ? 'Type university...' : 'Search university directory...'), { target: { value: 'Custom Institute' } });
    fireEvent.click(screen.getByRole('button', { name: /Use manual university name/ }));
    expect(screen.getByRole('button', { name: /Sweden/ })).toBeInTheDocument();
  });
});

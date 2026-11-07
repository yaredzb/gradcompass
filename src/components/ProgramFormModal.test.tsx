import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProgramFormModal } from './ProgramFormModal';
import { INITIAL_DEMO_PROGRAMS } from '../data/initialDemoRecords';
import { searchUniversities } from '../lib/universities';

vi.mock('../lib/universities', () => ({ searchUniversities: vi.fn() }));
const setup = (initialProgram = undefined as typeof INITIAL_DEMO_PROGRAMS[0] | undefined) => {
  const onSave = vi.fn();
  render(<ProgramFormModal initialProgram={initialProgram} existingUniversities={[]} existingFields={[]} onSave={onSave} onClose={vi.fn()} />);
  return onSave;
};
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('program institution selection', () => {
  beforeEach(() => { vi.mocked(searchUniversities).mockReset().mockResolvedValue([]); });

  it('reveals consortium fields and preserves entered names when switching modes', () => {
    setup();
    change('University *', 'University of Oslo');
    change('Program offered by', 'consortium');
    expect(screen.getByLabelText('University 1 *')).toHaveValue('University of Oslo');
    change('University 2 *', 'Aalto University');
    change('Program offered by', 'university');
    expect(screen.queryByLabelText('University 2 *')).not.toBeInTheDocument();
    change('Program offered by', 'consortium');
    expect(screen.getByLabelText('University 2 *')).toHaveValue('Aalto University');
    expect(screen.queryByRole('checkbox', { name: /Joint/ })).not.toBeInTheDocument();
  });

  it('saves distinct consortium universities with one country and reopens them for editing', async () => {
    const onSave = setup({ ...INITIAL_DEMO_PROGRAMS[0], isJointProgram: true, university: 'Nordic partnership', consortiumName: 'Nordic partnership', universities: ['University of Oslo', 'University of Bergen'], countries: ['Norway'] });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
    expect(onSave.mock.calls[0][0]).toMatchObject({ university: 'Nordic partnership', consortiumName: 'Nordic partnership', universities: ['University of Oslo', 'University of Bergen'], isJointProgram: true, countries: ['Norway'] });
  });

  it('rejects duplicate universities and incomplete partnerships', () => {
    const onSave = setup({ ...INITIAL_DEMO_PROGRAMS[0], isJointProgram: true, universities: ['University of Oslo', ' university of oslo '] });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    expect(screen.getByRole('alert')).toHaveTextContent('only once');
    change('University 2 *', '');
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    expect(screen.getByRole('alert')).toHaveTextContent('at least two');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('preserves the label of a legacy consortium with no member list', () => {
    setup({ ...INITIAL_DEMO_PROGRAMS[0], isJointProgram: true, university: 'Existing consortium', consortiumName: '', universities: [] });
    expect(screen.getByLabelText(/Consortium name/)).toHaveValue('Existing consortium');
    expect(screen.getByLabelText('University 1 *')).toHaveValue('');
    expect(screen.getByLabelText('University 2 *')).toHaveValue('');
  });

  it('uses keyboard search suggestions without changing the country selection', async () => {
    vi.mocked(searchUniversities).mockResolvedValue([{ id: 'ror:oslo', name: 'University of Oslo', country: 'Norway' }]);
    setup();
    change('University *', 'Oslo');
    await waitFor(() => expect(searchUniversities).toHaveBeenCalled());
    await screen.findByRole('option', { name: /University of Oslo/ });
    fireEvent.keyDown(screen.getByLabelText('University *'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByLabelText('University *'), { key: 'Enter' });
    expect(screen.getByLabelText('University *')).toHaveValue('University of Oslo');
    expect(screen.queryByText('Norway')).not.toBeInTheDocument();
  });

  it('allows manual entry when the university directory fails', async () => {
    vi.mocked(searchUniversities).mockImplementation(async () => { throw new Error('offline'); });
    setup();
    change('University *', 'New Institute');
    await screen.findByText('Search unavailable. You can enter a name manually.');
    fireEvent.click(screen.getByRole('button', { name: 'Use “New Institute”' }));
    expect(screen.getByLabelText('University *')).toHaveValue('New Institute');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

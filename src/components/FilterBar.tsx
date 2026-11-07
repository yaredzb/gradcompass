import React, { useState } from 'react';
import {
  DegreeRoute,
  ProgramStructure,
  MediumOfInstruction,
  EthiopianEligibility,
  FundingCoverage,
} from '../types';
import { FilterSearchHeader } from './filters/FilterSearchHeader';
import { FilterPresets } from './filters/FilterPresets';
import { FilterDrawer } from './filters/FilterDrawer';

export interface FilterState {
  searchQuery: string;
  region: string;
  country: string;
  university: string;
  field: string;
  degreeRoute: DegreeRoute | 'ALL';
  programStructure: ProgramStructure | 'ALL';
  mediumOfInstruction: MediumOfInstruction | 'ALL';
  ethiopianEligibility: EthiopianEligibility | 'ALL';
  fundingCoverage: FundingCoverage | 'ALL';
  intakeFilter: 'ALL' | 'Fall' | 'Spring' | 'Rolling' | 'OpenUpcoming';
  sortBy: 'deadline' | 'recent' | 'university' | 'name';
  // Quick Presets
  englishCourseworkOnly: boolean;
  fullRideEthiopian: boolean;
  directPhDOnly: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  region: 'ALL',
  country: 'ALL',
  university: 'ALL',
  field: 'ALL',
  degreeRoute: 'ALL',
  programStructure: 'ALL',
  mediumOfInstruction: 'ALL',
  ethiopianEligibility: 'ALL',
  fundingCoverage: 'ALL',
  intakeFilter: 'ALL',
  sortBy: 'deadline',
  englishCourseworkOnly: false,
  fullRideEthiopian: false,
  directPhDOnly: false,
};

export interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableRegions: string[];
  availableCountries: string[];
  availableUniversities: string[];
  availableFields: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  availableCountries,
  availableUniversities,
  availableFields,
  totalResults,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const resetFilters = () => {
    onChange(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    filters.region !== 'ALL' ||
    filters.country !== 'ALL' ||
    filters.university !== 'ALL' ||
    filters.field !== 'ALL' ||
    filters.degreeRoute !== 'ALL' ||
    filters.programStructure !== 'ALL' ||
    filters.mediumOfInstruction !== 'ALL' ||
    filters.ethiopianEligibility !== 'ALL' ||
    filters.fundingCoverage !== 'ALL' ||
    filters.intakeFilter !== 'ALL' ||
    filters.englishCourseworkOnly ||
    filters.fullRideEthiopian ||
    filters.directPhDOnly ||
    filters.searchQuery !== '';

  return (
    <div className="w-full space-y-3">
      {/* Search Bar & Drawer Trigger */}
      <FilterSearchHeader
        filters={filters}
        update={update}
        hasActiveFilters={hasActiveFilters}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Quick Action Presets */}
      <FilterPresets
        filters={filters}
        update={update}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        update={update}
        resetFilters={resetFilters}
        availableCountries={availableCountries}
        availableUniversities={availableUniversities}
        availableFields={availableFields}
        totalResults={totalResults}
      />
    </div>
  );
};

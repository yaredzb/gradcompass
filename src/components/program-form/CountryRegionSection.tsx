import React from 'react';
import { X, MapPin } from 'lucide-react';
import { formatRegionDisplay } from '../../utils/regions';

interface CountryRegionSectionProps {
  isJointProgram: boolean;
  setIsJointProgram: (val: boolean) => void;
  selectedCountries: string[];
  setSelectedCountries: (val: string[]) => void;
  countrySearch: string;
  setCountrySearch: (val: string) => void;
  filteredCountryList: string[];
  assignedRegions: string[];
}

export const CountryRegionSection: React.FC<CountryRegionSectionProps> = ({
  isJointProgram,
  setIsJointProgram,
  selectedCountries,
  setSelectedCountries,
  countrySearch,
  setCountrySearch,
  filteredCountryList,
  assignedRegions,
}) => {
  const handleJointToggle = (checked: boolean) => {
    setIsJointProgram(checked);
    if (!checked && selectedCountries.length > 1) {
      setSelectedCountries([selectedCountries[0]]);
    }
  };

  const removeCountry = (c: string) => {
    setSelectedCountries(selectedCountries.filter((item) => item !== c));
  };

  const addCountry = (c: string) => {
    if (isJointProgram) {
      if (!selectedCountries.includes(c)) {
        setSelectedCountries([...selectedCountries, c]);
      }
    } else {
      setSelectedCountries([c]);
    }
    setCountrySearch('');
  };

  return (
    <div className="space-y-3 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <div className="flex items-center justify-between">
        <h3
          className="font-bold text-slate-900 dark:text-white text-xs
            uppercase tracking-wider text-slate-500 font-mono"
        >
          02. Country & Region
        </h3>
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={isJointProgram}
            onChange={(e) => handleJointToggle(e.target.checked)}
            className="rounded"
          />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Joint / Multiple Host Countries Consortium
          </span>
        </label>
      </div>

      {/* Selected Country Pills */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Host Countries *
        </label>
        {selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] items-center mb-2">
            {selectedCountries.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F4EFE6] dark:bg-[#1E293B] text-slate-800 dark:text-slate-200 text-xs font-medium"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => removeCountry(c)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Country Autocomplete Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
        <div className="relative">
          <input
            type="text"
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            placeholder="Search country to add..."
            className="w-full px-3 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]"
          />
          {countrySearch && (
            <div className="absolute left-0 right-0 top-full mt-1 max-h-40 overflow-y-auto bg-white dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] rounded-md shadow-lg z-20 text-xs">
              {filteredCountryList.slice(0, 15).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => addCountry(c)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F4EFE6] dark:hover:bg-[#0F172A] block"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Regions display (only shown when a country is selected) */}
        {selectedCountries.length > 0 && assignedRegions.length > 0 && (
          <div
            className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0F172A] border
              border-[#E6DFD5] dark:border-[#334155] text-xs"
          >
            <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">
              Region
            </span>
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatRegionDisplay(assignedRegions)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


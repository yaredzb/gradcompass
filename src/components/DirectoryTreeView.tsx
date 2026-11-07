import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, MapPin, Globe, ExternalLink, GraduationCap, Award } from 'lucide-react';
import { Program, FundingOpportunity } from '../types';

interface DirectoryTreeViewProps {
  programs: Program[];
  funding: FundingOpportunity[];
  onSelectProgram: (program: Program) => void;
}

export const DirectoryTreeView: React.FC<DirectoryTreeViewProps> = ({
  programs,
  funding,
  onSelectProgram,
}) => {
  // Collapsed / Expanded sets
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({
    GCC: true,
    Europe: true,
    'Nordic countries': true,
    Asia: true,
    USA: true,
    Canada: true,
    Oceania: true,
    'Other regions': true,
  });

  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedUniversities, setExpandedUniversities] = useState<Record<string, boolean>>({});

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) => ({ ...prev, [region]: !prev[region] }));
  };

  const toggleCountry = (country: string) => {
    setExpandedCountries((prev) => ({ ...prev, [country]: !prev[country] }));
  };

  const toggleUniversity = (uni: string) => {
    setExpandedUniversities((prev) => ({ ...prev, [uni]: !prev[uni] }));
  };

  // Structured taxonomy: Region -> Country -> University -> Programs
  // For joint programs, program appears under EACH of its participating countries!
  interface TreeData {
    [region: string]: {
      isSubgroup?: boolean;
      countries: {
        [country: string]: {
          universities: {
            [university: string]: Program[];
          };
        };
      };
    };
  }

  const tree: TreeData = {
    GCC: { countries: {} },
    Europe: {
      countries: {},
    },
    'Nordic countries': {
      isSubgroup: true,
      countries: {},
    },
    Asia: { countries: {} },
    USA: { countries: {} },
    Canada: { countries: {} },
    Oceania: { countries: {} },
    'Other regions': { countries: {} },
  };

  programs.forEach((p) => {
    p.countries.forEach((country) => {
      // Determine region
      let targetRegion = 'Other regions';
      const isNordic = ['Denmark', 'Norway', 'Finland', 'Sweden'].includes(country);

      if (['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Bahrain', 'Kuwait', 'Oman'].includes(country)) {
        targetRegion = 'GCC';
      } else if (country === 'United States' || country === 'USA') {
        targetRegion = 'USA';
      } else if (country === 'Canada') {
        targetRegion = 'Canada';
      } else if (isNordic) {
        // Place in Nordic countries subgroup (within European scope)
        targetRegion = 'Nordic countries';
      } else if (['Japan', 'China', 'South Korea', 'Singapore', 'Malaysia', 'India', 'Taiwan'].includes(country)) {
        targetRegion = 'Asia';
      } else if (country === 'Australia' || country === 'New Zealand') {
        targetRegion = 'Oceania';
      } else if (
        ['Germany', 'France', 'Switzerland', 'United Kingdom', 'Netherlands', 'Italy', 'Spain', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Poland', 'Czechia'].includes(country)
      ) {
        targetRegion = 'Europe';
      }

      if (!tree[targetRegion]) {
        tree[targetRegion] = { countries: {} };
      }
      if (!tree[targetRegion].countries[country]) {
        tree[targetRegion].countries[country] = { universities: {} };
      }
      if (!tree[targetRegion].countries[country].universities[p.university]) {
        tree[targetRegion].countries[country].universities[p.university] = [];
      }

      // Add program if not already in list
      if (!tree[targetRegion].countries[country].universities[p.university].some((x) => x.id === p.id)) {
        tree[targetRegion].countries[country].universities[p.university].push(p);
      }
    });
  });

  return (
    <div className="w-full bg-white dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] rounded-xl p-4 sm:p-6 shadow-xs">
      <div className="mb-4 pb-3 border-b border-[#E6DFD5] dark:border-[#334155]">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-500" />
          Institutional Directory
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Explore opportunities hierarchically by Region → Country → University or Consortium. Joint programs appear under each member country.
        </p>
      </div>

      <div className="space-y-3">
        {Object.entries(tree).map(([regionName, regionData]) => {
          const countryKeys = Object.keys(regionData.countries);
          if (countryKeys.length === 0) return null;

          const isExpanded = !!expandedRegions[regionName];
          const isNordicSubgroup = regionName === 'Nordic countries';

          return (
            <div
              key={regionName}
              className={`rounded-lg border border-[#E6DFD5] dark:border-[#334155] overflow-hidden ${
                isNordicSubgroup ? 'ml-4 sm:ml-6 border-dashed' : ''
              }`}
            >
              {/* Region Header */}
              <button
                onClick={() => toggleRegion(regionName)}
                className="w-full px-3 sm:px-4 py-2.5 min-h-[44px] bg-[#F4EFE6]/70 dark:bg-[#0F172A]/70 flex items-center justify-between text-left hover:bg-[#F4EFE6] dark:hover:bg-[#0F172A] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {regionName}
                  </span>
                  {isNordicSubgroup && (
                    <span className="text-[11px] text-slate-500 font-normal">
                      (Europe Subgroup)
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {countryKeys.length} {countryKeys.length === 1 ? 'country' : 'countries'}
                </span>
              </button>

              {/* Country List */}
              {isExpanded && (
                <div className="p-2 sm:p-3 space-y-2 bg-white dark:bg-[#1E293B]">
                  {countryKeys.map((countryName) => {
                    const countryData = regionData.countries[countryName];
                    const uniKeys = Object.keys(countryData.universities);
                    const isCountryOpen = !!expandedCountries[countryName];

                    return (
                      <div
                        key={countryName}
                        className="rounded-md border border-[#E6DFD5]/70 dark:border-[#334155]/70 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleCountry(countryName)}
                          className="w-full px-3 py-2.5 min-h-[42px] bg-slate-50 dark:bg-[#0F172A]/40 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-[#0F172A] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {isCountryOpen ? (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {countryName}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {uniKeys.length} {uniKeys.length === 1 ? 'institution' : 'institutions'}
                          </span>
                        </button>

                        {/* University List */}
                        {isCountryOpen && (
                          <div className="p-2 sm:p-3 space-y-2 bg-white dark:bg-[#1E293B]">
                            {uniKeys.map((uniName) => {
                              const uniPrograms = countryData.universities[uniName];
                              const isUniOpen = !!expandedUniversities[uniName];

                              return (
                                <div
                                  key={uniName}
                                  className="rounded border border-[#E6DFD5]/50 dark:border-[#334155]/50 p-2 text-xs"
                                >
                                  <div
                                    onClick={() => toggleUniversity(uniName)}
                                    className="cursor-pointer flex items-center justify-between text-slate-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span className="font-semibold">{uniName}</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-400">
                                      {uniPrograms.length} program{uniPrograms.length === 1 ? '' : 's'}
                                    </span>
                                  </div>

                                  {/* Programs under this university */}
                                  {isUniOpen && (
                                    <div className="mt-2 pl-4 sm:pl-5 space-y-1.5 border-l border-[#E6DFD5] dark:border-[#334155]">
                                      {uniPrograms.map((prog) => {
                                        const progFunding = funding.filter(
                                          (f) => f.programId === prog.id
                                        );

                                        return (
                                          <div
                                            key={prog.id}
                                            onClick={() => onSelectProgram(prog)}
                                            className="group/item cursor-pointer p-1.5 rounded hover:bg-[#F4EFE6]/60 dark:hover:bg-[#0F172A]/60 transition-colors flex items-start justify-between gap-2"
                                          >
                                            <div>
                                              <div className="font-medium text-slate-800 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                                                {prog.officialName}
                                              </div>
                                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                                                <span>
                                                  {prog.degreeRoute === 'Masters'
                                                    ? 'Master’s'
                                                    : prog.degreeRoute === 'DirectPhD'
                                                    ? 'Direct PhD'
                                                    : prog.degreeRoute === 'MastersRequiredPhD'
                                                    ? 'PhD (Requires Master’s)'
                                                    : prog.degreeRoute === 'IntegratedMastersPhD'
                                                    ? 'Integrated M-PhD'
                                                    : prog.directPhDEntry === 'Unclear'
                                                    ? 'Unclear (PhD Entry)'
                                                    : 'Unclear'}
                                                </span>
                                                <span aria-hidden="true">·</span>
                                                <span>{prog.mediumOfInstruction}</span>
                                                {prog.isJointProgram && (
                                                  <>
                                                    <span aria-hidden="true">·</span>
                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                      Joint Program
                                                    </span>
                                                  </>
                                                )}
                                                {progFunding.length > 0 && (
                                                  <>
                                                    <span aria-hidden="true">·</span>
                                                    <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-0.5">
                                                      <Award className="w-3 h-3 text-slate-400" />
                                                      {progFunding.length} award{progFunding.length === 1 ? '' : 's'}
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>

                                            <span className="text-slate-400 hover:text-slate-800 dark:hover:text-white shrink-0 p-1">
                                              <ExternalLink className="w-3 h-3" />
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

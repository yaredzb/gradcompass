import React, { useCallback } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { SearchableDropdown, DropdownOption } from './SearchableDropdown';
import { ALL_COUNTRIES, formatRegionDisplay } from '../../utils/regions';
import { searchUniversities } from '../../lib/universities';

export const institutionInputClass =
  'w-full min-h-11 px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white';

export interface UniversityPartner {
  university: string;
  country: string;
}

function matchingCountry(country?: string) {
  const aliases: Record<string, string> = {
    'türkiye': 'Turkey',
    'united states of america': 'United States',
    'czech republic': 'Czechia',
    'russian federation': 'Russia',
    'republic of korea': 'South Korea',
    'viet nam': 'Vietnam',
  };
  const name = country?.trim().toLowerCase() || '';
  return ALL_COUNTRIES.find(item => item.toLowerCase() === name) || aliases[name];
}

interface IdentificationSectionProps {
  officialName: string;
  setOfficialName: (value: string) => void;
  isJointProgram: boolean;
  setIsJointProgram: (value: boolean) => void;
  singleUniversity: string;
  setSingleUniversity: (value: string) => void;
  singleCountry: string;
  setSingleCountry: (value: string) => void;
  consortiumName: string;
  setConsortiumName: (value: string) => void;
  partners: UniversityPartner[];
  setPartners: (value: UniversityPartner[]) => void;
  existingUniversities: string[];
  officialLink: string;
  setOfficialLink: (value: string) => void;
  assignedRegions: string[];
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  officialName,
  setOfficialName,
  isJointProgram,
  setIsJointProgram,
  singleUniversity,
  setSingleUniversity,
  singleCountry,
  setSingleCountry,
  consortiumName,
  setConsortiumName,
  partners,
  setPartners,
  existingUniversities,
  officialLink,
  setOfficialLink,
  assignedRegions,
}) => {
  // Remote ROR directory lookup
  const searchRemoteUniversities = useCallback(async (
    query: string,
    signal?: AbortSignal
  ): Promise<DropdownOption[]> => {
    try {
      const results = await searchUniversities(query, signal);
      return results.map((item) => ({
        value: item.name,
        label: item.name,
        sublabel: item.country ? `Location: ${item.country}` : undefined,
        country: matchingCountry(item.country),
      }));
    } catch {
      return [];
    }
  }, []);

  const handlePartnerChange = (
    index: number,
    field: 'university' | 'country',
    val: string
  ) => {
    const updated = partners.map((p, i) =>
      i === index ? { ...p, [field]: val } : p
    );
    setPartners(updated);
  };

  const addPartner = () => {
    setPartners([...partners, { university: '', country: '' }]);
  };

  const removePartner = (index: number) => {
    if (partners.length > 2) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-500 font-mono">
          01. Program Essentials & Institution(s)
        </h3>
      </div>

      {/* Program Offered By (Single vs Consortium) */}
      <div>
        <label
          htmlFor="program-offered-by"
          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Program offered by *
        </label>
        <select
          id="program-offered-by"
          value={isJointProgram ? 'consortium' : 'single'}
          onChange={(e) => {
            const isJoint = e.target.value === 'consortium';
            setIsJointProgram(isJoint);
            if (isJoint && partners.length < 2) {
              setPartners([
                { university: singleUniversity || '', country: singleCountry || '' },
                { university: '', country: '' },
              ]);
            }
          }}
          className={institutionInputClass}
        >
          <option value="single">Single university</option>
          <option value="consortium">Consortium / university partnership</option>
        </select>
      </div>

      {/* Official Program Name */}
      <div>
        <label
          htmlFor="official-program-name"
          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Official Program Name *
        </label>
        <input
          id="official-program-name"
          type="text"
          required
          value={officialName}
          onChange={(e) => setOfficialName(e.target.value)}
          placeholder="e.g. Nordic Master in Embedded Artificial Intelligence"
          className={institutionInputClass}
        />
      </div>

      {/* CASE A: Single University Mode */}
      {!isJointProgram && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              University *
            </label>
            <SearchableDropdown
              value={singleUniversity}
              onChange={(val, option) => {
                setSingleUniversity(val);
                if (option?.country) setSingleCountry(option.country);
              }}
              options={existingUniversities}
              placeholder="Search or enter university..."
              searchPlaceholder="Search university directory..."
              allowCustom={true}
              customLabel="Use manual university name"
              onAsyncSearch={searchRemoteUniversities}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Country *
            </label>
            <SearchableDropdown
              value={singleCountry}
              onChange={(val) => setSingleCountry(val)}
              options={ALL_COUNTRIES}
              placeholder="Select host country..."
              searchPlaceholder="Search country..."
              allowCustom={false}
            />
          </div>
        </div>
      )}

      {/* CASE B: Consortium / Partnership Mode */}
      {isJointProgram && (
        <div className="space-y-3 p-3.5 rounded-xl border border-[#E6DFD5] dark:border-[#334155] bg-slate-50/60 dark:bg-[#0F172A]/40">
          <div>
            <label
              htmlFor="consortium-name"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Consortium Name <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="consortium-name"
              type="text"
              value={consortiumName}
              onChange={(e) => setConsortiumName(e.target.value)}
              placeholder="e.g. Nordic Master Consortium in Autonomous Systems"
              className={institutionInputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Participating Universities & Host Countries *
            </label>

            <div className="space-y-2.5">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2.5 rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-w-0">
                    <div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        University {index + 1} *
                      </span>
                      <SearchableDropdown
                        value={partner.university}
                        onChange={(val, option) => setPartners(partners.map((item, position) =>
                          position === index ? { ...item, university: val, country: option?.country || item.country } : item
                        ))}
                        options={existingUniversities}
                        placeholder="Search or enter university..."
                        searchPlaceholder="Type university..."
                        allowCustom={true}
                        customLabel="Use manual university name"
                        onAsyncSearch={searchRemoteUniversities}
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        Country {index + 1} *
                      </span>
                      <SearchableDropdown
                        value={partner.country}
                        onChange={(val) => handlePartnerChange(index, 'country', val)}
                        options={ALL_COUNTRIES}
                        placeholder="Select country..."
                        searchPlaceholder="Search country..."
                        allowCustom={false}
                      />
                    </div>
                  </div>

                  {partners.length > 2 && (
                    <button
                      type="button"
                      aria-label={`Remove partner ${index + 1}`}
                      onClick={() => removePartner(index)}
                      className="mt-6 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPartner}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              <Plus size={15} />
              <span>Add another university partner</span>
            </button>
          </div>
        </div>
      )}

      {/* Auto-detected Region Pill */}
      {assignedRegions.length > 0 && (
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0F172A] border border-[#E6DFD5] dark:border-[#334155] text-xs flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400">
            {isJointProgram ? 'Assigned regions:' : 'Assigned region:'}
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatRegionDisplay(assignedRegions)}
          </span>
        </div>
      )}

      {/* Official Program Website */}
      <div>
        <label
          htmlFor="official-program-link"
          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Official Program Website
        </label>
        <input
          id="official-program-link"
          type="url"
          value={officialLink}
          onChange={(e) => setOfficialLink(e.target.value)}
          placeholder="https://..."
          className={institutionInputClass}
        />
      </div>
    </section>
  );
};

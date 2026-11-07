import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CampusCityCost } from '../../types';

interface CampusCitiesSectionProps {
  campusCities: CampusCityCost[];
  setCampusCities: (val: CampusCityCost[]) => void;
  informationLastChecked: string;
  setInformationLastChecked: (val: string) => void;
}

export const CampusCitiesSection: React.FC<CampusCitiesSectionProps> = ({
  campusCities,
  setCampusCities,
  informationLastChecked,
  setInformationLastChecked,
}) => {
  const addCityRow = () => {
    setCampusCities([
      ...campusCities,
      {
        city: '',
        minMonthlyCost: '',
        typicalMonthlyCost: '',
        currency: 'USD',
        sourceLink: '',
      },
    ]);
  };

  const updateCityRow = (index: number, partial: Partial<CampusCityCost>) => {
    const updated = [...campusCities];
    updated[index] = { ...updated[index], ...partial };
    setCampusCities(updated);
  };

  const removeCityRow = (index: number) => {
    if (campusCities.length > 1) {
      setCampusCities(campusCities.filter((_, i) => i !== index));
    } else {
      setCampusCities([
        {
          city: '',
          minMonthlyCost: '',
          typicalMonthlyCost: '',
          currency: 'USD',
          sourceLink: '',
        },
      ]);
    }
  };

  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="font-bold text-slate-900 dark:text-white text-xs
              uppercase tracking-wider text-slate-500 font-mono"
          >
            09. Campus City Living Cost Estimates
          </h3>
          <p className="text-[11px] text-slate-500">
            For multi-campus or consortium degrees, enter estimates per city.
          </p>
        </div>
        <button
          type="button"
          onClick={addCityRow}
          className="px-2.5 py-1 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-[#F4EFE6] dark:bg-[#1E293B] hover:bg-[#E6DFD5] font-medium flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add City Row</span>
        </button>
      </div>

      <div className="space-y-3">
        {campusCities.map((cityObj, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-[#E6DFD5] dark:border-[#334155] space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                City #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeCityRow(idx)}
                className="text-slate-400 hover:text-red-500 p-1"
                title="Remove city"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  City Name
                </label>
                <input
                  type="text"
                  value={cityObj.city}
                  onChange={(e) => updateCityRow(idx, { city: e.target.value })}
                  placeholder="City name"
                  className="w-full px-2 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Currency
                </label>
                <input
                  type="text"
                  value={cityObj.currency}
                  onChange={(e) =>
                    updateCityRow(idx, { currency: e.target.value.toUpperCase() })
                  }
                  placeholder="USD"
                  className="w-full px-2 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Min Monthly Cost
                </label>
                <input
                  type="number"
                  value={cityObj.minMonthlyCost}
                  onChange={(e) =>
                    updateCityRow(idx, {
                      minMonthlyCost:
                        e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  placeholder="Min cost"
                  className="w-full px-2 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Typical Monthly Cost
                </label>
                <input
                  type="number"
                  value={cityObj.typicalMonthlyCost}
                  onChange={(e) =>
                    updateCityRow(idx, {
                      typicalMonthlyCost:
                        e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  placeholder="Typical cost"
                  className="w-full px-2 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">
                Cost Source Reference Link
              </label>
              <input
                type="url"
                value={cityObj.sourceLink || ''}
                onChange={(e) => updateCityRow(idx, { sourceLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-2 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Information Last Verified */}
      <div className="pt-2">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Information Last Verified Date
        </label>
        <input
          type="date"
          value={informationLastChecked}
          onChange={(e) => setInformationLastChecked(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] font-mono"
        />
      </div>
    </div>
  );
};


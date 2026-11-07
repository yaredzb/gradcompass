import React from 'react';

interface IdentificationSectionProps {
  officialName: string;
  setOfficialName: (val: string) => void;
  university: string;
  setUniversity: (val: string) => void;
  customUniversity: string;
  setCustomUniversity: (val: string) => void;
  isNewUniversity: boolean;
  setIsNewUniversity: (val: boolean) => void;
  existingUniversities: string[];
  officialLink: string;
  setOfficialLink: (val: string) => void;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  officialName,
  setOfficialName,
  university,
  setUniversity,
  customUniversity,
  setCustomUniversity,
  isNewUniversity,
  setIsNewUniversity,
  existingUniversities,
  officialLink,
  setOfficialLink,
}) => {
  return (
    <div className="space-y-4">
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider text-slate-500 font-mono"
      >
        01. Institution & Program Identification
      </h3>

      {/* Official Name */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Official Program Name *
        </label>
        <input
          type="text"
          required
          value={officialName}
          onChange={(e) => setOfficialName(e.target.value)}
          placeholder="e.g. M.Sc. in Electrical Engineering"
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
            border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
            text-slate-900 dark:text-white focus:outline-none focus:ring-1
            focus:ring-slate-900"
        />
      </div>

      {/* University Selection / Autocomplete */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            University or Consortium *
          </label>
          {!isNewUniversity ? (
            <select
              value={university}
              onChange={(e) => {
                if (e.target.value === '__NEW__') {
                  setIsNewUniversity(true);
                } else {
                  setUniversity(e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
                border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
                text-slate-900 dark:text-white"
            >
              <option value="">Select an existing institution...</option>
              {existingUniversities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
              <option value="__NEW__">
                + Add new institution or consortium...
              </option>
            </select>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                required
                value={customUniversity}
                onChange={(e) => setCustomUniversity(e.target.value)}
                placeholder="University name"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
                  border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
                  text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setIsNewUniversity(false)}
                className="px-2 py-2 text-xs border rounded text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Official Program Website URL
          </label>
          <input
            type="url"
            value={officialLink}
            onChange={(e) => setOfficialLink(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border
              border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A]
              text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};


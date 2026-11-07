import React, { useId } from 'react';
import { X, Plus, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { EnglishPolicy } from '../../types';

interface EnglishProficiencySectionProps {
  englishPolicy: EnglishPolicy;
  setEnglishPolicy: (val: EnglishPolicy) => void;
  englishTests: string[];
  setEnglishTests: (val: string[]) => void;
  newEnglishTest: string;
  setNewEnglishTest: (val: string) => void;
  englishMinimumScores: string;
  setEnglishMinimumScores: (val: string) => void;
  englishWaivers: string;
  setEnglishWaivers: (val: string) => void;
}

const COMMON_TESTS = [
  'TOEFL iBT',
  'IELTS Academic',
  'Duolingo (DET)',
  'PTE Academic',
  'Cambridge C1/C2',
];

export const EnglishProficiencySection: React.FC<EnglishProficiencySectionProps> = ({
  englishPolicy,
  setEnglishPolicy,
  englishTests,
  setEnglishTests,
  newEnglishTest,
  setNewEnglishTest,
  englishMinimumScores,
  setEnglishMinimumScores,
  englishWaivers,
  setEnglishWaivers,
}) => {
  const policyId = useId();

  const toggleCommonTest = (testName: string) => {
    if (englishTests.includes(testName)) {
      setEnglishTests(englishTests.filter((t) => t !== testName));
    } else {
      setEnglishTests([...englishTests, testName]);
    }
  };

  const handleAddCustomTest = () => {
    const trimmed = newEnglishTest.trim();
    if (trimmed && !englishTests.includes(trimmed)) {
      setEnglishTests([...englishTests, trimmed]);
      setNewEnglishTest('');
    }
  };

  const removeTest = (test: string) => {
    setEnglishTests(englishTests.filter((t) => t !== test));
  };

  const customTests = englishTests.filter(
    (t) =>
      !COMMON_TESTS.includes(t) &&
      t !== 'MOI Certificate' &&
      t !== 'Medium of Instruction Certificate'
  );

  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-500 font-mono">
        06. English Language Proficiency & Waivers
      </h3>

      {/* Primary 3-Option Policy Selector */}
      <div>
        <label
          htmlFor={policyId}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          English Language Policy *
        </label>
        <select
          id={policyId}
          value={englishPolicy}
          onChange={(e) => setEnglishPolicy(e.target.value as EnglishPolicy)}
          className="w-full sm:w-auto min-h-11 px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white font-medium"
        >
          <option value="WaivedByMOI">
            Test required, but waived by MOI certificate (English-medium degree)
          </option>
          <option value="StrictlyRequired">
            Strictly required — No MOI waiver (must submit formal test)
          </option>
          <option value="NotRequired">
            No test required (not requested / native English instruction)
          </option>
        </select>
      </div>

      {/* Case 1: Waived by MOI Banner */}
      {englishPolicy === 'WaivedByMOI' && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
          <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <strong className="font-semibold">MOI Exemption Active:</strong> Applicants whose undergraduate degree was taught in English can be exempt with an official university confirmation letter.
          </div>
        </div>
      )}

      {/* Case 2: Strictly Required Banner */}
      {englishPolicy === 'StrictlyRequired' && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <strong className="font-semibold">Strict Test Requirement:</strong> All international applicants must submit an approved standardized English test. MOI degree letters are not accepted.
          </div>
        </div>
      )}

      {/* Case 3: Test Options & Scores (only when testing is relevant) */}
      {englishPolicy !== 'NotRequired' && (
        <div className="p-3.5 bg-slate-50/70 dark:bg-[#0F172A]/50 rounded-xl border border-[#E6DFD5] dark:border-[#334155] space-y-4">
          {/* Accepted Standardized Tests */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Accepted Standardized Tests <span className="font-normal text-slate-400">(click to toggle)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_TESTS.map((test) => {
                const isSelected = englishTests.includes(test);
                return (
                  <button
                    type="button"
                    key={test}
                    onClick={() => toggleCommonTest(test)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-2xs font-semibold'
                        : 'bg-white dark:bg-[#1E293B] border-[#E6DFD5] dark:border-[#334155] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check size={13} className="shrink-0" />}
                    <span>{test}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom / Other Test Pills */}
            {customTests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-[#E6DFD5]/60 dark:border-[#334155]/60">
                <span className="text-[11px] text-slate-400 self-center mr-1">Other:</span>
                {customTests.map((test) => (
                  <span
                    key={test}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <span>{test}</span>
                    <button
                      type="button"
                      onClick={() => removeTest(test)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input to add other tests */}
            <div className="flex gap-2 mt-2.5 max-w-sm">
              <input
                type="text"
                value={newEnglishTest}
                onChange={(e) => setNewEnglishTest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTest();
                  }
                }}
                placeholder="Other test (e.g. Oxford ELLT)..."
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddCustomTest}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Minimum Scores */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Minimum Score Benchmarks
            </label>
            <input
              type="text"
              value={englishMinimumScores}
              onChange={(e) => setEnglishMinimumScores(e.target.value)}
              placeholder="e.g. TOEFL iBT 90 (min 20 writing) or IELTS 6.5 (min 6.0 in each subscore)"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white"
            />
          </div>

          {/* Waiver & MOI Conditions */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {englishPolicy === 'WaivedByMOI'
                ? 'MOI Certificate & Waiver Criteria'
                : 'Exemption / Waiver Notes'}
            </label>
            <textarea
              rows={2}
              value={englishWaivers}
              onChange={(e) => setEnglishWaivers(e.target.value)}
              placeholder={
                englishPolicy === 'WaivedByMOI'
                  ? 'e.g. Full exemption granted if undergraduate degree was taught 100% in English. Must submit official registrar MOI confirmation letter.'
                  : 'e.g. Only native citizens of recognized English-speaking countries are exempt.'
              }
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};

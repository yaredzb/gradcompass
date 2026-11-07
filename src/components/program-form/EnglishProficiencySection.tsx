import React from 'react';
import { X, Plus } from 'lucide-react';

interface EnglishProficiencySectionProps {
  englishTests: string[];
  setEnglishTests: (val: string[]) => void;
  newEnglishTest: string;
  setNewEnglishTest: (val: string) => void;
  englishMinimumScores: string;
  setEnglishMinimumScores: (val: string) => void;
  englishWaivers: string;
  setEnglishWaivers: (val: string) => void;
}

export const EnglishProficiencySection: React.FC<EnglishProficiencySectionProps> = ({
  englishTests,
  setEnglishTests,
  newEnglishTest,
  setNewEnglishTest,
  englishMinimumScores,
  setEnglishMinimumScores,
  englishWaivers,
  setEnglishWaivers,
}) => {
  const handleAddTest = () => {
    const trimmed = newEnglishTest.trim();
    if (trimmed && !englishTests.includes(trimmed)) {
      setEnglishTests([...englishTests, trimmed]);
      setNewEnglishTest('');
    }
  };

  const removeTest = (test: string) => {
    setEnglishTests(englishTests.filter((t) => t !== test));
  };

  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider text-slate-500 font-mono"
      >
        06. English Language Proficiency & Waivers
      </h3>

      <div className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-xl border border-[#E6DFD5] dark:border-[#334155] space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Accepted English Tests
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {englishTests.map((test) => (
              <span
                key={test}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] text-xs font-medium"
              >
                <span>{test}</span>
                <button
                  type="button"
                  onClick={() => removeTest(test)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newEnglishTest}
              onChange={(e) => setNewEnglishTest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTest();
                }
              }}
              placeholder="Add test (e.g. Duolingo)..."
              className="flex-1 px-2.5 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
            />
            <button
              type="button"
              onClick={handleAddTest}
              className="px-3 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-[#F4EFE6] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Test</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Minimum Score Requirements
          </label>
          <input
            type="text"
            value={englishMinimumScores}
            onChange={(e) => setEnglishMinimumScores(e.target.value)}
            placeholder="e.g. TOEFL 90, IELTS 6.5"
            className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Waiver Conditions (e.g. MOI certificate from English-medium undergraduate study)
          </label>
          <input
            type="text"
            value={englishWaivers}
            onChange={(e) => setEnglishWaivers(e.target.value)}
            placeholder="e.g. English-medium degree waiver"
            className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
          />
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { X, Plus } from 'lucide-react';

interface FieldsSectionProps {
  fields: string[];
  setFields: (val: string[]) => void;
  newFieldInput: string;
  setNewFieldInput: (val: string) => void;
}

export const FieldsSection: React.FC<FieldsSectionProps> = ({
  fields,
  setFields,
  newFieldInput,
  setNewFieldInput,
}) => {
  const handleAddField = () => {
    const trimmed = newFieldInput.trim();
    if (trimmed && !fields.includes(trimmed)) {
      setFields([...fields, trimmed]);
      setNewFieldInput('');
    }
  };

  const removeField = (f: string) => {
    setFields(fields.filter((item) => item !== f));
  };

  return (
    <div className="space-y-3 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider text-slate-500 font-mono"
      >
        03. Fields & Specializations (EE, CE, AI Disciplines)
      </h3>

      {fields.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 p-2 rounded-lg border
            border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] items-center"
        >
          {fields.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded
                bg-[#F4EFE6] dark:bg-[#1E293B] text-slate-800 dark:text-slate-200 text-xs font-medium"
            >
              <span>{f}</span>
              <button
                type="button"
                onClick={() => removeField(f)}
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newFieldInput}
          onChange={(e) => setNewFieldInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddField();
            }
          }}
          placeholder="Add discipline (e.g. Robotics)..."
          className="flex-1 px-3 py-1.5 text-xs rounded border border-[#E6DFD5]
            dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-200"
        />
        <button
          type="button"
          onClick={handleAddField}
          className="px-3 py-1.5 text-xs rounded border border-[#E6DFD5]
            dark:border-[#334155] bg-[#F4EFE6] dark:bg-[#1E293B] hover:bg-[#E6DFD5]
            dark:hover:bg-[#334155] font-medium flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Discipline</span>
        </button>
      </div>
    </div>
  );
};


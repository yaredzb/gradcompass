import React, { useState, useRef, useEffect, useId } from 'react';
import { Search, ChevronDown, X, Check, Plus } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  country?: string;
}

interface SearchableDropdownProps {
  value: string;
  onChange: (val: string, meta?: DropdownOption) => void;
  options?: (string | DropdownOption)[];
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  customLabel?: string;
  onAsyncSearch?: (query: string, signal?: AbortSignal) => Promise<DropdownOption[]>;
  id?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  allowCustom = false,
  customLabel = 'Use custom name',
  onAsyncSearch,
  id,
}) => {
  const generatedId = useId();
  const dropdownId = id || generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [asyncResults, setAsyncResults] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize static options
  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Filter static options
  const filteredStatic = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Merge static and async results, deduplicating by label
  const allResults: DropdownOption[] = [...asyncResults];
  filteredStatic.forEach((stat) => {
    if (!allResults.some((res) => res.label.toLowerCase() === stat.label.toLowerCase())) {
      allResults.push(stat);
    }
  });

  // Async search handler with debouncing
  useEffect(() => {
    if (!isOpen || !onAsyncSearch || searchQuery.trim().length < 1) {
      setAsyncResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const timer = setTimeout(() => {
      onAsyncSearch(searchQuery.trim(), controller.signal)
        .then((res) => {
          if (!controller.signal.aborted) setAsyncResults(res);
        })
        .catch(() => {
          if (!controller.signal.aborted) setAsyncResults([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, isOpen, onAsyncSearch]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (val: string, meta?: DropdownOption) => {
    onChange(val, meta);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const isExactMatch = allResults.some(
    (opt) => opt.label.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Dropdown Trigger Box (Acts like a true select) */}
      <button
        type="button"
        id={dropdownId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery('');
        }}
        className={`w-full min-h-11 px-3 py-2 text-left text-xs sm:text-sm rounded-lg border transition-colors flex items-center justify-between gap-2 cursor-pointer
          ${
            isOpen
              ? 'border-slate-800 ring-1 ring-slate-800 dark:border-white dark:ring-white'
              : 'border-[#E6DFD5] dark:border-[#334155] hover:border-slate-400 dark:hover:border-slate-500'
          }
          bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white`}
      >
        <span className="truncate flex-1">
          {value ? (
            <span className="font-medium text-slate-900 dark:text-white">{value}</span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {value && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e as any)}
              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
          />
        </div>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] rounded-xl shadow-xl overflow-hidden flex flex-col max-h-72">
          {/* Search Input Box */}
          <div className="p-2 border-b border-[#E6DFD5] dark:border-[#334155] bg-slate-50/70 dark:bg-[#0F172A]/70 flex items-center gap-2">
            <Search size={15} className="text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsOpen(false);
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  if (allResults.length > 0) {
                    handleSelect(allResults[0].value, allResults[0]);
                  } else if (allowCustom && searchQuery.trim()) {
                    handleSelect(searchQuery.trim());
                  }
                }
              }}
              className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 py-1"
            />
          </div>

          {/* Options List */}
          <div role="listbox" className="overflow-y-auto flex-1 divide-y divide-[#E6DFD5]/40 dark:divide-[#334155]/40">
            {isLoading && (
              <div className="p-3 text-center text-xs text-slate-400">Searching directory…</div>
            )}

            {/* Custom value entry option if not in the list */}
            {allowCustom && searchQuery.trim() && !isExactMatch && (
              <button
                type="button"
                onClick={() => handleSelect(searchQuery.trim())}
                className="w-full px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2"
              >
                <Plus size={14} className="shrink-0" />
                <span>
                  {customLabel}: <strong className="underline font-semibold">{searchQuery.trim()}</strong>
                </span>
              </button>
            )}

            {!isLoading && allResults.length === 0 && !searchQuery.trim() && (
              <div className="p-4 text-center text-xs text-slate-400">Type to search options</div>
            )}

            {!isLoading && allResults.length === 0 && searchQuery.trim() && !allowCustom && (
              <div className="p-4 text-center text-xs text-slate-400">No matches found</div>
            )}

            {allResults.slice(0, 30).map((opt) => {
              const isSelected = value.toLowerCase() === opt.value.toLowerCase();
              return (
                <button
                  type="button"
                  key={opt.value + opt.label}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value, opt)}
                  className={`w-full px-3 py-2 text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer
                    ${
                      isSelected
                        ? 'bg-[#F4EFE6] dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-[#0F172A] text-slate-800 dark:text-slate-200'
                    }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{opt.label}</div>
                    {opt.sublabel && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check size={14} className="text-slate-900 dark:text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


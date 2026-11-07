import React, { useEffect, useId, useState } from 'react';
import { Search } from 'lucide-react';
import { searchUniversities, UniversitySuggestion } from '../../lib/universities';

export const institutionInputClass = 'w-full min-h-11 px-3 py-2.5 text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600';

export function UniversitySearch({ value, onChange, label, existingUniversities }: {
  value: string; onChange: (value: string) => void; label: string; existingUniversities: string[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<UniversitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState(-1);
  const query = value.trim();
  const local = [...new Set(existingUniversities)].filter(name => name.toLowerCase().includes(query.toLowerCase()));
  const options = [...results, ...local.filter(name => !results.some(item => item.name.toLowerCase() === name.toLowerCase())).map(name => ({ id: name, name, country: '' }))].slice(0, 8);
  useEffect(() => {
    setResults([]); setError(''); setActive(-1);
    if (!open || query.length < 2) { setLoading(false); return; }
    const controller = new AbortController();
    setLoading(true);
    const timeout = window.setTimeout(() => {
      searchUniversities(query, controller.signal).then(items => {
        if (!controller.signal.aborted) setResults(items);
      }).catch(() => {
        if (!controller.signal.aborted) setError('Search unavailable. You can enter a name manually.');
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 300);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [query, open]);
  const choose = (name: string) => { onChange(name); setOpen(false); };
  return <div className="relative" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
  }}>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
    <div className="relative">
      <Search size={16} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
      <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={open && query.length >= 2}
        aria-controls={`${id}-options`} aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined}
        autoComplete="off" value={value} placeholder="Search university name…" className={`${institutionInputClass} pl-10`}
        onFocus={() => setOpen(true)} onChange={event => { onChange(event.target.value); setOpen(true); }}
        onKeyDown={event => {
          if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); setOpen(true);
            setActive(index => options.length ? (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length : -1);
          }
          if (event.key === 'Enter' && open && query.length >= 2) {
            event.preventDefault(); choose(active >= 0 && options[active] ? options[active].name : query);
          }
        }} />
    </div>
    {open && query.length >= 2 && <div className="absolute z-30 top-full mt-1 w-full overflow-hidden rounded-xl border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-lg">
      <div role="listbox" id={`${id}-options`} aria-label="University suggestions" className="max-h-60 overflow-y-auto">
        {options.map((item, index) => <button type="button" role="option" aria-selected={active === index}
          id={`${id}-option-${index}`} key={item.id} onMouseDown={event => event.preventDefault()}
          onClick={() => choose(item.name)} className={`block w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 ${active === index ? 'bg-slate-50 dark:bg-slate-800' : ''}`}>
          <span className="block text-sm text-slate-900 dark:text-white">{item.name}</span>
          {item.country && <span className="block mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.country}</span>}
        </button>)}
      </div>
      <p role="status" className="px-4 pt-2 text-xs text-slate-500 dark:text-slate-400">{loading ? 'Searching universities…' : error || (results.length ? 'University suggestions from ROR' : 'No directory matches.')}</p>
      <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => choose(query)} className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 break-words">Use “{query}”</button>
    </div>}
  </div>;
}

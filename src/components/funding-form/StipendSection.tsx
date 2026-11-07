import React from 'react';

interface StipendSectionProps {
  stipendAmount: number | '';
  setStipendAmount: (val: number | '') => void;
  stipendCurrency: string;
  setStipendCurrency: (val: string) => void;
  grossOrNet: 'Gross' | 'Net' | 'Unspecified';
  setGrossOrNet: (val: 'Gross' | 'Net' | 'Unspecified') => void;
  isZeroConfirmed: boolean;
  setIsZeroConfirmed: (val: boolean) => void;
  isUnpublished: boolean;
  setIsUnpublished: (val: boolean) => void;
}

export const StipendSection: React.FC<StipendSectionProps> = ({
  stipendAmount,
  setStipendAmount,
  stipendCurrency,
  setStipendCurrency,
  grossOrNet,
  setGrossOrNet,
  isZeroConfirmed,
  setIsZeroConfirmed,
  isUnpublished,
  setIsUnpublished,
}) => {
  return (
    <div
      className="p-3.5 bg-slate-50 dark:bg-[#0F172A] rounded-xl border
        border-[#E6DFD5] dark:border-[#334155] space-y-3"
    >
      <h3
        className="font-bold text-slate-900 dark:text-white text-xs
          uppercase tracking-wider text-slate-500 font-mono"
      >
        Monthly Stipend or Salary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Amount */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] text-slate-500 mb-0.5">
            Amount
          </label>
          <input
            type="number"
            disabled={isZeroConfirmed || isUnpublished}
            value={stipendAmount}
            onChange={(e) =>
              setStipendAmount(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            placeholder="e.g. 1350"
            className="w-full px-2.5 py-1.5 text-xs rounded border
              border-[#E6DFD5] dark:border-[#334155] bg-white
              dark:bg-[#1E293B] font-mono disabled:opacity-50"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">
            Currency
          </label>
          <input
            type="text"
            value={stipendCurrency}
            onChange={(e) => setStipendCurrency(e.target.value)}
            placeholder="EUR, USD, AED"
            className="w-full px-2.5 py-1.5 text-xs rounded border
              border-[#E6DFD5] dark:border-[#334155] bg-white
              dark:bg-[#1E293B] uppercase font-mono"
          />
        </div>

        {/* Gross / Net */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">
            Gross or Net Pay
          </label>
          <select
            value={grossOrNet}
            onChange={(e) => setGrossOrNet(e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs rounded border
              border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#1E293B]"
          >
            <option value="Net">Net (Take-home)</option>
            <option value="Gross">Gross (Pre-tax)</option>
            <option value="Unspecified">Unspecified</option>
          </select>
        </div>

        {/* Checkbox toggles */}
        <div className="flex flex-col justify-end gap-1 text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isZeroConfirmed}
              onChange={(e) => {
                setIsZeroConfirmed(e.target.checked);
                if (e.target.checked) setIsUnpublished(false);
              }}
              className="rounded"
            />
            <span>Confirmed Zero</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isUnpublished}
              onChange={(e) => {
                setIsUnpublished(e.target.checked);
                if (e.target.checked) setIsZeroConfirmed(false);
              }}
              className="rounded"
            />
            <span>Amount Unpublished</span>
          </label>
        </div>
      </div>
    </div>
  );
};


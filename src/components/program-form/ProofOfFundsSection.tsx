import React from 'react';
import { Landmark } from 'lucide-react';
import { ProofOfFunds } from '../../types';

interface ProofOfFundsSectionProps {
  proofOfFunds: ProofOfFunds;
  setProofOfFunds: (val: ProofOfFunds) => void;
}

export const ProofOfFundsSection: React.FC<ProofOfFundsSectionProps> = ({
  proofOfFunds,
  setProofOfFunds,
}) => {
  return (
    <div className="space-y-4 pt-2 border-t border-[#E6DFD5] dark:border-[#334155]">
      <div className="flex items-center gap-2">
        <Landmark size={15} className="text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <h3
          className="font-bold text-slate-900 dark:text-white text-xs
            uppercase tracking-wider font-mono"
        >
          06. Proof of Funds & Blocked Account (Sperrkonto)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Requirement Status */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Bank Statement / Blocked Account
          </label>
          <select
            value={proofOfFunds.required || 'Unclear'}
            onChange={(e) =>
              setProofOfFunds({
                ...proofOfFunds,
                required: e.target.value as 'Yes' | 'No' | 'Unclear',
              })
            }
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
          >
            <option value="Unclear">Unclear / Not Recorded</option>
            <option value="Yes">Yes — Proof / Blocked Account Required</option>
            <option value="No">No — Not Required / Sponsored</option>
          </select>
        </div>

        {/* Required Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Required Amount {proofOfFunds.required === 'No' && '(N/A)'}
          </label>
          <input
            type="number"
            min="0"
            disabled={proofOfFunds.required === 'No'}
            value={proofOfFunds.amount ?? ''}
            onChange={(e) =>
              setProofOfFunds({
                ...proofOfFunds,
                amount: e.target.value === '' ? '' : Number(e.target.value),
              })
            }
            placeholder="e.g. 11904"
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white disabled:opacity-50"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Currency
          </label>
          <select
            disabled={proofOfFunds.required === 'No'}
            value={proofOfFunds.currency || 'EUR'}
            onChange={(e) =>
              setProofOfFunds({
                ...proofOfFunds,
                currency: e.target.value,
              })
            }
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white disabled:opacity-50"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="SEK">SEK (kr)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="CHF">CHF (Fr)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="SAR">SAR (﷼)</option>
            <option value="NOK">NOK (kr)</option>
            <option value="DKK">DKK (kr)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CNY">CNY (¥)</option>
          </select>
        </div>
      </div>

      {/* Proof of Funds Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Proof of Funds & Visa Deposit Details
        </label>
        <textarea
          rows={2}
          value={proofOfFunds.notes || ''}
          onChange={(e) =>
            setProofOfFunds({
              ...proofOfFunds,
              notes: e.target.value,
            })
          }
          placeholder="e.g. Blocked account (Sperrkonto) required prior to embassy visa appointment. Waived if a full scholarship award letter is presented."
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white"
        />
      </div>
    </div>
  );
};


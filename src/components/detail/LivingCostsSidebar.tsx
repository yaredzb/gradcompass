import React from 'react';
import { Coins, Landmark } from 'lucide-react';
import { Program } from '../../types';
import { DetailField, SourceLink } from './DetailPrimitives';

export const LivingCostsSidebar: React.FC<{ program: Program }> = ({ program }) => (
  <section className="detail-sidebar-card" aria-labelledby="costs-heading">
    <div className="detail-sidebar-header">
      <h2 id="costs-heading" className="detail-sidebar-title">
        <Coins size={16} aria-hidden="true" />
        <span>Living costs</span>
      </h2>
      <span className="detail-sidebar-tag">Monthly</span>
    </div>

    {!program.campusCities?.length ? (
      <p className="detail-note">Campus living costs not recorded.</p>
    ) : (
      <div className="detail-cities-list">
        {program.campusCities.map((city, index) => {
          const hasMin = city.minMonthlyCost !== undefined && city.minMonthlyCost !== '';
          const hasTypical =
            city.typicalMonthlyCost !== undefined && city.typicalMonthlyCost !== '';
          const money = (value: number | '' | undefined) =>
            (Number(value).toLocaleString() + ' ' + (city.currency || '')).trim();

          return (
            <div className="detail-city-card" key={index}>
              <div className="detail-city-header">
                <h3 className="detail-city-name">{city.city || 'Campus location'}</h3>
                <span className="detail-city-currency">
                  per month{city.currency ? ' · ' + city.currency : ''}
                </span>
              </div>

              {hasMin || hasTypical ? (
                <dl className="detail-date-list">
                  <DetailField label="Minimum budget">
                    <span className="font-mono">
                      {hasMin ? money(city.minMonthlyCost) : 'Not recorded'}
                    </span>
                  </DetailField>
                  <DetailField label="Typical budget">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {hasTypical ? money(city.typicalMonthlyCost) : 'Not recorded'}
                    </span>
                  </DetailField>
                </dl>
              ) : (
                <p className="detail-note">Cost estimates not yet recorded for this campus.</p>
              )}

              <div className="detail-city-link">
                <SourceLink href={city.sourceLink}>Cost reference</SourceLink>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* Proof of Funds / Blocked Account Card */}
    {program.proofOfFunds && program.proofOfFunds.required !== 'Unclear' && (
      <div className="mt-4 pt-3 border-t border-[#E6DFD5] dark:border-[#334155]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Landmark size={14} className="text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <span>Proof of Funds (Blocked Account)</span>
          </div>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-sm uppercase tracking-wider ${
              program.proofOfFunds.required === 'Yes'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {program.proofOfFunds.required === 'Yes' ? 'Required' : 'Not Required'}
          </span>
        </div>

        {program.proofOfFunds.required === 'Yes' &&
          program.proofOfFunds.amount !== undefined &&
          program.proofOfFunds.amount !== '' && (
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">
              Deposit: {Number(program.proofOfFunds.amount).toLocaleString()}{' '}
              {program.proofOfFunds.currency || 'EUR'}
            </p>
          )}

        {program.proofOfFunds.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            {program.proofOfFunds.notes}
          </p>
        )}
      </div>
    )}
  </section>
);

import React from 'react';
import { Coins } from 'lucide-react';
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
  </section>
);

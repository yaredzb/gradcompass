import React from 'react';
import { Program } from '../../types';
import { DetailField, SourceLink } from './DetailPrimitives';

export const LivingCostsSidebar: React.FC<{ program: Program }> = ({ program }) => <section className="detail-sidebar-section" aria-labelledby="costs-heading">
  <h2 id="costs-heading">Living costs</h2>
  {!program.campusCities?.length ? <p className="detail-note">Campus costs not recorded.</p> : program.campusCities.map((city, index) => {
    const hasMin = city.minMonthlyCost !== undefined && city.minMonthlyCost !== '';
    const hasTypical = city.typicalMonthlyCost !== undefined && city.typicalMonthlyCost !== '';
    const money = (value: number | '' | undefined) => (Number(value).toLocaleString() + ' ' + (city.currency || '')).trim();
    return <div className="detail-city" key={index}>
      <h3>{city.city || 'Campus location'}<span>per month{city.currency ? ' · ' + city.currency : ''}</span></h3>
      {hasMin || hasTypical ? <dl className="detail-date-list">
        <DetailField label="Minimum budget">{hasMin ? money(city.minMonthlyCost) : 'Not recorded'}</DetailField>
        <DetailField label="Typical budget">{hasTypical ? money(city.typicalMonthlyCost) : 'Not recorded'}</DetailField>
      </dl> : <p className="detail-note">Cost estimates not yet recorded.</p>}
      <SourceLink href={city.sourceLink}>Cost reference</SourceLink>
    </div>;
  })}
</section>;


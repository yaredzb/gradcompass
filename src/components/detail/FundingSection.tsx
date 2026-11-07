import React from 'react';
import { Plus } from 'lucide-react';
import { FundingOpportunity, Program } from '../../types';
import { FundingAwardCard } from './FundingAwardCard';

interface FundingSectionProps {
  program: Program;
  fundingList: FundingOpportunity[];
  onAddFunding: (program: Program) => void;
  onEditFunding: (fund: FundingOpportunity) => void;
  onDeleteFunding: (id: string) => void;
}
export const FundingSection: React.FC<FundingSectionProps> = ({ program, fundingList, onAddFunding, onEditFunding, onDeleteFunding }) => (
  <section className="detail-section" id="funding" aria-labelledby="funding-heading">
    <div className="detail-section-heading">
      <h2 id="funding-heading">Funding <span className="detail-count">{fundingList.length}</span></h2>
      <button className="detail-button" onClick={() => onAddFunding(program)}><Plus size={15} aria-hidden="true" />Add award</button>
    </div>
    {!fundingList.length ? <p className="detail-empty">No awards recorded yet. Add a scholarship, fellowship, or salaried position.</p> :
      <div className="detail-awards">{fundingList.map(fund => <FundingAwardCard key={fund.id} fund={fund} program={program} onEditFunding={onEditFunding} onDeleteFunding={onDeleteFunding} />)}</div>}
  </section>
);


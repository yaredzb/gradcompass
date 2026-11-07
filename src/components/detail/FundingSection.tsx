import React from 'react';
import { Plus, Award } from 'lucide-react';
import { FundingOpportunity, Program } from '../../types';
import { FundingAwardCard } from './FundingAwardCard';

interface FundingSectionProps {
  program: Program;
  fundingList: FundingOpportunity[];
  onAddFunding: (program: Program) => void;
  onEditFunding: (fund: FundingOpportunity) => void;
  onDeleteFunding: (id: string) => void | Promise<void>;
}

export const FundingSection: React.FC<FundingSectionProps> = ({
  program,
  fundingList,
  onAddFunding,
  onEditFunding,
  onDeleteFunding,
}) => (
  <section className="detail-section" id="funding" aria-labelledby="funding-heading">
    <div className="detail-section-header">
      <div>
        <h2 id="funding-heading" className="flex items-center gap-2">
          <span>Funding Opportunities</span>
          <span className="detail-tab-badge">
            {fundingList.length} {fundingList.length === 1 ? 'Award' : 'Awards'}
          </span>
        </h2>
        <p className="detail-section-subtitle">
          Scholarships, graduate research assistantships, salaried positions, and tuition remissions
        </p>
      </div>
      <button
        className="detail-add-button"
        onClick={() => onAddFunding(program)}
      >
        <Plus size={14} aria-hidden="true" />
        <span>Add award</span>
      </button>
    </div>

    {!fundingList.length ? (
      <div className="detail-empty-card">
        <Award size={32} className="detail-empty-icon" aria-hidden="true" />
        <p className="detail-empty-title">No funding packages recorded yet</p>
        <p className="detail-empty-text">
          Add an institutional scholarship, departmental fellowship, or salaried doctoral position attached to this program.
        </p>
        <button
          className="detail-button"
          onClick={() => onAddFunding(program)}
        >
          <Plus size={14} aria-hidden="true" />
          <span>Add first award</span>
        </button>
      </div>
    ) : (
      <div className="detail-awards">
        {fundingList.map((fund) => (
          <FundingAwardCard
            key={fund.id}
            fund={fund}
            program={program}
            onEditFunding={onEditFunding}
            onDeleteFunding={onDeleteFunding}
          />
        ))}
      </div>
    )}
  </section>
);

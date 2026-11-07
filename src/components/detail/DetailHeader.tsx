import React from 'react';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Program } from '../../types';
import { formatRegionDisplay } from '../../utils/regions';
import { getDegreeRouteLabel } from './formatters';
import { SourceLink, readableLabel } from './DetailPrimitives';

interface DetailHeaderProps {
  program: Program;
  onBack: () => void;
  onEditProgram: (program: Program) => void;
  onDeleteProgram: (id: string) => void;
}
export const DetailHeader: React.FC<DetailHeaderProps> = ({ program, onBack, onEditProgram, onDeleteProgram }) => {
  const handleDelete = () => {
    if (window.confirm('Delete "' + program.officialName + '" and all attached awards?')) {
      onDeleteProgram(program.id);
      onBack();
    }
  };
  const isDemo = /^\[DEMO EXAMPLE\]\s*/i.test(program.officialName);
  const displayName = program.officialName.replace(/^\[DEMO EXAMPLE\]\s*/i, '');
  return <header className="detail-header">
    <div className="detail-toolbar">
      <button className="detail-back" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" />Opportunities</button>
      <div className="detail-actions">
        <button className="detail-button" onClick={() => onEditProgram(program)}><Edit2 size={14} aria-hidden="true" />Edit program</button>
        <button className="detail-icon-button" onClick={handleDelete} aria-label="Delete program" title="Delete program"><Trash2 size={15} /></button>
      </div>
    </div>
    <div className="detail-title-block">
      <p className="detail-institution">{program.university}</p>
      <h1>{displayName}</h1>
      <p className="detail-location">{[program.countries?.join(', '), formatRegionDisplay(program.assignedRegions || []), program.isJointProgram ? 'Joint program' : '', isDemo ? 'Example record' : ''].filter(Boolean).join(' · ')}</p>
      <div className="detail-header-bottom">
        <div className="detail-summary"><span>{getDegreeRouteLabel(program)}</span><span>{readableLabel(program.mediumOfInstruction)} instruction</span>{program.applyBeforeGraduation === 'Yes' && <span>Final-year applicants eligible</span>}</div>
        <SourceLink href={program.officialLink}>Official program page</SourceLink>
      </div>
    </div>
  </header>;
};


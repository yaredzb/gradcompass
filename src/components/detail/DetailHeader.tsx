import React from 'react';
import { ArrowLeft, Edit2, Trash2, GraduationCap, CheckCircle2 } from 'lucide-react';
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

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  program,
  onBack,
  onEditProgram,
  onDeleteProgram,
}) => {
  const handleDelete = () => {
    if (window.confirm('Delete "' + program.officialName + '" and all attached awards?')) {
      onDeleteProgram(program.id);
      onBack();
    }
  };

  const isDemo = /^\[DEMO EXAMPLE\]\s*/i.test(program.officialName);
  const displayName = program.officialName.replace(/^\[DEMO EXAMPLE\]\s*/i, '');

  // Generate university initials monogram (e.g. "ETH", "SCT", "MIT")
  const uniInitials = program.university
    ? program.university
        .split(/\s+/)
        .filter((w) => !/^(of|and|the|in|for|&|de|la|du)$/i.test(w))
        .map((w) => w[0])
        .slice(0, 3)
        .join('')
        .toUpperCase()
    : 'UNI';

  return (
    <header className="detail-header-card">
      <div className="detail-toolbar">
        <button
          className="detail-back"
          onClick={onBack}
          aria-label="Back to opportunities catalog"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Opportunities</span>
        </button>

        <div className="detail-actions">
          <button
            className="detail-button"
            onClick={() => onEditProgram(program)}
          >
            <Edit2 size={13} aria-hidden="true" />
            <span>Edit program</span>
          </button>
          <button
            className="detail-icon-button"
            onClick={handleDelete}
            aria-label="Delete program"
            title="Delete program"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="detail-title-block">
        <div className="detail-meta-row">
          <div className="detail-institution-avatar" aria-hidden="true">
            {uniInitials}
          </div>
          <div className="detail-meta-text">
            <span className="detail-institution">{program.university}</span>
            <span className="detail-separator" aria-hidden="true">·</span>
            <span className="detail-location-text">
              {[
                program.countries?.join(', '),
                formatRegionDisplay(program.assignedRegions || []),
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>

          {program.isJointProgram && (
            <span className="detail-badge detail-badge-purple">Joint program</span>
          )}
          {isDemo && (
            <span className="detail-badge detail-badge-amber">Example record</span>
          )}
        </div>

        <h1 className="detail-heading">{displayName}</h1>

        <div className="detail-header-bottom">
          <div className="detail-summary-pills">
            <span className="detail-pill detail-pill-blue">
              <GraduationCap size={14} aria-hidden="true" />
              <span>{getDegreeRouteLabel(program)}</span>
            </span>

            <span className="detail-pill detail-pill-slate">
              <span>{readableLabel(program.mediumOfInstruction)} instruction</span>
            </span>

            {program.applyBeforeGraduation === 'Yes' && (
              <span className="detail-pill detail-pill-slate font-medium">
                <CheckCircle2 size={13} aria-hidden="true" />
                <span>Final-year applicants eligible</span>
              </span>
            )}
          </div>

          <SourceLink href={program.officialLink}>Official program page</SourceLink>
        </div>
      </div>
    </header>
  );
};

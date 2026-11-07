import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Program } from '../../types';
import { formatRegionDisplay } from '../../utils/regions';
import { getDegreeRouteLabel } from './formatters';
import { SourceLink, readableLabel } from './DetailPrimitives';
import { ConfirmModal } from '../ConfirmModal';

interface DetailHeaderProps {
  program: Program;
  onBack: () => void;
  onEditProgram: (program: Program) => void;
  onDeleteProgram: (id: string) => void | Promise<void>;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  program,
  onBack,
  onEditProgram,
  onDeleteProgram,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteProgram(program.id);
      setIsDeleteModalOpen(false);
      onBack();
    } catch (error) {
      setIsDeleteModalOpen(false);
      setDeleteError(error instanceof Error ? error.message : 'Could not delete program.');
    } finally {
      setIsDeleting(false);
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
            className="detail-icon-button hover:text-red-600 dark:hover:text-red-400"
            onClick={() => setIsDeleteModalOpen(true)}
            aria-label="Delete program"
            title="Delete program"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Program?"
        message={`Are you sure you want to delete "${displayName}"?`}
        confirmLabel="Move to Trash"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        onCancel={() => { if (!isDeleting) setIsDeleteModalOpen(false); }}
      />

      {deleteError && <p role="alert" className="p-3 text-sm text-red-700 dark:text-red-200">{deleteError}</p>}
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

import React from 'react';
import { GraduationCap, FileCheck, Languages, CheckCircle2 } from 'lucide-react';
import { Program } from '../../types';
import { MoreDetails, SourceLink } from './DetailPrimitives';

export const AdmissionCriteriaSection: React.FC<{ program: Program }> = ({ program }) => {
  const english = program.englishProficiency;
  const competitiveness = program.admissionCompetitiveness;
  const hasSelection =
    !!program.selectionSteps?.length ||
    !!competitiveness?.metricDetails ||
    !!competitiveness?.sourceLink;

  return (
    <section className="detail-section" id="admissions" aria-labelledby="admissions-heading">
      <div className="detail-section-header">
        <div>
          <h2 id="admissions-heading">Admission Requirements</h2>
          <p className="detail-section-subtitle">
            Undergraduate eligibility, minimum grade benchmarks, test requirements, and selection process
          </p>
        </div>
        <span className="detail-section-badge detail-section-badge-amber">Requirements</span>
      </div>

      <div className="detail-requirements-grid">
        {/* Card 1: Minimum Grades */}
        <div className="detail-req-card detail-req-card-highlight">
          <div className="detail-req-icon">
            <GraduationCap size={16} aria-hidden="true" />
          </div>
          <div className="detail-req-content">
            <span className="detail-req-label">Minimum Academic Benchmark</span>
            <p className="detail-req-headline">
              {program.minimumGrades || 'Not specified'}
            </p>
            {program.gradingScale && (
              <p className="detail-note">Scale: {program.gradingScale}</p>
            )}
          </div>
        </div>

        {/* Card 2: Academic Background */}
        <div className="detail-req-card">
          <div className="detail-req-icon">
            <FileCheck size={16} aria-hidden="true" />
          </div>
          <div className="detail-req-content">
            <span className="detail-req-label">Academic Background & Prerequisites</span>
            <p className="detail-req-body">
              {program.academicPrerequisites || 'Prerequisites not recorded.'}
            </p>
          </div>
        </div>
      </div>

      {/* Required Dossier Documents */}
      <div className="detail-documents-card">
        <span className="detail-req-label">Required Application Documents</span>
        <p className="detail-req-body">
          {program.keyRequirements || 'Document requirements not recorded.'}
        </p>
      </div>

      {/* English Proficiency Subsection */}
      <div className="detail-subsection">
        <div className="detail-subsection-title">
          <Languages size={17} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h3>English Proficiency</h3>
        </div>

        <div className="detail-english-grid">
          <div className="detail-english-item">
            <span className="detail-sublabel">Accepted Tests</span>
            <div className="detail-test-pills">
              {english?.acceptedTests?.length ? (
                english.acceptedTests.map((test) => (
                  <span key={test} className="detail-test-pill">
                    {test}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm">Not specified</span>
              )}
            </div>
          </div>

          {english?.minimumScores && (
            <div className="detail-english-item">
              <span className="detail-sublabel">Minimum Scores</span>
              <p className="detail-score-pill font-mono">{english.minimumScores}</p>
            </div>
          )}
        </div>

        {english?.waivers && (
          <MoreDetails title="Language waiver conditions">
            <p>{english.waivers}</p>
          </MoreDetails>
        )}
      </div>

      {/* Selection Process & Competitiveness */}
      {hasSelection && (
        <MoreDetails title="Selection process & competitiveness">
          {!!program.selectionSteps?.length && (
            <div className="detail-selection-timeline">
              {program.selectionSteps.map((step, index) => (
                <div key={index} className="detail-selection-step">
                  <span className="detail-step-number">{index + 1}</span>
                  <div className="detail-step-text">
                    <p className="font-semibold text-sm">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {competitiveness?.metricDetails && (
            <p className="detail-selectivity-note">
              {competitiveness.metricDetails}
              {competitiveness.sourceYear && ' (' + competitiveness.sourceYear + ')'}
            </p>
          )}
          <SourceLink href={competitiveness?.sourceLink}>Selectivity source</SourceLink>
        </MoreDetails>
      )}
    </section>
  );
};

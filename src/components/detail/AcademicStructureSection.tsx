import React from 'react';
import { BookOpen, Award, Globe, CheckCircle2 } from 'lucide-react';
import { Program } from '../../types';
import { getDegreeRouteLabel, formatProgramStructure } from './formatters';
import { readableLabel } from './DetailPrimitives';

export const AcademicStructureSection: React.FC<{ program: Program }> = ({ program }) => (
  <section className="detail-section" id="overview" aria-labelledby="overview-heading">
    <div className="detail-section-header">
      <div>
        <h2 id="overview-heading">Academic Structure</h2>
        <p className="detail-section-subtitle">
          Degree progression pathway, curriculum framework, and language requirements
        </p>
      </div>
      <span className="detail-section-badge">Curriculum</span>
    </div>

    <div className="detail-bento-grid">
      {/* Tile 1: Degree Route */}
      <div className="detail-bento-card">
        <div className="detail-bento-icon">
          <Award size={16} aria-hidden="true" />
        </div>
        <div className="detail-bento-body">
          <span className="detail-bento-label">Degree Route</span>
          <p className="detail-bento-value">{getDegreeRouteLabel(program)}</p>
          {program.degreeRoute === 'MastersRequiredPhD' && (
            <p className="detail-note">A completed master’s degree is required prior to enrollment.</p>
          )}
          {program.degreeRoute === 'DirectPhD' && (
            <p className="detail-note">Direct entry from bachelor’s without requiring a master’s degree.</p>
          )}
          {program.degreeRoute === 'Unclear' && (
            <p className="detail-note">Confirm the entry route directly with the institution.</p>
          )}
        </div>
      </div>

      {/* Tile 2: Study Structure */}
      <div className="detail-bento-card">
        <div className="detail-bento-icon">
          <BookOpen size={16} aria-hidden="true" />
        </div>
        <div className="detail-bento-body">
          <span className="detail-bento-label">Study Structure</span>
          <p className="detail-bento-value">{formatProgramStructure(program.programStructure)}</p>
          <p className="detail-note">
            {program.programStructure === 'CourseworkPlusThesis'
              ? 'Combines graduate coursework with a capstone master’s research thesis.'
              : program.programStructure === 'PhDCourseworkDissertation'
              ? 'Doctoral coursework, qualifying exams, and doctoral dissertation defense.'
              : 'Structured curriculum sequence.'}
          </p>
        </div>
      </div>

      {/* Tile 3: Medium of Instruction */}
      <div className="detail-bento-card">
        <div className="detail-bento-icon">
          <Globe size={16} aria-hidden="true" />
        </div>
        <div className="detail-bento-body">
          <span className="detail-bento-label">Language of Instruction</span>
          <p className="detail-bento-value">{readableLabel(program.mediumOfInstruction)}</p>
          <p className="detail-note">
            {program.instructionLanguageDetails ||
              (program.mediumOfInstruction === 'English'
                ? 'All coursework, lectures, and thesis supervision conducted in English.'
                : 'Instruction language details not specified.')}
          </p>
        </div>
      </div>

      {/* Tile 4: Apply Before Graduation */}
      <div className="detail-bento-card">
        <div className="detail-bento-icon">
          <CheckCircle2 size={16} aria-hidden="true" />
        </div>
        <div className="detail-bento-body">
          <span className="detail-bento-label">Apply Before Graduation</span>
          <p className="detail-bento-value">
            {readableLabel(program.applyBeforeGraduation)}
          </p>
          <p className="detail-note">
            {program.applyBeforeGraduationNotes ||
              (program.applyBeforeGraduation === 'Yes'
                ? 'Graduating seniors in their final semester can apply with provisional transcripts.'
                : 'Completed degree certificate required prior to submission.')}
          </p>
        </div>
      </div>
    </div>

    {!!program.fields?.length && (
      <div className="detail-disciplines-block">
        <span className="detail-disciplines-label">Fields of Study & Academic Disciplines</span>
        <div className="detail-field-tags">
          {program.fields.map((field) => (
            <span key={field} className="detail-tag">
              <span className="detail-tag-dot" aria-hidden="true" />
              {field}
            </span>
          ))}
        </div>
      </div>
    )}
  </section>
);

import React from 'react';
import { Program } from '../../types';
import { getDegreeRouteLabel, formatProgramStructure } from './formatters';
import { DetailField, readableLabel } from './DetailPrimitives';

export const AcademicStructureSection: React.FC<{ program: Program }> = ({ program }) => (
  <section className="detail-section" id="overview" aria-labelledby="overview-heading">
    <h2 id="overview-heading">Academic structure</h2>
    <dl className="detail-facts-grid">
      <DetailField label="Degree route">{getDegreeRouteLabel(program)}
        {program.degreeRoute === 'MastersRequiredPhD' && <p className="detail-note">A completed master's degree is required.</p>}
        {program.degreeRoute === 'Unclear' && <p className="detail-note">Confirm the entry route with the institution.</p>}
      </DetailField>
      <DetailField label="Study structure">{formatProgramStructure(program.programStructure)}</DetailField>
      <DetailField label="Apply before graduation">{readableLabel(program.applyBeforeGraduation)}{program.applyBeforeGraduationNotes && <p className="detail-note">{program.applyBeforeGraduationNotes}</p>}</DetailField>
      <DetailField label="Language of instruction">{readableLabel(program.mediumOfInstruction)}{program.instructionLanguageDetails && <p className="detail-note">{program.instructionLanguageDetails}</p>}</DetailField>
    </dl>
    {!!program.fields?.length && <dl className="detail-disciplines"><DetailField label="Fields of study"><div className="detail-field-tags">{program.fields.map(field => <span key={field}>{field}</span>)}</div></DetailField></dl>}
  </section>
);


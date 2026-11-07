import React from 'react';
import { Program } from '../../types';
import { DetailField, MoreDetails, SourceLink } from './DetailPrimitives';

export const AdmissionCriteriaSection: React.FC<{ program: Program }> = ({ program }) => {
  const english = program.englishProficiency;
  const competitiveness = program.admissionCompetitiveness;
  const hasSelection = !!program.selectionSteps?.length || !!competitiveness?.metricDetails || !!competitiveness?.sourceLink;
  return <section className="detail-section" id="admissions" aria-labelledby="admissions-heading">
    <h2 id="admissions-heading">Admission requirements</h2>
    <dl className="detail-stack">
      <DetailField label="Academic background">{program.academicPrerequisites || 'Prerequisites not recorded.'}</DetailField>
      <DetailField label="Minimum grades">{program.minimumGrades || 'Not specified'}{program.gradingScale && <p className="detail-note">{program.gradingScale}</p>}</DetailField>
      <DetailField label="Application documents">{program.keyRequirements || 'Document requirements not recorded.'}</DetailField>
    </dl>
    <div className="detail-subsection">
      <h3>English proficiency</h3>
      <dl className="detail-stack">
        <DetailField label="Accepted tests">{english?.acceptedTests?.join(', ') || 'Not specified'}</DetailField>
        {english?.minimumScores && <DetailField label="Minimum scores">{english.minimumScores}</DetailField>}
      </dl>
      {english?.waivers && <MoreDetails title="Language waiver conditions"><p>{english.waivers}</p></MoreDetails>}
    </div>
    {hasSelection && <MoreDetails title="Selection process & competitiveness">
      {!!program.selectionSteps?.length && <ol className="detail-selection">{program.selectionSteps.map((step, index) => <li key={index}>{step}</li>)}</ol>}
      {competitiveness?.metricDetails && <p>{competitiveness.metricDetails}{competitiveness.sourceYear && ' (' + competitiveness.sourceYear + ')'}</p>}
      <SourceLink href={competitiveness?.sourceLink}>Selectivity source</SourceLink>
    </MoreDetails>}
  </section>;
};


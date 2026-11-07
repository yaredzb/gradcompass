import React from 'react';
import { Program } from '../../types';
import { DetailField, MoreDetails, formatDate, readableLabel } from './DetailPrimitives';

export const DeadlinesSidebar: React.FC<{ program: Program }> = ({ program }) => {
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  return <section className="detail-sidebar-section" aria-labelledby="dates-heading">
    <h2 id="dates-heading">Application dates</h2>
    {[program.fallIntake, program.springIntake].map((intake, index) => {
      const end = intake?.deadlineDate || intake?.endDate;
      const start = intake?.startDate;
      const notOffered = intake?.status === 'NotOffered';
      let status = readableLabel(intake?.status);
      if (!notOffered && (start || end)) {
        if (end && today > end) status = 'Applications closed';
        else if (start && today < start) status = 'Opens soon';
        else if (start && today >= start) status = 'Application window open';
      }
      return <div className="detail-intake" key={index}>
        <div className="detail-intake-heading"><h3>{intake?.term || (index === 0 ? 'Fall intake' : 'Spring intake')}</h3><span>{status}</span></div>
        {!notOffered && <dl className="detail-date-list">
          {start && <DetailField label="Opens"><time dateTime={start}>{formatDate(start)}</time></DetailField>}
          <DetailField label={intake?.status === 'Rolling' ? 'Admission' : 'Deadline'}>{intake?.status === 'Rolling' && !end ? 'Rolling applications' : end ? <time dateTime={end}>{formatDate(end)}</time> : 'Not published'}</DetailField>
        </dl>}
        {intake?.notes && <MoreDetails title="Intake notes"><p>{intake.notes}</p></MoreDetails>}
      </div>;
    })}
  </section>;
};


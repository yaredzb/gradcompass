import React from 'react';
import { Calendar } from 'lucide-react';
import { Program } from '../../types';
import { DetailField, formatDate, readableLabel } from './DetailPrimitives';

export const DeadlinesSidebar: React.FC<{ program: Program }> = ({ program }) => {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');

  return (
    <section className="detail-sidebar-card" aria-labelledby="dates-heading">
      <div className="detail-sidebar-header">
        <h2 id="dates-heading" className="detail-sidebar-title">
          <Calendar size={16} aria-hidden="true" />
          <span>Application dates</span>
        </h2>
        <span className="detail-sidebar-tag">Intakes</span>
      </div>

      <div className="detail-intakes-list">
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

          const isWindowOpen = status === 'Application window open';
          const isClosed = status === 'Applications closed';

          return (
            <div
              className={`detail-intake-card ${notOffered ? 'detail-intake-muted' : ''}`}
              key={index}
            >
              <div className="detail-intake-top">
                <h3 className="detail-intake-term">
                  {intake?.term || (index === 0 ? 'Fall intake' : 'Spring intake')}
                </h3>
                <span
                  className={`detail-status-pill ${
                    isWindowOpen
                      ? 'detail-status-active'
                      : isClosed
                      ? 'detail-status-rose'
                      : notOffered
                      ? 'detail-status-muted'
                      : 'detail-status-slate'
                  }`}
                >
                  {isWindowOpen && <span className="detail-pulse-dot" aria-hidden="true" />}
                  {status}
                </span>
              </div>

              {!notOffered && (
                <dl className="detail-date-list">
                  {start && (
                    <DetailField label="Opens">
                      <time dateTime={start} className="font-mono">
                        {formatDate(start)}
                      </time>
                    </DetailField>
                  )}
                  <DetailField label={intake?.status === 'Rolling' ? 'Admission' : 'Deadline'}>
                    {intake?.status === 'Rolling' && !end ? (
                      'Rolling applications'
                    ) : end ? (
                      <time dateTime={end} className="font-mono detail-deadline-date">
                        {formatDate(end)}
                      </time>
                    ) : (
                      'Not published'
                    )}
                  </DetailField>
                </dl>
              )}

              {intake?.notes && (
                <div className="detail-intake-notes">
                  <p>{intake.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

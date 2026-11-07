import React from 'react';
import { Program } from '../../types';
import { formatDate } from './DetailPrimitives';

export const RecordMetaSidebar: React.FC<{ program: Program }> = ({ program }) => (
  <div className="detail-record-meta-card">
    <div className="detail-meta-row-item">
      <span className="detail-meta-verified">
        <span className="detail-dot-verified" aria-hidden="true" />
        Last checked: <strong className="font-medium text-slate-700 dark:text-slate-300">{program.informationLastChecked ? formatDate(program.informationLastChecked) : 'Not verified'}</strong>
      </span>
      <span className="detail-record-id font-mono">
        ID: {program.id}
      </span>
    </div>
  </div>
);

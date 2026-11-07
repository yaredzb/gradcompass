import React from 'react';
import { Program } from '../../types';

export const RecordMetaSidebar: React.FC<{ program: Program }> = ({ program }) => (
  <div className="detail-record-meta-card">
    <div className="detail-meta-row-item">
      <span className="detail-record-id font-mono">
        ID: {program.id}
      </span>
    </div>
  </div>
);

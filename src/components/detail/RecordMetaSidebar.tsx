import React from 'react';
import { Program } from '../../types';
import { MoreDetails, formatDate } from './DetailPrimitives';

export const RecordMetaSidebar: React.FC<{ program: Program }> = ({ program }) => <div className="detail-record-meta">
  <p>Last checked <span>{program.informationLastChecked ? formatDate(program.informationLastChecked) : 'Not verified'}</span></p>
  <MoreDetails title="Record information"><p>Record ID: {program.id}</p></MoreDetails>
</div>;


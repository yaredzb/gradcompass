import React from 'react';
import { Program } from '../types';
import { programPath } from '../lib/routes';

export function ProgramLink({ program, onNavigate, children, className }: {
  program: Program;
  onNavigate: (program: Program) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return <a href={programPath(program)} className={className} onClick={event => {
    event.stopPropagation();
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(program);
  }}>{children}</a>;
}

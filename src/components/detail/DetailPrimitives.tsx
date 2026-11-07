import React from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';

export function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="detail-field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function SourceLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a className="detail-link" href={href} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      <ExternalLink size={13} aria-hidden="true" />
    </a>
  );
}

export function MoreDetails({ title = 'Additional details', children }: { title?: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <details className="detail-disclosure" onToggle={(e) => setIsOpen(e.currentTarget.open)}>
      <summary className="detail-disclosure-summary">
        <span>{title}</span>
        <ChevronDown
          size={14}
          className={`detail-disclosure-chevron ${isOpen ? 'rotate-180' : ''} transition-transform duration-200`}
          aria-hidden="true"
        />
      </summary>
      <div className="detail-disclosure-content">{children}</div>
    </details>
  );
}

export function formatDate(value?: string) {
  if (!value) return 'Not published';
  const date = new Date(value.slice(0, 10) + 'T12:00:00');
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function readableLabel(value?: string) {
  if (!value || value === 'Unclear' || value === 'Unknown') return 'Not confirmed';
  const labels: Record<string, string> = {
    LocalLanguage: 'Local language',
    OpenToEthiopian: 'Open to Ethiopian applicants',
    EthiopiaSpecific: 'For Ethiopian applicants',
    Ineligible: 'Ethiopian applicants ineligible',
    SalariedPhD: 'Salaried PhD',
    ResearchAssistantship: 'Research assistantship',
    TeachingAssistantship: 'Teaching assistantship',
    TuitionWaiver: 'Tuition waiver',
    FixedDeadline: 'Fixed deadline',
    NotOffered: 'Not offered',
    Unpublished: 'Not published',
  };
  return labels[value] || value;
}

import React from 'react';

interface BadgeProps {
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'DLQ' | 'ACTIVE' | 'SUCCESS' | 'WARNING';
  children?: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  let colorClasses = '';
  let text = children || status;

  switch (status) {
    case 'COMPLETED':
    case 'SUCCESS':
      colorClasses = 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success-bg)]';
      break;
    case 'PENDING':
    case 'ACTIVE':
    case 'WARNING':
      colorClasses = 'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)] border-[var(--color-status-warning-bg)]';
      break;
    case 'FAILED':
    case 'DLQ':
      colorClasses = 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error-text)] border-[var(--color-status-error-bg)]';
      break;
    default:
      colorClasses = 'bg-surface-container-high text-on-surface';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase border ${colorClasses}`}>
      {text}
    </span>
  );
}

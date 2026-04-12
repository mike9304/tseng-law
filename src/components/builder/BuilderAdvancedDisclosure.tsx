'use client';

import type { ReactNode } from 'react';

type BuilderAdvancedDisclosureProps = {
  title: string;
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export default function BuilderAdvancedDisclosure({
  title,
  summary,
  children,
  defaultOpen = false,
  className,
}: BuilderAdvancedDisclosureProps) {
  return (
    <details className={['builder-preview-advanced-details', className].filter(Boolean).join(' ')} open={defaultOpen}>
      <summary className="builder-preview-advanced-summary">
        <span>{title}</span>
        <small>{summary}</small>
      </summary>
      <div className="builder-preview-advanced-content">{children}</div>
    </details>
  );
}

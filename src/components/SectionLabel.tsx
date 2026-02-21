import type { ReactNode } from 'react';

export default function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="section-label">{children}</div>;
}

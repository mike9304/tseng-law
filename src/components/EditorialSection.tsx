import type { ReactNode } from 'react';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';

export default function EditorialSection({
  id,
  label,
  title,
  description,
  children,
  className,
  variant,
  tone
}: {
  id?: string;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: 'alt' | 'default';
  tone?: 'light' | 'dark';
}) {
  const sectionClass = `section${variant === 'alt' ? ' alt' : ''}${className ? ` ${className}` : ''}`;

  return (
    <section className={sectionClass} id={id} data-tone={tone ?? 'light'}>
      <div className="container">
        <SectionLabel>{label}</SectionLabel>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-lede">{description}</p> : null}
        <OrnamentDivider />
        {children}
      </div>
    </section>
  );
}

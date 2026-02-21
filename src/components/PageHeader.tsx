import type { ReactNode } from 'react';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Locale } from '@/lib/locales';

export default function PageHeader({
  locale,
  label,
  title,
  description,
  children
}: {
  locale: Locale;
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="section page-header">
      <div className="container">
        <Breadcrumbs locale={locale} current={title} />
        <SectionLabel>{label}</SectionLabel>
        <h1 className="hero-title page-header-title">{title}</h1>
        {description ? <p className="section-lede">{description}</p> : null}
        <OrnamentDivider />
        {children}
      </div>
    </section>
  );
}

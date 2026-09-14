import type { ReactNode } from 'react';
import SectionLabel from '@/components/SectionLabel';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { PublicLocale8 } from '@/lib/public-guidance';
import styles from './PublicChrome.module.css';

const JA_PROTECTED_TERM = '弁護士';
const EN_PROTECTED_TERM = 'Korea-Taiwan';

function renderProtectedTitle(locale: PublicLocale8, title: string) {
  const token =
    locale === 'ja' ? JA_PROTECTED_TERM : locale === 'en' ? EN_PROTECTED_TERM : null;
  if (!token || !title.includes(token)) {
    return title;
  }

  const segments = title.split(token);
  const nodes: ReactNode[] = [];
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (segment) {
      nodes.push(segment);
    }
    if (index < segments.length - 1) {
      nodes.push(
        <span className={styles.protectedTerm} key={`protected-term-${index}`}>
          {token}
        </span>,
      );
    }
  }
  return nodes;
}

export default function PageHeader({
  locale,
  label,
  title,
  description,
  children
}: {
  locale: PublicLocale8;
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`section page-header ${children ? 'page-header--with-content' : 'page-header--compact'} ${styles.pageHeader}`}>
      <div className="container">
        <div className={styles.pageHeaderCopy}>
          <Breadcrumbs locale={locale} current={title} />
          <SectionLabel data-builder-surface-key="section-label">{label}</SectionLabel>
          <h1 className="hero-title page-header-title" data-builder-surface-key="headline">
            {renderProtectedTitle(locale, title)}
          </h1>
          {description ? (
            <p className="section-lede" data-builder-surface-key="description">
              {description}
            </p>
          ) : null}
        </div>
        {children ? <div className={styles.pageHeaderChildren}>{children}</div> : null}
      </div>
    </section>
  );
}

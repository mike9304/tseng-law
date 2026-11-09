import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  listPublicSemiconductorColumns,
  semiconductorColumnBadge,
  semiconductorGuideCopy,
} from '@/lib/semiconductor-public';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import {
  getSemiconductorBoardConsultHref,
  isSemiconductorBoardConsultMailto,
} from '@/lib/semiconductor-consult-link';
import { semiconductorCardSubtopicsAttr, type SemiconductorBoardCard } from '@/lib/semiconductor-board';
import type { SiteLocale } from '@/lib/locales';
import filterStyles from './SemiconductorBoard.module.css';
import SemiconductorBoardClient from './SemiconductorBoardClient';

const FILTER_COPY: Record<SiteLocale, { consult: string }> = {
  ko: { consult: '반도체 상담' },
  'zh-hant': { consult: '半導體諮詢' },
  en: { consult: 'Semiconductor consultation' },
  ja: { consult: '半導体の相談' },
};

function ConsultCta({
  locale,
  className,
  children,
}: {
  locale: SiteLocale;
  className?: string;
  children: ReactNode;
}) {
  const href = getSemiconductorBoardConsultHref(locale);
  if (isSemiconductorBoardConsultMailto(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function SemiconductorGuidePublic({ locale }: { locale: SiteLocale }) {
  const copy = semiconductorGuideCopy[locale];
  const filterCopy = FILTER_COPY[locale];
  const allColumns = listPublicSemiconductorColumns(locale);
  const cards: SemiconductorBoardCard[] = allColumns.map((post) => ({
    slug: post.slug,
    subtopics: semiconductorCardSubtopicsAttr(post.slug),
    title: post.title,
    summary: post.summary,
    badge: semiconductorColumnBadge(post, locale),
  }));
  const mailto = getConsultationPublicMailto(locale);

  return (
    <main className="semi-draft-page">
      <section className="svc-hero" data-tone="dark">
        <div className="container svc-hero-inner">
          <p className="svc-back-link" style={{ opacity: 0.8 }}>
            {copy.kicker}
          </p>
          <h1 className="svc-hero-title">{copy.title}</h1>
          <p className="svc-hero-subtitle">{copy.description}</p>
          <div className={`${filterStyles.consultCta} container`} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <ConsultCta locale={locale} className="button">
              {filterCopy.consult}
            </ConsultCta>
          </div>
        </div>
      </section>

      <article className="svc-article">
        <div className="container svc-container">
          <div className="svc-body semi-draft-reading">
            <SemiconductorBoardClient
              locale={locale}
              cards={cards}
              columnsHeading={copy.columnsHeading}
              readMore={copy.readMore}
            />

            <p style={{ marginTop: '2rem' }}>
              <Link href={`/${locale}${copy.landingHref}`} className="link-underline">
                {copy.landingLabel} →
              </Link>
            </p>
          </div>

          <aside className="svc-sidebar">
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">{copy.contactTitle}</h3>
              <p className="svc-sidebar-text">{copy.contactText}</p>
              <ConsultCta locale={locale} className="button svc-sidebar-btn">
                {filterCopy.consult}
              </ConsultCta>
              <Link href={`/${locale}/contact`} className="button--outline svc-sidebar-btn">
                {copy.contactBtn}
              </Link>
              <a
                href={mailto}
                className="button--outline svc-sidebar-btn"
                aria-label={`${copy.emailBtn}: ${CONSULTATION_EMAIL}`}
              >
                {copy.emailBtn}
              </a>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

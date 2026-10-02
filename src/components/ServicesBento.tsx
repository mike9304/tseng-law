import Link from 'next/link';
import type { ReactNode } from 'react';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { EN_HOME_SERVICES_ASSISTANCE } from '@/data/en-service-scope';
import { getServiceSlugs } from '@/data/service-details';
import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import ServicePracticeIcon from '@/components/ServicePracticeIcon';
import { homeServicesTextSurfaceIds } from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';
import styles from './HomeEditorial.module.css';

function compactServiceSummary(description: string, maxLength = 120): string {
  const text = description.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const candidate = text.slice(0, maxLength + 1);
  const boundary = Math.max(
    candidate.lastIndexOf(' '),
    candidate.lastIndexOf(','),
    candidate.lastIndexOf('，'),
    candidate.lastIndexOf('、'),
  );
  const end = boundary >= Math.floor(maxLength * 0.7) ? boundary : maxLength;
  return `${text.slice(0, end).trimEnd()}…`;
}

function orderServiceEntries<T>(items: readonly T[], slugs: readonly string[], order?: readonly string[]) {
  const entries = items.map((item, index) => ({ item, index }));
  if (!order?.length) return entries;
  const rank = (index: number) => {
    const position = order.indexOf(slugs[index] ?? '');
    return position === -1 ? order.length + index : position;
  };
  return [...entries].sort((a, b) => rank(a.index) - rank(b.index));
}

export default function ServicesBento({
  locale,
  id,
  variant = 'alt',
  tone = 'light',
  showHeader = true,
  presentation,
  scenarioTags,
  order,
  renderIcon,
}: {
  locale: SiteLocale;
  id?: string;
  variant?: 'default' | 'alt';
  tone?: 'light' | 'dark';
  showHeader?: boolean;
  presentation?: 'editorial';
  /** Optional short scenario labels per service slug (zh-hant home design). Omitted elsewhere. */
  scenarioTags?: Readonly<Record<string, readonly string[]>>;
  /** Optional display order by service slug (zh-hant home, ja and en designs). Icons and anchors keep each service's own index. Omitted elsewhere. */
  order?: readonly string[];
  /** Optional icon per service index (zh-hant home: the monoline set). Omitted elsewhere, so ServicePracticeIcon renders as before. */
  renderIcon?: (index: number) => ReactNode;
}) {
  const { services } = siteContent[locale];
  const editorial = presentation === 'editorial';
  const sectionClass = variant === 'alt' ? 'section section--gray alt' : 'section section--light';
  const HeadingTag: 'h2' | 'h3' = showHeader ? 'h3' : 'h2';
  const detailLabel = locale === 'ko'
    ? '자세히 보기 →'
    : locale === 'zh-hant'
      ? '查看詳情 →'
      : locale === 'ja'
        ? '詳しく見る →'
      : 'View details →';
  const serviceSlugs = getServiceSlugs();
  const aliasAnchors = new Map<number, string[]>();
  services.items.forEach((item, index) => {
    const anchor = item.href.split('#')[1];
    if (anchor === 'civil') aliasAnchors.set(index, ['real-estate']);
    if (anchor === 'ip') aliasAnchors.set(index, ['finance']);
  });

  return (
    <section
      className={`${sectionClass} services-bento${editorial ? ` ${styles.servicesEditorial}` : ''}`}
      id={id}
      data-tone={tone}
      data-presentation={editorial ? 'editorial' : undefined}
      aria-label={showHeader ? undefined : services.title}
    >
      <div className="container">
        {showHeader ? (
          <>
            <SectionLabel data-builder-surface-key={homeServicesTextSurfaceIds[0]}>
              <SurfaceText surfaceKey={homeServicesTextSurfaceIds[0]}>{services.label}</SurfaceText>
            </SectionLabel>
            <h2 className="section-title" data-builder-surface-key={homeServicesTextSurfaceIds[1]}>
              <SurfaceText surfaceKey={homeServicesTextSurfaceIds[1]}>{services.title}</SurfaceText>
            </h2>
            <p className="section-lede" data-builder-surface-key={homeServicesTextSurfaceIds[2]}>
              <SurfaceText surfaceKey={homeServicesTextSurfaceIds[2]}>{services.description}</SurfaceText>
            </p>
            <OrnamentDivider />
          </>
        ) : null}
        <div className="services-detail-list services-card-grid">
          {orderServiceEntries(services.items, serviceSlugs, order).map(({ item, index }) => {
            const anchor = item.href.split('#')[1];
            const aliases = aliasAnchors.get(index) ?? [];
            return (
              <div key={item.title} className="services-card-grid-item">
                {aliases.map((alias) => (
                  <span key={alias} id={alias} className="services-anchor-alias" aria-hidden />
                ))}
                <article
                  className="services-detail-card services-card"
                  {...(anchor ? { id: anchor } : {})}
                >
                  <div className="services-detail-header services-card-header">
                    <span className="service-icon" aria-hidden>
                      {renderIcon ? renderIcon(index) : <ServicePracticeIcon index={index} />}
                    </span>
                    <HeadingTag className="services-detail-title">{item.title}</HeadingTag>
                  </div>
                  <div className="services-detail-body services-card-body">
                    <p className="services-detail-desc services-card-summary">
                      {editorial ? item.description : compactServiceSummary(item.description)}
                    </p>
                    {scenarioTags && serviceSlugs[index] && scenarioTags[serviceSlugs[index]]?.length ? (
                      <ul className="services-card-tags" aria-label={`${item.title}：常見情境`}>
                        {scenarioTags[serviceSlugs[index]].map((tag) => <li key={tag}>{tag}</li>)}
                      </ul>
                    ) : null}
                    {serviceSlugs[index] && (
                      <Link
                        href={`/${locale}/services/${serviceSlugs[index]}`}
                        className="services-detail-more services-card-link"
                        aria-label={`${item.title}: ${detailLabel.replace(/\s*→$/, '')}`}
                      >
                        {detailLabel}
                      </Link>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
        {locale === 'en' ? (
          <p className="services-assistance-note">
            {EN_HOME_SERVICES_ASSISTANCE.beforeContact}
            <Link href={`/${locale}/contact`}>
              {EN_HOME_SERVICES_ASSISTANCE.contactLabel}
            </Link>
            {EN_HOME_SERVICES_ASSISTANCE.afterContact}
          </p>
        ) : null}
        <CorporateAdvisoryLink locale={locale} />
      </div>
    </section>
  );
}

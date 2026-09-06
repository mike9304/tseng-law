import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import ServicePracticeIcon from '@/components/ServicePracticeIcon';
import { homeServicesTextSurfaceIds } from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';

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

export default function ServicesBento({
  locale,
  id,
  variant = 'alt',
  tone = 'light',
  showHeader = true
}: {
  locale: SiteLocale;
  id?: string;
  variant?: 'default' | 'alt';
  tone?: 'light' | 'dark';
  showHeader?: boolean;
}) {
  const { services } = siteContent[locale];
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
      className={`${sectionClass} services-bento`}
      id={id}
      data-tone={tone}
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
          {services.items.map((item, index) => {
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
                      <ServicePracticeIcon index={index} />
                    </span>
                    <HeadingTag className="services-detail-title">{item.title}</HeadingTag>
                  </div>
                  <div className="services-detail-body services-card-body">
                    <p className="services-detail-desc services-card-summary">
                      {compactServiceSummary(item.description)}
                    </p>
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
        <CorporateAdvisoryLink locale={locale} />
      </div>
    </section>
  );
}

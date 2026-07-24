'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import ServicePracticeIcon from '@/components/ServicePracticeIcon';
import { homeServicesTextSurfaceIds } from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';

export default function ServicesBento({
  locale,
  id,
  variant = 'alt',
  tone = 'light'
}: {
  locale: SiteLocale;
  id?: string;
  variant?: 'default' | 'alt';
  tone?: 'light' | 'dark';
}) {
  const { services } = siteContent[locale];
  const sectionClass = variant === 'alt' ? 'section section--gray alt' : 'section section--light';
  const relatedLabel = locale === 'ko'
    ? '관련 칼럼'
    : locale === 'zh-hant'
      ? '相關專欄'
      : locale === 'ja'
        ? '関連コラム'
        : 'Related Columns';
  const detailLabel = locale === 'ko'
    ? '자세히 보기 →'
    : locale === 'zh-hant'
      ? '查看詳情 →'
      : 'View details →';
  const serviceSlugs = getServiceSlugs();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const anchorToIndex = useMemo(() => {
    const map = new Map<string, number>();
    services.items.forEach((item, index) => {
      const anchor = item.href.split('#')[1];
      if (anchor) {
        map.set(anchor, index);
      }
    });
    const civilIndex = map.get('civil');
    if (civilIndex != null) {
      map.set('real-estate', civilIndex);
    }
    const ipIndex = map.get('ip');
    if (ipIndex != null) {
      map.set('finance', ipIndex);
    }
    return map;
  }, [services.items]);
  const aliasAnchors = useMemo(() => {
    const aliases = new Map<number, string[]>();
    const civilIndex = anchorToIndex.get('civil');
    if (civilIndex != null) {
      aliases.set(civilIndex, ['real-estate']);
    }
    const ipIndex = anchorToIndex.get('ip');
    if (ipIndex != null) {
      aliases.set(ipIndex, [...(aliases.get(ipIndex) ?? []), 'finance']);
    }
    return aliases;
  }, [anchorToIndex]);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  useEffect(() => {
    const syncFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (!hash) return;
      const index = anchorToIndex.get(hash);
      if (index != null) {
        setOpenIndex(index);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [anchorToIndex]);

  return (
    <section className={sectionClass} id={id} data-tone={tone}>
      <div className="container">
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
        <div className="services-detail-list">
          {services.items.map((item, index) => {
            const anchor = item.href.split('#')[1];
            const isOpen = openIndex === index;
            const aliases = aliasAnchors.get(index) ?? [];
            return (
              <div key={item.title}>
                {aliases.map((alias) => (
                  <span key={alias} id={alias} className="services-anchor-alias" aria-hidden />
                ))}
                <article
                  className={`services-detail-card${isOpen ? ' is-open' : ''}`}
                  {...(anchor ? { id: anchor } : {})}
                >
                  <button
                    type="button"
                    className="services-detail-toggle"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <div className="services-detail-header">
                      <span className="service-icon" aria-hidden>
                        <ServicePracticeIcon index={index} />
                      </span>
                      <h3 className="services-detail-title">{item.title}</h3>
                    </div>
                    <span className={`services-detail-chevron${isOpen ? ' open' : ''}`} aria-hidden>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div className={`services-detail-body${isOpen ? ' is-open' : ''}`}>
                    <p className="services-detail-desc">{item.description}</p>
                    {item.details && item.details.length > 0 && (
                      <ul className="services-detail-checklist">
                        {item.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    )}
                    {item.relatedColumns && item.relatedColumns.length > 0 && (
                      <div className="services-detail-columns">
                        <span className="services-detail-columns-label">{relatedLabel}</span>
                        <div className="services-detail-columns-list">
                          {item.relatedColumns.map((col) => (
                            <Link key={col.slug} href={`/${locale}/columns/${col.slug}`} className="services-column-link">
                              {col.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {locale !== 'ja' && serviceSlugs[index] && (
                      <Link href={`/${locale}/services/${serviceSlugs[index]}`} className="services-detail-more">
                        {detailLabel}
                      </Link>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

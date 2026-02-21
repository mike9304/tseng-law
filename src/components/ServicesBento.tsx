'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';

function ServiceIcon({ index }: { index: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const };

  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 18h16" {...common} />
        <path d="M6 18V8h4v10" {...common} />
        <path d="M14 18V5h4v13" {...common} />
        <path d="M4 12l4-4 4 3 8-6" {...common} />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 5h10l3 3v11H6z" {...common} />
        <path d="M16 5v3h3" {...common} />
        <path d="M9 13h7M9 17h5" {...common} />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M3 12h18" {...common} />
        <path d="M7 9l-4 3 4 3" {...common} />
        <path d="M17 9l4 3-4 3" {...common} />
        <path d="M10 7h4M10 17h4" {...common} />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3l7 3v6c0 4.5-2.6 7.6-7 9-4.4-1.4-7-4.5-7-9V6l7-3z" {...common} />
        <path d="M9 12l2 2 4-4" {...common} />
      </svg>
    );
  }
  if (index === 4) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3l7 3v6c0 4.5-2.6 7.6-7 9-4.4-1.4-7-4.5-7-9V6l7-3z" {...common} />
        <path d="M9 12l2 2 4-4" {...common} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M5 19V7l7-3 7 3v12" {...common} />
      <path d="M9 12h6M9 15h6" {...common} />
    </svg>
  );
}

export default function ServicesBento({
  locale,
  id,
  variant = 'alt',
  tone = 'light'
}: {
  locale: Locale;
  id?: string;
  variant?: 'default' | 'alt';
  tone?: 'light' | 'dark';
}) {
  const { services } = siteContent[locale];
  const sectionClass = variant === 'alt' ? 'section section--gray alt' : 'section section--light';
  const relatedLabel = locale === 'ko' ? '관련 칼럼' : locale === 'zh-hant' ? '相關專欄' : 'Related Columns';
  const detailLabel = locale === 'ko' ? '자세히 보기 →' : locale === 'zh-hant' ? '查看詳情 →' : 'View details →';
  const serviceSlugs = getServiceSlugs();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className={sectionClass} id={id} data-tone={tone}>
      <div className="container">
        <SectionLabel>{services.label}</SectionLabel>
        <h2 className="section-title">{services.title}</h2>
        <p className="section-lede">{services.description}</p>
        <OrnamentDivider />
        <div className="services-detail-list">
          {services.items.map((item, index) => {
            const anchor = item.href.split('#')[1];
            const isOpen = openIndex === index;
            return (
              <article
                key={item.title}
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
                      <ServiceIcon index={index} />
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
                  {serviceSlugs[index] && (
                    <Link href={`/${locale}/services/${serviceSlugs[index]}`} className="services-detail-more">
                      {detailLabel}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

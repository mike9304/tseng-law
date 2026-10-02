'use client';

import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import type { trafficHubCopy } from '@/data/traffic-hub';
import { TRAFFIC_DIAGRAM_ID } from '@/data/traffic-hub';
import type { TrafficBoardItem, TrafficBoardQuery } from '@/lib/traffic-collection';
import JsonLd from '@/components/JsonLd';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';
import TrafficBoard from './TrafficBoard';
import styles from './traffic.module.css';
import zhStyles from './ZhHantTraffic.module.css';

// Preserve SSR while constructing the view synchronously from complete plain-data
// props, instead of hydrating partially streamed RSC element children.
export default function TrafficPageView({ locale, items, query, copy, collectionJsonLd }: {
  locale: SiteLocale;
  items: readonly TrafficBoardItem[];
  query: TrafficBoardQuery;
  copy: (typeof trafficHubCopy)[SiteLocale];
  collectionJsonLd: Record<string, unknown>;
}) {
  // zh-hant only: the Apple-pass wrapper (id + data-zh-hant-design) that ZhHantTraffic.module.css is scoped to.
  const zhWrapper = locale === 'zh-hant' ? { id: 'zh-hant-traffic', 'data-zh-hant-design': 'traffic' } : {};
  return (
    <div className={locale === 'zh-hant' ? `${styles.page} ${zhStyles.zh}` : styles.page} {...zhWrapper}>
      <JsonLd data={collectionJsonLd} />
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p className={styles.intro}>{copy.description}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#articles">{copy.columns} ↓</a>
            <Link className={styles.secondary} href={`/${locale}/contact`}>{copy.contact} →</Link>
          </div>
        </div>
      </section>
      <div className={styles.container}>
        <section className={styles.section} id="articles" aria-labelledby="articles-title">
          <div className={styles.heading}><h2 id="articles-title">{copy.columns}</h2><Link href={`/${locale}/columns`}>{copy.allColumns} →</Link></div>
          <TrafficBoard locale={locale} items={items} query={query} />
        </section>
        <section className={styles.visual} aria-labelledby="visual-title">
          <div className={styles.visualIntro}><h2 id="visual-title">{copy.visualTitle}</h2><p>{copy.visualText}</p></div>
          <TrafficDiagramFigure diagramId={TRAFFIC_DIAGRAM_ID} locale={locale} />
        </section>
        <section className={styles.section} aria-labelledby="countries-title">
          <h2 id="countries-title">{copy.countriesTitle}</h2><p className={styles.sectionIntro}>{copy.countriesIntro}</p>
          <div className={styles.countries}>{copy.countries.map(country => (
            <article key={country.id} className={country.id === 'tw' ? styles.taiwan : undefined}>
              <h3>{country.name}</h3><p>{country.text}</p>
              {country.href.startsWith('/') ? <Link href={`/${locale}${country.href}`}>{country.linkLabel} →</Link>
                : <a href={country.href} target="_blank" rel="noopener noreferrer">{country.linkLabel} ↗</a>}
            </article>
          ))}</div>
        </section>
        <section className={styles.contact} aria-labelledby="contact-title">
          <div><h2 id="contact-title">{copy.contactTitle}</h2><p>{copy.contactText}</p></div>
          <Link className={styles.primary} href={`/${locale}/contact`}>{copy.contact} →</Link>
        </section>
      </div>
    </div>
  );
}

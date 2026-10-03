'use client';

import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import type { trafficHubCopy } from '@/data/traffic-hub';
import { TRAFFIC_DIAGRAM_ID } from '@/data/traffic-hub';
import type { TrafficBoardItem, TrafficBoardQuery } from '@/lib/traffic-collection';
import JsonLd from '@/components/JsonLd';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';
import EnPageShell, { EnBand } from '@/components/en-design/EnPageShell';
import enV2 from '@/components/en-design/EnPagesV2.module.css';
import enStyles from '@/components/en-design/EnTraffic.module.css';
import enBoardStyles from '@/components/en-design/EnTrafficBoard.module.css';
import TrafficBoard from './TrafficBoard';
import styles from './traffic.module.css';
import zhStyles from './ZhHantTraffic.module.css';

// en (Clear Night inner pages): the hub's own class slots mapped to the en modules; the shared pill and text link
// come from EnPagesV2. Only /en/ reads this map, so the other locales keep traffic.module.css.
const EN_CLASSES: Readonly<Record<string, string>> = { ...enStyles, primary: enV2.pill, secondary: enV2.textLink };
const EN_THUMB_SIZES = '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 240px, 320px';

// Preserve SSR while constructing the view synchronously from complete plain-data
// props, instead of hydrating partially streamed RSC element children.
export default function TrafficPageView({ locale, items, query, copy, collectionJsonLd }: {
  locale: SiteLocale;
  items: readonly TrafficBoardItem[];
  query: TrafficBoardQuery;
  copy: (typeof trafficHubCopy)[SiteLocale];
  collectionJsonLd: Record<string, unknown>;
}) {
  const en = locale === 'en';
  const s = en ? EN_CLASSES : styles;
  // zh-hant only: the Apple-pass wrapper (id + data-zh-hant-design) that ZhHantTraffic.module.css is scoped to.
  const zhWrapper = locale === 'zh-hant' ? { id: 'zh-hant-traffic', 'data-zh-hant-design': 'traffic' } : {};
  // en: the contact panel becomes the full-bleed closing card after the content column.
  const contact = (
    <section className={s.contact} aria-labelledby="contact-title">
      <div><h2 id="contact-title">{copy.contactTitle}</h2><p>{copy.contactText}</p></div>
      <Link className={s.primary} href={`/${locale}/contact`}>{copy.contact} →</Link>
    </section>
  );
  const view = (
    <div className={locale === 'zh-hant' ? `${styles.page} ${zhStyles.zh}` : s.page} {...zhWrapper}>
      <JsonLd data={collectionJsonLd} />
      <section className={s.hero}>
        <div className={s.container}>
          <p className={s.kicker}>{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p className={s.intro}>{copy.description}</p>
          <div className={s.actions}>
            <a className={s.primary} href="#articles">{copy.columns} ↓</a>
            <Link className={s.secondary} href={`/${locale}/contact`}>{copy.contact} →</Link>
          </div>
        </div>
      </section>
      {/* en: the B1 drops band under the title card (decorative, nothing focusable). */}
      {en ? <EnBand name="drops" /> : null}
      <div className={s.container}>
        <section className={s.section} id="articles" aria-labelledby="articles-title">
          <div className={s.heading}><h2 id="articles-title">{copy.columns}</h2><Link className={en ? enV2.textLink : undefined} href={`/${locale}/columns`}>{copy.allColumns} →</Link></div>
          {en
            ? <TrafficBoard locale={locale} items={items} query={query} classes={enBoardStyles} thumbSizes={EN_THUMB_SIZES} />
            : <TrafficBoard locale={locale} items={items} query={query} />}
        </section>
        <section className={s.visual} aria-labelledby="visual-title">
          <div className={s.visualIntro}><h2 id="visual-title">{copy.visualTitle}</h2><p>{copy.visualText}</p></div>
          <TrafficDiagramFigure diagramId={TRAFFIC_DIAGRAM_ID} locale={locale} className={en ? enStyles.figure : undefined} />
        </section>
        <section className={s.section} aria-labelledby="countries-title">
          <h2 id="countries-title">{copy.countriesTitle}</h2><p className={s.sectionIntro}>{copy.countriesIntro}</p>
          <div className={s.countries}>{copy.countries.map(country => (
            <article key={country.id} className={en ? `${enV2.card} ${enStyles.country}` : country.id === 'tw' ? styles.taiwan : undefined}>
              <h3>{country.name}</h3><p>{country.text}</p>
              {country.href.startsWith('/') ? <Link className={en ? enV2.textLink : undefined} href={`/${locale}${country.href}`}>{country.linkLabel} →</Link>
                : <a className={en ? enV2.textLink : undefined} href={country.href} target="_blank" rel="noopener noreferrer">{country.linkLabel} ↗</a>}
            </article>
          ))}</div>
        </section>
        {en ? null : contact}
      </div>
      {en ? contact : null}
    </div>
  );
  return en ? <EnPageShell page="traffic">{view}</EnPageShell> : view;
}

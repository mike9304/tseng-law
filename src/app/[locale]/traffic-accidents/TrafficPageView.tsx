'use client';

import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import type { trafficHubCopy } from '@/data/traffic-hub';
import { TRAFFIC_DIAGRAM_ID } from '@/data/traffic-hub';
import type { TrafficBoardItem, TrafficBoardQuery } from '@/lib/traffic-collection';
import JsonLd from '@/components/JsonLd';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';
import JaPageShell from '@/components/ja-design/JaPageShell';
import JaHeaderBand from '@/components/ja-design/JaHeaderBand';
import JaClosingTile from '@/components/ja-design/JaClosingTile';
import JaWrap from '@/components/ja-design/JaWrap';
import jaV2 from '@/components/ja-design/JaPagesV2.module.css';
import jaStyles from '@/components/ja-design/JaTraffic.module.css';
import TrafficBoard from './TrafficBoard';
import styles from './traffic.module.css';
import zhStyles from './ZhHantTraffic.module.css';

/**
 * ja 昊 V2 H1 (2026-10-04): the authored first line at inner-page H1 size, the second as a smaller tier.
 * The text, including the authored line break, is unchanged; the <wbr> phrase breaks only matter on phones.
 */
function jaTitle(title: string) {
  const [lead, ...rest] = title.split('\n');
  return (
    <>
      <span className={`${jaStyles.titleLead} ${jaV2.ph}`}><JaWrap text={lead} /></span>
      {rest.length ? <>{'\n'}<span className={jaStyles.titleSub}>{rest.join('\n')}</span></> : null}
    </>
  );
}

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
  // ja only (昊 V2 inner pages, 2026-10-04): the same blocks inside JaPageShell with the ja classes
  // (JaTraffic.module.css) in place of the hub's; arrow glyphs become CSS chevrons, the header gains the
  // patterned-glass band and the consult block becomes the dusk closing tile. Other locales render as before.
  const ja = locale === 'ja';
  const cx = (base: string, jaClass: string) => (ja ? jaClass : base);
  const arrow = (glyph: string) => (ja ? null : glyph);
  // ja headings break only between phrases (<wbr> + keep-all), so WebKit never splits a word such as 責任.
  const phrases = (text: string) => (ja ? <JaWrap text={text} /> : text);
  const phraseClass = ja ? jaV2.ph : undefined;
  const view = (
    <div className={locale === 'zh-hant' ? `${styles.page} ${zhStyles.zh}` : cx(styles.page, jaStyles.page)} {...zhWrapper}>
      <JsonLd data={collectionJsonLd} />
      <section className={cx(styles.hero, jaStyles.hero)}>
        <div className={cx(styles.container, jaStyles.inner)}>
          <p className={cx(styles.kicker, jaStyles.kicker)}>{copy.kicker}</p>
          <h1 className={ja ? jaStyles.title : undefined}>{ja ? jaTitle(copy.title) : copy.title}</h1>
          <p className={cx(styles.intro, jaStyles.intro)}>{copy.description}</p>
          <div className={cx(styles.actions, jaStyles.actions)}>
            <a className={cx(styles.primary, `${jaV2.pill} ${jaV2.pillBlock}`)} href="#articles">{copy.columns}{arrow(' ↓')}</a>
            <Link className={cx(styles.secondary, jaV2.chev)} href={`/${locale}/contact`}>{copy.contact}{arrow(' →')}</Link>
          </div>
        </div>
        {ja ? <JaHeaderBand /> : null}
      </section>
      <div className={cx(styles.container, jaStyles.body)}>
        <section className={cx(styles.section, jaStyles.board)} id="articles" aria-labelledby="articles-title">
          <div className={cx(styles.heading, jaStyles.heading)}><h2 id="articles-title" className={phraseClass}>{phrases(copy.columns)}</h2><Link className={ja ? jaV2.chev : undefined} href={`/${locale}/columns`}>{copy.allColumns}{arrow(' →')}</Link></div>
          <TrafficBoard locale={locale} items={items} query={query} />
        </section>
        <section className={cx(styles.visual, jaStyles.visual)} aria-labelledby="visual-title">
          <div className={cx(styles.visualIntro, jaStyles.visualIntro)}><h2 id="visual-title" className={phraseClass}>{phrases(copy.visualTitle)}</h2><p>{copy.visualText}</p></div>
          <TrafficDiagramFigure diagramId={TRAFFIC_DIAGRAM_ID} locale={locale} />
        </section>
        <section className={cx(styles.section, jaStyles.countriesSection)} aria-labelledby="countries-title">
          <h2 id="countries-title" className={phraseClass}>{phrases(copy.countriesTitle)}</h2><p className={cx(styles.sectionIntro, jaStyles.sectionIntro)}>{copy.countriesIntro}</p>
          <div className={cx(styles.countries, jaStyles.countries)}>{copy.countries.map(country => (
            <article key={country.id} className={country.id === 'tw' ? cx(styles.taiwan, jaStyles.taiwan) : undefined}>
              <h3>{country.name}</h3><p>{country.text}</p>
              {country.href.startsWith('/') ? <Link className={ja ? jaV2.chev : undefined} href={`/${locale}${country.href}`}>{country.linkLabel}{arrow(' →')}</Link>
                : <a href={country.href} target="_blank" rel="noopener noreferrer">{country.linkLabel} ↗</a>}
            </article>
          ))}</div>
        </section>
        {ja ? (
          <JaClosingTile labelledBy="contact-title">
            <h2 id="contact-title" className={`${jaStyles.closingTitle} ${jaV2.ph}`}><JaWrap text={copy.contactTitle} /></h2>
            <p className={jaStyles.closingText}>{copy.contactText}</p>
            <Link className={`${jaV2.pill} ${jaV2.pillBlock} ${jaStyles.closingAction}`} href={`/${locale}/contact`}>{copy.contact}</Link>
          </JaClosingTile>
        ) : (
          <section className={styles.contact} aria-labelledby="contact-title">
            <div><h2 id="contact-title">{copy.contactTitle}</h2><p>{copy.contactText}</p></div>
            <Link className={styles.primary} href={`/${locale}/contact`}>{copy.contact} →</Link>
          </section>
        )}
      </div>
    </div>
  );
  return ja ? <JaPageShell page="traffic" className={jaStyles.root}>{view}</JaPageShell> : view;
}

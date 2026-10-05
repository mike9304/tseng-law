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
import JaPageShell from '@/components/ja-design/JaPageShell';
import JaHeaderBand from '@/components/ja-design/JaHeaderBand';
import JaClosingTile from '@/components/ja-design/JaClosingTile';
import JaWrap from '@/components/ja-design/JaWrap';
import jaV2 from '@/components/ja-design/JaPagesV2.module.css';
import jaStyles from '@/components/ja-design/JaTraffic.module.css';
import TrafficBoard from './TrafficBoard';
import { ZhHantTrail } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import styles from './traffic.module.css';
import zhStyles from './ZhHantTraffic.module.css';

// en (Clear Night inner pages): the hub's own class slots mapped to the en modules; the shared pill and text link
// come from EnPagesV2. Only /en/ reads this map, so the other locales keep traffic.module.css.
const EN_CLASSES: Readonly<Record<string, string>> = { ...enStyles, primary: enV2.pill, secondary: enV2.textLink };
const EN_THUMB_SIZES = '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 240px, 320px';
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
  const en = locale === 'en';
  const s = en ? EN_CLASSES : styles;
  // zh-hant only: the Apple-pass wrapper (id + data-zh-hant-design) that ZhHantTraffic.module.css is scoped to.
  const zhWrapper = locale === 'zh-hant' ? { id: 'zh-hant-traffic', 'data-zh-hant-design': 'traffic' } : {};
  const ja = locale === 'ja';
  // ja only (昊 V2 inner pages, 2026-10-04): the ja classes (JaTraffic.module.css) replace the hub's; arrow glyphs
  // become CSS chevrons, the header gains the patterned-glass band and the consult block becomes the dusk closing tile.
  const cx = (base: string, jaClass: string) => (ja ? jaClass : base);
  // zh-hant: the same links carry the monoline glyph instead of the typed arrow.
  const zh = locale === 'zh-hant';
  const ZH_GLYPH = { ' ↓': 'arrow-down', ' →': 'arrow-right', ' ↗': 'arrow-up-right' } as const;
  const arrow = (glyph: keyof typeof ZH_GLYPH) => (ja ? null : zh ? <ZhHantTrail name={ZH_GLYPH[glyph]} /> : glyph);
  // ja headings break only between phrases (<wbr> + keep-all), so WebKit never splits a word such as 責任.
  const phrases = (text: string) => (ja ? <JaWrap text={text} /> : text);
  const phraseClass = ja ? jaV2.ph : undefined;
  // en: the contact panel becomes the full-bleed closing card after the content column.
  const contact = (
    <section className={s.contact} aria-labelledby="contact-title">
      <div><h2 id="contact-title">{copy.contactTitle}</h2><p>{copy.contactText}</p></div>
      <Link className={s.primary} href={`/${locale}/contact`}>{zh ? <>{copy.contact}<ZhHantTrail /></> : <>{copy.contact} →</>}</Link>
    </section>
  );
  const view = (
    <div className={locale === 'zh-hant' ? `${styles.page} ${zhStyles.zh}` : cx(s.page, jaStyles.page)} {...zhWrapper}>
      <JsonLd data={collectionJsonLd} />
      <section className={cx(s.hero, jaStyles.hero)}>
        <div className={cx(s.container, jaStyles.inner)}>
          <p className={cx(s.kicker, jaStyles.kicker)}>{copy.kicker}</p>
          <h1 className={ja ? jaStyles.title : undefined}>{ja ? jaTitle(copy.title) : copy.title}</h1>
          <p className={cx(s.intro, jaStyles.intro)}>{copy.description}</p>
          <div className={cx(s.actions, jaStyles.actions)}>
            <a className={cx(s.primary, `${jaV2.pill} ${jaV2.pillBlock}`)} href="#articles">{copy.columns}{arrow(' ↓')}</a>
            <Link className={cx(s.secondary, jaV2.chev)} href={`/${locale}/contact`}>{copy.contact}{arrow(' →')}</Link>
          </div>
        </div>
        {ja ? <JaHeaderBand /> : null}
      </section>
      {/* en: the B1 drops band under the title card (decorative, nothing focusable). */}
      {en ? <EnBand name="drops" /> : null}
      <div className={cx(s.container, jaStyles.body)}>
        <section className={cx(s.section, jaStyles.board)} id="articles" aria-labelledby="articles-title">
          <div className={cx(s.heading, jaStyles.heading)}><h2 id="articles-title" className={phraseClass}>{phrases(copy.columns)}</h2><Link className={ja ? jaV2.chev : en ? enV2.textLink : undefined} href={`/${locale}/columns`}>{copy.allColumns}{arrow(' →')}</Link></div>
          {en
            ? <TrafficBoard locale={locale} items={items} query={query} classes={enBoardStyles} thumbSizes={EN_THUMB_SIZES} />
            : <TrafficBoard locale={locale} items={items} query={query} />}
        </section>
        <section className={cx(s.visual, jaStyles.visual)} aria-labelledby="visual-title">
          <div className={cx(s.visualIntro, jaStyles.visualIntro)}><h2 id="visual-title" className={phraseClass}>{phrases(copy.visualTitle)}</h2><p>{copy.visualText}</p></div>
          <TrafficDiagramFigure diagramId={TRAFFIC_DIAGRAM_ID} locale={locale} className={en ? enStyles.figure : undefined} />
        </section>
        <section className={cx(s.section, jaStyles.countriesSection)} aria-labelledby="countries-title">
          <h2 id="countries-title" className={phraseClass}>{phrases(copy.countriesTitle)}</h2><p className={cx(s.sectionIntro, jaStyles.sectionIntro)}>{copy.countriesIntro}</p>
          <div className={cx(s.countries, jaStyles.countries)}>{copy.countries.map(country => (
            <article key={country.id} className={en ? `${enV2.card} ${enStyles.country}` : country.id === 'tw' ? cx(styles.taiwan, jaStyles.taiwan) : undefined}>
              <h3>{country.name}</h3><p>{country.text}</p>
              {country.href.startsWith('/') ? <Link className={ja ? jaV2.chev : en ? enV2.textLink : undefined} href={`/${locale}${country.href}`}>{country.linkLabel}{arrow(' →')}</Link>
                : <a className={en ? enV2.textLink : undefined} href={country.href} target="_blank" rel="noopener noreferrer">{zh ? <>{country.linkLabel}<ZhHantTrail name="arrow-up-right" /></> : <>{country.linkLabel} ↗</>}</a>}
            </article>
          ))}</div>
        </section>
        {ja ? (
          <JaClosingTile labelledBy="contact-title">
            <h2 id="contact-title" className={`${jaStyles.closingTitle} ${jaV2.ph}`}><JaWrap text={copy.contactTitle} /></h2>
            <p className={jaStyles.closingText}>{copy.contactText}</p>
            <Link className={`${jaV2.pill} ${jaV2.pillBlock} ${jaStyles.closingAction}`} href={`/${locale}/contact`}>{copy.contact}</Link>
          </JaClosingTile>
        ) : en ? null : contact}
      </div>
      {en ? contact : null}
    </div>
  );
  if (ja) return <JaPageShell page="traffic" className={jaStyles.root}>{view}</JaPageShell>;
  return en ? <EnPageShell page="traffic">{view}</EnPageShell> : view;
}

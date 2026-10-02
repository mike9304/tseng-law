import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isSiteLocale, siteLocales } from '@/lib/locales';
import { buildCollectionPageJsonLd, buildSeoMetadata, getLocalizedPath } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { TRAFFIC_DIAGRAM_ID, TRAFFIC_PATH, trafficHubCopy } from '@/data/traffic-hub';
import { parseTrafficBoardQuery, type TrafficSearchParams } from '@/lib/traffic-collection';
import { loadTrafficCollection } from '@/lib/traffic-collection-server';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';
import TrafficBoard from './TrafficBoard';
import styles from './traffic.module.css';
import zhStyles from './ZhHantTraffic.module.css';

// Published CMS columns join the board at runtime, and the board reads its filters from the query string.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const copy = trafficHubCopy[locale];
  // The canonical is always the bare hub path, never a filtered query URL.
  return buildSeoMetadata({ locale, title: copy.title.replace('\n', ' '), description: copy.description,
    path: TRAFFIC_PATH, alternateLocales: siteLocales });
}

export default async function TrafficAccidentPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<TrafficSearchParams>;
}) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const copy = trafficHubCopy[locale];
  const [items, query] = await Promise.all([
    loadTrafficCollection(locale),
    Promise.resolve(searchParams).then(parseTrafficBoardQuery),
  ]);
  const collectionJsonLd = buildCollectionPageJsonLd({
    locale,
    path: getLocalizedPath(locale, TRAFFIC_PATH),
    name: copy.columns,
    description: copy.description,
    items: items.map((item) => ({ name: item.title, path: item.href, ...(item.summary ? { description: item.summary } : {}) })),
  });
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

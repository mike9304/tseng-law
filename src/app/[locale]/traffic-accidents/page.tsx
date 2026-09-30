import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isSiteLocale, siteLocales } from '@/lib/locales';
import { getColumnPost } from '@/lib/columns';
import { buildSeoMetadata } from '@/lib/seo';
import { TRAFFIC_COLUMN_SLUGS, TRAFFIC_PATH, trafficHubCopy } from '@/data/traffic-hub';
import styles from './traffic.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const copy = trafficHubCopy[locale];
  return buildSeoMetadata({ locale, title: copy.title.replace('\n', ' '), description: copy.description,
    path: TRAFFIC_PATH, alternateLocales: siteLocales });
}

export default async function TrafficAccidentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const copy = trafficHubCopy[locale];
  const posts = TRAFFIC_COLUMN_SLUGS.map(slug => getColumnPost(slug, locale));
  return (
    <div className={styles.page}>
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
          <div className={styles.articles}>{posts.map((post) => post && (
            <Link className={styles.article} key={post.slug} href={`/${locale}/columns/${post.slug}`}>
              <h3>{post.title}</h3><p>{post.summary}</p><span className={styles.read}>{copy.read} →</span>
            </Link>
          ))}</div>
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

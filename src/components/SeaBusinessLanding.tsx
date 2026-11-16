import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JsonLd from '@/components/JsonLd';
import { guidanceContent } from '@/data/international-guidance-content';
import { seaBusinessContent, SEA_BUSINESS_SOURCES } from '@/data/sea-business-guidance';
import { getAllColumnPosts } from '@/lib/columns';
import { isSeaBusinessLocale, SEA_BUSINESS_LOCALES, type SeaBusinessPageKey } from '@/lib/sea-business-routes';
import { buildBreadcrumbJsonLd, buildGuidanceLegalServiceJsonLd, buildSeoMetadata } from '@/lib/seo';
import styles from './SeaBusinessLanding.module.css';

export async function seaBusinessMetadata(locale: string, key: SeaBusinessPageKey): Promise<Metadata> {
  if (!isSeaBusinessLocale(locale)) notFound();
  const page = seaBusinessContent[locale][key];
  return buildSeoMetadata({ locale, title: page.title, description: page.description, path: `/${key}`,
    alternateLocales: SEA_BUSINESS_LOCALES, xDefaultWithinCluster: true });
}

export default function SeaBusinessLanding({ locale, pageKey }: { locale: string; pageKey: SeaBusinessPageKey }) {
  if (!isSeaBusinessLocale(locale)) notFound();
  const copy = seaBusinessContent[locale], page = copy[pageKey], core = guidanceContent[locale];
  const slugs = pageKey === 'company-setup'
    ? ['taiwan-company-establishment-basics', 'taiwan-company-subsidiary-vs-branch', 'withdraw-capital-taiwan-company']
    : ['taiwan-unpaid-invoice-debt-collection'];
  const posts = getAllColumnPosts(locale), related = slugs.flatMap(slug => posts.filter(p => p.slug === slug));
  const english = pageKey === 'company-setup' ? '/en/taiwan-company-setup-lawyer' : '/en/taiwan-litigation-lawyer';
  return <article lang={locale} data-sea-business-page={pageKey}>
    <PageHeader locale={locale} label={copy.heading} title={page.title} description={page.description} />
    <div className={`container ${styles.prose}`}>
      <p>{page.intro}</p>
      {page.sections.map(section => <section key={section.heading}>
        <h2>{section.heading}</h2>
        {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.items?.length ? <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul> : null}
        {section.sources?.map(key => <p key={key}><a href={SEA_BUSINESS_SOURCES[key].href}>{SEA_BUSINESS_SOURCES[key].title}</a></p>)}
      </section>)}
      {related.length ? <section><h2>{copy.relatedLabel}</h2><ul>{related.map(post => <li key={post.slug}><Link href={`/${locale}/columns/${post.slug}`}>{post.title}</Link></li>)}</ul></section> : null}
      <p>{copy.languageNote}</p>
      <nav aria-label={copy.heading}><ul className="contact-list">
        {(['services', 'pricing', 'contact'] as const).map(key => <li key={key}><Link href={`/${locale}/${key}`}>{core.nav[key]}</Link></li>)}
        <li><Link href={english}>{copy.englishLabel}</Link></li>
      </ul></nav>
    </div>
    <JsonLd data={buildBreadcrumbJsonLd(locale, [{ name: core.nav.home, path: `/${locale}` }, { name: page.title, path: `/${locale}/${pageKey}` }])} />
    <JsonLd data={buildGuidanceLegalServiceJsonLd({ inLanguage: locale, url: `https://tseng-law.com/${locale}/${pageKey}`, description: page.description, contactUrl: `https://tseng-law.com/${locale}/contact` })} />
  </article>;
}

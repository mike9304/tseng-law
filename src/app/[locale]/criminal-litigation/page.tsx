import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { getAllColumnPosts } from '@/lib/columns';
import { buildCollectionPageJsonLd, buildSeoMetadata } from '@/lib/seo';
import { PUBLIC_LANGUAGE_AUTONYMS } from '@/lib/public-guidance';
import {
  CRIMINAL_BOARD_LOCALES, CRIMINAL_BOARD_PATH, criminalBoardCopy,
  isCriminalBoardLocale, selectCriminalColumns,
} from '@/lib/criminal-litigation-board';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isCriminalBoardLocale(locale)) notFound();
  const copy = criminalBoardCopy[locale];
  return buildSeoMetadata({ locale, title: copy.title, description: copy.description,
    path: CRIMINAL_BOARD_PATH, alternateLocales: CRIMINAL_BOARD_LOCALES });
}

export default async function CriminalLitigationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isCriminalBoardLocale(locale)) notFound();
  const copy = criminalBoardCopy[locale];
  const posts = selectCriminalColumns(getAllColumnPosts(locale));
  return (
    <div data-criminal-board={locale}>
      <JsonLd data={buildCollectionPageJsonLd({ locale, path: `/${locale}${CRIMINAL_BOARD_PATH}`,
        name: copy.title, description: copy.description,
        items: posts.map((post) => ({ name: post.title, path: `/${locale}/columns/${post.slug}`, description: post.summary })),
      })} />
      <section className="svc-hero" data-tone="dark">
        <div className="container svc-hero-inner">
          <Link className="svc-back-link" href={`/${locale}/columns`}>{copy.columns}</Link>
          <h1 className="svc-hero-title">{copy.title}</h1>
          <p className="svc-hero-subtitle">{copy.description}</p>
        </div>
      </section>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <nav aria-label={copy.language} className="columns-filters" style={{ marginBottom: '2rem' }}>
          {CRIMINAL_BOARD_LOCALES.map((language) => (
            <Link key={language} href={`/${language}${CRIMINAL_BOARD_PATH}`} hrefLang={language}
              className={`columns-filter-btn${locale === language ? ' active' : ''}`}
              aria-current={locale === language ? 'page' : undefined}>
              {PUBLIC_LANGUAGE_AUTONYMS[language]}
            </Link>
          ))}
        </nav>
        <div className="svc-columns-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/columns/${post.slug}`}
              className="svc-col-card" data-criminal-column={post.slug}>
              {post.featuredImage ? <div className="svc-col-card-media">
                <Image src={post.featuredImage} alt="" width={640} height={360} />
              </div> : null}
              <h2 className="svc-col-card-title">{post.title}</h2>
              <p className="svc-col-card-summary">{post.summary}</p>
              <span className="svc-col-card-meta"><time>{post.dateDisplay || post.date}</time></span>
              <span className="svc-col-card-link">{copy.read} →</span>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: '2rem' }}>
          <Link className="link-underline" href={`/${locale}/services${locale === 'vi' ? '' : '/criminal'}`}>
            {copy.service}
          </Link>
        </p>
      </div>
    </div>
  );
}

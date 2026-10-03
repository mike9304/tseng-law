import type { CSSProperties } from 'react';
import Link from 'next/link';
import { trafficHubCopy } from '@/data/traffic-hub';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';
import RightTurnObservation from '@/components/RightTurnObservation';
import { hasRightTurnObservation, RIGHT_TURN_OBSERVATION } from '@/data/right-turn-observation';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import AiAuthorBox from '@/components/AiAuthorBox';
import RecommendedForYou from '@/components/RecommendedForYou';
import ColumnContent from '@/components/ColumnContent';
import ColumnGeneratedVideo from '@/components/ColumnGeneratedVideo';
import ColumnToc from '@/components/ColumnToc';
import { extractColumnToc, type ColumnTocEntry } from '@/lib/column-toc';
import JsonLd from '@/components/JsonLd';
import { CONSULTATION_EMAIL, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';
import type { ColumnPost, ColumnFaqItem } from '@/lib/column-post';
import type { TrafficDiagramId, TrafficDiagramLocale } from '@/data/traffic-diagrams';
import type { ResolvedColumnTypography } from '@/lib/builder/columns/typography';
import { typesetTitle } from '@/lib/ko-middot';
import styles from './ColumnDetail.module.css';
import zhStyles from './ZhHantColumnDetail.module.css';
import jaStyles from './JaColumnDetail.module.css';
import JaPageShell from '@/components/ja-design/JaPageShell';
import enStyles from './EnColumnDetail.module.css';
import EnPageShell from '@/components/en-design/EnPageShell';

const MIN_TOC_SECTIONS = 3;
export type ColumnDetailViewProps = {
  locale: SiteLocale; urlLocale: string;
  post: Pick<ColumnPost, 'slug' | 'title' | 'categoryLabel' | 'featuredImage' | 'featuredImageAlt' | 'featuredImageCaption' | 'dateDisplay' | 'date' | 'readTime' | 'content' | 'topic'>;
  prevPost: Pick<ColumnPost, 'slug' | 'title'> | null;
  nextPost: Pick<ColumnPost, 'slug' | 'title'> | null;
  t: { backLabel: string; consultationTitle: string; consultationText: string; consultationButton: string; guideTitle: string; faqHeading: string; tocLabel: string };
  tocEntries: ColumnTocEntry[];
  diagramVideo: { id: TrafficDiagramId; locale: TrafficDiagramLocale } | null;
  diagramSplit: [string, string] | null;
  authorName: string; authorHref: string;
  aiAuthored: boolean;
  attorneyHeading: string;
  guideLinks: { href: string; label: string }[];
  recommendedItems: Pick<ColumnPost, 'slug' | 'title' | 'featuredImage' | 'topic' | 'dateDisplay' | 'readTime'>[];
  isTrafficColumn: boolean; showTrafficUpdate: boolean; modifiedDate: string;
  prevLabel: string; nextLabel: string;
  faqItems: ColumnFaqItem[]; showFaq: boolean;
  faqJsonLd: Record<string, unknown> | null;
  breadcrumbJsonLd: Record<string, unknown>;
  articleJsonLd: Record<string, unknown>;
  showHero: boolean; showBody: boolean; showSeo: boolean;
  typography: ResolvedColumnTypography;
};

/** Shared SSR view. Data loading and publication decisions stay in the server route. */
export default function ColumnDetailView({ locale, urlLocale, post, prevPost, nextPost, t, tocEntries, diagramVideo, diagramSplit, authorName, authorHref, aiAuthored, attorneyHeading, guideLinks, recommendedItems, isTrafficColumn, showTrafficUpdate, modifiedDate, prevLabel, nextLabel, faqItems, showFaq, faqJsonLd, breadcrumbJsonLd, articleJsonLd, showHero, showBody, showSeo, typography }: ColumnDetailViewProps) {
  const showObservation = showBody && hasRightTurnObservation(urlLocale, post.slug);
  const visibleToc = showObservation
    ? [...tocEntries, { id: RIGHT_TURN_OBSERVATION.id, text: RIGHT_TURN_OBSERVATION.title }]
    : tocEntries;
  const content = (
    <>
      {showSeo ? (
        <>
          <JsonLd
            data={breadcrumbJsonLd}
          />
          <JsonLd
            data={articleJsonLd}
          />
        </>
      ) : null}
      {showSeo && faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      {showHero ? (
        <section className={`blog-hero ${styles.hero}${urlLocale === 'vi' && post.featuredImageCaption ? ` ${styles.imageFocusedHero}` : ''}`} data-tone="dark">
          <div className="blog-hero-bg">
            {/* Blurred copy fills the frame so the contained photo never sits in flat letterbox bars
                (contain keeps text-bearing thumbnails uncropped). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featuredImage} alt="" aria-hidden="true" className={styles.heroBackdrop} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} aria-describedby={post.featuredImageCaption ? 'column-image-caption' : undefined} className="blog-hero-img" />
            <div className="blog-hero-overlay" />
          </div>
          <div className="container blog-hero-inner">
            <Link href={`/${urlLocale}/columns`} className="blog-back-link">{t.backLabel}</Link>
            {urlLocale in trafficHubCopy && isTrafficColumn ? (
              <Link href={`/${urlLocale}/traffic-accidents#articles`} className="blog-back-link" style={{ marginInlineStart: '1.5rem' }}>
                {trafficHubCopy[urlLocale as keyof typeof trafficHubCopy].nav} →
              </Link>
            ) : null}
            <span className="blog-category-badge">{post.categoryLabel}</span>
            <h1 className="blog-hero-title">{typesetTitle(locale, post.title)}</h1>
            <div className="blog-meta">
              {!aiAuthored ? (
                <Link href={authorHref} className="link-underline">
                  {authorName}
                </Link>
              ) : null}
              <time>{post.dateDisplay || post.date}</time>
              {showTrafficUpdate ? (
                <time dateTime={modifiedDate} data-column-updated>
                  {{ ko: '수정', 'zh-hant': '更新', en: 'Updated', ja: '更新' }[urlLocale as keyof typeof trafficHubCopy]} {modifiedDate}
                </time>
              ) : null}
              {post.readTime ? <span>{post.readTime}</span> : null}
            </div>
          </div>
        </section>
      ) : null}

      {showHero && post.featuredImageCaption ? (
        <div className="container">
          <p id="column-image-caption" className={styles.imageCaption} data-column-image-caption>{post.featuredImageCaption}</p>
        </div>
      ) : null}

      {showBody ? (
        <article className={`blog-article ${styles.article}`}>
          <div className="container blog-container">
            <div
              className={`blog-body ${typography.className}`}
              data-column-typography={typography.presetId}
              style={typography.cssVars as CSSProperties}
            >
              {visibleToc.length >= MIN_TOC_SECTIONS ? (
                <ColumnToc entries={visibleToc} label={t.tocLabel} />
              ) : null}
              <ColumnGeneratedVideo locale={urlLocale} slug={post.slug} autoPlay={isTrafficColumn} />
              {diagramVideo && diagramSplit ? (
                <>
                  <ColumnContent content={diagramSplit[0]} locale={locale} />
                  <TrafficDiagramFigure diagramId={diagramVideo.id} locale={diagramVideo.locale} sizes="(max-width: 640px) calc(100vw - 40px), 760px" />
                  <ColumnContent
                    content={diagramSplit[1]}
                    locale={locale}
                    sectionIdOffset={extractColumnToc(diagramSplit[0]).length}
                  />
                </>
              ) : (
                <>
                  {diagramVideo ? (
                    <TrafficDiagramFigure diagramId={diagramVideo.id} locale={diagramVideo.locale} sizes="(max-width: 640px) calc(100vw - 40px), 760px" />
                  ) : null}
                  <ColumnContent content={post.content} locale={locale} />
                </>
              )}
              {showObservation ? <RightTurnObservation /> : null}
              {showBody && showFaq ? (
                <section className="column-faq" aria-label={t.faqHeading}>
                  <h2 className="blog-heading column-faq-heading">{t.faqHeading}</h2>
                  <dl className="column-faq-list">
                    {faqItems.map((item, index) => (
                      <div className="column-faq-item" key={`${index}-${item.q}`}>
                        <dt className="column-faq-question">{item.q}</dt>
                        <dd className="column-faq-answer">{item.a}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}
              {aiAuthored ? <AiAuthorBox locale={urlLocale} /> : null}
              <RecommendedForYou
                locale={urlLocale}
                hrefBase={`/${urlLocale}/columns`}
                items={recommendedItems}
                currentSlug={post.slug}
                currentTopic={post.topic}
                preserveOrder={isTrafficColumn}
              />
            </div>
            <aside className="blog-sidebar">
              <div className="blog-sidebar-card">
                <h3 className="blog-sidebar-title">{t.consultationTitle}</h3>
                <p className="blog-sidebar-text">{t.consultationText}</p>
                <a
                  href={getConsultationPublicMailto(locale)}
                  className="button blog-sidebar-btn"
                  aria-label={`${t.consultationTitle}: ${CONSULTATION_EMAIL}`}
                >
                  {t.consultationButton}
                </a>
              </div>
              <div className="blog-sidebar-card blog-sidebar-card--attorney">
                <AttorneyAuthorityCard locale={locale} heading={attorneyHeading} />
              </div>
              <div className="blog-sidebar-card">
                <h3 className="blog-sidebar-title">{t.guideTitle}</h3>
                <ul className="blog-related-list">
                  {guideLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="blog-related-link">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </article>
      ) : null}

      {/* Prev / Next Navigation */}
      {showBody && (prevPost || nextPost) && (
        <nav className={`container column-post-nav ${styles.postNav}`} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '1rem',
          padding: '2rem 1rem',
          maxWidth: 900,
          margin: '0 auto 2rem',
        }}>
          {prevPost ? (
            <Link
              href={`/${urlLocale}/columns/${prevPost.slug}`}
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                textDecoration: 'none',
                color: '#1f2937',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{prevLabel}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>{prevPost.title}</span>
            </Link>
          ) : <span style={{ flex: 1 }} />}
          {nextPost ? (
            <Link
              href={`/${urlLocale}/columns/${nextPost.slug}`}
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                textDecoration: 'none',
                color: '#1f2937',
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.25rem',
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{nextLabel}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>{nextPost.title}</span>
            </Link>
          ) : <span style={{ flex: 1 }} />}
        </nav>
      )}
    </>
  );
  // ja design (Opus 5.5 ja lane): same article inside the ja wrapper (paper header, framed photo plate).
  if (locale === 'ja') return <JaPageShell page="column" className={jaStyles.root}>{content}</JaPageShell>;
  // zh-hant second pass (son7-87 / Opus 5.5): same article inside a scoped wrapper for the split hero and sidebar styling.
  if (locale === 'zh-hant') {
    return <div className={zhStyles.root} id="zh-hant-column" data-zh-hant-design="column">{content}</div>;
  }
  // en redesign (Opus 5.5 en lane): same article inside the scoped en wrapper (only the /en/ route, not guidance locales).
  return urlLocale === 'en'
    ? <EnPageShell page="column"><div className={`${enStyles.detail} en-column`}>{content}</div></EnPageShell>
    : content;
}

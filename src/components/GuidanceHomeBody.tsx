import Image from 'next/image';
import Link from 'next/link';

import HeroMediaBackground from '@/components/HeroMediaBackground';
import JsonLd from '@/components/JsonLd';
import OrnamentDivider from '@/components/OrnamentDivider';
import Reveal from '@/components/Reveal';
import SectionLabel from '@/components/SectionLabel';
import ServicePracticeIcon from '@/components/ServicePracticeIcon';
import SmartLink from '@/components/SmartLink';
import TaiwanHeritageInterlude from '@/components/TaiwanHeritageInterlude';
import GuidanceOfficeBand from '@/components/GuidanceOfficeBand';
import { GuidanceContactBand } from '@/components/GuidancePageBody';
import { resolveInsightsImageSrc } from '@/components/insights-image';
import {
  guidanceContent,
  type GuidanceLocale,
} from '@/data/international-guidance-content';
import type { ColumnPost } from '@/lib/column-post';
import {
  EXISTING_SITE_LOCALES_4,
  PUBLIC_LANGUAGE_AUTONYMS,
  guidanceCanonicalUrl,
  guidancePublicPath,
  publicDocumentLanguage,
  type ExistingSiteLocale4,
} from '@/lib/public-guidance';
import { buildGuidanceLegalServiceJsonLd, getSiteUrl } from '@/lib/seo';
import { buildGuidancePersonJsonLd } from '@/lib/guidance-structured-data';

/**
 * Home page for the four guidance locales (vi/id/th/fil).
 *
 * It renders the same section sequence as the English home — full-bleed hero,
 * column archive, six service cards, the editorial image band, then the closing
 * contact band the other guidance pages already use — with the same design
 * system class names, so the four new languages share the site's home design
 * instead of a page-header-plus-cards stack.
 *
 * Copy rules (LOCALIZATION-BRIEF): every sentence comes from
 * `international-guidance-content.ts`. The hero, services and archive headings
 * reuse the existing guidance page copy; only the labels the shared home layout
 * needs were added, in the page language. Nothing promises interpreting, a
 * reply time, an appointment or a case result, and the four consultation
 * languages notice stays on the closing band.
 *
 * Deliberate differences from the English home, both visible in the markup:
 *   - No hero search bar. The search index and `/{locale}/search` route exist
 *     for ko/zh-hant/en/ja only, so a search form here would post to a 404.
 *   - The column archive lists source-language columns behind an explicit
 *     "original language" badge and note whenever the locale has no translated
 *     column files yet, and links to the source locale's article. It never
 *     presents an untranslated article as if it were in the page language.
 */

export type GuidanceHomeColumnSource = {
  /** Locale whose column files are being listed. */
  sourceLocale: GuidanceLocale | ExistingSiteLocale4;
  /** True when `posts` are not in the page language. */
  isOriginalLanguage: boolean;
  posts: ColumnPost[];
};

/** en first, then ja / zh-hant / ko — the order the WO fixes for the fallback. */
export const GUIDANCE_COLUMN_FALLBACK_ORDER: readonly ExistingSiteLocale4[] = [
  'en',
  'ja',
  'zh-hant',
  'ko',
];

/**
 * Pick the columns a guidance home should list: the locale's own translations
 * when the pipeline has written any, otherwise the first source language that
 * actually has files. Existence is injected so this stays unit-testable.
 */
export function resolveGuidanceHomeColumns(
  locale: GuidanceLocale,
  loadPosts: (locale: GuidanceLocale | ExistingSiteLocale4) => ColumnPost[],
): GuidanceHomeColumnSource {
  const translated = loadPosts(locale);
  if (translated.length > 0) {
    return { sourceLocale: locale, isOriginalLanguage: false, posts: translated };
  }

  for (const candidate of GUIDANCE_COLUMN_FALLBACK_ORDER) {
    const posts = loadPosts(candidate);
    if (posts.length > 0) {
      return { sourceLocale: candidate, isOriginalLanguage: true, posts };
    }
  }

  return { sourceLocale: 'en', isOriginalLanguage: true, posts: [] };
}

function compactSummary(text: string, maxLength = 120): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const candidate = normalized.slice(0, maxLength + 1);
  const boundary = Math.max(
    candidate.lastIndexOf(' '),
    candidate.lastIndexOf(','),
    candidate.lastIndexOf('，'),
    candidate.lastIndexOf('、'),
  );
  const end = boundary >= Math.floor(maxLength * 0.7) ? boundary : maxLength;
  return `${normalized.slice(0, end).trimEnd()}…`;
}

function GuidanceHero({ locale }: { locale: GuidanceLocale }) {
  const pack = guidanceContent[locale];
  const page = pack.pages.home;
  const controlLabels = {
    pause: pack.home.videoPauseLabel,
    play: pack.home.videoPlayLabel,
    replay: pack.home.videoReplayLabel,
  };

  return (
    <section className="hero" id="hero" data-tone="dark">
      <HeroMediaBackground controlLabels={controlLabels} />
      <div className="container hero-inner">
        <div className="hero-copy">
          <SectionLabel>{page.eyebrow}</SectionLabel>
          <h1 className="hero-title">{page.title}</h1>
          <p className="hero-subtitle">{page.description}</p>
          <div className="hero-links-minimal hero-cta-actions">
            <Link
              href={guidancePublicPath(locale, 'contact')}
              className="button hero-cta-primary"
            >
              {pack.contactCta}
            </Link>
            <Link
              href={guidancePublicPath(locale, 'columns')}
              className="button hero-cta-secondary"
            >
              {pack.home.heroColumnsCtaLabel}
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-bottom-crop" />
      <a href="#insights" className="hero-scroll-arrow" aria-label={pack.home.heroScrollLabel}>
        <svg viewBox="0 0 28 28" aria-hidden>
          <polyline points="6,10 14,18 22,10" />
        </svg>
      </a>
    </section>
  );
}

/** "<original language> · <autonym>", e.g. "Ngôn ngữ gốc · English". */
function originalLanguageText(
  locale: GuidanceLocale,
  source: GuidanceHomeColumnSource,
): string {
  const pack = guidanceContent[locale];
  return `${pack.home.columnsOriginalLanguageBadge} · ${PUBLIC_LANGUAGE_AUTONYMS[source.sourceLocale]}`;
}

/**
 * Badges over a card image. The category badge keeps the English home's
 * top-left slot; the source-language badge takes the opposite corner so neither
 * covers the other. List thumbnails are far too small for a second overlay, so
 * they carry the marker inline in the meta row instead (see below).
 */
function GuidanceColumnCardBadges({
  locale,
  source,
  post,
  compact,
}: {
  locale: GuidanceLocale;
  source: GuidanceHomeColumnSource;
  post: ColumnPost;
  compact?: boolean;
}) {
  const compactClass = compact ? ' insights-category-badge--compact' : '';
  return (
    <>
      <span className={`insights-category-badge${compactClass}`}>{post.categoryLabel}</span>
      {source.isOriginalLanguage && !compact ? (
        <span
          className="insights-category-badge insights-category-badge--language"
          data-column-original-language={source.sourceLocale}
        >
          {originalLanguageText(locale, source)}
        </span>
      ) : null}
    </>
  );
}

/** Inline source-language marker for the compact list rows. */
function GuidanceColumnLanguageTag({
  locale,
  source,
}: {
  locale: GuidanceLocale;
  source: GuidanceHomeColumnSource;
}) {
  if (!source.isOriginalLanguage) return null;
  return (
    <span
      className="insights-language-tag"
      data-column-original-language={source.sourceLocale}
    >
      {originalLanguageText(locale, source)}
    </span>
  );
}

function GuidanceColumnArchive({
  locale,
  source,
}: {
  locale: GuidanceLocale;
  source: GuidanceHomeColumnSource;
}) {
  const pack = guidanceContent[locale];
  const archivePage = pack.pages.columns;
  const [featured, ...rest] = source.posts;
  if (!featured) return null;
  const listItems = rest.slice(0, 3);
  const columnHref = (slug: string) => `/${source.sourceLocale}/columns/${slug}`;

  return (
    <section
      className="section section--gray"
      id="insights"
      data-tone="light"
      data-guidance-column-source={source.sourceLocale}
    >
      <div className="container">
        <div>
          <SectionLabel>{archivePage.eyebrow}</SectionLabel>
          <h2 className="section-title">{archivePage.title}</h2>
          <p className="section-lede">
            {source.isOriginalLanguage
              ? pack.home.columnsOriginalLanguageNote
              : archivePage.description}
          </p>
        </div>
        <OrnamentDivider />
        <div className="insights-grid">
          <article className="insights-featured">
            <div className="insights-featured-media">
              <Image
                src={resolveInsightsImageSrc(featured.featuredImage)}
                alt={featured.title}
                width={920}
                height={540}
              />
              <GuidanceColumnCardBadges locale={locale} source={source} post={featured} />
            </div>
            <div className="insights-featured-body">
              <div className="insights-meta-row">
                <time className="insights-date">{featured.dateDisplay || featured.date}</time>
                {featured.readTime ? (
                  <span className="insights-readtime">{featured.readTime}</span>
                ) : null}
              </div>
              <span className="insights-byline">{pack.home.columnsReviewLabel}</span>
              <h3 className="insights-featured-title">{featured.title}</h3>
              <p className="insights-featured-summary">{featured.summary}</p>
              <SmartLink className="link-underline" href={columnHref(featured.slug)}>
                {pack.home.columnsReadMoreLabel} →
              </SmartLink>
            </div>
          </article>
          <div className="insights-list-wrap">
            <div className="insights-list">
              {listItems.map((post) => (
                <article key={post.slug} className="insights-list-item">
                  <div className="insights-list-thumb">
                    <Image
                      src={resolveInsightsImageSrc(post.featuredImage)}
                      alt={post.title}
                      width={240}
                      height={160}
                    />
                    <GuidanceColumnCardBadges
                      locale={locale}
                      source={source}
                      post={post}
                      compact
                    />
                  </div>
                  <div className="insights-list-copy">
                    <div className="insights-meta-row">
                      <time className="insights-date">{post.dateDisplay || post.date}</time>
                      {post.readTime ? (
                        <span className="insights-readtime">{post.readTime}</span>
                      ) : null}
                      <GuidanceColumnLanguageTag locale={locale} source={source} />
                    </div>
                    <span className="insights-byline">{pack.home.columnsReviewLabel}</span>
                    <h4 className="insights-list-title">
                      <SmartLink className="link-underline" href={columnHref(post.slug)}>
                        {post.title}
                      </SmartLink>
                    </h4>
                    <p className="insights-list-summary">{post.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <SmartLink
            className="button button--outline"
            href={guidancePublicPath(locale, 'columns')}
          >
            {pack.home.columnsViewAllLabel} →
          </SmartLink>
        </div>
      </div>
    </section>
  );
}

/** The six practice areas, taken from the guidance services page sections. */
export function guidanceHomeServiceCards(locale: GuidanceLocale) {
  return guidanceContent[locale].pages.services.sections.slice(0, 6).map((section) => ({
    title: section.heading,
    summary: compactSummary(section.paragraphs[0] ?? ''),
  }));
}

/**
 * The six practice-area cards with their icons. Exported so the guidance
 * `services` page renders the same six cards the English services page does —
 * before this it showed only the plain text card grid.
 */
export function GuidanceServices({
  locale,
  showHeader = true,
}: {
  locale: GuidanceLocale;
  showHeader?: boolean;
}) {
  const pack = guidanceContent[locale];
  const servicesPage = pack.pages.services;
  const cards = guidanceHomeServiceCards(locale);

  return (
    <section className="section section--light services-bento" id="practice" data-tone="light">
      <div className="container">
        {showHeader ? (
          <>
            <SectionLabel>{servicesPage.eyebrow}</SectionLabel>
            <h2 className="section-title">{servicesPage.title}</h2>
            <p className="section-lede">{servicesPage.description}</p>
          </>
        ) : null}
        <OrnamentDivider />
        <div className="services-detail-list services-card-grid">
          {cards.map((card, index) => (
            <div key={card.title} className="services-card-grid-item">
              <article className="services-detail-card services-card">
                <div className="services-detail-header services-card-header">
                  <span className="service-icon" aria-hidden>
                    <ServicePracticeIcon index={index} />
                  </span>
                  <h3 className="services-detail-title">{card.title}</h3>
                </div>
                <div className="services-detail-body services-card-body">
                  <p className="services-detail-desc services-card-summary">{card.summary}</p>
                  <Link
                    href={guidancePublicPath(locale, 'services')}
                    className="services-detail-more services-card-link"
                    aria-label={`${card.title}: ${pack.home.servicesDetailLabel}`}
                  >
                    {pack.home.servicesDetailLabel} →
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
        <p>
          {pack.home.servicesAssistanceBefore}
          <Link href={guidancePublicPath(locale, 'contact')}>
            {pack.home.servicesAssistanceLinkLabel}
          </Link>
          {pack.home.servicesAssistanceAfter}
        </p>
      </div>
    </section>
  );
}

/**
 * The home page's own guidance copy (intro + the four home sections), kept in
 * the same `.grid-bento` card grid the other guidance pages use. The English
 * home fills this slot with the attorney / results / stats blocks, which have
 * no guidance-language data; dropping the guidance copy instead would delete
 * the page-language explanation of what the firm does and of the difference
 * between the page language and the four consultation languages.
 */
function GuidanceHomeDetail({ locale }: { locale: GuidanceLocale }) {
  const page = guidanceContent[locale].pages.home;
  return (
    <Reveal>
      <section className="section section--light">
        <div className="container">
          <article data-guidance-article="true">
            <p className="section-lede">{page.description}</p>
            <p className="section-lede">{page.intro}</p>
            <div className="grid-bento contact-grid reveal-stagger">
              {page.sections.map((section) => (
                <div key={section.heading} className="card legal-card">
                  <h2 className="card-title">{section.heading}</h2>
                  <div className="legal-card-copy">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                  {section.items && section.items.length > 0 ? (
                    <ul className="contact-list legal-card-list">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </Reveal>
  );
}

export default function GuidanceHomeBody({
  locale,
  columns,
}: {
  locale: GuidanceLocale;
  columns: GuidanceHomeColumnSource;
}) {
  const pack = guidanceContent[locale];
  // Structured data, built the same way `GuidancePageBody` builds it for the
  // other guidance pages: `inLanguage` is the page language while the
  // consultation languages inside the node stay the fixed four
  // (GUIDANCE_CONSULTATION_LANGUAGES = en/zh-Hant/ja/ko).
  //
  // No FAQPage here: the home pack carries no `faqs`, and the visible FAQ lives
  // on `/{locale}/faq`, which already emits that node.
  const legalServiceJsonLd = buildGuidanceLegalServiceJsonLd({
    inLanguage: publicDocumentLanguage(locale),
    url: guidanceCanonicalUrl(locale, 'home', getSiteUrl()),
    description: pack.pages.home.description,
    contactUrl: guidanceCanonicalUrl(locale, 'contact', getSiteUrl()),
  });
  // WO-O28. The English home emits the attorney `Person` node (and with it the
  // `Organization` / `CollegeOrUniversity` nodes it nests); the guidance home
  // emitted none. No breadcrumb here — `/en` emits none on its home either.
  const personJsonLd = buildGuidancePersonJsonLd(locale);

  return (
    <div data-guidance-shell="true" data-locale={locale} data-guidance-page="home">
      {/* First child so the home design-parity landmark sequence is unchanged. */}
      <JsonLd data={legalServiceJsonLd} />
      {personJsonLd ? <JsonLd data={personJsonLd} /> : null}
      <GuidanceHero locale={locale} />
      <Reveal>
        <GuidanceColumnArchive locale={locale} source={columns} />
      </Reveal>
      <Reveal>
        <GuidanceServices locale={locale} />
      </Reveal>
      <TaiwanHeritageInterlude
        locale="en"
        mediaAlt={pack.home.imageBandAlt}
        controlLabels={{
          pause: pack.home.videoPauseLabel,
          play: pack.home.videoPlayLabel,
          replay: pack.home.videoReplayLabel,
        }}
      />
      <GuidanceHomeDetail locale={locale} />
      {/* The English home ends with `OfficeMapTabs`; the guidance home had no
          office photograph, address, phone number or map at all. */}
      <Reveal>
        <GuidanceOfficeBand locale={locale} />
      </Reveal>
      <GuidanceContactBand locale={locale} isContact={false} />
    </div>
  );
}

/** Exported for the parity test: the source locales a guidance home may list. */
export const GUIDANCE_HOME_COLUMN_SOURCE_LOCALES = EXISTING_SITE_LOCALES_4;

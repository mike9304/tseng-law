import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import { normalizeSiteLocale, type SiteLocale, toBuilderLocale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import ColumnContent from '@/components/ColumnContent';
import JsonLd from '@/components/JsonLd';
import {
  isBuilderDynamicTemplateBlockVisible,
  readBuilderDynamicTemplatePublishedBlockVisibility,
} from '@/lib/builder/dynamic-template-drafts';
import { resolveTypography } from '@/lib/builder/columns/typography';
import type { ColumnTypography } from '@/lib/builder/columns/types';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const copy: Record<SiteLocale, {
  backLabel: string;
  attorneyHeading: string;
  guideTitle: string;
  consultationTitle: string;
  consultationText: string;
  consultationButton: string;
  faqHeading: string;
}> = {
  ko: {
    backLabel: '← 칼럼 목록으로',
    attorneyHeading: '이 글 검토 변호사',
    guideTitle: '함께 보는 주제',
    consultationTitle: '상담 예약',
    consultationText: '대만 법률 관련 궁금한 점이 있으시면 언제든 문의해 주세요.',
    consultationButton: '문의하기',
    faqHeading: '자주 묻는 질문',
  },
  'zh-hant': {
    backLabel: '← 返回專欄列表',
    attorneyHeading: '審閱本文的律師',
    guideTitle: '延伸主題',
    consultationTitle: '預約諮詢',
    consultationText: '如有任何台灣法律相關問題，歡迎隨時聯繫我們。',
    consultationButton: '聯絡我們',
    faqHeading: '常見問題',
  },
  en: {
    backLabel: '← Back to columns',
    attorneyHeading: 'Reviewing Attorney',
    guideTitle: 'Related Topics',
    consultationTitle: 'Book Consultation',
    consultationText: 'If you have any questions about Taiwan law, feel free to contact us.',
    consultationButton: 'Contact Us',
    faqHeading: 'Frequently Asked Questions',
  },
  ja: {
    backLabel: '← コラム一覧へ',
    attorneyHeading: '本稿の監修弁護士',
    guideTitle: '関連トピック',
    consultationTitle: '相談予約',
    consultationText: '台湾法務についてご不明点があれば、お気軽にお問い合わせください。',
    consultationButton: 'お問い合わせ',
    faqHeading: 'よくある質問',
  },
};

export async function generateMetadata({ params }: { params: { locale: SiteLocale; slug: string } }): Promise<Metadata> {
  const locale = normalizeSiteLocale(params.locale);

  // Try file-based first (fast, sync), then fall back to blob-aware reader.
  // Japanese is file-backed only (no builder locale contract for ja).
  let post = getColumnPost(params.slug, locale);
  if (!post && locale !== 'ja') {
    const allPosts = await getAllColumnPostsIncludingBlob(toBuilderLocale(locale));
    post = allPosts.find((p) => p.slug === params.slug);
  }

  if (!post) {
    return {};
  }

  return buildSeoMetadata({
    locale,
    title: post.title,
    description: post.summary,
    path: `/columns/${post.slug}`,
    keywords: [
      post.title,
      post.categoryLabel,
      locale === 'ko'
        ? '대만 법률'
        : locale === 'zh-hant'
          ? '台灣法律'
          : locale === 'ja'
            ? '台湾法律'
            : 'Taiwan law',
    ],
    images: post.featuredImage,
    type: 'article',
    noindex: false,
    alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
  });
}

export default async function ColumnDetailPage({ params }: { params: { locale: SiteLocale; slug: string } }) {
  const locale = normalizeSiteLocale(params.locale);

  // Get all posts including Blob — single source of truth for content + prev/next
  // Japanese: file-backed columns-ja only (no builder/Blob ja locale).
  const allPosts =
    locale === 'ja'
      ? getAllColumnPosts('ja')
      : await getAllColumnPostsIncludingBlob(toBuilderLocale(locale));
  const post = allPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  const currentIndex = allPosts.indexOf(post);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const t = copy[locale];
  const authorName =
    locale === 'ko'
      ? '증준외 변호사'
      : locale === 'zh-hant'
        ? '曾俊瑋律師'
        : locale === 'ja'
          ? '曾俊瑋弁護士'
          : 'Attorney Wei Tseng';
  const authorProfilePath = getAttorneyProfilePath(toBuilderLocale(locale));
  // JA launch only guarantees /ja/columns*; cross-links use EN shells (not unsupported /ja/*).
  const linkLocale = locale === 'ja' ? 'en' : locale;
  const guideLinks =
    post.category === 'formation'
      ? [
          { href: `/${linkLocale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립' : locale === 'zh-hant' ? '台灣公司設立' : locale === 'ja' ? '台湾会社設立' : 'Taiwan Company Setup' },
          { href: `/${linkLocale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : locale === 'ja' ? '台湾弁護士' : 'Taiwan Lawyer' },
        ]
      : post.category === 'case'
        ? [
            { href: `/${linkLocale}/taiwan-litigation-lawyer`, label: locale === 'ko' ? '대만 소송' : locale === 'zh-hant' ? '台灣訴訟' : locale === 'ja' ? '台湾訴訟' : 'Taiwan Litigation' },
            { href: `/${linkLocale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : locale === 'ja' ? '台湾弁護士' : 'Taiwan Lawyer' },
          ]
        : [
            { href: `/${linkLocale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : locale === 'ja' ? '台湾弁護士' : 'Taiwan Lawyer' },
            { href: `/${linkLocale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립' : locale === 'zh-hant' ? '台灣公司設立' : locale === 'ja' ? '台湾会社設立' : 'Taiwan Company Setup' },
          ];

  const prevLabel = locale === 'ko' ? '← 이전 칼럼' : locale === 'zh-hant' ? '← 上一篇' : locale === 'ja' ? '← 前のコラム' : '← Previous';
  const nextLabel = locale === 'ko' ? '다음 칼럼 →' : locale === 'zh-hant' ? '下一篇 →' : locale === 'ja' ? '次のコラム →' : 'Next →';

  // FAQ (FAQPage schema + plain-text "자주 묻는 질문" section). Only the two
  // indexed, hand-authored locales (ko / zh-hant) carry an `faq` array; the
  // en route overlays ko frontmatter onto translated copy, so we skip it there
  // to avoid rendering Korean answers under an English heading.
  const faqItems = post.faq ?? [];
  // File-backed EN columns now carry translated FAQ; render for all locales with FAQ data.
  const showFaq = faqItems.length > 0;
  const faqJsonLd = showFaq ? buildFaqJsonLd(faqItems, toBuilderLocale(locale)) : null;

  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'columns.item-template',
    toBuilderLocale(locale)
  );
  const showHero = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.hero');
  const showBody = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.body');
  const showSeo = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.seo');

  const typography = resolveTypography(
    toBuilderLocale(locale),
    (post.typography as ColumnTypography | undefined)
      ?? (post.typographyPresetId
        ? { presetId: post.typographyPresetId } as ColumnTypography
        : undefined),
  );

  return (
    <>
      {showSeo ? (
        <>
          <JsonLd
            data={buildBreadcrumbJsonLd(toBuilderLocale(locale), [
              { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
              { name: locale === 'ko' ? '칼럼' : locale === 'zh-hant' ? '專欄' : 'Columns', path: `/${locale}/columns` },
              { name: post.title, path: `/${locale}/columns/${post.slug}` },
            ])}
          />
          <JsonLd
            data={buildArticleJsonLd({
              locale: toBuilderLocale(locale),
              title: post.title,
              description: post.summary,
              path: `/${locale}/columns/${post.slug}`,
              image: post.featuredImage,
              datePublished: post.date,
              dateModified: post.date,
              authorName,
              authorUrl: authorProfilePath,
              authorSameAs: [
                'https://www.hoveringlaw.com.tw/en/wei.html',
                'https://www.wei-wei-lawyer.com/about-8',
                'https://www.youtube.com/@weilawyer',
                'https://blog.naver.com/wei_lawyer/223461663913',
              ],
              authorAlternateNames: ['증준외', '曾俊瑋', 'Wei Tseng'],
              articleSection: post.categoryLabel,
            })}
          />
        </>
      ) : null}
      {showSeo && faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      {showHero ? (
        <section className="blog-hero" data-tone="dark">
          <div className="blog-hero-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featuredImage} alt={post.title} className="blog-hero-img" />
            <div className="blog-hero-overlay" />
          </div>
          <div className="container blog-hero-inner">
            <Link href={`/${locale}/columns`} className="blog-back-link">{t.backLabel}</Link>
            <span className="blog-category-badge">{post.categoryLabel}</span>
            <h1 className="blog-hero-title">{post.title}</h1>
            <div className="blog-meta">
              <Link href={authorProfilePath} className="link-underline">
                {authorName}
              </Link>
              <time>{post.dateDisplay || post.date}</time>
              {post.readTime ? <span>{post.readTime}</span> : null}
            </div>
          </div>
        </section>
      ) : null}

      {showBody ? (
        <article className="blog-article">
          <div className="container blog-container">
            <div
              className={`blog-body ${typography.className}`}
              data-column-typography={typography.presetId}
              style={typography.cssVars as CSSProperties}
            >
              <ColumnContent content={post.content} />
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
            </div>
            <aside className="blog-sidebar">
              <div className="blog-sidebar-card">
                <h3 className="blog-sidebar-title">{t.consultationTitle}</h3>
                <p className="blog-sidebar-text">{t.consultationText}</p>
                <Link href={`/${linkLocale}/contact`} className="button blog-sidebar-btn">
                  {t.consultationButton}
                </Link>
              </div>
              <div className="blog-sidebar-card blog-sidebar-card--attorney">
                <AttorneyAuthorityCard locale={locale} heading={t.attorneyHeading} />
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
        <nav className="container" style={{
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
              href={`/${locale}/columns/${prevPost.slug}`}
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
              href={`/${locale}/columns/${nextPost.slug}`}
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
}

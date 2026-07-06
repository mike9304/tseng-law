import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { getColumnPost } from '@/lib/columns';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import ColumnContent from '@/components/ColumnContent';
import JsonLd from '@/components/JsonLd';
import {
  isBuilderDynamicTemplateBlockVisible,
  readBuilderDynamicTemplatePublishedBlockVisibility,
} from '@/lib/builder/dynamic-template-drafts';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const copy: Record<Locale, {
  backLabel: string;
  attorneyHeading: string;
  guideTitle: string;
  consultationTitle: string;
  consultationText: string;
  consultationButton: string;
}> = {
  ko: {
    backLabel: '← 칼럼 목록으로',
    attorneyHeading: '이 글 검토 변호사',
    guideTitle: '함께 보는 주제',
    consultationTitle: '상담 예약',
    consultationText: '대만 법률 관련 궁금한 점이 있으시면 언제든 문의해 주세요.',
    consultationButton: '문의하기',
  },
  'zh-hant': {
    backLabel: '← 返回專欄列表',
    attorneyHeading: '審閱本文的律師',
    guideTitle: '延伸主題',
    consultationTitle: '預約諮詢',
    consultationText: '如有任何台灣法律相關問題，歡迎隨時聯繫我們。',
    consultationButton: '聯絡我們',
  },
  en: {
    backLabel: '← Back to columns',
    attorneyHeading: 'Reviewing Attorney',
    guideTitle: 'Related Topics',
    consultationTitle: 'Book Consultation',
    consultationText: 'If you have any questions about Taiwan law, feel free to contact us.',
    consultationButton: 'Contact Us',
  },
};

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);

  // Try file-based first (fast, sync), then fall back to blob-aware reader
  let post = getColumnPost(params.slug, locale);
  if (!post) {
    const allPosts = await getAllColumnPostsIncludingBlob(locale);
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
    keywords: [post.title, post.categoryLabel, locale === 'ko' ? '대만 법률' : locale === 'zh-hant' ? '台灣法律' : 'Taiwan law'],
    images: post.featuredImage,
    type: 'article',
    noindex: locale === 'en',
    alternateLocales: ['ko', 'zh-hant'],
  });
}

export default async function ColumnDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = normalizeLocale(params.locale);

  // Get all posts including Blob — single source of truth for content + prev/next
  const allPosts = await getAllColumnPostsIncludingBlob(locale);
  const post = allPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  const currentIndex = allPosts.indexOf(post);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const t = copy[locale];
  const authorName = locale === 'ko' ? '증준외 변호사' : locale === 'zh-hant' ? '曾俊瑋律師' : 'Attorney Wei Tseng';
  const authorProfilePath = getAttorneyProfilePath(locale);
  const guideLinks =
    post.category === 'formation'
      ? [
          { href: `/${locale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립' : locale === 'zh-hant' ? '台灣公司設立' : 'Taiwan Company Setup' },
          { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : 'Taiwan Lawyer' },
        ]
      : post.category === 'case'
        ? [
            { href: `/${locale}/taiwan-litigation-lawyer`, label: locale === 'ko' ? '대만 소송' : locale === 'zh-hant' ? '台灣訴訟' : 'Taiwan Litigation' },
            { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : 'Taiwan Lawyer' },
          ]
        : [
            { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : 'Taiwan Lawyer' },
            { href: `/${locale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립' : locale === 'zh-hant' ? '台灣公司設立' : 'Taiwan Company Setup' },
          ];

  const prevLabel = locale === 'ko' ? '← 이전 칼럼' : locale === 'zh-hant' ? '← 上一篇' : '← Previous';
  const nextLabel = locale === 'ko' ? '다음 칼럼 →' : locale === 'zh-hant' ? '下一篇 →' : 'Next →';
  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'columns.item-template',
    locale
  );
  const showHero = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.hero');
  const showBody = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.body');
  const showSeo = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.item.seo');

  return (
    <>
      {showSeo ? (
        <>
          <JsonLd
            data={buildBreadcrumbJsonLd(locale, [
              { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
              { name: locale === 'ko' ? '칼럼' : locale === 'zh-hant' ? '專欄' : 'Columns', path: `/${locale}/columns` },
              { name: post.title, path: `/${locale}/columns/${post.slug}` },
            ])}
          />
          <JsonLd
            data={buildArticleJsonLd({
              locale,
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
            <div className="blog-body">
              <ColumnContent content={post.content} />
            </div>
            <aside className="blog-sidebar">
              <div className="blog-sidebar-card">
                <h3 className="blog-sidebar-title">{t.consultationTitle}</h3>
                <p className="blog-sidebar-text">{t.consultationText}</p>
                <Link href={`/${locale}/contact`} className="button blog-sidebar-btn">
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

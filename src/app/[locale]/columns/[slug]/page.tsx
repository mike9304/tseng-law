import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { getColumnPost, getColumnSlugs } from '@/lib/columns';
import ColumnContent from '@/components/ColumnContent';
import JsonLd from '@/components/JsonLd';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';

export function generateStaticParams() {
  const slugs = getColumnSlugs();
  return ['ko', 'zh-hant', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const post = getColumnPost(params.slug, locale);

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

export default function ColumnDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = normalizeLocale(params.locale);
  const post = getColumnPost(params.slug, locale);
  if (!post) return notFound();
  if (post.slug !== params.slug) return notFound();

  const backLabel = locale === 'ko' ? '← 칼럼 목록으로' : locale === 'zh-hant' ? '← 返回專欄列表' : '← Back to columns';
  const authorName = locale === 'ko' ? '증준외 변호사' : locale === 'zh-hant' ? '曾俊瑋律師' : 'Attorney Wei Tseng';
  const authorProfilePath = getAttorneyProfilePath(locale);
  const attorneyHeading = locale === 'ko' ? '이 글 검토 변호사' : locale === 'zh-hant' ? '審閱本文的律師' : 'Reviewing Attorney';
  const guideTitle = locale === 'ko' ? '관련 검색 안내' : locale === 'zh-hant' ? '相關搜尋指南' : 'Related Search Guides';
  const guideLinks =
    post.category === 'formation'
      ? [
          { href: `/${locale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립 변호사 안내' : locale === 'zh-hant' ? '台灣公司設立律師指南' : 'Taiwan Company Setup Lawyer Guide' },
          { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만변호사 안내' : locale === 'zh-hant' ? '台灣律師指南' : 'Taiwan Lawyer Guide' },
        ]
      : post.category === 'case'
        ? [
            { href: `/${locale}/taiwan-litigation-lawyer`, label: locale === 'ko' ? '대만 소송 변호사 안내' : locale === 'zh-hant' ? '台灣訴訟律師指南' : 'Taiwan Litigation Lawyer Guide' },
            { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만변호사 안내' : locale === 'zh-hant' ? '台灣律師指南' : 'Taiwan Lawyer Guide' },
          ]
        : [
            { href: `/${locale}/taiwan-lawyer`, label: locale === 'ko' ? '대만변호사 안내' : locale === 'zh-hant' ? '台灣律師指南' : 'Taiwan Lawyer Guide' },
            { href: `/${locale}/taiwan-company-setup-lawyer`, label: locale === 'ko' ? '대만 회사설립 변호사 안내' : locale === 'zh-hant' ? '台灣公司設立律師指南' : 'Taiwan Company Setup Lawyer Guide' },
          ];

  return (
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
      <section className="blog-hero" data-tone="dark">
        <div className="blog-hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.featuredImage} alt={post.title} className="blog-hero-img" />
          <div className="blog-hero-overlay" />
        </div>
        <div className="container blog-hero-inner">
          <Link href={`/${locale}/columns`} className="blog-back-link">{backLabel}</Link>
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

      <article className="blog-article">
        <div className="container blog-container">
          <div className="blog-body">
            <ColumnContent content={post.content} />
          </div>
          <aside className="blog-sidebar">
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">{locale === 'ko' ? '상담 예약' : locale === 'zh-hant' ? '預約諮詢' : 'Book Consultation'}</h3>
              <p className="blog-sidebar-text">
                {locale === 'ko'
                  ? '대만 법률 관련 궁금한 점이 있으시면 언제든 문의해 주세요.'
                  : locale === 'zh-hant'
                    ? '如有任何台灣法律相關問題，歡迎隨時聯繫我們。'
                    : 'If you have any questions about Taiwan law, feel free to contact us.'}
              </p>
              <Link href={`/${locale}/contact`} className="button blog-sidebar-btn">
                {locale === 'ko' ? '문의하기' : locale === 'zh-hant' ? '聯絡我們' : 'Contact Us'}
              </Link>
            </div>
            <div className="blog-sidebar-card blog-sidebar-card--attorney">
              <AttorneyAuthorityCard locale={locale} heading={attorneyHeading} />
            </div>
            <div className="blog-sidebar-card">
              <h3 className="blog-sidebar-title">{guideTitle}</h3>
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
    </>
  );
}

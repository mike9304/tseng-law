import { notFound } from 'next/navigation';
import Link from 'next/link';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getColumnPost, getColumnSlugs } from '@/lib/columns';
import ColumnContent from '@/components/ColumnContent';

export function generateStaticParams() {
  const slugs = getColumnSlugs();
  return ['ko', 'zh-hant', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default function ColumnDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = normalizeLocale(params.locale);
  const post = getColumnPost(params.slug, locale);
  if (!post) return notFound();

  const backLabel = locale === 'ko' ? '← 칼럼 목록으로' : locale === 'zh-hant' ? '← 返回專欄列表' : '← Back to columns';
  const authorName = locale === 'ko' ? '증준외 변호사' : locale === 'zh-hant' ? '曾俊瑋 律師' : 'Attorney Wei Tseng';

  return (
    <>
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
            <span>{authorName}</span>
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
          </aside>
        </div>
      </article>
    </>
  );
}

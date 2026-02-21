import { notFound } from 'next/navigation';
import Link from 'next/link';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getServiceArea, getServiceSlugs } from '@/data/service-details';
import { getColumnPost } from '@/lib/columns';

export function generateStaticParams() {
  const slugs = getServiceSlugs();
  return ['ko', 'zh-hant', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default function ServiceDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = normalizeLocale(params.locale);
  const area = getServiceArea(params.slug);
  if (!area) return notFound();

  const backLabel = locale === 'ko' ? '← 업무분야 목록으로' : locale === 'zh-hant' ? '← 返回服務領域' : '← Back to services';
  const keyPointsLabel = locale === 'ko' ? '핵심 요약' : locale === 'zh-hant' ? '重點摘要' : 'Key Points';
  const columnsLabel = locale === 'ko' ? '관련 칼럼 — 자세히 알아보기' : locale === 'zh-hant' ? '相關專欄 — 深入了解' : 'Related Columns — Learn More';
  const readMore = locale === 'ko' ? '자세히 읽기 →' : locale === 'zh-hant' ? '閱讀全文 →' : 'Read full article →';
  const contactLabel = locale === 'ko' ? '상담 예약' : locale === 'zh-hant' ? '預約諮詢' : 'Book Consultation';
  const contactDesc = locale === 'ko'
    ? '이 분야에 대해 궁금한 점이 있으시면 언제든 문의해 주세요.'
    : locale === 'zh-hant'
      ? '如對此服務領域有任何疑問，歡迎隨時聯繫我們。'
      : 'If you have any questions about this practice area, please contact us anytime.';
  const contactBtn = locale === 'ko' ? '문의하기' : locale === 'zh-hant' ? '聯絡我們' : 'Contact Us';
  const emptyMsg = locale === 'ko'
    ? '이 분야의 전문 칼럼을 준비 중입니다.'
    : locale === 'zh-hant'
      ? '此領域的專欄正在準備中。'
      : 'Columns for this practice area are being prepared.';

  const columns = area.columnSlugs
    .map((slug) => getColumnPost(slug, locale))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const points = area.keyPoints[locale];

  return (
    <>
      <section className="svc-hero" data-tone="dark">
        <div className="container svc-hero-inner">
          <Link href={`/${locale}/services`} className="svc-back-link">{backLabel}</Link>
          <h1 className="svc-hero-title">{area.title[locale]}</h1>
          <p className="svc-hero-subtitle">{area.subtitle[locale]}</p>
        </div>
      </section>

      <article className="svc-article">
        <div className="container svc-container">
          <div className="svc-body">
            <p className="svc-intro">{area.intro[locale]}</p>

            {points.length > 0 && (
              <div className="svc-keypoints">
                <h2 className="svc-keypoints-title">{keyPointsLabel}</h2>
                <ul className="svc-keypoints-list">
                  {points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {columns.length > 0 && (
              <div className="svc-columns-section">
                <h2 className="svc-columns-heading">{columnsLabel}</h2>
                <div className="svc-columns-grid">
                  {columns.map((col) => (
                    <Link
                      key={col.slug}
                      href={`/${locale}/columns/${col.slug}`}
                      className="svc-col-card"
                    >
                      <span className="svc-col-badge">{col.categoryLabel}</span>
                      <h3 className="svc-col-card-title">{col.title}</h3>
                      <p className="svc-col-card-summary">{col.summary}</p>
                      <span className="svc-col-card-meta">
                        <time>{col.dateDisplay || col.date}</time>
                        {col.readTime && <span>{col.readTime}</span>}
                      </span>
                      <span className="svc-col-card-link">{readMore}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {columns.length === 0 && (
              <div className="svc-empty"><p>{emptyMsg}</p></div>
            )}
          </div>

          <aside className="svc-sidebar">
            {columns.length > 0 && (
              <div className="svc-sidebar-card">
                <h3 className="svc-sidebar-title">{columnsLabel.split(' —')[0]}</h3>
                <ul className="svc-related-list">
                  {columns.map((col) => (
                    <li key={col.slug}>
                      <Link href={`/${locale}/columns/${col.slug}`} className="svc-related-link">
                        {col.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">{contactLabel}</h3>
              <p className="svc-sidebar-text">{contactDesc}</p>
              <Link href={`/${locale}/contact`} className="button svc-sidebar-btn">
                {contactBtn}
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

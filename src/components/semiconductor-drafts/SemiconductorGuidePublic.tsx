import Link from 'next/link';
import {
  listPublicSemiconductorColumns,
  semiconductorGuideCopy,
} from '@/lib/semiconductor-public';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';

export default function SemiconductorGuidePublic({ locale }: { locale: SiteLocale }) {
  const copy = semiconductorGuideCopy[locale];
  const columns = listPublicSemiconductorColumns(locale);
  const mailto = getConsultationPublicMailto(locale);

  return (
    <main className="semi-draft-page">
      <section className="svc-hero" data-tone="dark">
        <div className="container svc-hero-inner">
          <p className="svc-back-link" style={{ opacity: 0.8 }}>
            {copy.kicker}
          </p>
          <h1 className="svc-hero-title">{copy.title}</h1>
          <p className="svc-hero-subtitle">{copy.description}</p>
        </div>
      </section>

      <article className="svc-article">
        <div className="container svc-container">
          <div className="svc-body semi-draft-reading">
            <h2 className="svc-keypoints-title">{copy.columnsHeading}</h2>
            <div className="svc-columns-grid">
              {columns.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${locale}/columns/${post.slug}`}
                  className="svc-col-card"
                  data-semiconductor-public-column={post.slug}
                >
                  <span className="svc-col-badge">{copy.topicLabel}</span>
                  <h3 className="svc-col-card-title">{post.title}</h3>
                  <p className="svc-col-card-summary">{post.summary}</p>
                  <span className="svc-col-card-link">{copy.readMore}</span>
                </Link>
              ))}
            </div>

            <p style={{ marginTop: '2rem' }}>
              <Link href={`/${locale}${copy.landingHref}`} className="link-underline">
                {copy.landingLabel} →
              </Link>
            </p>
          </div>

          <aside className="svc-sidebar">
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">{copy.contactTitle}</h3>
              <p className="svc-sidebar-text">{copy.contactText}</p>
              <Link href={`/${locale}/contact`} className="button svc-sidebar-btn">
                {copy.contactBtn}
              </Link>
              <a
                href={mailto}
                className="button--outline svc-sidebar-btn"
                aria-label={`${copy.emailBtn}: ${CONSULTATION_EMAIL}`}
              >
                {copy.emailBtn}
              </a>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

import Link from 'next/link';
import type { ColumnPost } from '@/lib/column-post';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';
import {
  taxAccountingBoardCopy,
  taxAccountingColumnBadge,
  type TaxAccountingBoardLists,
} from '@/lib/tax-accounting-board';

function ColumnCards({
  posts,
  locale,
  readMore,
  kind,
}: {
  posts: ColumnPost[];
  locale: SiteLocale;
  readMore: string;
  kind: 'board' | 'related';
}) {
  return (
    <div className="svc-columns-grid">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/${locale}/columns/${post.slug}`}
          className="svc-col-card"
          data-tax-accounting-column={post.slug}
          data-tax-accounting-kind={kind}
        >
          <span className="svc-col-badge">{taxAccountingColumnBadge(post, locale)}</span>
          <h3 className="svc-col-card-title">{post.title}</h3>
          <p className="svc-col-card-summary">{post.summary}</p>
          {post.dateDisplay ? <span className="svc-col-card-meta">{post.dateDisplay}</span> : null}
          <span className="svc-col-card-link">{readMore}</span>
        </Link>
      ))}
    </div>
  );
}

export default function TaxAccountingBoard({
  locale,
  lists,
}: {
  locale: SiteLocale;
  lists: TaxAccountingBoardLists;
}) {
  const copy = taxAccountingBoardCopy[locale];
  const mailto = getConsultationPublicMailto(locale);

  return (
    <main className="tax-accounting-board" data-tax-accounting-board={locale}>
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
          <div className="svc-body">
            {lists.board.length > 0 ? (
              <section className="svc-columns-section" aria-labelledby="tax-accounting-board-heading">
                <h2 id="tax-accounting-board-heading" className="svc-keypoints-title">
                  {copy.boardHeading}
                </h2>
                <ColumnCards posts={lists.board} locale={locale} readMore={copy.readMore} kind="board" />
              </section>
            ) : null}
            {lists.related.length > 0 ? (
              <section
                className="svc-columns-section"
                aria-labelledby="tax-accounting-related-heading"
                style={{ marginTop: '2.5rem' }}
              >
                <h2 id="tax-accounting-related-heading" className="svc-keypoints-title">
                  {copy.relatedHeading}
                </h2>
                <ColumnCards posts={lists.related} locale={locale} readMore={copy.readMore} kind="related" />
              </section>
            ) : null}
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

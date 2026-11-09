import Link from 'next/link';
import {
  SEMICONDUCTOR_BOARD_SUBTOPICS,
  SEMICONDUCTOR_SUBTOPIC_LABELS,
  type SemiconductorBoardSubtopic,
} from '@/data/semiconductor-board-subtopics';
import {
  buildSemiconductorBoardHref,
  countSemiconductorSubtopics,
  filterSemiconductorBoardPosts,
} from '@/lib/semiconductor-board';
import {
  listPublicSemiconductorColumns,
  semiconductorColumnBadge,
  semiconductorGuideCopy,
} from '@/lib/semiconductor-public';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';
import filterStyles from './SemiconductorBoard.module.css';

const FILTER_COPY: Record<
  SiteLocale,
  { legend: string; all: string; consult: string }
> = {
  ko: { legend: '주제별 보기', all: '전체', consult: '반도체 상담' },
  'zh-hant': { legend: '依主題瀏覽', all: '全部', consult: '半導體諮詢' },
  en: { legend: 'Browse by topic', all: 'All', consult: 'Semiconductor consultation' },
  ja: { legend: 'テーマで絞り込む', all: 'すべて', consult: '半導体の相談' },
};

export default function SemiconductorGuidePublic({
  locale,
  subtopic = null,
}: {
  locale: SiteLocale;
  subtopic?: SemiconductorBoardSubtopic | null;
}) {
  const copy = semiconductorGuideCopy[locale];
  const filterCopy = FILTER_COPY[locale];
  const allColumns = listPublicSemiconductorColumns(locale);
  const columns = filterSemiconductorBoardPosts(allColumns, subtopic);
  const counts = countSemiconductorSubtopics(allColumns);
  const mailto = getConsultationPublicMailto(locale);
  const consultHref = `/${locale}/contact?topic=semiconductor`;
  const subtopicLabels = SEMICONDUCTOR_SUBTOPIC_LABELS[locale];

  return (
    <main className="semi-draft-page">
      <section className="svc-hero" data-tone="dark">
        <div className="container svc-hero-inner">
          <p className="svc-back-link" style={{ opacity: 0.8 }}>
            {copy.kicker}
          </p>
          <h1 className="svc-hero-title">{copy.title}</h1>
          <p className="svc-hero-subtitle">{copy.description}</p>
          <div className={`${filterStyles.consultCta} container`} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Link href={consultHref} className="button">
              {filterCopy.consult}
            </Link>
          </div>
        </div>
      </section>

      <article className="svc-article">
        <div className="container svc-container">
          <div className="svc-body semi-draft-reading">
            <nav className={filterStyles.filters} aria-label={filterCopy.legend}>
              <p className={filterStyles.legend} id="semiconductor-subtopics">
                {filterCopy.legend}
              </p>
              <ul className={filterStyles.chips} aria-labelledby="semiconductor-subtopics">
                <li>
                  <a
                    className={filterStyles.chip}
                    href={buildSemiconductorBoardHref(locale, null)}
                    aria-current={subtopic ? undefined : 'true'}
                  >
                    {filterCopy.all}{' '}
                    <span className={filterStyles.chipCount}>{allColumns.length}</span>
                  </a>
                </li>
                {SEMICONDUCTOR_BOARD_SUBTOPICS.map((id) => {
                  const count = counts.get(id) ?? 0;
                  if (count === 0) return null;
                  return (
                    <li key={id}>
                      <a
                        className={filterStyles.chip}
                        href={buildSemiconductorBoardHref(locale, id)}
                        aria-current={subtopic === id ? 'true' : undefined}
                      >
                        {subtopicLabels[id]}{' '}
                        <span className={filterStyles.chipCount}>{count}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <h2 className="svc-keypoints-title">{copy.columnsHeading}</h2>
            <div className="svc-columns-grid" data-semiconductor-subtopic={subtopic ?? 'all'}>
              {columns.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${locale}/columns/${post.slug}`}
                  className="svc-col-card"
                  data-semiconductor-public-column={post.slug}
                >
                  <span className="svc-col-badge">{semiconductorColumnBadge(post, locale)}</span>
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
              <Link href={consultHref} className="button svc-sidebar-btn">
                {filterCopy.consult}
              </Link>
              <Link href={`/${locale}/contact`} className="button--outline svc-sidebar-btn">
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

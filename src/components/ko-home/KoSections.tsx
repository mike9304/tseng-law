import Link from 'next/link';
import type InsightsArchiveSection from '@/components/InsightsArchiveSection';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { prioritizeRecommendedColumns } from '@/lib/column-audience';
import { typesetTitle } from '@/lib/ko-middot';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { KO_SERVICE_SCENARIOS } from './ko-service-scenarios';
import { KO_LEDGER, KO_PROCESS, KO_SITUATIONS } from './ko-home-content';
import styles from './KoHome.module.css';

type ColumnPost = Parameters<typeof InsightsArchiveSection>[0]['posts'][number];

const searchHref = (q: string) => `/ko/search?q=${encodeURIComponent(q)}`;

/**
 * A register's head: the title on the left, 「전체 보기」 (the header menu's own label) on the right after a short rule.
 * The link's accessible name carries the title too (「호정칼럼 전체 보기」), so a links list does not show two bare
 * 「전체 보기」.
 */
function SectionHead({ id, title, more }: { id: string; title: string; more?: { href: string; label: string } }) {
  return (
    <div className={styles.sectionHead}>
      <h2 id={id} className={styles.sectionTitle}>{title}</h2>
      {more ? (
        <Link href={more.href} className={styles.more}>
          <span className={styles.visuallyHidden}>{title} </span>
          {more.label}
        </Link>
      ) : null}
    </div>
  );
}

/** Publication date first (the frontmatter `published`); `date` is the last-modified date and only a fallback. */
const publishedOn = (post: ColumnPost) => post.publicationDate || post.date || '';

/**
 * The Taiwan legal terms the firm's ko columns print as 「한국어(漢字)」, as six tiles under the first screen; each runs
 * the site search for the Korean term. The one motion on the page: the Korean term settles in beside the 漢字.
 */
export function KoGlossary() {
  return (
    <section className={styles.glossary} aria-labelledby="ko-glossary-title">
      <div className={styles.wrap}>
        <SectionHead id="ko-glossary-title" title="대만 법률 용어, 한국어로" />
        <ul className={styles.glossaryGrid}>
          {KO_LEDGER.map((row, index) => (
            <li key={row.han} style={{ ['--i' as string]: index }}>
              <Link href={searchHref(row.ko)} className={styles.glossaryTile}>
                <span className={styles.han} lang="zh-Hant">{row.han}</span>
                <span className={styles.koTerm}>{row.ko}</span>
                <span className={styles.area}>{row.area}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Six columns as a news grid: category, title and date on cream tiles, the third and fifth filled plum so the grid
 * reads as a pattern rather than a list. The same order the home archive used: columns recommended to Korean readers
 * first (column-audience), then newest by publication date. The columns page keeps the full archive and its filters.
 */
export function KoColumns({ posts }: { posts: readonly ColumnPost[] }) {
  // ISO dates sort as strings; equal dates keep the order the archive gave them.
  const newest = posts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => publishedOn(b.post).localeCompare(publishedOn(a.post)) || a.index - b.index)
    .map(({ post }) => post);
  const latest = prioritizeRecommendedColumns('ko', newest).slice(0, 6);
  if (latest.length === 0) return null;
  return (
    <section className={styles.columns} id="insights" aria-labelledby="ko-columns-title">
      <div className={styles.wrap}>
        <SectionHead
          id="ko-columns-title"
          title="호정칼럼"
          more={{ href: '/ko/columns', label: siteContent.ko.nav.mega.insights.viewAllLabel }}
        />
        <ul className={styles.columnGrid}>
          {latest.map((post, index) => (
            <li key={post.slug} className={index === 2 || index === 4 ? styles.columnCardAccent : styles.columnCard}>
              <Link href={`/ko/columns/${post.slug}`} className={styles.columnLink}>
                <span className={styles.columnCategory}>{post.categoryLabel}</span>
                <span className={styles.columnTitle}>{typesetTitle('ko', post.title)}</span>
                <time className={styles.columnDate} dateTime={publishedOn(post) || undefined}>{post.dateDisplay || publishedOn(post)}</time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The six practice areas as tiles on the greige band: name, what the area covers, and its scenarios. The whole tile
 * opens the practice page (the title link stretches over it; 「자세히 보기」 is the visible key, as on /ko/services).
 */
export function KoPractice() {
  const { services } = siteContent.ko;
  const slugs = getServiceSlugs();
  return (
    <section className={styles.practice} id="practice" aria-labelledby="ko-practice-title">
      <div className={styles.wrap}>
        <SectionHead
          id="ko-practice-title"
          title={services.title}
          more={{ href: '/ko/services', label: siteContent.ko.nav.mega.services.viewAllLabel }}
        />
        <ul className={styles.practiceGrid}>
          {services.items.map((item, index) => {
            const slug = slugs[index] ?? '';
            return (
              <li key={item.href} className={styles.practiceTile}>
                <h3 className={styles.practiceName}>
                  <Link href={`/ko/services/${slug}`}>{item.title}</Link>
                </h3>
                <p className={styles.practiceText}>{item.description}</p>
                <ul className={styles.practiceTags} aria-label={`${item.title}: 주요 업무`}>
                  {(KO_SERVICE_SCENARIOS[slug] ?? []).map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <span className={styles.practiceMore} aria-hidden>자세히 보기</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Entry points by reader situation: three columns, each a short index of links. */
export function KoSituations() {
  return (
    <nav className={styles.situations} aria-labelledby="ko-situations-title">
      <div className={styles.wrap}>
        <SectionHead id="ko-situations-title" title="상황별로 찾기" />
        <ul className={styles.situationGrid}>
          {KO_SITUATIONS.map((situation) => (
            <li key={situation.title} className={styles.situation}>
              <h3 className={styles.situationTitle}>{situation.title}</h3>
              <p className={styles.situationText}>{situation.text}</p>
              <ul className={styles.situationLinks}>
                {situation.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** From the first email to a retained matter: a real sequence, so the steps carry numbers. */
export function KoProcess() {
  return (
    <section className={styles.process} id="process" aria-labelledby="ko-process-title">
      <div className={styles.wrap}>
        <SectionHead id="ko-process-title" title="상담 진행 흐름" more={{ href: '/ko/pricing', label: '비용안내' }} />
        <ol className={styles.processList}>
          {KO_PROCESS.map((step, index) => (
            <li key={step.title}>
              <span className={styles.processNo} aria-hidden>{String(index + 1).padStart(2, '0')}</span>
              <h3 className={styles.processTitle}>{step.title}</h3>
              <p className={styles.processText}>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.processActions}>
          <a href={getConsultationPublicMailto('ko')} className={styles.primary} aria-label={`이메일 상담 신청 — ${getConsultationCtaLabel('ko')}`}>
            이메일 상담 신청
          </a>
        </div>
      </div>
    </section>
  );
}

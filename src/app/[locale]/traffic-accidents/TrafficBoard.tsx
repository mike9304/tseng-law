import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import { TRAFFIC_PATH } from '@/data/traffic-hub';
import {
  TRAFFIC_BOARD_COPY,
  TRAFFIC_QUERY_MAX_LENGTH,
  TRAFFIC_SUBJECT_LABELS,
  buildTrafficBoardHref,
  countTrafficSubjects,
  filterTrafficBoardItems,
  populatedTrafficSubjects,
  type TrafficBoardItem,
  type TrafficBoardQuery,
} from '@/lib/traffic-collection';
import styles from './TrafficBoard.module.css';

/**
 * Server-rendered traffic article board. Search is a GET form and every filter
 * is a plain link, so it works without JavaScript and the state survives
 * refresh, sharing and back navigation. Only list fields reach the markup.
 */
export default function TrafficBoard({ locale, items, query }: {
  locale: SiteLocale;
  items: readonly TrafficBoardItem[];
  query: TrafficBoardQuery;
}) {
  const copy = TRAFFIC_BOARD_COPY[locale];
  const subjectLabels = TRAFFIC_SUBJECT_LABELS[locale];
  const results = filterTrafficBoardItems(items, query);
  const counts = countTrafficSubjects(items, query);
  const allCount = filterTrafficBoardItems(items, { ...query, subject: null }).length;
  const subjects = populatedTrafficSubjects(items);
  // A valid but empty subject from a shared URL stays visible as the active filter.
  if (query.subject && !subjects.includes(query.subject)) subjects.push(query.subject);
  const filtered = Boolean(query.q || query.subject || query.video);
  const showVideoFilter = query.video || items.some((item) => item.hasVideo);
  const clearHref = buildTrafficBoardHref(locale, {});

  return (
    <div className={styles.board} data-traffic-board>
      <form className={styles.search} role="search" method="get" action={`/${locale}${TRAFFIC_PATH}#articles`}>
        <label htmlFor="traffic-board-q">{copy.searchLabel}</label>
        <div className={styles.searchRow}>
          <input
            id="traffic-board-q"
            type="search"
            name="q"
            defaultValue={query.q}
            maxLength={TRAFFIC_QUERY_MAX_LENGTH}
            placeholder={copy.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
          />
          {query.subject ? <input type="hidden" name="subject" value={query.subject} /> : null}
          {query.video ? <input type="hidden" name="video" value="1" /> : null}
          <button type="submit">{copy.submit}</button>
        </div>
      </form>

      <nav className={styles.filters} aria-label={copy.filtersLabel}>
        <p className={styles.legend} id="traffic-board-subjects">{copy.subjectLegend}</p>
        <ul className={styles.chips} aria-labelledby="traffic-board-subjects">
          <li>
            <a className={styles.chip} href={buildTrafficBoardHref(locale, { ...query, subject: null })} aria-current={query.subject ? undefined : 'true'}>
              {copy.all} <span className={styles.chipCount}>{allCount}</span>
            </a>
          </li>
          {subjects.map((subject) => (
            <li key={subject}>
              <a className={styles.chip} href={buildTrafficBoardHref(locale, { ...query, subject })} aria-current={query.subject === subject ? 'true' : undefined}>
                {subjectLabels[subject]} <span className={styles.chipCount}>{counts.get(subject) ?? 0}</span>
              </a>
            </li>
          ))}
        </ul>
        {showVideoFilter ? (
          <a className={`${styles.chip} ${styles.toggle}`} href={buildTrafficBoardHref(locale, { ...query, video: !query.video })} aria-current={query.video ? 'true' : undefined}>
            <span className={styles.check} aria-hidden="true">{query.video ? '✓' : ''}</span>{copy.videoOnly}
          </a>
        ) : null}
      </nav>

      <div className={styles.status}>
        <p className={styles.count} role="status">{copy.resultCount(results.length, items.length, filtered)}</p>
        {filtered ? <a href={clearHref} data-traffic-board-clear className={styles.clear}>{copy.clear}</a> : null}
      </div>

      {results.length ? (
        <ul className={styles.list}>
          {results.map((item) => (
            <li key={item.key} className={styles.row} data-traffic-board-row>
              <div className={styles.thumb} aria-hidden="true">
                {item.image ? (
                  <Image src={item.image} alt="" width={320} height={180} sizes="(max-width: 600px) 96px, 200px" loading="lazy" unoptimized={!item.image.startsWith('/')} />
                ) : null}
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}><a href={item.href}>{item.title}</a></h3>
                {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
                <p className={styles.meta}>
                  <span className={styles.subject}>{subjectLabels[item.subject]}</span>
                  {item.publicationDate ? <time dateTime={item.publicationDate}>{item.dateDisplay || item.publicationDate}</time> : null}
                  {item.readTime ? <span>{item.readTime}</span> : null}
                  {item.hasVideo ? <span className={styles.video} data-traffic-board-video><span aria-hidden="true">▶</span> {copy.video}</span> : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty} data-traffic-board-empty>
          <p>{copy.empty}</p>
          {filtered ? <a href={clearHref} className={styles.clear}>{copy.clear}</a> : null}
        </div>
      )}
    </div>
  );
}

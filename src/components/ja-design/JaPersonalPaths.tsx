import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { trafficHubCopy, TRAFFIC_PATH } from '@/data/traffic-hub';
import { COLUMN_TOPIC_LABELS, type ColumnTopic } from '@/lib/column-topics';
import styles from './JaHome.module.css';

/** Small structural heading for the individual-matters row (no new claim). */
export const JA_PERSONAL_PATHS_HEADING = '個人のご相談';

const TOPICS: readonly ColumnTopic[] = ['family', 'inheritance', 'visa', 'tax'];

/**
 * ja home (Opus 5.5 ja lane, 2026-10-01): the existing 日系企業 entry block is business-led, while
 * Japanese individuals most often come with criminal matters, traffic accidents, international
 * divorce, inheritance and residence questions. This row links only to existing pages, with
 * their existing labels: the criminal practice page, the traffic hub, and the ja column themes.
 */
export function getJaPersonalPaths(): { href: string; label: string }[] {
  const slugs = getServiceSlugs();
  const criminal = siteContent.ja.services.items[slugs.indexOf('criminal')];
  return [
    ...(criminal ? [{ href: '/ja/services/criminal', label: criminal.title }] : []),
    { href: `/ja${TRAFFIC_PATH}`, label: trafficHubCopy.ja.nav },
    ...TOPICS.map((topic) => ({ href: `/ja/columns?topic=${topic}`, label: COLUMN_TOPIC_LABELS.ja[topic] })),
  ];
}

export default function JaPersonalPaths() {
  const paths = getJaPersonalPaths();
  return (
    <section className={styles.personal} aria-labelledby="ja-personal-paths-heading" data-ja-personal-paths="true">
      <div className={`container ${styles.personalInner}`}>
        <h2 id="ja-personal-paths-heading" className={styles.personalHeading}>{JA_PERSONAL_PATHS_HEADING}</h2>
        <ul className={styles.personalList}>
          {paths.map((path) => (
            <li key={path.href}>
              <Link href={path.href} className={styles.personalLink}>
                {path.label}
                <span aria-hidden className={styles.personalArrow}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

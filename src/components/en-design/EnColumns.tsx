import type { ReactNode } from 'react';
import Link from 'next/link';
import { COLUMN_TOPIC_LABELS } from '@/lib/column-topics';
import EnPageShell, { EnBand, EnPaper } from './EnPageShell';
import EnLocalNav, { type EnLocalNavItem } from './EnLocalNav';
import { EN_COLUMN_TOPIC_ORDER, resolveEnSituations } from './en-design-data';
import { EnChevron } from './EnChevron';
import styles from './EnColumns.module.css';

/** Local nav: the existing topic names, pointing at the topic sections ColumnsGrid renders (`columns-topic-<key>`). */
const TOPIC_NAV: readonly EnLocalNavItem[] = EN_COLUMN_TOPIC_ORDER.map((key) => ({
  href: `#columns-topic-${key}` as const,
  label: COLUMN_TOPIC_LABELS.en[key],
}));

/**
 * en columns index (CONCEPT-V2 12.3, Clear Night): title card with the "Start here" list and the board tabs, the
 * clear-street band (B3), a local nav to the topic sections, then the ColumnsGrid on night as type-led cards (no
 * thumbnails). The band and the nav are placed after the title card and tabs by CSS order only; the shared page
 * body (header, tabs, grid, overseas links) is unchanged.
 */
export function EnColumnsShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="columns">
      <div className={styles.columns}>
        <div className={styles.bandSlot}><EnBand name="clear" /></div>
        <div className={styles.navSlot}><EnLocalNav title="" items={TOPIC_NAV} hideMissing /></div>
        {children}
      </div>
    </EnPageShell>
  );
}

/**
 * en "Taiwan Law in the News" board (12.3: legal pages and news board read on paper): the same blocks (header,
 * board tabs, ColumnsGrid) with the title card on black and the list on paper.
 */
export function EnIssuesShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="issues">
      <EnPaper className={`${styles.columns} ${styles.issues}`}>{children}</EnPaper>
    </EnPageShell>
  );
}

/**
 * Title-card list: one starting guide per reader situation (labels are the situation labels used across the
 * English pages; each link is an existing English column with its own title). Two columns from 768 px; phones get
 * the same list collapsed in a <details> so the board tabs and the topics stay near the top of the screen.
 */
export function EnColumnsStartHere({ posts }: { posts: readonly { slug: string; title: string }[] }) {
  const rows = resolveEnSituations(posts).filter((situation) => situation.guideLinks.length > 0);
  if (rows.length === 0) return null;
  const list = (
    <ol className={styles.startList}>
      {rows.map((situation) => (
        <li key={situation.id}>
          <span className={styles.startLabel}>{situation.label}</span>
          <Link href={situation.guideLinks[0].href}>
            {situation.guideLinks[0].title}
            <EnChevron />
          </Link>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <nav className={`${styles.start} ${styles.startDesktop}`} aria-label="Start here">
        <p className={styles.startTitle}>Start here</p>
        {list}
      </nav>
      <details className={`${styles.start} ${styles.startMobile}`}>
        <summary className={styles.startSummary}>
          Start here <span className={styles.startCount}>{rows.length} guides</span>
        </summary>
        <nav aria-label="Start here">{list}</nav>
      </details>
    </>
  );
}

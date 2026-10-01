import Link from 'next/link';
import { EN_SITUATIONS } from './en-design-data';
import styles from './EnPage.module.css';

/**
 * Situation → page table for English pages (services list, columns). Labels are short navigation
 * labels; each row links to the existing practice-area or topic page that covers it.
 */
export default function EnSituationTable({ id = 'situations', title = 'Living or working in Taiwan' }: { id?: string; title?: string }) {
  const headingId = `${id}-title`;
  return (
    <section className={styles.situations} id={id} aria-labelledby={headingId} data-en-situation-table>
      <div className="container">
        <div className={styles.situationsHead}>
          <p className={styles.eyebrow}>Start here</p>
          <h2 id={headingId} className={styles.title2}>{title}</h2>
        </div>
        <ol className={styles.situationTable}>
          {EN_SITUATIONS.map((situation) => (
            <li key={situation.id} className={styles.situationRow} data-en-situation={situation.id}>
              <h3 className={styles.situationLabel}>{situation.label}</h3>
              <ul className={styles.situationLinks}>
                <li><Link href={situation.href}>{situation.hrefLabel} <span aria-hidden>→</span></Link></li>
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

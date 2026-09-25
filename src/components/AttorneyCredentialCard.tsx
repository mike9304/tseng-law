import Link from 'next/link';
import {
  ATTORNEY_CREDENTIAL_SOURCE_URL,
  type AttorneyCredentialBlock,
} from '@/data/attorney-credentials';
import styles from './AttorneyCredentialCard.module.css';

type CredentialCardLink = {
  label: string;
  href: string;
};

/**
 * Visible credential card for the primary attorney. The same block is shown on
 * the Korean-speaking-lawyer landing and on the attorney profile so both pages
 * state identical, verifiable facts (see `src/data/attorney-credentials.ts`).
 */
export default function AttorneyCredentialCard({
  block,
  link,
  headingLevel = 2,
  id,
  className,
}: {
  block: AttorneyCredentialBlock;
  link?: CredentialCardLink;
  headingLevel?: 2 | 3;
  id?: string;
  className?: string;
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <section
      className={className ? `${styles.card} ${className}` : styles.card}
      id={id}
      aria-label={block.heading}
      data-attorney-credentials="true"
    >
      <Heading className={styles.heading}>{block.heading}</Heading>
      <dl className={styles.list}>
        {block.items.map((item) => (
          <div className={styles.row} key={item.label}>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.footer}>
        {link ? (
          <Link href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ) : null}
        <a
          href={ATTORNEY_CREDENTIAL_SOURCE_URL}
          className={styles.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          {block.sourceLabel}
        </a>
      </div>
    </section>
  );
}

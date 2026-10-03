import Link from 'next/link';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import styles from './JaHome.module.css';

/** Structural label: a second path for readers who want to read first (the firm's columns). */
export const JA_HERO_READ_LABEL = 'コラムを読む';

/**
 * ja home first screen, under the email action: a quiet text link to the columns for readers who want to read
 * first, then the shared trust facts unchanged.
 */
export default function JaHeroTrust() {
  return (
    <>
      <Link href="/ja/columns" className={styles.heroReadLink}>
        {JA_HERO_READ_LABEL}
        <span aria-hidden className={styles.heroReadArrow}>→</span>
      </Link>
      <HeroTrustStrip locale="ja" tone="light" />
    </>
  );
}

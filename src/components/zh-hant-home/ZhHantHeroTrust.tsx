import Link from 'next/link';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import styles from '../ZhHantDesign.module.css';

/**
 * zh-hant home first screen, under the email action: a second path for readers who want to read first
 * (the firm's columns), then the shared trust facts unchanged.
 */
export default function ZhHantHeroTrust() {
  return (
    <>
      <Link href="/zh-hant/columns" className={styles.heroReadLink}>
        閱讀法律專欄<span aria-hidden> ›</span>
      </Link>
      <HeroTrustStrip locale="zh-hant" tone="light" />
    </>
  );
}

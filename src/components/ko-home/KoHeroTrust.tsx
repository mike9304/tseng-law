import Link from 'next/link';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import styles from '../ZhHantDesign.module.css';

/**
 * ko home first screen, beside the email action: a second path for readers who want to read first
 * (hero.secondaryLinks label 「호정칼럼 보기」), then the shared trust facts unchanged.
 */
export default function KoHeroTrust() {
  return (
    <>
      <Link href="/ko/columns" className={styles.heroReadLink}>
        호정칼럼 보기<ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} className={styles.trail} />
      </Link>
      <HeroTrustStrip locale="ko" tone="light" />
    </>
  );
}

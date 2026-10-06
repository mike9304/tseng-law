'use client';

import { useEffect, useState } from 'react';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from '../ZhHantDesign.module.css';

/**
 * zh-hant home: a sticky consultation bar for narrow screens (CSS shows it only ≤767px).
 * The primary label is the locked hero CTA text 「申請電子郵件諮詢」.
 * It stays hidden while the first screen (#hero) is on screen — the hero already carries the same
 * action and its search chips sit along the bottom edge — and appears once the hero has scrolled
 * away. An IntersectionObserver drives it, so it works with reduced motion and in browsers without
 * scroll-driven animations (post-deploy check 2026-10-01: the bar covered the chips there).
 */
export default function ZhHantMobileCta() {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.querySelector('#zh-hant-home #hero');
    if (!hero || typeof IntersectionObserver === 'undefined') {
      setHeroVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={styles.mobileCta}
      aria-label="快速聯絡"
      data-hero-visible={heroVisible ? 'true' : 'false'}
      inert={heroVisible ? true : undefined}
    >
      <a className={styles.mobileCtaPrimary} href={getConsultationPublicMailto('zh-hant')}>申請電子郵件諮詢</a>
      <a className={styles.mobileCtaSecondary} href="#practice">服務領域</a>
    </nav>
  );
}

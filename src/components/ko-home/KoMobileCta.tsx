'use client';

import { useEffect, useState } from 'react';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from './KoHome.module.css';

/**
 * ko home, phones: a consultation bar at the foot of the screen (CSS shows it only ≤767px). It stays out of the way
 * while the first screen (#hero) is visible — the hero carries the same action — and appears once it has scrolled
 * away (IntersectionObserver, so it also works with reduced motion). Labels: the hero CTA and the header's 업무분야.
 */
export default function KoMobileCta() {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.querySelector('#ko-home #hero');
    if (!hero || typeof IntersectionObserver === 'undefined') {
      setHeroVisible(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(Boolean(entry?.isIntersecting)), { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={styles.mobileCta}
      aria-label="빠른 연락"
      data-hero-visible={heroVisible ? 'true' : 'false'}
      inert={heroVisible ? true : undefined}
    >
      <a className={styles.mobileCtaPrimary} href={getConsultationPublicMailto('ko')}>이메일 상담 신청</a>
      <a className={styles.mobileCtaSecondary} href="#practice">업무분야</a>
    </nav>
  );
}

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
const MOBILE_CTA_COPY = {
  'zh-hant': { root: 'zh-hant-home', label: '快速聯絡', primary: '申請電子郵件諮詢', secondary: '服務領域' },
  // ko home (2026-10-06): the hero CTA label and the header's 업무분야.
  ko: { root: 'ko-home', label: '빠른 연락', primary: '이메일 상담 신청', secondary: '업무분야' },
} as const;

export default function ZhHantMobileCta({ locale = 'zh-hant' }: { locale?: 'zh-hant' | 'ko' } = {}) {
  const copy = MOBILE_CTA_COPY[locale];
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.querySelector(`#${copy.root} #hero`);
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
  }, [copy.root]);

  return (
    <nav
      className={styles.mobileCta}
      aria-label={copy.label}
      data-hero-visible={heroVisible ? 'true' : 'false'}
      inert={heroVisible ? true : undefined}
    >
      <a className={styles.mobileCtaPrimary} href={getConsultationPublicMailto(locale)}>{copy.primary}</a>
      <a className={styles.mobileCtaSecondary} href="#practice">{copy.secondary}</a>
    </nav>
  );
}
